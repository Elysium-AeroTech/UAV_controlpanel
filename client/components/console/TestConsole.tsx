import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { TestTube2 } from "lucide-react";
import { useState } from "react";

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

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="fixed bottom-6 right-6 shadow-lg" variant="secondary">
          <TestTube2 className="h-4 w-4 mr-2" /> Test Console
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Software Test Console</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="twoperson">Require Two-Person Consent</Label>
              <Switch id="twoperson" checked={requireTwoPerson} onCheckedChange={setRequireTwoPerson} />
            </div>
            <p className="text-xs text-muted-foreground">Turn off to bypass Prerit & Raghav codes (for testing only).</p>
            <Separator />
            <div>
              <Label>Inject RPM</Label>
              <Input type="number" value={rpm} onChange={(e) => setRpm(Number(e.target.value))} />
            </div>
            <div>
              <Label>Inject Battery %</Label>
              <Input type="number" value={battery} onChange={(e) => setBattery(Number(e.target.value))} />
            </div>
            <div>
              <Label>Inject Speed (m/s)</Label>
              <Input type="number" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
            </div>
            <div>
              <Label>Inject Motor Temp (°C)</Label>
              <Input type="number" value={motorTemp} onChange={(e) => setMotorTemp(Number(e.target.value))} />
            </div>
            <div>
              <Label>Inject Altitude (m)</Label>
              <Input type="number" value={altitude} onChange={(e) => setAltitude(Number(e.target.value))} />
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Use this console to simulate data streams and bypass two-person consent for testing only.</p>
            <ul className="list-disc list-inside">
              <li>Toggle two-person consent requirement</li>
              <li>Inject telemetry values (RPM, Battery, Speed, Temp, Altitude)</li>
              <li>Values immediately affect the dashboard and controls</li>
            </ul>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
