import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mic, Square, Upload } from "lucide-react";

interface AuthResponse {
  similarity?: number;
  access?: "Granted" | "Denied";
  message?: string;
}

export function VoiceAuth({ onVerified }: { onVerified?: (r: AuthResponse) => void }) {
  const [recording, setRecording] = useState(false);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [lastResult, setLastResult] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (recorder && recorder.state !== "inactive") recorder.stop();
    };
  }, [recorder]);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        void sendToServer(blob);
      };
      rec.start();
      setRecorder(rec);
      setRecording(true);
    } catch (e) {
      setError("Microphone access denied or unavailable.");
    }
  };

  const stopRecording = () => {
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
      setRecording(false);
    }
  };

  const uploadFile = async (file: File) => {
    setError(null);
    await sendToServer(file);
  };

  const sendToServer = async (audio: Blob | File) => {
    try {
      setLoading(true);
      const form = new FormData();
      // Flask expects field name 'voice_file'
      form.append("voice_file", audio, "attempt.wav");
      const res = await fetch("/authenticate", { method: "POST", body: form });
      const json = await res.json();
      // Flask returns { status, similarity, result } or error
      if (!res.ok || json?.status === "error") {
        setError(json?.message || `Server error (${res.status})`);
        setLastResult(null);
        return;
      }
      const parsed: AuthResponse = {
        similarity: typeof json.similarity === "number" ? json.similarity : undefined,
        access: json.result === "Access Granted" ? "Granted" : json.result === "Access Denied" ? "Denied" : undefined,
        message: json.message || json.result || undefined,
      };
      setLastResult(parsed);
      onVerified?.(parsed);
    } catch (e: any) {
      setError(e?.message || "Network error while authenticating");
      setLastResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {!recording ? (
          <Button onClick={startRecording} disabled={loading}>
            <Mic className="h-4 w-4 mr-2" /> Record Voice
          </Button>
        ) : (
          <Button variant="destructive" onClick={stopRecording}>
            <Square className="h-4 w-4 mr-2" /> Stop
          </Button>
        )}
        <div className="text-xs text-muted-foreground">Use your microphone to authenticate</div>
      </div>
      <div>
        <Label htmlFor="voicefile">Or Upload Audio</Label>
        <div className="flex gap-2 items-center mt-1">
          <Input id="voicefile" type="file" accept="audio/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) void uploadFile(f); }} />
          <Upload className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <Separator />
      {loading && <div className="text-xs text-muted-foreground">Authenticating...</div>}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {lastResult && (
        <div className="text-sm">
          <div>Similarity: <span className="font-mono">{typeof lastResult.similarity === "number" ? `${(lastResult.similarity * 100).toFixed(1)}%` : "N/A"}</span></div>
          <div>Access: <span className={lastResult.access === "Granted" ? "text-emerald-400" : "text-red-400"}>{lastResult.access || "Unknown"}</span></div>
        </div>
      )}
    </div>
  );
}
