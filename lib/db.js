import { cache } from 'react';
import { neon } from '@neondatabase/serverless';
import defaultContent from './defaultContent';
import seedPosts from './seedPosts';
import { slugify } from './markdown';

// Without DATABASE_URL (first local run, or before Postgres is connected) the
// site still renders using defaultContent + seed posts, read-only.
function getSql() {
  if (!process.env.DATABASE_URL) return null;
  return neon(process.env.DATABASE_URL);
}
export const hasDatabase = () => !!process.env.DATABASE_URL;

let schemaPromise = null;

export function ensureSchema() {
  const sql = getSql();
  if (!sql) return Promise.resolve();
  if (!schemaPromise) {
    schemaPromise = (async () => {
      await sql`CREATE TABLE IF NOT EXISTS site_content (
        id INT PRIMARY KEY DEFAULT 1,
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
      await sql`CREATE TABLE IF NOT EXISTS content_versions (
        id SERIAL PRIMARY KEY,
        data JSONB NOT NULL,
        note TEXT DEFAULT '',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
      await sql`CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name TEXT, email TEXT, phone TEXT, interest TEXT, message TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
      await sql`ALTER TABLE messages ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'new'`;
      await sql`ALTER TABLE messages ADD COLUMN IF NOT EXISTS source TEXT DEFAULT ''`;
      await sql`ALTER TABLE messages ADD COLUMN IF NOT EXISTS budget TEXT DEFAULT ''`;
      await sql`CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        excerpt TEXT DEFAULT '',
        body TEXT NOT NULL DEFAULT '',
        cover_url TEXT DEFAULT '',
        tags JSONB NOT NULL DEFAULT '[]',
        published BOOLEAN NOT NULL DEFAULT true,
        published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
      await sql`CREATE TABLE IF NOT EXISTS rate_limits (
        key TEXT PRIMARY KEY,
        count INT NOT NULL,
        reset_at TIMESTAMPTZ NOT NULL
      )`;
      await sql`CREATE TABLE IF NOT EXISTS app_meta (key TEXT PRIMARY KEY, value TEXT)`;

      const seeded = await sql`SELECT value FROM app_meta WHERE key = 'posts_seeded'`;
      if (!seeded.length) {
        for (const p of seedPosts) {
          await sql`INSERT INTO posts (slug, title, excerpt, body, tags, published_at)
            VALUES (${p.slug}, ${p.title}, ${p.excerpt}, ${p.body}, ${JSON.stringify(p.tags)}::jsonb, now() - make_interval(days => ${p.daysAgo}))
            ON CONFLICT (slug) DO NOTHING`;
        }
        await sql`INSERT INTO app_meta (key, value) VALUES ('posts_seeded', '1') ON CONFLICT (key) DO NOTHING`;
      }
    })().catch((err) => {
      schemaPromise = null; // retry on next request
      throw err;
    });
  }
  return schemaPromise;
}

/* ───────────────────────── Site content ───────────────────────── */

// Deep-merges saved content on top of defaults so new fields always exist and
// an accidentally emptied field falls back instead of leaving a hole in the page.
function mergeValue(def, saved) {
  if (Array.isArray(def)) return Array.isArray(saved) && saved.length ? saved : def;
  if (def && typeof def === 'object') {
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return def;
    const merged = {};
    for (const key of Object.keys(def)) merged[key] = mergeValue(def[key], saved[key]);
    for (const key of Object.keys(saved)) if (!(key in merged)) merged[key] = saved[key];
    return merged;
  }
  if (typeof def === 'string') {
    // Optional text fields (default '') may legitimately be cleared.
    if (def === '') return typeof saved === 'string' ? saved : def;
    return typeof saved === 'string' && saved.trim() ? saved : def;
  }
  return saved === undefined || saved === null ? def : saved;
}

export const getContent = cache(async function getContent() {
  const sql = getSql();
  if (!sql) return defaultContent;
  try {
    await ensureSchema();
    const rows = await sql`SELECT data FROM site_content WHERE id = 1`;
    return rows.length ? mergeValue(defaultContent, rows[0].data) : defaultContent;
  } catch (err) {
    console.error('getContent failed, using defaults:', err);
    return defaultContent;
  }
});

export async function saveContent(data, note = '') {
  const sql = getSql();
  if (!sql) throw new Error('DATABASE_URL is not configured yet.');
  await ensureSchema();
  const json = JSON.stringify(data);
  await sql`INSERT INTO site_content (id, data, updated_at) VALUES (1, ${json}::jsonb, now())
    ON CONFLICT (id) DO UPDATE SET data = ${json}::jsonb, updated_at = now()`;
  await sql`INSERT INTO content_versions (data, note) VALUES (${json}::jsonb, ${note})`;
  await sql`DELETE FROM content_versions WHERE id NOT IN (SELECT id FROM content_versions ORDER BY id DESC LIMIT 30)`;
}

export async function listVersions() {
  const sql = getSql();
  if (!sql) return [];
  await ensureSchema();
  return sql`SELECT id, note, created_at FROM content_versions ORDER BY id DESC LIMIT 30`;
}

export async function getVersion(id) {
  const sql = getSql();
  if (!sql) return null;
  await ensureSchema();
  const rows = await sql`SELECT data FROM content_versions WHERE id = ${id}`;
  return rows[0]?.data ?? null;
}

/* ───────────────────────── Messages / leads ───────────────────────── */

export async function saveMessage({ name, email, phone, interest, message, budget, source }) {
  const sql = getSql();
  if (!sql) throw new Error('DATABASE_URL is not configured yet.');
  await ensureSchema();
  const rows = await sql`INSERT INTO messages (name, email, phone, interest, message, budget, source)
    VALUES (${name}, ${email}, ${phone || ''}, ${interest || ''}, ${message}, ${budget || ''}, ${source || ''})
    RETURNING id`;
  return rows[0]?.id;
}

export async function getMessages(status) {
  const sql = getSql();
  if (!sql) return [];
  await ensureSchema();
  if (status && status !== 'all') {
    return sql`SELECT * FROM messages WHERE status = ${status} ORDER BY created_at DESC LIMIT 300`;
  }
  return sql`SELECT * FROM messages ORDER BY created_at DESC LIMIT 300`;
}

export async function setMessageStatus(id, status) {
  const sql = getSql();
  if (!sql) throw new Error('DATABASE_URL is not configured yet.');
  await ensureSchema();
  await sql`UPDATE messages SET status = ${status} WHERE id = ${id}`;
}

export async function deleteMessage(id) {
  const sql = getSql();
  if (!sql) throw new Error('DATABASE_URL is not configured yet.');
  await ensureSchema();
  await sql`DELETE FROM messages WHERE id = ${id}`;
}

export async function getStats() {
  const sql = getSql();
  if (!sql) return { configured: false, messages: 0, unread: 0, last7: 0, posts: 0, published: 0, versions: 0, byInterest: [], byDay: [] };
  await ensureSchema();
  const [m] = await sql`SELECT count(*)::int AS total,
      count(*) FILTER (WHERE status = 'new')::int AS unread,
      count(*) FILTER (WHERE created_at > now() - interval '7 days')::int AS last7 FROM messages`;
  const [p] = await sql`SELECT count(*)::int AS total, count(*) FILTER (WHERE published)::int AS published FROM posts`;
  const [v] = await sql`SELECT count(*)::int AS total FROM content_versions`;
  const byInterest = await sql`SELECT COALESCE(NULLIF(interest, ''), 'Unspecified') AS label, count(*)::int AS n
    FROM messages GROUP BY 1 ORDER BY n DESC LIMIT 6`;
  const byDay = await sql`SELECT to_char(d::date, 'Mon DD') AS label, count(m.id)::int AS n
    FROM generate_series(now() - interval '13 days', now(), interval '1 day') d
    LEFT JOIN messages m ON m.created_at::date = d::date GROUP BY d ORDER BY d`;
  return { configured: true, messages: m.total, unread: m.unread, last7: m.last7, posts: p.total, published: p.published, versions: v.total, byInterest, byDay };
}

/* ───────────────────────── Blog posts ───────────────────────── */

function memorySeedPosts() {
  return seedPosts.map((p, i) => ({
    id: -(i + 1),
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    body: p.body,
    cover_url: '',
    tags: p.tags,
    published: true,
    published_at: new Date(Date.now() - p.daysAgo * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

export async function getPosts({ includeDrafts = false } = {}) {
  const sql = getSql();
  if (!sql) return memorySeedPosts();
  try {
    await ensureSchema();
    return includeDrafts
      ? await sql`SELECT * FROM posts ORDER BY published_at DESC`
      : await sql`SELECT * FROM posts WHERE published = true AND published_at <= now() ORDER BY published_at DESC`;
  } catch (err) {
    console.error('getPosts failed:', err);
    return memorySeedPosts();
  }
}

export async function getPostBySlug(slug) {
  const sql = getSql();
  if (!sql) return memorySeedPosts().find((p) => p.slug === slug) || null;
  try {
    await ensureSchema();
    const rows = await sql`SELECT * FROM posts WHERE slug = ${slug} AND published = true AND published_at <= now()`;
    return rows[0] || null;
  } catch (err) {
    console.error('getPostBySlug failed:', err);
    return null;
  }
}

export async function savePost(post) {
  const sql = getSql();
  if (!sql) throw new Error('DATABASE_URL is not configured yet.');
  await ensureSchema();
  const title = String(post.title || '').trim();
  if (!title) throw new Error('Title is required');
  const slug = slugify(post.slug || title) || `post-${Date.now()}`;
  const tags = JSON.stringify((post.tags || []).map((t) => String(t).trim()).filter(Boolean).slice(0, 8));
  const publishedAt = post.published_at ? new Date(post.published_at).toISOString() : new Date().toISOString();
  if (post.id) {
    const rows = await sql`UPDATE posts SET slug = ${slug}, title = ${title}, excerpt = ${post.excerpt || ''}, body = ${post.body || ''},
      cover_url = ${post.cover_url || ''}, tags = ${tags}::jsonb, published = ${!!post.published},
      published_at = ${publishedAt}, updated_at = now() WHERE id = ${post.id} RETURNING *`;
    return rows[0];
  }
  const rows = await sql`INSERT INTO posts (slug, title, excerpt, body, cover_url, tags, published, published_at)
    VALUES (${slug}, ${title}, ${post.excerpt || ''}, ${post.body || ''}, ${post.cover_url || ''}, ${tags}::jsonb, ${!!post.published}, ${publishedAt})
    RETURNING *`;
  return rows[0];
}

export async function deletePost(id) {
  const sql = getSql();
  if (!sql) throw new Error('DATABASE_URL is not configured yet.');
  await ensureSchema();
  await sql`DELETE FROM posts WHERE id = ${id}`;
}

/* ───────────────────────── Rate limiting ───────────────────────── */

const memoryHits = new Map();

/** Fixed-window limiter. Uses Postgres when available (works across serverless instances). */
export async function rateLimit(key, limit, windowSec) {
  const sql = getSql();
  if (!sql) {
    const now = Date.now();
    const entry = memoryHits.get(key);
    if (!entry || entry.reset < now) {
      memoryHits.set(key, { count: 1, reset: now + windowSec * 1000 });
      return { ok: true, remaining: limit - 1, retryAfter: 0 };
    }
    entry.count++;
    return { ok: entry.count <= limit, remaining: Math.max(0, limit - entry.count), retryAfter: Math.ceil((entry.reset - now) / 1000) };
  }
  try {
    await ensureSchema();
    const rows = await sql`INSERT INTO rate_limits (key, count, reset_at)
      VALUES (${key}, 1, now() + make_interval(secs => ${windowSec}))
      ON CONFLICT (key) DO UPDATE SET
        count = CASE WHEN rate_limits.reset_at < now() THEN 1 ELSE rate_limits.count + 1 END,
        reset_at = CASE WHEN rate_limits.reset_at < now() THEN EXCLUDED.reset_at ELSE rate_limits.reset_at END
      RETURNING count, EXTRACT(EPOCH FROM (reset_at - now()))::int AS ttl`;
    const { count, ttl } = rows[0];
    return { ok: count <= limit, remaining: Math.max(0, limit - count), retryAfter: Math.max(0, ttl) };
  } catch (err) {
    console.error('rateLimit failed (allowing request):', err);
    return { ok: true, remaining: limit, retryAfter: 0 };
  }
}

export async function clearRateLimit(key) {
  const sql = getSql();
  memoryHits.delete(key);
  if (!sql) return;
  try { await sql`DELETE FROM rate_limits WHERE key = ${key}`; } catch { /* non-critical */ }
}
