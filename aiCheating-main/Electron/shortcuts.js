import { globalShortcut } from "electron";

export default function setShortcut(shortcut, ...fns) {
  globalShortcut.register(shortcut,()=>{
      for (const fn of fns) {
        if (typeof fn === 'function') {
          fn();
        }
      }
    })
  
}
