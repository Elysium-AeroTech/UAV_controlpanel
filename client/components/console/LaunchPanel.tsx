import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle2,
  AlertTriangle,
  Shield,
  Timer,
  LockKeyhole,
  Satellite,
  Battery,
  Route,
  Radio,
  Navigation,
  Rocket,
  KeyRound,
} from "lucide-react";

export function LaunchPanel({
  authOk,
  safetyVerified,
  safetyArmed,
  telemetryOk,
  batteryPct,
  navLocked,
  targetLocked,
}: {
  authOk: boolean;
  safetyVerified: boolean;
  safetyArmed: boolean;
  telemetryOk: boolean;
  batteryPct: number;
  navLocked: boolean;
  targetLocked: boolean;
}) {
  // Arm-to-Launch PIN
  const [pin, setPin] = useState("");
  const pinOk = pin === "1458";

  // Final keypad
  const [showPad, setShowPad] = useState(false);
  const [pad, setPad] = useState("");
  const shuffled = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => i).sort(() => Math.random() - 0.5),
    [],
  );
  const finalOk = pad === "12475242907";

  // Countdown
  const [t, setT] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);
  useEffect(() => {
    if (t == null) return;
    if (t <= 0) return;
    timerRef.current = window.setTimeout(() => setT((x) => (x ?? 0) - 1), 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [t]);

  const preconds = [
    {
      label: "POWER ROUTE",
      value: "GRID / BATTERY / BACKUP",
      ok: true,
      icon: Battery,
    },
    { label: "COMM LINK", value: "Primary / Secondary", ok: true, icon: Radio },
    {
      label: "NAV LOCK",
      value: navLocked ? "Locked" : "Not locked",
      ok: navLocked,
      icon: Navigation,
    },
    {
      label: "TARGET LOCK",
      value: targetLocked ? "Locked" : "Not locked",
      ok: targetLocked,
      icon: LockKeyhole,
    },
    {
      label: "TRAJECTORY CALC",
      value: navLocked && targetLocked ? "Ready" : "Pending",
      ok: navLocked && targetLocked,
      icon: Route,
    },
    {
      label: "BATTERY",
      value: `${batteryPct}%`,
      ok: batteryPct > 30,
      icon: Battery,
    },
    {
      label: "STABILIZATION",
      value: telemetryOk ? "OK" : "DEGRADED",
      ok: telemetryOk,
      icon: Shield,
    },
    {
      label: "SENSOR SYNC",
      value: safetyVerified ? "OK" : "PENDING",
      ok: safetyVerified,
      icon: Satellite,
    },
    {
      label: "REDUNDANCY",
      value: navLocked && targetLocked ? "OK" : "PENDING",
      ok: navLocked && targetLocked,
      icon: Shield,
    },
    {
      label: "ENVIRONMENTAL",
      value: "Weather & wind OK",
      ok: true,
      icon: AlertTriangle,
    },
  ];

  const canArmToLaunch =
    authOk && safetyVerified && safetyArmed && preconds.every((p) => p.ok);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Pre-Conditions</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          {preconds.map((p) => (
            <div
              key={p.label}
              className="p-3 rounded border bg-background flex items-center justify-between"
            >
              <div>
                <div className="text-muted-foreground">{p.label}</div>
                <div className="font-mono">{p.value}</div>
              </div>
              <Badge variant={p.ok ? "secondary" : "destructive"}>
                {p.ok ? "OK" : "CHECK"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" /> Arm-to-Launch
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            <div className="p-3 rounded border bg-background">
              <div className="text-muted-foreground">Geo-Fence</div>
              <div className="font-mono">OK</div>
            </div>
            <div className="p-3 rounded border bg-background">
              <div className="text-muted-foreground">Payload</div>
              <div className="font-mono">Safe → Armed</div>
            </div>
            <div className="p-3 rounded border bg-background">
              <div className="text-muted-foreground">Trajectory</div>
              <div className="font-mono">Loaded</div>
            </div>
            <div className="p-3 rounded border bg-background">
              <div className="text-muted-foreground">Flight Plan</div>
              <div className="font-mono">Sealed</div>
            </div>
            <div className="p-3 rounded border bg-background">
              <div className="text-muted-foreground">Uplink/Downlink</div>
              <div className="font-mono">Secure</div>
            </div>
            <div className="p-3 rounded border bg-background">
              <div className="text-muted-foreground">Backup Channel</div>
              <div className="font-mono">Armed</div>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-2">
            <input
              className="flex h-10 rounded-md border px-3 text-sm bg-background"
              placeholder="PIN / Code"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            <Button
              disabled={!canArmToLaunch || !pinOk}
              onClick={() => setShowPad(true)}
              className="flex items-center gap-2"
            >
              <KeyRound className="h-4 w-4" /> Proceed
            </Button>
          </div>
          {!canArmToLaunch ? (
            <Alert>
              <AlertDescription>
                Resolve all pre-conditions, safety and arming before proceeding.
              </AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>

      {showPad ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LockKeyhole className="h-5 w-5 text-primary" /> Final
              Super-Secure Launch
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              <div className="p-3 rounded border bg-background">
                <div className="text-muted-foreground">Dual Officer</div>
                <div className="font-mono">Confirmed</div>
              </div>
              <div className="p-3 rounded border bg-background">
                <div className="text-muted-foreground">Payload</div>
                <div className="font-mono">Armed</div>
              </div>
              <div className="p-3 rounded border bg-background">
                <div className="text-muted-foreground">Navigation</div>
                <div className="font-mono">Locked</div>
              </div>
              <div className="p-3 rounded border bg-background">
                <div className="text-muted-foreground">Propulsion</div>
                <div className="font-mono">Ready</div>
              </div>
              <div className="p-3 rounded border bg-background">
                <div className="text-muted-foreground">Telemetry</div>
                <div className="font-mono">Linked</div>
              </div>
              <div className="p-3 rounded border bg-background">
                <div className="text-muted-foreground">Interlocks</div>
                <div className="font-mono">Cleared</div>
              </div>
              <div className="p-3 rounded border bg-background">
                <div className="text-muted-foreground">Abort</div>
                <div className="font-mono">Standby</div>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Enter 11-digit passcode
              </div>
              <div className="grid grid-cols-5 gap-2 max-w-sm">
                {shuffled.map((n) => (
                  <Button
                    key={n}
                    variant="outline"
                    onClick={() => setPad((p) => (p + String(n)).slice(0, 11))}
                  >
                    {n}
                  </Button>
                ))}
                <Button variant="destructive" onClick={() => setPad("")}>
                  Clear
                </Button>
              </div>
              <div className="font-mono">{pad.replace(/./g, "•")}</div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                disabled={!finalOk}
                onClick={() => setT(10)}
                className="flex items-center gap-2"
              >
                <Timer className="h-4 w-4" /> Start Countdown
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setT(null);
                  setPad("");
                }}
              >
                Abort
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {t != null ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" /> Launch
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-bold">T-{t}s</div>
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                disabled={t <= 2}
                onClick={() => setT(null)}
              >
                Abort
              </Button>
            </div>
            {t === 0 ? (
              <div className="text-center text-2xl text-emerald-400 animate-pulse">
                MISSILE LAUNCHED
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
