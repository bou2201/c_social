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

    return ActionResponse.success(result, 'file deleted.');
  } catch (error) {
    if (error instanceof Error) {
      return ActionResponse.error(error.message, HttpStatusCode.InternalServerError);
    }
  }
};

export const deleteFiles = async (public_ids: string[]) => {
  try {
    if (!public_ids || public_ids.length === 0) {
      return ActionResponse.error('public_ids are required.');
    }

    const results = await Promise.all(
      public_ids.map(async (public_id) => {
        const result = await cld.uploader.destroy(public_id, { invalidate: true });
        return result;
      }),
    );

    return ActionResponse.success(results, 'files deleted.');
  } catch (error) {
    if (error instanceof Error) {
      return ActionResponse.error(error.message, HttpStatusCode.InternalServerError);
    }
  }
};
