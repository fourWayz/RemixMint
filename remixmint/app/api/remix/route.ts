import { HfInference } from '@huggingface/inference';
import { NextRequest, NextResponse } from 'next/server';

const hf = new HfInference(process.env.HUGGINGFACE_API_TOKEN);

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    // Call Hugging Face API to generate image
    const art = await hf.textToImage({
      model: 'stabilityai/stable-diffusion-xl-base-1.0',
      inputs: `${prompt}, crypto coin artwork, vibrant, trending`,
    });

    // Convert the image buffer to base64
    const buffer = Buffer.from(await art.arrayBuffer());
    const base64 = buffer.toString('base64');

    return NextResponse.json({
      image: `data:image/png;base64,${base64}`,
    });
  } catch (err) {
    console.error('Error generating image:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
