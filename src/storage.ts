import fs from "node:fs/promises";
import path from "node:path";

class Storage {
	base: string;
	created: Promise<void>;

	constructor(base: string) {
		this.base = base;
		this.created = this.createFolder();
	}

	create(folder: string): Storage {
		return new Storage(path.join(this.base, folder));
	}

	async store(file: string, data: string): Promise<void> {
		await fs.writeFile(path.join(this.base, file), data);
	}

	async load(file: string): Promise<string | null> {
		try {
			return await fs.readFile(path.join(this.base, file), "utf8");
		} catch {
			return null;
		}
	}

	async storeJSON(
		file: string,
		data: Record<string, any> | any[]
	): Promise<void> {
		await fs.writeFile(path.join(this.base, file), JSON.stringify(data));
	}

	async loadJSON<T = any>(file: string): Promise<T | null> {
		try {
			return JSON.parse(
				await fs.readFile(path.join(this.base, file), "utf8")
			) as T;
		} catch {
			return null;
		}
	}

	private async createFolder(): Promise<void> {
		try {
			await fs.mkdir(this.base);
		} catch {}
	}
}

const base = path.join(import.meta.dirname, "../");

export const storage = new Storage(path.join(base, "data"));
export const projects = new Storage(path.join(base, "projects"));
