import { Content } from "@prisma/client";

export interface StoredContent {
  sourceId: string;
  contentId: string;
  title: string;
  coverImage: string;
  tags: SimpleTag[];
  popularity: number;
}

export interface Highlight extends StoredContent {
  pct: number;
}

export interface SimpleTag {
  label: string;
  id: string;
}

export interface ContentCollection {
  target: Content;
  results: Highlight[];
  page: number;
  isLastPage: boolean;
}
