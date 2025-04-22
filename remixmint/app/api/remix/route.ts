import { InferenceClient } from '@huggingface/inference';
import { NextRequest, NextResponse } from 'next/server';

const hf = new InferenceClient(process.env.HUGGINGFACE_API_TOKEN);

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    // Call Hugging Face API to generate image
    const art = await hf.textToImage({
      provider: "nebius",
      model: 'black-forest-labs/FLUX.1-dev',
      inputs: `A nice image of ${prompt}`,
    });

    console.log(art,'art')
    // Convert the image buffer to base64
    const buffer = Buffer.from(await art.arrayBuffer());
    const base64 = buffer.toString('base64');
    console.log('b64',base64)

    return NextResponse.json({
      image: `data:image/png;base64,${base64}`,
    });
  } catch (err) {
    console.error('Error generating image:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
