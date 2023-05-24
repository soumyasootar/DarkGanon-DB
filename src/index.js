require("dotenv").config();
const {
  Client,
  Events,
  GatewayIntentBits,
  IntentsBitField,
} = require("discord.js");
const figlet = require("figlet");
const { Configuration, OpenAIApi } = require("openai");
// Create a new client instance
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
  ],
});

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);
// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  let date = new Date(c.readyTimestamp);
  var day = date.getDate();
  var month = date.getMonth() + 1; // Adding 1 because month index starts from 0
  var year = date.getFullYear();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var D = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  console.log(`Ready! Logged in as ${c.user.tag} at ${D}`);
});

client.on("messageCreate", async (message) => {
  // console.log("message: ", message);
  if (message.author.bot) return; //if message is from bot then return
  if (message.channel.id !== process.env.CHANNEL_ID) return;
  if (message.content.startsWith("!")) return;
  if (message.content.toLowerCase() === "hello") {
    message.reply({
      content: "Hi , this is DarkGanon Bot ! 🤖",
    });
    return;
  }
  let conversationLog = [
    { role: "system", content: "You are a friendly ChatBot." },
  ];
  await message.channel.sendTyping();

  let prevMessage = await message.channel.messages.fetch({ limit: 20 });
  prevMessage.reverse();

  prevMessage.forEach((msg) => {
    if (message.content.startsWith("!")) return;
    // if (msg.author.id !== client.user.id && message.author.bot) return; //ignore other bot
    if (msg.author.id !== message.author.id) return;

    conversationLog.push({
      role: "user",
      content: msg.content,
    });
  });


  const result = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: conversationLog,
  });

  message.reply(result.data.choices[0].message);
});

client.on("interactionCreate", (interaction) => {
  if (!interaction.isChatInputCommand) return;

  console.log("interaction: ", interaction.commandName);
  if (interaction.commandName == "hey") {
    interaction.reply("Heyyyyyyyyy 🙌");
  }
  if (interaction.commandName == "ping") {
    interaction.reply("Pong!🏓");
  }
});
// Log in to Discord with your client's token
client.login(process.env.BOT_TOKEN);

figlet.text(
  "BOT  STARTED ",
  {
    font: "",
    horizontalLayout: "controlled smushing",
    verticalLayout: "fitted",
    whitespaceBreak: false,
    width: "",
  },
  function (err, data) {
    if (err) {
      console.log("Something went wrong in figlet text...");
      console.dir(err);
      return;
    }
    console.log(data);
  }
);
