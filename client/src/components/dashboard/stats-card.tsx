import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: "blue" | "emerald" | "violet" | "amber" | "rose";
  href?: string;
  linkText?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  color,
  href,
  linkText = "View all",
}: StatsCardProps) {
  const colorClasses = {
    blue: "bg-blue-500",
    emerald: "bg-emerald-500",
    violet: "bg-violet-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex items-center">
            <div className={cn("flex-shrink-0 rounded-md p-3", colorClasses[color])}>
              {icon}
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">{value}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        {href && (
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href={href} className="font-medium text-primary hover:text-blue-700">
                {linkText}
              </a>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
