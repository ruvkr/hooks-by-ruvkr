import { useRef, useCallback } from 'react';

const options = { passive: false, once: true };

/**
 * @param {function} onLongPress
 * @param {{ delay: number }} config
 */
export const useLongPress = (onLongPress = () => {}, { delay = 300 } = {}) => {
  const longPressTriggered = useRef(false);
  const timeout = useRef(null);
  const passClick = useRef(true);
  /** @type {React.MutableRefObject<HTMLElement>} */
  const target = useRef(null);

  const touchEndHandler = useCallback(
    /** @param {TouchEvent} event */ event => {
      if (!passClick.current) {
        'touches' in event &&
          event.touches.length < 2 &&
          event.cancelable &&
          event.preventDefault();
        passClick.current = true;
      }
    },
    []
  );

  const clickHandler = useCallback(
    /** @param {MouseEvent} event */ event => {
      if (!passClick.current) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        passClick.current = true;
      }
    },
    []
  );

  /**
   * Add new click listener when target changes. But not when target changes to
   * any clild element.
   *
   * @param {MouseEvent} event
   */
  const mouseMoveHandler = event => {
    if (
      event.target !== target.current &&
      !target.current.contains(event.target)
    ) {
      target.current.removeEventListener('click', clickHandler, options);
      event.target.addEventListener('click', clickHandler, options);
      target.current = event.target;
    }
  };

  /**
   * In mousedown adding `click` listener to block click. And adding
   * `mousemove` listeners to detect target change. So that old `click`
   * listener can be removed and new listener can be added.
   *
   * In touchstart added touchend listener to block click event.
   *
   * @param {MouseEvent | TouchEvent} event
   */
  const start = event => {
    if (event.type === 'mousedown' && event.target) {
      event.target.addEventListener('click', clickHandler, options);
      window.addEventListener('mousemove', mouseMoveHandler);
      target.current = event.target;
    } else {
      window.addEventListener('touchend', touchEndHandler, options);
    }

    // add timeout if none
    if (timeout.current === null) {
      timeout.current = setTimeout(() => {
        onLongPress();
        longPressTriggered.current = true;
      }, delay);
    }

    passClick.current = true;
    longPressTriggered.current = false;
  };

  const reset = () => {
    if (timeout.current !== null) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }

    longPressTriggered.current = false;
  };

  /** @param {MouseEvent | TouchEvent} event */
  const clear = event => {
    if (event.type === 'mouseup') {
      // remove mousemove listener
      window.removeEventListener('mousemove', mouseMoveHandler);
    }

    if (longPressTriggered.current) passClick.current = false;

    reset();
  };

  const mouseLeaveClear = () => {
    // remove click listener
    target.current &&
      target.current.removeEventListener('click', clickHandler, options);
    // remove mousemove listener
    window.removeEventListener('mousemove', mouseMoveHandler);

    reset();
  };

  return {
    onMouseDown: start,
    onTouchStart: start,
    onTouchMove: clear,
    onMouseUp: clear,
    onMouseLeave: mouseLeaveClear,
    onTouchEnd: clear,
  };
};
