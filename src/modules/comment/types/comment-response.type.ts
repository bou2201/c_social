import { Comment, File, User } from '@prisma/client';

export type CommentResponse = Comment & {
  author: User;
  file: File;
};
