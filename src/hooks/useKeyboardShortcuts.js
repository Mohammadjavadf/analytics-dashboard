import { useEffect } from 'react'

/**
 * @param {Array<{key:string, ctrl?:boolean, meta?:boolean, shift?:boolean, handler:Function}>} bindings
 */
export function useKeyboardShortcuts(bindings = []) {
  useEffect(() => {
    function onKey(e) {
      for (const b of bindings) {
        const needCtrl = b.ctrl
        const needMeta = b.meta
        const needShift = b.shift ?? false

        const ctrlOk = needCtrl === undefined ? true : needCtrl ? (e.ctrlKey || e.metaKey) : !(e.ctrlKey || e.metaKey)
        const shiftOk = needShift ? e.shiftKey : true
        const keyOk = e.key.toLowerCase() === b.key.toLowerCase()

        // اگر ctrl خواسته شده و کاربر ctrl/meta ندارد، رد کن
        if (needCtrl && !(e.ctrlKey || e.metaKey)) continue
        if (needMeta && !e.metaKey) continue
        if (!needCtrl && !needMeta && (e.ctrlKey || e.metaKey)) continue

        if (keyOk && ctrlOk && shiftOk) {
          // اجازه بده Esc/Enter در ورودی‌ها هم کار کند (به جز ctrl)
          e.preventDefault()
          b.handler(e)
          return
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [bindings])
}