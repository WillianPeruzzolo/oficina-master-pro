-- Criar tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'mechanic', 'attendant')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de clientes
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  document TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de veículos
CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  license_plate TEXT,
  engine TEXT,
  color TEXT,
  mileage INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de fornecedores
CREATE TABLE public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  contact_person TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de peças
CREATE TABLE public.parts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  part_number TEXT,
  category TEXT,
  unit_price DECIMAL(10,2),
  supplier_id UUID REFERENCES public.suppliers(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de estoque
CREATE TABLE public.inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  part_id UUID NOT NULL REFERENCES public.parts(id) ON DELETE CASCADE,
  current_stock INTEGER NOT NULL DEFAULT 0,
  min_stock INTEGER NOT NULL DEFAULT 0,
  max_stock INTEGER,
  location TEXT,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de ordens de serviço
CREATE TABLE public.service_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  client_id UUID NOT NULL REFERENCES public.clients(id),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id),
  mechanic_id UUID REFERENCES public.profiles(id),
  status TEXT DEFAULT 'orcamento' CHECK (status IN ('orcamento', 'aprovado', 'em_andamento', 'aguardando_pecas', 'concluida', 'cancelada')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('baixa', 'normal', 'alta', 'urgente')),
  description TEXT NOT NULL,
  diagnosis TEXT,
  total_labor DECIMAL(10,2) DEFAULT 0,
  total_parts DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) DEFAULT 0,
  estimated_completion DATE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de itens da ordem de serviço (peças)
CREATE TABLE public.service_order_parts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_order_id UUID NOT NULL REFERENCES public.service_orders(id) ON DELETE CASCADE,
  part_id UUID NOT NULL REFERENCES public.parts(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de serviços realizados
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_order_id UUID NOT NULL REFERENCES public.service_orders(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  labor_hours DECIMAL(4,2),
  labor_rate DECIMAL(10,2),
  total_amount DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_order_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS (permitir acesso para usuários autenticados)
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can manage clients" ON public.clients FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can manage vehicles" ON public.vehicles FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can manage suppliers" ON public.suppliers FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can manage parts" ON public.parts FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can manage inventory" ON public.inventory FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can manage service orders" ON public.service_orders FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can manage service order parts" ON public.service_order_parts FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can manage services" ON public.services FOR ALL USING (auth.uid() IS NOT NULL);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Criar triggers para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_parts_updated_at BEFORE UPDATE ON public.parts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_service_orders_updated_at BEFORE UPDATE ON public.service_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para gerar número sequencial da OS
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
  next_number INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 4) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.service_orders
  WHERE order_number ~ '^OS-[0-9]+$';
  
  RETURN 'OS-' || LPAD(next_number::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar número da OS automaticamente
CREATE OR REPLACE FUNCTION public.set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := public.generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_service_order_number
  BEFORE INSERT ON public.service_orders
  FOR EACH ROW EXECUTE FUNCTION public.set_order_number();

-- Inserir dados de exemplo para demonstração
INSERT INTO public.clients (name, email, phone, address, document) VALUES
('Maria Santos', 'maria.santos@email.com', '(11) 99999-1111', 'Rua das Flores, 123', '123.456.789-00'),
('João Oliveira', 'joao.oliveira@email.com', '(11) 99999-2222', 'Av. Principal, 456', '987.654.321-00'),
('Ana Silva', 'ana.silva@email.com', '(11) 99999-3333', 'Rua do Centro, 789', '456.789.123-00'),
('Carlos Ferreira', 'carlos.ferreira@email.com', '(11) 99999-4444', 'Rua da Paz, 321', '789.123.456-00');

INSERT INTO public.suppliers (name, email, phone, contact_person) VALUES
('Petrobrás Distribuidora', 'vendas@petrobras.com', '(11) 3000-1000', 'Roberto Silva'),
('Mann Filter Brasil', 'comercial@mannfilter.com.br', '(11) 3000-2000', 'Fernanda Costa'),
('Bosch do Brasil', 'vendas@bosch.com.br', '(11) 3000-3000', 'Paulo Santos'),
('NGK do Brasil', 'comercial@ngk.com.br', '(11) 3000-4000', 'Mariana Lima');

INSERT INTO public.parts (name, description, part_number, category, unit_price, supplier_id) VALUES
('Óleo Motor 5W30', 'Óleo lubrificante sintético 5W30 - 1L', 'OL5W30-1L', 'Lubrificantes', 25.90, (SELECT id FROM public.suppliers WHERE name = 'Petrobrás Distribuidora')),
('Filtro de Ar Civic', 'Filtro de ar para Honda Civic 2016-2021', 'FA-CIVIC-16', 'Filtros', 45.50, (SELECT id FROM public.suppliers WHERE name = 'Mann Filter Brasil')),
('Pastilhas Freio Dianteira', 'Pastilhas de freio dianteira - diversos modelos', 'PF-DIANT-001', 'Freios', 89.90, (SELECT id FROM public.suppliers WHERE name = 'Bosch do Brasil')),
('Velas de Ignição', 'Velas de ignição iridium - jogo com 4 unidades', 'VL-IRID-4PC', 'Ignição', 120.00, (SELECT id FROM public.suppliers WHERE name = 'NGK do Brasil'));

-- Inserir estoque para as peças
INSERT INTO public.inventory (part_id, current_stock, min_stock, max_stock, location) VALUES
((SELECT id FROM public.parts WHERE name = 'Óleo Motor 5W30'), 2, 10, 50, 'Prateleira A1'),
((SELECT id FROM public.parts WHERE name = 'Filtro de Ar Civic'), 1, 5, 20, 'Prateleira B2'),
((SELECT id FROM public.parts WHERE name = 'Pastilhas Freio Dianteira'), 4, 8, 25, 'Prateleira C3'),
((SELECT id FROM public.parts WHERE name = 'Velas de Ignição'), 6, 12, 30, 'Prateleira D4');