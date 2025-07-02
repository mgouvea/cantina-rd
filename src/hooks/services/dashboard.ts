import { TotalContents } from "@/types";
import { http } from "./api";

export const GetTotalContents = async (
  startDate?: Date,
  endDate?: Date
): Promise<TotalContents> => {
  // Construir os parâmetros de query se as datas forem fornecidas
  const params = new URLSearchParams();

  if (startDate) {
    params.append("startDate", startDate.toISOString());
  }

  if (endDate) {
    params.append("endDate", endDate.toISOString());
  }

  const queryString = params.toString();
  const url = `dashboard/total-contents${queryString ? `?${queryString}` : ""}`;

  return (await http.get(url)).data;
};
