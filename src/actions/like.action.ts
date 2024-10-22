'use server';

import prisma from '@/lib/prisma';
import { ActionResponse } from '@/utils/action';
import { currentUser } from '@clerk/nextjs/server';
import { HttpStatusCode } from 'axios';

export const likePost = async (postId: number) => {
  try {
    const user = await currentUser();
    if (!user) {
      return ActionResponse.error('user not authenticated.', HttpStatusCode.Unauthorized);
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { likes: true },
    });
    if (!post) {
      return ActionResponse.error('post not found.', HttpStatusCode.NotFound);
    }

    const like = await prisma.like.create({
      data: {
        post: {
          connect: { id: postId },
        },
        author: {
          connect: { id: user.id },
        },
      },
    });

    console.log('🚀 ~ likePost ~ like:', like);

    return ActionResponse.success(like, 'Post liked successfully.', HttpStatusCode.Created);
  } catch (error) {
    if (error instanceof Error) {
      return ActionResponse.error(error.message, HttpStatusCode.InternalServerError);
    }
  }
};

export const unlikePost = async (postId: number) => {
  try {
    const user = await currentUser();
    if (!user) {
      return ActionResponse.error('user not authenticated.', HttpStatusCode.Unauthorized);
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { likes: true },
    });
    if (!post) {
      return ActionResponse.error('post not found.', HttpStatusCode.NotFound);
    }

    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        authorId: user.id,
      },
    });
    if (!existingLike) {
      return ActionResponse.error('Like not found.', HttpStatusCode.NotFound);
    }

    const deletedLike = await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });

    console.log('🚀 ~ unlikePost ~ deletedLike:', deletedLike);

    return ActionResponse.success(deletedLike, 'Post deleted successfully.', HttpStatusCode.Ok);
  } catch (error) {
    if (error instanceof Error) {
      return ActionResponse.error(error.message, HttpStatusCode.InternalServerError);
    }
  }
};
