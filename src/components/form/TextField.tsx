import { forwardRef, InputHTMLAttributes } from 'react';
import clsx from 'clsx';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

const TextField = forwardRef<HTMLInputElement, Props>(({ label, error, className, id, ...rest }, ref) => {
  const fieldId = id || rest.name;
  return (
    <div className="space-y-1">
      <label htmlFor={fieldId} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={fieldId}
        ref={ref}
        aria-invalid={!!error}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={clsx(
          'w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-brand-light focus:outline-none',
          error && 'border-red-500',
          className
        )}
        {...rest}
      />
      {error && (
        <p id={`${fieldId}-error`} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

TextField.displayName = 'TextField';
export default TextField;