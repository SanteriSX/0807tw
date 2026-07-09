import { app, BrowserWindow, ipcMain, screen, globalShortcut } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { ansHandler } from './ipchandlers/ansHandler.js'
import registerArrowShortcuts from './moveWindow.js'
import setShortcut from './shortcuts.js'
import apiKeyHandler from './ipchandlers/keyStorage.js'
import Store from 'electron-store'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const width = 450
const gap = 45

let isRecordable = true

const store = new Store()

let mainWin
let settingWin
let win


const getDistPath = () => {
  return path.join(app.getAppPath(), 'dist', 'index.html')
}


// Главное окно-панель
const createWindow = () => {

  mainWin = new BrowserWindow({
    width: width,
    height: 35,
    maxHeight: 35,
    transparent: true,
    frame: false,
    resizable: true,
    acceptFirstMouse: false,
    hasShadow: false,

    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })


  mainWin.loadFile(
    path.join(__dirname, 'mainBarUi/mainbar.html')
  )


  mainWin.setAlwaysOnTop(true, 'screen-saver')
  mainWin.setVisibleOnAllWorkspaces(true, {
    visibleOnFullScreen: true
  })

  mainWin.setContentProtection(false)


  mainWin.once('ready-to-show', () => {
    const { width } = screen.getPrimaryDisplay().workAreaSize
    const side = Math.floor(width / 2 - 150)

    mainWin.setPosition(side, 200)
  })


  apiKeyHandler()


  setShortcut(
    'CommandOrControl+Enter',
    () => {
      if (win && !win.isDestroyed()) {
        win.close()
      }
    },
    ansWindow,
    () => ansHandler(store.get('gemini.key'))
  )


  ipcMain.on('ans-btn', () => {

    if (win && !win.isDestroyed()) {

      win.close()

    } else {

      ansWindow()
      ansHandler(store.get('gemini.key'))

    }

  })


  setShortcut(
    'CommandOrControl+O',
    () => {

      if (settingWin && !settingWin.isDestroyed()) {

        settingWin.close()

      } else {

        createSettingWin()

      }

    }
  )


  ipcMain.on('setting-btn', () => {

    if (settingWin && !settingWin.isDestroyed()) {

      settingWin.close()

    } else {

      createSettingWin()

    }

  })


  setShortcut(
    'CommandOrControl+\\',
    () => {

      if (mainWin.isVisible()) {

        mainWin.hide()

        try {
          win.hide()
        } catch {}

        try {
          settingWin.hide()
        } catch {}

      } else {

        mainWin.show()

        try {
          win.show()
        } catch {}

        try {
          settingWin.show()
        } catch {}

      }

    }
  )


  registerArrowShortcuts(mainWin)

}



// Окно ответа AI
const ansWindow = async () => {

  win = new BrowserWindow({

    width: 700,
    height: 300,
    maxHeight: 600,

    transparent: true,
    frame: false,
    resizable: true,

    acceptFirstMouse: false,
    hasShadow: false,

    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }

  })


  const answerFile = getDistPath()


  win.loadFile(answerFile, {
    hash: '/answer'
  })


  const [mainX, mainY] = mainWin.getPosition()

  win.setPosition(
    mainX,
    mainY + gap
  )


  win.setAlwaysOnTop(true, 'screen-saver')

  win.setVisibleOnAllWorkspaces(true, {
    visibleOnFullScreen: true
  })


  win.setContentProtection(false)



  mainWin.on('move', () => {

    const [x, y] = mainWin.getPosition()

    win.setPosition(
      x,
      y + gap
    )

  })



  win.on('ready-to-show', () => {

    const [x, y] = mainWin.getPosition()

    win.setPosition(
      x,
      y + gap
    )

  })



  ipcMain.on('change-height', (event, height) => {

    const [w] = win.getSize()

    win.setSize(
      w,
      height
    )

  })



  let clickable = false


  setShortcut(
    'CommandOrControl+V',
    () => {

      win.setIgnoreMouseEvents(!clickable)

      clickable = !clickable

    }
  )



  setShortcut(
    'CommandOrControl+Shift+I',
    () => {

      win.webContents.openDevTools()

    }
  )

}



// Окно настроек
const createSettingWin = () => {


  settingWin = new BrowserWindow({

    width: width,
    height: 300,

    maxHeight: 600,

    transparent: true,
    frame: false,
    resizable: true,

    acceptFirstMouse: false,
    hasShadow: false,

    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }

  })


  const settingFile = getDistPath()


  settingWin.loadFile(settingFile, {
    hash: '/settings'
  })



  const [x, y] = mainWin.getPosition()

  settingWin.setPosition(
    x,
    y + gap
  )


  settingWin.setAlwaysOnTop(true, 'screen-saver')

  settingWin.setVisibleOnAllWorkspaces(true, {
    visibleOnFullScreen: true
  })


  settingWin.setContentProtection(false)



  mainWin.on('move', () => {

    const [x, y] = mainWin.getPosition()

    settingWin.setPosition(
      x,
      y + gap
    )

  })


  settingWin.on('ready-to-show', () => {

    const [x, y] = mainWin.getPosition()

    settingWin.setPosition(
      x,
      y + gap
    )

  })



  setShortcut(
    'CommandOrControl+Shift+I',
    () => {

      settingWin.webContents.openDevTools()

    }
  )

}



app.whenReady().then(() => {


  createWindow()


  ipcMain.on('close-btn', () => {

    app.quit()

  })


  setShortcut(
    'CommandOrControl+Shift+V',
    () => {

      isRecordable = false

    }
  )


})
