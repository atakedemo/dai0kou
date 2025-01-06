// pages/api/github.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token, repoOwner, repoName } = req.body;

  if (!token || !repoOwner || !repoName) {
    return res.status(400).json({ error: 'Information is invalid' });
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('GitHub API呼び出しに失敗したで');
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error communicating with Github:", error);
    res.status(500).json({ error: 'Interal Server Error' });
  }
}
