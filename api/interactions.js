import { verifyKey, InteractionType, InteractionResponseType, InteractionResponseFlags, MessageComponentTypes } from 'discord-interactions';
import { roll } from '../domain.js'; // your dice logic

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];

  // Read raw body for signature verification
  const rawBody = await getRawBody(req);

  // Verify the request came from Discord
  if (!verifyKey(rawBody, signature, timestamp, process.env.PUBLIC_KEY)) {
    return res.status(401).send('Bad request signature');
  }

  const body = JSON.parse(rawBody);
  const { type, data, member } = body;

  // Handle Discord PING
  if (type === InteractionType.PING) {
    res.status(200)
      .setHeader('Content-Type', 'application/json')
      .send(JSON.stringify({ type: InteractionResponseType.PONG }));
    return;
  }

  // Handle slash command
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name, options } = data;
    const { user } = member;
    const { global_name } = user;

    const value = options?.[0]?.value ?? 100;

    if (name === 'roll') {
      res.status(200)
        .setHeader('Content-Type', 'application/json')
        .send(JSON.stringify({
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
        }));
      return;
    }

    // Unknown command
    res.status(400)
      .setHeader('Content-Type', 'application/json')
      .send(JSON.stringify({ error: 'unknown command' }));
    return;
  }

  // Catch-all for unhandled interaction types
  res.status(400)
    .setHeader('Content-Type', 'application/json')
    .send(JSON.stringify({ error: 'unhandled interaction type' }));
}

// Helper: read raw request body
async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    req.on('error', reject);
  });
}
