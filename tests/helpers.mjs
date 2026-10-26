import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIST = join(import.meta.dirname, '..', 'dist');

export function readPage(rel = 'index.html') {
  return readFileSync(join(DIST, rel), 'utf8');
}

export function pageText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function readAssets(ext) {
  const dir = join(DIST, '_astro');
  let files = [];
  try {
    files = readdirSync(dir).filter((f) => f.endsWith(ext));
  } catch {
    return '';
  }
  return files.map((f) => readFileSync(join(dir, f), 'utf8')).join('\n');
}

export const readBuiltCss = () => readAssets('.css');
export const readBuiltJs = () => readAssets('.js');
