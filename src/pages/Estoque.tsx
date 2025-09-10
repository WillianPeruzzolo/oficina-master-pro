import { useState } from "react";
import { Plus, Search, Package, AlertTriangle, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Estoque() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Estoque</h1>
          <p className="text-muted-foreground">
            Gerencie o estoque de peças e materiais
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          Nova Peça
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar peças..."
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
            <CardTitle className="text-sm font-medium">Total Itens</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-workshop-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              Itens com estoque mínimo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 45.678</div>
            <p className="text-xs text-muted-foreground">
              Valor do estoque atual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              Categorias cadastradas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stock Items */}
      <Card>
        <CardHeader>
          <CardTitle>Itens em Estoque</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Sample data */}
            {[
              {
                id: 1,
                name: "Óleo Motor 5W30",
                category: "Lubrificantes",
                stock: 45,
                minStock: 10,
                price: 25.90,
                supplier: "Petrobras"
              },
              {
                id: 2,
                name: "Filtro de Ar",
                category: "Filtros",
                stock: 5,
                minStock: 15,
                price: 35.50,
                supplier: "Mann Filter"
              },
              {
                id: 3,
                name: "Pastilha de Freio Dianteira",
                category: "Freios",
                stock: 12,
                minStock: 8,
                price: 120.00,
                supplier: "Bosch"
              }
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{item.name}</h3>
                    <Badge variant="secondary">{item.category}</Badge>
                    {item.stock <= item.minStock && (
                      <Badge variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Estoque Baixo
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Fornecedor: {item.supplier}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Estoque: {item.stock}</p>
                  <p className="text-sm text-muted-foreground">
                    R$ {item.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}