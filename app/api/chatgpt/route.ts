import { NextRequest, NextResponse } from 'next/server';
import { queryChatgtp } from "@/app/adapters/chatgpt_adapter";


export async function POST(req: NextRequest, res: NextResponse) {
    
    const body = await req.json();
    const completion = await queryChatgtp(body.messages);
    if (completion.data.choices[0].message) {
        const responseText = completion.data.choices[0].message.content;
        return NextResponse.json({ item: responseText });
    }
    return NextResponse.json({});
}