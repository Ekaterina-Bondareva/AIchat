import { NextRequest, NextResponse } from 'next/server';
import { queryChatgtp, generateEnglishTranslation, generateTranscript } from "@/app/adapters/chatgpt_adapter";


export async function POST(req: NextRequest, res: NextResponse) {
    const mode = req.nextUrl.searchParams.get('mode');
    const body = await req.json();

    if (mode) {
        const content = body.content
        if (mode === 'translation') {
            const translation = await generateEnglishTranslation(content)
            if (translation.data.choices[0].message) {
                return NextResponse.json({ item: translation.data.choices[0].message.content });
            }
            return NextResponse.json({});
        } else if (mode === 'transcript') {
            const transcript = await generateTranscript(content)
            if (transcript.data.choices[0].message) {
                return NextResponse.json({ item: transcript.data.choices[0].message.content });
            }
            return NextResponse.json({});
        }
        return NextResponse.json({});
    } else {
        const completion = await queryChatgtp(body.messages);
        if (completion.data.choices[0].message) {
            const responseText = completion.data.choices[0].message.content;
            return NextResponse.json({ item: responseText });
        }
        return NextResponse.json({});
    }
}