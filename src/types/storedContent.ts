export interface StoredContent {
  sourceId: string;
  contentId: string;
  title: string;
  coverImage: string;
  tags: StoredTag[];
  popularity: number;
}

export interface StoredTag {
  label: string;
  id: string;
  adult: boolean;
}

export interface Highlight extends StoredContent {
  pct: number;
}

export interface Collection {
  results: Highlight[];
  page: number;
  isLastPage: boolean;
}
