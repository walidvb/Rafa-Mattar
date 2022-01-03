import React from "react";
import { Shaders, Node, GLSL } from "gl-react";
// @ts-ignore
import { Surface } from "gl-react-dom";
// @ts-ignore
import { Motion, spring } from "react-motion";

const shaders = Shaders.create({
  helloBlue: {
    frag: GLSL`
  precision highp float;
  varying vec2 uv;
  uniform vec2 resolution;
  uniform float scale;
  const float STEP_SIZE = 0.02;
  uniform sampler2D t;

  float map(float num, float in_min, float in_max, float out_min, float out_max) {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

  void main() {
    vec2 loop = mod(uv, vec2(STEP_SIZE)) - STEP_SIZE/2.;
    loop /= STEP_SIZE;
    float distToCenter = sqrt((uv.x - 0.5) * (uv.x - 0.5) + (uv.y - 0.5) * (uv.y - 0.5));
    float circle_size = map(distToCenter, 0.5, 0.0, 0.0, 0.70710678118);
    circle_size = min(0.5, circle_size);
    circle_size *= scale;
    
    float is_in_circle = smoothstep(circle_size - 0.05, circle_size + 0.05, length(loop));


    gl_FragColor = mix(
      texture2D(t, uv),
      vec4(0.0),
      is_in_circle
    );
  }
  `
  }
});


const Mask = ({
  src,
  width,
  height
}: {
  src: string;
  width: number;
  height: number;
}) => {
  const [scale, setScale] = React.useState(1.0);
  return (
    <Surface width={width} height={height} onMouseEnter={() => setScale(3.0)} onMouseLeave={() => setScale(1.0)}>
      <Motion
        defaultStyle={{ scale }}
        style={{
          scale: spring(scale, [5, 1])
        }}
      >
        {({ scale }: { scale: number }) => (
          <Node
            shader={shaders.helloBlue}
            uniforms={{
              t: src,
              scale
            }}
          />
        )}
      </Motion>
    </Surface>
  );
};

export default Mask;
