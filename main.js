const { app, BrowserWindow, ipcMain,  nativeTheme  } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow () {
	const win = new BrowserWindow({
		autoHideMenuBar: true,
		width: 578,
		height: 638,
        icon: path.join(__dirname, 'images/icon.ico'),
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	});

	ipcMain.handle('create-file', (req, data) => {
		if (!data || !data.title || !data.content) return false;

		const filePath = path.join(__dirname, 'notes', `${data.title}.txt`);
		fs.writeFileSync(filePath, data.content);

		return { success: true, filePath };
	})

	win.loadFile('src/index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
})

const { shell } = require('electron')
nativeTheme.themeSource = 'dark'
app.on('web-contents-created', (event, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    if (isSafeForExternalOpen(url)) {
      setImmediate(() => {
        shell.openExternal(url)
      })
    }

    return { action: 'deny' }
  })
})