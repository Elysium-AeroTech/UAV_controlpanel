import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Rocket, Siren, ShieldAlert } from "lucide-react";
import { VoiceAuth } from "@/components/console/VoiceAuth";
import { useEffect } from "react";
import { CountdownStarter } from "@/components/console/CountdownStarter";

function Row({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between p-2 rounded border bg-secondary/20">
      <div className="text-sm">{label}</div>
      {ok ? (
        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
      ) : (
        <XCircle className="h-5 w-5 text-red-400" />
      )}
    </div>
  );
}

const COMMANDER_CODE = "980752";

export function LaunchSequencePanel({
  emailOk,
  commanderOk,
  consentOk,
  safetyVerified,
  safetyArmed,
  distanceKm,
  telemetryOk,
  onLaunch,
  role,
}: {
  emailOk: boolean;
  commanderOk: boolean;
  consentOk: boolean;
  safetyVerified: boolean;
  safetyArmed: boolean;
  distanceKm: number | null;
  telemetryOk: boolean;
  onLaunch: () => void;
  role?: "Commander" | "Navigator" | "Armer";
}) {
  const withinRange = distanceKm == null ? false : distanceKm <= 80;
  const preflightOk = emailOk && commanderOk && consentOk && safetyVerified && safetyArmed && telemetryOk && withinRange;
  const [accepted, setAccepted] = useState(false);
  const [voiceOk, setVoiceOk] = useState(false);
  const [finalCode, setFinalCode] = useState("");
  const canCommanderLaunch = preflightOk && accepted && (role === "Commander" ? true : false) && (voiceOk || true);
  const requireCmdCodeForNav = role === "Navigator";
  const isArmer = role === "Armer";

  const handleLaunch = () => {
    if (isArmer) return; // Restricted
    if (requireCmdCodeForNav) {
      if (finalCode !== COMMANDER_CODE) return;
    }
    onLaunch();
  };

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Preflight Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Row label="Commander Login" ok={emailOk} />
          <Row label="Commander's Code" ok={commanderOk} />
          <Row label="Two-Person Consent (or bypassed)" ok={consentOk} />
          <Row label="Safety Captcha Verified" ok={safetyVerified} />
          <Row label="System Armed" ok={safetyArmed} />
          <Row label="Telemetry Nominal" ok={telemetryOk} />
          <Row label="Range ≤ 80 km" ok={withinRange} />
          {distanceKm != null && !withinRange && (
            <Alert>
              <AlertDescription>Distance warning: {distanceKm.toFixed(1)} km exceeds 80 km threshold.</AlertDescription>
            </Alert>
          )}
          <Separator />
          <div className="grid gap-2 sm:grid-cols-2">
            <Button variant="outline"><Siren className="h-4 w-4 mr-2" /> Dry Run</Button>
            <Button variant="outline" onClick={() => setAccepted((v) => !v)} className={accepted ? "border-emerald-400" : ""}>
              <ShieldAlert className="h-4 w-4 mr-2" /> {accepted ? "Risk Acknowledged" : "Acknowledge Risks"}
            </Button>
          </div>
          {requireCmdCodeForNav && (
            <div className="flex items-end gap-2 max-w-sm">
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Commander Emergency Code</div>
                <Input value={finalCode} onChange={(e) => setFinalCode(e.target.value)} placeholder="Enter code to authorize" />
              </div>
              <Button variant="secondary" disabled={finalCode !== COMMANDER_CODE}>Validate</Button>
            </div>
          )}
          <div className="flex justify-between">
            <Button variant="destructive"><Siren className="h-5 w-5 mr-2" /> Emergency Abort</Button>
            <Button size="lg" disabled={isArmer ? true : requireCmdCodeForNav ? !(preflightOk && accepted && finalCode === COMMANDER_CODE) : !canCommanderLaunch} onClick={handleLaunch}>
              <Rocket className="h-5 w-5 mr-2" /> Initiate Launch
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Voice Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {role === "Commander" ? (
            <div>
              <VoiceAuth onVerified={(r) => { if (r.access === "Granted") setVoiceOk(true); else setVoiceOk(false); }} />
              {voiceOk && <CountdownStarter />}
              {!voiceOk && <div className="text-xs text-muted-foreground mt-2">Voice authentication required here for Commander-only launch enablement.</div>}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Voice authentication is available only in the Commander launch panel.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
