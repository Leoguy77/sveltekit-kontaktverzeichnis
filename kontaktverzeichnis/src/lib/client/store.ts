import { writable, type Writable } from "svelte/store"

interface ToastData {
  id: string
  title: string
  subtitle: string
  timeout?: number
  kind: "error" | "info" | "info-square" | "success" | "warning" | "warning-alt"
}

// export const toasts = writable([] as ToastData[])
export const toasts = writable<ToastData[]>([])

export const addToast = (toast: {
  title: string
  subtitle: string
  timeout?: number
  kind: "error" | "info" | "info-square" | "success" | "warning" | "warning-alt"
}) => {
  // Create a unique ID so we can easily find/remove it
  // if it is dismissible/has a timeout.
  const id = crypto.randomUUID()

  // Setup some sensible defaults for a toast.
  const defaults = {
    id,
    kind: "info",
    timeout: 3000,
  }

  // Push the toast to the top of the list of toasts
  toasts.update((all) => [{ ...defaults, ...toast }, ...all])

  // If toast is dismissible, dismiss it after "timeout" amount of time.
  if (toast.timeout) setTimeout(() => dismissToast(id), toast.timeout)
}

export const dismissToast = (id: string) => {
  toasts.update((all) => all.filter((t) => t.id !== id))
}
