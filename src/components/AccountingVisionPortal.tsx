import * as React from "react";
import { ArrowRight } from "lucide-react";

interface AccountingVisionPortalProps {
  onPillar1: () => void; // Jennifer → migration onboarding → dashboard
  onPillar2: () => void; // Sarah   → bookkeeper invite → transactions
  onPillar3: () => void; // Ryan    → finances hub directly
}

function PersonaIllustration({ src, name }: { src: string; name: string }) {
  return (
    <img
      src={src}
      alt={name}
      className="object-contain"
      style={{ height: 160, width: "auto" }}
    />
  );
}

const PILLARS = [
  {
    badge: "Pillar 1",
    badgeColor: "#EFF6FF",
    badgeText: "#3B82F6",
    title: "Setup & Onboarding",
    subtitle: "Configure the software",
    src: "/persona-jennifer.png",
    name: "Jennifer Hart",
    role: "Controller",
    description:
      "Jennifer sets up Clio Accounting for the firm, migrates existing books, and lands in the AI-powered accounting dashboard ready to work.",
    cta: "Start setup",
    accentColor: "#3B82F6",
  },
  {
    badge: "Pillar 2",
    badgeColor: "#F0FDF4",
    badgeText: "#16A34A",
    title: "Daily Bookkeeping",
    subtitle: "Manage day-to-day finances",
    src: "/persona-sarah.png",
    name: "Sarah Martinez",
    role: "Bookkeeper",
    description:
      "Sarah receives an invite from Jennifer, completes a focused onboarding, and manages the firm's transactions with AI-assisted categorisation.",
    cta: "Open daily work",
    accentColor: "#16A34A",
  },
  {
    badge: "Pillar 3",
    badgeColor: "#FFF7ED",
    badgeText: "#EA580C",
    title: "Financial Oversight",
    subtitle: "Keep a handle on firm finances",
    src: "/persona-ryan.png",
    name: "Ryan Chen",
    role: "Managing Partner",
    description:
      "Ryan monitors the firm's financial health, reviews reports, and makes strategic decisions from the Finances hub.",
    cta: "View firm finances",
    accentColor: "#EA580C",
  },
];

export function AccountingVisionPortal({ onPillar1, onPillar2, onPillar3 }: AccountingVisionPortalProps) {
  const handlers = [onPillar1, onPillar2, onPillar3];

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-12 pt-12 pb-8 max-w-6xl mx-auto w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Accounting Vision</h1>

        <p className="text-sm text-gray-600 leading-relaxed">
          Use the paths below to explore this product vision prototype. Each pillar highlights how Clio Accounting
          adapts to different roles within the firm — from initial setup to daily operations to executive oversight —
          offering a clear view of how the experience evolves depending on who is using it.
        </p>

      </div>

      {/* Cards */}
      <div className="px-12 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-3 gap-6">
          {PILLARS.map((pillar, i) => (
            <div
              key={pillar.badge}
              className="flex flex-col rounded-2xl border border-gray-200 overflow-hidden"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
            >
              <div className="flex flex-col flex-1 p-6">
                {/* Badge */}
                <div className="mb-3">
                  <span
                    className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                    style={{ backgroundColor: pillar.badgeColor, color: pillar.badgeText }}
                  >
                    {pillar.badge}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 mb-1">{pillar.title}</h2>
                <p className="text-sm text-gray-500 mb-5">{pillar.subtitle}</p>

                {/* Illustration */}
                <div className="flex justify-center mb-5">
                  <PersonaIllustration src={pillar.src} name={pillar.name} />
                </div>

                {/* Name + role */}
                <div className="text-center mb-4">
                  <p className="text-base font-bold text-gray-900">{pillar.name}</p>
                  <p className="text-sm text-gray-500">{pillar.role}</p>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 text-center leading-relaxed mb-6 flex-1">
                  {pillar.description}
                </p>

                {/* CTA */}
                <button
                  onClick={handlers[i]}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{ backgroundColor: pillar.accentColor }}
                >
                  {pillar.cta}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-12 max-w-6xl mx-auto w-full mt-8 text-center">
        <p className="text-2xl font-semibold text-gray-700">
          Your books run themselves. You move the firm forward.
        </p>
      </div>

      <div className="py-10" />
    </div>
  );
}
