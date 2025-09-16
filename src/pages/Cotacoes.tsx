import { useState } from "react";
import { Plus, Search, FileText, Clock, CheckCircle, XCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import QuotationForm from "@/components/forms/QuotationForm";

export default function Cotacoes() {
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Exportação iniciada",
      description: "Relatório de cotações será baixado em breve."
    });
    // TODO: Implement actual export functionality
    console.log("Exporting quotations report");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente": return "bg-workshop-warning text-white";
      case "aprovada": return "bg-workshop-success text-white";
      case "rejeitada": return "bg-workshop-danger text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pendente": return <Clock className="h-3 w-3" />;
      case "aprovada": return <CheckCircle className="h-3 w-3" />;
      case "rejeitada": return <XCircle className="h-3 w-3" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cotações</h1>
          <p className="text-muted-foreground">
            Gerencie cotações de serviços e peças
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <QuotationForm />
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cotações..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              Cotações cadastradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-workshop-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-workshop-warning">23</div>
            <p className="text-xs text-muted-foreground">
              Aguardando resposta
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-workshop-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-workshop-success">89</div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 1.248</div>
            <p className="text-xs text-muted-foreground">
              Valor médio por cotação
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quotations List */}
      <Tabs defaultValue="todas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
          <TabsTrigger value="aprovadas">Aprovadas</TabsTrigger>
          <TabsTrigger value="rejeitadas">Rejeitadas</TabsTrigger>
        </TabsList>

        <TabsContent value="todas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cotações Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: "COT-001",
                    client: "João Silva",
                    vehicle: "Honda Civic 2020",
                    service: "Troca de Óleo + Filtros",
                    value: 280.00,
                    date: "09/01/2025",
                    status: "pendente",
                    supplier: "Auto Center ABC"
                  },
                  {
                    id: "COT-002",
                    client: "Maria Santos",
                    vehicle: "Toyota Corolla 2019",
                    service: "Revisão dos 30.000km",
                    value: 850.00,
                    date: "08/01/2025",
                    status: "aprovada",
                    supplier: "Oficina do José"
                  },
                  {
                    id: "COT-003",
                    client: "Pedro Costa",
                    vehicle: "VW Golf 2021",
                    service: "Troca de Pastilhas de Freio",
                    value: 420.00,
                    date: "07/01/2025",
                    status: "rejeitada",
                    supplier: "Freios & Cia"
                  },
                  {
                    id: "COT-004",
                    client: "Ana Paula",
                    vehicle: "Hyundai HB20 2022",
                    service: "Alinhamento e Balanceamento",
                    value: 180.00,
                    date: "06/01/2025",
                    status: "aprovada",
                    supplier: "Pneus Express"
                  }
                ].map((cotacao) => (
                  <div key={cotacao.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{cotacao.id}</h3>
                        <Badge className={getStatusColor(cotacao.status)}>
                          {getStatusIcon(cotacao.status)}
                          <span className="ml-1 capitalize">{cotacao.status}</span>
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">R$ {cotacao.value.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">{cotacao.date}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><span className="font-medium">Cliente:</span> {cotacao.client}</p>
                        <p><span className="font-medium">Veículo:</span> {cotacao.vehicle}</p>
                      </div>
                      <div>
                        <p><span className="font-medium">Serviço:</span> {cotacao.service}</p>
                        <p><span className="font-medium">Fornecedor:</span> {cotacao.supplier}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Button size="sm" variant="outline">
                        Ver Detalhes
                      </Button>
                      {cotacao.status === "pendente" && (
                        <>
                          <Button size="sm" className="bg-workshop-success hover:bg-workshop-success/90">
                            Aprovar
                          </Button>
                          <Button size="sm" variant="destructive">
                            Rejeitar
                          </Button>
                        </>
                      )}
                      {cotacao.status === "aprovada" && (
                        <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                          Gerar OS
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pendentes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cotações Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Filtro aplicado: apenas cotações pendentes serão exibidas
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aprovadas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cotações Aprovadas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Filtro aplicado: apenas cotações aprovadas serão exibidas
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejeitadas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cotações Rejeitadas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Filtro aplicado: apenas cotações rejeitadas serão exibidas
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}