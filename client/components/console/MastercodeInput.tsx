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
      <h2 className="text-lg font-semibold">{pageTitle}</h2>
      <div className="opacity-100">{children}</div>
    </div>
  );
}
