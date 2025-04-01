import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Nation from '@/models/Nation';

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Get the request body
    const { name, address } = await req.json();

    // Validate required fields
    if (!name || !address) {
      return NextResponse.json(
        { error: 'Name and address are required' },
        { status: 400 }
      );
    }

    // Check if the user exists
    const user = await User.findOne({ address });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Please connect your wallet first.' },
        { status: 404 }
      );
    }

    // Check if the user already has a nation
    if (user.nationId) {
      // Find the user's nation
      const existingNation = await Nation.findById(user.nationId);
      
      return NextResponse.json(
        { 
          error: 'You already have a nation',
          nation: existingNation 
        },
        { status: 400 }
      );
    }

    // Create a new nation
    const nation = await Nation.create({
      name,
      founderAddress: address,
      memberCount: 1,
      members: [address],
    });

    // Update the user's nationId
    user.nationId = nation._id;
    await user.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Nation created successfully',
      nation 
    });
  } catch (error: any) {
    console.error('Error creating nation:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      // Check which field caused the duplicate key error
      const keyPattern = error.keyPattern;
      if (keyPattern && keyPattern.name) {
        return NextResponse.json(
          { error: 'A nation with this name already exists' },
          { status: 400 }
        );
      } else if (keyPattern && keyPattern.territory) {
        return NextResponse.json(
          { error: 'This territory is already claimed by another nation' },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { error: 'Duplicate key error' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to create nation' },
      { status: 500 }
    );
  }
}
