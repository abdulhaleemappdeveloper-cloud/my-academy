/** Small formatting helpers shared by tables, drawers and detail views. */

export const pretty = (key = '') =>
  key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/^./, (c) => c.toUpperCase())
    .trim();

export const HIDDEN_FIELDS = ['id', 'created_date', 'updated_date', 'photo', 'summary', 'tags'];

export function formatValue(value) {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') return value.toLocaleString('en-PK');
  if (Array.isArray(value)) {
    if (value.length === 0) return '—';
    return value.map((item) => (typeof item === 'object' ? Object.values(item).join(' · ') : String(item))).join(', ');
  }
  if (typeof value === 'object') return Object.entries(value).map(([k, v]) => `${pretty(k)}: ${formatValue(v)}`).join(' · ');
  const text = String(value);
  if (/^\d{4}-\d{2}-\d{2}(T|$|\s)/.test(text)) return formatDate(text);
  return text;
}

export function formatDate(value) {
  if (!value || value === '—') return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatMoney(value) {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value !== 'number') return String(value);
  return `PKR ${value.toLocaleString('en-PK')}`;
}

/** Turns a record into label/value rows for detail views. */
export function toDetailRows(record, { only, exclude = HIDDEN_FIELDS } = {}) {
  const keys = only || Object.keys(record).filter((key) => !exclude.includes(key));
  return keys.map((key) => ({ key, label: pretty(key), value: formatValue(record[key]) }));
}