export function debounce(callback, wait) {
  let timeout, context, args;
  let lastCall = 0;

  function run() {
    callback.apply(context, args);
    args = null;
    context = null;
  }

  function later() {
    const delta = Date.now() - lastCall;

    if (delta < wait && delta >= 0) {
      timeout = setTimeout(later, wait - delta);
    } else {
      clearTimeout(timeout);
      timeout = null;
      run();
    }
  }

  const debounced = () => {
    context = this;
    args = arguments;
    lastCall = Date.now();

    if (!timeout) {
      timeout = setTimeout(later, wait);
    }
  };

  debounced.trigger = () => {
    debounced.clear();
    run();
  };

  debounced.flush = () => {
    if (timeout) debounced.trigger();
  };

  debounced.clear = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
}
