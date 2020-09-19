import { useLayoutEffect, useRef } from 'react';
import { useDimensions } from './';

/**
 * @param {React.MutableRefObject<HTMLElement>} ref_0
 * @param {React.MutableRefObject<HTMLElement>} ref_1
 * @param {(data: {
 *   x: number;
 *   y: number;
 *   relativeX: 'left' | 'right';
 *   relativeY: 'top' | 'bottom';
 * }) => void} callback
 * @param {number} margin
 */
const usePosition = (ref_0, ref_1, callback = () => {}, margin = 16) => {
  const dimension_0 = useRef(null);
  const dimension_1 = useRef(null);

  useDimensions(ref_0, data => (dimension_0.current = data));
  useDimensions(ref_1, data => (dimension_1.current = data));

  useLayoutEffect(() => {
    if (dimension_0.current && dimension_1.current) {
      const { width: tw, height: th, x: tx, y: ty } = dimension_0.current;
      const { width: iw, height: ih } = dimension_1.current;
      const { innerWidth: pw, innerHeight: ph } = window;

      const leftSpace = tx + tw - margin;
      const rightSpace = pw - tx - margin;
      const upSpace = ty - margin;
      const downSpace = ph - ty - th - margin;

      let x = 0;
      let y = 0;
      let relativeX = 'right';
      let relativeY = 'top';

      // default placing position left bottom

      if (rightSpace > leftSpace && iw > leftSpace) {
        // plcing in right
        x = tx < margin ? margin : tx;
        if (x + iw > pw - margin) x = pw - margin - iw;

        relativeX = 'left';
      } else {
        // placing in left
        x = tx + tw > pw - margin ? pw - margin - iw : tx + tw - iw;
        if (x < margin) x = margin;
      }

      if (upSpace > downSpace && ih > downSpace) {
        // placing in top
        y = ty > ph - margin ? ph - ih - margin : ty - ih;
        if (y < margin) y = margin;

        relativeY = 'bottom';
      } else {
        // placing in bottom
        y = ty + th < margin ? margin : ty + th;
        if (y + ih > ph - margin) y = ph - ih - margin;
      }

      callback({ x, y, relativeX, relativeY });
    } else callback(null);
  }, [dimension_0, dimension_1, margin, callback]);
};

export { usePosition };
