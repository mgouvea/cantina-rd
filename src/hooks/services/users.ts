import { GroupFamilyUser, User } from "@/types";
import { http } from ".";

export const PostAddUser = async (user: User) => {
  return (await http.post("users", user)).data;
};

export const UpdateUser = async ({
  user,
  userId,
}: {
  user: Partial<User>;
  userId: string;
}) => {
  return (await http.patch(`users/${userId}`, user)).data;
};

export const DeleteUser = async (userId: string) => {
  return (await http.delete(`users/${userId}`)).data;
};

export const UpdateUserGroupFamily = async ({
  id,
  users,
}: {
  id: string;
  users: GroupFamilyUser[];
}) => {
  return (await http.patch(`users/group-family/${id}`, users)).data;
};

export const GetAllUsers = async () => {
  return (await http.get("users")).data;
};

export const GetUserById = async (id: string) => {
  return (await http.get(`users/${id}`)).data;
};

export const GetAdmins = async () => {
  return (await http.get(`users/gestor`)).data;
};

export const GetGroupFamily = async (groupFamily: string) => {
  return (await http.get(`users/groupFamily/${groupFamily}`)).data;
};
