export class MemoryStorage implements Storage {
	private store: {[key: string]: string} = {}


	public clear() {
		this.store = {};
	}

	public key(index: number): string | null {
		const maxLength = this.length;
		if (index < 0 || index >= maxLength) {
			return null;
		}

		const key = Object.keys(this.store)[index];
		return this.store[key];
	}

	public removeItem(key: string) {
		if (!Object.keys(this.store).includes(key)) {
			return;
		}

		delete this.store[key];
	}

	public getItem(key: string): string | null {
		return this.store[key] ?? null;
	}

	public setItem(key: string, value: string) {
		this.store[key] = value;
	}

	public length = Object.keys(this.store).length
}
