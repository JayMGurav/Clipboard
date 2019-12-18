import { app, globalShortcut,Menu } from 'electron';
import {menubar} from 'menubar'

let mainWindow;

const mb = menubar({
  preloadWindow: true,
  index: `file://${__dirname}/index.jade`,
});

mb.on('ready', () => {
  const secondaryMenu = Menu.buildFromTemplate([{
    label: 'Quit',
    click() {
      mb.app.quit();
    },
    accelator: 'CommandOrControl+Q'
  }])

  mb.tray.on('right-click', () => {
    mb.tray.popUpContextMenu(secondaryMenu);
  })

  //global shortCut for reading and writing from clipboard
  const createClippingShortcut = globalShortcut.register(
    'CommandOrControl+!',
    () => {
      console.log('creating a new clipping');
      mainWindow.webContents.send('create-new-clipping');
    },
  );

  const createWriteClippingShortcut = globalShortcut.register(
    'CommandOrControl+@',
    () => {
      console.log('copying from clipboard');
      mainWindow.webContents.send('copy-clipping');
    },
  );

  if (!createClippingShortcut ) {
    console.error('Registration Failed', 'create-clipping');
  }
   if (!createWriteClippingShortcut ) {
    console.error('Registration Failed', 'copy-clipping');
  }
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.


const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
            nodeIntegration: true,
    },
    // show:false,d
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.jade`);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;


    // mainWindow.on('ready-to-show', () => {
    //   mainWindow.show()
    // })
  });

  
};




// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
