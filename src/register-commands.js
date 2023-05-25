const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");

require("dotenv").config();

const commands = [
  {
    name: "calculate",
    description: "Simple calculator of two numbers",
    options: [
      {
        name: "first-number",
        description: "The first number.",
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
      {
        name: "operation-type",
        description: "The first number.",
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: "+",
            value: "+",
          },
          {
            name: "-",
            value: "-",
          },
          {
            name: "÷",
            value: "/",
          },
          {
            name: "x",
            value: "*",
          },
        ],
        required: true,
      },
      {
        name: "second-number",
        description: "The second number.",
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
    ],
  },
  {
    name:"embed",
    description:"Sends an embed!"
  }
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
