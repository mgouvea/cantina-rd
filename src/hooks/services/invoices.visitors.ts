import { CreateInvoiceVisitorsDto } from "@/types";
import { http } from ".";

export const GetFullInvoiceVisitors = async (
  ids: string[],
  isArchivedInvoice: "true" | "false" | "all"
) => {
  return (await http.post("visitors-invoice/full", { ids, isArchivedInvoice })).data;
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
export const ResetWhatsAppVisitorsInvoice = async () => {
  return (await http.patch(`visitors-invoice/reset-whatsapp`)).data;
};

export const DeleteInvoiceVisitors = async (invoiceId: string) => {
  return (await http.delete(`visitors-invoice/${invoiceId}`)).data;
};
