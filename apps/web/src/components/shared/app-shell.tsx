import type { LucideIcon } from 'lucide-react';
import {
  ArrowRightLeft,
  LayoutDashboard,
  PiggyBank,
  Receipt,
  Sparkles,
  Tag,
  TrendingUp,
  Wallet,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, Outlet, useMatch } from 'react-router';
import {
  AccountMenu,
  SidebarAccountMenu,
} from '@/components/shared/account-menu';
import { LogoMark } from '@/components/shared/logo';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  APP_STORE_URL,
  dismissAppBanner,
  shouldShowAppBanner,
} from '@/lib/platform';

interface NavItem {
  // i18n key under common:nav.items.*
  titleKey: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
  badge?: string;
  disabled?: boolean;
}

interface NavGroup {
  // i18n key under common:nav.groups.*
  labelKey: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    labelKey: 'overview',
    items: [
      { titleKey: 'dashboard', to: '/', icon: LayoutDashboard, end: true },
    ],
  },
  {
    labelKey: 'money',
    items: [
      { titleKey: 'expenses', to: '/expenses', icon: Receipt },
      { titleKey: 'incomes', to: '/incomes', icon: TrendingUp },
      { titleKey: 'essentials', to: '/essentials', icon: Wallet },
      { titleKey: 'budgets', to: '/budgets', icon: PiggyBank },
    ],
  },
  {
    labelKey: 'manage',
    items: [
      { titleKey: 'categories', to: '/categories', icon: Tag },
      { titleKey: 'rates', to: '/rates', icon: ArrowRightLeft },
    ],
  },
  {
    labelKey: 'assistant',
    items: [{ titleKey: 'aiChat', to: '/ai-chat', icon: Sparkles }],
  },
];

const activeLinkClass =
  'data-active:bg-gradient-to-r data-active:from-sidebar-primary data-active:to-primary data-active:text-sidebar-primary-foreground data-active:shadow-sm data-active:shadow-sidebar-primary/30 data-active:font-medium data-active:hover:text-sidebar-primary-foreground';

export function AppShell() {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <SidebarInset className='h-svh overflow-hidden'>
        <AppStoreBanner />
        <AppTopbar />
        <main className='flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 md:gap-6 md:p-6'>
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function AppSidebar() {
  const { t } = useTranslation('common');
  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <Link to='/'>
                <LogoMark
                  aria-hidden
                  className='size-8! rounded-lg shadow-sm shadow-primary/30 ring-1 ring-primary/20'
                />
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>
                    {t('brand.name')}
                  </span>
                  <span className='truncate text-xs text-muted-foreground'>
                    {t('brand.tagline')}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.labelKey}>
            <SidebarGroupLabel className='text-[0.65rem] font-medium tracking-wider uppercase'>
              {t(`nav.groups.${group.labelKey}`)}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <NavItem key={item.to} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarAccountMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function NavItem({ item }: { item: NavItem }) {
  const { t } = useTranslation('common');
  const match = useMatch({ path: item.to, end: item.end ?? false });
  const title = t(`nav.items.${item.titleKey}`);

  if (item.disabled) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton disabled aria-disabled='true' tooltip={title}>
          <item.icon />
          <span>{title}</span>
        </SidebarMenuButton>
        {item.badge ? (
          <SidebarMenuBadge className='bg-sidebar-primary/15 text-sidebar-primary'>
            {item.badge}
          </SidebarMenuBadge>
        ) : null}
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={!!match}
        tooltip={title}
        className={activeLinkClass}
      >
        <NavLink to={item.to} end={item.end}>
          <item.icon />
          <span>{title}</span>
        </NavLink>
      </SidebarMenuButton>
      {item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
    </SidebarMenuItem>
  );
}

/**
 * Points iOS browser users at the native app. Reaches the browsers Safari's
 * `apple-itunes-app` smart banner can't (Chrome/Firefox on iOS), so the two
 * overlap only in Safari — where iOS suppresses ours once dismissed anyway.
 *
 * Dismissal is permanent by design: the web app stays fully usable on mobile,
 * and a nag that keeps coming back is worse than one that's ignored once.
 */
function AppStoreBanner() {
  const { t } = useTranslation('common');
  // Read once on mount — platform and dismissal don't change mid-session.
  const [show, setShow] = useState(shouldShowAppBanner);

  if (!show) return null;

  return (
    <div className='flex shrink-0 items-center gap-3 border-b bg-sidebar px-3 py-2'>
      <LogoMark
        aria-hidden
        className='size-9! shrink-0 rounded-lg shadow-sm shadow-primary/30 ring-1 ring-primary/20'
      />
      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-medium'>{t('appBanner.title')}</p>
        <p className='truncate text-xs text-muted-foreground'>
          {t('appBanner.subtitle')}
        </p>
      </div>
      <Button asChild size='sm' className='shrink-0'>
        <a href={APP_STORE_URL} target='_blank' rel='noreferrer'>
          {t('appBanner.action')}
        </a>
      </Button>
      <Button
        variant='ghost'
        size='icon'
        className='shrink-0 text-muted-foreground'
        aria-label={t('appBanner.dismiss')}
        onClick={() => {
          dismissAppBanner();
          setShow(false);
        }}
      >
        <X />
      </Button>
    </div>
  );
}

function AppTopbar() {
  return (
    <header className='sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-sidebar px-4 backdrop-blur-sm'>
      <SidebarTrigger />
      <Separator orientation='vertical' className='mr-2 h-4' />
      <div className='flex-1' />
      <ThemeToggle />
      <AccountMenu />
    </header>
  );
}
