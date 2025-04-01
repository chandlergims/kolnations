import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Nation from '@/models/Nation';

export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Get the address from the query parameters
    const address = req.nextUrl.searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      );
    }

    // Find the user
    const user = await User.findOne({ address });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if the user has a nation
    if (!user.nationId) {
      return NextResponse.json({ 
        success: true, 
        hasNation: false,
        message: 'User does not belong to any nation'
      });
    }

    // Find the user's nation
    const nation = await Nation.findById(user.nationId);
    if (!nation) {
      return NextResponse.json(
        { error: 'Nation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      hasNation: true,
      nation 
    });
  } catch (error: any) {
    console.error('Error fetching user nation:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user nation' },
      { status: 500 }
    );
  }
}
