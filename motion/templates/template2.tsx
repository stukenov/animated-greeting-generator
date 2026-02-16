import {makeScene2D} from '@motion-canvas/2d';
import {createRef} from '@motion-canvas/core';
import {Img, Rect, Txt, Circle, Line} from '@motion-canvas/2d';
import {all, chain, waitFor, easeInOutCubic, easeOutBounce} from '@motion-canvas/core';
import {waitFor as coreWaitFor} from '@motion-canvas/core/lib/flow';

const scene = makeScene2D(function* (view) {
  console.log('Template2 scene started');
  
  const text = view.variables.text as string;
  const images = view.variables.images as string[];
  
  console.log('Template variables:', { text, images });
  
  const textRef = createRef<Txt>();
  const imageRef = createRef<Img>();
  const backgroundRef = createRef<Rect>();
  const lines: Line[] = [];

  // Create decorative lines
  for (let i = 0; i < 10; i++) {
    lines.push(createRef<Line>());
  }

  view.add(
    <Rect ref={backgroundRef} width={1920} height={1080} fill="#000000">
      {lines.map((line, i) => (
        <Line
          ref={line}
          points={[
            [-960 + i * 200, -540],
            [-960 + i * 200, 540],
          ]}
          stroke="#ffffff"
          lineWidth={2}
          opacity={0}
        />
      ))}
      <Img
        ref={imageRef}
        src="/placeholder.jpg"
        width={800}
        height={600}
        opacity={0}
        scale={0.8}
      />
      <Txt
        ref={textRef}
        text="Поздравление"
        fill="#ffffff"
        fontFamily="Arial"
        fontSize={60}
        opacity={0}
        y={300}
      />
    </Rect>
  );

  // Animation sequence
  yield* backgroundRef().fill('#000000', 0);

  // Animate lines
  yield* all(
    ...lines.map((line, i) =>
      chain(
        waitFor(i * 0.1),
        line().opacity(0.2, 0.5, easeInOutCubic),
      ),
    ),
  );

  // Animate image
  yield* chain(
    waitFor(0.5),
    all(
      imageRef().opacity(1, 1, easeInOutCubic),
      imageRef().scale(1, 1.5, easeOutBounce),
    ),
  );

  // Animate text with typing effect
  const finalText = "Поздравление";
  for (let i = 1; i <= finalText.length; i++) {
    yield* textRef().text(finalText.slice(0, i), 0.1);
  }

  // Move text up
  yield* textRef().position.y(200, 1, easeInOutCubic);

  // Final pause
  yield* waitFor(1);

  // Outro animation
  yield* all(
    textRef().opacity(0, 0.5),
    imageRef().opacity(0, 0.5),
    ...lines.map(line => line().opacity(0, 0.5)),
    backgroundRef().fill('#000000', 0.5),
  );
});

export default scene; 