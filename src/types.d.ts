declare module "tough-cookie" {
	// biome-ignore lint/complexity/noStaticOnlyClass:
	export class Cookie {
		static fromJSON(json: string): Cookie;
	}
}
