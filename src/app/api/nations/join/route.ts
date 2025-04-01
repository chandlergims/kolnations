import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Nation from '@/models/Nation';

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Get the request body
    const { nationId, address } = await req.json();

    // Validate required fields
    if (!nationId || !address) {
      return NextResponse.json(
        { error: 'Nation ID and address are required' },
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
          error: 'You already belong to a nation',
          nation: existingNation 
        },
        { status: 400 }
      );
    }

    // Find the nation to join
    const nation = await Nation.findById(nationId);
    if (!nation) {
      return NextResponse.json(
        { error: 'Nation not found' },
        { status: 404 }
      );
    }

    // Update the user's nationId
    user.nationId = nation._id;
    await user.save();

    // Update the nation's memberCount and members array
    nation.memberCount += 1;
    nation.members.push(address);
    await nation.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully joined the nation',
      nation 
    });
  } catch (error: any) {
    console.error('Error joining nation:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to join nation' },
      { status: 500 }
    );
  }
}
