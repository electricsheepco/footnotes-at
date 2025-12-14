import { PrismaClient, FootnoteStatus } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Get config from environment or use defaults
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "password123";
  const handle = process.env.ADMIN_HANDLE || "demo";
  const displayName = process.env.ADMIN_DISPLAY_NAME || "Demo Author";

  console.log(`Creating admin user: ${email} (@${handle})`);

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Create or update user
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      handle,
      displayName,
      passwordHash,
    },
    create: {
      email,
      handle,
      displayName,
      passwordHash,
      bio: "Writing short things on the internet.",
    },
  });

  console.log(`User created/updated: ${user.id}`);

  // Create sample tags
  const tags = await Promise.all(
    [
      { name: "notes", slug: "notes" },
      { name: "ideas", slug: "ideas" },
      { name: "code", slug: "code" },
    ].map((tag) =>
      prisma.tag.upsert({
        where: { slug: tag.slug },
        update: {},
        create: tag,
      })
    )
  );

  console.log(`Tags created: ${tags.map((t) => t.name).join(", ")}`);

  // Create sample footnotes
  const footnotes = [
    {
      title: "On writing short things",
      body: `There's something liberating about writing without a word count target. No need to pad, no need to trim. Just say what you mean and stop.

Most ideas don't need 2,000 words. They need 200. Maybe less.

This is a place for those thoughts—the ones that don't fit anywhere else but still deserve to exist somewhere.`,
      status: FootnoteStatus.PUBLISHED,
      tags: ["notes"],
    },
    {
      title: "The tools we choose",
      body: `Every tool shapes how we think. A text editor with autosave changes how you draft. A platform with likes changes what you write.

This is why I wanted something quieter. No metrics, no engagement loops. Just a place where words can accumulate without competing for attention.

The best tools disappear. You stop noticing them. They just work.`,
      status: FootnoteStatus.PUBLISHED,
      tags: ["ideas", "code"],
    },
    {
      title: null,
      body: `Sometimes the best title is no title at all. Not everything needs a headline.

This is one of those times.`,
      status: FootnoteStatus.PUBLISHED,
      tags: ["notes"],
    },
    {
      title: "Draft: upcoming thoughts",
      body: `This is a draft that won't appear publicly. It's still being worked on.

Maybe it'll get published someday. Maybe it won't.`,
      status: FootnoteStatus.DRAFT,
      tags: [],
    },
  ];

  for (let i = 0; i < footnotes.length; i++) {
    const f = footnotes[i];
    const slug =
      f.status === FootnoteStatus.PUBLISHED
        ? f.title
          ? f.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "")
          : `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}-${i}`
        : null;

    const footnote = await prisma.footnote.upsert({
      where: {
        authorId_slug: {
          authorId: user.id,
          slug: slug || `draft-${i}`,
        },
      },
      update: {
        title: f.title,
        body: f.body,
        status: f.status,
      },
      create: {
        authorId: user.id,
        title: f.title,
        body: f.body,
        status: f.status,
        slug,
        publishedAt:
          f.status === FootnoteStatus.PUBLISHED
            ? new Date(Date.now() - i * 24 * 60 * 60 * 1000) // Stagger by days
            : null,
      },
    });

    // Add tags
    if (f.tags.length > 0) {
      await prisma.footnoteTag.deleteMany({
        where: { footnoteId: footnote.id },
      });

      for (const tagName of f.tags) {
        const tag = tags.find((t) => t.name === tagName);
        if (tag) {
          await prisma.footnoteTag.create({
            data: {
              footnoteId: footnote.id,
              tagId: tag.id,
            },
          });
        }
      }
    }

    console.log(
      `Footnote created: "${f.title || "(untitled)"}" [${f.status}]`
    );
  }

  console.log("\nSeed complete!");
  console.log(`\nLogin at: http://localhost:4050/admin/login`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
