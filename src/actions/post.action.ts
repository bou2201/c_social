'use server';

import prisma from '@/lib/prisma';
import { PostFormSchemaType, PostResponse } from '@/modules/post';
import { ActionResponse } from '@/utils/action';
import { currentUser } from '@clerk/nextjs/server';
import { HttpStatusCode } from 'axios';
// import { deleteFile } from './upload.action';

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
        media: fileData?.[0]?.id ?? '',
        author: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

    console.log('🚀 ~ createPost ~ newPost:', newPost);

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

export const updatePost = async (postId: number, post: PostFormSchemaType) => {
  const { content, files: fileData } = post;

  try {
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return ActionResponse.error('post not found.', HttpStatusCode.NotFound);
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        content,
        media: fileData?.[0]?.id ?? existingPost.media,
      },
    });

    if (fileData && fileData.length > 0) {
      // Step 1: Delete existing files associated with the post
      await prisma.file.deleteMany({
        where: { postId: postId },
      });

      // Step 2: Create new files
      const newFiles = fileData.map((file) => ({
        ...file,
        postId: updatedPost.id,
        id: file.public_id,
      }));

      if (newFiles.length > 0) {
        await prisma.file.createMany({
          data: newFiles,
        });
      }
      // const fileIds = fileData.map((file) => file.public_id);

      // const existingFiles = await prisma.file.findMany({
      //   where: { postId: postId, id: { in: fileIds } },
      // });

      // const existingFileIds = existingFiles.map((file) => file.id);

      // const newFiles = fileData.filter((file) => !existingFileIds.includes(file.id));

      // if (newFiles.length > 0) {
      //   await prisma.file.createMany({
      //     data: newFiles.map((file) => ({
      //       ...file,
      //       postId: updatedPost.id,
      //       id: file.public_id,
      //     })),
      //   });
      // }
    }

    return ActionResponse.success(
      updatedPost,
      `Post updated successfully at ${updatedPost.updatedAt}`,
      HttpStatusCode.Ok,
    );
  } catch (error) {
    if (error instanceof Error) {
      return ActionResponse.error(error.message, HttpStatusCode.InternalServerError);
    }
  }
};

export const deletePost = async (postId: number) => {
  try {
    // Check if the post exists
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return ActionResponse.error('Post not found.', HttpStatusCode.NotFound);
    }

    // Delete associated files
    await prisma.file.deleteMany({
      where: { postId: postId },
    });

    // Delete associated likes
    await prisma.like.deleteMany({
      where: { postId: postId },
    });

    // Delete associated comments
    await prisma.comment.deleteMany({
      where: { postId: postId },
    });

    // Delete the post itself
    const deletedPost = await prisma.post.delete({
      where: { id: postId },
    });

    return ActionResponse.success(
      deletedPost,
      `Post deleted successfully - ID: ${deletedPost.id}`,
      HttpStatusCode.Ok,
    );
  } catch (error) {
    if (error instanceof Error) {
      return ActionResponse.error(error.message, HttpStatusCode.InternalServerError);
    }
  }
};

// export const deleteImageFromPost = async (postId: number, fileId: string) => {
//   try {
//     const post = await prisma.post.findUnique({
//       where: { id: postId },
//       include: { files: true },
//     });

//     if (!post) {
//       return ActionResponse.error('Post not found.', HttpStatusCode.NotFound);
//     }

//     const file = post.files.find((file) => file.id === fileId);
//     if (!file) {
//       return ActionResponse.error('File not found in the post.', HttpStatusCode.NotFound);
//     }

//     const deletedFile = await prisma.file.delete({
//       where: { id: fileId },
//     });

//     await deleteFile(fileId);

//     return ActionResponse.success(deletedFile, 'Image deleted successfully.', HttpStatusCode.Ok);
//   } catch (error) {
//     if (error instanceof Error) {
//       return ActionResponse.error(error.message, HttpStatusCode.InternalServerError);
//     }
//   }
// };

export const getPosts = async (lastCursor?: number | null, id: string = 'all') => {
  try {
    const take = 5;
    const where = id !== 'all' ? { author: { id } } : {};

    const posts = await prisma.post.findMany({
      include: {
        author: true,
        files: true,
        likes: true,
        _count: {
          select: {
            comments: true,
          },
        },
        // comments: {
        //   include: {
        //     author: true,
        //   },
        // },
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

    const transformedPosts = posts.map((post) => ({
      ...post,
      total_comment: post._count?.comments ?? 0,
    }));

    return {
      data: transformedPosts as unknown as PostResponse[],
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

export const getPost = async (id: number) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        files: true,
        likes: true,
        _count: {
          select: {
            comments: true,
          },
        },
        // comments: {
        //   include: {
        //     author: true,
        //   },
        // },
      },
    });

    if (!post) {
      return ActionResponse.error('Post not found.', HttpStatusCode.NotFound);
    }

    return ActionResponse.success(
      { ...post, total_comment: post._count.comments } as unknown as PostResponse,
      'Get post successfully.',
    );
  } catch (error) {
    if (error instanceof Error) {
      return ActionResponse.error(error.message, HttpStatusCode.InternalServerError);
    }
  }
};
