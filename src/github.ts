import type { WebsiteCode } from "./engines";

export class GitHub {
	urls: {
		commits: string;
		repoTree: string;
		ref: string;
	};
	headers: Record<string, string>;

	constructor(token: string, repo: string, owner: string) {
		this.urls = {
			commits: `https://api.github.com/repos/${owner}/${repo}/git/commits`,
			repoTree: `https://api.github.com/repos/${owner}/${repo}/git/trees`,
			ref: `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/main`,
		};

		this.headers = {
			Accept: "application/vnd.github.v3+json",
			Authorization: `Bearer ${token}`,
		};
	}

	async commit(website: WebsiteCode) {
		const { urls, headers } = this;

		const {
			object: { sha: currentCommitSha },
		} = await fetch(urls.ref, { headers }).then((res) => res.json());

		const commitUrl = `${urls.commits}/${currentCommitSha}`;
		const {
			tree: { sha: treeSha },
		} = await fetch(commitUrl, { headers }).then((res) => res.json());

		const { sha: newTreeSha } = await fetch(urls.repoTree, {
			method: "POST",
			headers: {
				...this.headers,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				base_tree: treeSha,
				tree: website.files.map(({ content, name }) => ({
					path: `projects/${website.name}/${name}`,
					content,
					mode: "100644",
					type: "blob",
				})),
			}),
		}).then((res) => res.json());

		const { sha: newCommitSha } = await fetch(urls.commits, {
			method: "POST",
			headers: {
				...this.headers,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				message: `Create ${website.name}`,
				tree: newTreeSha,
				parents: [currentCommitSha],
			}),
		}).then((res) => res.json());

		await fetch(urls.ref, {
			method: "POST",
			headers: {
				...this.headers,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ sha: newCommitSha }),
		});
	}
}
