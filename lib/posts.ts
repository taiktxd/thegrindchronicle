import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content', 'posts');

export interface PostMetaData {
  title?: string;
  summary?: string;
  date?: string;
  category?: string;
  author?: string;
  coverImage?: string;
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

      // Chuẩn hóa: Nếu dữ liệu bị bọc trong object `metadata` thì bóc tách ra
      const meta = (data.metadata || data) as PostMetaData;

      return {
        slug,
        title: (meta.title as string) || '',
        // Đọc 'excerpt' từ MDX, nếu không có thì thử đọc 'summary'
        summary: (meta.excerpt as string) || (meta.summary as string) || '',
        date: (meta.date as string) || '',
        category: (meta.category as string) || 'General',
        author: (meta.author as string) || 'The Grind Chronicle',
        // Đọc 'image' từ MDX, nếu không có thì thử đọc 'coverImage'
        coverImage: (meta.image as string) || (meta.coverImage as string) || '',
        tags: (meta.tags as string[]) || [],
      };
    });

  // Sắp xếp bài viết mới nhất lên đầu
  return allPostsData.sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return a.date < b.date ? 1 : -1;
  });
}

// 2. Lấy thông tin chi tiết 1 bài viết theo slug
export function getPostBySlug(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const meta = (data.metadata || data) as PostMetaData;

  return {
    slug,
    content,
    ...meta,
  };
}