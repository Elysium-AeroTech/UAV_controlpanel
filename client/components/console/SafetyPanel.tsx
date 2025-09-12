import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldCheck, Rocket, Lock } from "lucide-react";
import { VoiceAuth } from "@/components/console/VoiceAuth";

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
  const [captcha, setCaptcha] = useState("");
  const [input, setInput] = useState("");

  const regenerated = useMemo(() => {
    return captcha;
  }, [captcha]);

  const generate = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let out = "";
    for (let i = 0; i < 5; i++) out += chars[Math.floor(Math.random() * chars.length)];
    setCaptcha(out);
    setInput("");
    setVerified(false);
  };

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
          <div>
            <div className="text-xs text-muted-foreground mb-1">Captcha</div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-2 rounded bg-secondary font-mono tracking-widest text-lg select-none">
                {regenerated || "-----"}
              </div>
              <Button variant="outline" onClick={generate}>Refresh</Button>
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Enter Captcha</div>
            <Input value={input} onChange={(e) => setInput(e.target.value.toUpperCase())} placeholder="Type the code" />
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setVerified(input === captcha)} disabled={!captcha} variant={verified ? "secondary" : "default"}>
              {verified ? "Verified" : "Verify"}
            </Button>
            <Button onClick={() => setArmed((v) => !v)} variant={armed ? "secondary" : "outline"} disabled={!verified}>
              {armed ? "Disarm" : "Arm"}
            </Button>
          </div>
          <Separator />
          <div>
            <div className="text-sm mb-2">Voice Authentication</div>
            <VoiceAuth />
          </div>
          <Separator />
          <Alert>
            <AlertDescription className="space-y-1">
              <div className="text-sm">Launch is permitted only when:</div>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Login and Commander's Code validated</li>
                <li>Two-Person Consent satisfied or disabled in Test Console</li>
                <li>Captcha Verified and System Armed</li>
              </ul>
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
          <div className="text-xs text-muted-foreground">Complete captcha and arm here, then proceed to the Launch Sequence panel to initiate launch.</div>
        </CardContent>
      </Card>
    </div>
  );
}
