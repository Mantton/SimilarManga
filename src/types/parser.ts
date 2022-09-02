import { StoredContent } from "./storedContent";

export interface Parser {
  sourceId: string;
  getResults: (cb: (res: StoredContent[]) => Promise<void>) => void;
}
