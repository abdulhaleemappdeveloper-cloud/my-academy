import { useEffect, useMemo, useState } from 'react';
import { DATASETS } from '@/data/records';

/**
 * Local data store.
 *
 * Holds every academy collection in memory, exposes read/write helpers and notifies
 * subscribed screens when records change. When the real backend is connected, only
 * this module changes: screens keep calling the same helpers.
 */

const state = {};
Object.entries(DATASETS).forEach(([key, rows]) => {
  state[key] = rows.map((row) => ({ ...row }));
});

const listeners = new Set();
const emit = () => listeners.forEach((fn) => fn());
const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

const nextId = (name) => `${name.slice(0, 3)}-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;

export const collectionNames = () => Object.keys(state);
export const all = (name) => state[name] || [];
export const find = (name, id) => all(name).find((row) => row.id === id);

export function insert(name, record) {
  const row = { id: record.id || nextId(name), created_date: new Date().toISOString(), ...record };
  state[name] = [row, ...all(name)];
  emit();
  return row;
}

export function patch(name, id, changes) {
  state[name] = all(name).map((row) => (row.id === id ? { ...row, ...changes, updated_date: new Date().toISOString() } : row));
  emit();
  return find(name, id);
}

export function remove(name, id) {
  state[name] = all(name).filter((row) => row.id !== id);
  emit();
}

export function bulkPatch(name, ids, changes) {
  const set = new Set(ids);
  state[name] = all(name).map((row) => (set.has(row.id) ? { ...row, ...changes, updated_date: new Date().toISOString() } : row));
  emit();
  return ids.length;
}

export function bulkRemove(name, ids) {
  const set = new Set(ids);
  const before = all(name).length;
  state[name] = all(name).filter((row) => !set.has(row.id));
  emit();
  return before - all(name).length;
}

/** Adds a traceable entry to the audit log whenever a screen changes a record. */
export function logAction({ actor = 'System', role = 'System', action, module, target, outcome = 'Success', reason = '—', before = '—', after = '—' }) {
  const row = {
    id: nextId('auditLogs'),
    actor,
    role,
    action,
    module,
    target: target || '—',
    time: new Date().toISOString().slice(0, 16).replace('T', ' '),
    outcome,
    reason,
    requestId: `req-${Date.now().toString().slice(-6)}`,
    before,
    after,
  };
  state.auditLogs = [row, ...all('auditLogs')];
  emit();
  return row;
}

/** Reactive read: re-renders the screen whenever the collection changes. */
export function useCollection(name) {
  const [, force] = useState(0);
  useEffect(() => subscribe(() => force((v) => v + 1)), []);
  return all(name);
}

export function useRecord(name, id) {
  const rows = useCollection(name);
  return useMemo(() => rows.find((row) => row.id === id), [rows, id]);
}

/* ------------------------------------------------------------------ exports */

const csvCell = (value) => {
  const text = value === null || value === undefined ? '' : String(value);
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
};

export function toCSV(rows, columns) {
  const head = columns.map((c) => csvCell(c.label)).join(',');
  const body = rows.map((row) => columns.map((c) => csvCell(row[c.key])).join(',')).join('\n');
  return `${head}\n${body}`;
}

export function downloadCSV(filename, rows, columns) {
  const blob = new Blob([toCSV(rows, columns)], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}