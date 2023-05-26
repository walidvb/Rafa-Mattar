import { useLayoutEffect, useRef, useState } from 'react';
import debounce from "debounce"

const BASE_HEIGHT = 350;

export const useInRows = (medias) => {
  const [exposedRows, setRows] = useState([]);

  useLayoutEffect(() => {
    const compute = debounce(() => {
      try {
        const fullWidth = window.innerWidth - 40;
        const medias_ = [...medias].reverse();
        const sizes = Array.from(medias_).map((media) => {
          const w = media.file.details.image.width;
          const h = media.file.details.image.height;
          const widthResized = (w * BASE_HEIGHT) / h;
          return {
            width: widthResized,
            height: BASE_HEIGHT,
            url: media.file.url,
          };
        });
        let rows_ = [];
        let currentRow = [];
        let currentWidth = 0;
        let i = 0;
        console.log('====================');
        while (true) {
          const size = sizes.pop();
          console.log('before:', { ...size });
          if (!size) {
            break;
          }

          const potentialHeight =
            (fullWidth / (currentWidth + size.width)) * size.height;

          // console.log({ potentialHeight, currentWidth });
          // if our height is big enoguh, add it
          // if (potentialHeight > 350) {
          if (currentWidth <= fullWidth) {
            currentWidth += size.width;
            currentRow.push(size);
            continue;
          }
          // else compute the height all should have
          const ratio = currentWidth / fullWidth;
          const resizedRow = currentRow.map((size) => ({
            ...size,
            width: size.width / ratio,
            height: size.height / ratio,
          }));
          console.log(
            'finished row',
            i,
            currentWidth,
            ratio,
            resizedRow,
            currentRow
          );
          rows_.push(resizedRow);

          // and instantiate the next row
          currentRow = [];
          currentWidth = 0;
          i++;

          // if (currentWidth < fullWidth && rows_[i].length < 3) {
          //   rows_[i].push({
          //     ...size,
          //     src: medias_[i].file.url,
          //     media: medias_[i]
          //   });
          //   continue
          // }
          // rows_[i].map((size) => {

          //   const ratio = currentWidth / fullWidth;
          //   sizes.forEach(( size ) => {
          //     console.log({ size })
          //     size.width = size.width * ratio
          //     size.height = size.height * ratio
          //     console.log({ size })
          //   })

          // })
          // currentWidth = 0
        }

        // rows_.forEach((row) => {
        //   row.test = []
        //   const tentativeWidth = row.medias.reduce((acc, media) => acc + media.width, 0)
        //   row.medias.forEach((media) => {
        //     const realWidth = media.width
        //     const finalWidth = tentativeWidth / fullWidth * realWidth
        //     const finalHeight = finalWidth / realWidth * media.height
        //     media.width = finalWidth;
        //     media.height = finalHeight;
        //     row.height= finalHeight
        //     row.test.push(finalHeight)
        //   })
        // })
        console.log('====================');
        console.log('Setting rows', rows_);
        setRows(rows_);
      } catch (err) {
        console.log(err);
      }
    }, 200);
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [medias]);
  return exposedRows;
};
