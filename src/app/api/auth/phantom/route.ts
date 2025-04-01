import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import User from '../../../../models/User';

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Get the address from the request body
    const { address } = await req.json();

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Check if the user already exists
    let user = await User.findOne({ address: address.toLowerCase() });

    // If the user doesn't exist, create a new one
    if (!user) {
      user = await User.create({
        address: address.toLowerCase(),
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        address: user.address,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Error in Phantom authentication:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
