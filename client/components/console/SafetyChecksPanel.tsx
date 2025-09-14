import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Wrench } from "lucide-react";

const CHECKS = [
  "Sensors",
  "Motors",
  "Servos",
  "Flight Controller",
  "IMU",
  "GPS",
  "Telemetry",
  "Power",
] as const;

type CheckKey = (typeof CHECKS)[number];

export function SafetyChecksPanel({
  verified,
  setVerified,
}: {
  verified: boolean;
  setVerified: (b: boolean) => void;
}) {
  const [progress, setProgress] = useState<Record<CheckKey, number>>(
    () => Object.fromEntries(CHECKS.map((c) => [c, 0])) as any,
  );
  const [code, setCode] = useState("");

  function run(k: CheckKey) {
    if (progress[k] > 0 && progress[k] < 100) return;
    setProgress((p) => ({ ...p, [k]: 1 }));
  }

  useEffect(() => {
    const id = window.setInterval(() => {
      setProgress((p) => {
        const n: any = { ...p };
        CHECKS.forEach((k) => {
          if (n[k] > 0 && n[k] < 100) n[k] = Math.min(100, n[k] + 7);
        });
        return n;
      });
    }, 120);
    return () => clearInterval(id);
  }, []);

  const allPassed = CHECKS.every((k) => progress[k] === 100);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" /> Safety Checks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {CHECKS.map((k) => (
            <div key={k} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  {k}{" "}
                  {progress[k] === 100 ? (
                    <span className="text-emerald-400 text-xs ml-2">
                      Good to GO
                    </span>
                  ) : null}
                </div>
                <Button size="sm" variant="outline" onClick={() => run(k)}>
                  {progress[k] === 0 ? "Run" : "Check"}
                </Button>
              </div>
              <Progress value={progress[k]} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verify Safety</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-muted-foreground">
            All checks must pass, then enter passcode
          </div>
          <Input
            placeholder="Passcode"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={!allPassed}
          />
          <Button
            disabled={!allPassed || code !== "2413"}
            onClick={() => setVerified(true)}
            className="w-full"
          >
            {verified ? "Verified" : "Verify"}
          </Button>
          {verified ? (
            <div className="text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Safety Verified
            </div>
          ) : null}
          <Separator />
          <div className="text-xs text-muted-foreground">
            Proceed to Arming once verified.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
