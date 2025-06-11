import { getCoinsTopVolume24h } from "@zoralabs/coins-sdk";
import { NextResponse } from 'next/server';
import { ZoraCoinsResponse } from '../../../types/zora-coins';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get('cursor') || undefined;
  const count = Number(searchParams.get('count')) || 12;

  try {
    const response = await getCoinsTopVolume24h({
      count,
      after: cursor
    });

    const coins = response.data?.exploreList?.edges
      ?.map(edge => edge.node)
      ?.filter(node => node && node.name && node.symbol && node.creatorAddress)
      ?.map(node => ({
        id: node.id,
        name: node.name,
        symbol: node.symbol,
        minterAddress: node.creatorAddress,
        marketCap: node.marketCap,
        // image: node.image || '/default.png'
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