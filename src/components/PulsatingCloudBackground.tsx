import * as React from "react";

export function PulsatingCloudBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base */}
      <div className="absolute inset-0 bg-[#F8FAFF]" />

      {/* Subtle static orbs */}
      <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl" />
      <div className="absolute top-[20%] right-[15%] w-[400px] h-[400px] bg-gradient-to-br from-purple-200/15 to-pink-200/15 rounded-full blur-3xl" />
      <div className="absolute bottom-[10%] left-[25%] w-[450px] h-[450px] bg-gradient-to-br from-pink-200/15 to-blue-200/15 rounded-full blur-3xl" />
    </div>
  );
}