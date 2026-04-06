export interface Tag {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  author: User;
  tags: Tag[];
  _count?: {
    comments: number;
  };
}

export interface Comment {
  id: number;
  content: string;
  postId: number;
  authorId: number;
  createdAt: string;
  author: {
    name: string;
  };
}
