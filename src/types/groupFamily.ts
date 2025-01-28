export type groupFamily = {
  _id?: string;
  name: string;
  members: SelectedMember[];
  owner?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

interface SelectedMember {
  userId: string;
  name: string;
}
