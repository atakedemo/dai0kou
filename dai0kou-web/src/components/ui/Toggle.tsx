import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={`toggle-${label}`}
        checked={checked}
        onCheckedChange={onChange}
      />
      <Label htmlFor={`toggle-${label}`}>{label}</Label>
    </div>
  )
}

