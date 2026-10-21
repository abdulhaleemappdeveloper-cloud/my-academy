import { useMemo, useState } from 'react';
import {
  ArrowLeft, ArrowDown, ArrowUp, Copy, Eye, EyeOff, History, Plus, Save, Send, Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import BlockRenderer from '@/components/site/BlockRenderer';
import { useToast } from '@/components/ui/use-toast';
import { insert, logAction, patch, useCollection } from '@/data/store';
import { useSession } from '@/lib/session';
import { BLOCKS } from '@/data/blocks';

/**
 * Visual page builder.
 * Editors compose a page from the block library, reorder or hide sections, edit the
 * content of each block, set search metadata, preview the result and publish it.
 * Page content is completely separate from the application's own screens.
 */
export default function AdminBuilder() {
  const pages = useCollection('pages');
  const media = useCollection('media');
  const { account } = useSession();
  const { toast } = useToast();

  const [pageId, setPageId] = useState(pages[0]?.id);
  const [draft, setDraft] = useState(null);
  const [activeBlock, setActiveBlock] = useState(null);
  const [category, setCategory] = useState('structure');
  const [preview, setPreview] = useState(false);

  const page = pages.find((p) => p.id === pageId) || pages[0];
  const working = draft || page;

  const content = useMemo(() => working?.content || defaultContent(working?.title), [working]);

  const startDraft = () => {
    if (!page) return;
    setDraft({ ...page, content: page.content || defaultContent(page.title) });
    toast({ title: 'Editing started', description: 'Changes stay in the draft until you save them.' });
  };

  const updateContent = (next) => setDraft({ ...(draft || { ...page, content }), content: next });

  const addBlock = (type) => {
    const definition = BLOCKS.find((b) => b.id === type);
    if (!definition) return;
    const block = {
      id: `${type}-${Date.now().toString(36)}`,
      type,
      visible: true,
      props: { ...definition.defaults },
    };
    updateContent([...content, block]);
    setActiveBlock(block.id);
    setPreview(false);
  };

  const move = (index, direction) => {
    const next = [...content];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    updateContent(next);
  };

  const duplicate = (index) => {
    const next = [...content];
    next.splice(index + 1, 0, { ...content[index], id: `${content[index].type}-${Date.now().toString(36)}` });
    updateContent(next);
  };

  const removeBlock = (index) => updateContent(content.filter((_, i) => i !== index));
  const toggleVisible = (index) => updateContent(content.map((block, i) => (i === index ? { ...block, visible: !block.visible } : block)));

  const setProp = (index, key, value) =>
    updateContent(content.map((block, i) => (i === index ? { ...block, props: { ...block.props, [key]: value } } : block)));

  const duplicateSlug = (slug, id) => pages.some((p) => p.id !== id && p.slug === slug);

  const save = (status) => {
    if (!working) return;
    if (!working.title?.trim()) {
      toast({ title: 'A page title is required', description: 'Add a title before saving.', variant: 'destructive' });
      return;
    }
    if (!working.slug?.trim() || !working.slug.startsWith('/')) {
      toast({ title: 'Check the slug', description: 'A URL slug must begin with “/”.', variant: 'destructive' });
      return;
    }
    if (duplicateSlug(working.slug, working.id)) {
      toast({ title: 'That slug is already used', description: 'Each page needs its own URL.', variant: 'destructive' });
      return;
    }
    patch('pages', working.id, {
      title: working.title,
      slug: working.slug,
      type: working.type,
      status,
      seoTitle: working.seoTitle,
      metaDescription: working.metaDescription,
      sections: content.length,
      content,
      updated: new Date().toISOString().slice(0, 10),
      updatedBy: account?.name,
    });
    logAction({
      actor: account?.name,
      role: account?.label,
      action: status === 'Published' ? 'Published website page' : 'Saved website page draft',
      module: 'Website',
      target: working.title,
      reason: `${content.length} sections`,
    });
    toast({
      title: status === 'Published' ? 'Page published' : 'Draft saved',
      description:
        status === 'Published'
          ? 'The page is live on the public website. The revision was added to the page history.'
          : 'Your changes are saved as a draft and are not publicly visible.',
    });
    setDraft(null);
  };

  const createPage = () => {
    const record = insert('pages', {
      title: 'New page',
      slug: `/page-${Math.floor(Math.random() * 900 + 100)}`,
      type: 'Content page',
      status: 'Draft',
      updated: new Date().toISOString().slice(0, 10),
      updatedBy: account?.name,
      sections: 2,
      seoTitle: '',
      metaDescription: '',
      views: 0,
      content: defaultContent('New page'),
    });
    setPageId(record.id);
    setDraft({ ...record });
    toast({ title: 'Page created', description: 'Add sections from the block library, then save or publish.' });
  };

  if (!page) {
    return (
      <div>
        <PageHeader title="Page builder" description="No pages exist yet." breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'Page builder' }]} />
        <button type="button" onClick={createPage} className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-primary-foreground">
          <Plus className="h-4 w-4" /> Create the first page
        </button>
      </div>
    );
  }

  return (
    <div>
      <Link to="/admin/pages" className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-3.5 w-3.5" /> Website pages
      </Link>

      <div className="mt-4">
        <PageHeader
          title="Visual page builder"
          description="Compose pages from reusable blocks. Changes only affect website content — authentication, fees, results and other application screens are untouched."
          breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'Page builder' }]}
          actions={
            <>
              <select
                value={pageId}
                onChange={(event) => { setPageId(event.target.value); setDraft(null); }}
                aria-label="Choose a page to edit"
                className="h-10 rounded-xl border border-input bg-background px-3 text-sm outline-none"
              >
                {pages.map((item) => (
                  <option key={item.id} value={item.id}>{item.title}</option>
                ))}
              </select>
              <button type="button" onClick={createPage} className="inline-flex h-10 items-center gap-2 rounded-xl border border-input px-3.5 text-sm font-semibold text-foreground">
                <Plus className="h-4 w-4" /> New page
              </button>
              {!draft ? (
                <button type="button" onClick={startDraft} className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
                  Start editing
                </button>
              ) : (
                <>
                  <button type="button" onClick={() => setPreview((v) => !v)} className="inline-flex h-10 items-center gap-2 rounded-xl border border-input px-3.5 text-sm font-semibold text-foreground">
                    {preview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} {preview ? 'Back to editing' : 'Preview'}
                  </button>
                  <button type="button" onClick={() => save('Draft')} className="inline-flex h-10 items-center gap-2 rounded-xl border border-input px-3.5 text-sm font-semibold text-foreground">
                    <Save className="h-4 w-4" /> Save draft
                  </button>
                  <button type="button" onClick={() => save('Published')} className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
                    <Send className="h-4 w-4" /> Publish
                  </button>
                </>
              )}
            </>
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <h2 className="font-heading text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">Block library</h2>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Block category"
              className="mt-3 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none"
            >
              {[...new Set(BLOCKS.map((b) => b.category))].map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
            <ul className="ta-scroll mt-3 max-h-[420px] space-y-1.5 overflow-y-auto pr-1">
              {BLOCKS.filter((b) => b.category === category).map((definition) => (
                <li key={definition.id}>
                  <button
                    type="button"
                    onClick={() => addBlock(definition.id)}
                    disabled={!draft}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-left text-xs font-medium text-foreground transition-colors hover:border-primary/40 disabled:opacity-50"
                  >
                    <span className="flex items-center justify-between gap-2">
                      {definition.label}
                      <Plus className="h-3 w-3 text-primary" />
                    </span>
                    <span className="mt-0.5 block text-[10px] uppercase tracking-wider text-muted-foreground">{definition.shape}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] text-muted-foreground">
              {BLOCKS.length} block types in {new Set(BLOCKS.map((b) => b.category)).size} categories.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <h2 className="flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">
              <History className="h-3.5 w-3.5" /> Revisions
            </h2>
            <ul className="mt-3 space-y-2 text-xs">
              {[
                { label: 'Current draft', by: account?.name, when: 'Now' },
                { label: 'Previous published version', by: page.updatedBy, when: page.updated },
                { label: 'Earlier revision', by: 'Website editor', when: '2 weeks ago' },
              ].map((item) => (
                <li key={item.label} className="rounded-xl border border-border bg-background px-3 py-2">
                  <span className="block font-medium text-foreground">{item.label}</span>
                  <span className="block text-muted-foreground">{item.by} · {item.when}</span>
                </li>
              ))}
            </ul>
            <button type="button" className="mt-3 w-full rounded-xl border border-input px-3 py-2 text-xs font-semibold text-foreground">
              Restore a previous revision
            </button>
          </div>

          <div className="rounded-2xl border border-border bg-cream p-4">
            <h2 className="font-heading text-sm font-bold uppercase tracking-[0.12em] text-foreground">Media library</h2>
            <p className="mt-2 text-[11px] text-muted-foreground">
              {media.length} files available · {media.filter((m) => m.visibility === 'Public').length} public, the rest private.
            </p>
            <Link to="/admin/media" className="mt-2 inline-flex text-xs font-semibold text-primary hover:underline">
              Open the media library
            </Link>
          </div>
        </aside>

        <div className="space-y-4">
          {!draft && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
              <p className="text-xs text-amber-800 dark:text-amber-200">
                You are viewing the saved version. Choose <strong>Start editing</strong> to change sections, then save as a
                draft or publish.
              </p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-muted-foreground">
              Page title
              <input
                value={working?.title || ''}
                onChange={(event) => setDraft({ ...(draft || { ...page, content }), title: event.target.value })}
                disabled={!draft}
                className={`${inputClass} disabled:opacity-60`}
              />
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              URL slug
              <input
                value={working?.slug || ''}
                onChange={(event) => setDraft({ ...(draft || { ...page, content }), slug: event.target.value })}
                disabled={!draft}
                className={`${inputClass} font-mono disabled:opacity-60`}
              />
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              SEO title
              <input
                value={working?.seoTitle || ''}
                onChange={(event) => setDraft({ ...(draft || { ...page, content }), seoTitle: event.target.value })}
                disabled={!draft}
                className={`${inputClass} disabled:opacity-60`}
              />
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              Meta description
              <input
                value={working?.metaDescription || ''}
                onChange={(event) => setDraft({ ...(draft || { ...page, content }), metaDescription: event.target.value })}
                disabled={!draft}
                className={`${inputClass} disabled:opacity-60`}
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge value={working?.status} />
            <span className="text-xs text-muted-foreground">
              {content.length} sections · last edited by {working?.updatedBy} on {working?.updated}
            </span>
          </div>

          {preview ? (
            <section className="space-y-8 rounded-2xl border border-border bg-background p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Preview — unpublished content is not visible to the public
              </p>
              {content.filter((block) => block.visible !== false).map((block) => (
                <BlockRenderer key={block.id} block={block} />
              ))}
            </section>
          ) : (
            <section className="space-y-3">
              {content.map((block, index) => {
                const definition = BLOCKS.find((b) => b.id === block.type);
                const isActive = activeBlock === block.id;
                return (
                  <article key={block.id} className={`rounded-2xl border bg-card p-4 ${isActive ? 'border-primary/40' : 'border-border'}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveBlock(isActive ? null : block.id)}
                        className="text-left"
                      >
                        <span className="block text-sm font-semibold text-foreground">{definition?.label || block.type}</span>
                        <span className="block text-[11px] uppercase tracking-wider text-muted-foreground">
                          {definition?.category} · {index + 1} of {content.length}
                        </span>
                      </button>
                      <div className="flex items-center gap-1.5">
                        {block.visible === false && <StatusBadge value="Hidden" tone="neutral" />}
                        <button type="button" onClick={() => move(index, -1)} disabled={!draft || index === 0} aria-label="Move up" className={iconButton}>
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button type="button" onClick={() => move(index, 1)} disabled={!draft || index === content.length - 1} aria-label="Move down" className={iconButton}>
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button type="button" onClick={() => duplicate(index)} disabled={!draft} aria-label="Duplicate section" className={iconButton}>
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button type="button" onClick={() => toggleVisible(index)} disabled={!draft} aria-label="Hide or restore section" className={iconButton}>
                          {block.visible === false ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                        </button>
                        <button type="button" onClick={() => removeBlock(index)} disabled={!draft} aria-label="Remove section" className={`${iconButton} text-rose-600`}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {isActive && (
                      <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
                        {(definition?.fields || []).map((field) => (
                          <label key={field.key} className={`block text-xs font-semibold text-muted-foreground ${field.type === 'textarea' ? 'sm:col-span-2' : ''}`}>
                            {field.label}
                            {field.type === 'textarea' ? (
                              <textarea
                                rows={3}
                                value={block.props?.[field.key] ?? ''}
                                onChange={(event) => setProp(index, field.key, event.target.value)}
                                disabled={!draft}
                                className={`${textareaClass} disabled:opacity-60`}
                              />
                            ) : field.type === 'select' ? (
                              <select
                                value={block.props?.[field.key] ?? field.options[0]}
                                onChange={(event) => setProp(index, field.key, event.target.value)}
                                disabled={!draft}
                                className={`${inputClass} disabled:opacity-60`}
                              >
                                {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
                              </select>
                            ) : (
                              <input
                                value={block.props?.[field.key] ?? ''}
                                onChange={(event) => setProp(index, field.key, event.target.value)}
                                disabled={!draft}
                                className={`${inputClass} disabled:opacity-60`}
                              />
                            )}
                          </label>
                        ))}
                      </div>
                    )}

                    {isActive && (
                      <div className="mt-4 rounded-xl border border-border bg-background p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Rendered preview</p>
                        <div className="mt-3">
                          <BlockRenderer block={block} />
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}

              {content.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                  <p className="text-sm text-muted-foreground">
                    This page has no sections yet. Choose a block type from the library to start.
                  </p>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

/** A sensible starting layout when a page has no content yet. */
function defaultContent(title = 'Page') {
  return [
    { id: 'b-heading', type: 'heading', visible: true, props: { text: title, align: 'left' } },
    {
      id: 'b-text',
      type: 'rich-text',
      visible: true,
      props: { heading: 'About this section', text: 'Edit this text in the page builder to describe the page content.' },
    },
  ];
}

const inputClass = 'mt-1.5 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm font-normal text-foreground outline-none focus:border-primary/50';
const textareaClass = 'mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-normal text-foreground outline-none focus:border-primary/50';
const iconButton = 'grid h-8 w-8 place-items-center rounded-lg border border-input text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40';