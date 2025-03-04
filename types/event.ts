export type EventType = {
  begin: string;
  end: string;
  title: string;
  title_en?: string;
  title_de?: string;
  keyword: string;
  type?: "Cohabitation" | "Référendum" | "Lutte" | "Guerre" | "Loi" | string;
  source?: string[];
};
