import { createUser, deleteUser, updateUser } from '@/actions/user.action';
import type { UserWebhookEvent } from '@clerk/nextjs/server';
import { User } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import { headers } from 'next/headers';
import { NextRequest } from 'next/server';
import { Webhook } from 'svix';

export async function POST(req: NextRequest) {
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_SIGNING_SECRET;

  if (!CLERK_WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return Response.json(
      { error: 'Error occurred -- no svix headers' },
      {
        status: HttpStatusCode.BadRequest,
      },
    );
  }

  const body = JSON.stringify(await req.json());

  const wh = new Webhook(CLERK_WEBHOOK_SECRET);
  let evt: UserWebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as UserWebhookEvent;
  } catch (error) {
    console.error('Error verifying webhook:', error);
    return Response.json(
      { error: 'Error verifying webhook: ' + (error as Error)?.message },
      {
        status: HttpStatusCode.BadRequest,
      },
    );
  }

  const eventType = evt.type;

  try {
    const { id, first_name, last_name, email, email_addresses, image_url, username } =
      evt.data as unknown as User & { email_addresses: { email_address: string }[] };

    const email_address = email_addresses ? email_addresses[0].email_address : email;

    switch (eventType) {
      case 'user.created':
        await createUser({
          id,
          first_name,
          last_name,
          email: email_address,
          image_url,
          username,
        });
        return Response.json({ message: 'User created' }, { status: HttpStatusCode.Created });
      case 'user.updated':
        await updateUser({
          id,
          first_name,
          last_name,
          email: email_address,
          image_url,
          username,
        });
        return Response.json({ message: 'User updated' }, { status: HttpStatusCode.Ok });
      case 'user.deleted':
        await deleteUser(id);
        return Response.json({ message: 'User deleted' }, { status: HttpStatusCode.Ok });
      default:
        break;
    }
  } catch (error) {
    console.error('Error handling event:', error);

    return Response.json(
      { error: 'Error handling event: ' + (error as Error)?.message },
      {
        status: HttpStatusCode.InternalServerError,
      },
    );
  }

  return Response.json(
    { message: 'Received data successfully with type: ' + eventType },
    { status: HttpStatusCode.Ok },
  );
}

export async function GET() {
  return Response.json({ messgae: 'Hello! Welcome To cSol.' });
}
