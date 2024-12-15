import { client } from "@/openaiClient";

export type WebsiteCode = {
	name: string;
	description: string;
	files: Array<{
		name: string;
		content: string;
	}>;
};

export const getWebsite = async (idea: string): Promise<WebsiteCode | null> => {
	const res = await client.chat.completions.create({
		messages: [
			{
				role: "system",
				content:
					"When the user gives you an idea for a website generate a readme and html/css/js code for it, respond only in json with the format { name: string; description: string; files: Array<{ name: string; content: string; }>; } with no codeblocks. Don't create nested folders. Always create a readme. Keep name in dash-case, use absolute pathing for links in the html files, /projects/{name}/",
			},

			{ role: "user", content: `Idea: ${idea}` },
		],
		model: "chatgpt-4o-latest",
		temperature: 1,
	});

	
	const json = res.choices[0].message.content;

	if (!json) {
		return null;
	}

	return JSON.parse(json);
};
