export async function getRepository(accessToken: string) {
    if (!accessToken) {
        console.log('Access-token is required');
    }
  
    const response = await fetch('https://api.github.com/user/repos', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
        },
    });
  
    return await response.json();
}

export async function createRepository(accessToken: string, repoName: string) {
    const response = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
        Authorization: `token ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: repoName,
            private: true,
        }),
    });

    if (!response.ok) {
        throw new Error('リポジトリ作成失敗したで...');
    }

    return await response.json();
}

export async function commitFile(
    accessToken: string,
    owner: string,
    repo: string,
    filePath: string,
    content: string,
    message: string
) {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
    method: 'PUT',
    headers: {
        Authorization: `token ${accessToken}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        message,
        content: Buffer.from(content).toString('base64'), // Base64エンコードが必要
    }),
    });

    if (!response.ok) {
    throw new Error('ファイルのコミット失敗したで...');
    }

    return await response.json();
}  