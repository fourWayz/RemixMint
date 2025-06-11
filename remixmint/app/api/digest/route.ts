import { InferenceClient } from '@huggingface/inference';
import { NextRequest, NextResponse } from 'next/server';
import { getCoinsTopVolume24h } from '@zoralabs/coins-sdk';

const hf = new InferenceClient(process.env.HUGGINGFACE_API_TOKEN);

export async function GET() {
  try {
    const res = await getCoinsTopVolume24h({ count: 10 });

    const topCoins = res.data?.exploreList?.edges
      ?.map(e => e.node)
      ?.filter(node => node?.name && node?.symbol && node?.volume24h);

    const input = topCoins?.map((coin, i) => {
      return `${i + 1}. ${coin.name} ($${coin.symbol}) — Volume: $${coin.volume24h}, Holders: ${coin.uniqueHolders}, Market Cap: $${coin.marketCap}`;
    }).join('\n');

    const prompt = `
Here is a list of trending crypto coins and their 24h stats:

${input}

Write a short 2-paragraph summary of key trends and interesting coins.
`;

    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2', // or another instruct model
      inputs: prompt,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.7,
      },
    });

    return NextResponse.json({
      summary: response.generated_text,
      coins: topCoins,
    });
  } catch (err) {
    console.error('Error generating digest:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
