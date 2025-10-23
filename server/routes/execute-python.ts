import { RequestHandler } from "express";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

interface ExecutePythonRequest {
  script: string;
  args?: string[];
}

interface ExecutePythonResponse {
  success: boolean;
  output?: string;
  error?: string;
}

export const handleExecutePython: RequestHandler = (req, res) => {
  const { script, args = [] } = req.body as ExecutePythonRequest;

  if (!script) {
    return res.status(400).json({
      success: false,
      error: "Script parameter is required",
    } as ExecutePythonResponse);
  }

  try {
    const scriptsDir = path.join(process.cwd(), "uploaded_scripts");

    if (!fs.existsSync(scriptsDir)) {
      fs.mkdirSync(scriptsDir, { recursive: true });
    }

    const scriptPath = path.join(scriptsDir, script);

    if (!fs.existsSync(scriptPath)) {
      return res.status(404).json({
        success: false,
        error: `Script not found: ${script}`,
      } as ExecutePythonResponse);
    }

    const command = `python "${scriptPath}" ${args.map((arg) => `"${arg}"`).join(" ")}`;
    const output = execSync(command, { encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 });

    res.json({
      success: true,
      output,
    } as ExecutePythonResponse);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({
      success: false,
      error: errorMessage,
    } as ExecutePythonResponse);
  }
};
