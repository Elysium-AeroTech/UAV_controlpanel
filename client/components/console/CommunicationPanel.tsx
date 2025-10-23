import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export function CommunicationPanel() {
  const [status, setStatus] = useState<
    "Connected" | "Disconnected" | "Attempting"
  >("Connected");
  const [freq, setFreq] = useState(2.4);
  const [power, setPower] = useState(25);
  const [encryption, setEncryption] = useState("AES-128");
  const [modulation, setModulation] = useState("QPSK");
  const [cfgPass, setCfgPass] = useState("");
  const cfgUnlocked = cfgPass === "795846";
  const [primaryOn, setPrimaryOn] = useState(true);
  const [secondaryOn, setSecondaryOn] = useState(false);

  const metrics = useMemo(
    () => ({
      rssi: -62,
      uptime: "00:42:18",
      loss: 0.7,
      latency: 38,
      primary: "2.4 GHz",
      backup: "900 MHz",
      rate: "5 Mbps",
    }),
    [],
  );

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Live Link</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-3 text-sm">
          <div className="p-3 rounded border bg-background">
            <div className="text-muted-foreground">Status</div>
            <Badge
              variant={
                status === "Connected"
                  ? "secondary"
                  : status === "Attempting"
                    ? "outline"
                    : "destructive"
              }
            >
              {status}
            </Badge>
          </div>
          <div className="p-3 rounded border bg-background">
            <div className="text-muted-foreground">Signal (RSSI)</div>
            <div className="font-mono">{metrics.rssi} dBm</div>
          </div>
          <div className="p-3 rounded border bg-background">
            <div className="text-muted-foreground">Uptime</div>
            <div className="font-mono">{metrics.uptime}</div>
          </div>
          <div className="p-3 rounded border bg-background">
            <div className="text-muted-foreground">Packet Loss</div>
            <div className="font-mono">{metrics.loss}%</div>
          </div>
          <div className="p-3 rounded border bg-background">
            <div className="text-muted-foreground">Latency</div>
            <div className="font-mono">{metrics.latency} ms</div>
          </div>
          <div className="p-3 rounded border bg-background">
            <div className="text-muted-foreground">Data Rate</div>
            <div className="font-mono">{metrics.rate}</div>
          </div>
          <div className="p-3 rounded border bg-background">
            <div className="text-muted-foreground">Primary Link</div>
            <div className="font-mono">{metrics.primary}</div>
          </div>
          <div className="p-3 rounded border bg-background">
            <div className="text-muted-foreground">Backup Link</div>
            <div className="font-mono">{metrics.backup}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Link Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Config Passcode"
              value={cfgPass}
              onChange={(e) => setCfgPass(e.target.value)}
            />
            <Badge variant={cfgUnlocked ? "secondary" : "outline"}>
              {cfgUnlocked ? "Unlocked" : "Locked"}
            </Badge>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label>Frequency (GHz)</Label>
              <Input
                className="mt-1"
                type="number"
                value={freq}
                onChange={(e) => setFreq(Number(e.target.value))}
              />
            </div>
            <div>
              <Label>Power (dBm)</Label>
              <Input
                className="mt-1"
                type="number"
                value={power}
                onChange={(e) => setPower(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label>Encryption</Label>
              <Input
                className="mt-1"
                value={encryption}
                onChange={(e) => setEncryption(e.target.value)}
              />
            </div>
            <div>
              <Label>Modulation</Label>
              <Input
                className="mt-1"
                value={modulation}
                onChange={(e) => setModulation(e.target.value)}
              />
            </div>
          </div>
          <Separator />
          <div className="grid sm:grid-cols-3 gap-2">
            <Button variant="outline" onClick={() => setStatus("Attempting")}>
              Restart Module
            </Button>
            <Button variant="outline">Rebind / Resync</Button>
            <Button variant="outline">Ping Sudharshan</Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-2 mt-2">
            <Button
              variant={primaryOn ? "secondary" : "outline"}
              onClick={() => setPrimaryOn((v) => !v)}
            >
              Primary Comms: {primaryOn ? "ON" : "OFF"}
            </Button>
            <Button
              variant={secondaryOn ? "secondary" : "outline"}
              onClick={() => setSecondaryOn((v) => !v)}
            >
              Secondary Comms: {secondaryOn ? "ON" : "OFF"}
            </Button>
          </div>
          <Separator />
          <div className="flex items-center gap-2">
            <Button disabled={!cfgUnlocked}>Save Settings</Button>
            <div className="text-xs text-muted-foreground">
              Enter passcode to enable saving.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
