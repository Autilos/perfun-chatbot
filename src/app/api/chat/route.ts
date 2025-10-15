import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId, userId } = await request.json();

    const baseUrl = process.env.DIFY_API_BASE || 'https://api.dify.ai/v1';
    const apiKey = process.env.DIFY_API_KEY;

    console.log('=== API ROUTE DEBUG ===');
    console.log('API Key:', apiKey ? 'SET' : 'NOT_SET');
    console.log('API Base:', baseUrl);
    console.log('Message:', message);

    if (!apiKey) {
      return NextResponse.json(
        { error: 'DIFY_API_KEY is missing. Set it in your environment.' },
        { status: 500 }
      );
    }

    const response = await fetch(`${baseUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        query: message,
        response_mode: 'blocking',
        conversation_id: conversationId || undefined,
        user: userId || 'anonymous',
      }),
    });

    console.log('Dify Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Dify Error:', errorText);
      return NextResponse.json(
        { error: `HTTP error! status: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Dify Success!');
    
    return NextResponse.json({
      answer: data.answer,
      conversation_id: data.conversation_id,
      message_id: data.message_id,
      metadata: data.metadata,
    });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
