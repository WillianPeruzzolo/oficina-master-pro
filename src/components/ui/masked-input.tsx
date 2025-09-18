import React from 'react';
import { Input } from './input';
import { masks } from '@/utils/masks';

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask: 'phone' | 'cep' | 'cpf' | 'cnpj' | 'licensePlate';
  onValueChange?: (value: string) => void;
}

export const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask, onValueChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const maskedValue = masks[mask](e.target.value);
      e.target.value = maskedValue;
      
      onValueChange?.(maskedValue);
      onChange?.(e);
    };

    return (
      <Input
        {...props}
        ref={ref}
        onChange={handleChange}
      />
    );
  }
);

MaskedInput.displayName = 'MaskedInput';