
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from 'next/dynamic';
import {
  ChevronDown,
  LayoutGrid,
  LogOut,
  Server,
  Users,
  Menu,
  FolderKanban,
  Globe,
  Briefcase,
  Rocket,
  ListTodo,
  Settings,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { signOut } from "firebase/auth";
import { doc } from "firebase/firestore";

const SettingsForm = dynamic(() => import('./components/settings-form').then(mod => mod.SettingsForm), { ssr: false });


const navItems = [
  { href: "/dashboard", icon: LayoutGrid, label: "Dashboard" },
  { href: "/dashboard/clients", icon: Users, label: "Clients" },
  { 
    label: "Projects", 
    icon: FolderKanban,
    subItems: [
      { href: "/dashboard/upcoming-projects", icon: ListTodo, label: "Upcoming" },
      { href: "/dashboard/ongoing-projects", icon: Rocket, label: "Ongoing" },
    ]
  },
  { href: "/dashboard/servers", icon: Server, label: "Servers" },
  { href: "/dashboard/domains", icon: Globe, label: "Domains" },
  { href: "/dashboard/teams", icon: Briefcase, label: "Team" },
];

const NavItem = ({ item }: { item: any }) => {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  
  const hasSubItems = item.subItems && item.subItems.length > 0;
  
  const isParentOfActive = hasSubItems && isClient && item.subItems.some((sub: any) => pathname.startsWith(sub.href));
  const isActive = (!hasSubItems && item.href && isClient && pathname === item.href) || isParentOfActive;

  if (hasSubItems) {
    return (
      <Collapsible defaultOpen={isParentOfActive}>
        <CollapsibleTrigger asChild>
           <Button variant={isParentOfActive ? 'secondary' : 'ghost'} className="w-full justify-between pr-4 group">
            <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold">{item.label}</span>
            </div>
            <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-8 py-1 space-y-1">
          {item.subItems.map((subItem:any) => {
            const isSubItemActive = isClient && pathname === subItem.href;

            return (
              <Link key={subItem.href} href={subItem.href} passHref>
                <Button
                  variant={isSubItemActive ? 'secondary' : 'ghost'}
                  size="sm"
                  className="w-full justify-start gap-3"
                >
                   <subItem.icon className="h-4 w-4 text-muted-foreground" />
                  {subItem.label}
                </Button>
              </Link>
            )
          })}
        </CollapsibleContent>
      </Collapsible>
    )
  }
  
  if (!item.href) {
     return (
       <Button 
        variant='ghost'
        className="w-full justify-start gap-3"
      >
        <item.icon className="h-5 w-5 text-muted-foreground" />
        <span className="font-semibold">{item.label}</span>
      </Button>
    )
  }

  return (
    <Link href={item.href} passHref>
      <Button 
        variant={isActive ? 'secondary' : 'ghost'} 
        className="w-full justify-start gap-3"
      >
        <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
        <span className="font-semibold">{item.label}</span>
      </Button>
    </Link>
  );
};


const SidebarContent = () => (
    <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-[73px] items-center border-b px-6">
        <Link href="/" className="flex h-full w-full items-center justify-center">
            <Image src="/images/logo.png" alt="ForgeLabs" width={200} height={200} className="h-full w-auto object-contain" />
        </Link>
        </div>
        <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-4 text-sm font-medium space-y-1">
            {navItems.map((item) => <NavItem key={item.label} item={item} />)}
        </nav>
        </div>
    </div>
);


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSettingsOpen, setSettingsOpen] = React.useState(false);
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<{firstName: string, lastName: string, email: string}>(userDocRef);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push("/login");
    }
  };

  const userName = userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : user?.displayName || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <Image src="/images/icon.png" alt="Loading" width={48} height={48} className="animate-spin" />
        </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-card lg:block">
        <SidebarContent />
      </div>
      <div className="flex flex-col">
        <header className="flex h-[73px] items-center gap-4 border-b bg-card px-6 justify-between">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
                <SheetHeader>
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                </SheetHeader>
                <SidebarContent />
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-4 ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 relative h-10 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{userInitial}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-medium capitalize">{userName}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setSettingsOpen(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 bg-muted/40">
          {children}
        </main>
      </div>
      {isSettingsOpen && (
        <Dialog open={isSettingsOpen} onOpenChange={setSettingsOpen}>
            <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Account Settings</DialogTitle>
                <DialogDescription>
                Manage your account details and password.
                </DialogDescription>
            </DialogHeader>
            <SettingsForm
                userData={{name: userName, email: user.email || ''}}
                setSheetOpen={setSettingsOpen}
            />
            </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
