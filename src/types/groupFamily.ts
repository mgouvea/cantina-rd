export type GroupFamily = {
  _id?: string;
  name: string;
  members: SelectedMember[];
  owner?: string;
  ownerName?: string;
  ownerAvatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type GroupFamilyWithOwner = {
  _id?: string;
  name: string;
  ownerName: string;
  ownerAvatar: string;
};

export interface SelectedMember {
  userId: string;
  memberName: string;
  memberAvatar: string;
}

export interface TransferMember {
  userId: string;
  name: string;
}
