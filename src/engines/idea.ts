import { client } from "@/openaiClient";
import { storage } from "@/storage";

const savedConversations = await storage.loadJSON("conversations.json");
let conversations = [];

if (savedConversations) {
	conversations = savedConversations;
}

const userInput = "Generate one unique, creative website idea that can be built using HTML, CSS, and JavaScript. Focus on making the it highly engaging, interactive, and providing a strong 'wow' factor for users. Keep the idea practical to build but innovative in functionality and user experience. Feel free to incorporate libraries such as Three.js, animation libraries, and Anime.js to enhance interactivity and creativity. You will be instructing an LLM to make this idea, so give enough details for it to be able to do it";
const prompt = "You are an artist who creates art with javascript. You showcase your innovative and unique ideas through the browser and are master at all technologies related to web/javascript and push it to its limits to showcase your art.";

export const getIdea = async () => {
	const res = await client.chat.completions.create({
		messages: [
			{
				role: "system",
				content: prompt,
			},

			...conversations,
			{ role: "user", content: userInput },
		],
		model: "chatgpt-4o-latest",
		temperature: 1,
	});

	conversations.push(
		{
			role: "user",
			content: userInput,
		},
		{
			role: "assistant",
			content: res.choices[0].message.content,
		}
	);

	storage.storeJSON("conversations.json", conversations);

	return res.choices[0].message.content;
};
