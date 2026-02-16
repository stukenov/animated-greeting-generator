'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from './ui/card';

interface ImagePreviewProps {
  file: File | null;
}

export function ImagePreview({ file }: ImagePreviewProps) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!preview) return null;

  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardContent>
    </Card>
  );
} 