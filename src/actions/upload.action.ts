'use server';

import cld from '@/lib/cloudinary';
import { HttpStatusCode } from 'axios';
import { ActionResponse } from '@/utils/action';

export const deleteFile = async (public_id: string) => {
  try {
    if (!public_id) {
      return ActionResponse.error('public_id is required.');
    }

    const result = await cld.uploader.destroy(public_id, { invalidate: true });

    return ActionResponse.success({ ...result }, 'file deleted.');
  } catch (error) {
    if (error instanceof Error) {
      return ActionResponse.error(error.message, HttpStatusCode.InternalServerError);
    }
  }
};
