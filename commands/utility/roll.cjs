const { SlashCommandBuilder } = require('discord.js');
const { roll } = require('../../domain.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Roll a dice'),
	async execute(interaction) {
		await interaction.reply(`${interaction.user.username} rolls a ${roll()}`);
	},
};
