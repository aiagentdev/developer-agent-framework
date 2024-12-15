import { config } from "./config";
import { GitHub } from "./github";
import { TwitterIntegration } from "./integrations";
import { getIdea, getWebsite } from "./engines";
import { projects, storage } from "./storage";

const twitter = new TwitterIntegration();
await twitter.login(config.twitter.username, config.twitter.password);

export type Project = {
	name: string;
	description: string;
};

export const savedProjects: Array<Project> =
	(await storage.loadJSON("projects.json")) || [];

export const saveProject = async (project: Project): Promise<void> => {
	savedProjects.push(project);
	await storage.storeJSON("projects.json", savedProjects);
};

const github = new GitHub(
	config.github.token,
	config.github.repo,
	config.github.owner
);

const createWebsite = async (): Promise<void> => {
	const idea = await getIdea();

	if (!idea) {
		return;
	}

	const website = await getWebsite(idea);
	console.log(`generated ${website?.name}`);
	if (!website) {
		return;
	}

	const websiteFolder = projects.create(website.name);
	await websiteFolder.created;

	await github.commit(`Create ${website.name}`, [
		{
			path: "data/projects.json",
			content: JSON.stringify(savedProjects),
		},
		...website.files.map(({ name, content }) => ({
			content,
			path: `projects/${website.name}/${name}`,
		})),
	]);

	await saveProject({ name: website.name, description: website.description });
	await Promise.all(
		website.files.map((file) =>
			websiteFolder.store(file.name, file.content)
		)
	);

	const sentTweet = await twitter.send(
		`Just created https://${config.github.owner}.github.io/${config.github.repo}/projects/${website.name}`
	);

	if (!sentTweet) {
		console.log(`Failed sending tweet for ${website.name}`);
	}
};

setInterval(createWebsite, 1000 * 60 * 30);
