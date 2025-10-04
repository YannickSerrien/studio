import { UserCircle, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { SettingsDialog } from './settings-dialog';
import type { Settings as AppSettings } from '@/app/lib/data';

type HeaderProps = {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
};

export function Header({ settings, onSettingsChange }: HeaderProps) {
  const avatarImage = PlaceHolderImages.find((p) => p.id === 'user-avatar');

  return (
    <header className="flex items-center justify-between p-4 sm:p-6 border-b">
      <h1 className="text-2xl sm:text-3xl font-bold font-headline tracking-tight">
        DriveWise
      </h1>
      <div className="flex items-center gap-4">
        <SettingsDialog
          settings={settings}
          onSettingsChange={onSettingsChange}
        >
          <button>
            <Settings className="h-6 w-6 text-foreground/80 hover:text-foreground transition-colors" />
            <span className="sr-only">Settings</span>
          </button>
        </SettingsDialog>

        <Avatar>
          {avatarImage ? (
            <AvatarImage
              src={avatarImage.imageUrl}
              alt={avatarImage.description}
              data-ai-hint={avatarImage.imageHint}
            />
          ) : (
            <AvatarFallback>
              <UserCircle className="h-8 w-8" />
            </AvatarFallback>
          )}
        </Avatar>
      </div>
    </header>
  );
}
