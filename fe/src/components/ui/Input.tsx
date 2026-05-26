import React, { forwardRef, useId } from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, type = 'text', ...props }, ref) => {
    const reactId = useId();
    const inputId = id || reactId;

    return (
      <div className="w-full flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 select-none uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          type={type}
          className={clsx(
            'w-full px-3 py-2 text-sm rounded-md border bg-white text-neutral-900 transition-shadow duration-200 outline-hidden',
            'border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100',
            'focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:outline-hidden',
            error && 'border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-xs text-red-500 animate-slide-up" role="alert">
            {error}
          </span>
        )}
        {!error && helperText && (
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
