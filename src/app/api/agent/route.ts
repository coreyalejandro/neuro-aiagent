// app/api/agent/route.ts

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming JSON body
    const { templateId, prompt, tools, memory } = await request.json();

    // Build a system prompt incorporating the selected options
    const systemMessage = `
You are a helper that generates a complete, standalone TypeScript module for an AI agent.
Use the following settings:
- Template: ${templateId}
- Prompt instructions: ${prompt}
- Tools available: ${tools.join(', ')}
- Memory type: ${memory}

Respond with the full code of the agent module only, with no extra commentary.
    `.trim();

    // Request a code completion from OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: 'Generate the agent code now.' },
      ],
      temperature: 0,
    });

    // Extract the generated code
    const generatedCode = completion.choices[0].message.content;

    // Return it as JSON
    return NextResponse.json({ code: generatedCode });
  } catch (err: unknown) {
    console.error('API Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
