import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

import formidable from 'formidable';
import fs from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const form = new formidable.IncomingForm({ keepExtensions: true });

  form.parse(req, async (_, fields, files) => {
    const file = files.file?.[0];

    if (!file || !fs.existsSync(file.filepath)) {
      return res.status(400).json({ error: 'File missing' });
    }

    const imageBuffer = fs.readFileSync(file.filepath);
    const base64 = imageBuffer.toString('base64');

    // 👉 Replace with actual AI remix API call
    const remixedBase64 = base64; // Placeholder: pretend it's remixed

    res.status(200).json({ base64: remixedBase64 });
  });
}
