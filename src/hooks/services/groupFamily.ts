import { GroupFamily, SelectedMember } from "@/types";
import { http } from "./api";

export const PostAddGroupFamily = async (groupFamily: GroupFamily) => {
  return (await http.post("group-family", groupFamily)).data;
};

export const GetAllGroupFamilies = async () => {
  return (await http.get("group-family")).data;
};

export const UpdateGroupFamily = async ({
  groupFamily,
  id,
}: {
  groupFamily: Partial<GroupFamily>;
  id: string;
}) => {
  return (await http.patch(`group-family/${id}`, groupFamily)).data;
};

export const AddMember = async ({
  id,
  AddMember,
}: {
  id: string;
  AddMember: SelectedMember[];
}) => {
  return (await http.patch(`group-family/add-member/${id}`, AddMember)).data;
};

export const RemoveMember = async ({ id }: { id: string }) => {
  return (await http.patch(`group-family/remove-member/${id}`)).data;
};

export const DeleteGroupFamily = async (id: string) => {
  return (await http.delete(`group-family/${id}`)).data;
};
