import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";
import { useRecentOrders } from "@/hooks/useRecentOrders";
import { Skeleton } from "@/components/ui/skeleton";

const statusConfig: Record<string, { label: string; color: string }> = {
  em_andamento: { label: "Em Andamento", color: "bg-blue-500" },
  aguardando_pecas: { label: "Aguardando Peças", color: "bg-yellow-500" },
  concluida: { label: "Concluída", color: "bg-green-500" },
  orcamento: { label: "Orçamento", color: "bg-gray-500" }
};

export function RecentOrders() {
  const { data: orders, isLoading } = useRecentOrders(5);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ordens de Serviço Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{order.order_number}</span>
                    <Badge className={`${statusConfig[order.status]?.color || 'bg-gray-500'} text-white`}>
                      {statusConfig[order.status]?.label || order.status}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{order.client_name}</p>
                  <p className="text-xs text-muted-foreground">{order.vehicle}</p>
                  <p className="text-sm">{order.service}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-semibold text-workshop-orange">
                    {formatCurrency(order.value)}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDate(order.date)}</p>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            Nenhuma ordem de serviço encontrada
          </p>
        )}
      </CardContent>
    </Card>
  );
}
