import clsx from 'clsx';

export default function Alert({
  type,
  message
}: {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}) {
  const base = 'px-4 py-3 rounded-xl text-sm backdrop-blur-sm';
  const styles: Record<string, string> = {
    success: 'bg-green-500/20 text-green-400 border border-green-500/30',
    error: 'bg-red-500/20 text-red-400 border border-red-500/30',
    info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
  };
  return <div className={clsx(base, styles[type])}>{message}</div>;
}