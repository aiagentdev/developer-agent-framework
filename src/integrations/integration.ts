export abstract class Integration {
	abstract send(text: string): Promise<boolean>;
}
