import { SlashCommandBuilder } from 'discord.js';
import roll from 'domain.js'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Roll a dice'),
	async execute(interaction) {
		await interaction.reply(roll());
	},
};
