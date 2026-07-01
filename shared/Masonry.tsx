import { useLayoutEffect, useRef, useState } from 'react';
import debounce from 'debounce';
import clsx from 'clsx';

const BASE_HEIGHT = 350;
const xMargin = 0;

export const Masonry = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // consider a base height of 350px
    // add up each child to the row until you reach
    // 1.3* the width of the container
    // then compute the height to set so that the row matches
    // exactly the container. voilà!
    const compute = debounce(() => {
      if (!ref.current) {
        return;
      }
      try {
        const fullWidth = ref.current.getBoundingClientRect().width - xMargin;
        const isMobile = window.innerWidth < 767;
        const minItems = fullWidth < 767 ? 1 : fullWidth > 1600 ? 3 : 2;
        const maxItems = fullWidth < 767 ? 2 : fullWidth > 1600 ? 3 : 3;

        const nodes = [...Array.from(ref.current.childNodes)] as HTMLElement[];

        // Reset any layout from a previous pass so each node is measured at its
        // natural width (at BASE_HEIGHT). Without this, a recompute reads the
        // stretched row-fill width we set below and the ratio drifts wider each
        // time — which happens on the edit page because it re-renders often.
        for (const node of nodes) {
          node.style.position = 'static';
          node.style.width = 'auto';
          node.style.height = `${BASE_HEIGHT}px`;
          node.style.left = '';
          node.style.top = '';
          delete node.dataset.width;
        }

        let currentRow: HTMLElement[] = [];
        let currentWidth = 0;
        let i = 0;
        let y = 0;
        // console.log('====================');
        // const algo = [];
        for (let j = 0; j < nodes.length; j++) {
          const node = nodes[j];

          const { width } = node.getBoundingClientRect();
          const cached = parseFloat(node.dataset.width ?? '0');
          if (!cached || width > cached) {
            node.dataset.width = width.toFixed(2);
          }

          const widthNormalized = parseFloat(node.dataset.width);
          let fitsInRow =
            (currentWidth + widthNormalized <= fullWidth * 1.3 ||
              currentRow.length < minItems) &&
            currentRow.length < maxItems;
          // I feel like it would be better to reduce the height
          // until a threshold where it will be too small to be displayed
          // if (potentialHeight > 350) {
          if (!fitsInRow && j !== nodes.length - 1) {
            computeRow();
            fitsInRow = true;
          }
          if (fitsInRow || j === nodes.length - 1) {
            currentWidth += widthNormalized;
            currentRow.push(node);
            if (j !== nodes.length - 1) {
              continue;
            }
          }
          computeRow();
          function computeRow() {
            // else compute the height all should have
            const newHeight = Math.ceil(
              (BASE_HEIGHT * fullWidth) / currentWidth
            );
            let x = 0;

            for (let node of currentRow) {
              if (isMobile) {
                node.style.position = `relative`;
                node.style.width = `100%`;
                node.style.height = 'auto';
                continue;
              }
              const baseWidth = parseFloat(node.dataset.width);
              const newWidth = Math.ceil((baseWidth * newHeight) / BASE_HEIGHT);
              node.style.position = `absolute`;
              node.style.height = `${newHeight}px`;
              node.style.width = `${newWidth}px`;
              node.style.left = `${x}px`;
              node.style.top = `${y}px`;
              x += node.getBoundingClientRect().width;
            }
            y += newHeight;

            // and instantiate the next row
            currentRow = [];
            currentWidth = 0;
            i++;
          }
        }
        if(!isMobile){
          ref.current.style.height = `${y}px`;
        } else{
          ref.current.style.height = `initial`;
        }
        ref.current.style.visibility = 'visible';
      } catch (err) {
        console.error(err);
      }
    }, 0);
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [children]);
  return (
    <div
      ref={ref}
      className={clsx('md:flex flex-wrap relative', className)}
      style={{
        visibility: 'hidden',
        // marginLeft: -xMargin/2,
        // marginRight: -xMargin/2,
      }}
    >
      {children}
    </div>
  );
};
