const Discord = require('discord.js')
const db = require('quick.db')
const {
	MessageActionRow,
	MessageButton,
	MessageMenuOption,
	MessageMenu
} = require('discord-buttons');

module.exports = {
	name: 'emoji',
	aliases: [],
	run: async (client, message, args, prefix, color) => {

module.exports = {
    data: new SlashCommandBuilder()
        .setName('absence')
        .setDescription('Indique une absence avec la date de début et de fin')
        .addStringOption(option =>
            option.setName('date')
                .setDescription('Date d\'absence au format JJ/MM/AAAA')
                .setRequired(true)),
        
    async execute(interaction) {
        const date = interaction.options.getString('date');
        const [startDate, endDate] = date.split(' au ');

        if (!startDate || !endDate) {
            return interaction.reply('Veuillez entrer les dates au format valide: "(date de début) au (date de fin)"');
        }

        
        interaction.reply(`Absence enregistrée du ${startDate} au ${endDate}`);
    },
};
