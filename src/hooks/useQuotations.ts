import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Quotation {
  id: string;
  quotation_number: string;
  client_id?: string;
  vehicle_id?: string;
  service_description: string;
  parts_description?: string;
  total_amount: number;
  status: 'pendente' | 'aprovada' | 'rejeitada' | 'expirada';
  supplier?: string;
  valid_until?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  client?: {
    name: string;
    email?: string;
  };
  vehicle?: {
    brand: string;
    model: string;
    year?: number;
  };
}

export function useQuotations() {
  return useQuery({
    queryKey: ["quotations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotations")
        .select(`
          *,
          client:clients(name, email),
          vehicle:vehicles(brand, model, year)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Quotation[];
    },
  });
}

export function useCreateQuotation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (quotation: Omit<Quotation, 'id' | 'quotation_number' | 'created_at' | 'updated_at' | 'created_by' | 'client' | 'vehicle'>) => {
      const user = await supabase.auth.getUser();
      const insertData = {
        client_id: quotation.client_id,
        vehicle_id: quotation.vehicle_id,
        service_description: quotation.service_description,
        parts_description: quotation.parts_description,
        total_amount: quotation.total_amount,
        status: quotation.status,
        supplier: quotation.supplier,
        valid_until: quotation.valid_until,
        notes: quotation.notes,
        created_by: user.data.user?.id
      };

      const { data, error } = await supabase
        .from("quotations")
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      toast({
        title: "Cotação criada",
        description: "A cotação foi criada com sucesso!"
      });
    },
    onError: (error) => {
      console.error("Error creating quotation:", error);
      toast({
        title: "Erro ao criar cotação",
        description: "Não foi possível criar a cotação.",
        variant: "destructive"
      });
    },
  });
}

export function useUpdateQuotation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...quotation }: Partial<Quotation> & { id: string }) => {
      const { data, error } = await supabase
        .from("quotations")
        .update(quotation)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      toast({
        title: "Cotação atualizada",
        description: "A cotação foi atualizada com sucesso!"
      });
    },
    onError: (error) => {
      console.error("Error updating quotation:", error);
      toast({
        title: "Erro ao atualizar cotação",
        description: "Não foi possível atualizar a cotação.",
        variant: "destructive"
      });
    },
  });
}

export function useDeleteQuotation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("quotations")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      toast({
        title: "Cotação excluída",
        description: "A cotação foi excluída com sucesso!"
      });
    },
    onError: (error) => {
      console.error("Error deleting quotation:", error);
      toast({
        title: "Erro ao excluir cotação",
        description: "Não foi possível excluir a cotação.",
        variant: "destructive"
      });
    },
  });
}