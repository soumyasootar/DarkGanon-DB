const { REST,Routes } = require("discord.js");
require("dotenv").config();

const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
  },
];

console.log("process.env.BOT_TOKEN: ", process.env.BOT_TOKEN);
console.log("process.env.CLIENT_ID: ", process.env.CLIENT_ID);

const rest = new REST({ version: "11" }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands("1110586688075477104"), {
      body: commands,
    });
    console.log("Successful reload application (/) commands");
  } catch (error) {
    console.error(error);
  }
})();
