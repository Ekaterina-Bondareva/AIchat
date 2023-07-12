"use client";
import { useState, useRef } from "react";
import { Configuration, OpenAIApi, CreateChatCompletionRequest, ChatCompletionRequestMessageRoleEnum, ChatCompletionRequestMessage } from "openai";


export default function Home() {

  const [allMessages, setAllMessages] = useState<ChatCompletionRequestMessage[]>([]);
  const [query, setQuery] = useState("");

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const openai = new OpenAIApi(
    new Configuration({ apiKey: `sk-${process.env.REACT_APP_CHATGPT_API_TOKEN}` })
  );

  const queryChatgpt = (e: React.MouseEvent<HTMLElement>) => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    e.preventDefault();
    if (query.length === 0) {
        return;
    }
    const newMessage: ChatCompletionRequestMessage =  { role: ChatCompletionRequestMessageRoleEnum.User, content: query};
    const tmp = [...allMessages, newMessage];
    setAllMessages([...tmp]); // new object should be created to cause state refresh and rerender

    const request: CreateChatCompletionRequest = {
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
      max_tokens: 4000,
      n: 1,
      messages: tmp // send all messages to maintain conversation context
    };

    openai.createChatCompletion(request)
    .then((response) => {
      console.log(response.data.choices[0].message?.content);
      const responseMessage: ChatCompletionRequestMessage =  { role: ChatCompletionRequestMessageRoleEnum.Assistant, content: response.data.choices[0].message?.content };
      tmp.push(responseMessage);
      setAllMessages([...tmp]); // new object should be created to cause state refresh and rerender
    })
    .catch((error) => {
      console.error(error);
    });
  }

  return (
    <div className="grid grid-cols-1 min-h-screen p-20 bg-gray-100">
        {
          allMessages.map((item, index) => (
            <div 
              key = {index}
              className={`${item.role === "user" ? "place-self-end" : "place-self-start"}`}
            >
              <div className={`p-5 mb-5 rounded-2xl text-black ${item.role === "user"  ? "rounded-tr-none bg-white" : "rounded-tl-none bg-green-200"}`}>
                {item.content as string}<br/><br/>
              </div>
            </div>))
        }
        <div className="flex flex-col p-100">
          <textarea 
              placeholder="Type your question"
              onChange={(e) => {setQuery(e.target.value)}}
              ref={inputRef}
              className="p-2 h-50 text-base text-black border rounded-lg"
          />
          <button 
            type='submit' 
            onClick={(e) => {queryChatgpt(e)}}
            className="p-2 m-5 h-10 bg-slate-400 border rounded-lg"
          >
            Send
          </button>
        </div>
    </div>
  )
}