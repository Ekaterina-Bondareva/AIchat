"use client";
import { useState } from "react";
import { ChatCompletionRequestMessage } from "openai"


export default function Home() {

  const [allMessages, setAllMessages] = useState<ChatCompletionRequestMessage[]>([]);
  const [query, setQuery] = useState("");
  const [synthesis, setSynthesis] = useState<SpeechSynthesisUtterance | null>(null);
  const [listening, setListening] = useState(false);
  const [imageUrl, setimageUrl] = useState("")

  const handleSubmit = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (query.length === 0) {
        return;
    }
    const newMessage: ChatCompletionRequestMessage =  { role: 'user', content: query};
    setQuery('')
    const tmp = [...allMessages, newMessage]
    setAllMessages(tmp); // new object should be created to cause state refresh and rerender

    const response = await fetch('/api/chatgpt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: tmp }),
    });

    const data = await response.json();
    if (data.item) {
      setAllMessages([...tmp, { role: 'assistant', content: data.item}])
    }
  }

  const generateImage = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (query.length === 0) {
        return;
    }


    const response = await fetch('/api/dalle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: query }),
    });
    setQuery('')
    const data = await response.json();
    if (data.url) {
      setimageUrl(data.url)
    }
  }

  const clear = () => {
    setAllMessages([])
  }

  const handleSpeak = (message: ChatCompletionRequestMessage) => {
    if ('speechSynthesis' in window && message) {
      const utterance = new SpeechSynthesisUtterance(message.content);
      window.speechSynthesis.speak(utterance);
      setSynthesis(utterance);
    } else {
      console.log('Speech synthesis not supported');
    }
  };

  const handleStop = () => {
    if (synthesis) {
      window.speechSynthesis.cancel();
      setSynthesis(null);
    }
  };

  const handleStartListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setListening(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
          }
        }
        setQuery(transcript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setListening(false);
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognition.start();
    } else {
      console.log('Speech recognition not supported');
    }
  };

  const handleStopListening = () => {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.stop();
    setListening(false);
  };

  return (
    <div className="grid grid-cols-1 min-h-screen p-20 bg-gray-100">
      {
        imageUrl.length > 0 ? (
          <img src={imageUrl} alt="imageUrl" />
        ) : (
          <></>
        )
      }
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
              value={query}
              className="p-2 h-50 text-base text-black border rounded-lg"
          />
          <button
            type='submit'
            onClick={(e) => {handleSubmit(e)}}
            className="p-2 m-5 h-10 bg-slate-400 border rounded-lg"
          >
            Send
          </button>
          <button
            type='submit'
            onClick={clear}
            className="p-2 m-5 h-10 bg-slate-400 border rounded-lg"
          >
            Clear conversation
          </button>
          <button
            type='submit'
            onClick={(e) => {
                handleSpeak(allMessages[allMessages.length - 1])
              }
            }
            disabled={allMessages.length < 2}
            className="p-2 m-5 h-10 bg-slate-400 border rounded-lg"
          >
            Read last message
          </button>
          <button
            type='submit'
            onClick={handleStop}
            className="p-2 m-5 h-10 bg-slate-400 border rounded-lg"
          >
            Stop speech
          </button>
          <button
            type='submit'
            onClick={handleStartListening}
            disabled={listening}
            className="p-2 m-5 h-10 bg-slate-400 border rounded-lg"
          >
            Start listening
          </button>
          <button
            type='submit'
            onClick={handleStopListening} disabled={!listening}
            className="p-2 m-5 h-10 bg-slate-400 border rounded-lg"
          >
            Stop listening
          </button>
          <button
            type='submit'
            onClick={generateImage}
            className="p-2 m-5 h-10 bg-slate-400 border rounded-lg"
          >
           Generate Image
          </button>
        </div>
    </div>
  )
}