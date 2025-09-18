import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { fetchAddressByCep, type AddressData } from '@/utils/viaCep';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Loader2 } from 'lucide-react';

interface AddressFormProps {
  form: any;
  disabled?: boolean;
}

export function AddressForm({ form, disabled }: AddressFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCepSearch = async (cep: string) => {
    if (cep.replace(/\D/g, '').length !== 8) return;

    setLoading(true);
    try {
      const addressData = await fetchAddressByCep(cep);
      if (addressData) {
        form.setValue('address', `${addressData.street}, ${addressData.neighborhood}`);
        form.setValue('city', addressData.city);
        form.setValue('state', addressData.state);
        
        toast({
          title: "CEP encontrado",
          description: "Endereço preenchido automaticamente",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao consultar CEP",
        description: error instanceof Error ? error.message : "Tente novamente",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="cep"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CEP</FormLabel>
            <div className="flex gap-2">
              <FormControl>
                <MaskedInput
                  mask="cep"
                  placeholder="12345-678"
                  disabled={disabled}
                  {...field}
                  onValueChange={(value) => {
                    field.onChange(value);
                    if (value.replace(/\D/g, '').length === 8) {
                      handleCepSearch(value);
                    }
                  }}
                />
              </FormControl>
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={loading || disabled}
                onClick={() => handleCepSearch(field.value)}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Endereço</FormLabel>
            <FormControl>
              <Input placeholder="Rua, número, bairro" disabled={disabled} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input placeholder="São Paulo" disabled={disabled} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Input placeholder="SP" disabled={disabled} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}