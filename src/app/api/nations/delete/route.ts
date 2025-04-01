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

    // Find the nation
    const nation = await Nation.findById(nationId);
    if (!nation) {
      return NextResponse.json(
        { error: 'Nation not found' },
        { status: 404 }
      );
    }

    // Check if the user is the founder
    if (nation.founderAddress.toLowerCase() !== address.toLowerCase()) {
      return NextResponse.json(
        { error: 'Only the founder can delete the nation' },
        { status: 403 }
      );
    }

    // Get all users who are members of this nation
    const usersToUpdate = await User.find({ nationId: nation._id });

    // Remove the nationId from all users
    for (const userToUpdate of usersToUpdate) {
      userToUpdate.nationId = undefined;
      await userToUpdate.save();
    }

    // Delete the nation
    await Nation.findByIdAndDelete(nationId);

    return NextResponse.json({ 
      success: true, 
      message: 'Nation deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting nation:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to delete nation' },
      { status: 500 }
    );
  }
}
