import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";

const orders = [
  {
    id: "OS-001",
    client: "Maria Santos",
    vehicle: "Honda Civic 2020",
    service: "Troca de óleo e filtros",
    status: "em_andamento",
    value: 150.00,
    date: "2024-01-09"
  },
  {
    id: "OS-002",
    client: "João Oliveira",
    vehicle: "Toyota Corolla 2019",
    service: "Revisão completa",
    status: "aguardando_pecas",
    value: 450.00,
    date: "2024-01-08"
  },
  {
    id: "OS-003",
    client: "Ana Silva",
    vehicle: "Volkswagen Fox 2018",
    service: "Troca de pastilhas de freio",
    status: "concluida",
    value: 280.00,
    date: "2024-01-07"
  },
  {
    id: "OS-004",
    client: "Carlos Ferreira",
    vehicle: "Ford Ka 2021",
    service: "Alinhamento e balanceamento",
    status: "orcamento",
    value: 120.00,
    date: "2024-01-09"
  }
];

const statusConfig = {
  em_andamento: { label: "Em Andamento", color: "bg-blue-500" },
  aguardando_pecas: { label: "Aguardando Peças", color: "bg-yellow-500" },
  concluida: { label: "Concluída", color: "bg-green-500" },
  orcamento: { label: "Orçamento", color: "bg-gray-500" }
};

export function RecentOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ordens de Serviço Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{order.id}</span>
                  <Badge className={`${statusConfig[order.status as keyof typeof statusConfig].color} text-white`}>
                    {statusConfig[order.status as keyof typeof statusConfig].label}
                  </Badge>
                </div>
                <p className="text-sm font-medium">{order.client}</p>
                <p className="text-xs text-muted-foreground">{order.vehicle}</p>
                <p className="text-sm">{order.service}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="font-semibold text-workshop-orange">
                  R$ {order.value.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">{order.date}</p>
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
      </CardContent>
    </Card>
  );
}