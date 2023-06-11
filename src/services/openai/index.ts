import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";
import {encode} from 'gpt-3-encoder'
require("dotenv").config();

const configuration = new Configuration({
    organization: process.env.OPENAI_ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const BuildGPTMessage = (conversation: string, translate: boolean): ChatCompletionRequestMessage[] => ([
    {role: "system", content: "You are a member of a slack channel"},
    {role: "user", content: "Have you been paying attention to the conversation?"},
    {role: "assistant", content: "Yes, I have been paying attention to the conversation."},
    {role: "user", content: `I am going to provide you with a transcript of the conversation,` +
      `please provide a condensed summary of the conversation.${translate ? ' Generate your answer in the same language as the conversations. ' : ''}`+
      `The transcript will have the following format per message: '{ENCODED_USER_ID}@{TIMESTAMP}({THREAD_TIMESTAMP?}): {MESSAGE_CONTENT}'` +
      `The transcript is as follows: ${conversation}`},
])



export const SendConversationToOpenAI = async (conversation: string, translate: boolean): Promise<string> => {
    const messages = BuildGPTMessage(conversation, translate)
    const tokenQuantity = messages.map(message => encode(message.content)).reduce((acc, token) => acc + token.length, 0)
    if (tokenQuantity > 3000) {
        throw new Error("TOKEN_QUANTITY_EXCEDED")
    }
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
    })
    return response.data.choices[0].message?.content || ""
}
