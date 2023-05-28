require("dotenv").config();
const { google } = require("googleapis");
const express = require("express");
const { default: axios } = require("axios");
const dayjs = require("dayjs");

const uuid = require("uuid").v4;

const app = express();

const PORT = process.env.NODE_ENV || 3000;
        // console.log(dayjs(new Date()).add(1, "day").toISOString())

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

app.get("/google", (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    scope: ["https://www.googleapis.com/auth/calendar.events"],
    access_type: "offline",
  });

  res.send({ authUrl: authUrl });
});
app.get("/", (req, res) => {
  res.send({ authUrl: "http://localhost:3000/google" });
});

app.get("/google/redirect", async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  res.send({ message: "User Authenticated" ,
clickhere:"http://localhost:3000/schedule"});
});

app.get("/schedule", async (req, res) => {
  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });


  const createdEvent = await calendar.events.insert({
    calendarId: "primary",
    auth: oAuth2Client,
    conferenceDataVersion: 1,
    requestBody: {
      summary: "TEST EVENT",
      description: "Just for fun",
      start: {
        dateTime: dayjs(new Date()).add(1, "day").toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: dayjs(new Date()).add(1, "day").toISOString(),
        timeZone: "Asia/Kolkata",
      },
    //   conferenceData: {
    //     createRequest: {
    //       requestId: uuid(),
    //     },
    //     attendees: [
    //       { email: "gameshighon@gmail.com" },
    //       { email: "narayandutta2208@gmail.com" },
    //     ],
    //   },
    //   attendees: [
    //     { email: "gameshighon@gmail.com" },
    //     { email: "narayandutta2208@gmail.com" },
    //   ],
    },
  });
  
  
  res.send({message:createdEvent.data.htmlLink})
});

app.listen(PORT, () => {
  console.log("Server Started at ", PORT);
});
