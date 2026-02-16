import { Worker } from 'worker_threads';
import { fileURLToPath } from 'url';
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
    const workerPath = path.resolve(process.cwd(), 'src/utils/videoWorker.js');
    const worker = new Worker(workerPath, {
      workerData: params,
      execArgv: ['--experimental-modules']
    });

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
  });
}

if (!parentPort) {
  throw new Error('This module must be run as a worker');
}

parentPort.on('message', async (data: {
  text: string;
  template: string;
  images: string[];
}) => {
  try {
    console.log('Worker received:', data);
    
    const selectedTemplate = templates[data.template as keyof typeof templates];
    
    if (!selectedTemplate) {
      throw new Error(`Template "${data.template}" not found`);
    }

    const project = makeProject({
      scenes: [selectedTemplate],
      variables: { text: data.text, images: data.images },
    });

    const renderer = new Renderer(project);
    await renderer.render({
      output: './public/output/video.mp4',
    });

    parentPort?.postMessage({ success: true, videoUrl: '/output/video.mp4' });
  } catch (error) {
    console.error('Worker error:', error);
    parentPort?.postMessage({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate video' 
    });
  }
}); 