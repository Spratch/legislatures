export type EventType = {
  begin: string;
  end: string;
  title: string;
  keyword: string;
  type?: "Cohabitation" | "Référendum" | "Lutte" | "Guerre" | "Loi" | string;
  source?: string[];
};
