"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  control?: any
  name: string
  rules?: any
  render: ({ field }: { field: any }) => React.ReactNode
}

const FormField: React.FC<FormFieldProps> = ({ render, name }) => {
  const field = {
    name,
    value: "",
    onChange: () => {},
    onBlur: () => {},
  }

  return <>{render({ field })}</>
}

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props} />
))
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
))
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => (
  <div ref={ref} {...props} />
))
FormControl.displayName = "FormControl"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm font-medium text-destructive", className)}
    {...props}
  >
    {children}
  </p>
))
FormMessage.displayName = "FormMessage"

export {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
}