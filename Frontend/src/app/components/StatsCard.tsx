import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  iconBgColor?: string;
  iconColor?: string;
  onClick?: () => void;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  iconBgColor = "bg-blue-100",
  iconColor = "text-blue-600",
  onClick,
}: StatsCardProps) {
  return (
    <Card 
      onClick={onClick} 
      className={onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600">{title}</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
            {trend && (
              <p
                className={`mt-2 text-sm ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.isPositive ? "↑" : "↓"} {trend.value}
              </p>
            )}
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconBgColor}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
