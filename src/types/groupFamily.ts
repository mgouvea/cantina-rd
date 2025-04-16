export type GroupFamily = {
  _id?: string;
  name: string;
  members: SelectedMember[];
  owner?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface SelectedMember {
  userId: string;
}

export interface TransferMember {
  userId: string;
  name: string;
}
