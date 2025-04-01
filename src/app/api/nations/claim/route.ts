import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Nation from "@/models/Nation";

export async function POST(req: NextRequest) {
  try {
    const { nationId, address, territory } = await req.json();

    if (!nationId || !address || !territory) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find the nation
    const nation = await Nation.findById(nationId);
    if (!nation) {
      return NextResponse.json(
        { success: false, error: "Nation not found" },
        { status: 404 }
      );
    }

    // Verify that the requester is the founder
    if (nation.founderAddress.toLowerCase() !== address.toLowerCase()) {
      return NextResponse.json(
        { success: false, error: "Only the founder can claim territory" },
        { status: 403 }
      );
    }

    // Check if the nation already has a territory
    if (nation.territory) {
      return NextResponse.json(
        { success: false, error: "Nation already has a territory" },
        { status: 400 }
      );
    }

    // Check if the territory is already claimed by another nation
    const existingClaim = await Nation.findOne({ territory });
    if (existingClaim) {
      return NextResponse.json(
        { success: false, error: "Territory already claimed by another nation" },
        { status: 400 }
      );
    }

    // Update the nation with the claimed territory
    nation.territory = territory;
    await nation.save();

    return NextResponse.json({
      success: true,
      message: `Successfully claimed ${territory}`,
      nation,
    });
  } catch (error: any) {
    console.error("Error claiming territory:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to claim territory" },
      { status: 500 }
    );
  }
}
