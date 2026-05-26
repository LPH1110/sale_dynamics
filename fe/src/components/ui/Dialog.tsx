import React, { Fragment } from 'react';
import { Dialog as HUIDialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className,
}) => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <HUIDialog onClose={onClose} className="relative z-50">
        {/* Overlay backdrop */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-250"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-neutral-950/40 dark:bg-neutral-950/70" aria-hidden="true" />
        </TransitionChild>

        {/* Scrollable container */}
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-250"
            enterFrom="opacity-0 scale-95 translateY(8px)"
            enterTo="opacity-100 scale-100 translateY(0)"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100 translateY(0)"
            leaveTo="opacity-0 scale-95 translateY(8px)"
          >
            <DialogPanel
              className={clsx(
                'w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-popover p-6 flex flex-col gap-4 relative animate-slide-up',
                sizes[size],
                className
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                {title ? (
                  <DialogTitle className="text-base font-semibold text-neutral-900 dark:text-neutral-50 leading-6">
                    {title}
                  </DialogTitle>
                ) : (
                  <div />
                )}
                <button
                  onClick={onClose}
                  className="rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 p-1 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="text-sm text-neutral-600 dark:text-neutral-300">
                {children}
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </HUIDialog>
    </Transition>
  );
};

export default Dialog;
