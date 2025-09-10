-- Create workshop settings table for customization
CREATE TABLE public.workshop_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workshop_name TEXT NOT NULL DEFAULT 'WorkshopPro',
  logo_url TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  address TEXT,
  theme TEXT NOT NULL DEFAULT 'light',
  primary_color TEXT NOT NULL DEFAULT '#2563eb',
  secondary_color TEXT NOT NULL DEFAULT '#f97316',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.workshop_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for workshop settings
CREATE POLICY "Authenticated users can view workshop settings" 
ON public.workshop_settings 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage workshop settings" 
ON public.workshop_settings 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Insert default settings
INSERT INTO public.workshop_settings (workshop_name) VALUES ('WorkshopPro');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_workshop_settings_updated_at
BEFORE UPDATE ON public.workshop_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();