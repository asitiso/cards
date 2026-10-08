export type ChangeDomain = "finance" | "pharma";
export type ChangeAction = "added" | "updated" | "removed";

export type ChangeDraft = {
  eventId: string;
  title: string;
  action: ChangeAction;
  fields: string[];
};

export type ChangeRecord = ChangeDraft & {
  id: string;
  domain: ChangeDomain;
  sourceId: string;
  changedAt: string;
};
