import { SearchType, SearchSort } from "@/enums/SearchEnums";

export interface SearchFilters {
  type?: SearchType;
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: SearchSort;
  onlyPremium?: boolean;
  channelId?: string;
}
