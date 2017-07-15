'use strict';
const os = require('os');
const electron = require('electron');

const {dialog} = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const shell = electron.shell;
const appName = app.getName();

function sendAction(action) {
	const win = BrowserWindow.getAllWindows()[0];

	if (process.platform === 'darwin') {
		win.restore();
	}

	win.webContents.send(action);
}

function clearCache() {
	const win = BrowserWindow.getAllWindows()[0];
	const ses = win.webContents.session;
	ses.clearCache(() => {
		dialog.showMessageBox({type: 'info', buttons: [], message: 'Cache cleared!'});
	});
}

const historySubmenu = [
	{
		label: 'Back',
		accelerator: process.platform === 'darwin' ? 'Command+[' : 'Alt+Left',
		click(item, focusedWindow) {
			if (focusedWindow) {
				sendAction('back');
			}
		}
	},
	{
		label: 'Forward',
		accelerator: process.platform === 'darwin' ? 'Command+]' : 'Alt+Right',
		click(item, focusedWindow) {
			if (focusedWindow) {
				sendAction('forward');
			}
		}
	}
];

const viewSubmenu = [
	{
		label: 'Reload',
		click(item, focusedWindow) {
			if (focusedWindow) {
				sendAction('reload');
			}
		}
	},
	{
		type: 'separator'
	},
	{
		role: 'togglefullscreen'
	},
	{
		label: 'Zoom In',
		accelerator: 'CommandOrControl+=',
		click(item, focusedWindow) {
			if (focusedWindow) {
				sendAction('zoomIn');
			}
		}
	},
	{
		label: 'Zoom Out',
		accelerator: 'CommandOrControl+-',
		click(item, focusedWindow) {
			if (focusedWindow) {
				sendAction('zoomOut');
			}
		}
	},
	{
		label: 'Actual Size',
		accelerator: 'CommandOrControl+0',
		click(item, focusedWindow) {
			if (focusedWindow) {
				sendAction('zoomActualSize');
			}
		}
	},
	{
		type: 'separator'
	},
	{
		label: 'Toggle Tray Icon',
		click(item, focusedWindow) {
			if (focusedWindow) {
				focusedWindow.webContents.send('toggletray');
			}
		}
	},
	{
		label: 'Toggle DevTools for Zulip App',
		accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
		click(item, focusedWindow) {
			if (focusedWindow) {
				focusedWindow.webContents.toggleDevTools();
			}
		}
	},
	{
		label: 'Toggle DevTools for Active Tab',
		accelerator: process.platform === 'darwin' ? 'Alt+Command+U' : 'Ctrl+Shift+U',
		click(item, focusedWindow) {
			if (focusedWindow) {
				sendAction('tab-devtools');
			}
		}
	}
];

const helpSubmenu = [
	{
		label: `${appName} Website`,
		click() {
			shell.openExternal('https://zulipchat.com/help/');
		}
	},
	{
		label: `${appName + 'Desktop'} - ${app.getVersion()}`,
		enabled: false
	},
	{
		label: 'Report an Issue...',
		click() {
			const body = `
<!-- Please succinctly describe your issue and steps to reproduce it. -->
-
${app.getName()} ${app.getVersion()}
Electron ${process.versions.electron}
${process.platform} ${process.arch} ${os.release()}`;

			shell.openExternal(`https://github.com/zulip/zulip-electron/issues/new?body=${encodeURIComponent(body)}`);
		}
	}
];

const experimentSubmenu = [
	{
		label: `Theme`,
		click() {
			shell.openExternal('https://electron.atom.io/docs/');
		}
	}
];

