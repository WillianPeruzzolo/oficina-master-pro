-- Create storage bucket for workshop logos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('workshop-logos', 'workshop-logos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

-- Create policies for workshop logo uploads
CREATE POLICY "Anyone can view workshop logos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'workshop-logos');

CREATE POLICY "Authenticated users can upload workshop logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'workshop-logos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update workshop logos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'workshop-logos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete workshop logos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'workshop-logos' AND auth.uid() IS NOT NULL);

-- Create quotations table for better data management
CREATE TABLE IF NOT EXISTS public.quotations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quotation_number TEXT NOT NULL UNIQUE,
  client_id UUID REFERENCES public.clients(id),
  vehicle_id UUID REFERENCES public.vehicles(id),
  service_description TEXT NOT NULL,
  parts_description TEXT,
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovada', 'rejeitada', 'expirada')),
  supplier TEXT,
  valid_until DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS for quotations
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for quotations
CREATE POLICY "Authenticated users can manage quotations" 
ON public.quotations 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create appointments table for agenda functionality
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id),
  vehicle_id UUID REFERENCES public.vehicles(id),
  mechanic_id UUID REFERENCES public.profiles(id),
  service_description TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'agendado' CHECK (status IN ('agendado', 'em_andamento', 'concluido', 'cancelado')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('baixa', 'normal', 'alta', 'urgente')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for appointments
CREATE POLICY "Authenticated users can manage appointments" 
ON public.appointments 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('baixa', 'normal', 'alta')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  user_id UUID,
  related_entity_type TEXT,
  related_entity_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notifications
CREATE POLICY "Users can manage all notifications" 
ON public.notifications 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create triggers for updated_at columns
CREATE TRIGGER update_quotations_updated_at
BEFORE UPDATE ON public.quotations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate quotation numbers
CREATE OR REPLACE FUNCTION public.generate_quotation_number()
RETURNS TEXT
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_number INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(quotation_number FROM 5) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.quotations
  WHERE quotation_number ~ '^COT-[0-9]+$';
  
  RETURN 'COT-' || LPAD(next_number::TEXT, 3, '0');
END;
$$;

-- Trigger to auto-generate quotation numbers
CREATE OR REPLACE FUNCTION public.set_quotation_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.quotation_number IS NULL OR NEW.quotation_number = '' THEN
    NEW.quotation_number := public.generate_quotation_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_quotation_number_trigger
BEFORE INSERT ON public.quotations
FOR EACH ROW
EXECUTE FUNCTION public.set_quotation_number();