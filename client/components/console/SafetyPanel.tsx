import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldCheck, Rocket, Lock } from "lucide-react";

export function SafetyPanel({
  verified,
  setVerified,
  armed,
  setArmed,
}: {
  verified: boolean;
  setVerified: (b: boolean) => void;
  armed: boolean;
  setArmed: (b: boolean) => void;
}) {
  const [warheadInserted, setWarheadInserted] = useState(false);
  const [pinRemoved, setPinRemoved] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [input, setInput] = useState("");

  const generate = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let out = "";
    for (let i = 0; i < 5; i++) out += chars[Math.floor(Math.random() * chars.length)];
    setCaptcha(out);
    setInput("");
    setVerified(false);
  };

  const canArm = verified && warheadInserted && pinRemoved;

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Safety & Arming</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`h-3 w-3 rounded-full ${armed ? "bg-red-500" : "bg-neutral-500"}`} />
            <div className={`text-sm ${armed ? "text-red-400" : "text-muted-foreground"}`}>{armed ? "ARMED" : "SAFE"}</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold">Step 1 — Insert Warhead</div>
            <div className="flex items-center gap-3">
              <div className={`h-14 w-14 rounded-lg border flex items-center justify-center ${warheadInserted ? "bg-red-600/20 border-red-500" : "bg-secondary/10"}`}>
                <div className={`h-6 w-6 rounded-full ${warheadInserted ? "bg-red-500" : "bg-neutral-400"}`} />
              </div>
              <div className="flex-1 text-sm text-muted-foreground">Physically secure the warhead into the bay. This step is simulated; toggling will show the change.</div>
              <Button onClick={() => setWarheadInserted((v) => !v)} variant={warheadInserted ? "destructive" : "outline"}>{warheadInserted ? "Remove Warhead" : "Insert Warhead"}</Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold">Step 2 — Safety Pin</div>
            <div className="flex items-center gap-3">
              <div className={`h-10 w-28 rounded-md border flex items-center justify-center ${pinRemoved ? "bg-red-600/10 border-red-500" : "bg-secondary/10"}`}>
                <div className={`h-3 w-12 rounded-sm ${pinRemoved ? "bg-red-500" : "bg-neutral-400"}`} />
              </div>
              <div className="flex-1 text-sm text-muted-foreground">Remove the safety pin to arm the mechanism.</div>
              <Button onClick={() => setPinRemoved(true)} variant={pinRemoved ? "secondary" : "outline"} disabled={pinRemoved}>Remove Pin</Button>
            </div>
          </div>

          <Separator />

          <div>
            <div className="text-xs text-muted-foreground mb-1">Verification Challenge</div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-2 rounded bg-secondary font-mono tracking-widest text-lg select-none">{captcha || "-----"}</div>
              <Button variant="outline" onClick={generate}>Refresh</Button>
            </div>
            <div className="mt-2">
              <Input value={input} onChange={(e) => setInput(e.target.value.toUpperCase())} placeholder="Type the code" />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => setVerified(input === captcha)} disabled={!captcha} variant={verified ? "secondary" : "default"}>{verified ? "Verified" : "Verify"}</Button>
            <Button onClick={() => { if (canArm) { setArmed(true); } }} variant={canArm ? "destructive" : "outline"} disabled={!canArm}>{armed ? "Disarm" : "Arm"}</Button>
          </div>

          <Separator />

          <Alert>
            <AlertDescription className="space-y-1">
              <div className="text-sm font-semibold">Arming Sequence</div>
              <div className="text-sm text-muted-foreground">Follow the steps above. When all steps are complete and verification passed, arming will be enabled. This UI simulates a very sensitive operation — treat it with caution.</div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5 text-primary" /> Launch Control</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button size="lg" className="w-full text-lg" disabled>
            <Rocket className="h-5 w-5 mr-2" /> Initiate Launch from Launch Sequence tab
          </Button>
          <div className="text-xs text-muted-foreground">Complete the arming steps here. This panel simulates installation of the warhead and removal of safety pin before the system can be armed.</div>
        </CardContent>
      </Card>
    </div>
  );
}
