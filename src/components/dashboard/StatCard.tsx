import { Card, CardContent } from "@/components/ui/card";

const StatCard = ({ label, value, icon: Icon }: { label: string; value: number; icon: any }) => (
  <Card><CardContent className="p-3 sm:p-4 text-center">
    <Icon className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
    <p className="font-display text-xl sm:text-2xl font-bold text-foreground">{value}</p>
    <p className="font-body text-[10px] sm:text-xs text-muted-foreground">{label}</p>
  </CardContent></Card>
);

export default StatCard;
