import { useQuery } from "@tanstack/react-query";
import {
  GetGroupFamilyInvoicesOpen,
  GetMostSoldProducts,
  GetOpenInvoiceTime,
  GetPaymentsVsReceives,
  GetTopClients,
  GetTotalContents,
} from "../services/dashboard";

export const useTotalContents = (startDate?: Date, endDate?: Date) => {
  return useQuery({
    queryKey: ["total-contents", startDate?.toISOString(), endDate?.toISOString()],
    queryFn: () => GetTotalContents(startDate, endDate),
    retry: 1,
    staleTime: 1000 * 60 * 60 * 12,
    gcTime: 1000 * 60 * 60 * 24,
  });
};

export const useGroupFamilyInvoicesOpen = () => {
  return useQuery({
    queryKey: ["group-family-invoices-open"],
    queryFn: () => GetGroupFamilyInvoicesOpen(),
    retry: 1,
    staleTime: 1000 * 60 * 60 * 12,
    gcTime: 1000 * 60 * 60 * 24,
  });
};

export const useMostSoldProducts = (startDate?: Date, endDate?: Date) => {
  return useQuery({
    queryKey: ["most-sold-products", startDate?.toISOString(), endDate?.toISOString()],
    queryFn: () => GetMostSoldProducts(startDate, endDate),
    retry: 1,
    staleTime: 1000 * 60 * 60 * 12,
    gcTime: 1000 * 60 * 60 * 24,
  });
};

export const useTopClients = (startDate?: Date, endDate?: Date) => {
  return useQuery({
    queryKey: ["top-clients", startDate?.toISOString(), endDate?.toISOString()],
    queryFn: () => GetTopClients(startDate, endDate),
    retry: 1,
    staleTime: 1000 * 60 * 60 * 12,
    gcTime: 1000 * 60 * 60 * 24,
  });
};

export const usePaymentsVsReceives = () => {
  return useQuery({
    queryKey: ["payments-vs-receives"],
    queryFn: () => GetPaymentsVsReceives(),
    retry: 1,
    staleTime: 1000 * 60 * 60 * 12,
    gcTime: 1000 * 60 * 60 * 24,
  });
};

export const useOpenInvoiceTime = () => {
  return useQuery({
    queryKey: ["invoiceInTime"],
    queryFn: () => GetOpenInvoiceTime(),
    retry: 1,
    staleTime: 1000 * 60 * 60 * 12,
    gcTime: 1000 * 60 * 60 * 24,
  });
};
