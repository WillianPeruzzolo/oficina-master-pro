import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";

const MODULE = "StockAlerts";

export interface StockAlert {
  id: string;
  partName: string;
  currentStock: number;
  minStock: number;
  supplier: string;
  priority: "high" | "medium" | "low";
}

export function useStockAlerts() {
  return useQuery({
    queryKey: ["stock-alerts"],
    queryFn: async () => {
      try {
        logger.info(MODULE, "Buscando alertas de estoque");

        const { data, error } = await supabase
          .from("inventory")
          .select(`
            id,
            current_stock,
            min_stock,
            parts!inner(
              name,
              supplier_id,
              suppliers(name)
            )
          `)
          .order("current_stock", { ascending: true });

        if (error) throw error;

        // Filter only items below minimum stock
        const lowStockItems = (data || []).filter((item: any) => 
          item.current_stock < item.min_stock
        );

        const alerts: StockAlert[] = lowStockItems.map((item: any) => {
          const stockDiff = item.min_stock - item.current_stock;
          const stockPercentage = (item.current_stock / item.min_stock) * 100;
          
          let priority: "high" | "medium" | "low" = "low";
          if (stockPercentage <= 25) {
            priority = "high";
          } else if (stockPercentage <= 50) {
            priority = "medium";
          }

          return {
            id: item.id,
            partName: item.parts?.name || "Peça desconhecida",
            currentStock: item.current_stock,
            minStock: item.min_stock,
            supplier: item.parts?.suppliers?.name || "Fornecedor não informado",
            priority
          };
        });

        logger.info(MODULE, `${alerts.length} alertas de estoque encontrados`);
        return alerts;
      } catch (error) {
        logger.error(MODULE, "Erro ao buscar alertas de estoque", error as Error);
        throw error;
      }
    },
    refetchInterval: 120000, // Refresh every 2 minutes
  });
}
