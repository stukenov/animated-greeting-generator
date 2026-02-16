import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');
const OUTPUT_DIR = join(process.cwd(), 'public', 'output');

// Ensure directories exist
async function ensureDirectories() {
  await createDirIfNotExists(UPLOAD_DIR);
  await createDirIfNotExists(OUTPUT_DIR);
}

async function createDirIfNotExists(dir: string) {
  const fs = require('fs').promises;
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
    console.log('Created directory:', dir);
  }
}

export async function saveUploadedFile(file: File): Promise<string> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const ext = file.name.split('.').pop();
    const filename = `${uuidv4()}.${ext}`;
    const filepath = join(process.cwd(), 'public', 'uploads', filename);

    console.log('Saving file:', {
      originalName: file.name,
      newPath: filepath,
      size: buffer.length
    });

    // Ensure directory exists
    await ensureDirectories();

    // Write file
    await writeFile(filepath, buffer);
    console.log('File saved successfully');

    // Return public URL
    return `/uploads/${filename}`;
  } catch (error) {
    console.error('Error saving file:', error);
    throw error;
  }
}

export async function saveGeneratedVideo(buffer: Buffer): Promise<string> {
  await ensureDirectories();
  const filename = `${Date.now()}.mp4`;
  const filepath = join(OUTPUT_DIR, filename);
  await writeFile(filepath, buffer);
  return `/output/${filename}`;
} 