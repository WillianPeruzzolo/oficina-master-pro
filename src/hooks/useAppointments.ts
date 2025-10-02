import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Appointment {
  id: string;
  client_id?: string;
  vehicle_id?: string;
  mechanic_id?: string;
  service_description: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: 'agendado' | 'em_andamento' | 'concluido' | 'cancelado';
  priority: 'baixa' | 'normal' | 'alta' | 'urgente';
  notes?: string;
  created_at: string;
  updated_at: string;
  client?: {
    name: string;
    email?: string;
    phone?: string;
  };
  vehicle?: {
    brand: string;
    model: string;
    year?: number;
    license_plate?: string;
  };
  mechanic?: {
    name: string;
  };
}

export function useAppointments(date?: string) {
  return useQuery({
    queryKey: ["appointments", date],
    queryFn: async () => {
      let query = supabase
        .from("appointments")
        .select(`
          *,
          client:clients(name, email, phone),
          vehicle:vehicles(brand, model, year, license_plate),
          mechanic:profiles(name)
        `)
        .order("appointment_date", { ascending: true })
        .order("start_time", { ascending: true });

      // Filter by date if provided
      if (date) {
        query = query.eq("appointment_date", date);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Appointment[];
    },
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from("appointments")
        .insert(appointment)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast({
        title: "Agendamento criado",
        description: "O agendamento foi criado com sucesso!"
      });
    },
    onError: (error) => {
      console.error("Error creating appointment:", error);
      toast({
        title: "Erro ao criar agendamento",
        description: "Não foi possível criar o agendamento.",
        variant: "destructive"
      });
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...appointment }: Partial<Appointment> & { id: string }) => {
      const { data, error } = await supabase
        .from("appointments")
        .update(appointment)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast({
        title: "Agendamento atualizado",
        description: "O agendamento foi atualizado com sucesso!"
      });
    },
    onError: (error) => {
      console.error("Error updating appointment:", error);
      toast({
        title: "Erro ao atualizar agendamento",
        description: "Não foi possível atualizar o agendamento.",
        variant: "destructive"
      });
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast({
        title: "Agendamento excluído",
        description: "O agendamento foi excluído com sucesso!"
      });
    },
    onError: (error) => {
      console.error("Error deleting appointment:", error);
      toast({
        title: "Erro ao excluir agendamento",
        description: "Não foi possível excluir o agendamento.",
        variant: "destructive"
      });
    },
  });
}