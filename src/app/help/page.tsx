import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help — footnotes.at",
  description: "How to use footnotes.at",
};

export default function HelpPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <header className="mb-12">
        <Link
          href="/"
          className="font-ui text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
        >
          ← footnotes.at
        </Link>
        <h1 className="font-medium mt-6 mb-3">Help</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          How to use footnotes.at
        </p>
      </header>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-12">
        {/* What is footnotes.at */}
        <section>
          <h2 className="font-medium text-lg mb-4">What is footnotes.at?</h2>
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
            footnotes.at is a quiet place for short writing. No likes. No
            followers. No algorithms. Just words that accumulate over time.
          </p>
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Anyone can publish small, self-contained pieces of writing called
            footnotes. You can also save footnotes to your personal collection.
            Everything is public. The writing flows slowly, newest first.
          </p>
        </section>

        {/* Getting Started */}
        <section>
          <h2 className="font-medium text-lg mb-4">Getting Started</h2>
          <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <p>
              <strong className="text-neutral-900 dark:text-neutral-100">
                1. Create an account
              </strong>
              <br />
              Go to{" "}
              <Link href="/login" className="underline hover:text-neutral-900 dark:hover:text-neutral-100">
                /login
              </Link>{" "}
              and click the &quot;Sign up&quot; tab. Choose a handle (your URL will be
              /@yourhandle), enter your email, and create a password.
            </p>
            <p>
              <strong className="text-neutral-900 dark:text-neutral-100">
                2. Write your first footnote
              </strong>
              <br />
              Once logged in, click &quot;Write a footnote&quot; from the homepage or go
              to /@yourhandle/write. Write in markdown, add tags with #hashtags,
              and publish when ready.
            </p>
            <p>
              <strong className="text-neutral-900 dark:text-neutral-100">
                3. Manage your footnotes
              </strong>
              <br />
              Visit /@yourhandle/footnotes to see all your drafts and published
              footnotes. Click any footnote to edit it.
            </p>
          </div>
        </section>

        {/* Writing */}
        <section>
          <h2 className="font-medium text-lg mb-4">Writing</h2>
          <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <p>
              <strong className="text-neutral-900 dark:text-neutral-100">
                Markdown
              </strong>
              <br />
              Footnotes are written in markdown. You can use headings, bold,
              italic, links, lists, blockquotes, and code blocks. The preview
              shows how your footnote will look.
            </p>
            <p>
              <strong className="text-neutral-900 dark:text-neutral-100">
                Tags
              </strong>
              <br />
              Add tags by writing #tagname anywhere in your footnote body. Tags
              are extracted automatically and shown below each footnote. Readers
              can filter your footnotes by tag.
            </p>
            <p>
              <strong className="text-neutral-900 dark:text-neutral-100">
                Drafts & Publishing
              </strong>
              <br />
              Footnotes start as drafts. Only you can see drafts. When you
              publish, the footnote becomes public and subscribers are notified
              by email. You can unpublish a footnote to return it to draft
              status.
            </p>
          </div>
        </section>

        {/* Dog-ears */}
        <section>
          <h2 className="font-medium text-lg mb-4">Dog-ears</h2>
          <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <p>
              Dog-ears let you save footnotes to your private collection. There
              are two ways to dog-ear:
            </p>
            <p>
              <strong className="text-neutral-900 dark:text-neutral-100">
                1. Click the icon
              </strong>
              <br />
              Click the earmark icon next to any footnote to save it. The icon
              fills in to show it&apos;s been saved.
            </p>
            <p>
              <strong className="text-neutral-900 dark:text-neutral-100">
                2. Select text first
              </strong>
              <br />
              On a footnote page, select a passage that resonates with you. A
              &quot;Dog-ear&quot; button appears. Click it to save the footnote with that
              passage highlighted. Next time you visit, you&apos;ll see your selected
              text underlined.
            </p>
            <p>
              Dog-ears are private. Only you can see what you&apos;ve saved and which
              passages you&apos;ve highlighted.
            </p>
          </div>
        </section>

        {/* Subscriptions */}
        <section>
          <h2 className="font-medium text-lg mb-4">Subscriptions</h2>
          <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <p>
              <strong className="text-neutral-900 dark:text-neutral-100">
                Subscribe to an author
              </strong>
              <br />
              At the bottom of any author&apos;s page, enter your email to subscribe.
              You&apos;ll receive a confirmation email. Click the link to confirm.
              After that, you&apos;ll get an email whenever that author publishes a
              new footnote.
            </p>
            <p>
              <strong className="text-neutral-900 dark:text-neutral-100">
                Unsubscribe
              </strong>
              <br />
              Every email includes an unsubscribe link. One click and you&apos;re
              removed immediately.
            </p>
          </div>
        </section>

        {/* Your Profile */}
        <section>
          <h2 className="font-medium text-lg mb-4">Your Profile</h2>
          <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <p>
              Your public page is at /@yourhandle. It shows your display name,
              bio, and all your published footnotes.
            </p>
            <p>
              <strong className="text-neutral-900 dark:text-neutral-100">
                Change password
              </strong>
              <br />
              Go to{" "}
              <Link href="/login" className="underline hover:text-neutral-900 dark:hover:text-neutral-100">
                /login
              </Link>{" "}
              and click the &quot;Change password&quot; tab. Enter your email and current
              password, then your new password.
            </p>
          </div>
        </section>

        {/* Formatting Reference */}
        <section>
          <h2 className="font-medium text-lg mb-4">Markdown Reference</h2>
          <div className="font-ui text-sm bg-neutral-50 dark:bg-neutral-900 rounded-lg p-6 space-y-3">
            <div>
              <code># Heading</code>
            </div>
            <div>
              <code>**bold** and *italic*</code>
            </div>
            <div>
              <code>[link text](https://example.com)</code>
            </div>
            <div>
              <code>&gt; blockquote</code>
            </div>
            <div>
              <code>- list item</code>
            </div>
            <div>
              <code>1. numbered item</code>
            </div>
            <div>
              <code>`inline code`</code>
            </div>
            <div>
              <code>```code block```</code>
            </div>
            <div>
              <code>#tag (creates a tag)</code>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <h2 className="font-medium text-lg mb-4">Questions?</h2>
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
            If you have questions or feedback, email{" "}
            <a
              href="mailto:hello@footnotes.at"
              className="underline hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              hello@footnotes.at
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
