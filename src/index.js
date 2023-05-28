require("dotenv").config();
const {
  Client,
  Events,
  GatewayIntentBits,
  IntentsBitField,
  EmbedBuilder,
  ActivityType,
} = require("discord.js");
const figlet = require("figlet");
const axios = require("axios");
const { google } = require("googleapis");
const express = require("express");
const app = express();
// const { Configuration, OpenAIApi } = require("openai");

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  CALENDAR_API_KEY,
  CHANNEL_ID,
  BOT_TOKEN,
} = process.env;

// OAuth2 client configuration
const oAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);
// Create a new client instance
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
  ],
});

const status = [
  {
    name: "Eating pizza",
    type: ActivityType.Watching,
    url: "https://www.youtube.com/watch?v=cwShdi7-krY",
  },
  {
    name: "Running from squirrels",
    type: ActivityType.Playing,
    url: "https://www.youtube.com/watch?v=nGF5k8uzbRQ",
  },
  {
    name: "Trying to dance like nobody's watching",
    type: ActivityType.Playing,
    url: "https://www.youtube.com/watch?v=SCvzJQQVAuc",
  },
  {
    name: "Finding the meaning of life",
    type: ActivityType.Watching,
    url: "https://www.youtube.com/watch?v=BdTGkd_sbNs",
  },
  {
    name: "Having an existential crisis",
    type: ActivityType.Competing,
  },
  {
    name: "Inventing a new language",
    type: ActivityType.Custom,
  },
  {
    name: "Solving impossible puzzles",
    type: ActivityType.Playing,
  },
  {
    name: "Plotting world domination",
    type: ActivityType.Competing,
  },
];

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

  setInterval(() => {
    let random = Math.floor(Math.random() * status.length);
    client.user.setActivity(status[random]);
  }, 10000);
});

client.on("messageCreate", async (message) => {
  // console.log("message: ", message);
  if (message.author.bot) return; //if message is from bot then return
  if (message.channel.id !== process.env.CHANNEL_ID) return;
  // if (message.content.startsWith("!")) return;
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
  // Handle event creation command
  if (message.content.toLowerCase().startsWith("!createevent")) {
    const command = message.content.toLowerCase().split(" ");
    if (command.length < 3) {
      message.reply("Please provide a valid event title and date.");
      return;
    }

    const title = command[1];
    const date = command[2];

    // Authenticate the user
    const authUrl = oAuth2Client.generateAuthUrl({
      scope: ["https://www.googleapis.com/auth/calendar.events"],
    });
    message.reply(`Please visit the following URL to authenticate: ${authUrl}`);

    // Listen for authentication code
    const collector = message.channel.createMessageCollector({
      filter: (m) => m.author.id === message.author.id,
      max: 1,
    });

    collector.on("collect", async (m) => {
      const code = m.content;

      // Exchange authorization code for access token
      const { tokens } = await oAuth2Client.getToken(
        "4/0AbUR2VPI3gvb9q57B9GEwcuLSLlJlv-S3A7tmseoDTS61CyqPYj2hEssruxthjIyBRlH0A"
      );
      oAuth2Client.setCredentials(tokens);

      // Create event in Google Calendar
      const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
      const event = {
        summary: title,
        start: {
          dateTime: date,
          timeZone: "America/New_York", // Adjust the timezone as per your requirement
        },
        end: {
          dateTime: date,
          timeZone: "America/New_York",
        },
      };

      try {
        const createdEvent = await calendar.events.insert({
          calendarId: "primary",
          resource: event,
        });

        message.reply(`Event created: ${createdEvent.data.htmlLink}`);
      } catch (error) {
        console.error("Error creating event:", error);
        message.reply("Failed to create the event. Please try again later.");
      }
    });
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

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand) return;

  console.log("interaction: ", interaction.commandName);
  if (interaction.commandName == "hey") {
    interaction.reply("Heyyyyyyyyy 🙌");
  }
  if (interaction.commandName == "ping") {
    interaction.reply("Pong!🏓");
  }
  if (interaction.commandName == "github") {
    let username = interaction.options.get("username")?.value;
    console.log("username: ", username);
    try {
      const response = await axios.get(
        `https://api.github.com/users/${username}`
      );
      const allUserData = response.data;
      console.log("allUserData: ", allUserData);
      const {
        login,
        name,
        bio,
        location,
        followers,
        following,
        public_repos,
        avatar_url,
        html_url,
      } = allUserData;
      const embed = new EmbedBuilder()
        .setTitle(name)
        .setAuthor({
          name: login,
          url: html_url,
          iconURL: avatar_url,
        })
        .setDescription(bio)
        .setColor("Random")
        .setURL(html_url)
        .setThumbnail(avatar_url)
        .addFields(
          {
            name: "Followers",
            value: `${followers}`,
            inline: true,
          },
          {
            name: "Following",
            value: `${following}`,
            inline: true,
          },
          {
            name: "Public Repos:",
            value: `${public_repos}`,
            inline: true,
          }
        )
        .setFooter({
          text: `Location ${location}`,
        });

      interaction.reply({
        embeds: [embed],
      });
    } catch (error) {
      console.error("Error fetching GitHub user details:", error);
    }
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
