import { storage } from "@/storage";
import { Cookie } from "tough-cookie";

class TwitterCookies {
	private _cookies: Record<string, Cookie[]> = {};

	async set(username: string, cookies: Cookie[]): Promise<void> {
		this._cookies[username] = cookies;
		await this._save();
	}

	get(username: string): Cookie[] | null {
		return this._cookies[username] || null;
	}

	async load(): Promise<void> {
		const data = await storage.load("cookies.json");
		if (!data) {
			return;
		}

		this._cookies = {};

		const obj = JSON.parse(data) as Record<string, string[]>;

		for (const key in obj) {
			const cookies = obj[key].map(Cookie.fromJSON);

			this._cookies[key] = cookies.filter((cookie) => !!cookie);
		}
	}

	private async _save(): Promise<void> {
		return storage.store("cookies.json", JSON.stringify(this._cookies));
	}
}

export const twitterCookies = new TwitterCookies();
await twitterCookies.load();
