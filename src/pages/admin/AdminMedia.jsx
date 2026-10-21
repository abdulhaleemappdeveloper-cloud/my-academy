import ModulePage from '@/components/common/ModulePage';
import StatusBadge from '@/components/common/StatusBadge';

/** Central media library: uploads, metadata, usage references and visibility. */
export default function AdminMedia() {
  return (
    <ModulePage
      title="Media library"
      description="Images, documents and approved video used across the website and learning material. Usage is tracked so a file that a published page depends on cannot be deleted silently."
      breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'Media library' }]}
      collection="media"
      searchKeys={['name', 'folder', 'uploadedBy', 'usedIn', 'tags']}
      searchPlaceholder="Search media by name, folder or usage…"
      filters={[
        { key: 'type', label: 'Type', options: ['Image', 'PDF', 'Video', 'Document'] },
        { key: 'folder', label: 'Folder', options: ['Campus', 'Academics', 'Finance', 'Events', 'Brand'] },
        { key: 'visibility', label: 'Visibility', options: ['Public', 'Private'] },
      ]}
      columns={[
        { key: 'name', label: 'File', render: (row) => <span className="font-medium">{row.name}</span> },
        { key: 'type', label: 'Type', render: (row) => <StatusBadge value={row.type} tone="neutral" /> },
        { key: 'size', label: 'Size', align: 'right' },
        { key: 'folder', label: 'Folder' },
        { key: 'usedIn', label: 'Used in' },
        { key: 'altText', label: 'Alt text', render: (row) => <span className="text-xs text-muted-foreground">{row.altText || 'Missing — required for accessibility'}</span> },
        { key: 'visibility', label: 'Visibility', render: (row) => <StatusBadge value={row.visibility} /> },
        { key: 'uploadedBy', label: 'Uploaded by' },
        { key: 'uploadedOn', label: 'Uploaded' },
      ]}
      createFields={[
        { key: 'name', label: 'File name', required: true },
        { key: 'type', label: 'Type', type: 'select', options: ['Image', 'PDF', 'Video', 'Document'] },
        { key: 'folder', label: 'Folder', type: 'select', options: ['Campus', 'Academics', 'Finance', 'Events', 'Brand'] },
        { key: 'altText', label: 'Alternative text', wide: true },
        { key: 'visibility', label: 'Visibility', type: 'select', options: ['Public', 'Private'] },
      ]}
      createLabel="Add media record"
      detailFields={['type', 'size', 'folder', 'usedIn', 'altText', 'visibility', 'uploadedBy', 'uploadedOn']}
      bulkStatus={{ key: 'visibility', options: ['Public', 'Private'] }}
      footerNote="Files are validated on the server: type, size and safe file names are checked, not just the extension"
    />
  );
}