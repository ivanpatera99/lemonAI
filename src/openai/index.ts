import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";
require("dotenv").config();

const configuration = new Configuration({
    organization: "org-yFZ3vdkKx5hcrsvM3C3sjr60",
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const BuildGPTMessage = (conversation: string): ChatCompletionRequestMessage[] => ([
    {role: "system", content: "You are a member of a slack channel"},
    {role: "user", content: "Have you been paying attention to the conversation?"},
    {role: "assistant", content: "Yes, I have been paying attention to the conversation."},
    {role: "user", content: `I am going to provide you with a transcript of the conversation, please provide a summary of the conversation. The transcript is as follows: ${conversation}`},
])

export const SendConversationToOpenAI = async (conversation: string) => {
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: BuildGPTMessage(conversation),
    })
    return response.data.choices[0].message?.content
}