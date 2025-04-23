import { db } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  try {
    return NextResponse.json(db.users);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const user = {
      id: db.users.length + 1,
      name: parsedBody.data.name,
      email: parsedBody.data.email,
    };

    db.users.push(user);
    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
