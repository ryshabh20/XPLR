export function useThrottle<T extends (...args: any[]) => void>(
  mainFn: T,
  delay: number
) {
  let timerFlag: NodeJS.Timeout | null = null;
  return (...args: any) => {
    if (timerFlag === null) {
      mainFn(...args);
      timerFlag = setTimeout(() => {
        timerFlag = null;
      }, delay);
    }
  };
}
