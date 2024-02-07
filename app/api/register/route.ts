import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';
import { createUserSchema } from '@/lib/user-schema';
import { ZodError } from 'zod';
import { users } from '@/database/schema';
import { db } from '@/database';

type NewUser = typeof users.$inferInsert;
const insertUser = async (user: NewUser) => {
  const result = await db.insert(users).values(user).returning();
  return result[0];
};

export async function POST(req: Request) {
  try {
    const { name, email, password } = createUserSchema.parse(await req.json());

    const hashed_password = await hash(password, 12);

    const user = await insertUser({
      name,
      email: email.toLowerCase(),
      password: hashed_password,
    });

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.log(error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Validation failed',
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    if (error.code === '23505') {
      return NextResponse.json(
        {
          status: 'fail',
          message: 'user with that email already exists',
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        status: 'error',
        message: error.message || 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
