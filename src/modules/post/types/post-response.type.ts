import { File, Like, Post, User } from '@prisma/client';

export type PostDetailsResponse = Post & {
  author: User;
  files: File[];
  likes: Like[];
  comments: (Comment & {
    author: User;
  })[];
};

export type PostMetadata = {
  lastCursor: number | null;
  hasMore: boolean;
};

export type GetPostResponse = {
  data: PostDetailsResponse[];
  metadata: PostMetadata;
};
