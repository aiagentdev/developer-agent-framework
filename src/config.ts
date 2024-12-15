import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
	OPENAI_API_KEY: z.string(),
	TWITTER_USERNAME: z.string(),
	TWITTER_PASSWORD: z.string(),
	GITHUB_TOKEN: z.string(),
	GITHUB_REPO: z.string(),
	GITHUB_OWNER: z.string(),
});

const env = envSchema.parse(process.env);

export const config = {
	openaiKey: env.OPENAI_API_KEY,
	twitter: {
		username: env.TWITTER_USERNAME,
		password: env.TWITTER_PASSWORD,
	},
	github: {
		token: env.GITHUB_TOKEN,
		repo: env.GITHUB_REPO,
		owner: env.GITHUB_OWNER,
	},
};
