'use server';

import prisma from '@/lib/prisma';
import { ActionResponse } from '@/utils/action';
import { File, User } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import { deleteFile } from './upload.action';

export const checkUserExists = async (id: string) => {
  try {
    const hasExisted = await prisma.user.findUnique({
      where: { id },
    });

    return !!hasExisted;
  } catch (error) {
    if (error instanceof Error) {
      return ActionResponse.error(error.message, HttpStatusCode.InternalServerError);
    }
  }
};

export const createUser = async (user: Omit<User, 'banner_url' | 'banner_id'>) => {
  const { id, first_name, last_name, email, image_url, username } = user;

  try {
    const hasExisted = await checkUserExists(user.id);

    if (hasExisted) {
      return ActionResponse.error('user already exists.', HttpStatusCode.Conflict);
    }

    await prisma.user.create({
      data: { id, first_name, last_name, email, image_url, username },
    });
  } catch (error) {
    if (error instanceof Error) {
      return ActionResponse.error(error.message, HttpStatusCode.InternalServerError);
    }
  }
};

export const updateUser = async (user: Omit<User, 'banner_url' | 'banner_id'>) => {
  const { id, first_name, last_name, email, image_url, username } = user;

  try {
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        first_name,
        last_name,
        email,
        image_url,
        username,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return ActionResponse.error(error.message, HttpStatusCode.InternalServerError);
    }
  }
};

export const deleteUser = async (id: string) => {
  try {
    const hasExisted = await checkUserExists(id);

    if (!hasExisted) {
      return ActionResponse.error('user not exists in db.', HttpStatusCode.NotFound);
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return ActionResponse.error(error.message, HttpStatusCode.InternalServerError);
    }
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        image_url: true,
        username: true,
        banner_id: true,
        banner_url: true,
      },
    });

    return ActionResponse.success(user, 'ok.');
  } catch (error) {
    if (error instanceof Error) {
      return ActionResponse.error(error.message, HttpStatusCode.InternalServerError);
    }
  }
};

export const getUserByUsername = async (username: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        image_url: true,
        username: true,
        banner_id: true,
        banner_url: true,
      },
    });

    return ActionResponse.success(user, 'ok.');
  } catch (error) {
    if (error instanceof Error) {
      return ActionResponse.error(error.message, HttpStatusCode.InternalServerError);
    }
  }
};

export const updateUserBanner = async (userId: string, file: File, oldBannerId?: string) => {
  try {
    if (oldBannerId) {
      await deleteFile(oldBannerId);
    }

    const newBanner = await prisma.user.update({
      where: { id: userId },
      data: {
        banner_id: file.public_id,
        banner_url: file.secure_url,
      },
    });

    return ActionResponse.success(newBanner, 'ok.');
  } catch (error) {
    if (error instanceof Error) {
      return ActionResponse.error(error.message, HttpStatusCode.InternalServerError);
    }
  }
};
