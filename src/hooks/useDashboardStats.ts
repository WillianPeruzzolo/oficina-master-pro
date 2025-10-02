import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";

const MODULE = "DashboardStats";

export interface DashboardStats {
  ordersInProgress: number;
  monthlyRevenue: number;
  activeClients: number;
  todayAppointments: number;
  revenueGrowth: number;
  clientsGrowth: number;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      try {
        logger.info(MODULE, "Buscando estatísticas do dashboard");

        // Get current month start
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        // Orders in progress
        const { count: ordersInProgress, error: ordersError } = await supabase
          .from("service_orders")
          .select("*", { count: "exact", head: true })
          .eq("status", "em_andamento");

        if (ordersError) throw ordersError;

        // Monthly revenue (current month)
        const { data: currentMonthOrders, error: revenueError } = await supabase
          .from("service_orders")
          .select("total_amount")
          .gte("completed_at", currentMonthStart.toISOString())
          .not("completed_at", "is", null);

        if (revenueError) throw revenueError;

        const monthlyRevenue = currentMonthOrders?.reduce(
          (sum, order) => sum + (Number(order.total_amount) || 0),
          0
        ) || 0;

        // Last month revenue for growth calculation
        const { data: lastMonthOrders, error: lastRevenueError } = await supabase
          .from("service_orders")
          .select("total_amount")
          .gte("completed_at", lastMonthStart.toISOString())
          .lte("completed_at", lastMonthEnd.toISOString())
          .not("completed_at", "is", null);

        if (lastRevenueError) throw lastRevenueError;

        const lastMonthRevenue = lastMonthOrders?.reduce(
          (sum, order) => sum + (Number(order.total_amount) || 0),
          0
        ) || 0;

        const revenueGrowth = lastMonthRevenue > 0
          ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
          : 0;

        // Active clients (those with at least one service order)
        const { data: activeClientsData, error: clientsError } = await supabase
          .from("service_orders")
          .select("client_id", { count: "exact" })
          .not("client_id", "is", null);

        if (clientsError) throw clientsError;

        // Get unique clients
        const uniqueClients = new Set(activeClientsData?.map(o => o.client_id));
        const activeClients = uniqueClients.size;

        // Last month active clients for growth
        const { data: lastMonthClientsData } = await supabase
          .from("service_orders")
          .select("client_id")
          .gte("created_at", lastMonthStart.toISOString())
          .lte("created_at", lastMonthEnd.toISOString())
          .not("client_id", "is", null);

        const lastMonthClients = new Set(lastMonthClientsData?.map(o => o.client_id)).size;
        const clientsGrowth = lastMonthClients > 0
          ? ((activeClients - lastMonthClients) / lastMonthClients) * 100
          : 0;

        // Today's appointments
        const today = new Date().toISOString().split('T')[0];
        const { count: todayAppointments, error: appointmentsError } = await supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .eq("appointment_date", today);

        if (appointmentsError) throw appointmentsError;

        const stats: DashboardStats = {
          ordersInProgress: ordersInProgress || 0,
          monthlyRevenue,
          activeClients,
          todayAppointments: todayAppointments || 0,
          revenueGrowth,
          clientsGrowth
        };

        logger.info(MODULE, "Estatísticas carregadas com sucesso", stats);
        return stats;
      } catch (error) {
        logger.error(MODULE, "Erro ao buscar estatísticas", error as Error);
        throw error;
      }
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}
