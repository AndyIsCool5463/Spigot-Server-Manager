const { app, BrowserWindow, dialog, autoUpdater } = require("electron");
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
const server = "https://your-deployment-url.com";
const feed = `${server}/update/${process.platform}/${app.getVersion()}`;
setInterval(() => {
  autoUpdater.checkForUpdates();
}, 60000);
autoUpdater.setFeedURL(feed);
function createWindow() {
  autoUpdater.checkForUpdates();
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
  win.loadFile("index.html");
  win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});
autoUpdater.on("update-downloaded", (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: "info",
    buttons: ["Restart", "Later"],
    title: "Application Update",
    message: process.platform === "win32" ? releaseNotes : releaseName,
    detail:
      "A new version has been downloaded. Restart the application to apply the updates."
  };

  dialog.showMessageBox(dialogOpts, response => {
    if (response === 0) autoUpdater.quitAndInstall();
  });
});
autoUpdater.on("error", message => {
  console.error("There was a problem updating the application");
  console.error(message);
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
