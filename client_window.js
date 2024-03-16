const { app, BrowserWindow, Menu, session } = require('electron');
const { ElectronBlocker } = require('@cliqz/adblocker-electron');
const fetch = require('cross-fetch'); // Required for @cliqz/adblocker-electron

const path = require('path');
const url = require('url');

function createWindow() {
  let win = new BrowserWindow({
    width: 1024,
    height: 720,
    resizable: true,
    title: 'Chess.com',
    icon: path.join(__dirname, 'icons/pawn.png'),
    webPreferences: {
      nodeIntegration: true, 
      contextIsolation: true, 
    }
  });
  win.setMenu(null); // Hide the default menu bar.
  // and load the chess.com website.
  win.loadURL('https://chess.com'); // Simplified URL loading.
}

function initializeAdBlocker() {
  ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
    blocker.enableBlockingInSession(session.defaultSession);
  }).catch(error => {
    console.error('Failed to initialize ad blocker:', error);
  });
}

// Electron app lifecycle events
app.whenReady().then(() => {
  initializeAdBlocker(); // Initialize the ad blocker right after the app is ready
  createWindow(); // Create the main window

  app.on('activate', () => {
    // macOS-specific behavior: recreate the window if the dock icon is clicked and no other windows are open
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Quit the app when all windows are closed (except on macOS)
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
