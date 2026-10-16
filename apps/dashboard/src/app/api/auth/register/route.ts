import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // TODO: Check if user already exists in database
    // const existingUser = await db.user.findUnique({ where: { email } })
    // if (existingUser) {
    //   return NextResponse.json(
    //     { message: 'User already exists' },
    //     { status: 400 }
    //   )
    // }

    const hashedPassword = await hash(password, 12)

    // TODO: Create user in database
    // const user = await db.user.create({
    //   data: {
    //     name,
    //     email,
    //     hashedPassword,
    //   },
    // })

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
