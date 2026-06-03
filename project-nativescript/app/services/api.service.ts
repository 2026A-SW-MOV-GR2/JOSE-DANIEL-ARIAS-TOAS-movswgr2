type JsonObject = Record<string, any>;

export class ApiService {
	private readonly baseUrl = 'https://jsonplaceholder.typicode.com';

	async getPostById(id: number | string): Promise<JsonObject> {
		return this.requestJson(`/posts/${encodeURIComponent(String(id))}`);
	}

	async updatePost(id: number | string, payload: JsonObject): Promise<JsonObject> {
		return this.requestJson(`/posts/${encodeURIComponent(String(id))}`, {
			method: 'PUT',
			body: JSON.stringify(payload),
		});
	}

	private async requestJson(path: string, init: RequestInit = {}): Promise<JsonObject> {
		const response = await fetch(`${this.baseUrl}${path}`, {
			...init,
			headers: {
				'Content-Type': 'application/json',
				...(init.headers || {}),
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}

		const data = await response.json();
		return this.cleanResult(data);
	}

	private cleanResult(data: any): JsonObject {
		if (data === null || data === undefined) {
			return {};
		}

		if (typeof data !== 'object') {
			return { value: data };
		}

		return { ...data };
	}
}
