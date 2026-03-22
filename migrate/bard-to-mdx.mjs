/**
 * Bard → MDX migration script
 * Reads Statamic posts from ../content/collections/posts/*.md
 * Converts Bard JSON blocks to MDX and writes to ../astro/src/content/posts/
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join, basename } from 'path';

const POSTS_SRC = new URL('../../content/collections/posts', import.meta.url).pathname;
const POSTS_DEST = new URL('../src/content/posts', import.meta.url).pathname;

// ---- YAML frontmatter parser (minimal, handles the Statamic format) ----

function parseYamlFrontmatter(raw) {
  const lines = raw.split('\n');
  const result = {};
  let i = 0;
  let currentKey = null;
  let inArray = false;
  let inMultiline = false;
  let multilineKey = null;
  let multilineLines = [];
  let inContentBlock = false;

  while (i < lines.length) {
    const line = lines[i];

    // Detect start of content block (we handle it specially as raw YAML below)
    if (/^content:/.test(line)) {
      inContentBlock = true;
      result._contentRaw = [];
      i++;
      continue;
    }

    if (inContentBlock) {
      result._contentRaw.push(line);
      i++;
      continue;
    }

    // Multi-line scalar (|-)
    if (inMultiline) {
      if (/^  /.test(line) || line === '') {
        multilineLines.push(line.replace(/^  /, ''));
      } else {
        result[multilineKey] = multilineLines.join('\n').trimEnd();
        inMultiline = false;
        multilineKey = null;
        multilineLines = [];
        continue; // re-process this line
      }
      i++;
      continue;
    }

    // Array item
    if (inArray && /^  - /.test(line)) {
      const val = line.replace(/^  - /, '').trim();
      result[currentKey].push(unquote(val));
      i++;
      continue;
    } else if (inArray && !/^  /.test(line)) {
      inArray = false;
    }

    // Key: value
    const kvMatch = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*):\s*(.*)/);
    if (kvMatch) {
      const key = kvMatch[1];
      const val = kvMatch[2].trim();

      if (val === '' || val === '|-' || val === '|') {
        // Start of array or multiline
        if (lines[i + 1] && /^  - /.test(lines[i + 1])) {
          result[key] = [];
          currentKey = key;
          inArray = true;
        } else if (/^\|[0-9]*[-+]?$/.test(val)) {
          inMultiline = true;
          multilineKey = key;
          multilineLines = [];
        } else {
          result[key] = null;
        }
      } else {
        result[key] = unquote(val);
      }
    }

    i++;
  }

  if (inMultiline) {
    result[multilineKey] = multilineLines.join('\n').trimEnd();
  }

  return result;
}

function unquote(str) {
  if ((str.startsWith("'") && str.endsWith("'")) ||
      (str.startsWith('"') && str.endsWith('"'))) {
    return str.slice(1, -1);
  }
  return str;
}

// ---- Parse the content YAML block (array of Bard nodes) ----

function parseContentBlock(rawLines) {
  // Re-assemble and use a simple recursive descent YAML parser for Bard nodes
  // The content is a YAML array of objects with known structure
  const raw = rawLines.join('\n');
  return parseBardYaml(raw);
}

function parseBardYaml(text) {
  const lines = text.split('\n');
  const nodes = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (/^  -$/.test(line) || /^  -\s*$/.test(line)) {
      // Start of new top-level node
      const [node, nextI] = parseNode(lines, i + 1, 4);
      nodes.push(node);
      i = nextI;
    } else {
      i++;
    }
  }

  return nodes;
}

function parseNode(lines, startI, indent) {
  const node = {};
  let i = startI;
  const indentStr = ' '.repeat(indent);

  while (i < lines.length) {
    const line = lines[i];

    // End of this node (dedent or new sibling at parent level)
    if (line.trim() !== '' && !line.startsWith(indentStr)) {
      break;
    }

    if (line.trim() === '') { i++; continue; }

    const kvMatch = line.match(new RegExp(`^${indentStr}([a-zA-Z_][a-zA-Z0-9_]*):\\s*(.*)`));
    if (!kvMatch) { i++; continue; }

    const key = kvMatch[1];
    const val = kvMatch[2].trim();

    if (key === 'content' && val === '') {
      // Sub-array of nodes
      const [children, nextI] = parseChildNodes(lines, i + 1, indent + 2);
      node[key] = children;
      i = nextI;
      continue;
    }

    if (key === 'marks' && val === '') {
      const [marks, nextI] = parseChildNodes(lines, i + 1, indent + 2);
      node[key] = marks;
      i = nextI;
      continue;
    }

    if (key === 'attrs' && val === '') {
      const [attrs, nextI] = parseAttrsBlock(lines, i + 1, indent + 2);
      node[key] = attrs;
      i = nextI;
      continue;
    }

    if (key === 'values' && val === '') {
      const [values, nextI] = parseAttrsBlock(lines, i + 1, indent + 2);
      node[key] = values;
      i = nextI;
      continue;
    }

    // Multi-line text (|, |-, |2-, |2, etc.)
    if (/^\|[0-9]*[-+]?$/.test(val)) {
      const [text, nextI] = parseMultiline(lines, i + 1, indent + 2);
      node[key] = text;
      i = nextI;
      continue;
    }

    // Array
    if (val === '') {
      const [arr, nextI] = parseSimpleArray(lines, i + 1, indent + 2);
      node[key] = arr;
      i = nextI;
      continue;
    }

    node[key] = unquote(val);
    i++;
  }

  return [node, i];
}

function parseChildNodes(lines, startI, indent) {
  const nodes = [];
  let i = startI;
  const parentIndent = ' '.repeat(indent - 2);

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') { i++; continue; }

    // Check for new sibling "-" at current list indent
    const listItemMatch = line.match(new RegExp(`^${parentIndent}  -\\s*$`));
    if (listItemMatch || line.match(new RegExp(`^${parentIndent}  -\\s*$`))) {
      const [node, nextI] = parseNode(lines, i + 1, indent + 2);
      nodes.push(node);
      i = nextI;
      continue;
    }

    // Dedent means we're done
    if (!line.startsWith(' '.repeat(indent))) {
      break;
    }

    i++;
  }

  return [nodes, i];
}

// Simpler approach: parse child list items at exactly `indent` spaces + "- "
function parseChildNodesList(lines, startI, indent) {
  const nodes = [];
  let i = startI;
  const prefix = ' '.repeat(indent) + '-';

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '') { i++; continue; }
    if (line.startsWith(prefix)) {
      const [node, nextI] = parseNode(lines, i + 1, indent + 2);
      nodes.push(node);
      i = nextI;
    } else if (line.startsWith(' '.repeat(indent))) {
      i++;
    } else {
      break;
    }
  }
  return [nodes, i];
}

function parseAttrsBlock(lines, startI, indent) {
  const attrs = {};
  let i = startI;
  const indentStr = ' '.repeat(indent);

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '') { i++; continue; }
    // Stop if line is at shallower indentation than expected
    if (!line.startsWith(indentStr) || (line[indent] && line[indent] === ' ')) break;

    const kvMatch = line.match(new RegExp(`^${indentStr}([a-zA-Z_][a-zA-Z0-9_]*):\\s*(.*)`));
    if (kvMatch) {
      const key = kvMatch[1];
      const val = kvMatch[2].trim();
      if (val === '') {
        // Nested object block — recurse one level deeper
        const [nested, nextI] = parseAttrsBlock(lines, i + 1, indent + 2);
        attrs[key] = nested;
        i = nextI;
      } else if (/^\|[0-9]*[-+]?$/.test(val)) {
        const [text, nextI] = parseMultiline(lines, i + 1, indent + 2);
        attrs[key] = text;
        i = nextI;
      } else {
        attrs[key] = unquote(val);
        i++;
      }
    } else {
      i++;
    }
  }

  return [attrs, i];
}

function parseSimpleArray(lines, startI, indent) {
  const arr = [];
  let i = startI;
  const prefix = ' '.repeat(indent) + '- ';

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '') { i++; continue; }
    if (line.startsWith(prefix)) {
      arr.push(unquote(line.slice(prefix.length).trim()));
      i++;
    } else {
      break;
    }
  }

  return [arr, i];
}

function parseMultiline(lines, startI, minIndent) {
  const parts = [];
  let i = startI;
  let indent = null;

  while (i < lines.length) {
    const line = lines[i];
    if (line === '') {
      parts.push('');
      i++;
      continue;
    }
    // Auto-detect content indentation from the first non-empty line
    if (indent === null) {
      const spaces = line.match(/^( *)/)[1].length;
      if (spaces < minIndent) break; // dedented past our block
      indent = spaces;
    }
    if (line.startsWith(' '.repeat(indent))) {
      parts.push(line.slice(indent));
      i++;
    } else {
      break;
    }
  }

  return [parts.join('\n').trimEnd(), i];
}

// ---- Bard node → Markdown ----

function nodesToMd(nodes) {
  if (!nodes || !Array.isArray(nodes)) return '';

  const parts = [];
  for (const node of nodes) {
    const md = nodeToMd(node);
    if (md !== null) parts.push(md);
  }
  return parts.join('\n\n');
}

function nodeToMd(node) {
  if (!node || !node.type) return null;

  switch (node.type) {
    case 'paragraph': {
      if (!node.content || node.content.length === 0) return null;
      const text = inlineNodesToMd(node.content);
      if (!text.trim()) return null;
      return text;
    }

    case 'heading': {
      const level = node.attrs?.level || 2;
      const hashes = '#'.repeat(level);
      const text = inlineNodesToMd(node.content || []);
      return `${hashes} ${text}`;
    }

    case 'bulletList': {
      const items = (node.content || []).map((item) => {
        const text = nodesToMd(item.content || []).replace(/\n\n/g, ' ');
        return `- ${text}`;
      });
      return items.join('\n');
    }

    case 'orderedList': {
      const items = (node.content || []).map((item, idx) => {
        const text = nodesToMd(item.content || []).replace(/\n\n/g, ' ');
        return `${idx + 1}. ${text}`;
      });
      return items.join('\n');
    }

    case 'listItem': {
      return nodesToMd(node.content || []);
    }

    case 'codeBlock': {
      const langRaw = node.attrs?.language;
      const lang = (langRaw && langRaw !== 'null') ? langRaw : '';
      const code = node.content?.map((n) => n.text || '').join('') || '';
      return `\`\`\`${lang}\n${code}\n\`\`\``;
    }

    case 'blockquote': {
      const text = nodesToMd(node.content || []);
      return text.split('\n').map((l) => `> ${l}`).join('\n');
    }

    case 'set': {
      const values = node.attrs?.values || {};
      return setToMdx(values);
    }

    case 'horizontalRule':
      return '---';

    case 'hardBreak':
      return '  \n';

    default:
      return null;
  }
}

function setToMdx(values) {
  const type = values.type;

  if (type === 'image') {
    const src = values.image_source ? `/assets/${values.image_source}` : '';
    const width = values.width || '';
    const caption = values.caption || '';
    const captionAttr = caption ? ` caption="${escapeAttr(caption)}"` : '';
    return `<PostImage src="${src}" width="${width}"${captionAttr} />`;
  }

  if (type === 'youtube') {
    const url = values.url || '';
    return `<YouTube url="${url}" />`;
  }

  if (type === 'alert') {
    const content = values.content || '';
    return `<Alert>\n${content}\n</Alert>`;
  }

  return '';
}

function escapeAttr(str) {
  return str.replace(/"/g, '&quot;');
}

function inlineNodesToMd(nodes) {
  if (!nodes) return '';
  return nodes.map(inlineNodeToMd).join('');
}

function inlineNodeToMd(node) {
  if (!node) return '';

  if (node.type === 'hardBreak') return '  \n';

  if (node.type !== 'text') return '';

  let text = node.text || '';

  // Escape special MDX characters
  text = text.replace(/\{/g, '\\{').replace(/\}/g, '\\}');

  if (!node.marks || node.marks.length === 0) return text;

  // Don't apply marks to whitespace-only text (avoids ** ** artifacts)
  if (text.trim() === '') return text;

  // Apply marks
  let result = text;
  const markTypes = node.marks.map((m) => m.type);

  // link first (outermost)
  const linkMark = node.marks.find((m) => m.type === 'link');
  if (linkMark) {
    const href = linkMark.attrs?.href || '#';
    // Apply other marks to the text content
    let inner = text;
    if (markTypes.includes('bold')) inner = `**${inner}**`;
    if (markTypes.includes('italic')) inner = `_${inner}_`;
    if (markTypes.includes('code')) inner = `\`${text}\``; // no formatting inside code
    return `[${inner}](${href})`;
  }

  if (markTypes.includes('code')) return `\`${text}\``;
  if (markTypes.includes('bold') && markTypes.includes('italic')) return `**_${result}_**`;
  if (markTypes.includes('bold')) return `**${result}**`;
  if (markTypes.includes('italic')) return `_${result}_`;

  return result;
}

// ---- Extract date from filename ----

function extractDate(filename) {
  const match = filename.match(/^(\d{4}-\d{2}-\d{2})\./);
  return match ? match[1] : null;
}

function extractSlug(filename) {
  // Remove date prefix and .md extension
  return filename.replace(/^\d{4}-\d{2}-\d{2}\./, '').replace(/\.md$/, '');
}

// ---- Main ----

async function main() {
  const files = (await readdir(POSTS_SRC)).filter((f) => f.endsWith('.md'));
  console.log(`Found ${files.length} posts to migrate.`);

  let success = 0;
  let failed = 0;

  for (const file of files) {
    try {
      const srcPath = join(POSTS_SRC, file);
      const content = await readFile(srcPath, 'utf-8');

      // Split frontmatter
      const fmMatch = content.match(/^---\n([\s\S]*?)\n---\s*$/);
      if (!fmMatch) {
        console.warn(`  SKIP ${file} — no frontmatter`);
        continue;
      }

      const rawFm = fmMatch[1];
      const fm = parseYamlFrontmatter(rawFm);

      const pubDate = extractDate(file);
      const slug = extractSlug(file);

      // Convert unix timestamp to ISO date
      let updatedDate = null;
      if (fm.updated_at) {
        const ts = parseInt(fm.updated_at, 10);
        if (!isNaN(ts)) {
          updatedDate = new Date(ts * 1000).toISOString().split('T')[0];
        }
      }

      // Parse Bard content
      let mdxBody = '';
      if (fm._contentRaw && fm._contentRaw.length > 0) {
        const bardNodes = parseContentBlock(fm._contentRaw);
        mdxBody = nodesToMd(bardNodes);
      }

      // Build MDX frontmatter
      const fmLines = ['---'];
      fmLines.push(`title: ${JSON.stringify(fm.title || '')}`);
      if (fm.intro) fmLines.push(`intro: ${JSON.stringify(fm.intro)}`);
      if (fm.excerpt) fmLines.push(`description: ${JSON.stringify(fm.excerpt)}`);
      fmLines.push(`pubDate: ${pubDate}`);
      if (updatedDate) fmLines.push(`updatedDate: ${updatedDate}`);
      if (fm.thumbnail) fmLines.push(`thumbnail: ${JSON.stringify(fm.thumbnail)}`);
      if (fm.og_image) fmLines.push(`ogImage: ${JSON.stringify(fm.og_image)}`);

      // Tags
      if (fm.tags && Array.isArray(fm.tags) && fm.tags.length > 0) {
        fmLines.push('tags:');
        for (const tag of fm.tags) {
          fmLines.push(`  - ${JSON.stringify(tag)}`);
        }
      } else {
        fmLines.push('tags: []');
      }
      fmLines.push('---');

      // MDX component imports
      const imports = [
        `import PostImage from '../../components/mdx/PostImage.astro';`,
        `import YouTube from '../../components/mdx/YouTube.astro';`,
        `import Alert from '../../components/mdx/Alert.astro';`,
      ].join('\n');

      const mdxContent = `${fmLines.join('\n')}\n\n${imports}\n\n${mdxBody}\n`;

      const destPath = join(POSTS_DEST, `${slug}.mdx`);
      await writeFile(destPath, mdxContent, 'utf-8');
      success++;
      console.log(`  OK  ${slug}.mdx`);
    } catch (err) {
      console.error(`  ERR ${file}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone: ${success} succeeded, ${failed} failed.`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
