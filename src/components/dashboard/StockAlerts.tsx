import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useStockAlerts } from "@/hooks/useStockAlerts";
import { Skeleton } from "@/components/ui/skeleton";

const priorityConfig: Record<string, { label: string; className: string }> = {
  high: { label: "Alta", className: "bg-red-500 text-white" },
  medium: { label: "Média", className: "bg-yellow-500 text-white" },
  low: { label: "Baixa", className: "bg-blue-500 text-white" }
};

export function StockAlerts() {
  const { data: stockAlerts, isLoading } = useStockAlerts();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Alertas de Estoque</CardTitle>
        <Button size="sm" variant="outline">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Comprar
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        ) : stockAlerts && stockAlerts.length > 0 ? (
          <div className="space-y-3">
            {stockAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm">{alert.partName}</p>
                    <Badge className={priorityConfig[alert.priority].className}>
                      {priorityConfig[alert.priority].label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{alert.supplier}</p>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-muted-foreground">Estoque:</span>
                    <span className="font-semibold text-red-600">{alert.currentStock}</span>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-muted-foreground">Mín: {alert.minStock}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            Nenhum alerta de estoque no momento
          </p>
        )}
      </CardContent>
    </Card>
  );
}
