import 'dotenv/config';
import express from 'express';
import { 
    verifyKeyMiddleware,
    InteractionType,
    InteractionResponseType,
    InteractionResponseFlags,
    MessageComponentTypes
 } from 'discord-interactions';
import { DiscordRequest } from './utils.js';
import { roll } from './domain.js';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * Parse request body and verifies incoming requests using discord-interactions package
 */
app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
  // Interaction id, type and data
  const { id, type, data, member } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
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

    console.error(`unknown command: ${name}`);
    return res.status(400).json({error: 'unknown command'});
  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
