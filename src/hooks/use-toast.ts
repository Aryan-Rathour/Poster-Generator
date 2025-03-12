"use client"

import type React from "react"

import type { ToastActionElement, ToastProps } from "@/components/ui/toast"
import { useToast as useToastPrimitive } from "@/components/ui/use-toast"

type ToastActionType = typeof ToastActionElement

export type ToastOptions = Omit<ToastProps, "id"> & {
  id?: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionType
  variant?: "default" | "destructive"
}

export function useToast() {
  const { toast, dismiss, toasts } = useToastPrimitive()

  return {
    toast: (options: ToastOptions) => {
      return toast({
        ...options,
        variant: options.variant || "default",
      })
    },
    dismiss,
    toasts,
  }
}

