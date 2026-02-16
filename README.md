# Animated Greeting Generator

A Next.js web application for creating animated greeting videos using Motion Canvas. Generate personalized video greetings with custom text and images through an intuitive web interface.

## Features

- **Motion Canvas Integration** - Powered by Motion Canvas for smooth, professional animations
- **Multiple Templates** - Choose from Classic, Modern, and Minimalist animation styles
- **Custom Text & Images** - Add personalized messages and upload your own images
- **Real-Time Preview** - Preview templates before generating
- **Progress Tracking** - Visual progress indicator during video generation
- **Download Ready** - Generated videos ready for download and sharing
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## Technology Stack

- **Next.js 15** - React framework with App Router and Turbopack
- **Motion Canvas** - Programmatic animation library
- **TypeScript** - Type-safe development
- **React Hook Form** - Form management with validation
- **Zod** - Schema validation
- **TailwindCSS** - Utility-first styling
- **shadcn/ui** - Beautiful UI components
- **Sonner** - Toast notifications

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/stukenov/animated-greeting-generator.git
cd animated-greeting-generator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Install Motion Canvas dependencies:
```bash
cd motion
npm install
cd ..
```

## Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

Build the application:

```bash
npm run build
# or
yarn build
```

Start the production server:

```bash
npm start
# or
yarn start
```

## How to Use

1. **Select a Template**
   - Choose from Classic, Modern, or Minimalist styles
   - Preview the template animation

2. **Add Your Content**
   - Enter your greeting text
   - Upload an image (supports JPG, PNG, GIF)

3. **Generate Video**
   - Click "Generate Video"
   - Wait for the video to be created (progress bar shows status)

4. **Download & Share**
   - Download the generated video
   - Share your personalized greeting

## Templates

### Classic
Traditional fade-in/fade-out animation with centered text and image.

### Modern
Dynamic animations with motion effects and contemporary styling.

### Minimalist
Clean, simple design with subtle animations and focus on content.

## Project Structure

```
.
├── motion/                    # Motion Canvas templates
│   ├── templates/            # Animation templates
│   │   ├── template1.tsx    # Classic template
│   │   ├── template2.tsx    # Modern template
│   │   └── template3.tsx    # Minimalist template
│   └── vite.config.ts       # Motion Canvas config
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/             # API routes
│   │   │   └── generate/    # Video generation endpoint
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Main page
│   ├── components/          # React components
│   │   ├── ui/             # UI components
│   │   ├── ImagePreview.tsx
│   │   ├── ImageUpload.tsx
│   │   ├── TemplatePreview.tsx
│   │   └── VideoForm.tsx
│   └── utils/              # Utility functions
│       ├── generateVideo.ts
│       └── videoWorker.ts
└── public/                 # Static assets
```

## API Endpoints

### POST /api/generate

Generates an animated greeting video.

**Request Body (multipart/form-data):**
```typescript
{
  text: string;      // Greeting text
  template: string;  // Template ID (template1, template2, template3)
  file: File;        // Image file
}
```

**Response:**
```typescript
{
  success: boolean;
  data?: {
    videoUrl: string;  // URL to download the video
  };
  message?: string;    // Error message if failed
}
```

## Customization

### Creating New Templates

1. Create a new template file in `motion/templates/`:
```tsx
import {makeScene2D} from '@motion-canvas/2d';
import {Txt, Rect, Img} from '@motion-canvas/2d';

export default makeScene2D(function* (view) {
  const text = view.variables.text as string;
  const images = view.variables.images as string[];
  
  // Your animation code here
});
```

2. Add the template to `motion/templates/index.ts`

3. Update the templates list in `src/app/page.tsx`

### Styling

The app uses TailwindCSS. Customize styles in:
- `src/app/globals.css` - Global styles
- Component files - Component-specific styles

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Deploy automatically on push

### Other Platforms

The app can be deployed to:
- Netlify
- Railway
- Heroku
- DigitalOcean
- AWS
- Google Cloud

**Note:** Ensure your deployment platform supports Next.js and has sufficient memory for video generation.

## Performance Considerations

- Video generation is CPU-intensive and may take 10-30 seconds
- Consider implementing a queue system for production use
- Use a dedicated worker service for large-scale deployments
- Limit concurrent video generations to prevent server overload

## Troubleshooting

### Video Generation Fails
- Check that Motion Canvas dependencies are installed
- Ensure sufficient server memory (minimum 512MB RAM)
- Verify image file formats are supported

### Slow Generation
- Video generation is CPU-intensive by nature
- Consider using a more powerful server for production
- Implement caching for frequently used templates

### Image Upload Issues
- Check file size limits (default: 10MB)
- Verify image format is supported (JPG, PNG, GIF)
- Ensure proper file permissions on upload directory

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Built with [Motion Canvas](https://motioncanvas.io/) - Programmatic animation library
- UI components from [shadcn/ui](https://ui.shadcn.com/)

## Support

If you encounter any issues or have questions:
- Create an Issue in the repository
- Provide detailed information about the problem
- Include browser/device information if relevant

---

**Note:** Video generation requires computational resources. For high-volume production use, consider implementing a queue system and dedicated worker processes.
