import { HttpStatusCode } from 'axios';

type ActionPayload<T = any> = {
  success: boolean;
  data?: T;
  message: string;
  status: HttpStatusCode | number;
};

export class ActionResponse {
  static success<T>(
    data: T,
    message = 'action successful.',
    status = HttpStatusCode.Ok,
  ): ActionPayload<T> {
    return {
      success: true,
      data,
      message,
      status,
    };
  }

  // Error Response
  static error(message: string, status = HttpStatusCode.BadRequest): ActionPayload<null> {
    return {
      success: false,
      data: null,
      message,
      status,
    };
  }
}
