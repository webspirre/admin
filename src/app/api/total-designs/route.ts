import { getCachedTotalDesigns } from "../../../../lib/supabase/queries/designs";
import { unstable_noStore } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  unstable_noStore();
  try {
    const totalDesigns = await getCachedTotalDesigns();

    if (totalDesigns !== null) {
      return NextResponse.json({ totalDesigns });
    } else {
      return NextResponse.json(
        { message: "Could not fetch total designs" },
        { status: 500 }
      );
    }
  } catch (error) {
    let errorMessage = "Unknown error occurred";

    if (error instanceof Error) {
      // Now it's safe to access error.message
      errorMessage = error.message;
    }

    return NextResponse.json(
      { message: "Error fetching total designs", error: errorMessage },
      { status: 500 }
    );
  }
}
