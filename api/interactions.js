// /api/interactions.js
import { InteractionType, InteractionResponseType } from 'discord-interactions';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  // Parse raw body
  const body = await new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => resolve(JSON.parse(data)));
  });

  // Respond to PING
  if (body.type === InteractionType.PING) {
    return res.status(200).json({ type: InteractionResponseType.PONG });
  }

  // Respond to other commands (optional)
  return res.status(200).json({});
}
