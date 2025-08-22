// /api/interactions.js
import { InteractionType, InteractionResponseType } from 'discord-interactions';
import nacl from 'tweetnacl';

function verifyDiscordRequest(rawBody, signature, timestamp, publicKey) {
  const isValid = nacl.sign.detached.verify(
    Buffer.from(timestamp + rawBody),
    Buffer.from(signature, 'hex'),
    Buffer.from(publicKey, 'hex')
  );
  return isValid;
}

export const config = {
  api: {
    bodyParser: false, // required to access raw body
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const rawBody = Buffer.concat(chunks).toString();

  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];

  if (!verifyDiscordRequest(rawBody, signature, timestamp, process.env.PUBLIC_KEY)) {
    return res.status(401).send('Invalid request signature');
  }

  const body = JSON.parse(rawBody);

  if (body.type === InteractionType.PING) {
    return res.status(200).json({ type: InteractionResponseType.PONG });
  }

  // Handle other commands here
  return res.status(200).json({});
}
