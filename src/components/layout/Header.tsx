import { useState } from "react";
import { Bell, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserMenu } from "./UserMenu";
import { NotificationDropdown } from "./NotificationDropdown";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Header() {
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Estoque baixo", message: "Filtro de óleo está acabando", time: "2h atrás" },
    { id: 2, title: "OS vencida", message: "OS-001 precisa de atenção", time: "4h atrás" },
    { id: 3, title: "Novo cliente", message: "João Silva foi cadastrado", time: "1d atrás" }
  ]);

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes, OS, peças..."
            className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-workshop-orange text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Notificações</h4>
                {notifications.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearAllNotifications}
                    className="text-xs"
                  >
                    Limpar tudo
                  </Button>
                )}
              </div>
              
              {notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma notificação
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <Card key={notification.id} className="p-3">
                      <CardContent className="p-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{notification.title}</p>
                            <p className="text-xs text-muted-foreground">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeNotification(notification.id)}
                            className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* User Menu */}
        <UserMenu />
      </div>
    </header>
  );
}