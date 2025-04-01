import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Nation from '@/models/Nation';

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Get the request body
    const { address } = await req.json();

    // Validate required fields
    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
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

    // Check if the user has a nation
    if (!user.nationId) {
      return NextResponse.json(
        { error: 'You are not a member of any nation' },
        { status: 400 }
      );
    }

    // Find the user's nation
    const nation = await Nation.findById(user.nationId);
    if (!nation) {
      // If the nation doesn't exist, just remove the nationId from the user
      user.nationId = undefined;
      await user.save();
      
      return NextResponse.json({ 
        success: true, 
        message: 'Successfully left the nation'
      });
    }

    // Check if the user is the founder
    if (nation.founderAddress.toLowerCase() === address.toLowerCase()) {
      return NextResponse.json(
        { error: 'Founders cannot leave their nation. Please delete the nation instead.' },
        { status: 400 }
      );
    }

    // Update the nation's memberCount and members array
    nation.memberCount = Math.max(0, nation.memberCount - 1);
    nation.members = nation.members.filter(
      (memberAddress: string) => memberAddress.toLowerCase() !== address.toLowerCase()
    );
    await nation.save();

    // Remove the nationId from the user
    user.nationId = undefined;
    await user.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully left the nation'
    });
  } catch (error: any) {
    console.error('Error leaving nation:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to leave nation' },
      { status: 500 }
    );
  }
}
