export async function getRepository(accessToken: string) {
    if (!accessToken) {
        console.log('Access-token is required');
    }
  
    const response = await fetch('https://api.github.com/user/repos?direction=dsc', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
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
    message: string,
    branch = "main"
) {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

    // 既存ファイルのSHAを取得
    let sha = null;
    try {
        const existingFileResponse = await fetch(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
            },
        });
        console.log(existingFileResponse)
        if (existingFileResponse.ok) {
            const existingFile = await existingFileResponse.json();
            sha = existingFile.sha;
        }
    } catch (error) {
        console.log("既存ファイルの取得に失敗:", error);
    }

    // ファイルを作成または更新
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({
            message,
            content: Buffer.from(content).toString('base64'), // Base64エンコード
            branch,
            ...(sha && { sha }), // SHAが存在する場合のみ追加
        }),
    });

    if (!response.ok) {
        throw new Error(`ファイルのコミット失敗: ${response.statusText}`);
    }

    return await response.json();
} 