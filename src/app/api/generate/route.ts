import { NextResponse } from 'next/server';
import { generateVideo } from '@/utils/generateVideo';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const text = formData.get('text') as string;
    const template = formData.get('template') as string;
    const imageUrl = formData.get('imageUrl') as string || 'https://placehold.co/600x400/141414/FFFFFF/png?text=Demo+Image';

    console.log('API received:', {
      text,
      template,
      imageUrl
    });

    if (!text || !template) {
      console.log('Missing fields:', {
        text: !!text,
        template: !!template
      });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate video
    console.log('Starting video generation...');
    try {
      const videoUrl = await generateVideo({
        text,
        template,
        images: [imageUrl],
      });
      console.log('Video generated:', videoUrl);

      return NextResponse.json({ videoUrl });
    } catch (error) {
      console.error('Video generation error:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to generate video' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process request' },
      { status: 500 }
    );
  }
} 