"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { MenuItemType } from "@/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Edit, PlusIcon, Trash2 } from "lucide-react";

const MenuPage = () => {
  const searchParams = useSearchParams();
  const menuTitle = searchParams.get("menuTitle");
  const menuIdParam = searchParams.get("menuId");
  const menuId = menuIdParam ? +menuIdParam : null;
  const menuItemsParam = searchParams.get("menuItems");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemType | null>(
    null
  );
  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    description: "",
    price: 0,
    image: null as File | null,
  });

  useEffect(() => {
    if (menuItemsParam) {
      setMenuItems(JSON.parse(decodeURIComponent(menuItemsParam)));
    }
  }, [menuItemsParam]);

  const handleCreateMenuItem = async () => {
    const data = new FormData();
    data.append("name", newMenuItem.name);
    data.append("description", newMenuItem.description);
    data.append("price", newMenuItem.price.toString());
    data.append("menuId", menuId?.toString() || "");
    if (newMenuItem.image) {
      data.append("image", newMenuItem.image);
    }

    const res = await fetch(`/api/menu/item`, {
      method: "POST",
      body: data,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({
        error: "Unexpected error occurred while processing the response.",
      }));
      console.error("Error response:", error);
      return;
    }

    const menuItem = await res.json();
    setMenuItems([...menuItems, menuItem]);
    setIsDialogOpen(false);
    setNewMenuItem({
      name: "",
      description: "",
      price: 0,
      image: null,
    });
  };

  const fetchMenuById = async () => {
    const res = await fetch(`/api/menu?menuId=${menuId}`);
    if (!res.ok) {
      throw new Error("Failed to fetch menu by ID");
    }
    const menu = await res.json();
    setMenuItems(menu.items || []);
  };

  useEffect(() => {
    fetchMenuById();
  }, []);

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/menu/item`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      fetchMenuById();
    }
  };
  const handleEditMenuItem = async () => {
    const data = new FormData();
    data.append("id", selectedMenuItem?.id.toString() || "");
    data.append("name", newMenuItem.name);
    data.append("description", newMenuItem.description);
    data.append("price", newMenuItem.price.toString());
    data.append("menuId", menuId?.toString() || "");
    if (newMenuItem.image) {
      data.append("image", newMenuItem.image);
    }

    const res = await fetch(`/api/menu/item`, {
      method: "PUT",
      body: data,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({
        error: "Unexpected error occurred while processing the response.",
      }));
      console.error("Error response:", error);
      return;
    }

    const updatedMenuItem = await res.json();

    setMenuItems((prevMenuItems) =>
      prevMenuItems.map((item) =>
        item.id === updatedMenuItem.id ? updatedMenuItem : item
      )
    );

    setIsDialogOpen(false);
    setNewMenuItem({
      name: "",
      description: "",
      price: 0,
      image: null,
    });
    setSelectedMenuItem(null); // Clear the selected menu item
  };

  useEffect(() => {
    if (isDialogOpen && selectedMenuItem) {
      setNewMenuItem({
        name: selectedMenuItem.name,
        description: selectedMenuItem.description,
        price: selectedMenuItem.price,
        image: null, // Reset image, as it will be uploaded again
      });
    } else if (!isDialogOpen) {
      setNewMenuItem({
        name: "",
        description: "",
        price: 0,
        image: null,
      });
      setSelectedMenuItem(null); // Clear the selected menu item
    }
  }, [isDialogOpen, selectedMenuItem]);

  return (
    <div className="w-[90%] m-auto">
      <div className="flex justify-between items-center mb-5">
        <h1 className="flex items-center">
          <span className="text-4xl font-bold">Menu</span>
          <span className="mx-2 text-2xl font-extralight text-primary/60">
            |
          </span>
          <span className="text-2xl font-mono text-black/40 ">{menuTitle}</span>
        </h1>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-primary text-white hover:bg-secondary hover:text-violet-300"
        >
          <PlusIcon />
          Create Menu
        </Button>
      </div>

      <Table className="rounded shadow overflow-hidden">
        <TableHeader className="bg-secondary text-white ">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {menuItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                <img
                  src={item.image ? item.image : ""}
                  alt={item.name}
                  width="100"
                  height="100"
                  className="m-auto rounded"
                />
              </TableCell>
              <TableCell className=" max-w-[25vw]">
                {item.description}
              </TableCell>
              <TableCell>{item.price} $</TableCell>
              <TableCell>
                <Button
                  className="text-green-400 hover:bg-green-600 hover:text-white duration-300 mx-2"
                  onClick={() => {
                    setSelectedMenuItem(item);
                    setIsDialogOpen(true);
                  }}
                >
                  <Edit />
                </Button>
                <Button
                  className="text-red-400 hover:bg-red-600 hover:text-white duration-300"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogTitle>
            {selectedMenuItem ? "Edit Menu Item" : "Create Menu Item"}
          </DialogTitle>
          <DialogDescription className="flex flex-col gap-4">
            <Input
              value={newMenuItem.name}
              onChange={(e) =>
                setNewMenuItem({ ...newMenuItem, name: e.target.value })
              }
              placeholder="Menu Item Name"
            />
            <Input
              value={newMenuItem.description}
              onChange={(e) =>
                setNewMenuItem({
                  ...newMenuItem,
                  description: e.target.value,
                })
              }
              placeholder="Menu Item Description"
            />
            <Input
              type="number"
              value={newMenuItem.price}
              onChange={(e) =>
                setNewMenuItem({
                  ...newMenuItem,
                  price: parseFloat(e.target.value),
                })
              }
              placeholder="Menu Item Price"
            />
            <Input
              type="file"
              onChange={(e) =>
                setNewMenuItem({
                  ...newMenuItem,
                  image: e.target.files?.[0] || null,
                })
              }
            />
            <Button
              onClick={
                selectedMenuItem ? handleEditMenuItem : handleCreateMenuItem
              }
            >
              {selectedMenuItem ? "Edit Menu Item" : "Create Menu Item"}
            </Button>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuPage;
