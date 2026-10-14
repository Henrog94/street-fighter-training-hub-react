import { useCallback, useEffect, useState } from "react";

export default function useLocalData(url, fallback) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt(n => n + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    fetch(url, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status} while requesting ${url}`);
        return response.json();
      })
      .then(value => { if (!controller.signal.aborted) { setData(value); setLoading(false); } })
      .catch(err => { if (!controller.signal.aborted) { setError(err.message); setLoading(false); } });
    return () => controller.abort();
  }, [url, attempt]);
  return { data, loading, error, retry };
}
