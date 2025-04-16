import { UserAdmin } from "@/types";
import { http } from "./api";

export const PostAddAdmin = async (user: UserAdmin) => {
  return (await http.post("admin", user)).data;
};

export const GetAllAdmins = async () => {
  return (await http.get("admin")).data;
};

export const DeleteAdminByUserId = async (userId: string) => {
  return (await http.delete(`admin/user/${userId}`)).data;
};
