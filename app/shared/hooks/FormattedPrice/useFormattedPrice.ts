import { useMemo } from "react";

const useFormattedPrice = (
  price: number,
  locale: string = "pt-BR",
  currency: string = "BRL"
) => {
  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(price);
  }, [price, locale, currency]);

  return formattedPrice;
};

export default useFormattedPrice;
