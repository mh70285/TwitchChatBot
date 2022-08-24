import tmi from "tmi.js";
import {
  BOT_USERNAME,
  OAUTH_TOKEN,
  CHANNEL_NAME,
  BLOCKED_WORDS,
} from "./constants";

const client = new tmi.Client({
  options: { debug: true },

  identity: {
    username: BOT_USERNAME,
    password: OAUTH_TOKEN,
  },
  channels: [CHANNEL_NAME],
});
client.connect();
client.on("message", (channel, userstate, message, self) => {
  if (self) return;
  if (userstate.username === BOT_USERNAME) {
    return;
  }
  if (message.toLowerCase() === "!hello") {
    client.say(channel, `@${userstate.username}, heya!`);
  }

  checkTwitchchat(userstate, message, channel);
});

function checkTwitchchat(userstate, message, channel) {
  message = message.toLowerCase();
  let shouldSendMessage = false;
  shouldSendMessage = BLOCKED_WORDS.some((blockedWord) =>
    message.includes(blockedWord.toLowerCase())
  );

  if (shouldSendMessage) {
    client.say(
      channel,
      `@${userstate.username}, sorry!  You message was deleted.`
    );

    client.deletemessage(channel, userstate.id);
  }
}
