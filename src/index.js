require("dotenv").config();
const {
  Client,
  Events,
  GatewayIntentBits,
  IntentsBitField,
  EmbedBuilder,
} = require("discord.js");
const figlet = require("figlet");
// const { Configuration, OpenAIApi } = require("openai");
// Create a new client instance
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
  ],
});

// const configuration = new Configuration({
//   apiKey: process.env.API_KEY,
// });

// const openai = new OpenAIApi(configuration);
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
  if (
    message.content.toLowerCase() === "hello" ||
    message.content.toLowerCase() === "hi" ||
    message.content.toLowerCase() === "yo" ||
    message.content.toLowerCase() === "konichiwa"
  ) {
    // message.reply({
    //   content: "Hi , this is DarkGanon Bot ! 🤖",
    // });
    let { username, discriminator, avatarURL, avatar } = message.author;
    await message.channel.sendTyping();
    const embed = new EmbedBuilder()
      .setTitle(`HELLO,${username}`)
      .setDescription("I was having a nap 💤")
      .setColor("Random")
      .addFields({ name: "Any Questions?", value: "Quickly Ask Some 😁" })
      .setThumbnail(
        "https://img.freepik.com/premium-photo/cute-curious-robot-taking-nap-heart-thriving-spring-forest_674594-2536.jpg?w=2000"
      )
      .setFooter({
        text: "powered by sunglasses",
        iconURL:
          "https://static.wikia.nocookie.net/shingekinokyojin/images/f/f0/Levi_Ackermann_%28Anime%29_character_image_%28850%29.png/revision/latest?cb=20210124214225",
      });
    message.reply({
      embeds: [embed],
    });

    // message.channel.send(`Yo! Human User named ${username}`)
    return;
  }

  //  chat-gpt code starts ---------------------------//
  // let conversationLog = [
  //   { role: "system", content: "You are a friendly ChatBot." },
  // ];
  // await message.channel.sendTyping();

  // let prevMessage = await message.channel.messages.fetch({ limit: 20 });
  // prevMessage.reverse();

  // prevMessage.forEach((msg) => {
  //   if (message.content.startsWith("!")) return;
  //   // if (msg.author.id !== client.user.id && message.author.bot) return; //ignore other bot
  //   if (msg.author.id !== message.author.id) return;

  //   conversationLog.push({
  //     role: "user",
  //     content: msg.content,
  //   });
  // });

  // const result = await openai.createChatCompletion({
  //   model: "gpt-3.5-turbo",
  //   messages: conversationLog,
  // });

  // message.reply(result.data.choices[0].message);
  //  chat-gpt code ends ---------------------------//
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
  if (interaction.commandName == "embed") {
    const embed = new EmbedBuilder()
      .setTitle("Embed Title")
      .setDescription("This a embed Description")
      .setColor("Random")
      .addFields(
        {
          name: "Field title 1",
          value: "some Value",
          inline: true,
        },
        {
          name: "Field title 2",
          value: "some Value",
          inline: true,
        },
        {
          name: "Field title 3",
          value: "some Value",
          inline: true,
        }
      );

    interaction.reply({
      embeds: [embed],
    });
  }
  if (interaction.commandName == "calculate") {
    const num1 = interaction.options.get("first-number")?.value;
    const operation = interaction.options.get("operation-type")?.value;
    const num2 = interaction.options.get("second-number")?.value;
    let result;

    switch (operation) {
      case "+":
        result = num1 + num2;
        break;
      case "-":
        result = num1 - num2;
        break;
      case "/":
        result = num1 / num2;
        break;
      case "*":
        result = num1 * num2;
        break;
      case "%":
        result = num1 % num2;
        break;
      default:
        interaction.reply("Invalid operation type");
        return;
    }

    interaction.reply(`${num1} ${operation} ${num2} = ${result}`);
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
