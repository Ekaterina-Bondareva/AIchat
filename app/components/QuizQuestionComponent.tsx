import { useState } from "react";
import { QuizItem } from "@/app/adapters/chatgpt_adapter";

interface InputProps {
    index: number,
    question: QuizItem,
    callback: (a: number, b: boolean) => void
}

function QuizQuestionComponent({index, question, callback} : InputProps) {
    const [result, setResult] = useState("")

    const checkAnswer = (option: string) => {
        if (question.correctAnswer === option) {
            setResult("Correct!")
            callback(index, true)
        } else {
            setResult("Incorrect!")
            callback(index, false)
        }
    }

    return (
        <div>
            <div className="p-2 h-50 text-base text-black border rounded-lg">{question.question}</div><br/>
            {
                question.options.map((item, index) => (<button key={index} type='submit' onClick={(e) => checkAnswer(item)} className="p-2 m-5 h-10 bg-slate-400 border rounded-lg">{item}</button>))
            }
            <br/>
            {
                result === "" ? (<></>) : (<div>{result}</div>)
            }
            <br/>
        </div>
    )
}

export { QuizQuestionComponent };