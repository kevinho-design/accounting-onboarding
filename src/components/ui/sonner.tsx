"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";
import { cn } from "./utils";

interface CustomToasterProps extends ToasterProps {
  offset?: string;
}

const Toaster = ({ offset, toastOptions, ...props }: CustomToasterProps) => {
  const { theme = "system" } = useTheme();

  const mergedToastOptions = {
    ...toastOptions,
    classNames: {
      ...toastOptions?.classNames,
      success: cn(
        "!bg-white !text-black border border-neutral-200 shadow-md",
        toastOptions?.classNames?.success,
      ),
      title: cn("!text-black font-semibold", toastOptions?.classNames?.title),
      description: cn("!text-neutral-950", toastOptions?.classNames?.description),
      icon: cn("!text-emerald-600", toastOptions?.classNames?.icon),
      closeButton: cn(
        "!border-neutral-200 !text-neutral-600 hover:!bg-neutral-100",
        toastOptions?.classNames?.closeButton,
      ),
    },
  };

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          ...(offset && { right: offset }),
        } as React.CSSProperties
      }
      toastOptions={mergedToastOptions}
      {...props}
    />
  );
};

export { Toaster };
