import { User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileSectionProps {
  user: User;
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'librarian':
        return 'bg-blue-500/10 text-blue-500';
      case 'assistant':
        return 'bg-purple-500/10 text-purple-500';
      case 'student':
        return 'bg-green-500/10 text-green-500';
    }
  };

  return (
    <div className="flex h-screen w-80 flex-col border-r bg-white p-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5 text-neutral-500" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5 text-neutral-500" />
        </Button>
      </div>

      <div className="mt-8 flex flex-col items-center">
        <Avatar className="h-20 w-20">
          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <h2 className="mt-4 text-xl font-semibold text-neutral-900">{user.name}</h2>
        <Badge variant="secondary" className={`mt-2 ${getRoleColor(user.role)}`}>
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </Badge>
        <p className="mt-1 text-sm text-neutral-500">{user.email}</p>
      </div>

      <div className="mt-8 space-y-4">
        <div className="rounded-lg bg-neutral-50 p-4">
          <h3 className="text-sm font-medium text-neutral-900">Quick Stats</h3>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600">Books Borrowed</span>
              <span className="font-medium text-neutral-900">3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600">Due Soon</span>
              <span className="font-medium text-neutral-900">1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600">Pending Fines</span>
              <span className="font-medium text-neutral-900">$0.00</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <Button className="w-full" variant="outline">
          View Profile
        </Button>
      </div>
    </div>
  );
}