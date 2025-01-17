import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get("menuId");

  try {
    if (idParam) {
      const id = parseInt(idParam, 10);
      const menu = await prisma.menu.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!menu) {
        return NextResponse.json({ error: "Menu not found" }, { status: 404 });
      }

      return NextResponse.json(menu, { status: 200 });
    }

    const menus = await prisma.menu.findMany({
      include: { items: true },
    });
    return NextResponse.json(menus, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to get menu items" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  if (!id) {
    throw new Error("Missing menu ID");
  }
  try {
    await prisma.menu.delete({ where: { id } });
    return NextResponse.json({ status: 204 });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete menu item");
  }
}

export async function POST(request: Request) {
  const { name, icon } = await request.json();

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  try {
    const newMenu = await prisma.menu.create({
      data: { name, icon, items: undefined },
    });
    return NextResponse.json(newMenu, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const { id, name, icon } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "Missing menu ID" }, { status: 400 });
  }

  try {
    const updatedMenu = await prisma.menu.update({
      where: { id },
      data: { name, icon },
    });
    return NextResponse.json(updatedMenu, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update menu item" },
      { status: 500 }
    );
  }
}
