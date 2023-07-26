"use client";
import { useState } from "react";
import { Quiz, QuizItem } from "@/app/adapters/chatgpt_adapter";
import { QuizQuestionComponent } from "@/app/components/QuizQuestionComponent";

export default function Quiz() {
    const [loading, setLoading] = useState(false)
    const [lang1, setLang1] = useState("")
    const [lang2, setLang2] = useState("")
    const [quiz, setQuiz] = useState<Quiz | null>(null)
    const [result, setResult] = useState<Array<boolean>>([])
    const [finalResult, setFinalResult] = useState<number | null>(null)

    const calculateOverallResults = () => {
        setFinalResult(result.filter(e => e === true).length)
    }

    const setQuestionResult = (index: number, answer: boolean) => {
        result[index] = answer
        setResult([...result])
    }

    const generateQuiz = async () => {
        if (lang1.length === 0 || lang2.length === 0) {
            return;
        }
        setLoading(true)
        setFinalResult(null)
        setResult([])

        const response = await fetch('/api/chatgpt?mode=quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ lang1: lang1, lang2: lang2 }),
        });

        const data = await response.json();
        setLoading(false)
        if (data.item) {
            setResult(Array(10).fill(false))
            console.log(data.item)
            const questions = JSON.parse(data.item)
            questions.questions.forEach((q: QuizItem) => {
                q.options.sort((a, b) => Math.random() - 0.5)
            })
            setQuiz(questions)
        }
    }

    return (
        <div className="grid grid-cols-1 min-h-screen p-20 bg-gray-100">
            {
                loading ? (
                    <textarea value={"Generating quiz"} disabled={true} className="p-2 h-50 text-base text-black border rounded-lg" />
                ) : (
                    <></>
                )
            }
            <div className="flex flex-col p-100">
              <textarea
                  placeholder="Language you study"
                  onChange={(e) => {setLang1(e.target.value)}}
                  value={lang1}
                  className="p-2 h-50 text-base text-black border rounded-lg"
              />
              <textarea
                  placeholder="Language you know"
                  onChange={(e) => {setLang2(e.target.value)}}
                  value={lang2}
                  className="p-2 h-50 text-base text-black border rounded-lg"
              />
              {
                finalResult !== null ? (<textarea value={finalResult} className="p-2 h-50 text-base text-black border rounded-lg" disabled={true} />
                ) : (
                    <></>
                )
              }
              <button
                type='submit'
                onClick={generateQuiz}
                className="p-2 m-5 h-10 bg-slate-400 border rounded-lg"
              >
                Generate quiz
              </button>
              <button
                type='submit'
                onClick={calculateOverallResults}
                className="p-2 m-5 h-10 bg-slate-400 border rounded-lg"
              >
                Get results
              </button>
            </div>
            {
                quiz !== null ? (
                    quiz.questions.map((question, index) => (<QuizQuestionComponent index={index} question={question} callback={setQuestionResult}/>))
                ) : (
                    <></>
                )
            }
        </div>
      )
}