'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';

const DEMO_IMAGE = 'https://placehold.co/600x400/141414/FFFFFF/png?text=Demo+Image';

export function VideoForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    try {
      setIsLoading(true);
      setError(null);
      setProgress(0);

      const formData = new FormData();
      formData.append('text', form.text.value);
      formData.append('template', 'template1');

      console.log('Sending data:', {
        text: form.text.value,
        template: 'template1'
      });

      // Отправляем данные как FormData
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to generate video');
      }

      setVideoUrl(responseData.videoUrl);
      setProgress(100);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate video');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="text">Text</Label>
        <Textarea
          id="text"
          name="text"
          required
          placeholder="Enter your greeting text..."
        />
      </div>

      {error && (
        <div className="text-red-500">{error}</div>
      )}

      {isLoading && (
        <Progress value={progress} className="w-full" />
      )}

      {videoUrl && (
        <video
          src={videoUrl}
          controls
          className="w-full rounded-lg shadow-lg"
        />
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Generating...' : 'Generate Video'}
      </Button>
    </form>
  );
} 