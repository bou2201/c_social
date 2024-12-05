'use server';

import prisma from '@/lib/prisma';
import { CommentFormSchemaType, CommentResponse } from '@/modules/comment';
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

    if (file && typeof file === 'object') {
      await prisma.commentFile.create({
        data: {
          id: file.public_id,
          asset_id: file.asset_id,
          public_id: file.public_id,
          resource_type: file.resource_type,
          secure_url: file.secure_url,
          signature: file.signature,
          thumbnail_url: file.thumbnail_url,
          url: file.url,
          path: file.path,
          width: file.width,
          height: file.height,
          comment: { connect: { id: newComment.id } },
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

export const getComments = async (postId: number, lastCursor?: number | null) => {
  try {
    const take = 5;

    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentId: null, // Only fetch top-level comments
      },
      include: {
        author: true,
        file: true,
      },
      take,
      ...(lastCursor && {
        skip: 1,
        cursor: {
          id: lastCursor,
        },
      }),
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (comments.length === 0) {
      return {
        data: [],
        metadata: {
          lastCursor: null,
          hasMore: false,
        },
      };
    }

    const lastComment = comments[comments.length - 1];
    const cursor = lastComment?.id;

    const moreComments = await prisma.comment.findMany({
      where: {
        postId,
        parentId: null,
      },
      take,
      skip: 1,
      cursor: { id: cursor },
    });

    return {
      data: comments as unknown as CommentResponse[],
      metadata: {
        lastCursor: cursor,
        hasMore: moreComments.length > 0,
      },
    };
  } catch (error) {
    console.error('🚀 ~ getComments ~ error:', error);

    if (error instanceof Error) {
      return ActionResponse.error(error.message, HttpStatusCode.InternalServerError);
    }
  }
};

export const getRepliesInComment = async (commentId: number, lastCursor?: number | null) => {
  try {
    const take = 5;

    const replies = await prisma.comment.findMany({
      where: {
        parentId: commentId,
      },
      include: {
        author: true,
        file: true,
      },
      take,
      ...(lastCursor && {
        skip: 1,
        cursor: {
          id: lastCursor,
        },
      }),
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (replies.length === 0) {
      return {
        data: [],
        metadata: {
          lastCursor: null,
          hasMore: false,
        },
      };
    }

    const lastReply = replies[replies.length - 1];
    const cursor = lastReply?.id;

    const moreReplies = await prisma.comment.findMany({
      where: {
        parentId: commentId,
      },
      take,
      skip: 1,
      cursor: { id: cursor },
    });

    return {
      data: replies as unknown as CommentResponse[],
      metadata: {
        lastCursor: cursor,
        hasMore: moreReplies.length > 0,
      },
    };
  } catch (error) {
    console.error('🚀 ~ getRepliesInComment ~ error:', error);

    if (error instanceof Error) {
      return ActionResponse.error(error.message, HttpStatusCode.InternalServerError);
    }
  }
};
