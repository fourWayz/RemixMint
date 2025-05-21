import { getCoinsNew } from "@zoralabs/coins-sdk";
import { NextResponse } from 'next/server';
import { ZoraCoinsResponse } from '../../../types/zora-coins';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get('cursor') || undefined;
  const count = Number(searchParams.get('count')) || 12;

  try {
    const response = await getCoinsNew({
      count,
      after: cursor
    });

    const coins = response.data?.exploreList?.edges?.map(edge => ({
      id: edge.node.id,
      name: edge.node.name,
      symbol: edge.node.symbol,
    //   image: edge.node.image || '/default-coin.png',
      minterAddress: edge.node.creatorAddress,
      marketCap: edge.node.marketCap
    })) || [];

    return NextResponse.json({
      coins,
      cursor: response.data?.exploreList?.pageInfo?.endCursor,
      hasMore: response.data?.exploreList?.pageInfo?.hasNextPage
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch recent coins' },
      { status: 500 }
    );
  }
}