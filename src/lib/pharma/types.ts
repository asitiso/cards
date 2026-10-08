export type PharmaKind = "entry" | "sale" | "new";

export type PharmaEvent = {
  id: string;
  companyId: string;
  title: string;
  summary: string;
  kind: PharmaKind;
  conditions: string[];
  startDate: string;
  endDate: string;
  url: string;
};

export type PharmaCompanyReport = {
  id: string;
  name: string;
  short: string;
  loginUrl: string;
  count: number;
  ok: boolean;
  saved: boolean;
  username: string;
  message: string;
};

export type PharmaBoard = {
  collectedAt: string;
  today: string;
  events: PharmaEvent[];
  companies: PharmaCompanyReport[];
};

export type PharmaBrowserLogin = {
  action: string;
  method: "get" | "post";
  charset: string;
  userField: string;
  passField: string;
  fields: { name: string; value: string }[];
};

export const PHARMA_KIND_LABEL: Record<PharmaKind, string> = {
  entry: "응모",
  sale: "할인",
  new: "신제품",
};
