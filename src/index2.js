require("dotenv").config();
const { Client, Intents, IntentsBitField } = require("discord.js");
const { google } = require("googleapis");
const express = require("express");

const app = express();
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
  ],
});

// OAuth2 client configuration
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Discord bot event: messageCreate
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.channel.id !== process.env.CHANNEL_ID) return;
  
    // Handle event creation command
    if (message.content.toLowerCase().startsWith("!createevent")) {
      const command = message.content.toLowerCase().split(" ");
      if (command.length < 4) {
        message.reply("Please provide a valid event title, date, and time.");
        return;
      }
  
      const title = command[1];
      const date = command[2];
      const time = command[3];
  
      // Format the date and time
      const [day, month, year] = date.split("/");
      const [hour, minute] = time.match(/(\d+):(\d+)/).slice(1);
  
      // Create a DateTime object for the event start time
      const startDateTime = new Date(
        `${year}-${month}-${day}T${hour}:${minute}:00`
      );
  
      // Authenticate the user
      const authUrl = oAuth2Client.generateAuthUrl({
        scope: ["https://www.googleapis.com/auth/calendar.events"],
        state: message.channel.id, // Store the Discord channel ID as state
      });
  
      // Send the authorization URL in the Discord channel
      message.reply(`Please visit the following URL to authenticate: ${authUrl}`);
  
    //   try {
    //     // Wait for user response
    //     const filter = (m) => m.author.id === message.author.id;
    //     const collected = await message.channel.awaitMessages({
    //       filter,
    //       max: 1,
    //       time: 30000,
    //       errors: ["time"],
    //     });
  
    //     const code = collected.first().content;
    //     console.log("code: ", code);
  
    //     // Exchange authorization code for access token
    //     const { tokens } = await oAuth2Client.getToken(code);
    //     oAuth2Client.setCredentials(tokens);
  
    //     // Create event in Google Calendar
    //     const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
    //     const event = {
    //       summary: title,
    //       start: {
    //         dateTime: startDateTime.toISOString(),
    //         timeZone: "America/New_York", // Adjust the timezone as per your requirement
    //       },
    //       end: {
    //         dateTime: startDateTime.toISOString(),
    //         timeZone: "America/New_York",
    //       },
    //     };
  
    //     const createdEvent = await calendar.events.insert({
    //       calendarId: "primary",
    //       resource: event,
    //     });
  
    //     message.reply(`Event created: ${createdEvent.data.htmlLink}`);
    //   } catch (error) {
    //     console.error("Error creating event:", error);
    //     message.reply("Failed to create the event. Please try again later.");
    //   }
    }
  });

// Google OAuth2 callback route
app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;
  const channelID = req.query.state; // Retrieve the Discord channel ID from state

  // Exchange authorization code for access token
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);

  // Send a message to the Discord channel with the authorization code
  const channel = await client.channels.fetch(channelID);
  channel.send(`Authorization code received: ${code}`);

  res.send("Authorization successful! You can close this tab.");
});

// Start the Express server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// Log in to Discord with your bot token
client.login(process.env.BOT_TOKEN);
