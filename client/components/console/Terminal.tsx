import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, X } from "lucide-react";

export function Terminal({
  logs,
  onClear,
}: {
  logs: string[];
  onClear: () => void;
}) {
  const [isMinimized, setIsMinimized] = useState(true);

  if (isMinimized) {
    return (
      <Button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 gap-2 z-40"
        variant="outline"
      >
        <ChevronUp className="h-4 w-4" />
        Terminal
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-64 flex flex-col z-40 bg-background border border-primary/20">
      <CardHeader className="py-2 pb-2 border-b flex flex-row items-center justify-between">
        <CardTitle className="text-xs">Terminal</CardTitle>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsMinimized(true)}
            className="h-6 w-6 p-0"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClear}
            className="h-6 w-6 p-0 text-xs"
          >
            Clear
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsMinimized(true)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-2 font-mono text-xs bg-secondary/30 space-y-1">
        {logs.length === 0 ? (
          <div className="text-muted-foreground">No logs yet...</div>
        ) : (
          logs.map((log, idx) => (
            <div
              key={idx}
              className={`${
                log.includes("Error") || log.includes("error")
                  ? "text-red-400"
                  : log.includes("Success") || log.includes("success")
                    ? "text-green-400"
                    : "text-foreground"
              }`}
            >
              {log}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
