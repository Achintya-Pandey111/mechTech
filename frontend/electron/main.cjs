const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");
const http = require("http");

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 900,
    minHeight: 600,
    title: "AlumniConnect - Engineering & Alumni Network",
    backgroundColor: "#0a0e17",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const devUrl = "http://localhost:5173";
  const distPath = path.join(__dirname, "../renderer/dist/index.html");

  // Check if Vite dev server is running on port 5173
  const req = http.get(devUrl, () => {
    win.loadURL(devUrl);
  });

  req.on("error", () => {
    // If Vite dev server is not running, load the compiled static bundle
    if (fs.existsSync(distPath)) {
      win.loadFile(distPath);
    }
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});