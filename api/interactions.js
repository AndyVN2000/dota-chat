import 'dotenv/config';
import {
  verifyKeyMiddleware,
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes
} from 'discord-interactions';
import { roll } from '../domain.js';

// Helper to wrap discord-interactions verifyKeyMiddleware for Vercel
function verifyDiscordRequest(req, res, next) {
  return verifyKeyMiddleware(process.env.PUBLIC_KEY)(req, res, next);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  // Verify request
  verifyDiscordRequest(req, res, async () => {
    const { type, data, member } = req.body;

    if (type === InteractionType.PING) {
      return res.send({ type: InteractionResponseType.PONG });
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
  });
}
