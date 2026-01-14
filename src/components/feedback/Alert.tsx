import clsx from 'clsx';

export default function Alert({
  type,
  message
}: {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}) {
  const base = 'px-4 py-3 rounded text-sm';
  const styles: Record<string, string> = {
    success: 'bg-green-100 text-green-800 border border-green-200',
    error: 'bg-red-100 text-red-800 border border-red-200',
    info: 'bg-blue-100 text-blue-800 border border-blue-200',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200'
  };
  return <div className={clsx(base, styles[type])}>{message}</div>;
}