import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function CountdownStarter() {
  const [running, setRunning] = useState(false);
  const [count, setCount] = useState(10);

  useEffect(() => {
    let timer: any;
    if (running && count > 0) {
      timer = setTimeout(() => setCount((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [running, count]);

  return (
    <div className="mt-3">
      {!running ? (
        <Button onClick={() => { setRunning(true); setCount(10); }} variant="destructive">Start Countdown (10s)</Button>
      ) : (
        <div className="p-3 rounded border bg-secondary/10 text-center">
          <div className="text-sm text-muted-foreground">Countdown</div>
          <div className="text-3xl font-mono font-bold">{count}</div>
        </div>
      )}
    </div>
  );
}
