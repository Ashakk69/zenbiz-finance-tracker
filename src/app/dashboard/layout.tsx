
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth, AuthProvider } from "@/lib/auth";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ZenBizLogo } from "@/components/icons";
import {
  LayoutDashboard,
  Wallet,
  BarChart3,
  Sparkles,
  Settings,
  Loader2,
  LogOut,
  Home,
  MessageSquare,
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
import { CurrencyProvider } from "@/context/currency-context";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { FeedbackDialog } from "@/components/dashboard/feedback-dialog";
import { useState } from "react";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { UserDataProvider } from "@/context/user-data-context";


const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/expenses", icon: Wallet, label: "Expenses" },
  { href: "/dashboard/reports", icon: BarChart3, label: "Reports" },
  { href: "/dashboard/ai-insights", icon: Sparkles, label: "AI Insights" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

function ProtectedDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const currentPage = navItems.find((item) => item.href === pathname);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  
  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }
  
  const getInitials = (email: string | null | undefined) => {
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  };


  return (
    <div className="min-h-screen w-full">
      <div className="flex min-h-screen w-full">
        <SidebarProvider>
          <Sidebar collapsible="icon" className="hidden md:block">
            <SidebarHeader>
              <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
                <ZenBizLogo className="size-7 text-primary" />
                <h1 className="text-xl font-semibold font-headline group-data-[collapsible=icon]:hidden">ZenBiz</h1>
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
                  <Button variant="ghost" className="justify-start gap-3 w-full px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
                     <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL ?? "https://picsum.photos/40/40"} data-ai-hint="person avatar" />
                        <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden">
                        <span className="font-semibold text-sm truncate max-w-[120px]">{user.displayName || user.email}</span>
                      </div>
                  </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName || "User"}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>
          </Sidebar>
          <div className="flex flex-col flex-1">
            <header className="flex h-14 items-center gap-4 border-b bg-card/60 px-4 lg:h-[60px] lg:px-6 backdrop-blur-xl">
              <SidebarTrigger className="md:hidden" />
              <div className="flex-1">
                <h1 className="font-semibold text-lg">{currentPage?.label}</h1>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsFeedbackDialogOpen(true)}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Feedback
              </Button>
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                       <AvatarImage src={user.photoURL ?? "https://picsum.photos/40/40"} data-ai-hint="person avatar" />
                       <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background/90 pb-6">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </div>
      <FeedbackDialog
        open={isFeedbackDialogOpen}
        onOpenChange={setIsFeedbackDialogOpen}
      />
    </div>
  );
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <UserDataProvider>
          <ProtectedDashboardLayout>{children}</ProtectedDashboardLayout>
        </UserDataProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}
