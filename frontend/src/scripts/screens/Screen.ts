export abstract class Screen {
	abstract enter(): void;
	abstract exit(): void;
	abstract update(delta: number): void;
	abstract render(): void;
}