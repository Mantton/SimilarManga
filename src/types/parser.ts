import { Tag } from "@prisma/client";
import { SimpleTag, StoredContent } from "./storedContent";

export interface Parser {
  sourceId: string;
  getTags: () => Promise<SimpleTag[]>;
  getResults: (tagId: string, page: number) => Promise<StoredContent[]>;
}
