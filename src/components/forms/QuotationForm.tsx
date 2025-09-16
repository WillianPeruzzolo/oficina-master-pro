import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateQuotation, useUpdateQuotation, type Quotation } from "@/hooks/useQuotations";
import { useClients } from "@/hooks/useClients";
import { useVehicles } from "@/hooks/useVehicles";

const quotationSchema = z.object({
  client_id: z.string().min(1, "Cliente é obrigatório"),
  vehicle_id: z.string().min(1, "Veículo é obrigatório"),
  service_description: z.string().min(1, "Descrição do serviço é obrigatória"),
  parts_description: z.string().optional(),
  total_amount: z.number().min(0, "Valor deve ser maior ou igual a zero"),
  supplier: z.string().optional(),
  valid_until: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["pendente", "aprovada", "rejeitada", "expirada"]).optional(),
});

type QuotationFormData = z.infer<typeof quotationSchema>;

interface QuotationFormProps {
  quotation?: Quotation;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export default function QuotationForm({ quotation, onSuccess, trigger }: QuotationFormProps) {
  const [open, setOpen] = useState(false);
  const { data: clients = [] } = useClients();
  const { data: vehicles = [] } = useVehicles();
  const createQuotation = useCreateQuotation();
  const updateQuotation = useUpdateQuotation();

  const form = useForm<QuotationFormData>({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      client_id: quotation?.client_id || "",
      vehicle_id: quotation?.vehicle_id || "",
      service_description: quotation?.service_description || "",
      parts_description: quotation?.parts_description || "",
      total_amount: quotation?.total_amount || 0,
      supplier: quotation?.supplier || "",
      valid_until: quotation?.valid_until || "",
      notes: quotation?.notes || "",
      status: quotation?.status || "pendente",
    },
  });

  const onSubmit = async (data: QuotationFormData) => {
    try {
      const submitData = {
        ...data,
        created_by: data.client_id, // Temporary - should be current user ID
      };

      if (quotation) {
        await updateQuotation.mutateAsync({ id: quotation.id, ...submitData });
      } else {
        await createQuotation.mutateAsync(submitData as any);
      }
      form.reset();
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao salvar cotação:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gradient-primary hover:opacity-90">
            {quotation ? "Editar Cotação" : "Nova Cotação"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {quotation ? "Editar Cotação" : "Nova Cotação"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="client_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehicle_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Veículo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o veículo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.brand} {vehicle.model} - {vehicle.license_plate}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="aprovada">Aprovada</SelectItem>
                        <SelectItem value="rejeitada">Rejeitada</SelectItem>
                        <SelectItem value="expirada">Expirada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="total_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Total</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="service_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição dos Serviços</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva os serviços a serem realizados..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parts_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição das Peças</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Liste as peças necessárias..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fornecedor</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do fornecedor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valid_until"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Válido Até</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Observações adicionais..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-primary"
                disabled={createQuotation.isPending || updateQuotation.isPending}
              >
                {quotation ? "Atualizar" : "Criar Cotação"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}