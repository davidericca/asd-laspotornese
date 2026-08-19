const TIMEOUT_MS = 1000;

export const fetchWithTimeout: typeof fetch = (input, init) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  return fetch(input, { ...init, signal: controller.signal }).finally(() => {
    clearTimeout(timeoutId);
  });
};
