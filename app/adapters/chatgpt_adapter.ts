import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";


const openai = new OpenAIApi(
    new Configuration({ apiKey: process.env.CHATGPT_API_TOKEN })
);

const queryChatgtp = (messages: ChatCompletionRequestMessage[]) => {
    return openai.createChatCompletion( {
        model: 'gpt-3.5-turbo',
        n: 1,
        messages: messages
    })
}


export default queryChatgtp;