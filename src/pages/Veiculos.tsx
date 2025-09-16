import { useState } from "react";
import { Plus, Search, Car, Calendar, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import VehicleForm from "@/components/forms/VehicleForm";

export default function Veiculos() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Veículos</h1>
          <p className="text-muted-foreground">
            Gerencie a frota de veículos dos clientes
          </p>
        </div>
        <VehicleForm />
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por placa, modelo ou cliente..."
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
            <CardTitle className="text-sm font-medium">Total de Veículos</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">
              +12 este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Manutenção</CardTitle>
            <Wrench className="h-4 w-4 text-workshop-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-workshop-warning">8</div>
            <p className="text-xs text-muted-foreground">
              Atualmente na oficina
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revisões Pendentes</CardTitle>
            <Calendar className="h-4 w-4 text-workshop-danger" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-workshop-danger">15</div>
            <p className="text-xs text-muted-foreground">
              Vencidas ou próximas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marcas Atendidas</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              Diferentes marcas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Vehicles List */}
      <Card>
        <CardHeader>
          <CardTitle>Veículos Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                id: 1,
                brand: "Honda",
                model: "Civic",
                year: 2020,
                plate: "ABC-1234",
                client: "João Silva",
                mileage: 45000,
                color: "Prata",
                lastService: "15/12/2024",
                nextService: "15/03/2025",
                status: "regular"
              },
              {
                id: 2,
                brand: "Toyota",
                model: "Corolla",
                year: 2019,
                plate: "XYZ-5678",
                client: "Maria Santos",
                mileage: 62000,
                color: "Branco",
                lastService: "20/11/2024",
                nextService: "20/02/2025",
                status: "manutencao"
              },
              {
                id: 3,
                brand: "Volkswagen",
                model: "Golf",
                year: 2021,
                plate: "DEF-9012",
                client: "Pedro Costa",
                mileage: 28000,
                color: "Azul",
                lastService: "05/10/2024",
                nextService: "05/01/2025",
                status: "atrasado"
              },
              {
                id: 4,
                brand: "Hyundai",
                model: "HB20",
                year: 2022,
                plate: "GHI-3456",
                client: "Ana Paula",
                mileage: 15000,
                color: "Vermelho",
                lastService: "10/01/2025",
                nextService: "10/04/2025",
                status: "regular"
              }
            ].map((vehicle) => (
              <div key={vehicle.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-primary/10 rounded-lg">
                      <Car className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {vehicle.brand} {vehicle.model} {vehicle.year}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Placa: {vehicle.plate} • {vehicle.color}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        vehicle.status === "regular" ? "default" :
                        vehicle.status === "manutencao" ? "secondary" :
                        "destructive"
                      }
                    >
                      {vehicle.status === "regular" ? "Regular" :
                       vehicle.status === "manutencao" ? "Em Manutenção" :
                       "Atrasado"}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Cliente</p>
                    <p className="text-muted-foreground">{vehicle.client}</p>
                  </div>
                  <div>
                    <p className="font-medium">Quilometragem</p>
                    <p className="text-muted-foreground">{vehicle.mileage.toLocaleString()} km</p>
                  </div>
                  <div>
                    <p className="font-medium">Último Serviço</p>
                    <p className="text-muted-foreground">{vehicle.lastService}</p>
                  </div>
                  <div>
                    <p className="font-medium">Próxima Revisão</p>
                    <p className={
                      vehicle.status === "atrasado" ? "text-workshop-danger" :
                      vehicle.status === "manutencao" ? "text-workshop-warning" :
                      "text-muted-foreground"
                    }>
                      {vehicle.nextService}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t">
                  <Button size="sm" variant="outline">
                    Ver Histórico
                  </Button>
                  <Button size="sm" variant="outline">
                    Editar
                  </Button>
                  <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                    Nova OS
                  </Button>
                  {vehicle.status === "atrasado" && (
                    <Button size="sm" className="bg-workshop-warning hover:bg-workshop-warning/90">
                      Agendar Revisão
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}