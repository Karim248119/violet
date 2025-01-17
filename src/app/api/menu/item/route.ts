import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();
const uploadDir = path.join(process.cwd(), "public/uploads");

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const { name, description, price, menuId, image } =
      Object.fromEntries(data);
    if (!name || !price || !menuId || !image) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    const imageFile = image as File;
    const imageFilePath = `/uploads/${imageFile.name}`;
    await fs.writeFile(
      path.join(uploadDir, imageFile.name),
      Buffer.from(await imageFile.arrayBuffer())
    );

    const newMenuItem = await prisma.menuItem.create({
      data: {
        name: name.toString(),
        description: description?.toString() || null,
        price: parseFloat(price.toString()),
        image: imageFilePath,
        menuId: parseInt(menuId.toString(), 10),
      },
    });
    9;

    return NextResponse.json(newMenuItem, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.formData();
    const { id, name, description, price, menuId, image } =
      Object.fromEntries(data);

    if (!id) {
      return NextResponse.json(
        { error: "Missing menu item ID" },
        { status: 400 }
      );
    }

    // Find the existing menu item to check if it has an image
    const existingMenuItem = await prisma.menuItem.findUnique({
      where: { id: parseInt(id.toString(), 10) },
    });

    if (!existingMenuItem) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      );
    }

    let imageFilePath = existingMenuItem.image;

    // Handle the new image (if provided)
    if (image) {
      const imageFile = image as File;
      imageFilePath = `/uploads/${imageFile.name}`;

      // Save the new image
      await fs.writeFile(
        path.join(uploadDir, imageFile.name),
        Buffer.from(await imageFile.arrayBuffer())
      );

      // Delete the old image if it exists
      if (existingMenuItem.image && existingMenuItem.image !== imageFilePath) {
        const oldImagePath = path.join(
          process.cwd(),
          "public",
          existingMenuItem.image
        );
        try {
          await fs.unlink(oldImagePath);
        } catch (err) {
          console.warn(`Failed to delete old image: ${oldImagePath}`, err);
        }
      }
    }

    // Update the menu item
    const updatedMenuItem = await prisma.menuItem.update({
      where: { id: parseInt(id.toString(), 10) },
      data: {
        name: name?.toString(),
        description: description?.toString() || null,
        price: parseFloat(price.toString()),
        menuId: parseInt(menuId.toString(), 10),
        image: imageFilePath,
      },
    });

    return NextResponse.json(updatedMenuItem, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  if (!id) {
    return NextResponse.json(
      { error: "Missing menu item ID" },
      { status: 400 }
    );
  }
  try {
    await prisma.menuItem.delete({ where: { id } });
    return NextResponse.json({ status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      include: { menu: false },
    });
    return NextResponse.json(menuItems);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 404 }
    );
  }
}
