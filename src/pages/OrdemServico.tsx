import { useState } from "react";
import { Plus, Search, Filter, Eye, Edit, FileText, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ServiceOrderForm from "@/components/forms/ServiceOrderForm";

const ordensServico = [
  {
    id: "OS-001",
    cliente: "Maria Santos",
    veiculo: "Honda Civic 2020",
    placa: "ABC-1234",
    servicos: ["Troca de óleo", "Filtro de ar", "Revisão geral"],
    mecanico: "José Silva",
    dataEntrada: "2024-01-09",
    dataPrevista: "2024-01-10",
    status: "em_andamento",
    prioridade: "media",
    valor: 150.00,
    observacoes: "Cliente aguardando ligação para confirmação de serviços adicionais"
  },
  {
    id: "OS-002",
    cliente: "João Oliveira",
    veiculo: "Toyota Corolla 2019",
    placa: "DEF-5678",
    servicos: ["Revisão completa", "Troca de pastilhas", "Alinhamento"],
    mecanico: "Pedro Santos",
    dataEntrada: "2024-01-08",
    dataPrevista: "2024-01-11",
    status: "aguardando_pecas",
    prioridade: "alta",
    valor: 450.00,
    observacoes: "Aguardando chegada das pastilhas de freio originais"
  },
  {
    id: "OS-003",
    cliente: "Ana Silva",
    veiculo: "Volkswagen Fox 2018",
    placa: "GHI-9012",
    servicos: ["Troca de pastilhas de freio"],
    mecanico: "José Silva",
    dataEntrada: "2024-01-07",
    dataPrevista: "2024-01-07",
    status: "concluida",
    prioridade: "baixa",
    valor: 280.00,
    observacoes: "Serviço concluído conforme solicitado"
  },
  {
    id: "OS-004",
    cliente: "Carlos Ferreira",
    veiculo: "Ford Ka 2021",
    placa: "JKL-3456",
    servicos: ["Alinhamento", "Balanceamento"],
    mecanico: "Pedro Santos",
    dataEntrada: "2024-01-09",
    dataPrevista: "2024-01-09",
    status: "orcamento",
    prioridade: "media",
    valor: 120.00,
    observacoes: "Aguardando aprovação do orçamento pelo cliente"
  }
];

const statusConfig = {
  orcamento: { label: "Orçamento", color: "bg-gray-500" },
  aprovado: { label: "Aprovado", color: "bg-blue-500" },
  em_andamento: { label: "Em Andamento", color: "bg-yellow-500" },
  aguardando_pecas: { label: "Aguardando Peças", color: "bg-orange-500" },
  concluida: { label: "Concluída", color: "bg-green-500" },
  entregue: { label: "Entregue", color: "bg-workshop-success" },
  cancelada: { label: "Cancelada", color: "bg-red-500" }
};

const prioridadeConfig = {
  baixa: { label: "Baixa", color: "bg-green-100 text-green-800" },
  media: { label: "Média", color: "bg-yellow-100 text-yellow-800" },
  alta: { label: "Alta", color: "bg-red-100 text-red-800" }
};

export default function OrdemServico() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const filteredOrdens = ordensServico.filter(ordem => {
    const matchesSearch = ordem.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ordem.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ordem.veiculo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ordem.placa.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "todos" || ordem.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ordens de Serviço</h1>
          <p className="text-muted-foreground">Gerencie todas as OS da oficina</p>
        </div>
        <ServiceOrderForm />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {ordensServico.filter(os => os.status === "em_andamento").length}
            </p>
            <p className="text-sm text-muted-foreground">Em Andamento</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {ordensServico.filter(os => os.status === "aguardando_pecas").length}
            </p>
            <p className="text-sm text-muted-foreground">Aguardando Peças</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-workshop-success">
              {ordensServico.filter(os => os.status === "concluida").length}
            </p>
            <p className="text-sm text-muted-foreground">Concluídas</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              R$ {ordensServico.reduce((sum, os) => sum + os.valor, 0).toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">Valor Total</p>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar e Filtrar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por OS, cliente, veículo ou placa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="orcamento">Orçamento</SelectItem>
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="aguardando_pecas">Aguardando Peças</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
                <SelectItem value="entregue">Entregue</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Mais Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* OS List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Ordens de Serviço ({filteredOrdens.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrdens.map((ordem) => (
              <div
                key={ordem.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    {/* Header da OS */}
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg text-primary">{ordem.id}</span>
                      <Badge className={`${statusConfig[ordem.status as keyof typeof statusConfig].color} text-white`}>
                        {statusConfig[ordem.status as keyof typeof statusConfig].label}
                      </Badge>
                      <Badge variant="outline" className={prioridadeConfig[ordem.prioridade as keyof typeof prioridadeConfig].color}>
                        {prioridadeConfig[ordem.prioridade as keyof typeof prioridadeConfig].label}
                      </Badge>
                    </div>

                    {/* Cliente e Veículo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold">{ordem.cliente}</p>
                        <p className="text-sm text-muted-foreground">{ordem.veiculo}</p>
                        <p className="text-sm text-muted-foreground">Placa: {ordem.placa}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Mecânico: {ordem.mecanico}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Entrada: {ordem.dataEntrada}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Previsão: {ordem.dataPrevista}
                        </div>
                      </div>
                    </div>

                    {/* Serviços */}
                    <div>
                      <p className="text-sm font-medium mb-1">Serviços:</p>
                      <div className="flex flex-wrap gap-1">
                        {ordem.servicos.map((servico, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {servico}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Observações */}
                    {ordem.observacoes && (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm"><span className="font-medium">Observações:</span> {ordem.observacoes}</p>
                      </div>
                    )}
                  </div>

                  {/* Valor e Ações */}
                  <div className="text-right space-y-3 ml-4">
                    <p className="text-2xl font-bold text-workshop-orange">
                      R$ {ordem.valor.toFixed(2)}
                    </p>
                    <div className="flex flex-col gap-1">
                      <Button size="sm" variant="outline" className="w-full">
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        <FileText className="h-3 w-3 mr-1" />
                        Imprimir
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}