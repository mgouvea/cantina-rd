import { http } from "./api";

export const CreateInstance = async () => {
  return (
    await http.post("evolution-whatsapp/create-instance", {
      instanceName: "cantina-rd",
    })
  ).data;
};

export const RestartInstance = async () => {
  return (await http.put("/evolution-whatsapp/restart-instance/cantina-rd"))
    .data;
};

export const GetQRCode = async () => {
  return (
    await http.get("/evolution-whatsapp/qr-code", {
      params: { instanceName: "cantina-rd" },
    })
  ).data;
};

export const CheckConnection = async () => {
  return (await http.get("/evolution-whatsapp/check-connection")).data;
};
