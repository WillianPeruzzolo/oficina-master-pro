import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Part {
  id: string;
  name: string;
  category?: string;
  part_number?: string;
  description?: string;
  unit_price?: number;
  supplier_id?: string;
  created_at: string;
  updated_at: string;
}

export function useParts() {
  return useQuery({
    queryKey: ["parts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("parts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Part[];
    },
  });
}

export function useCreatePart() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (partData: Omit<Part, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("parts")
        .insert([partData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts"] });
      toast({
        title: "Peça criada com sucesso!",
        description: "A peça foi adicionada ao sistema.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar peça",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdatePart() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...partData }: Partial<Part> & { id: string }) => {
      const { data, error } = await supabase
        .from("parts")
        .update(partData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts"] });
      toast({
        title: "Peça atualizada com sucesso!",
        description: "As informações da peça foram atualizadas.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar peça",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeletePart() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("parts")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts"] });
      toast({
        title: "Peça removida com sucesso!",
        description: "A peça foi removida do sistema.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao remover peça",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}