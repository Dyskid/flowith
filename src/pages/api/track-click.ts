import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { promises as fs } from 'fs';

interface MallType {
  id: string;
  name: string;
  url: string;
  region: string;
  city?: string;
  tags?: string[];
  featured?: boolean;
  isNew?: boolean;
  clickCount?: number;
  lastVerified?: string;
  description?: string;
  statusPopular?: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { mallId } = req.body;

  if (!mallId) {
    return res.status(400).json({ message: 'Mall ID is required' });
  }

  try {
    const filePath = path.join(process.cwd(), 'data', 'malls.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const malls: MallType[] = JSON.parse(jsonData);

    const mallIndex = malls.findIndex(mall => String(mall.id) === String(mallId));

    if (mallIndex === -1) {
      return res.status(404).json({ message: 'Mall not found' });
    }

    malls[mallIndex].clickCount = (malls[mallIndex].clickCount || 0) + 1;

    await fs.writeFile(filePath, JSON.stringify(malls, null, 2));

    return res.status(200).json({ 
      message: 'Click tracked successfully',
      clickCount: malls[mallIndex].clickCount 
    });
  } catch (error) {
    console.error('Error tracking click:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}