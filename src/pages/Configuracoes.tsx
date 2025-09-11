import { useState, useEffect } from "react";
import { Save, Upload, Palette, Building, Phone, Mail, MapPin, Lock, Eye, EyeOff } from "lucide-react";
import { useWorkshopSettings } from "@/hooks/useWorkshopSettings";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { createAdminUser } from "@/utils/adminSetup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function Configuracoes() {
  const { settings, loading, saveSettings } = useWorkshopSettings();
  const { user } = useAuth();
  const { toast } = useToast();
  const [localSettings, setLocalSettings] = useState(settings);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  // Update local settings when settings from hook change
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = async () => {
    const success = await saveSettings(localSettings);
    if (success) {
      // Settings saved successfully
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive"
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível alterar a senha.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Sucesso",
          description: "Senha alterada com sucesso!"
        });
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleCreateAdmin = async () => {
    setIsCreatingAdmin(true);
    try {
      const result = await createAdminUser();
      if (result.success) {
        toast({
          title: "Sucesso",
          description: result.message
        });
      } else {
        toast({
          title: "Erro",
          description: result.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar usuário administrador.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  const colorPresets = [
    { name: "Azul Industrial", primary: "#2563eb", secondary: "#f97316" },
    { name: "Verde Moderno", primary: "#16a34a", secondary: "#eab308" },
    { name: "Roxo Elegante", primary: "#9333ea", secondary: "#f59e0b" },
    { name: "Vermelho Forte", primary: "#dc2626", secondary: "#059669" },
    { name: "Teal Suave", primary: "#0d9488", secondary: "#f59e0b" }
  ];

  if (loading) {
    return <div className="p-6">Carregando configurações...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Personalize sua oficina e configure o sistema
          </p>
        </div>
        <Button onClick={handleSave} className="bg-gradient-primary hover:opacity-90">
          <Save className="h-4 w-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>

      <Tabs defaultValue="oficina" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="oficina">Oficina</TabsTrigger>
          <TabsTrigger value="aparencia">Aparência</TabsTrigger>
          <TabsTrigger value="campos">Campos</TabsTrigger>
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
        </TabsList>

        {/* Workshop Settings */}
        <TabsContent value="oficina" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Informações da Oficina
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="workshop-name">Nome da Oficina</Label>
                  <Input
                    id="workshop-name"
                    value={localSettings.workshop_name || ""}
                    onChange={(e) => setLocalSettings({...localSettings, workshop_name: e.target.value})}
                    placeholder="Nome da sua oficina"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Endereço Completo</Label>
                  <Textarea
                    id="address"
                    value={localSettings.address || ""}
                    onChange={(e) => setLocalSettings({...localSettings, address: e.target.value})}
                    placeholder="Rua, número, bairro, cidade, CEP"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contatos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={localSettings.phone || ""}
                    onChange={(e) => setLocalSettings({...localSettings, phone: e.target.value})}
                    placeholder="(11) 1234-5678"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={localSettings.whatsapp || ""}
                    onChange={(e) => setLocalSettings({...localSettings, whatsapp: e.target.value})}
                    placeholder="(11) 91234-5678"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={localSettings.email || ""}
                    onChange={(e) => setLocalSettings({...localSettings, email: e.target.value})}
                    placeholder="contato@oficina.com"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Logo da Oficina
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Clique para fazer upload da logo ou arraste e solte
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Formatos: PNG, JPG, SVG • Tamanho máximo: 2MB • Recomendado: 300x300px
                  </p>
                  <Button variant="outline" className="mt-4">
                    Selecionar Arquivo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="aparencia" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Tema do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Modo de Cor</Label>
                  <Select 
                    value={localSettings.theme} 
                    onValueChange={(value) => setLocalSettings({...localSettings, theme: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="auto">Automático</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Cores Predefinidas</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {colorPresets.map((preset, index) => (
                      <button
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        onClick={() => setLocalSettings({
                          ...localSettings, 
                          primary_color: preset.primary,
                          secondary_color: preset.secondary
                        })}
                      >
                        <span className="text-sm font-medium">{preset.name}</span>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded-full border"
                            style={{ backgroundColor: preset.primary }}
                          />
                          <div 
                            className="w-6 h-6 rounded-full border"
                            style={{ backgroundColor: preset.secondary }}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cores Personalizadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Cor Primária</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="primary-color"
                      type="color"
                      value={localSettings.primary_color}
                      onChange={(e) => setLocalSettings({...localSettings, primary_color: e.target.value})}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={localSettings.primary_color}
                      onChange={(e) => setLocalSettings({...localSettings, primary_color: e.target.value})}
                      placeholder="#2563eb"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Cor Secundária</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="secondary-color"
                      type="color"
                      value={localSettings.secondary_color}
                      onChange={(e) => setLocalSettings({...localSettings, secondary_color: e.target.value})}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={localSettings.secondary_color}
                      onChange={(e) => setLocalSettings({...localSettings, secondary_color: e.target.value})}
                      placeholder="#f97316"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">Pré-visualização</h4>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      style={{ backgroundColor: localSettings.primary_color }}
                      className="text-white"
                    >
                      Botão Primário
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      style={{ 
                        borderColor: localSettings.secondary_color,
                        color: localSettings.secondary_color 
                      }}
                    >
                      Botão Secundário
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Custom Fields */}
        <TabsContent value="campos" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Campos de Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "CPF/CNPJ", enabled: true, required: false },
                  { name: "Data de Nascimento", enabled: false, required: false },
                  { name: "Profissão", enabled: false, required: false },
                  { name: "Como nos conheceu", enabled: true, required: false },
                  { name: "Observações", enabled: true, required: false }
                ].map((field, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{field.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={field.enabled ? "default" : "secondary"}>
                          {field.enabled ? "Ativo" : "Inativo"}
                        </Badge>
                        {field.required && <Badge variant="destructive">Obrigatório</Badge>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked={field.enabled} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campos de Veículo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Quilometragem", enabled: true, required: true },
                  { name: "Combustível", enabled: true, required: false },
                  { name: "Cor", enabled: true, required: false },
                  { name: "Chassi", enabled: false, required: false },
                  { name: "RENAVAM", enabled: false, required: false },
                  { name: "Seguradora", enabled: false, required: false }
                ].map((field, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{field.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={field.enabled ? "default" : "secondary"}>
                          {field.enabled ? "Ativo" : "Inativo"}
                        </Badge>
                        {field.required && <Badge variant="destructive">Obrigatório</Badge>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked={field.enabled} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="sistema" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notificações por E-mail</p>
                    <p className="text-sm text-muted-foreground">
                      Receber alertas sobre OS e vencimentos
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Backup Automático</p>
                    <p className="text-sm text-muted-foreground">
                      Backup diário dos dados
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Modo de Desenvolvimento</p>
                    <p className="text-sm text-muted-foreground">
                      Ativar logs detalhados
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informações do Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Versão do Sistema</p>
                  <p className="text-sm text-muted-foreground">v1.0.0</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Última Atualização</p>
                  <p className="text-sm text-muted-foreground">09/01/2025</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Usuário Logado</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="seguranca" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Alterar Senha
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    placeholder="Digite sua senha atual"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                  >
                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    placeholder="Digite a nova senha"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    placeholder="Confirme a nova senha"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handlePasswordChange} 
                disabled={isChangingPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                className="w-full"
              >
                {isChangingPassword ? "Alterando..." : "Alterar Senha"}
              </Button>

              <div className="text-xs text-muted-foreground">
                <p>• A senha deve ter pelo menos 6 caracteres</p>
                <p>• Use uma combinação de letras, números e símbolos</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuração Inicial</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">Usuário Administrador</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Crie o usuário administrador padrão com email: admin@procar.com e senha: procar
                </p>
                <Button 
                  onClick={handleCreateAdmin} 
                  disabled={isCreatingAdmin}
                  variant="outline"
                  className="w-full"
                >
                  {isCreatingAdmin ? "Criando..." : "Criar Usuário Admin"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}