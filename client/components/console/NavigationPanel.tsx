import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const TARGETS = [
  { name: "Gurugram", zone: "Haryana", lat: 28.4595, lon: 77.0266 },
  { name: "Noida", zone: "Uttar Pradesh", lat: 28.5355, lon: 77.391 },
  { name: "Ghaziabad", zone: "Uttar Pradesh", lat: 28.6692, lon: 77.4538 },
  { name: "Faridabad", zone: "Haryana", lat: 28.4089, lon: 77.3178 },
  { name: "Greater Noida", zone: "Uttar Pradesh", lat: 28.4744, lon: 77.508 },
  { name: "Bahadurgarh", zone: "Haryana", lat: 28.6929, lon: 76.96 },
  { name: "Sonipat", zone: "Haryana", lat: 28.9288, lon: 77.0919 },
  { name: "Meerut", zone: "Uttar Pradesh", lat: 28.9845, lon: 77.7064 },
  { name: "Panipat", zone: "Haryana", lat: 29.3924, lon: 76.9695 },
  { name: "Rohtak", zone: "Haryana", lat: 28.8955, lon: 76.6066 },
  { name: "Rewari", zone: "Haryana", lat: 28.203, lon: 76.6191 },
  { name: "Bhiwadi", zone: "Rajasthan", lat: 28.2107, lon: 76.8606 },
  { name: "Palwal", zone: "Haryana", lat: 28.1487, lon: 77.332 },
  { name: "Hapur", zone: "Uttar Pradesh", lat: 28.7306, lon: 77.7759 },
  { name: "Bulandshahr", zone: "Uttar Pradesh", lat: 28.4069, lon: 77.8498 },
  { name: "Khurja", zone: "Uttar Pradesh", lat: 28.254, lon: 77.8556 },
  { name: "Baghpat", zone: "Uttar Pradesh", lat: 28.9444, lon: 77.2186 },
  { name: "Modinagar", zone: "Uttar Pradesh", lat: 28.8318, lon: 77.5819 },
  { name: "Dadri", zone: "Uttar Pradesh", lat: 28.5538, lon: 77.556 },
  { name: "Jhajjar", zone: "Haryana", lat: 28.6066, lon: 76.6562 },
] as const;

function haversineKm(aLat: number, aLon: number, bLat: number, bLon: number) {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLon = ((bLon - aLon) * Math.PI) / 180;
  const A =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) *
      Math.cos((bLat * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(A), Math.sqrt(1 - A));
  return R * c;
}

const ORIGIN = { lat: 28.639, lon: 77.236 } as const;
export function NavigationPanel({
  curLat,
  curLon,
  speedMS,
  lat,
  lon,
  onSet,
  locked,
  onLockedChange,
}: {
  curLat: number;
  curLon: number;
  speedMS: number;
  lat: number;
  lon: number;
  onSet: (lat: number, lon: number) => void;
  locked: boolean;
  onLockedChange: (b: boolean) => void;
}) {
  const [selected, setSelected] = useState<string>("");
  const [mode, setMode] = useState<"direct" | "guided">("direct");
  const [lockCode, setLockCode] = useState("");
  const [roundTrip, setRoundTrip] = useState(false);

  const target = useMemo(
    () => TARGETS.find((t) => t.name === selected) ?? null,
    [selected],
  );

  const distanceKm = useMemo(
    () =>
      target
        ? haversineKm(ORIGIN.lat, ORIGIN.lon, target.lat, target.lon)
        : null,
    [target],
  );
  const etaMin = useMemo(() => {
    if (!distanceKm) return null;
    const kmph = speedMS * 3.6;
    const baseMin = (distanceKm / Math.max(1, kmph)) * 60;
    const mult = (mode === "guided" ? 1.15 : 1) * (roundTrip ? 2 : 1);
    return Math.round(baseMin * mult);
  }, [distanceKm, speedMS, mode]);

  const mapUrl = useMemo(() => {
    const la = target?.lat ?? lat;
    const lo = target?.lon ?? lon;
    const minLat = Math.min(ORIGIN.lat, la);
    const maxLat = Math.max(ORIGIN.lat, la);
    const minLon = Math.min(ORIGIN.lon, lo);
    const maxLon = Math.max(ORIGIN.lon, lo);
    const pad = 0.05;
    const bbox = [minLon - pad, minLat - pad, maxLon + pad, maxLat + pad].join(
      ",",
    );
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${la},${lo}`;
  }, [target, lat, lon]);

  const pathPoints = useMemo(() => {
    if (!locked || !target) return null;
    const la = target.lat,
      lo = target.lon;
    const minLat = Math.min(ORIGIN.lat, la);
    const maxLat = Math.max(ORIGIN.lat, la);
    const minLon = Math.min(ORIGIN.lon, lo);
    const maxLon = Math.max(ORIGIN.lon, lo);
    const pad = 0.05;
    const left = minLon - pad,
      right = maxLon + pad,
      top = maxLat + pad,
      bottom = minLat - pad;
    const norm = (L: number, B: number) => ({
      x: Math.max(0, Math.min(100, ((B - left) / (right - left)) * 100)),
      y: Math.max(0, Math.min(100, ((top - L) / (top - bottom)) * 100)),
    });
    const a = norm(ORIGIN.lat, ORIGIN.lon);
    const b = norm(la, lo);
    return { a, b };
  }, [locked, target]);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Navigation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label>Predefined Targets</Label>
              <Select value={selected} onValueChange={(v) => setSelected(v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a target" />
                </SelectTrigger>
                <SelectContent>
                  {TARGETS.map((t) => (
                    <SelectItem key={t.name} value={t.name}>
                      {t.name} — {t.zone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Path Mode</Label>
              <Select value={mode} onValueChange={(v) => setMode(v as any)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="direct">Direct Path</SelectItem>
                  <SelectItem value="guided">Guided Path</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label>Latitude</Label>
              <Input
                className="mt-1"
                type="number"
                value={target?.lat ?? lat}
                onChange={(e) =>
                  onSet(Number(e.target.value), target?.lon ?? lon)
                }
              />
            </div>
            <div>
              <Label>Longitude</Label>
              <Input
                className="mt-1"
                type="number"
                value={target?.lon ?? lon}
                onChange={(e) =>
                  onSet(target?.lat ?? lat, Number(e.target.value))
                }
              />
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Distance: {distanceKm ? `${distanceKm.toFixed(1)} km` : "—"}{" "}
            {etaMin ? `• ETA: ${etaMin} min` : ""}
          </div>
          <Separator />
          <div className="grid sm:grid-cols-3 gap-2">
            <Input
              placeholder="Lock code"
              value={lockCode}
              onChange={(e) => setLockCode(e.target.value)}
            />
            <Button
              onClick={() => {
                if (lockCode === "351478") {
                  onLockedChange(true);
                  if (target) onSet(target.lat, target.lon);
                }
              }}
              disabled={locked || !selected}
            >
              LOCK TARGET
            </Button>
            <Button variant="outline" onClick={() => setRoundTrip((v) => !v)}>
              {roundTrip ? "Round Trip: ON" : "Round Trip: OFF"}
            </Button>
          </div>
          {locked ? (
            <div className="text-emerald-400 text-sm">Target Locked</div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Map Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video rounded border overflow-hidden relative">
            <iframe title="map" src={mapUrl} className="w-full h-full" />
            {pathPoints ? (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line
                  x1={`${pathPoints.a.x}%`}
                  y1={`${pathPoints.a.y}%`}
                  x2={`${pathPoints.b.x}%`}
                  y2={`${pathPoints.b.y}%`}
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
              </svg>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
