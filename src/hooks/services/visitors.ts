import { http } from ".";
import { Visitor } from "@/types";

export const PostAddVisitor = async (visitor: Visitor) => {
  return (await http.post("visitors", visitor)).data;
};

export const UpdateVisitor = async ({
  visitorPayload,
  visitorId,
}: {
  visitorPayload: Partial<Visitor>;
  visitorId: string;
}) => {
  return (await http.patch(`visitors/${visitorId}`, visitorPayload)).data;
};

export const DeleteVisitor = async (visitorId: string) => {
  return (await http.delete(`visitors/${visitorId}`)).data;
};

export const GetAllVisitors = async () => {
  return (await http.get("visitors")).data;
};
