'use server';

import prisma from '@/lib/prisma';
import { PostFormSchemaType, GetPostResponse, PostDetails } from '@/modules/post';
import { ActionResponse } from '@/utils/action';
import { currentUser } from '@clerk/nextjs/server';
import { HttpStatusCode } from 'axios';

export const createPost = async (post: PostFormSchemaType) => {
  const { content, files: fileData } = post;

  try {
    const user = await currentUser();

    if (!user) {
      return ActionResponse.error('user not authenticated.', HttpStatusCode.Unauthorized);
    }

    const newPost = await prisma.post.create({
      data: {
        content,
        media: fileData?.[0].id ?? '',
        author: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    if (fileData && fileData.length > 0) {
      await prisma.file.createMany({
        data: fileData.map((file) => ({
          ...file,
          postId: newPost.id,
          id: file.public_id,
        })),
      });
    }

    return ActionResponse.success(
      newPost,
      `Post created successfully at ${newPost.createdAt} - ID: ${newPost.id}`,
      HttpStatusCode.Created,
    );
  } catch (error) {
    if (error instanceof Error) {
      return ActionResponse.error(error.message, HttpStatusCode.InternalServerError);
    }
  }
};

export const getPosts = async (lastCursor?: number | null, id: string = 'all') => {
  try {
    const take = 5;
    const where = id !== 'all' ? { author: { id } } : {};

    const posts = await prisma.post.findMany({
      include: {
        author: true,
        files: true,
        likes: true,
        comments: {
          include: {
            author: true,
          },
        },
      },
      where,
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

    if (posts.length === 0) {
      return {
        data: [],
        metadata: {
          lastCursor: null,
          hasMore: false,
        },
      };
    }

    const lastPost = posts[posts.length - 1];
    const cursor = lastPost?.id;

    const morePosts = await prisma.post.findMany({
      where,
      take,
      skip: 1,
      cursor: { id: cursor },
    });

    return {
      data: posts as unknown as PostDetails[],
      metadata: {
        lastCursor: cursor,
        hasMore: morePosts.length > 0,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      return ActionResponse.error(error.message, HttpStatusCode.InternalServerError);
    }
  }
};