const darwinTpl = [

	{
		label: `${app.getName()}`,
		submenu: [
			{
				label: 'Zulip desktop',
				click(item, focusedWindow) {
					if (focusedWindow) {
						sendAction('open-about');
					}
				}
			},
			{
				type: 'separator'
			},
			{
				label: 'Settings',
				accelerator: 'Cmd+,',
				click(item, focusedWindow) {
					if (focusedWindow) {
						sendAction('open-settings');
					}
				}
			},
			{
				label: 'Keyboard shortcuts',
				accelerator: 'Cmd+K',
				click(item, focusedWindow) {
					if (focusedWindow) {
						sendAction('shortcut');
					}
				}
			},
			{
				type: 'separator'
			},
			{
				label: 'Clear Cache',
				click() {
					clearCache();
				}
			},
			{
				label: 'Log Out',
				accelerator: 'Cmd+L',
				click(item, focusedWindow) {
					if (focusedWindow) {
						sendAction('log-out');
					}
				}
			},
			{
				type: 'separator'
			},
			{
				role: 'services',
				submenu: []
			},
			{
				type: 'separator'
			},
			{
				role: 'hide'
			},
			{
				role: 'hideothers'
			},
			{
				role: 'unhide'
			},
			{
				type: 'separator'
			},
			{
				role: 'quit'
			}
		]
	},
	{
		label: 'Edit',
		submenu: [
			{
				role: 'undo'
			},
			{
				role: 'redo'
			},
			{
				type: 'separator'
			},
			{
				role: 'cut'
			},
			{
				role: 'copy'
			},
			{
				role: 'paste'
			},
			{
				role: 'pasteandmatchstyle'
			},
			{
				role: 'delete'
			},
			{
				role: 'selectall'
			}
		]
	},
	{
		label: 'View',
		submenu: viewSubmenu
	},
	{
		label: 'History',
		submenu: historySubmenu
	},
	{
		role: 'window',
		submenu: [
			{
				role: 'minimize'
			},
			{
				role: 'close'
			},
			{
				type: 'separator'
			},
			{
				role: 'front'
			}
		]
	},
	{
		role: 'help',
		submenu: helpSubmenu
	}
];

const otherTpl = [
	{
		label: 'File',
		submenu: [
			{
				label: 'Zulip desktop',
				click(item, focusedWindow) {
					if (focusedWindow) {
						sendAction('open-about');
					}
				}
			},
			{
				type: 'separator'
			},
			{
				label: 'Settings',
				accelerator: 'Ctrl+,',
				click(item, focusedWindow) {
					if (focusedWindow) {
						sendAction('open-settings');
					}
				}
			},
			{
				type: 'separator'
			},
			{
				label: 'Keyboard shortcuts',
				accelerator: 'Ctrl+K',
				click(item, focusedWindow) {
					if (focusedWindow) {
						sendAction('shortcut');
					}
				}
			},
			{
				type: 'separator'
			},
			{
				label: 'Clear Cache',
				click() {
					clearCache();
				}
			},
			{
				label: 'Log Out',
				accelerator: 'Ctrl+L',
				click(item, focusedWindow) {
					if (focusedWindow) {
						sendAction('log-out');
					}
				}
			},
			{
				type: 'separator'
			},
			{
				role: 'quit',
				accelerator: 'Ctrl+Q'
			}
		]
	},
	{
		label: 'Edit',
		submenu: [
			{
				role: 'undo'
			},
			{
				role: 'redo'
			},
			{
				type: 'separator'
			},
			{
				role: 'cut'
			},
			{
				role: 'copy'
			},
			{
				role: 'paste'
			},
			{
				role: 'pasteandmatchstyle'
			},
			{
				role: 'delete'
			},
			{
				type: 'separator'
			},
			{
				role: 'selectall'
			}
		]
	},
	{
		label: 'View',
		submenu: viewSubmenu
	},
	{
		label: 'History',
		submenu: historySubmenu
	},
	{
		role: 'help',
		submenu: helpSubmenu
	},
	{
		label: 'Experiment',
		submenu: experimentSubmenu
	},
];

const tpl = process.platform === 'darwin' ? darwinTpl : otherTpl;

module.exports = electron.Menu.buildFromTemplate(tpl);
