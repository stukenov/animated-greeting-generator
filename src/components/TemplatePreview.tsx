'use client';

import Image from 'next/image';
import { Card, CardContent } from './ui/card';

interface TemplatePreviewProps {
  id: string;
  name: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

// Временные заглушки для превью
const previews = {
  template1: 'https://placehold.co/640x360/141414/FFFFFF/png?text=Classic+Template',
  template2: 'https://placehold.co/640x360/000000/FFFFFF/png?text=Modern+Template',
  template3: 'https://placehold.co/640x360/FFFFFF/000000/png?text=Minimal+Template',
};

export function TemplatePreview({ id, name, isSelected, onSelect }: TemplatePreviewProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:scale-105 ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={() => onSelect(id)}
    >
      <CardContent className="p-4">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={previews[id as keyof typeof previews]}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <p className="mt-2 text-center font-medium">{name}</p>
      </CardContent>
    </Card>
  );
} 