import React from 'react';

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLElement>
>(({ ...props }, ref) => {
  return (
    <input
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      {...props}
      ref={ref}
    />
  );
});

Input.displayName = 'Input';

// export const Input = React.forwardRef<HTMLInputElement>(_Input);
