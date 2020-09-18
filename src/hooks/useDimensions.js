import { useState, useLayoutEffect } from 'react';

/**
 * @param {React.MutableRefObject<HTMLElement>} ref
 * @returns {{
 *   width: number;
 *   height: number;
 *   x: number;
 *   y: number;
 *   loaded: boolean;
 * }}
 */
const useDimensions = ref => {
  const [dimensions, setDimensions] = useState({ loaded: false });

  useLayoutEffect(() => {
    if (ref.current !== null) {
      const { width, height, x, y } = ref.current.getBoundingClientRect();
      setDimensions({ width, height, x, y, loaded: true });
    }
  }, [ref]);

  return dimensions;
};

export { useDimensions };
