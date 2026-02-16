import {makeScene2D} from '@motion-canvas/2d';
import {createRef} from '@motion-canvas/core';
import {Img, Rect, Txt} from '@motion-canvas/2d';
import {all, chain, waitFor, easeInOutCubic, easeInOutQuart} from '@motion-canvas/core';

const scene = makeScene2D(function* (view) {
  const text = createRef<Txt>();
  const image = createRef<Img>();
  const background = createRef<Rect>();
  const overlay = createRef<Rect>();

  view.add(
    <Rect ref={background} width={1920} height={1080} fill="#ffffff">
      <Rect
        ref={overlay}
        width={1920}
        height={1080}
        fill="#000000"
        opacity={0}
      />
      <Img
        ref={image}
        src="/placeholder.jpg"
        width={960}
        height={1080}
        x={-480}
        opacity={0}
      />
      <Txt
        ref={text}
        text="Поздравление"
        fill="#000000"
        fontFamily="Arial"
        fontSize={60}
        x={480}
        opacity={0}
      />
    </Rect>
  );

  // Animation sequence
  yield* background().fill('#ffffff', 0);

  // Slide in image from left
  yield* chain(
    image().position.x(-960, 0),
    image().opacity(1, 0),
    image().position.x(-480, 1.5, easeInOutQuart),
  );

  // Fade in text
  yield* chain(
    waitFor(0.5),
    text().opacity(1, 1, easeInOutCubic),
  );

  // Overlay effect
  yield* chain(
    waitFor(1),
    overlay().opacity(0.7, 1, easeInOutCubic),
  );

  // Move text to center
  yield* text().position.x(0, 1, easeInOutCubic);

  // Final pause
  yield* waitFor(1);

  // Outro animation
  yield* all(
    text().opacity(0, 0.5),
    image().opacity(0, 0.5),
    overlay().opacity(1, 0.5),
  );
});

export default scene; 