export interface ZoraCoin {
  node: {
    id: string;
    name: string;
    symbol: string;
    image?: string;
    createdAt: string;
    creatorAddress: string;
    marketCap?: number;
    txHash: string;
    contractAddress?: string;
  };
}

export interface ZoraCoinsResponse {
  data?: {
    exploreList?: {
      edges?: ZoraCoin[];
      pageInfo?: {
        endCursor?: string;
        hasNextPage: boolean;
      };
    };
  };
}