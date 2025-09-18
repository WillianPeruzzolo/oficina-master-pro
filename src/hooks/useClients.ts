import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logger, withLogging } from "@/utils/logger";

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  document?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export function useClients() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: () => withLogging("useClients", "fetchClients", async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        logger.error("useClients", "Erro ao buscar clientes", error);
        throw error;
      }
      
      logger.info("useClients", `${data?.length || 0} clientes carregados`);
      return data as Client[];
    }),
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (clientData: Omit<Client, "id" | "created_at" | "updated_at">) =>
      withLogging("useCreateClient", "createClient", async () => {
        const { data, error } = await supabase
          .from("clients")
          .insert([clientData])
          .select()
          .single();

        if (error) {
          logger.error("useCreateClient", "Erro ao criar cliente", error, clientData);
          throw error;
        }

        logger.info("useCreateClient", "Cliente criado com sucesso", { id: data.id, name: clientData.name });
        return data;
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Cliente criado com sucesso!",
        description: "O cliente foi adicionado ao sistema.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar cliente",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, ...clientData }: Partial<Client> & { id: string }) =>
      withLogging("useUpdateClient", "updateClient", async () => {
        const { data, error } = await supabase
          .from("clients")
          .update(clientData)
          .eq("id", id)
          .select()
          .single();

        if (error) {
          logger.error("useUpdateClient", "Erro ao atualizar cliente", error, { id, ...clientData });
          throw error;
        }

        logger.info("useUpdateClient", "Cliente atualizado com sucesso", { id });
        return data;
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Cliente atualizado com sucesso!",
        description: "As informações do cliente foram atualizadas.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar cliente",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) =>
      withLogging("useDeleteClient", "deleteClient", async () => {
        const { error } = await supabase
          .from("clients")
          .delete()
          .eq("id", id);

        if (error) {
          logger.error("useDeleteClient", "Erro ao excluir cliente", error, { id });
          throw error;
        }

        logger.info("useDeleteClient", "Cliente excluído com sucesso", { id });
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Cliente removido com sucesso!",
        description: "O cliente foi removido do sistema.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao remover cliente",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}