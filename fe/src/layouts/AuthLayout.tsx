import React from 'react';

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4 transition-colors duration-200">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-card p-6 flex flex-col gap-6 animate-slide-up transition-colors duration-200">
        {/* Header Branding */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-10 h-10 bg-brand-600 rounded-md flex items-center justify-center text-white font-bold text-lg shadow-subtle shrink-0">
            S
          </div>
          <h1 className="font-bold text-2xl tracking-tight text-neutral-900 dark:text-neutral-50">
            SaleDynamics
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Enterprise Point of Sale & Inventory Platform
          </p>
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
