export function Divider({ className = '' }) {
  return <div className={`h-6 w-[1px] bg-hairline ${className}`.trim()} role="separator" />;
}
