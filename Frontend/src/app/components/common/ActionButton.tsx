import React from 'react';
import { Button, ButtonProps } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '../ui/utils';

export type ActionPreset = 'primary' | 'secondary' | 'danger' | 'success' | 'warning';

interface ActionButtonProps extends ButtonProps {
  isLoading?: boolean;
  preset?: ActionPreset;
}

const presetStyles: Record<ActionPreset, string> = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white",
  secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900 border-0 shadow-none",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  success: "bg-green-600 hover:bg-green-700 text-white",
  warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
};

export const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ className, isLoading, children, disabled, preset, variant, ...props }, ref) => {
    // If a preset is defined, we unset the default variant to prevent style conflicts
    const buttonVariant = preset ? undefined : variant;
    
    return (
      <Button
        ref={ref}
        variant={buttonVariant as any}
        className={cn(preset && presetStyles[preset], className, "cursor-pointer")}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Button>
    );
  }
);

ActionButton.displayName = 'ActionButton';
