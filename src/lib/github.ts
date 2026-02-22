import { cache } from 'react';

const GITHUB_USERNAME = 'saranshhalwai';

export interface GitHubData {
    bio: string | null;
    public_repos: number;
    followers: number;
    topRepos: Array<{
        name: string;
        description: string | null;
        language: string | null;
        stargazers_count: number;
        html_url: string;
    }>;
}

// Next.js recommended way to deduplicate fetch requests
export const getGitHubData = cache(async (): Promise<GitHubData | null> => {
    if (!process.env.GITHUB_TOKEN) {
        console.warn('GITHUB_TOKEN is not set in environment variables');
        return null;
    }

    const headers = {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
    };

    try {
        // 1. Fetch User Profile
        const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
            headers,
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!userRes.ok) throw new Error(`Failed to fetch user: ${userRes.statusText}`);
        const userData = await userRes.json();

        // 2. Fetch Top Repositories (sorted by updated, limit to 10)
        // We sort by updated to get the most relevant recent work
        const reposRes = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=10`,
            {
                headers,
                next: { revalidate: 3600 }, // Cache for 1 hour
            }
        );

        if (!reposRes.ok) throw new Error(`Failed to fetch repos: ${reposRes.statusText}`);
        const reposData = await reposRes.json();

        // Format the repos
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const topRepos = reposData.map((repo: any) => ({
            name: repo.name,
            description: repo.description,
            language: repo.language,
            stargazers_count: repo.stargazers_count,
            html_url: repo.html_url,
        }));

        return {
            bio: userData.bio,
            public_repos: userData.public_repos,
            followers: userData.followers,
            topRepos,
        };
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        return null;
    }
});
