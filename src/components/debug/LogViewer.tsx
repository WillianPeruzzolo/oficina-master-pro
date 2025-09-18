import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Trash2 } from "lucide-react";
import { logger, LogLevel } from "@/utils/logger";

export function LogViewer() {
  const [refreshKey, setRefreshKey] = useState(0);
  
  const allLogs = logger.getLogs();
  const errorLogs = logger.getErrorLogs();

  const handleClearLogs = () => {
    logger.clearLogs();
    setRefreshKey(prev => prev + 1);
  };

  const handleExportLogs = () => {
    const logs = logger.exportLogs();
    const blob = new Blob([logs], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workshop-logs-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case LogLevel.ERROR: return "bg-destructive text-destructive-foreground";
      case LogLevel.WARN: return "bg-warning text-warning-foreground";
      case LogLevel.INFO: return "bg-primary text-primary-foreground";
      case LogLevel.DEBUG: return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Sistema de Logs</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleExportLogs}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button size="sm" variant="outline" onClick={handleClearLogs}>
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">Todos ({allLogs.length})</TabsTrigger>
            <TabsTrigger value="errors">Erros ({errorLogs.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <ScrollArea className="h-[400px] w-full">
              <div className="space-y-2">
                {allLogs.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Nenhum log disponível</p>
                ) : (
                  allLogs.map((log, index) => (
                    <div key={index} className="p-3 border rounded-lg text-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getLevelColor(log.level)}>
                          {log.level.toUpperCase()}
                        </Badge>
                        <span className="font-medium">{log.module}</span>
                        <span className="text-muted-foreground text-xs">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="mb-2">{log.message}</p>
                      {log.data && (
                        <div className="bg-muted p-2 rounded text-xs">
                          <pre>{JSON.stringify(log.data, null, 2)}</pre>
                        </div>
                      )}
                      {log.error && (
                        <div className="bg-destructive/10 p-2 rounded text-xs mt-2">
                          <strong>Erro:</strong> {log.error.message}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="errors" className="mt-4">
            <ScrollArea className="h-[400px] w-full">
              <div className="space-y-2">
                {errorLogs.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Nenhum erro registrado</p>
                ) : (
                  errorLogs.map((log, index) => (
                    <div key={index} className="p-3 border border-destructive rounded-lg text-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-destructive text-destructive-foreground">
                          ERROR
                        </Badge>
                        <span className="font-medium">{log.module}</span>
                        <span className="text-muted-foreground text-xs">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="mb-2">{log.message}</p>
                      {log.error && (
                        <div className="bg-destructive/10 p-2 rounded text-xs">
                          <strong>Erro:</strong> {log.error.message}
                          {log.error.stack && (
                            <pre className="mt-2 text-xs">{log.error.stack}</pre>
                          )}
                        </div>
                      )}
                      {log.data && (
                        <div className="bg-muted p-2 rounded text-xs mt-2">
                          <pre>{JSON.stringify(log.data, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}