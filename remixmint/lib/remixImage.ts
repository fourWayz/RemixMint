export async function remixImage(base64Img: string) {
    const response = await fetch("https://api.stability.ai/v1/generation/stable-diffusion-v1-5/image-to-image", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STABILITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        init_image: base64Img,
        prompt: "make it into a viral meme",
        strength: 0.7,
      }),
    });
    const result = await response.json();
    return result.artifacts[0].base64;
  }
  