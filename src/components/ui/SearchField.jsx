import { MaterialIcon } from './MaterialIcon';

export function SearchField({
  placeholder = 'Search...',
  className = '',
  variant = 'full',
  value,
  onChange,
}) {
  const inputClass = variant === 'full' ? 'input-search-full' : 'input-search';

  return (
    <div className={`group relative ${className}`.trim()}>
      <MaterialIcon
        name="search"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors group-focus-within:text-primary"
      />
      <input
        type="search"
        className={inputClass}
        placeholder={placeholder}
        aria-label={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
