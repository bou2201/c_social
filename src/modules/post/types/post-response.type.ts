import { File, Like, Post, User } from '@prisma/client';

export type PostResponse = Post & {
  author: User;
  files: File[];
  likes: Like[];
  total_comment: number;
  // comments: (Comment & {
  //   author: User;
  // })[];
};
