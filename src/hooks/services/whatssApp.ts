import { http } from "./api";

export const GenerateNewQRCode = async () => {
  return (await http.post("whatsapp/generate-qrcode")).data;
};

export const GetCurrentQRCode = async () => {
  return (await http.get("whatsapp/qrcode")).data;
};
