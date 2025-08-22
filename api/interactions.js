import { InteractionType, InteractionResponseType } from 'discord-interactions';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const body = await new Promise((resolve) => {
      let data = '';
      req.on('data', chunk => data += chunk);
      req.on('end', () => resolve(JSON.parse(data)));
    });

    if (body.type === InteractionType.PING) {
      // Respond exactly what Discord expects
      return res.status(200).json({ type: InteractionResponseType.PONG });
    }

    // Catch-all response for other commands
    return res.status(200).json({});
  }

  // Reject non-POST requests
  res.status(405).send('Method Not Allowed');
}
