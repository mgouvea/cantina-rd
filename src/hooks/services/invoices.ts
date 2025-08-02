import { CreateInvoiceDto } from "@/types/invoice";
import { http } from ".";

export const GetFullInvoice = async (ids: string[]) => {
  return (await http.post("invoices/full", { ids })).data;
};

export const GetInvoice = async () => {
  return (await http.get("invoices")).data;
};

export const CreateInvoice = async (invoice: CreateInvoiceDto) => {
  return (await http.post("invoices", invoice)).data;
};

export const SendInvoiceByWhatsApp = async (invoiceId: string) => {
  return (await http.post(`invoices/${invoiceId}/send-whatsapp`)).data;
};

export const ResetWhatsAppInvoice = async () => {
  return (await http.patch(`invoices/reset-whatsapp`)).data;
};

export const DeleteInvoice = async (invoiceId: string) => {
  return (await http.delete(`invoices/${invoiceId}`)).data;
};
