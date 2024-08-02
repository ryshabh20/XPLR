import { useEffect, useRef } from "react";

function useDebounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      func.apply({}, args);
    }, delay);
  } as T;
}

export default useDebounce;
