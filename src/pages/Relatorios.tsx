import { BarChart3, FileText, Download, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { exportToExcel, exportToPDF, exportToCSV } from "@/utils/exportUtils";
import { useToast } from "@/hooks/use-toast";
import { useWorkshopSettingsContext } from "@/contexts/WorkshopSettingsContext";
export default function Relatorios() {
  const { toast } = useToast();
  const { settings } = useWorkshopSettingsContext();

  // Data sources used in UI and export
  const revenueByPeriod = [
    { period: "Janeiro 2025", value: 25431, growth: 12 },
    { period: "Dezembro 2024", value: 22687, growth: 8 },
    { period: "Novembro 2024", value: 21012, growth: -2 },
    { period: "Outubro 2024", value: 21450, growth: 15 },
  ];

  const revenueByCategory = [
    { category: "Serviços de Motor", value: 8945, percentage: 35 },
    { category: "Troca de Óleo", value: 6358, percentage: 25 },
    { category: "Freios", value: 5086, percentage: 20 },
    { category: "Suspensão", value: 3175, percentage: 12 },
    { category: "Outros", value: 1867, percentage: 8 },
  ];

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    const exportData = {
      title: 'Receita por Período',
      headers: ['Período', 'Valor', 'Crescimento'],
      data: revenueByPeriod.map(item => [
        item.period,
        `R$ ${item.value.toLocaleString()}`,
        `${item.growth > 0 ? '+' : ''}${item.growth}%`,
      ]),
      filename: `relatorio-financeiro_${new Date().toISOString().slice(0,10)}`,
      logoUrl: settings.logo_url,
      workshopName: settings.workshop_name,
    };

    try {
      if (format === 'pdf') exportToPDF(exportData);
      if (format === 'excel') exportToExcel(exportData);
      if (format === 'csv') exportToCSV(exportData);
      console.info('[Relatorios] Export concluída:', format, exportData.filename);
      toast({
        title: 'Exportação concluída',
        description: `Arquivo ${format.toUpperCase()} gerado com sucesso.`,
      });
    } catch (err) {
      console.error('[Relatorios] Falha na exportação:', err);
      toast({
        title: 'Falha na exportação',
        description: 'Não foi possível gerar o arquivo. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">
            Análises e relatórios do negócio
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="month">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mês</SelectItem>
              <SelectItem value="quarter">Trimestre</SelectItem>
              <SelectItem value="year">Este Ano</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => handleExport('pdf')}>Exportar como PDF</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleExport('excel')}>Exportar como Excel (.xlsx)</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleExport('csv')}>Exportar como CSV</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Quick Reports */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-workshop-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-workshop-success">R$ 25.431</div>
            <p className="text-xs text-muted-foreground">
              +12% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">OS Concluídas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              +8% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              +15% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 286</div>
            <p className="text-xs text-muted-foreground">
              +5% vs mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Tabs defaultValue="financeiro" className="space-y-4">
        <TabsList>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="operacional">Operacional</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="estoque">Estoque</TabsTrigger>
        </TabsList>

        <TabsContent value="financeiro" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Receita por Período
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueByPeriod.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <span className="font-medium">{item.period}</span>
                      <div className="text-right">
                        <p className="font-bold">R$ {item.value.toLocaleString()}</p>
                        <p className={`text-sm ${item.growth > 0 ? 'text-workshop-success' : 'text-workshop-danger'}`}>
                          {item.growth > 0 ? '+' : ''}{item.growth}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Receita por Categoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueByCategory.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.category}</span>
                        <span className="text-sm font-bold">R$ {item.value.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-gradient-primary h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operacional" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance dos Mecânicos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Carlos Silva", os: 28, revenue: 8450, rating: 4.8 },
                    { name: "Roberto Santos", os: 24, revenue: 7200, rating: 4.6 },
                    { name: "Miguel Costa", os: 22, revenue: 6890, rating: 4.7 },
                    { name: "José Oliveira", os: 19, revenue: 5920, rating: 4.5 }
                  ].map((mechanic, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{mechanic.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {mechanic.os} OS • Nota {mechanic.rating}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">R$ {mechanic.revenue.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Receita</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tempo Médio de Serviço</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { service: "Troca de Óleo", time: "45 min", goal: "30 min", status: "above" },
                    { service: "Revisão Completa", time: "2h 30min", goal: "3h", status: "below" },
                    { service: "Freios", time: "1h 45min", goal: "2h", status: "below" },
                    { service: "Suspensão", time: "3h 15min", goal: "3h", status: "above" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{item.service}</p>
                        <p className="text-sm text-muted-foreground">Meta: {item.goal}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${item.status === 'below' ? 'text-workshop-success' : 'text-workshop-warning'}`}>
                          {item.time}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.status === 'below' ? 'Abaixo da meta' : 'Acima da meta'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clientes" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Clientes por Receita</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "João Silva", visits: 8, revenue: 2340, lastVisit: "05/01/2025" },
                    { name: "Maria Santos", visits: 6, revenue: 1890, lastVisit: "08/01/2025" },
                    { name: "Pedro Costa", visits: 5, revenue: 1650, lastVisit: "03/01/2025" },
                    { name: "Ana Paula", visits: 7, revenue: 1520, lastVisit: "07/01/2025" }
                  ].map((client, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {client.visits} visitas • Última: {client.lastVisit}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">R$ {client.revenue.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Total gasto</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Satisfação do Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-workshop-success">4.7</div>
                    <p className="text-sm text-muted-foreground">Nota média geral</p>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { rating: 5, count: 67, percentage: 75 },
                      { rating: 4, count: 18, percentage: 20 },
                      { rating: 3, count: 3, percentage: 3 },
                      { rating: 2, count: 1, percentage: 1 },
                      { rating: 1, count: 1, percentage: 1 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-sm w-6">{item.rating}★</span>
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className="bg-workshop-success h-2 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm w-8">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="estoque" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Itens Mais Utilizados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { item: "Óleo Motor 5W30", usage: 45, stock: 12, category: "Lubrificantes" },
                    { item: "Filtro de Ar", usage: 38, stock: 8, category: "Filtros" },
                    { item: "Pastilha de Freio", usage: 29, stock: 15, category: "Freios" },
                    { item: "Vela de Ignição", usage: 24, stock: 20, category: "Motor" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{item.item}</p>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{item.usage} usados</p>
                        <p className={`text-sm ${item.stock < 10 ? 'text-workshop-danger' : 'text-muted-foreground'}`}>
                          {item.stock} em estoque
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alertas de Estoque</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { item: "Filtro de Combustível", current: 3, min: 10, status: "critical" },
                    { item: "Fluido de Freio", current: 5, min: 8, status: "warning" },
                    { item: "Correia Dentada", current: 7, min: 12, status: "warning" },
                    { item: "Amortecedor Dianteiro", current: 2, min: 5, status: "critical" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{item.item}</p>
                        <p className="text-sm text-muted-foreground">Mínimo: {item.min}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${item.status === 'critical' ? 'text-workshop-danger' : 'text-workshop-warning'}`}>
                          {item.current} restantes
                        </p>
                        <Button size="sm" variant="outline" className="mt-1">
                          Reabastecer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}