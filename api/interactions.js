import { InteractionType, InteractionResponseType } from 'discord-interactions';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  // Read raw body (optional, not used for verification here)
  let rawBody = '';
  for await (const chunk of req) {
    rawBody += chunk;
  }

  const body = JSON.parse(rawBody);

  if (body.type === InteractionType.PING) {
    // Respond exactly as Discord expects
    res.status(200)
       .setHeader('Content-Type', 'application/json')
       .send(JSON.stringify({ type: InteractionResponseType.PONG }));
    return;
  }

  // Catch-all response
  res.status(200)
     .setHeader('Content-Type', 'application/json')
     .send(JSON.stringify({}));
}
