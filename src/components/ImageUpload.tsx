'use client';

import { forwardRef } from 'react';
import { Input } from './ui/input';

interface ImageUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Add any additional props here
}

export const ImageUpload = forwardRef<HTMLInputElement, ImageUploadProps>(
  (props, ref) => {
    return (
      <Input
        type="file"
        name="images"
        ref={ref}
        {...props}
        className="cursor-pointer"
      />
    );
  }
); 