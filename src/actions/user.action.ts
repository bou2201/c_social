'use server';

import prisma from '@/lib/prisma';
import { User } from '@prisma/client';
import { HttpStatusCode } from 'axios';

export const checkUserExists = async (id: string) => {
  try {
    const hasExisted = await prisma.user.findUnique({
      where: { id },
    });

    return !!hasExisted;
  } catch (error) {
    return Response.json({ status: HttpStatusCode.InternalServerError, message: error });
  }
};

export const createUser = async (user: Omit<User, 'banner_url' | 'banner_id'>) => {
  const { id, first_name, last_name, email, image_url, username } = user;

  try {
    const hasExisted = await checkUserExists(user.id);

    if (hasExisted) {
      return Response.json({ status: HttpStatusCode.Conflict, message: 'User already exists.' });
    }

    await prisma.user.create({
      data: { id, first_name, last_name, email, image_url, username },
    });
  } catch (error) {
    return Response.json({ status: HttpStatusCode.InternalServerError, message: error });
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
    return Response.json({ status: HttpStatusCode.InternalServerError, message: error });
  }
};

export const deleteUser = async (id: string) => {
  try {
    const hasExisted = await checkUserExists(id);

    if (!hasExisted) {
      return Response.json({ status: HttpStatusCode.Conflict, message: 'User not exists in db.' });
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    return Response.json({ status: HttpStatusCode.InternalServerError, message: error });
  }
};

export const getUser = async (id: string) => {
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

    return Response.json({ message: 'Ok.', data: user }, { status: HttpStatusCode.Ok });
  } catch (error) {
    return Response.json({ status: HttpStatusCode.InternalServerError, message: error });
  }
};
