'use server';

import prisma from '@/lib/prisma';
import { CommentFormSchemaType } from '@/modules/comment';
import { ActionResponse } from '@/utils/action';
import { currentUser } from '@clerk/nextjs/server';
import { HttpStatusCode } from 'axios';

export const createComment = async (
  postId: number,
  comment: CommentFormSchemaType,
  parentId?: number,
) => {
  const { content, file } = comment;

  try {
    const user = await currentUser();

    const newComment = await prisma.comment.create({
      data: {
        comment: content,
        post: { connect: { id: postId } },
        author: {
          connect: { id: user?.id },
        },
        parent: parentId ? { connect: { id: parentId } } : undefined,
      },
    });

    console.log('🚀 ~ createComment ~ newComment:', newComment);

    if (file) {
      await prisma.commentFile.create({
        data: {
          ...file,
          id: file.public_id,
          commentId: newComment.id,
        },
      });
    }

    return ActionResponse.success(
      newComment,
      'Comment created successfully.',
      HttpStatusCode.Created,
    );
  } catch (error) {
    if (error instanceof Error) {
      return ActionResponse.error(error.message, HttpStatusCode.InternalServerError);
    }
  }
};
