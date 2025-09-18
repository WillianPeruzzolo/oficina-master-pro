import { useWorkshopSettingsContext } from "@/contexts/WorkshopSettingsContext";

interface LogoProps {
  className?: string;
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = "", showName = true, size = 'md' }: LogoProps) {
  const { settings } = useWorkshopSettingsContext();

  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  if (!settings.logo_url && !showName) {
    return null;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {settings.logo_url && (
        <img 
          src={settings.logo_url} 
          alt={settings.workshop_name}
          className={`${sizeClasses[size]} object-contain rounded`}
        />
      )}
      {showName && (
        <span className="font-semibold text-foreground">
          {settings.workshop_name}
        </span>
      )}
    </div>
  );
}