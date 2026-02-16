'use client';

import { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ImagePreview } from '@/components/ImagePreview';
import { TemplatePreview } from '@/components/TemplatePreview';

const templates = [
  { id: 'template1', name: 'Классический' },
  { id: 'template2', name: 'Современный' },
  { id: 'template3', name: 'Минималистичный' },
];

export default function Home() {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [template, setTemplate] = useState('template1');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text || !file) {
      toast.error('Заполните все поля');
      return;
    }

    setLoading(true);
    setProgress(0);
    try {
      const formData = new FormData();
      formData.append('text', text);
      formData.append('template', template);
      formData.append('file', file);

      // Имитация прогресса генерации
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await response.json();
      if (data.success) {
        setVideoUrl(data.data.videoUrl);
        toast.success('Видео успешно сгенерировано');
      } else {
        toast.error(data.message || 'Ошибка при генерации видео');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Произошла ошибка при генерации видео');
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Генератор поздравлений
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Выберите шаблон</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {templates.map((t) => (
                    <TemplatePreview
                      key={t.id}
                      id={t.id}
                      name={t.name}
                      isSelected={template === t.id}
                      onSelect={setTemplate}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="text">Текст поздравления</Label>
                <Textarea
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Введите текст поздравления..."
                  className="min-h-[120px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Загрузите фото</Label>
                <Input
                  id="file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required
                />
                <ImagePreview file={file} />
              </div>

              {progress > 0 && (
                <div className="space-y-2">
                  <Label>Прогресс генерации</Label>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Генерация...' : 'Сгенерировать'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {videoUrl && (
          <Card>
            <CardHeader>
              <CardTitle>Готовое видео</CardTitle>
            </CardHeader>
            <CardContent>
              <video 
                src={videoUrl} 
                controls 
                className="w-full rounded-lg"
              />
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => {
                  const a = document.createElement('a');
                  a.href = videoUrl;
                  a.download = 'congratulation.mp4';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
              >
                Скачать видео
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
