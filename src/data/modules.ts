import { Module } from '@/types';

export const modules: Module[] = [
  {
    id: 'catalog',
    name: 'Book Catalog',
    icon: 'Library',
    description: 'Browse and manage the library collection',
    path: '/catalog',
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    id: 'circulation',
    name: 'Borrowing & Returns',
    icon: 'Repeat',
    description: 'Manage book circulation',
    path: '/circulation',
    color: 'bg-green-500/10 text-green-500',
  },
  {
    id: 'reservations',
    name: 'Reservations',
    icon: 'BookmarkPlus',
    description: 'Handle book reservations',
    path: '/reservations',
    color: 'bg-purple-500/10 text-purple-500',
  },
  {
    id: 'digital',
    name: 'Digital Library',
    icon: 'Files',
    description: 'Access digital resources',
    path: '/digital',
    color: 'bg-indigo-500/10 text-indigo-500',
  },
  {
    id: 'fines',
    name: 'Fines & Penalties',
    icon: 'Receipt',
    description: 'Manage library fines',
    path: '/fines',
    color: 'bg-red-500/10 text-red-500',
  },
  {
    id: 'clearance',
    name: 'Graduation Clearance',
    icon: 'GraduationCap',
    description: 'Process graduation clearances',
    path: '/clearance',
    color: 'bg-yellow-500/10 text-yellow-500',
  },
  {
    id: 'papers',
    name: 'Past Papers',
    icon: 'FileText',
    description: 'Access past examination papers',
    path: '/papers',
    color: 'bg-orange-500/10 text-orange-500',
  },
  {
    id: 'reports',
    name: 'Reports & Analytics',
    icon: 'BarChart3',
    description: 'View library statistics',
    path: '/reports',
    color: 'bg-cyan-500/10 text-cyan-500',
  },
  {
    id: 'interlibrary',
    name: 'Inter-Library Loans',
    icon: 'Network',
    description: 'Request books from partner libraries',
    path: '/interlibrary',
    color: 'bg-pink-500/10 text-pink-500',
  },
];