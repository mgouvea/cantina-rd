import {
  GroupFamilyInvoicesOpen,
  MostSoldProducts,
  OpenInvoiceTime,
  PaymentsVsReceives,
  TopClientsDto,
  TotalContents,
} from "@/types";
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

export const GetGroupFamilyInvoicesOpen = async (): Promise<GroupFamilyInvoicesOpen[]> => {
  const url = "dashboard/group-family-open-invoices";
  return (await http.get(url)).data;
};

export const GetOpenInvoiceTime = async (): Promise<OpenInvoiceTime> => {
  const url = "dashboard/open-invoices-time";
  return (await http.get(url)).data;
};

export const GetMostSoldProducts = async (
  startDate?: Date,
  endDate?: Date
): Promise<MostSoldProducts[]> => {
  const queryString = parseDateRange(startDate!, endDate!);
  const url = `dashboard/most-sold-products${queryString ? `?${queryString}` : ""}`;

  return (await http.get(url)).data;
};

export const GetTopClients = async (startDate?: Date, endDate?: Date): Promise<TopClientsDto[]> => {
  const queryString = parseDateRange(startDate!, endDate!);
  const url = `dashboard/top-buyers${queryString ? `?${queryString}` : ""}`;

  return (await http.get(url)).data;
};

export const GetPaymentsVsReceives = async (): Promise<PaymentsVsReceives> => {
  const url = "dashboard/payments-expenses";

  return (await http.get(url)).data;
};
