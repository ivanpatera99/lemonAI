import { App } from "@slack/bolt";
import { SendConversationToOpenAI } from "./services/openai";
import { Flags, processFlags } from "./flags";
import { getConversationWithFilters, postEphemeral } from "./services/slack";
require("dotenv").config();

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.APP_TOKEN
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
        // process flags and handle errors
        const [flags, errors] = processFlags(command.text || "")
        if (errors.length > 0) {
            const errMessage = `I'm sorry, the following flags have invalid values. Errors: ${errors.map(e => e.message).join(', ')}`
            postEphemeral(command.channel_id, command.user_id, errMessage)
            return
        }
        // get conversation from slack and send it to openai
        const {conversation, cursor} = await getConversationWithFilters(command.channel_id, flags);
        const response = await SendConversationToOpenAI(conversation, flags.get(Flags.TRANSLATE_TO_NATIVE) === "true");
        // say response in slack, include cursor if there is one to continue to next page
        say(`${response}\n ${cursor ? `cursor: ${cursor}`: ''}` || "I'm sorry, I don't understand");
    } catch (error) {
         if (error instanceof Error) {
            if(error.message === "NO_CONVERSATION"){
                // Error result from getConversationWithFilters
                postEphemeral(command.channel_id, command.user_id, `I'm sorry, I couldn't find a conversation.`)
            } else if(error.message === "LIMIT_AND_LATEST_OLDEST_NOT_ALLOWED"){
                postEphemeral(command.channel_id, command.user_id, `I'm sorry, provide either a limit or a time range, but not both.`)
            } else if(error.message === "TOKEN_QUANTITY_EXCEDED"){
                // Error from openai
                postEphemeral(command.channel_id, command.user_id, `I'm sorry, the conversation is too long. Select a smaller range of messages.`)
            } else {
                postEphemeral(command.channel_id, command.user_id, `I'm sorry, unexpected error.`)
            }
        } 
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