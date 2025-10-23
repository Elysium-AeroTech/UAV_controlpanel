import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Trash2, CheckCircle2, AlertCircle, Play } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PAGES = [
  "dashboard",
  "arming",
  "navigation",
  "manual",
  "safety",
  "comms",
  "launch",
] as const;

type PageType = (typeof PAGES)[number];

interface UploadedFile {
  page: PageType;
  filename: string;
  uploadedAt: string;
}

export function AdminPanel() {
  const [selectedPage, setSelectedPage] = useState<PageType | "">("");
  const [files, setFiles] = useState<UploadedFile[]>(() => {
    const stored = localStorage.getItem("uploadedFiles");
    return stored ? JSON.parse(stored) : [];
  });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedPage) {
      setMessage({ type: "error", text: "Please select a page and file" });
      return;
    }

    if (!file.name.endsWith(".py")) {
      setMessage({ type: "error", text: "Only Python files (.py) are allowed" });
      return;
    }

    const newFile: UploadedFile = {
      page: selectedPage,
      filename: file.name,
      uploadedAt: new Date().toLocaleString(),
    };

    const updatedFiles = [...files, newFile];
    setFiles(updatedFiles);
    localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));
    
    setMessage({ type: "success", text: `${file.name} uploaded for ${selectedPage}` });
    setSelectedPage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = (filename: string) => {
    const updatedFiles = files.filter((f) => f.filename !== filename);
    setFiles(updatedFiles);
    localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));
    setMessage({ type: "success", text: `${filename} deleted` });
    setTimeout(() => setMessage(null), 2000);
  };

  const filesByPage = PAGES.reduce(
    (acc, page) => {
      acc[page] = files.filter((f) => f.page === page);
      return acc;
    },
    {} as Record<PageType, UploadedFile[]>,
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" /> Upload Python Scripts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <Alert variant={message.type === "success" ? "default" : "destructive"}>
              {message.type === "success" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Select Page</Label>
              <Select value={selectedPage} onValueChange={(value) => setSelectedPage(value as PageType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a page..." />
                </SelectTrigger>
                <SelectContent>
                  {PAGES.map((page) => (
                    <SelectItem key={page} value={page}>
                      {page.charAt(0).toUpperCase() + page.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Python File</Label>
              <div className="flex gap-2">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".py"
                  onChange={handleFileUpload}
                  disabled={!selectedPage}
                  className="flex-1"
                />
              </div>
              <div className="text-xs text-muted-foreground">Only .py files are allowed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uploaded Scripts by Page</CardTitle>
        </CardHeader>
        <CardContent>
          {PAGES.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">No scripts uploaded yet</div>
          ) : (
            <div className="space-y-4">
              {PAGES.map((page) => (
                <div key={page} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3 capitalize">
                    {page.charAt(0).toUpperCase() + page.slice(1)}
                  </h3>
                  {filesByPage[page].length === 0 ? (
                    <div className="text-sm text-muted-foreground">No scripts uploaded</div>
                  ) : (
                    <div className="space-y-2">
                      {filesByPage[page].map((file) => (
                        <div
                          key={file.filename}
                          className="flex items-center justify-between bg-secondary/30 p-3 rounded"
                        >
                          <div>
                            <div className="text-sm font-mono">{file.filename}</div>
                            <div className="text-xs text-muted-foreground">{file.uploadedAt}</div>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(file.filename)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
