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
    name: "github",
    description: "Gives you all info of github user",
    options: [
      {
        name: "username",
        description: "Enter Github username",
        type: ApplicationCommandOptionType.String,
        required: true,
      }
    ],
  },
  {
    name: "Create Google Calender Event",
    description: "Creates a Google Calender event",
    options: [
      {
        name: "title",
        description: "Enter title of the event",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "description",
        description: "Enter description of the event",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "date",
        description: "Enter date (DD/MM/YYYY eg: 02/05/2023) of the event",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "time",
        description: "Enter time(HH:MM am/pm eg: 10:50pm) of the event",
        type: ApplicationCommandOptionType.String,
        required: true,
      }
    ],
  },
  {
    name: "Create Google Meet",
    description: "Schedules a Google Meet event with multiple email",
    options: [
      {
        name: "title",
        description: "Enter title of the event",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "description",
        description: "Enter description of the event",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "date",
        description: "Enter date (DD/MM/YYYY eg: 02/05/2023) of the event",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "time",
        description: "Enter time(HH:MM am/pm eg: 10:50pm) of the event",
        type: ApplicationCommandOptionType.String,
        required: true,
      }
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
