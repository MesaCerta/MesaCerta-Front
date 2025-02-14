export const cnpjMask = (value: string): string => {
    const numericValue = value.replace(/\D/g, '');
  
    return numericValue
      .replace(/^(\d{2})(\d)/, '$1.$2')       
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3') 
      .replace(/\.(\d{3})(\d)/, '.$1/$2')       
      .replace(/(\d{4})(\d)/, '$1-$2')          
      .slice(0, 18);                           
  };
  