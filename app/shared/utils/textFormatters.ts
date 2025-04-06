export const getPluralText = (
  quantity: number,
  singular: string,
  plural: string
): string => {
  return quantity <= 1 ? singular : plural;
};

export const formatPeopleCount = (quantity: number): string => {
  return `${quantity} ${getPluralText(quantity, "pessoa", "pessoas")}`;
};

const weekDayPrepositions: { [key: string]: string } = {
  domingo: "no",
  "segunda-feira": "na",
  "terça-feira": "na",
  "quarta-feira": "na",
  "quinta-feira": "na",
  "sexta-feira": "na",
  sábado: "no",
};

export const formatWeekDay = (day: string): string => {
  const preposition = weekDayPrepositions[day.toLowerCase()] || "no";
  const capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1);
  return `${preposition} ${capitalizedDay}`;
};

export const capitalizeFirstLetter = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};
