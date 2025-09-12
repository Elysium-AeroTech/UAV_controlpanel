import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Gamepad2, Key, Radar, Scan, Move, Crosshair, SunMoon, Target, Zap, Eye, EyeOff, Satellite, Shield, Compass, AlertTriangle } from "lucide-react";

const COMMANDER_CODE = "980752";

export function ManualControlPanel({ speedMS, altitudeM, powerPct }: { speedMS: number; altitudeM: number; powerPct: number }) {
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState("");
  const [confirmUnlock, setConfirmUnlock] = useState(false);
  const [aborted, setAborted] = useState(false);
  const [motorsKilled, setMotorsKilled] = useState(false);
  const [parachuteDeployed, setParachuteDeployed] = useState(false);
  const mach = speedMS / 340.29;
  const kmph = speedMS * 3.6;

  const doEmergencyAbort = () => {
    if (!confirm("Confirm EMERGENCY ABORT? This will kill motors and deploy parachute.")) return;
    setAborted(true);
    setMotorsKilled(true);
    setParachuteDeployed(true);
  };

  const tryUnlock = () => {
    if (unlocked) return;
    if (!confirmUnlock) {
      // first click
      setConfirmUnlock(true);
      setTimeout(() => setConfirmUnlock(false), 3500);
      return;
    }
    if (code === COMMANDER_CODE) {
      setUnlocked(true);
    } else {
      alert("Invalid commander code.");
      setConfirmUnlock(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Gamepad2 className="h-5 w-5 text-primary" /> Manual Flight Console</CardTitle>
      </CardHeader>
      <CardContent>
        {!unlocked ? (
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">Enter Commander's Code to unlock manual controls.</div>
            <div className="flex gap-2 max-w-md">
              <Input placeholder="Commander's Code" value={code} onChange={(e) => setCode(e.target.value)} />
              <Button onClick={() => setUnlocked(code === COMMANDER_CODE)}><Key className="h-4 w-4 mr-2" /> Unlock</Button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Left: camera + control grid */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative h-72 w-full rounded border border-primary/40 bg-black/60 overflow-hidden">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/58/No_video_image.svg" alt="UAV Not linked" className="absolute inset-0 h-full w-full object-cover opacity-20" />
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(0,255,120,0.08)_4px)]" />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="rounded-full h-28 w-28 border-2 border-primary/60" />
                  <div className="absolute h-0.5 w-24 bg-primary/60" />
                </div>
                <div className="absolute bottom-2 left-2 text-xs text-muted-foreground">UAV Not linked</div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                <Button variant="outline" className="justify-start" disabled={aborted}><Crosshair className="h-4 w-4 mr-2" /> Lock Target</Button>
                <Button variant="outline" className="justify-start" disabled={aborted}><Radar className="h-4 w-4 mr-2" /> Track</Button>
                <Button variant="outline" className="justify-start" disabled={aborted}><Scan className="h-4 w-4 mr-2" /> Calibrate</Button>
                <Button variant="outline" className="justify-start" disabled={aborted}><Move className="h-4 w-4 mr-2" /> Stabilize</Button>
                <Button variant="outline" className="justify-start" disabled={aborted}><SunMoon className="h-4 w-4 mr-2" /> Night</Button>
                <Button variant="outline" className="justify-start" disabled={aborted}><Eye className="h-4 w-4 mr-2" /> Zoom +</Button>
                <Button variant="outline" className="justify-start" disabled={aborted}><EyeOff className="h-4 w-4 mr-2" /> Zoom -</Button>
                <Button variant="outline" className="justify-start" disabled={aborted}><Target className="h-4 w-4 mr-2" /> Waypoint</Button>
                <Button variant="outline" className="justify-start" disabled={aborted}><Compass className="h-4 w-4 mr-2" /> Hold</Button>
                <Button variant="outline" className="justify-start" disabled={aborted}><Satellite className="h-4 w-4 mr-2" /> Link</Button>
                <Button variant="outline" className="justify-start" disabled={aborted}><Shield className="h-4 w-4 mr-2" /> Safe Mode</Button>
                <Button variant="destructive" className="justify-start" onClick={doEmergencyAbort}><AlertTriangle className="h-4 w-4 mr-2" /> Emergency</Button>
              </div>
              {aborted && (
                <div className="rounded border border-red-500/50 bg-red-500/10 p-3 text-sm">
                  <div className="font-semibold text-red-400">EMERGENCY ABORT EXECUTED</div>
                  <div className="mt-1 text-red-300">Motors: {motorsKilled ? "KILLED" : "ACTIVE"} • Parachute: {parachuteDeployed ? "DEPLOYED" : "STOWED"}</div>
                </div>
              )}
            </div>

            {/* Right: HUD */}
            <div className="rounded border bg-secondary/10 p-4">
              <div className="text-sm text-muted-foreground mb-2">HUD</div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded border bg-background">
                  <div className="text-muted-foreground">Speed</div>
                  <div className="font-mono text-lg">{aborted ? 0 : kmph.toFixed(0)} km/h</div>
                  <div className="font-mono text-xs">Mach {aborted ? 0 : mach.toFixed(2)}</div>
                </div>
                <div className="p-3 rounded border bg-background">
                  <div className="text-muted-foreground">Altitude</div>
                  <div className="font-mono text-lg">{altitudeM.toFixed(0)} m</div>
                </div>
                <div className="p-3 rounded border bg-background">
                  <div className="text-muted-foreground">Power</div>
                  <div className="font-mono text-lg">{aborted ? 0 : powerPct}%</div>
                </div>
                <div className="p-3 rounded border bg-background">
                  <div className="text-muted-foreground">Systems</div>
                  <div className={`font-mono text-lg ${aborted ? "text-red-400" : "text-emerald-400"}`}>{aborted ? "ABORTED" : "Nominal"}</div>
                </div>
              </div>
              <Separator className="my-3" />
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="justify-start" disabled={aborted}><Zap className="h-4 w-4 mr-2" /> Boost</Button>
                <Button variant="outline" className="justify-start" disabled={aborted}><Move className="h-4 w-4 mr-2" /> Auto-level</Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
