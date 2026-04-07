import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { syncMatches } from "./scripts/sync.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for syncing data
  app.post("/api/sync", async (req, res) => {
    const syncSecret = process.env.SYNC_SECRET;
    const providedSecret = req.headers["x-sync-secret"];

    if (!syncSecret) {
      return res.status(500).json({ success: false, message: "Sync secret not configured on server" });
    }

    if (providedSecret !== syncSecret) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try {
      console.log("Starting manual sync via API...");
      await syncMatches();
      res.json({ success: true, message: "Sync completed successfully" });
    } catch (error: any) {
      console.error("Sync API failed:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
