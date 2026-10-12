export type IpoItem = {
  id: string;
  name: string;
  market: string;
  subscriptionStart: string;
  subscriptionEnd: string;
  offerPrice: number | null;
  /** Only an indicative price band, never use as the confirmed issue price. */
  indicativePriceRange?: string;
  refundDate: string;
  listingDate: string;
  brokers: string[];
  minimumShares: number | null;
  depositPercent: number | null;
  sourceUrl: string;
  sourceLabel: string;
};

export type IpoBoard = {
  today: string;
  collectedAt: string;
  status: "ok" | "empty" | "unavailable";
  sourceUrl: string;
  message: string;
  items: IpoItem[];
};
