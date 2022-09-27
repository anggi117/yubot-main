const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('./Commands/index')
const client = new Client({ 
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (interaction.commandName === 'ping') {
        interaction.reply('pong')
    }
    if (interaction.commandName === 'siuuuuuuuuu') {
        const embed = new EmbedBuilder()
            .setTitle(interaction.options.getString('pick'))
            .setDescription(interaction.options.getString('pick'))
        interaction.reply({ embeds: [embed] })
    }
    if (interaction.commandName === 'yugiii') {
        interaction.reply('YUGIIII YAMETE')
    }
})
client.on('messageCreate', (message) => {
    if (message.content === '!ping') {
        message.reply({
            content: 'pong'
        })
    }
})

client.login(process.env.CLIENT_TOKEN);