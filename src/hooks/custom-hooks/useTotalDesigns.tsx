import { useQuery } from "react-query";

export function useTotalDesigns() {
  return useQuery("totalDesigns", async () => {
    const response = await fetch("/api/total-designs");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error fetching total designs");
    }

    return data.totalDesigns;
  });
}
