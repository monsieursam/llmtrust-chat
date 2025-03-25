'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Layers, Settings } from 'lucide-react';

import { cn } from '@/lib/utils';

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

const NavItem = ({ href, label, icon, active }: NavItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-primary text-primary-foreground'
          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
      )}
    >
      {icon}
      {label}
    </Link>
  );
};

export default function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />,
      active: pathname === '/admin',
    },
    {
      href: '/admin/models',
      label: 'Models',
      icon: <Settings className="h-4 w-4" />,
      active: pathname.startsWith('/admin/models'),
    },
    {
      href: '/admin/aiapps',
      label: 'AI Apps',
      icon: <Layers className="h-4 w-4" />,
      active: pathname.startsWith('/admin/aiapps'),
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      {navItems.map((item) => (
        <NavItem
          key={item.href}
          href={item.href}
          label={item.label}
          icon={item.icon}
          active={item.active}
        />
      ))}
    </div>
  );
}
