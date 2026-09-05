import { MaterialIcon } from '../ui/MaterialIcon';
import { Divider } from '../ui/Divider';

export function ProfileTopBarActions({
  adminName = 'Admin',
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-body-md font-semibold normal-case text-ink">{adminName}</span>
    </div>
  );
}
