import { CreateInvoiceVisitorsDto } from "@/types";
import { http } from ".";

export const GetFullInvoiceVisitors = async (ids: string[]) => {
  return (await http.post("visitors-invoice/full", { ids })).data;
};

export const GetInvoiceVisitors = async () => {
  return (await http.get("visitors-invoice")).data;
};

export const CreateInvoiceVisitors = async (
  invoice: CreateInvoiceVisitorsDto
) => {
  return (await http.post("visitors-invoice", invoice)).data;
};

export const SendInvoiceVisitorsByWhatsApp = async (invoiceId: string) => {
  return (await http.post(`visitors-invoice/${invoiceId}/send-whatsapp`)).data;
};

export const DeleteInvoiceVisitors = async (invoiceId: string) => {
  return (await http.delete(`visitors-invoice/${invoiceId}`)).data;
};
