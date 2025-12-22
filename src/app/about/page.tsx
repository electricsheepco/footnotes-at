import Link from "next/link";
import { Metadata } from "next";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "About — footnotes.at",
  description: "What footnotes.at is, who it is for, and how it works.",
};

export default async function AboutPage() {
  const session = await getSession();

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <header className="mb-12">
        <Link
          href="/"
          className="font-ui text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
        >
          ← footnotes.at
        </Link>
        <h1 className="font-medium mt-6">About</h1>
      </header>

      <div className="space-y-12">
        {/* What it is */}
        <section>
          <h2 className="font-medium text-lg mb-4">What footnotes.at is</h2>
          <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <p>
              footnotes.at is a website for publishing short pieces of writing.
              Each piece is called a footnote. Footnotes are public, permanent,
              and collected on author pages.
            </p>
            <p>
              There are no likes, comments, followers, or algorithmic feeds.
              Writing appears in chronological order. Readers can subscribe by
              email to receive new footnotes from authors they choose.
            </p>
            <p>
              Users can save footnotes to a private collection using a feature
              called dog-ears. Dog-ears are visible only to the person who
              created them.
            </p>
          </div>
        </section>

        {/* Who it is for */}
        <section>
          <h2 className="font-medium text-lg mb-4">Who it is for</h2>
          <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <p>
              footnotes.at is for people who want to write without performing.
              It is useful if you have occasional thoughts worth sharing but do
              not want to maintain a blog, build an audience, or optimize for
              engagement.
            </p>
            <p>
              It is also for readers who prefer to find writing by browsing
              rather than by following algorithms or social signals.
            </p>
          </div>
        </section>

        {/* How it differs */}
        <section>
          <h2 className="font-medium text-lg mb-4">
            How it differs from other platforms
          </h2>
          <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <p>
              <strong className="text-neutral-900 dark:text-neutral-100">
                Medium
              </strong>{" "}
              promotes content based on engagement metrics and paywalls.
              footnotes.at has no metrics, no paywall, and no recommendation
              algorithm.
            </p>
            <p>
              <strong className="text-neutral-900 dark:text-neutral-100">
                Substack
              </strong>{" "}
              is designed for newsletters with subscriber growth as the goal.
              footnotes.at supports email subscriptions but does not track
              subscriber counts or encourage list-building.
            </p>
            <p>
              <strong className="text-neutral-900 dark:text-neutral-100">
                Notion
              </strong>{" "}
              is a workspace tool that can publish pages. footnotes.at is
              purpose-built for short-form public writing with a consistent
              reading experience.
            </p>
            <p>
              <strong className="text-neutral-900 dark:text-neutral-100">
                Twitter/X
              </strong>{" "}
              prioritizes engagement and virality. footnotes.at has no retweets,
              no quote posts, no trending topics, and no notifications beyond
              email delivery.
            </p>
          </div>
        </section>

        {/* How to use it */}
        <section>
          <h2 className="font-medium text-lg mb-4">How to use it</h2>
          <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <p>
              <strong className="text-neutral-900 dark:text-neutral-100">
                Reading
              </strong>
              <br />
              The homepage shows recent footnotes from all authors. Click any
              footnote to read it in full. Click an author name to see all their
              footnotes. Use tags to filter by topic.
            </p>
            <p>
              <strong className="text-neutral-900 dark:text-neutral-100">
                Writing
              </strong>
              <br />
              Create an account and click &quot;Write a footnote.&quot; Write in
              markdown. Add tags by typing #tagname in the body. Save as draft
              or publish immediately. Edit anytime.
            </p>
            <p>
              <strong className="text-neutral-900 dark:text-neutral-100">
                Dog-ears
              </strong>
              <br />
              Click the earmark icon on any footnote to save it to your private
              collection. On a footnote page, you can select a specific passage
              before dog-earing. That passage will be underlined when you return
              to the page.
            </p>
            <p>
              <strong className="text-neutral-900 dark:text-neutral-100">
                Subscribing
              </strong>
              <br />
              Enter your email at the bottom of any author page. Confirm via the
              link sent to your inbox. You will receive an email when that
              author publishes something new.
            </p>
          </div>
        </section>

        {/* Write a footnote */}
        <section className="pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <Link
            href={session ? `/@${session.user.handle}/write` : "/login"}
            className="inline-block px-4 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors"
          >
            Write a footnote
          </Link>
        </section>
      </div>
    </main>
  );
}
