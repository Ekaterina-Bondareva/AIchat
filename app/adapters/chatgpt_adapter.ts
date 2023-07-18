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

const generateImage = (userPrompt: string) => {
    return openai.createImage({
      prompt: userPrompt,
      n: 1,
      size: "256x256",
      response_format: "url"
    });
  };


export { queryChatgtp, generateImage };