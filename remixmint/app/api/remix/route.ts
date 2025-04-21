import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import fetch from 'node-fetch';

export const config = {
  api: { bodyParser: false },
};

const HUGGINGFACE_API_URL =
  'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const form = new formidable.IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    try {
      const file = files.file?.[0];
      if (!file || !fs.existsSync(file.filepath)) {
        return res.status(400).json({ error: 'File missing' });
      }

      const imageBuffer = fs.readFileSync(file.filepath);

      // 🔁 Send to Hugging Face
      const response = await fetch(HUGGINGFACE_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
          'Content-Type': 'application/octet-stream',
          'X-Wait-For-Model': 'true',
        },
        body: imageBuffer,
      });

      if (!response.ok) {
        const error = await response.text();
        return res.status(500).json({ error: `Hugging Face Error: ${error}` });
      }

      const imgBlob = await response.arrayBuffer();
      const base64 = Buffer.from(imgBlob).toString('base64');
      const mime = response.headers.get('content-type') || 'image/png';

      res.status(200).json({
        base64: `data:${mime};base64,${base64}`,
      });
    } catch (e) {
      console.error('Remix error', e);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
}
