import { useEffect, useState } from "react";
import { Cloud, WifiOff } from "lucide-react";
export default function OfflineStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  const [status, setStatus] = useState<"preparing" | "ready" | "unavailable">(
    import.meta.env.PROD ? "preparing" : "unavailable",
  );
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    let cancelled = false;
    if (import.meta.env.PROD && "serviceWorker" in navigator) {
      const base = new URL(import.meta.env.BASE_URL, document.baseURI);
      navigator.serviceWorker
        .register(new URL("sw.js", base), {
          scope: base.href,
          updateViaCache: "none",
        })
        .then(() => navigator.serviceWorker.ready)
        .then(() => {
          if (!cancelled) setStatus("ready");
        })
        .catch(() => {
          if (!cancelled) setStatus("unavailable");
        });
    } else setStatus("unavailable");
    return () => {
      cancelled = true;
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  if (!import.meta.env.PROD && online) return null;
  return (
    <div className="offline-status" role="status">
      {online ? <Cloud size={16} /> : <WifiOff size={16} />}
      <span>
        {!online
          ? "You’re offline. Keep focusing—music needs internet, but your timer and saved ambience are here."
          : status === "ready"
            ? "Your cozy corner is ready offline."
            : status === "preparing"
              ? "Saving your cozy corner for offline use…"
              : "Offline setup is unavailable. You can keep studying while this page is open."}
      </span>
    </div>
  );
}
