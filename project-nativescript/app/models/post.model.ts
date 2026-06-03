export interface Post {
	id: number;
	userId: number;
	title: string;
	body: string;
}

export class PostModel implements Post {
	id: number;
	userId: number;
	title: string;
	body: string;

	constructor(data: Partial<Post> = {}) {
		this.id = data.id ?? 0;
		this.userId = data.userId ?? 0;
		this.title = data.title ?? '';
		this.body = data.body ?? '';
	}
}
