import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";

interface QuizItem {
    question: string,
    correctAnswer: string,
    options: Array<string>
};

interface Quiz{
    questions: Array<QuizItem>
};


const openai = new OpenAIApi(
    new Configuration({ apiKey: process.env.CHATGPT_API_TOKEN })
);

const queryChatgtp = (messages: ChatCompletionRequestMessage[]) => {
    return openai.createChatCompletion( {
        model: 'gpt-3.5-turbo',
        n: 1,
        messages: messages
    })
};

const generateImage = (userPrompt: string) => {
    return openai.createImage({
        prompt: userPrompt,
        n: 1,
        size: "256x256",
        response_format: "url"
    });
};

const generateEnglishTranslation = (message: string) => {
    const msg: ChatCompletionRequestMessage = {role: 'user', content: `Translate "${message}" into English`};
    return queryChatgtp([msg]);
};

const generateTranscript = (message: string) => {
    const msg: ChatCompletionRequestMessage = {role: 'user', content: `Generate pronunciation for "${message}"`};
    return queryChatgtp([msg]);
};

const generateQuiz = (lang1: StaticRange, lang2: string) => {
    const prompt = `generate quiz consisting of 10 ${lang1} words, for each word provide options with ${lang2} translation. Format this quiz in the following json
    interface QuizItem {
    question: string, correctAnswer: string, options: Array<string>
    }
    interface Quiz{
    questions: Array<QuizItem>
    }`;
    const msg: ChatCompletionRequestMessage = {role: 'user', content: prompt};
    return queryChatgtp([msg]);
};


export { queryChatgtp, generateImage, generateEnglishTranslation, generateTranscript, generateQuiz };
export type { QuizItem, Quiz };