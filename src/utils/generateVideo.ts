import { Worker } from 'worker_threads';
import path from 'path';
import { makeProject } from '@motion-canvas/core';
import { Renderer } from '@motion-canvas/core';
import template1 from '../../motion/templates/template1';
import template2 from '../../motion/templates/template2';
import template3 from '../../motion/templates/template3';

const templates = {
  template1,
  template2,
  template3,
};

export interface GenerateVideoParams {
  text: string;
  template: string;
  images: string[];
}

export async function generateVideo(params: GenerateVideoParams): Promise<string> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(process.cwd(), 'src/utils/videoWorker.ts'));

    worker.on('message', (data: { success: boolean; videoUrl?: string; error?: string }) => {
      if (data.success && data.videoUrl) {
        resolve(data.videoUrl);
      } else {
        reject(new Error(data.error || 'Failed to generate video'));
      }
      worker.terminate();
    });

    worker.on('error', (error) => {
      console.error('Worker error:', error);
      reject(error);
      worker.terminate();
    });

    worker.postMessage(params);
  });
}

export async function generateVideoOld({ text, template, images }: GenerateVideoParams) {
  console.log('Starting video generation with:', { text, template, images });
  
  const selectedTemplate = templates[template as keyof typeof templates];
  
  if (!selectedTemplate) {
    console.error('Template not found:', template);
    throw new Error(`Template "${template}" not found`);
  }

  console.log('Creating project...');
  const project = makeProject({
    scenes: [selectedTemplate],
    variables: { text, images },
  });
  console.log('Project created');

  try {
    console.log('Initializing renderer...');
    const renderer = new Renderer(project);
    console.log('Renderer initialized');

    console.log('Starting render...');
    await renderer.render({
      output: './public/output/video.mp4',
    });
    console.log('Render completed');

    return '/output/video.mp4';
  } catch (error) {
    console.error('Detailed error in video generation:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
} 