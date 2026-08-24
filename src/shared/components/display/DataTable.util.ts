export type SummaryConfig = {
  summaryColKey: string;
  [key: string]: React.ReactNode;
};

export const isSummaryConfig = (value: unknown): value is SummaryConfig =>
  !!value && typeof value === "object" && "summaryColKey" in value;

