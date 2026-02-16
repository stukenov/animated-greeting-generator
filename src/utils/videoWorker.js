import { parentPort, workerData } from 'worker_threads';
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

async function generateVideo(data) {
  try {
    console.log('Worker received:', data);
    
    const selectedTemplate = templates[data.template];
    
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

    parentPort.postMessage({ success: true, videoUrl: '/output/video.mp4' });
  } catch (error) {
    console.error('Worker error:', error);
    parentPort.postMessage({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate video' 
    });
  }
}

generateVideo(workerData); 