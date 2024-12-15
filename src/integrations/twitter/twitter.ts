import { Integration } from "../integration";
import { Scraper } from "agent-twitter-client";
import { twitterCookies } from "./cookies";

export class TwitterIntegration extends Integration {
	private _scraper: Scraper;

	constructor() {
		super();

		this._scraper = new Scraper();
	}

	async login(username: string, password: string): Promise<void> {
		const scraper = this._scraper;

		if (await scraper.isLoggedIn()) {
			return;
		}

		const cookies = twitterCookies.get(username);
		if (!cookies) {
			await scraper.login(username, password);
			await twitterCookies.set(username, await scraper.getCookies());
			return;
		}

		await scraper.setCookies(cookies);
	}

	async send(text: string): Promise<boolean> {
		const res = await this._scraper.sendTweet(text);
		if (res.status === 200) {
			return true;
		}

		return false;
	}
}
