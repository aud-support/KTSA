import React from 'react';
import { cn } from '../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, type, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1.5 text-sm text-foreground">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          'w-full px-3 py-2 bg-input-background border border-border rounded-lg',
          'text-foreground placeholder:text-muted-foreground',
          'focus:outline-none focus:ring-2 focus:ring-ktsa-primary/50',
          'transition-all duration-200',
          type === 'date' && 'color-scheme-dark',
          type === 'date' && '[&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer',
          error && 'border-destructive',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1.5 text-sm text-foreground">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'w-full px-3 py-2 bg-input-background border border-border rounded-lg',
          'text-foreground placeholder:text-muted-foreground',
          'focus:outline-none focus:ring-2 focus:ring-primary/50',
          'transition-all duration-200',
          'min-h-[100px]',
          error && 'border-destructive',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, error, options, className, ...props }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1.5 text-sm text-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={cn(
            'w-full px-3 py-2 pr-10 bg-input-background border border-border rounded-lg',
            'text-foreground appearance-none cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-ktsa-primary/50',
            'transition-all duration-200',
            error && 'border-destructive',
            className
          )}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ktsa-accent">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className={cn('transition-transform duration-200', isOpen && 'rotate-180')}
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
};
