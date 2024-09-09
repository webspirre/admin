import { getCachedTotalDesigns } from "../../../lib/supabase/queries/designs";

export default async function TotalDesigns() {
  const totalDesigns = await getCachedTotalDesigns();

  return (
    <div>
      {totalDesigns !== null ? (
        <p>Total designs: {totalDesigns}</p>
      ) : (
        <p>Could not fetch total designs.</p>
      )}
    </div>
  );
}
