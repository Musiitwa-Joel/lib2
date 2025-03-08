import { cn } from '@/lib/utils';
import { Module } from '@/types';
import * as Icons from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ModuleIconProps {
  module: Module;
}

export function ModuleIcon({ module }: ModuleIconProps) {
  const navigate = useNavigate();
  const Icon = Icons[module.icon as keyof typeof Icons];

  const handleClick = () => {
    navigate(module.path);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'group flex h-full flex-col items-center justify-center gap-4 rounded-xl p-6',
        'transition-all duration-300 ease-in-out',
        'hover:scale-105 hover:shadow-lg',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        'bg-white shadow-sm',
        module.color
      )}
    >
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-background">
        <Icon className="h-8 w-8" />
        <div className="absolute inset-0 rounded-2xl bg-foreground/5 transition-opacity group-hover:opacity-0" />
      </div>
      <div className="text-center">
        <h3 className="font-semibold">{module.name}</h3>
        <p className="text-sm text-muted-foreground">{module.description}</p>
      </div>
    </button>
  );
}