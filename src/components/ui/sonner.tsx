"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

interface CustomToasterProps extends ToasterProps {
  offset?: string;
}

const Toaster = ({ offset, ...props }: CustomToasterProps) => {
  const { theme = "system" } = useTheme();

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
      {...props}
    />
  );
};

export { Toaster };
