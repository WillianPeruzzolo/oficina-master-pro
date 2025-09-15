import { useState } from "react";
import { Bell, X, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  useNotifications, 
  useMarkNotificationAsRead, 
  useDeleteNotification, 
  useClearAllNotifications 
} from "@/hooks/useNotifications";

export function NotificationDropdown() {
  const { data: notifications = [], isLoading } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const deleteNotification = useDeleteNotification();
  const clearAll = useClearAllNotifications();

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    markAsRead.mutate(id);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification.mutate(id);
  };

  const handleClearAll = () => {
    clearAll.mutate();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'error':
        return '🔴';
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      default:
        return 'ℹ️';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta':
        return 'bg-workshop-danger';
      case 'normal':
        return 'bg-workshop-warning';
      case 'baixa':
        return 'bg-workshop-success';
      default:
        return 'bg-muted';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <div className="p-3 pb-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Notificações</h4>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-xs h-6"
              >
                Limpar todas
              </Button>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        
        {isLoading ? (
          <div className="p-4 text-center text-muted-foreground">
            Carregando notificações...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            Nenhuma notificação
          </div>
        ) : (
          <ScrollArea className="h-96">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`p-3 cursor-pointer focus:bg-muted ${
                  !notification.is_read ? 'bg-muted/50' : ''
                }`}
                onClick={() => !notification.is_read && handleMarkAsRead(notification.id, {} as React.MouseEvent)}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="flex-shrink-0 text-lg">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="font-medium text-sm leading-tight">
                        {notification.title}
                      </h5>
                      <Badge 
                        className={`${getPriorityColor(notification.priority)} text-white text-xs px-1 py-0`}
                      >
                        {notification.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.created_at).toLocaleString('pt-BR')}
                      </span>
                      
                      <div className="flex gap-1">
                        {!notification.is_read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-workshop-danger hover:text-workshop-danger"
                          onClick={(e) => handleDelete(notification.id, e)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}