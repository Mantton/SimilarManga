import { Tag } from "@prisma/client";
import { SimpleTag, StoredContent } from "./content";

export interface Parser {
  id: string;
  name: string;
  getTags: () => Promise<SimpleTag[]>;
  getResults: (tagId: string, page: number) => Promise<StoredContent[]>;
  getContent: (id: string) => Promise<StoredContent>;
}
