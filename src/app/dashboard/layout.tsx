"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ZenBizLogo } from "@/components/icons";
import {
  LayoutDashboard,
  Wallet,
  BarChart3,
  Sparkles,
  Settings,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/expenses", icon: Wallet, label: "Expenses" },
  { href: "/dashboard/reports", icon: BarChart3, label: "Reports" },
  { href: "/dashboard/ai-insights", icon: Sparkles, label: "AI Insights" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentPage = navItems.find((item) => item.href === pathname);

  return (
    <div className="min-h-screen w-full">
      <div className="flex min-h-screen w-full">
        <SidebarProvider>
          <Sidebar collapsible="icon">
            <SidebarHeader>
              <div className="flex items-center gap-2">
                <ZenBizLogo className="size-7 text-primary" />
                <h1 className="text-xl font-semibold font-headline">ZenBiz</h1>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <Link href={item.href}>
                      <SidebarMenuButton
                        isActive={pathname.startsWith(item.href)}
                        tooltip={item.label}
                      >
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="justify-start gap-3 w-full px-2">
                     <Avatar className="h-8 w-8">
                        <AvatarImage src="https://picsum.photos/40/40" data-ai-hint="person avatar" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start">
                        <span className="font-semibold text-sm">John Doe</span>
                      </div>
                  </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">John Doe</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          john.doe@email.com
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <Link href="/login">
                      <DropdownMenuItem>Log out</DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>
          </Sidebar>
          <div className="flex flex-col flex-1">
            <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
              <SidebarTrigger className="md:hidden" />
              <div className="flex-1">
                <h1 className="font-semibold text-lg">{currentPage?.label}</h1>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://picsum.photos/40/40" data-ai-hint="person avatar" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                   <Link href="/login">
                      <DropdownMenuItem>Logout</DropdownMenuItem>
                    </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}
