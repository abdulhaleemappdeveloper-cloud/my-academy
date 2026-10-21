import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, ExternalLink } from 'lucide-react';
import EmptyState from '@/components/common/EmptyState';
import { useCollection } from '@/data/store';
import BlockRenderer from '@/components/site/BlockRenderer';

/**
 * Renders a page created in the visual page builder.
 * Published pages are reachable at /p/<slug>; drafts show a banner explaining the
 * page is not publicly available yet.
 */
export default function PublicPage() {
  const { slug } = useParams();
  const pages = useCollection('pages');
  const page = pages.find((item) => String(item.slug).replace(/^\//, '') === slug);

  if (!page) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
        <EmptyState
          title="Page not found"
          description="This page may have been unpublished or renamed. Check the site navigation for the current list of pages."
          action={<Link to="/" className="text-sm font-semibold text-primary hover:underline">Back to home</Link>}
        />
      </div>
    );
  }

  const isPublic = page.status === 'Published';

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to home
      </Link>

      {!isPublic && (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
          <p className="flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-200">
            <ExternalLink className="h-3.5 w-3.5" /> Preview — this page is {page.status.toLowerCase()} and is not visible on the public website.
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="rounded-full bg-brand-tint px-2.5 py-0.5 font-semibold text-primary">{page.type}</span>
        <span>{page.sections} sections</span>
        <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" /> Updated {page.updated}</span>
      </div>

      <div className="mt-8 space-y-10">
        {(page.content?.length ? page.content : defaultSections(page)).map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </div>
    </div>
  );
}

/** Pages created before content was added show a structured placeholder. */
function defaultSections(page) {
  return [
    { id: 'fallback-heading', type: 'heading', props: { text: page.title, level: 'h1' } },
    {
      id: 'fallback-text',
      type: 'rich-text',
      props: { text: page.metaDescription || 'Content for this page is managed in the visual page builder.' },
    },
  ];
}