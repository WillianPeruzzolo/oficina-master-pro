import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useClients } from "@/hooks/useClients";
import { useCreateAppointment, useUpdateAppointment, type Appointment } from "@/hooks/useAppointments";

const appointmentSchema = z.object({
  client_id: z.string().min(1, "Cliente é obrigatório"),
  vehicle_id: z.string().optional(),
  mechanic_id: z.string().optional(),
  service_description: z.string().min(1, "Descrição do serviço é obrigatória"),
  appointment_date: z.date({ required_error: "Data é obrigatória" }),
  start_time: z.string().min(1, "Horário de início é obrigatório"),
  end_time: z.string().min(1, "Horário de fim é obrigatório"),
  status: z.enum(['agendado', 'em_andamento', 'concluido', 'cancelado']),
  priority: z.enum(['baixa', 'normal', 'alta', 'urgente']),
  notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  appointment?: Appointment;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function AppointmentForm({ appointment, onSuccess, trigger }: AppointmentFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: clients = [] } = useClients();
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      client_id: appointment?.client_id || "",
      vehicle_id: appointment?.vehicle_id || "",
      mechanic_id: appointment?.mechanic_id || "",
      service_description: appointment?.service_description || "",
      appointment_date: appointment?.appointment_date ? new Date(appointment.appointment_date) : undefined,
      start_time: appointment?.start_time || "",
      end_time: appointment?.end_time || "",
      status: appointment?.status || "agendado",
      priority: appointment?.priority || "normal",
      notes: appointment?.notes || "",
    },
  });

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      const appointmentData = {
        client_id: data.client_id,
        vehicle_id: data.vehicle_id,
        mechanic_id: data.mechanic_id,
        service_description: data.service_description,
        appointment_date: format(data.appointment_date, 'yyyy-MM-dd'),
        start_time: data.start_time,
        end_time: data.end_time,
        status: data.status,
        priority: data.priority,
        notes: data.notes,
      };

      if (appointment) {
        await updateAppointment.mutateAsync({ 
          id: appointment.id, 
          ...appointmentData 
        });
      } else {
        await createAppointment.mutateAsync(appointmentData);
      }

      setIsOpen(false);
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error saving appointment:", error);
    }
  };

  const selectedClient = clients.find(c => c.id === form.watch("client_id"));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gradient-primary hover:opacity-90">
            Novo Agendamento
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {appointment ? "Editar Agendamento" : "Novo Agendamento"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="client_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehicle_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Veículo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um veículo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* TODO: Implement vehicle selection based on client */}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="service_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição do Serviço</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o serviço a ser realizado" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="appointment_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário Início</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário Fim</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="agendado">Agendado</SelectItem>
                        <SelectItem value="em_andamento">Em Andamento</SelectItem>
                        <SelectItem value="concluido">Concluído</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridade</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="baixa">Baixa</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="urgente">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Observações adicionais" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gradient-primary hover:opacity-90"
                disabled={createAppointment.isPending || updateAppointment.isPending}
              >
                {appointment ? "Atualizar" : "Agendar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}