import { Router, type IRouter } from "express";
import { spawn } from "child_process";
import path from "path";

const router: IRouter = Router();

const ROOT = path.resolve("/home/runner/workspace");

router.get("/download-source", (_req, res) => {
  res.setHeader("Content-Type", "application/gzip");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="writing-circle-source.tar.gz"',
  );

  const tar = spawn("tar", [
    "-czf",
    "-",
    "--exclude=*/node_modules",
    "--exclude=.git",
    "--exclude=*/dist",
    "--exclude=.local",
    "--exclude=attached_assets",
    "--exclude=.agents",
    "--exclude=*.tsbuildinfo",
    ".",
  ], { cwd: ROOT });

  tar.stdout.pipe(res);

  tar.stderr.on("data", () => {});

  tar.on("error", (err) => {
    if (!res.headersSent) {
      res.status(500).end("Failed to create archive");
    } else {
      res.end();
    }
    console.error(err);
  });
});

export default router;
