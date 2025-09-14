import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, User } from "lucide-react";
import {
  TelemetryPanel,
  type Health,
} from "@/components/console/TelemetryPanel";
// // import { DestinationPanel } from "@/components/console/DestinationPanel";
import { NavigationPanel } from "@/components/console/NavigationPanel";
import { ArmingPanel } from "@/components/console/ArmingPanel";
import { SafetyChecksPanel } from "@/components/console/SafetyChecksPanel";
import { CommunicationPanel } from "@/components/console/CommunicationPanel";
import { LaunchPanel } from "@/components/console/LaunchPanel";
import { ManualControlPanel } from "@/components/console/ManualControlPanel";
import { TestConsole } from "@/components/console/TestConsole";
import { TopNav } from "@/components/console/TopNav";

const CREW = [
  { name: "prerit roshan", password: "980752" },
  { name: "raghav jindal", password: "13579" },
] as const;

export default function Index() {
  // Auth state
  const [commander, setCommander] = useState<string>("");
  const [password, setPassword] = useState("");

  const authOk = CREW.some(
    (c) => c.name === commander && c.password === password,
  );
  const isAuthed = authOk;

  // Telemetry state (live or test-injected)
  const [rpm, setRpm] = useState(6200);
  const [battery, setBattery] = useState(88);
  const [speed, setSpeed] = useState(120);
  const [motorTemp, setMotorTemp] = useState(72);
  const [altitude, setAltitude] = useState(1500);
  const health: Health =
    motorTemp < 90 && battery > 40
      ? "OK"
      : motorTemp < 120
        ? "Warning"
        : "Critical";

  // Destination
  const [lat, setLat] = useState(28.6139);
  const [lon, setLon] = useState(77.209);
  const [curLat, setCurLat] = useState<number | null>(null);
  const [curLon, setCurLon] = useState<number | null>(null);
  const [targetLocked, setTargetLocked] = useState(false);

  const systemStatus = useMemo(
    () => (isAuthed ? "SECURE" : "LOCKED"),
    [isAuthed],
  );

  // Safety shared state
  const [safetyVerified, setSafetyVerified] = useState(false);
  const [safetyArmed, setSafetyArmed] = useState(false);

  return (
    <div className="min-h-screen">
      <TopNav status={systemStatus} commanderName={commander || undefined} />
      <main className="container mx-auto px-4 py-6">
        {!isAuthed ? (
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" /> Authorization
                Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Commander</Label>
                  <Input
                    placeholder="prerit roshan / raghav jindal"
                    value={commander}
                    onChange={(e) => setCommander(e.target.value)}
                  />
                  <div className="text-xs text-muted-foreground">
                    Type the name exactly
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Badge
                    variant={authOk ? "secondary" : "outline"}
                    className="mt-6"
                  >
                    <User className="h-3 w-3 mr-1" />{" "}
                    {authOk ? "Validated" : "Pending"}
                  </Badge>
                </div>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button disabled={!isAuthed}>Enter Command</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Tabs defaultValue="dashboard">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="arming">Arming</TabsTrigger>
                  <TabsTrigger value="navigation">Navigation</TabsTrigger>
                  <TabsTrigger value="manual">Manual</TabsTrigger>
                  <TabsTrigger value="safety">Safety</TabsTrigger>
                  <TabsTrigger value="comms">Communication</TabsTrigger>
                  <TabsTrigger value="launch">Launch</TabsTrigger>
                </TabsList>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>Commander: {commander}</span>
                </div>
              </div>

              <TabsContent value="dashboard" className="mt-4 space-y-4">
                <TelemetryPanel
                  rpm={rpm}
                  batteryPct={battery}
                  speed={speed}
                  motorTemp={motorTemp}
                  health={health}
                />
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary" /> Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid sm:grid-cols-3 gap-3 text-sm">
                    <div className="p-3 rounded border bg-secondary/30">
                      <div className="text-muted-foreground">Login</div>
                      <div className="font-mono">{authOk ? "OK" : "FAIL"}</div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="arming" className="mt-4">
                <ArmingPanel armed={safetyArmed} setArmed={setSafetyArmed} />
              </TabsContent>

              <TabsContent value="navigation" className="mt-4">
                <NavigationPanel
                  curLat={curLat ?? 28.6139}
                  curLon={curLon ?? 77.209}
                  speedMS={speed}
                  lat={lat}
                  lon={lon}
                  onSet={(la, lo) => {
                    setLat(la);
                    setLon(lo);
                  }}
                  locked={targetLocked}
                  onLockedChange={setTargetLocked}
                />
              </TabsContent>

              <TabsContent value="manual" className="mt-4">
                <ManualControlPanel
                  speedMS={speed}
                  altitudeM={altitude}
                  powerPct={battery}
                />
              </TabsContent>

              <TabsContent value="safety" className="mt-4">
                <SafetyChecksPanel
                  verified={safetyVerified}
                  setVerified={setSafetyVerified}
                />
              </TabsContent>

              <TabsContent value="comms" className="mt-4">
                <CommunicationPanel />
              </TabsContent>

              <TabsContent value="launch" className="mt-4">
                <LaunchPanel
                  authOk={authOk}
                  safetyVerified={safetyVerified}
                  safetyArmed={safetyArmed}
                  telemetryOk={health === "OK"}
                  batteryPct={battery}
                  navLocked={true}
                  targetLocked={targetLocked}
                />
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>

      <TestConsole
        rpm={rpm}
        battery={battery}
        speed={speed}
        motorTemp={motorTemp}
        altitude={altitude}
        setRpm={setRpm}
        setBattery={setBattery}
        setSpeed={setSpeed}
        setMotorTemp={setMotorTemp}
        setAltitude={setAltitude}
        requireTwoPerson={false}
        setRequireTwoPerson={() => {}}
      />
    </div>
  );
}
