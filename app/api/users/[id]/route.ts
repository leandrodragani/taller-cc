import { db } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const user = db.users.find((u) => u.id === parseInt(id));

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const parsedBody = z
      .object({
        name: z.string().min(1),
        email: z.string().email(),
      })
      .safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const userIndex = db.users.findIndex((u) => u.id === parseInt(params.id));

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = {
      ...db.users[userIndex],
      name: parsedBody.data.name,
      email: parsedBody.data.email,
    };

    db.users[userIndex] = updatedUser;
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const userIndex = db.users.findIndex((u) => u.id === parseInt(id));

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const deletedUser = db.users[userIndex];
    db.users.splice(userIndex, 1);
    return NextResponse.json(deletedUser);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
