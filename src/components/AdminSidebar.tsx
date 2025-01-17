"use client";
import { Home, Settings, User, Package2, icons } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";

import CollapsibleSidebarItem from "./CollapsibleSidebarItem";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "./Logo";

const RegularSidebarItem = ({
  title,
  href,
  Icon,
}: {
  title: string;
  href?: string;
  Icon: React.FC<any>;
}) => {
  const path = usePathname();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className={
          path.toLocaleLowerCase().includes(title.toLocaleLowerCase())
            ? "bg-primary"
            : ""
        }
      >
        <Link href={href || ""}>
          <Icon />
          <span>{title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export function AdminSidebar() {
  const path = usePathname();
  return (
    <Sidebar>
      <SidebarContent className="bg-secondary text-white">
        <SidebarGroup>
          <Logo />
          <SidebarGroupContent>
            <SidebarMenu>
              <RegularSidebarItem title="Home" href="/" Icon={Home} />
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#">
                    <Package2 />
                    <span>Orders</span>
                  </a>
                </SidebarMenuButton>
                <SidebarMenuBadge className="ml-36 text-violet-400 bg-white/10 p-2">
                  24
                </SidebarMenuBadge>
              </SidebarMenuItem>
              <CollapsibleSidebarItem
                className={path.includes("menu") ? "bg-primary" : ""}
              />
              <RegularSidebarItem
                title="Users"
                href="/admin/users"
                Icon={User}
              />
              <RegularSidebarItem title="Settings" href="#" Icon={Settings} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
