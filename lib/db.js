import { neon } from '@neondatabase/serverless';
import defaultContent from './defaultContent';

// If DATABASE_URL isn't set yet (e.g. the very first local build, before the
// Postgres integration is connected on Vercel), we fall back to the default
// content below instead of crashing. Once DATABASE_URL exists, everything
// reads from and writes to the real database.
function getSql() {
  if (!process.env.DATABASE_URL) return null;
  return neon(process.env.DATABASE_URL);
}

let schemaReady = false;

export async function ensureSchema() {
  const sql = getSql();
  if (!sql || schemaReady) return;
  await sql`
    CREATE TABLE IF NOT EXISTS site_content (
      id INT PRIMARY KEY DEFAULT 1,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      name TEXT,
      email TEXT,
      phone TEXT,
      interest TEXT,
      message TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;
  schemaReady = true;
}

// Deep-merges saved content on top of defaultContent, so that:
// 1. If we add new fields to defaultContent later, older saved rows don't lose them.
// 2. If any field (a whole array, a single heading, anything) ends up empty
//    from a bad save, we fall back to the default for just that field instead
//    of rendering a blank hole on the page. To intentionally remove a whole
//    section, use the Layout & Spacing visibility toggles — not by emptying text.
function mergeValue(defaultVal, savedVal) {
  if (Array.isArray(defaultVal)) {
    if (!Array.isArray(savedVal) || savedVal.length === 0) return defaultVal;
    return savedVal;
  }
  if (typeof defaultVal === 'object' && defaultVal !== null) {
    if (typeof savedVal !== 'object' || savedVal === null || Array.isArray(savedVal)) return defaultVal;
    const merged = {};
    for (const key of Object.keys(defaultVal)) {
      merged[key] = mergeValue(defaultVal[key], savedVal[key]);
    }
    // Keep any extra keys the admin might have saved that aren't in defaults.
    for (const key of Object.keys(savedVal)) {
      if (!(key in merged)) merged[key] = savedVal[key];
    }
    return merged;
  }
  if (typeof defaultVal === 'string') {
    if (typeof savedVal !== 'string' || savedVal.trim() === '') return defaultVal;
    return savedVal;
  }
  return savedVal === undefined || savedVal === null ? defaultVal : savedVal;
}

function mergeWithDefaults(saved) {
  if (!saved || typeof saved !== 'object') return defaultContent;
  return mergeValue(defaultContent, saved);
}

export async function getContent() {
  const sql = getSql();
  if (!sql) return defaultContent;
  try {
    await ensureSchema();
    const rows = await sql`SELECT data FROM site_content WHERE id = 1;`;
    if (!rows.length) return defaultContent;
    return mergeWithDefaults(rows[0].data);
  } catch (err) {
    console.error('getContent failed, falling back to defaults:', err);
    return defaultContent;
  }
}

export async function saveContent(data) {
  const sql = getSql();
  if (!sql) throw new Error('DATABASE_URL is not configured yet.');
  await ensureSchema();
  await sql`
    INSERT INTO site_content (id, data, updated_at)
    VALUES (1, ${JSON.stringify(data)}::jsonb, now())
    ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(data)}::jsonb, updated_at = now();
  `;
}

export async function saveMessage({ name, email, phone, interest, message }) {
  const sql = getSql();
  if (!sql) throw new Error('DATABASE_URL is not configured yet.');
  await ensureSchema();
  await sql`
    INSERT INTO messages (name, email, phone, interest, message)
    VALUES (${name}, ${email}, ${phone || ''}, ${interest || ''}, ${message});
  `;
}

export async function getMessages() {
  const sql = getSql();
  if (!sql) return [];
  await ensureSchema();
  return sql`SELECT * FROM messages ORDER BY created_at DESC LIMIT 200;`;
}
