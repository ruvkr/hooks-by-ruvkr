import { useLayoutEffect, useState } from 'react';
import { useDimensions } from './useDimensions';

const m = 8;

/**
 * @param {React.MutableRefObject<HTMLElement>} ref_0
 * @param {React.MutableRefObject<HTMLElement>} ref_1
 */
const usePosition = (ref_0, ref_1) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dimension_0 = useDimensions(ref_0);
  const dimension_1 = useDimensions(ref_1);

  useLayoutEffect(() => {
    if (dimension_0.loaded && dimension_1.loaded) {
      const { width: tw, height: th, x: tx, y: ty } = dimension_0;
      const { width: iw, height: ih } = dimension_1;
      const { innerWidth: pw, innerHeight: ph } = window;

      const leftSpace = tx + tw - m;
      const rightSpace = pw - tx - m;
      const upSpace = ty - m;
      const downSpace = ph - ty - th - m;

      let x = 0;
      let y = 0;

      if (rightSpace > leftSpace && iw > leftSpace) {
        x = tx;
        if (x < m) x = m;
      } else {
        x = tx + tw - iw;
        if (x + iw > pw - m) x = pw - iw - m;
      }

      if (upSpace > downSpace && ih > downSpace) {
        y = ty - ih;
        if (y < m) y = m;
      } else {
        y = ty + th;
        if (y + ih > ph - m) y = ph - ih - m;
      }

      setPosition({ x, y });
    }
  }, [dimension_0, dimension_1]);

  return position;
};

export { usePosition };
