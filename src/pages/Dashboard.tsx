import { 
  Car, 
  Users, 
  ClipboardList, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Package,
  AlertTriangle
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { StockAlerts } from "@/components/dashboard/StockAlerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao seu sistema de gestão da oficina
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="OS em Andamento"
          value={12}
          change="+3 hoje"
          changeType="positive"
          icon={<ClipboardList className="h-6 w-6" />}
          gradient="bg-gradient-primary"
        />
        <StatsCard
          title="Faturamento Mensal"
          value="R$ 45.300"
          change="+12.5% vs mês anterior"
          changeType="positive"
          icon={<DollarSign className="h-6 w-6" />}
          gradient="bg-gradient-orange"
        />
        <StatsCard
          title="Clientes Ativos"
          value={89}
          change="+5 esta semana"
          changeType="positive"
          icon={<Users className="h-6 w-6" />}
          gradient="bg-workshop-success"
        />
        <StatsCard
          title="Agendamentos Hoje"
          value={7}
          change="2 concluídos"
          changeType="neutral"
          icon={<Calendar className="h-6 w-6" />}
          gradient="bg-workshop-steel"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>

        {/* Stock Alerts - Takes 1 column */}
        <div>
          <StockAlerts />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <button className="p-3 border rounded-lg hover:bg-muted/50 transition-colors text-left">
                <ClipboardList className="h-5 w-5 mb-2 text-primary" />
                <p className="text-sm font-medium">Nova OS</p>
              </button>
              <button className="p-3 border rounded-lg hover:bg-muted/50 transition-colors text-left">
                <Users className="h-5 w-5 mb-2 text-primary" />
                <p className="text-sm font-medium">Novo Cliente</p>
              </button>
              <button className="p-3 border rounded-lg hover:bg-muted/50 transition-colors text-left">
                <Car className="h-5 w-5 mb-2 text-primary" />
                <p className="text-sm font-medium">Novo Veículo</p>
              </button>
              <button className="p-3 border rounded-lg hover:bg-muted/50 transition-colors text-left">
                <Package className="h-5 w-5 mb-2 text-primary" />
                <p className="text-sm font-medium">Entrada Estoque</p>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Eficiência da Equipe</span>
                <span className="font-medium">87%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-workshop-success h-2 rounded-full" style={{ width: "87%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Satisfação Cliente</span>
                <span className="font-medium">94%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-workshop-success h-2 rounded-full" style={{ width: "94%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Meta Mensal</span>
                <span className="font-medium">76%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-workshop-orange h-2 rounded-full" style={{ width: "76%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-workshop-warning" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-workshop-warning/10 border border-workshop-warning/20 rounded-lg">
              <p className="text-sm font-medium">Estoque Baixo</p>
              <p className="text-xs text-muted-foreground">4 itens abaixo do mínimo</p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium">OS Atrasadas</p>
              <p className="text-xs text-muted-foreground">2 ordens com prazo vencido</p>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-medium">Pagamentos</p>
              <p className="text-xs text-muted-foreground">R$ 2.300 a receber hoje</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}