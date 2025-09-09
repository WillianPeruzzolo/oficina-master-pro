import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import OrdemServico from "./pages/OrdemServico";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="veiculos" element={<Dashboard />} />
            <Route path="os" element={<OrdemServico />} />
            <Route path="estoque" element={<Dashboard />} />
            <Route path="financeiro" element={<Dashboard />} />
            <Route path="cotacoes" element={<Dashboard />} />
            <Route path="agenda" element={<Dashboard />} />
            <Route path="relatorios" element={<Dashboard />} />
            <Route path="configuracoes" element={<Dashboard />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
