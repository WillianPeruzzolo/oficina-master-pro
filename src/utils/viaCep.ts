import { withLogging } from './logger';

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export interface AddressData {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
}

export const fetchAddressByCep = async (cep: string): Promise<AddressData | null> => {
  console.log('[ViaCEP] Consultando CEP:', cep);
  
  const cleanCep = cep.replace(/\D/g, '');
  
  if (cleanCep.length !== 8) {
    throw new Error('CEP deve ter 8 dígitos');
  }

  const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
  
  if (!response.ok) {
    throw new Error('Erro ao consultar CEP');
  }

  const data: ViaCepResponse = await response.json();
  
  if (data.erro) {
    throw new Error('CEP não encontrado');
  }

  console.log('[ViaCEP] CEP encontrado:', data);

  return {
    street: data.logradouro,
    neighborhood: data.bairro,
    city: data.localidade,
    state: data.uf,
    cep: data.cep
  };
};