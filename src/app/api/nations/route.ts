import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Nation from '@/models/Nation';

export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Get all nations
    const nations = await Nation.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ 
      success: true, 
      count: nations.length,
      nations 
    });
  } catch (error: any) {
    console.error('Error fetching nations:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch nations' },
      { status: 500 }
    );
  }
}
