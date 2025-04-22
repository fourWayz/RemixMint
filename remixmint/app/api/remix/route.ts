import { HfInference } from '@huggingface/inference';
import { NextRequest, NextResponse } from 'next/server';

const hf = new HfInference(process.env.HUGGINGFACE_API_TOKEN);

export async function POST(req: NextRequest) {
  try {
    let prompt: string;

    // Safely parse JSON
    try {
      const body = await req.json();
      prompt = body.prompt;
    } catch (err) {
      console.error('❌ Error parsing JSON body:', err);
      return NextResponse.json({ error: 'Invalid JSON request body' }, { status: 400 });
    }

    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    // Timeout handler
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.warn('⏰ Hugging Face generation timed out.');
    }, 60000); // 60 seconds

    // Generate image
    let art;
    try {
      art = await hf.textToImage({
        model: 'stabilityai/stable-diffusion-xl-base-1.0',
        inputs: `${prompt}, crypto coin artwork, vibrant, trending`,
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('❌ Error during Hugging Face call:', err);
      return NextResponse.json({ error: 'Image generation failed' }, { status: 502 });
    }

    clearTimeout(timeoutId);

    const buffer = Buffer.from(await art.arrayBuffer());
    const base64 = buffer.toString('base64');

    return NextResponse.json({
      image: `data:image/png;base64,${base64}`,
    });
  } catch (err) {
    console.error('❌ Top-level error:', err);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
