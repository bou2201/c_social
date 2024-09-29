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

export const createUser = async (user: User) => {
  try {
    const hasExisted = await checkUserExists(user.id);

    if (hasExisted) {
      return Response.json({ status: HttpStatusCode.Conflict, message: 'User already exists.' });
    }

    await prisma.user.create({
      data: user,
    });

    return Response.json({
      status: HttpStatusCode.Created,
      message: 'New user created successfully.',
    });
  } catch (error) {
    return Response.json({ status: HttpStatusCode.InternalServerError, message: error });
  }
};

// export const updateUser = async (user:User) => {
//   try {
//     await prisma.user.update({
//       where: {
//         id:
//       }
//     })
//   }
// }
