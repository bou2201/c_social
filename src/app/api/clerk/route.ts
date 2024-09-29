import { createUser } from '@/actions/user.action';
import type { UserWebhookEvent } from '@clerk/nextjs/server';
import { User } from '@prisma/client';
import type { NextApiRequest } from 'next';
import { headers } from 'next/headers';
import { Webhook } from 'svix';

export async function POST(req: NextApiRequest) {
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_SIGNING_SECRET;

  if (!CLERK_WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    });
  }

  const payload = await (req as any).json();
  const body = JSON.stringify(payload);

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
    return new Response('Error occured: ' + error, {
      status: 400,
    });
  }

  try {
    const data = evt.data as unknown as User;
    const eventType = evt.type;

    switch (eventType) {
      case 'user.created':
        await createUser(data);
        break;
      case 'user.updated':
        break;
      case 'user.deleted':
        break;
      default:
        return;
    }
  } catch (error) {
    return new Response('Error occured: ' + error, {
      status: 400,
    });
  }

  return Response.json({ message: 'Receive Successful.' });
}

export async function GET() {
  return Response.json({ messgae: 'Hello! Welcome To cSol.' });
}
