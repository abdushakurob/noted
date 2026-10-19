const BASE = process.env.NOTED_DAEMON_URL ?? "http://127.0.0.1:3737";

export async function daemonFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, init);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`daemon ${res.status}: ${text}`);
  }
  return res.json();
}
