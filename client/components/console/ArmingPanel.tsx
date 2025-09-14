import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Play, Power, Shield, Wrench } from "lucide-react";

export function ArmingPanel({
  armed,
  setArmed,
}: {
  armed: boolean;
  setArmed: (b: boolean) => void;
}) {
  const [runs, setRuns] = useState({
    systems: 0,
    calibrate: 0,
    mission: 0,
    charge: 0,
    enable: 0,
  });
  const [coverFlipped, setCoverFlipped] = useState(false);
  const [pass, setPass] = useState("");
  const holdTimer = useRef<number | null>(null);

  function run(key: keyof typeof runs) {
    if (runs[key] > 0 && runs[key] < 100) return;
    setRuns((r) => ({ ...r, [key]: 1 }));
  }

  useEffect(() => {
    const id = window.setInterval(() => {
      setRuns((r) => {
        const n: typeof r = { ...r };
        (Object.keys(n) as (keyof typeof n)[]).forEach((k) => {
          if (n[k] > 0 && n[k] < 100) n[k] = Math.min(100, n[k] + 5);
        });
        return n;
      });
    }, 120);
    return () => clearInterval(id);
  }, []);

  const allPrepDone = Object.values(runs).every((v) => v === 100);
  const codeOk = pass === "7825";

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" /> Arming Preparation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>Run Systems Check</div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => run("systems")}
              >
                <Play className="h-4 w-4 mr-1" />{" "}
                {runs.systems === 0 ? "Run" : "Re-Run"}
              </Button>
            </div>
            <Progress value={runs.systems} />
            {runs.systems === 100 ? (
              <div className="text-xs text-emerald-400">System Ready</div>
            ) : null}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>Calibrate Sensors</div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => run("calibrate")}
              >
                <Play className="h-4 w-4 mr-1" />{" "}
                {runs.calibrate === 0 ? "Run" : "Re-Run"}
              </Button>
            </div>
            <Progress value={runs.calibrate} />
            {runs.calibrate === 100 ? (
              <div className="text-xs text-emerald-400">System Ready</div>
            ) : null}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>Load Mission Profile</div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => run("mission")}
              >
                <Play className="h-4 w-4 mr-1" />{" "}
                {runs.mission === 0 ? "Run" : "Re-Run"}
              </Button>
            </div>
            <Progress value={runs.mission} />
            {runs.mission === 100 ? (
              <div className="text-xs text-emerald-400">System Ready</div>
            ) : null}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>Charge Warhead</div>
              <Button size="sm" variant="outline" onClick={() => run("charge")}>
                <Play className="h-4 w-4 mr-1" />{" "}
                {runs.charge === 0 ? "Run" : "Re-Run"}
              </Button>
            </div>
            <Progress value={runs.charge} />
            {runs.charge === 100 ? (
              <div className="text-xs text-emerald-400">System Ready</div>
            ) : null}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>Enable Firing</div>
              <Button size="sm" variant="outline" onClick={() => run("enable")}>
                <Play className="h-4 w-4 mr-1" />{" "}
                {runs.enable === 0 ? "Run" : "Re-Run"}
              </Button>
            </div>
            <Progress value={runs.enable} />
            {runs.enable === 100 ? (
              <div className="text-xs text-emerald-400">System Ready</div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" /> Hold-to-Arm
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Button
              variant={coverFlipped ? "secondary" : "outline"}
              onClick={() => setCoverFlipped((v) => !v)}
            >
              {coverFlipped ? "Safety Cover: OPEN" : "Flip Safety Cover"}
            </Button>
            <input
              className="flex h-10 rounded-md border px-3 text-sm bg-background"
              placeholder="Passcode"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <Separator />
          <div className="flex items-center gap-3">
            <Button
              disabled={!allPrepDone || !coverFlipped || !codeOk}
              onMouseDown={() => {
                if (!allPrepDone || !coverFlipped || !codeOk) return;
                holdTimer.current = window.setTimeout(
                  () => setArmed(true),
                  1500,
                );
              }}
              onMouseUp={() => {
                if (holdTimer.current) {
                  clearTimeout(holdTimer.current);
                  holdTimer.current = null;
                }
              }}
              onMouseLeave={() => {
                if (holdTimer.current) {
                  clearTimeout(holdTimer.current);
                  holdTimer.current = null;
                }
              }}
            >
              <Power className="h-4 w-4 mr-2" /> Hold 1.5s to ARM
            </Button>
            {armed ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> ARMED
              </span>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
