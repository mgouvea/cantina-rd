import { GroupFamilyInvoicesOpen, TotalContents } from "@/types";
import { http } from "./api";
import { parseDateRange } from "@/utils";

export const GetTotalContents = async (
  startDate?: Date,
  endDate?: Date
): Promise<TotalContents> => {
  const queryString = parseDateRange(startDate!, endDate!);
  const url = `dashboard/total-contents${queryString ? `?${queryString}` : ""}`;

  return (await http.get(url)).data;
};

export const GetGroupFamilyInvoicesOpen = async (
  startDate?: Date,
  endDate?: Date
): Promise<GroupFamilyInvoicesOpen[]> => {
  const queryString = parseDateRange(startDate!, endDate!);
  const url = `dashboard/group-family-open-invoices${
    queryString ? `?${queryString}` : ""
  }`;

  return (await http.get(url)).data;
};
