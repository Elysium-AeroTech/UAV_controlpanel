import { useMemo, useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VoiceAuth } from "@/components/console/VoiceAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, KeyRound, User, Users } from "lucide-react";
import { TelemetryPanel, type Health } from "@/components/console/TelemetryPanel";
import { DestinationPanel } from "@/components/console/DestinationPanel";
import { SafetyPanel } from "@/components/console/SafetyPanel";
import { LaunchSequencePanel } from "@/components/console/LaunchSequencePanel";
import { ManualControlPanel } from "@/components/console/ManualControlPanel";
import { TestConsole } from "@/components/console/TestConsole";
import { TopNav } from "@/components/console/TopNav";

type Role = "Commander" | "Navigator" | "Armer";

const HARD = {
  email: "commander.prerit@elysium.io",
  password: "Prerit@9807",
  commanderCode: "980752",
  preritCode: "980752",
  raghavCode: "13579",
  navigatorCode: "246810",
  armerCode: "112233",
};

export default function Index() {
  // Global role
  const [role, setRole] = useState<Role>("Commander");

  // Commander auth
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [commanderCode, setCommanderCode] = useState("");
  const [prerit, setPrerit] = useState("");
  const [raghav, setRaghav] = useState("");
  const [requireTwoPerson, setRequireTwoPerson] = useState(true);

  // Navigator & Armer auth
  const [navCode, setNavCode] = useState("");
  const [armCode, setArmCode] = useState("");

  const emailOk = email === HARD.email && password === HARD.password;
  const commanderOk = commanderCode === HARD.commanderCode;
  const twoOk = prerit === HARD.preritCode && raghav === HARD.raghavCode;

  const commanderAuthed = emailOk && commanderOk && (requireTwoPerson ? twoOk : true);
  const navigatorAuthed = navCode === HARD.navigatorCode;
  const armerAuthed = armCode === HARD.armerCode || armCode === HARD.commanderCode;

  const isAuthed = role === "Commander" ? commanderAuthed : role === "Navigator" ? navigatorAuthed : armerAuthed;

  // Telemetry state (live or test-injected)
  const [rpm, setRpm] = useState(6200);
  const [battery, setBattery] = useState(88);
  const [speed, setSpeed] = useState(120);
  const [motorTemp, setMotorTemp] = useState(72);
  const [altitude, setAltitude] = useState(1500);
  const health: Health = motorTemp < 90 && battery > 40 ? "OK" : motorTemp < 120 ? "Warning" : "Critical";

  // Destination
  const [lat, setLat] = useState(28.6139);
  const [lon, setLon] = useState(77.2090);
  const [curLat, setCurLat] = useState<number | null>(null);
  const [curLon, setCurLon] = useState<number | null>(null);

  const systemStatus = useMemo(() => (isAuthed ? "SECURE" : "LOCKED"), [isAuthed]);

  // Safety shared state
  const [safetyVerified, setSafetyVerified] = useState(false);
  const [safetyArmed, setSafetyArmed] = useState(false);

  // cursor background movement and input focus haze
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty("--mouse-x", `${x}%`);
      document.documentElement.style.setProperty("--mouse-y", `${y}%`);
    };
    const onFocus = (e: FocusEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (t.tagName !== "INPUT" && t.tagName !== "TEXTAREA") return;
      const rect = (t as HTMLElement).getBoundingClientRect();
      const handle = (ev: MouseEvent) => {
        const fx = ((ev.clientX - rect.left) / rect.width) * 100;
        const fy = ((ev.clientY - rect.top) / rect.height) * 100;
        (t as HTMLElement).style.setProperty("--focus-x", `${fx}%`);
        (t as HTMLElement).style.setProperty("--focus-y", `${fy}%`);
      };
      window.addEventListener("mousedown", handle, { once: true });
      (t as HTMLElement).classList.add("focus-haze");
    };
    const onBlur = (e: FocusEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (t.tagName !== "INPUT" && t.tagName !== "TEXTAREA") return;
      (t as HTMLElement).classList.remove("focus-haze");
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("focusin", onFocus);
    window.addEventListener("focusout", onBlur);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("focusin", onFocus);
      window.removeEventListener("focusout", onBlur);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <TopNav status={systemStatus} role={role} />
      <main className="container mx-auto px-4 py-6">
        {!isAuthed ? (
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Authorization Required</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex gap-2">
                <Button variant={role === "Commander" ? "secondary" : "outline"} onClick={() => setRole("Commander")}>Commander</Button>
                <Button variant={role === "Navigator" ? "secondary" : "outline"} onClick={() => setRole("Navigator")}>Navigator</Button>
                <Button variant={role === "Armer" ? "secondary" : "outline"} onClick={() => setRole("Armer")}>Armer</Button>
              </div>

              {role === "Commander" && (
                <div className="grid md:grid-cols-2 gap-3 items-end">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input placeholder="commander@domain" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Label>Password</Label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <div className="text-xs text-muted-foreground">Commander needs both password and code.</div>
                    <Badge variant={emailOk ? "secondary" : "outline"} className="mt-1"><User className="h-3 w-3 mr-1" /> {emailOk ? "Validated" : "Pending"}</Badge>
                  </div>

                  <div className="space-y-2">
                    <Label>Commander's Code</Label>
                    <Input placeholder="Enter code" value={commanderCode} onChange={(e) => setCommanderCode(e.target.value)} />
                    <div className="text-xs text-muted-foreground">Second step</div>
                    <Badge variant={commanderOk ? "secondary" : "outline"} className="mt-2"><KeyRound className="h-3 w-3 mr-1" /> {commanderOk ? "Verified" : "Required"}</Badge>
                    <div className="mt-3">
                      <Button disabled={!isAuthed}>Enter Command</Button>
                    </div>
                    <div className="mt-3">
                      <div className="text-xs text-muted-foreground">Voice Authentication (Commander only)</div>
                      <div className="mt-2">/* Voice auth widget available in commander portal only */</div>
                    </div>
                  </div>
                </div>
              )}

              {role === "Navigator" && (
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <Label>Navigator Code</Label>
                    <Input placeholder="Enter navigator code" value={navCode} onChange={(e) => setNavCode(e.target.value)} />
                  </div>
                  <div>
                    <Button disabled={!navigatorAuthed}>Enter Command</Button>
                  </div>
                </div>
              )}

              {role === "Armer" && (
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <Label>Armer Code</Label>
                    <Input placeholder="Enter armer code or commander code" value={armCode} onChange={(e) => setArmCode(e.target.value)} />
                  </div>
                  <div>
                    <Button disabled={!armerAuthed}>Enter Command</Button>
                  </div>
                </div>
              )}

              <Separator />
              <div className="text-xs text-muted-foreground">Select role, provide credentials and click Enter Command.</div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Tabs defaultValue={role === "Commander" ? "dashboard" : role === "Navigator" ? "destination" : "safety"}>
              <div className="flex items-center justify-between">
                <TabsList>
                  {role === "Commander" && <TabsTrigger value="dashboard">Dashboard</TabsTrigger>}
                  <TabsTrigger value="safety">Safety & Arming</TabsTrigger>
                  <TabsTrigger value="destination">Destination</TabsTrigger>
                  {role === "Commander" && <TabsTrigger value="manual">Manual Control</TabsTrigger>}
                  {(role === "Commander" || role === "Navigator") && <TabsTrigger value="launch">Launch Sequence</TabsTrigger>}
                </TabsList>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>Role: {role}</span>
                  <span>•</span>
                  {role === "Commander" && <span>Consent: {requireTwoPerson ? (twoOk ? "Active" : "Required") : "Disabled"}</span>}
                </div>
              </div>

              {role === "Commander" && (
                <TabsContent value="dashboard" className="mt-4 space-y-4">
                  <TelemetryPanel rpm={rpm} batteryPct={battery} speed={speed} motorTemp={motorTemp} health={health} />
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Status</CardTitle>
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-3 gap-3 text-sm">
                      <div className="p-3 rounded border bg-secondary/30">
                        <div className="text-muted-foreground">Login</div>
                        <div className="font-mono">{emailOk ? "OK" : "FAIL"}</div>
                      </div>
                      <div className="p-3 rounded border bg-secondary/30">
                        <div className="text-muted-foreground">Commander Code</div>
                        <div className="font-mono">{commanderOk ? "OK" : "FAIL"}</div>
                      </div>
                      <div className="p-3 rounded border bg-secondary/30">
                        <div className="text-muted-foreground">Two-Person</div>
                        <div className="font-mono">{requireTwoPerson ? (twoOk ? "OK" : "WAIT") : "OFF"}</div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              <TabsContent value="safety" className="mt-4">
                <SafetyPanel
                  verified={safetyVerified}
                  setVerified={setSafetyVerified}
                  armed={safetyArmed}
                  setArmed={setSafetyArmed}
                />
              </TabsContent>

              <TabsContent value="destination" className="mt-4">
                <DestinationPanel lat={lat} lon={lon} curLat={curLat} curLon={curLon} onSet={(la, lo) => { setLat(la); setLon(lo); }} onSetCurrent={(cla, clo) => { setCurLat(cla); setCurLon(clo); }} role={role} />
              </TabsContent>

              {role === "Commander" && (
                <TabsContent value="manual" className="mt-4">
                  <ManualControlPanel speedMS={speed} altitudeM={altitude} powerPct={battery} />
                </TabsContent>
              )}

              {(role === "Commander" || role === "Navigator") && (
                <TabsContent value="launch" className="mt-4">
                  <LaunchSequencePanel
                    emailOk={emailOk}
                    commanderOk={commanderOk}
                    consentOk={role === "Commander" ? (requireTwoPerson ? twoOk : true) : true}
                    safetyVerified={safetyVerified}
                    safetyArmed={safetyArmed}
                    distanceKm={curLat != null && curLon != null ? (function(){
                      const R=6371; const dLat=((lat-curLat)*Math.PI)/180; const dLon=((lon-curLon)*Math.PI)/180; const A=Math.sin(dLat/2)**2+Math.cos(curLat*Math.PI/180)*Math.cos(lat*Math.PI/180)*Math.sin(dLon/2)**2; const c=2*Math.atan2(Math.sqrt(A),Math.sqrt(1-A)); return R*c;})() : null}
                    telemetryOk={health === "OK"}
                    onLaunch={() => alert("Launch sequence initiated (demo)")}
                    role={role}
                  />
                </TabsContent>
              )}
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
        requireTwoPerson={requireTwoPerson}
        setRequireTwoPerson={setRequireTwoPerson}
      />
    </div>
  );
}
