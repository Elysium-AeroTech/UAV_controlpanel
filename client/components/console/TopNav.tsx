import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Crosshair, GaugeCircle } from "lucide-react";

export function TopNav({ status, role, onLogout }: { status: string; role?: "Commander" | "Navigator" | "Armer"; onLogout?: () => void }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-sm bg-primary/20 border border-primary/40 grid place-items-center">
            <Crosshair className="h-4 w-4 text-primary" />
          </div>
          <div className="font-bold tracking-wide">Elysium Command</div>
          <Badge variant="secondary" className="ml-2">Missile Ops</Badge>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {role && <div className="hidden md:flex items-center gap-1">Role: {role}</div>}
          <Separator orientation="vertical" className="h-6" />
          <div className="hidden md:flex items-center gap-1"><GaugeCircle className="h-4 w-4" /> System</div>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-2"><Shield className="h-4 w-4" /> <span className="text-emerald-400">{status}</span></div>
          {onLogout && (
            <button onClick={onLogout} className="ml-3 px-2 py-1 rounded bg-destructive/10 text-destructive text-xs">Logout</button>
          )}
        </div>
      </div>
    </header>
  );
}
