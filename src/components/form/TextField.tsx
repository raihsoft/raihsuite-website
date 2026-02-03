import { forwardRef, InputHTMLAttributes } from 'react';
import clsx from 'clsx';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  variant?: 'light' | 'dark';
  hint?: string;
};

const TextField = forwardRef<HTMLInputElement, Props>(({ label, error, hint, className, id, variant = 'light', ...rest }, ref) => {
  const fieldId = id || rest.name;

  const variants = {
    light: {
      label: "text-gray-700",
      input: "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-purple-500/20 focus:border-purple-600"
    },
    dark: {
      label: "text-white/90",
      input: "bg-white/10 border-white/20 text-white placeholder-white/50 focus:ring-purple-500 focus:border-transparent"
    }
  };

  const styles = variants[variant];

  return (
    <div className="space-y-1.5">
      <label htmlFor={fieldId} className={clsx("block text-sm font-semibold", styles.label)}>
        {label}
        {rest.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {hint && <p className={clsx("text-xs mb-1", variant === 'dark' ? "text-white/60" : "text-gray-500")}>{hint}</p>}
      <input
        id={fieldId}
        ref={ref}
        aria-invalid={!!error}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={clsx(
          'w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200 focus:ring-4',
          styles.input,
          error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        {...rest}
      />
      {error && (
        <p id={`${fieldId}-error`} role="alert" className="text-xs text-red-500 font-medium">
          {error}
        </p>
      )}
    </div>
  );
});

TextField.displayName = 'TextField';
export default TextField;