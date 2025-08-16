import { InstallGlobalCommands } from "./utils.js";

const ROLL_COMMAND = {
    name: 'roll',
    description: 'Roll a 100 sided dice',
    type: 1,
    integration_types: [0],
    contexts: [0],
};

const ALL_COMMANDS = [ROLL_COMMAND]

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS)