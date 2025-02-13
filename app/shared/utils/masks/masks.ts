export const phoneMask = (value: string): string => {
  const numericValue = value.replace(/\D/g, '');

  return numericValue
    .replace(/(\d{2})(\d)/, '($1) $2') 
    .replace(/(\d{5})(\d)/, '$1-$2') 
    .slice(0, 15); 
};
