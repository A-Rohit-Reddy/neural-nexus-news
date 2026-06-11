import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeArticle<T extends { publishedAt: string | Date }>(article: T): T {
  return {
    ...article,
    publishedAt: new Date(article.publishedAt),
  };
}

export function normalizeArticles<T extends { publishedAt: string | Date }[]>(articles: T): T {
  return articles.map((article) => normalizeArticle(article)) as T;
}
