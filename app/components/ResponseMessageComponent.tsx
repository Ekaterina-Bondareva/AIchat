import { useState } from "react";
import { ChatCompletionRequestMessage } from "openai";

function ResponseMessageComponent({role, content}: ChatCompletionRequestMessage) {
    const [synthesis, setSynthesis] = useState<SpeechSynthesisUtterance | null>(null);
    const [imageUrl, setImageUrl] = useState("");
    const [translation, setTranslation] = useState("");
    const [transcript, setTranscript] = useState("");

    const handleSpeak = (message: string | undefined) => {
        if ('speechSynthesis' in window && message) {
            const utterance = new SpeechSynthesisUtterance(message);
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

    const generateImage = async () => {
        if (content?.length === 0) {
            return;
        }

        const response = await fetch('/api/dalle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: content }),
        });
        const data = await response.json();
        if (data.url) {
            setImageUrl(data.url)
        }
    }

    const englishTransaltion = async () => {
        if (content?.length === 0) {
            return;
        }

        const response = await fetch('/api/chatgpt?mode=translation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: content }),
        });

        const data = await response.json();
        console.log(data)
        if (data.item) {
            setTranslation(data.item)
        }
    }

    const generateTranscript = async () => {
        if (content?.length === 0) {
            return;
        }

        const response = await fetch('/api/chatgpt?mode=transcript', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: content }),
        });

        const data = await response.json();
        console.log(data);
        if (data.item) {
            setTranscript(data.item)
        }
    }


    return (
        <div className={`${role === "user" ? "place-self-end" : "place-self-start"}`}>
            <div key={'content'} className={`p-5 mb-5 rounded-2xl text-black ${role === "user"  ? "rounded-tr-none bg-white" : "rounded-tl-none bg-green-200"}`}>
                {content as string}<br/><br/>
            </div>
            {
                imageUrl.length > 0 ? (
                    <img src={imageUrl} alt="imageUrl" />
                ) : (
                    <></>
                )
            }
            {
                translation.length > 0 ? (
                    <div key={'translation'} className={`p-5 mb-5 rounded-2xl text-black ${role === "user"  ? "rounded-tr-none bg-white" : "rounded-tl-none bg-green-200"}`}>
                        {translation}
                        <br/><br/>
                    </div>
                ) : (
                    <></>
                )
            }
            {
                transcript.length > 0 ? (
                    <div key={'transcript'} className={`p-5 mb-5 rounded-2xl text-black ${role === "user"  ? "rounded-tr-none bg-white" : "rounded-tl-none bg-green-200"}`}>
                        {transcript}
                        <br/><br/>
                    </div>
                ) : (
                    <></>
                )
            }
            {
                role === 'assistant' ?
                (<div>
                    <button type='submit' onClick={(e) => {handleSpeak(content)}} className="p-2 m-5 h-10 bg-slate-400 border rounded-lg">
                        Read message
                    </button>
                    <button type='submit' onClick={handleStop} disabled={synthesis === null} className="p-2 m-5 h-10 bg-slate-400 border rounded-lg">
                        Stop speech
                    </button>
                    <button type='submit' onClick={generateImage} className="p-2 m-5 h-10 bg-slate-400 border rounded-lg">
                        Generate Image
                    </button>
                    <button type='submit' onClick={englishTransaltion} className="p-2 m-5 h-10 bg-slate-400 border rounded-lg">
                        Translate to English
                    </button>
                    <button type='submit' onClick={generateTranscript} className="p-2 m-5 h-10 bg-slate-400 border rounded-lg">
                        Get transcript
                    </button>
                </div>)
                : (<></>)
            }
        </div>
    );
}

export { ResponseMessageComponent };