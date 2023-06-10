import { App } from "@slack/bolt";
import {WebClient, LogLevel} from "@slack/web-api";
import { SendConversationToOpenAI } from "./openai";
require("dotenv").config();

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.APP_TOKEN
}); 

const client = new WebClient(process.env.SLACK_BOT_TOKEN, {
    logLevel: LogLevel.DEBUG
  });

app.command('/hello', async ({ack, say}) => {
    try{
        await ack();
        say(`hello human`);
    } catch (error) {
      console.error(error);
    }
});

app.command('/history-interpreter', async ({command, ack, say}) => {
    try{
        await ack();
        const conversationResult = await client.conversations.history({channel: command.channel_id});
        const conversation = conversationResult.messages?.filter(message => message.text !== null)
        .map(message => message.text ? `${message.user} (${message.ts}): ${message.text}` : null)
        .join('\n')
        console.log(`CONVERSATION: ${conversation}`)
        if (!conversation) {
            return
        }
        const response = await SendConversationToOpenAI(conversation);
        console.log(`RESPONSE: ${response || ""}`)
        say(response || "I'm sorry, I don't understand");
    } catch (error) {
        console.log("err")
      console.error(error);
    }
});

(async () => {
    const port = 3000
    // Start your app
    await app.start(process.env.PORT || port);
    console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
  })();