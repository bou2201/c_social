'use server';

import prisma from '@/lib/prisma';
import { PostFormSchemaType } from '@/modules/post';
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
        media: '',
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
