import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Markdown } from "@/components/Markdown";
import { TagList } from "@/components/TagList";
import { DogEarWrapper } from "@/components/DogEarWrapper";
import { formatDate, getFirstLine, getExcerpt } from "@/lib/formatting";
import { FootnoteStatus } from "@prisma/client";

const SITE_URL = "https://footnotes.at";
const OG_IMAGE = `${SITE_URL}/og/footnotes-default.png`;

interface FootnotePageProps {
  params: Promise<{ handle: string; slug: string }>;
}

export async function generateMetadata({ params }: FootnotePageProps): Promise<Metadata> {
  const { handle, slug } = await params;

  const author = await db.user.findUnique({
    where: { handle },
    select: { id: true, displayName: true },
  });

  if (!author) return { title: "Not Found" };

  const footnote = await db.footnote.findUnique({
    where: {
      authorId_slug: { authorId: author.id, slug },
    },
    select: { title: true, body: true, status: true },
  });

  if (!footnote) return { title: "Not Found" };

  // Allow unlisted footnotes to be viewed by direct link
  if (footnote.status === FootnoteStatus.DRAFT) {
    return { title: "Not Found" };
  }

  const footnoteTitle = footnote.title || "Untitled";
  const pageTitle = `${footnoteTitle} — ${author.displayName}`;
  const ogTitle = `${pageTitle} — footnotes.at`;
  const description = getExcerpt(footnote.body, 160);
  const canonicalUrl = `${SITE_URL}/@${handle}/${slug}`;

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      siteName: "footnotes.at",
      title: ogTitle,
      description,
      url: canonicalUrl,
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "footnotes.at",
        },
      ],
    },
    twitter: {
      card: "summary",
      title: ogTitle,
      description,
      images: [OG_IMAGE],
    },
  };
}

export default async function FootnotePage({ params }: FootnotePageProps) {
  const { handle, slug } = await params;

  const session = await getSession();

  const author = await db.user.findUnique({
    where: { handle },
    select: { id: true, handle: true, displayName: true },
  });

  if (!author) {
    notFound();
  }

  const footnote = await db.footnote.findUnique({
    where: {
      authorId_slug: { authorId: author.id, slug },
    },
    include: {
      tags: {
        include: { tag: true },
      },
    },
  });

  // 404 if not found or if draft
  if (!footnote || footnote.status === FootnoteStatus.DRAFT) {
    notFound();
  }

  // Get dog-ear status for current user
  let dogEar = null;
  if (session) {
    dogEar = await db.dogEar.findUnique({
      where: {
        userId_footnoteId: {
          userId: session.user.id,
          footnoteId: footnote.id,
        },
      },
      select: { selectedText: true },
    });
  }

  // Build JSON-LD structured data
  const headline = footnote.title || getFirstLine(footnote.body);
  const canonicalUrl = `${SITE_URL}/@${author.handle}/${footnote.slug}`;
  const authorUrl = `${SITE_URL}/@${author.handle}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    image: [OG_IMAGE],
    author: {
      "@type": "Person",
      name: author.displayName,
      url: authorUrl,
    },
    datePublished: footnote.publishedAt?.toISOString() || footnote.createdAt.toISOString(),
    dateModified: footnote.updatedAt.toISOString(),
    url: canonicalUrl,
    publisher: {
      "@type": "Organization",
      name: "footnotes.at",
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="max-w-2xl mx-auto px-6 py-16">
        <header className="mb-8">
          <Link
            href={`/@${author.handle}`}
            className="font-ui hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
          >
            ← {author.displayName}
          </Link>
        </header>

        <article>
        {footnote.title && <h1 className="mb-4">{footnote.title}</h1>}

        <DogEarWrapper
          footnoteId={footnote.id}
          initialDogEar={dogEar}
          isLoggedIn={!!session}
          header={
            <div className="flex items-center gap-4 font-ui">
              {footnote.publishedAt && (
                <time dateTime={footnote.publishedAt.toISOString()}>
                  {formatDate(footnote.publishedAt)}
                </time>
              )}
              <TagList tags={footnote.tags} authorHandle={author.handle} />
            </div>
          }
        >
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <Markdown content={footnote.body} />
          </div>
        </DogEarWrapper>
      </article>

      <footer className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800">
        <Link
          href={`/@${author.handle}`}
          className="font-ui hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          More from {author.displayName} →
        </Link>
      </footer>
      </main>
    </>
  );
}
