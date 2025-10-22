import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, LockOpen } from "lucide-react";

const MASTERCODE = "9807";

export function MastercodeInput({
  pageTitle,
  isLocked,
  onLockChange,
}: {
  pageTitle: string;
  isLocked: boolean;
  onLockChange: (locked: boolean) => void;
}) {
  const [code, setCode] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (code === MASTERCODE) {
      onLockChange(!isLocked);
      setCode("");
      setShowInput(false);
      setError("");
    } else {
      setError("Invalid mastercode");
      setCode("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  if (!showInput) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowInput(true)}
        className="gap-2"
      >
        {isLocked ? (
          <>
            <Lock className="h-4 w-4" /> Locked
          </>
        ) : (
          <>
            <LockOpen className="h-4 w-4" /> Unlocked
          </>
        )}
      </Button>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-sm">{pageTitle} Security</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs text-muted-foreground">
          Enter mastercode to {isLocked ? "unlock" : "lock"} this page
        </div>
        <Input
          placeholder="Enter mastercode"
          type="password"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError("");
          }}
          onKeyPress={handleKeyPress}
          autoFocus
        />
        {error && <div className="text-xs text-red-500">{error}</div>}
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleSubmit}
            className="flex-1"
            disabled={!code}
          >
            {isLocked ? "Unlock" : "Lock"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setShowInput(false);
              setCode("");
              setError("");
            }}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
