import { useState } from "react";
import { Save, Upload, Palette, Building, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export default function Configuracoes() {
  const [settings, setSettings] = useState({
    workshopName: "WorkshopPro",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    theme: "light",
    primaryColor: "#2563eb",
    secondaryColor: "#f97316"
  });

  const handleSave = () => {
    // TODO: Implement save functionality with Supabase
    console.log("Saving settings:", settings);
  };

  const colorPresets = [
    { name: "Azul Industrial", primary: "#2563eb", secondary: "#f97316" },
    { name: "Verde Moderno", primary: "#16a34a", secondary: "#eab308" },
    { name: "Roxo Elegante", primary: "#9333ea", secondary: "#f59e0b" },
    { name: "Vermelho Forte", primary: "#dc2626", secondary: "#059669" },
    { name: "Teal Suave", primary: "#0d9488", secondary: "#f59e0b" }
  ];

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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="oficina">Oficina</TabsTrigger>
          <TabsTrigger value="aparencia">Aparência</TabsTrigger>
          <TabsTrigger value="campos">Campos</TabsTrigger>
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
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
                    value={settings.workshopName}
                    onChange={(e) => setSettings({...settings, workshopName: e.target.value})}
                    placeholder="Nome da sua oficina"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Endereço Completo</Label>
                  <Textarea
                    id="address"
                    value={settings.address}
                    onChange={(e) => setSettings({...settings, address: e.target.value})}
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
                    value={settings.phone}
                    onChange={(e) => setSettings({...settings, phone: e.target.value})}
                    placeholder="(11) 1234-5678"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={settings.whatsapp}
                    onChange={(e) => setSettings({...settings, whatsapp: e.target.value})}
                    placeholder="(11) 91234-5678"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({...settings, email: e.target.value})}
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
                    value={settings.theme} 
                    onValueChange={(value) => setSettings({...settings, theme: value})}
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
                        onClick={() => setSettings({
                          ...settings, 
                          primaryColor: preset.primary,
                          secondaryColor: preset.secondary
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
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
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
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
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
                      style={{ backgroundColor: settings.primaryColor }}
                      className="text-white"
                    >
                      Botão Primário
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      style={{ 
                        borderColor: settings.secondaryColor,
                        color: settings.secondaryColor 
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

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Campos de Ordem de Serviço</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "Garantia do Serviço", enabled: true, required: false },
                    { name: "Prazo de Entrega", enabled: true, required: true },
                    { name: "Observações do Cliente", enabled: true, required: false },
                    { name: "Km de Entrada", enabled: true, required: true },
                    { name: "Nível de Combustível", enabled: false, required: false },
                    { name: "Condições Gerais do Veículo", enabled: true, required: false }
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
                </div>
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
                    <p className="font-medium">Modo Desenvolvedor</p>
                    <p className="text-sm text-muted-foreground">
                      Habilitar logs detalhados
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integrações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>API WhatsApp Business</Label>
                  <Input placeholder="Token da API" type="password" />
                </div>

                <div className="space-y-2">
                  <Label>Chave PIX</Label>
                  <Input placeholder="Chave PIX para pagamentos" />
                </div>

                <div className="space-y-2">
                  <Label>CEP API</Label>
                  <Select defaultValue="viacep">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viacep">ViaCEP (Gratuito)</SelectItem>
                      <SelectItem value="correios">Correios</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Informações do Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 border rounded">
                    <p className="font-medium">Versão</p>
                    <p className="text-muted-foreground">1.0.0</p>
                  </div>
                  <div className="p-3 border rounded">
                    <p className="font-medium">Última Atualização</p>
                    <p className="text-muted-foreground">09/01/2025</p>
                  </div>
                  <div className="p-3 border rounded">
                    <p className="font-medium">Banco de Dados</p>
                    <p className="text-muted-foreground">PostgreSQL 15</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}