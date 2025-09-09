import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Package, Plus } from "lucide-react";

const stockAlerts = [
  {
    id: 1,
    item: "Óleo Motor 5W30",
    currentStock: 2,
    minStock: 10,
    supplier: "Petrobrás",
    priority: "high"
  },
  {
    id: 2,
    item: "Filtro de Ar Civic",
    currentStock: 1,
    minStock: 5,
    supplier: "Mann Filter",
    priority: "high"
  },
  {
    id: 3,
    item: "Pastilhas Freio Dianteira",
    currentStock: 4,
    minStock: 8,
    supplier: "Bosch",
    priority: "medium"
  },
  {
    id: 4,
    item: "Velas de Ignição",
    currentStock: 6,
    minStock: 12,
    supplier: "NGK",
    priority: "medium"
  }
];

const priorityConfig = {
  high: { label: "Urgente", color: "bg-red-500" },
  medium: { label: "Médio", color: "bg-yellow-500" },
  low: { label: "Baixo", color: "bg-green-500" }
};

export function StockAlerts() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-workshop-warning" />
          Alertas de Estoque
        </CardTitle>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Comprar
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {stockAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-workshop-warning/10 rounded-lg">
                  <Package className="h-4 w-4 text-workshop-warning" />
                </div>
                <div>
                  <p className="font-medium text-sm">{alert.item}</p>
                  <p className="text-xs text-muted-foreground">{alert.supplier}</p>
                </div>
              </div>
              <div className="text-right space-y-1">
                <Badge className={`${priorityConfig[alert.priority as keyof typeof priorityConfig].color} text-white text-xs`}>
                  {priorityConfig[alert.priority as keyof typeof priorityConfig].label}
                </Badge>
                <div className="text-xs">
                  <span className="text-workshop-danger font-medium">{alert.currentStock}</span>
                  <span className="text-muted-foreground"> / {alert.minStock}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}