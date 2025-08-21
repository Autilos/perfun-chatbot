import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId, userId } = await request.json();

    console.log('=== API ROUTE DEBUG ===');
    console.log('API Key:', process.env.DIFY_API_KEY ? 'SET' : 'NOT_SET');
    console.log('API Base:', process.env.DIFY_API_BASE);
    console.log('Message:', message);

    const response = await fetch(`${process.env.DIFY_API_BASE}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DIFY_API_KEY}`,
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
