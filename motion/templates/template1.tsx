import {makeScene2D} from '@motion-canvas/2d';
import {Txt, Rect, Img} from '@motion-canvas/2d';
import {createRef} from '@motion-canvas/core';
import {all, waitFor} from '@motion-canvas/core/lib/flow';

export default makeScene2D(function* (view) {
  const text = view.variables.text as string;
  const images = view.variables.images as string[];

  console.log('Template variables:', { text, images });

  if (!images || !images.length) {
    throw new Error('No images provided');
  }

  const textRef = createRef<Txt>();
  const imageRef = createRef<Img>();

  view.add(
    <Rect width={1920} height={1080} fill="#141414">
      <Img
        ref={imageRef}
        src={images[0]}
        width={800}
        height={600}
        opacity={0}
      />
      <Txt
        ref={textRef}
        text={text}
        fill="#fff"
        fontFamily="Arial"
        fontSize={60}
        opacity={0}
      />
    </Rect>
  );

  // Fade in image
  yield* imageRef().opacity(1, 1);

  // Fade in text
  yield* textRef().opacity(1, 1);

  // Wait
  yield* waitFor(2);

  // Fade out
  yield* all(
    imageRef().opacity(0, 1),
    textRef().opacity(0, 1),
  );
}); 