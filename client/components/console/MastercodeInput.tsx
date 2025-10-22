import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, LockOpen, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const MASTERCODE = "9807";

export function MastercodeInput({
  pageTitle,
  isLocked,
  onLockChange,
  children,
  validCodes = [],
}: {
  pageTitle: string;
  isLocked: boolean;
  onLockChange: (locked: boolean) => void;
  children?: React.ReactNode;
  validCodes?: string[];
}) {
  const [code, setCode] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [error, setError] = useState("");

  const isValidCode = (inputCode: string) => {
    return inputCode === MASTERCODE || validCodes.includes(inputCode);
  };

  const handleSubmit = () => {
    if (isValidCode(code)) {
      onLockChange(!isLocked);
      setCode("");
      setShowInput(false);
      setError("");
    } else {
      setError("Invalid code");
      setCode("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{pageTitle}</h2>
        <Button
          variant={isLocked ? "destructive" : "outline"}
          size="sm"
          onClick={() => setShowInput(!showInput)}
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
      </div>

      {isLocked && !showInput && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>This page is locked. Enter mastercode to unlock.</AlertDescription>
        </Alert>
      )}

      {showInput && (
        <Card>
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
      )}

      {!isLocked ? (
        <div className="opacity-100">{children}</div>
      ) : (
        <div className="opacity-40 pointer-events-none">{children}</div>
      )}
    </div>
  );
}
