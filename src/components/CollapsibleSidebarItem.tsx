"use client";
import { Collapsible, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import React, { useEffect, useState } from "react";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "./ui/sidebar";
import { ChevronDown, MenuSquare, PlusCircle } from "lucide-react";
import { CollapsibleContent } from "./ui/collapsible";
import { Button } from "./ui/button";
import { MenuType } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import * as LucideIcons from "lucide-react";
import DynamicIcon from "./DynamicIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DropdownSidebarItem = ({
  menu,
  handleDeleteMenu,
  openDialog,
}: {
  menu: MenuType;
  handleDeleteMenu: () => void;
  openDialog: () => void;
}) => {
  const path = decodeURIComponent(usePathname());
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className={path.includes(menu.name) ? "bg-white/10" : ""}
      >
        <Link
          href={{
            pathname: `/admin/menus/${menu.name}`,
            query: {
              menuId: menu.id,
              menuTitle: menu.name,
              menuItems: JSON.stringify(menu.items),
            },
          }}
        >
          {menu.icon && <DynamicIcon name={menu?.icon} />}
          <span>{menu.name}</span>
        </Link>
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction>
            <LucideIcons.MoreHorizontal />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuItem onClick={openDialog}>
            <LucideIcons.Edit />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDeleteMenu}>
            <LucideIcons.Trash2 />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

const CollapsibleSidebarItem = ({ className }: { className?: string }) => {
  const [menus, setMenus] = useState<MenuType[]>([]);
  const [newMenu, setNewMenu] = useState({ name: "", icon: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMenuId, setEditingMenuId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredIcons, setFilteredIcons] = useState<string[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const fetchMenus = async () => {
    const res = await fetch("/api/menu");
    const data = await res.json();
    setMenus(data);
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleDeleteMenu = async (id: number) => {
    const res = await fetch(`/api/menu/`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      fetchMenus();
    }
  };

  useEffect(() => {
    const icons = Object.keys(LucideIcons).filter((icon) =>
      icon.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredIcons(icons);
  }, [searchTerm]);

  const handleCreateMenu = async () => {
    const res = await fetch("/api/menu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMenu),
    });
    if (res.ok) {
      fetchMenus();
      setIsDialogOpen(false);
    }
  };

  const handleEditMenu = async () => {
    if (editingMenuId === null) return;
    const res = await fetch("/api/menu", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: editingMenuId,
        ...newMenu,
      }),
    });
    if (res.ok) {
      fetchMenus();
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton asChild className={className}>
              <div>
                <MenuSquare />
                <span>Menu</span>
                <ChevronDown className="ml-[140px] transition-transform group-data-[state=open]/collapsible:rotate-180  " />
              </div>
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              <Button
                className="flex justify-start px-2 z-20 "
                onClick={() => {
                  setIsDialogOpen(true);
                  setIsEdit(false);
                  setNewMenu({ name: "", icon: "" }); // Reset form
                }}
              >
                <PlusCircle />
                <span>Add Category</span>
              </Button>

              {menus.map((item) => (
                <DropdownSidebarItem
                  key={item.name}
                  menu={item}
                  handleDeleteMenu={() => handleDeleteMenu(item.id)}
                  openDialog={() => {
                    setIsDialogOpen(true);
                    setIsEdit(true);
                    setEditingMenuId(item.id);
                    setNewMenu({ name: item.name, icon: item.icon });
                  }}
                />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogTitle>{isEdit ? "Edit Menu" : "Create Menu"}</DialogTitle>
          <DialogDescription>
            <Input
              value={newMenu.name}
              onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
              placeholder="Menu Name"
            />
            <div className="my-3">
              <Input
                className="mb-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Icon"
              />
              <select
                className="border rounded-md p-2 w-full"
                value={newMenu.icon}
                onChange={(e) =>
                  setNewMenu({ ...newMenu, icon: e.target.value })
                }
              >
                <option value="" disabled>
                  Select Icon
                </option>
                {filteredIcons.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>
            <Button
              className="w-full"
              onClick={() => (isEdit ? handleEditMenu() : handleCreateMenu())}
              disabled={!newMenu.name || !newMenu.icon}
            >
              {isEdit ? "Edit Menu" : "Create Menu"}
            </Button>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default CollapsibleSidebarItem;
