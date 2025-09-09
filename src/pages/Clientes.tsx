import { useState } from "react";
import { Plus, Search, Edit, Eye, Phone, Mail, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const clientes = [
  {
    id: 1,
    nome: "Maria Santos",
    email: "maria.santos@email.com",
    telefone: "(11) 99999-9999",
    veiculos: 2,
    ultimaVisita: "2024-01-05",
    totalGasto: 1250.00,
    status: "ativo"
  },
  {
    id: 2,
    nome: "João Oliveira",
    email: "joao.oliveira@email.com",
    telefone: "(11) 88888-8888",
    veiculos: 1,
    ultimaVisita: "2024-01-08",
    totalGasto: 850.00,
    status: "ativo"
  },
  {
    id: 3,
    nome: "Ana Silva",
    email: "ana.silva@email.com",
    telefone: "(11) 77777-7777",
    veiculos: 1,
    ultimaVisita: "2023-12-20",
    totalGasto: 320.00,
    status: "inativo"
  },
  {
    id: 4,
    nome: "Carlos Ferreira",
    email: "carlos.ferreira@email.com",
    telefone: "(11) 66666-6666",
    veiculos: 3,
    ultimaVisita: "2024-01-09",
    totalGasto: 2100.00,
    status: "vip"
  }
];

const statusConfig = {
  ativo: { label: "Ativo", color: "bg-workshop-success" },
  inativo: { label: "Inativo", color: "bg-gray-500" },
  vip: { label: "VIP", color: "bg-workshop-orange" }
};

export default function Clientes() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.telefone.includes(searchTerm)
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">Gerencie todos os seus clientes</p>
        </div>
        <Button className="bg-gradient-primary shadow-workshop">
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filtros</Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{clientes.length}</p>
            <p className="text-sm text-muted-foreground">Total de Clientes</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-workshop-success">
              {clientes.filter(c => c.status === "ativo").length}
            </p>
            <p className="text-sm text-muted-foreground">Clientes Ativos</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-workshop-orange">
              {clientes.filter(c => c.status === "vip").length}
            </p>
            <p className="text-sm text-muted-foreground">Clientes VIP</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              R$ {clientes.reduce((sum, c) => sum + c.totalGasto, 0).toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">Faturamento Total</p>
          </div>
        </Card>
      </div>

      {/* Clientes List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes ({filteredClientes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredClientes.map((cliente) => (
              <div
                key={cliente.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                    {cliente.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{cliente.nome}</h3>
                      <Badge className={`${statusConfig[cliente.status as keyof typeof statusConfig].color} text-white`}>
                        {statusConfig[cliente.status as keyof typeof statusConfig].label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {cliente.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {cliente.telefone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Car className="h-3 w-3" />
                        {cliente.veiculos} veículo{cliente.veiculos !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-semibold text-workshop-orange">
                    R$ {cliente.totalGasto.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Última visita: {cliente.ultimaVisita}
                  </p>
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
    </div>
  );
}