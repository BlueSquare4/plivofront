import { Card, CardContent } from "@/components/ui/card";

export default function ServiceCard({ name, status }: { name: string; status: string }) {
  const colorMap: Record<string, string> = {
    OPERATIONAL: "text-green-600",
    DEGRADED: "text-yellow-600",
    PARTIAL_OUTAGE: "text-orange-600",
    MAJOR_OUTAGE: "text-red-600",
  };

  return (
    <Card className="w-full shadow-md">
      <CardContent className="p-4 flex justify-between items-center">
        <p className="text-lg font-medium">{name}</p>
        <span className={`font-semibold ${colorMap[status]}`}>{status.replace("_", " ")}</span>
      </CardContent>
    </Card>
  );
}
