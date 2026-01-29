import Link from 'next/link';
import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger';
  href?: string;
};

export default function Button({ variant = 'primary', className, href, ...rest }: Props) {
  const styles: Record<string, string> = {
    primary: 'bg-brand-light text-white hover:bg-brand-dark',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };

  const classes = clsx(
    'inline-flex items-center px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed justify-center',
    styles[variant],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {rest.children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      {...rest}
    />
  );
}