import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from "@/app/adapters/chatgpt_adapter";


export async function POST(req: NextRequest, res: NextResponse) {

    try {
        const body = await req.json();
        const completion = await generateImage(body.prompt);
        if (completion.data.data[0].url) {
            const responseText = completion.data.data[0].url;
            return NextResponse.json({ url: responseText });
        }
        return NextResponse.json({});
    } catch (e) {
        console.log(e);
    }
}