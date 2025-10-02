import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";

const MODULE = "RecentOrders";

export interface RecentOrder {
  id: string;
  order_number: string;
  client_name: string;
  vehicle: string;
  service: string;
  status: string;
  value: number;
  date: string;
}

export function useRecentOrders(limit: number = 5) {
  return useQuery({
    queryKey: ["recent-orders", limit],
    queryFn: async () => {
      try {
        logger.info(MODULE, `Buscando últimas ${limit} ordens de serviço`);

        const { data, error } = await supabase
          .from("service_orders")
          .select(`
            id,
            order_number,
            description,
            status,
            total_amount,
            created_at,
            clients!inner(name),
            vehicles!inner(brand, model)
          `)
          .order("created_at", { ascending: false })
          .limit(limit);

        if (error) throw error;

        const orders: RecentOrder[] = (data || []).map((order: any) => ({
          id: order.id,
          order_number: order.order_number,
          client_name: order.clients?.name || "Cliente não informado",
          vehicle: `${order.vehicles?.brand || ""} ${order.vehicles?.model || ""}`.trim() || "Veículo não informado",
          service: order.description || "Sem descrição",
          status: order.status,
          value: Number(order.total_amount) || 0,
          date: order.created_at
        }));

        logger.info(MODULE, `${orders.length} ordens carregadas com sucesso`);
        return orders;
      } catch (error) {
        logger.error(MODULE, "Erro ao buscar ordens recentes", error as Error);
        throw error;
      }
    },
    refetchInterval: 60000, // Refresh every minute
  });
}
