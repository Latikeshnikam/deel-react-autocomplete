import { useRef } from "react";

const useDebounce = (callback: Function, delay: number) => {
  const timeoutRef = useRef<any>(null);

  return (...args: any[]) => {
    clearTimeout(timeoutRef.current as number);
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

export default useDebounce;
