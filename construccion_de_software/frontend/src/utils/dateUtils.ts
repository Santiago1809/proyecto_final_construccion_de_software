import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, "dd/MM/yyyy", { locale: es });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

export const formatDateTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, "dd/MM/yyyy HH:mm", { locale: es });
  } catch (error) {
    console.error("Error formatting date time:", error);
    return dateString;
  }
};
