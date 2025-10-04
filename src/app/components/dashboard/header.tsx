import { UserCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Header() {
  const avatarImage = PlaceHolderImages.find((p) => p.id === 'user-avatar');

  return (
    <header className="flex items-center justify-between p-4 sm:p-6 border-b">
      <h1 className="text-2xl sm:text-3xl font-bold font-headline tracking-tight">
        DriveWise
      </h1>
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
    </header>
  );
}
