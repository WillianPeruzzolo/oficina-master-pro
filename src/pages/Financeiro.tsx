import { DollarSign, TrendingUp, TrendingDown, CreditCard, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import TransactionForm from "@/components/forms/TransactionForm";

export default function Financeiro() {
  const { toast } = useToast();

  const handleExport = (type: string) => {
    toast({
      title: "Exportação iniciada",
      description: `Relatório de ${type} será baixado em breve.`
    });
    // TODO: Implement actual export functionality
    console.log(`Exporting ${type} report`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financeiro</h1>
          <p className="text-muted-foreground">
            Controle financeiro e fluxo de caixa
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleExport("financeiro")}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <TransactionForm />
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <TrendingUp className="h-4 w-4 text-workshop-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-workshop-success">R$ 25.431</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-workshop-danger" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-workshop-danger">R$ 8.247</div>
            <p className="text-xs text-muted-foreground">
              -5% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 17.184</div>
            <p className="text-xs text-muted-foreground">
              +8% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contas a Receber</CardTitle>
            <CreditCard className="h-4 w-4 text-workshop-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-workshop-warning">R$ 5.320</div>
            <p className="text-xs text-muted-foreground">
              12 faturas pendentes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed View */}
      <Tabs defaultValue="receitas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="receitas">Receitas</TabsTrigger>
          <TabsTrigger value="despesas">Despesas</TabsTrigger>
          <TabsTrigger value="receber">Contas a Receber</TabsTrigger>
          <TabsTrigger value="pagar">Contas a Pagar</TabsTrigger>
        </TabsList>

        <TabsContent value="receitas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Receitas Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Sample revenue data */}
                {[
                  { id: 1, description: "OS-001 - João Silva", amount: 450.00, date: "09/01/2025", status: "Pago" },
                  { id: 2, description: "OS-002 - Maria Santos", amount: 1200.00, date: "08/01/2025", status: "Pago" },
                  { id: 3, description: "OS-003 - Pedro Costa", amount: 680.00, date: "07/01/2025", status: "Pago" }
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{item.description}</p>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-workshop-success">R$ {item.amount.toFixed(2)}</p>
                      <p className="text-sm text-workshop-success">{item.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="despesas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Despesas Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Sample expense data */}
                {[
                  { id: 1, description: "Aluguel da Oficina", amount: 2500.00, date: "01/01/2025", category: "Fixo" },
                  { id: 2, description: "Compra de Peças", amount: 850.00, date: "05/01/2025", category: "Material" },
                  { id: 3, description: "Energia Elétrica", amount: 380.00, date: "03/01/2025", category: "Utilidades" }
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{item.description}</p>
                      <p className="text-sm text-muted-foreground">{item.date} - {item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-workshop-danger">R$ {item.amount.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receber" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contas a Receber</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Sample receivables data */}
                {[
                  { id: 1, client: "Ana Paula", amount: 890.00, dueDate: "15/01/2025", overdue: false },
                  { id: 2, client: "Carlos Mendes", amount: 1250.00, dueDate: "10/01/2025", overdue: true },
                  { id: 3, client: "Lucia Ferreira", amount: 620.00, dueDate: "20/01/2025", overdue: false }
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{item.client}</p>
                      <p className="text-sm text-muted-foreground">
                        Vencimento: {item.dueDate}
                        {item.overdue && <span className="text-workshop-danger ml-2">(Vencido)</span>}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${item.overdue ? 'text-workshop-danger' : 'text-workshop-warning'}`}>
                        R$ {item.amount.toFixed(2)}
                      </p>
                      <Button size="sm" variant="outline">
                        Receber
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pagar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contas a Pagar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Sample payables data */}
                {[
                  { id: 1, supplier: "Fornecedor ABC", amount: 1200.00, dueDate: "12/01/2025", overdue: false },
                  { id: 2, supplier: "Auto Peças Ltda", amount: 780.00, dueDate: "08/01/2025", overdue: true },
                  { id: 3, supplier: "Serviços Gerais", amount: 450.00, dueDate: "18/01/2025", overdue: false }
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{item.supplier}</p>
                      <p className="text-sm text-muted-foreground">
                        Vencimento: {item.dueDate}
                        {item.overdue && <span className="text-workshop-danger ml-2">(Vencido)</span>}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${item.overdue ? 'text-workshop-danger' : 'text-workshop-warning'}`}>
                        R$ {item.amount.toFixed(2)}
                      </p>
                      <Button size="sm" variant="outline">
                        Pagar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}