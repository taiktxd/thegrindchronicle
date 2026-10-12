import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content', 'posts');

export interface Section {
  type: 'text' | 'image';
  content?: string;
  src?: string;
  caption?: string;
}

export interface PostMetaData {
  title?: string;
  summary?: string;
  excerpt?: string;
  date?: string;
  category?: string;
  author?: string;
  coverImage?: string;
  image?: string;
  tags?: string[];
  [key: string]: unknown;
}

export interface Post {
  slug: string;
  title: string;
  summary: string;
  date: string;
  category: string;
  author: string;
  coverImage: string;
  tags: string[];
  content?: string;
  sections?: Section[];
}

// Hàm phân tách nội dung MDX thành mảng sections
function parseMdxToSections(rawContent: string): Section[] {
  const sections: Section[] = [];
  if (!rawContent) return sections;

  // Regex bắt cú pháp ảnh markdown và caption in nghiêng ngay bên dưới:
  // ![alt](src)
  // *caption*
  const imageRegex = /!\[(.*?)\]\((.*?)\)(?:\s*\r?\n\s*[*_](.*?)[*_])?/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = imageRegex.exec(rawContent)) !== null) {
    // 1. Lấy phần text nằm trước ảnh
    const textBefore = rawContent.slice(lastIndex, match.index).trim();
    if (textBefore) {
      const paragraphs = textBefore
        .split(/\r?\n\r?\n+/)
        .map((p) => p.trim())
        .filter((p) => p && p !== '---' && p !== '***');

      for (const para of paragraphs) {
        sections.push({
          type: 'text',
          content: para.replace(/^#{1,6}\s+/, ''), // Bỏ tiền tố heading ### nếu có
        });
      }
    }

    // 2. Lấy phần ảnh và caption đi kèm
    const altText = match[1]?.trim() || '';
    const src = match[2]?.trim() || '';
    const caption = match[3]?.trim() || altText;

    sections.push({
      type: 'image',
      src,
      caption,
    });

    lastIndex = imageRegex.lastIndex;
  }

  // 3. Lấy phần text còn lại sau ảnh cuối cùng
  const textAfter = rawContent.slice(lastIndex).trim();
  if (textAfter) {
    const paragraphs = textAfter
      .split(/\r?\n\r?\n+/)
      .map((p) => p.trim())
      .filter((p) => p && p !== '---' && p !== '***');

    for (const para of paragraphs) {
      sections.push({
        type: 'text',
        content: para.replace(/^#{1,6}\s+/, ''),
      });
    }
  }

  return sections;
}

// 1. Lấy tất cả bài viết và chuẩn hóa thuộc tính phẳng
export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);

  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      const { data } = matter(fileContents);
      const meta = (data.metadata || data) as PostMetaData;

      return {
        slug,
        title: (meta.title as string) || '',
        summary: (meta.excerpt as string) || (meta.summary as string) || '',
        date: (meta.date as string) || '',
        category: (meta.category as string) || 'General',
        author: (meta.author as string) || 'The Grind Chronicle',
        coverImage: (meta.image as string) || (meta.coverImage as string) || '',
        tags: (meta.tags as string[]) || [],
      };
    });

  return allPostsData.sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return a.date < b.date ? 1 : -1;
  });
}

// 2. Lấy thông tin chi tiết 1 bài viết theo slug và phân tách sections
export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const meta = (data.metadata || data) as PostMetaData;

  const sections = parseMdxToSections(content);

  return {
    slug,
    ...meta,
    title: (meta.title as string) || '',
    summary: (meta.excerpt as string) || (meta.summary as string) || '',
    date: (meta.date as string) || '',
    category: (meta.category as string) || 'General',
    author: (meta.author as string) || 'The Grind Chronicle',
    coverImage: (meta.image as string) || (meta.coverImage as string) || '',
    tags: (meta.tags as string[]) || [],
    content,
    sections,
  };
}