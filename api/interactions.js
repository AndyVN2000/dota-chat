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
  const { data, type, member } = body

  if (body.type === InteractionType.PING) {
    return res.status(200).json({ type: InteractionResponseType.PONG });
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
      const {name, options} = data;
      const {user} = member;
      const {global_name} = user;
  
      let value;
      if (options == undefined) {
          // Default maximum value the dice can roll.
          value = 100;
      }
      else {
          // Use the specified max value given by user.
          value = options[0].value;
      }
  
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
    }

  // Handle other commands here
    console.error(`unknown command: ${name}`);
    return res.status(400).json({error: 'unknown command'});
}
