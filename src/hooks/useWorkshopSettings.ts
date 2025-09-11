import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface WorkshopSettings {
  id?: string;
  workshop_name: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  theme: string;
  primary_color: string;
  secondary_color: string;
  logo_url?: string;
}

export function useWorkshopSettings() {
  const [settings, setSettings] = useState<WorkshopSettings>({
    workshop_name: "WorkshopPro",
    theme: "light",
    primary_color: "#2563eb",
    secondary_color: "#f97316"
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('workshop_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error loading settings:', error);
        return;
      }

      if (data) {
        setSettings({
          id: data.id,
          workshop_name: data.workshop_name || "WorkshopPro",
          phone: data.phone || undefined,
          whatsapp: data.whatsapp || undefined,
          email: data.email || undefined,
          address: data.address || undefined,
          theme: data.theme || "light",
          primary_color: data.primary_color || "#2563eb",
          secondary_color: data.secondary_color || "#f97316",
          logo_url: data.logo_url || undefined
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: WorkshopSettings) => {
    try {
      const settingsData = {
        workshop_name: newSettings.workshop_name,
        phone: newSettings.phone || null,
        whatsapp: newSettings.whatsapp || null,
        email: newSettings.email || null,
        address: newSettings.address || null,
        theme: newSettings.theme,
        primary_color: newSettings.primary_color,
        secondary_color: newSettings.secondary_color,
        logo_url: newSettings.logo_url || null
      };

      let error;
      if (settings.id) {
        // Update existing settings
        const { error: updateError } = await supabase
          .from('workshop_settings')
          .update(settingsData)
          .eq('id', settings.id);
        error = updateError;
      } else {
        // Insert new settings
        const { error: insertError } = await supabase
          .from('workshop_settings')
          .insert(settingsData);
        error = insertError;
      }

      if (error) {
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar as configurações.",
          variant: "destructive"
        });
        return false;
      }

      setSettings(newSettings);
      toast({
        title: "Configurações salvas",
        description: "As configurações foram salvas com sucesso!"
      });
      
      // Reload to get the updated data with ID if it was an insert
      await loadSettings();
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    settings,
    loading,
    saveSettings,
    updateSettings: setSettings
  };
}