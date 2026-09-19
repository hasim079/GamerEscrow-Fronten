'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface StepperProps {
  currentStep: number; // 1 to 4
}

export function Stepper({ currentStep }: StepperProps) {
  const steps = [
    { number: 1, label: 'Payment locked' },
    { number: 2, label: 'Credentials sent' },
    { number: 3, label: 'Buyer confirms' },
    { number: 4, label: 'Funds released' },
  ];

  return (
    <div className="w-full py-2">
      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-2">
        {steps.map((step, idx) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;

          return (
            <React.Fragment key={step.number}>
              {/* Step Node */}
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div
                  className={`flex size-6 sm:size-7 items-center justify-center rounded-full text-xs font-bold transition-all ${isCompleted
                      ? 'bg-brand text-black shadow-sm'
                      : isActive
                        ? 'border-2 border-brand bg-brand/10 text-brand'
                        : 'border border-border/80 bg-muted/40 text-muted-foreground'
                    }`}
                >
                  {isCompleted ? (
                    <Check className="size-3.5 stroke-[2.5]" />
                  ) : (
                    <span className="text-[11px] font-semibold">{step.number}</span>
                  )}
                </div>

                <span
                  className={`text-xs whitespace-nowrap ${isActive
                      ? 'text-foreground font-bold'
                      : isCompleted
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground'
                    }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting line between steps */}
              {idx < steps.length - 1 && (
                <div className="hidden flex-1 sm:block px-2">
                  <div
                    className={`h-0.5 w-full rounded-full transition-colors ${currentStep > step.number ? 'bg-brand' : 'bg-border/60'
                      }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
