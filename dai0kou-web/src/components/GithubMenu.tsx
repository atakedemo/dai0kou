import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { accessToken } = req.body;
    if (!accessToken) {
      return res.status(400).json({ error: 'Access-token is required' });
    }

    const response = await fetch('https://api.github.com/user/repos', {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    const repos = await response.json();
    res.status(200).json(repos);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}