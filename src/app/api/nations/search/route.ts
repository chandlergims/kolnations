import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Nation from '@/models/Nation';

export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Get search query from URL
    const searchQuery = req.nextUrl.searchParams.get('q');
    
    // Build query object
    let query = {};
    if (searchQuery && searchQuery.trim() !== '') {
      // Search in both name and founderAddress fields
      query = {
        $or: [
          { name: { $regex: searchQuery, $options: 'i' } },
          { founderAddress: { $regex: searchQuery, $options: 'i' } }
        ]
      };
    }

    // Get nations with search filter if provided
    const nations = await Nation.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ 
      success: true, 
      count: nations.length,
      nations 
    });
  } catch (error: any) {
    console.error('Error searching nations:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to search nations' },
      { status: 500 }
    );
  }
}
