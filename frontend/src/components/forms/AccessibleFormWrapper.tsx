import { ReactNode } from 'react';

interface AccessibleFormWrapperProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onSubmit: (e: React.FormEvent) => void;
}

export const AccessibleFormWrapper = ({
  children,
  currentStep,
  totalSteps,
  onSubmit,
}: AccessibleFormWrapperProps) => {
  return (
    <form
      onSubmit={onSubmit}
      aria-label="Story creation form"
      role="form"
    >
      <div
        role="region"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        Step {currentStep + 1} of {totalSteps}
      </div>
      {children}
    </form>
  );
};
