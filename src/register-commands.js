const { REST, Routes } = require("discord.js");

require("dotenv").config();

const commands = [
  {
    name: "hey",
    description: "replies with hey",
  },
  {
    name: 'ping',
    description: 'replies with Pong!',
  },
];



const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);
console.log("Heyyy");

(async () => {
  try {
    console.log("Registering Slash Commands......⏳");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      {
        body: commands,
      }
    );
    console.log("Registering Slash Done ✅");
  } catch (error) {
    console.log("error: ", error);
  }
})();
