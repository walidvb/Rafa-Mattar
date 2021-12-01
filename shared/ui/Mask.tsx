import React, { useState } from "react";
import styled from "styled-components";
import Image from 'next/image';
import { map } from '../helpers/map';

const BWImage = styled.div`
  filter: grayscale(1);

  svg circle{
    transition: all .8s .3s ease-in-out;
  }
  &:hover{
    filter: grayscale(0);
    svg circle{
      transition: all .5s ease-in-out;
    }
  }
`

const ClippedImage = styled(Image)`
  clip-path: url(#clip);
`
function MaskedImage({ className, ...props }: any) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    // 3px padding as the image underneath moves slightly slower
    // so you can see the borders
    <BWImage
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex justify-center p-[3px] ${className}`}
    >
      <ClippedImage {...props} objectFit="cover" />
      <SVGMask isHovered={isHovered}/>
    </BWImage>
  );
}

export default MaskedImage;


const STEP_SIZE = 0.025;
const RESOLUTION = 1;

const SVGMask = React.memo(function SVG({ isHovered } : { isHovered: boolean }) {
  const circles = [];
  const w = RESOLUTION;
  const h = RESOLUTION;
  const scale = isHovered ? 3 : 1
  for (let x = 0; x < w; x += STEP_SIZE) {
    for (let y = 0; y < h; y += STEP_SIZE) {
      const distToCenter = Math.sqrt(
        (x - w / 2) * (x - w / 2) + (y - h / 2) * (y - h / 2)
      );

      let r = map(distToCenter, w / 2, w / 6, 0, (STEP_SIZE / 2) * scale);
      r = Math.min(r, (STEP_SIZE / 2) * scale);
      if (r <= 0) {
        continue
      }
      circles.push(
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="white" />
      );
    }
  }

  return (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${w} ${h}`} width="0" height="0">
        <defs>
          <clipPath clipPathUnits="objectBoundingBox"  id="clip">
            {circles}
          </clipPath>
        </defs>
    </Svg>
  );
});

const Svg = styled.svg`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  mix-blend-mode: revert;
  max-width: 100%;
  max-height: 100%;
  background: black;
`