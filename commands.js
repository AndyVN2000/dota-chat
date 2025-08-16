import 'dotenv/config';

import { InstallGlobalCommands } from "./utils.js";

const ROLL_COMMAND = {
    name: 'roll',
    description: 'Roll a 100 sided dice',
    type: 1,
    integration_types: [0],
    contexts: [0],
    options: [
        {
            name: 'max',
            description: 'The maximum number the dice can roll',
            type: 4, // INTEGER TYPE
            required: false
        }
    ]
};

const ALL_COMMANDS = [ROLL_COMMAND]

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS)