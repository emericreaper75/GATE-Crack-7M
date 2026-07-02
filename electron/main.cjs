const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Initialize SQLite database
const dbPath = path.join(app.getPath('userData'), 'gate_data.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS store (key TEXT PRIMARY KEY, value TEXT)");
});

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'GATE EC 2027 Dashboard',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Load from Vite dev server during development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    // mainWindow.webContents.openDevTools();
  } else {
    // Load from built dist file in production
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  ipcMain.handle('store-get', async (event, key) => {
    return new Promise((resolve, reject) => {
      db.get("SELECT value FROM store WHERE key = ?", [key], (err, row) => {
        if (err) reject(err);
        else resolve(row ? row.value : null);
      });
    });
  });

  ipcMain.handle('store-set', async (event, key, value) => {
    return new Promise((resolve, reject) => {
      db.run("INSERT OR REPLACE INTO store (key, value) VALUES (?, ?)", [key, value], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });

  ipcMain.handle('store-delete', async (event, key) => {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM store WHERE key = ?", [key], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
