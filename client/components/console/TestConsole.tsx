import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { TestTube2 } from "lucide-react";
import { useState } from "react";
import { X } from "lucide-react";

export function TestConsole({
  rpm,
  battery,
  speed,
  motorTemp,
  altitude,
  setRpm,
  setBattery,
  setSpeed,
  setMotorTemp,
  setAltitude,
  requireTwoPerson,
  setRequireTwoPerson,
}: {
  rpm: number;
  battery: number;
  speed: number;
  motorTemp: number;
  altitude: number;
  setRpm: (n: number) => void;
  setBattery: (n: number) => void;
  setSpeed: (n: number) => void;
  setMotorTemp: (n: number) => void;
  setAltitude: (n: number) => void;
  requireTwoPerson: boolean;
  setRequireTwoPerson: (b: boolean) => void;
}) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 flex items-center gap-2 rounded-md bg-secondary/90 px-3 py-2 shadow-lg hover:shadow-lg"
        aria-label="Open Test Console"
      >
        <TestTube2 className="h-4 w-4" />
        <span className="text-xs">Test Console</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 rounded-md border bg-popover p-3 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TestTube2 className="h-4 w-4 text-primary" />
          <div className="text-sm font-semibold">Test Console</div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="relative rounded-full bg-black/90 p-1 text-white hover:shadow-[0_0_18px_rgba(16,185,129,0.45)]"
          aria-label="Close Test Console"
          title="Close"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>

      <div className="p-2 grid grid-cols-1 gap-2 text-sm">
        <div className="flex items-center justify-between">
          <Label htmlFor="twoperson">Require Two-Person</Label>
          <Switch id="twoperson" checked={requireTwoPerson} onCheckedChange={setRequireTwoPerson} />
        </div>
        <Separator />
        <div>
          <Label>Inject RPM</Label>
          <Input type="number" value={rpm} onChange={(e) => setRpm(Number(e.target.value))} />
        </div>
        <div>
          <Label>Inject Battery %</Label>
          <Input type="number" value={battery} onChange={(e) => setBattery(Number(e.target.value))} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Speed (m/s)</Label>
            <Input type="number" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
          </div>
          <div>
            <Label>Motor Temp (°C)</Label>
            <Input type="number" value={motorTemp} onChange={(e) => setMotorTemp(Number(e.target.value))} />
          </div>
        </div>
        <div>
          <Label>Altitude (m)</Label>
          <Input type="number" value={altitude} onChange={(e) => setAltitude(Number(e.target.value))} />
        </div>
        <div className="text-xs text-muted-foreground">Small popup for quick testing. Close with the X.</div>
      </div>
    </div>
  );
}
