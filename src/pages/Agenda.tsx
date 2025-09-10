import { useState } from "react";
import { Calendar, Plus, Clock, User, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Agenda() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getStatusColor = (status: string) => {
    switch (status) {
      case "agendado": return "bg-primary text-white";
      case "em_andamento": return "bg-workshop-warning text-white";
      case "concluido": return "bg-workshop-success text-white";
      case "cancelado": return "bg-workshop-danger text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const formatTime = (time: string) => {
    return time;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agenda</h1>
          <p className="text-muted-foreground">
            Gerencie agendamentos e horários de serviço
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Agendamentos hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              Agendamentos na semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Clock className="h-4 w-4 text-workshop-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-workshop-warning">3</div>
            <p className="text-xs text-muted-foreground">
              Serviços em execução
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa Ocupação</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              Horários ocupados hoje
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar and Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mini Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Janeiro 2025
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {/* Calendar header */}
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                <div key={day} className="p-2 font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
              
              {/* Calendar days - simplified version */}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <button
                  key={day}
                  className={`p-2 rounded hover:bg-muted ${
                    day === 9 ? "bg-primary text-white" : ""
                  }`}
                  onClick={() => setSelectedDate(new Date(2025, 0, day))}
                >
                  {day}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Schedule for Selected Date */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Agendamentos - 09/01/2025</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    time: "08:00",
                    client: "João Silva",
                    vehicle: "Honda Civic 2020",
                    service: "Revisão dos 20.000km",
                    mechanic: "Carlos",
                    status: "agendado",
                    duration: "2h"
                  },
                  {
                    id: 2,
                    time: "10:30",
                    client: "Maria Santos",
                    vehicle: "Toyota Corolla 2019",
                    service: "Troca de Óleo",
                    mechanic: "Roberto",
                    status: "em_andamento",
                    duration: "1h"
                  },
                  {
                    id: 3,
                    time: "14:00",
                    client: "Pedro Costa",
                    vehicle: "VW Golf 2021",
                    service: "Alinhamento e Balanceamento",
                    mechanic: "Carlos",
                    status: "agendado",
                    duration: "1h30"
                  },
                  {
                    id: 4,
                    time: "16:00",
                    client: "Ana Paula",
                    vehicle: "Hyundai HB20 2022",
                    service: "Diagnóstico Eletrônico",
                    mechanic: "Miguel",
                    status: "concluido",
                    duration: "45min"
                  }
                ].map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 font-medium">
                          <Clock className="h-4 w-4" />
                          {formatTime(appointment.time)}
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status.replace("_", " ").toUpperCase()}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Duração: {appointment.duration}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{appointment.client}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-muted-foreground" />
                          <span>{appointment.vehicle}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p><span className="font-medium">Serviço:</span> {appointment.service}</p>
                        <p><span className="font-medium">Mecânico:</span> {appointment.mechanic}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                      <Button size="sm" variant="outline">
                        Ver Detalhes
                      </Button>
                      {appointment.status === "agendado" && (
                        <Button size="sm" className="bg-workshop-warning hover:bg-workshop-warning/90">
                          Iniciar
                        </Button>
                      )}
                      {appointment.status === "em_andamento" && (
                        <Button size="sm" className="bg-workshop-success hover:bg-workshop-success/90">
                          Finalizar
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Weekly View */}
      <Card>
        <CardHeader>
          <CardTitle>Visão Semanal</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="week" className="space-y-4">
            <TabsList>
              <TabsTrigger value="week">Esta Semana</TabsTrigger>
              <TabsTrigger value="month">Este Mês</TabsTrigger>
            </TabsList>

            <TabsContent value="week" className="space-y-4">
              <div className="grid grid-cols-7 gap-4">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day, index) => (
                  <div key={day} className="text-center">
                    <h3 className="font-medium mb-2">{day}</h3>
                    <div className="space-y-1">
                      {index % 2 === 0 ? (
                        <div className="bg-primary/10 text-primary text-xs p-1 rounded">
                          3 agend.
                        </div>
                      ) : (
                        <div className="bg-muted text-muted-foreground text-xs p-1 rounded">
                          Livre
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="month" className="space-y-4">
              <p className="text-muted-foreground text-center py-8">
                Visão mensal em desenvolvimento
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}