// Shared hook: fetch a JSON file from /data/ once and cache it in module scope
import { useState, useEffect } from 'react';

const cache: Record<string, unknown> = {};
const listeners: Record<string, Array<(v: unknown) => void>> = {};

function subscribe(path: string, cb: (v: unknown) => void) {
  if (!listeners[path]) listeners[path] = [];
  listeners[path].push(cb);
  return () => { listeners[path] = listeners[path].filter((f) => f !== cb); };
}

function notify(path: string, value: unknown) {
  listeners[path]?.forEach((cb) => cb(value));
}

export function useJsonData<T>(path: string): T | null {
  // Always read from cache synchronously on every render init
  const [data, setData] = useState<T | null>(() => (cache[path] as T) ?? null);

  useEffect(() => {
    // Already cached — sync state if it somehow diverged
    if (cache[path]) {
      setData(cache[path] as T);
      return;
    }
    // Subscribe to be notified when another instance finishes the fetch
    const unsub = subscribe(path, (v) => setData(v as T));

    fetch(path)
      .then((r) => r.json())
      .then((json: T) => {
        cache[path] = json;
        notify(path, json);
      })
      .catch(() => {})
      .finally(() => unsub());

    return unsub;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  return data;
}
