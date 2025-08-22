import 'dotenv/config';
import {
  verifyKey,
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes
} from 'discord-interactions';
import { roll } from '../domain.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];

  // Raw body is needed for verification
  const rawBody = await getRawBody(req);

  const isValid = verifyKey(
    rawBody,
    signature,
    timestamp,
    process.env.PUBLIC_KEY
  );

  if (!isValid) {
    return res.status(401).send('Bad request signature');
  }

  const body = JSON.parse(rawBody);
  const { type, data, member } = body;

  if (type === InteractionType.PING) {
    return res.status(200)
      .setHeader('Content-Type', 'application/json')
      .send(JSON.stringify({ type: InteractionResponseType.PONG }));
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name, options } = data;
    const { user } = member;
    const { global_name } = user;

    let value = options?.[0]?.value ?? 100;

    if (name === 'roll') {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: InteractionResponseFlags.IS_COMPONENTS_V2,
          components: [
            {
              type: MessageComponentTypes.TEXT_DISPLAY,
              content: `${global_name} rolls a ${roll(value)}.`
            }
          ]
        }
      });
    }

    return res.status(400).json({ error: 'unknown command' });
  }

  return res.status(400).json({ error: 'unhandled interaction type' });
}

// Helper: read raw body buffer
async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}
