const { REST, Routes } = require('discord.js')
require('dotenv').config()

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
    options : [
      {
        name: 'name',
        description: 'yiha',
        required: true,
        type: 3,
        choices: [
          {
            name: "anjay",
            value: "test"
          }
        ]
      }
    ],
  },
  {
    name: 'siuuuuuuuuu',
    description: 'siuuuuuuuuu',
    options: [
      {
        name: 'pick',
        description: 'pick da futbol pleier for call siuuuuu',
        required: true,
        type: 3,
        choices: [
          {
            name: 'Christiano Ronaldo',
            value: 'SIIIIUUUUUUU FOR CHRISTIANO RONALDO'
          },
          {
            name: 'IShowSpeed',
            value: 'ISHOWSPEED Siuuuuuu but offside bruhhhh'
          }
        ]
      }
    ]
  },
  {
    name: 'yugiii',
    description: 'just want call yugiiii'
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();