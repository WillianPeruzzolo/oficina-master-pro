import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Car,
  Users,
  ClipboardList,
  Package,
  DollarSign,
  FileText,
  BarChart3,
  Calendar,
  Settings,
  Menu,
  X,
  Wrench
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useWorkshopSettings } from "@/hooks/useWorkshopSettings";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Veículos", href: "/veiculos", icon: Car },
  { name: "Ordens de Serviço", href: "/os", icon: ClipboardList },
  { name: "Estoque", href: "/estoque", icon: Package },
  { name: "Financeiro", href: "/financeiro", icon: DollarSign },
  { name: "Cotações", href: "/cotacoes", icon: FileText },
  { name: "Agenda", href: "/agenda", icon: Calendar },
  { name: "Relatórios", href: "/relatorios", icon: BarChart3 },
  { name: "Configurações", href: "/configuracoes", icon: Settings },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { settings } = useWorkshopSettings();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-gradient-steel border-r border-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-workshop">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">{settings.workshop_name || "WorkshopPro"}</h1>
              <p className="text-xs text-white/70">Gestão Completa</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white hover:bg-white/10"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navigation.map((item) => {
          const active = isActive(item.href);
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-gradient-primary text-white shadow-workshop"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className={cn("h-5 w-5 flex-shrink-0")} />
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border/50">
          <div className="text-xs text-white/60 text-center">
            <p>v1.0.0</p>
            <p>Sistema de Gestão</p>
          </div>
        </div>
      )}
    </div>
  );
}