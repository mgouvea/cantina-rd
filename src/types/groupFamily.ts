export type groupFamily = {
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
