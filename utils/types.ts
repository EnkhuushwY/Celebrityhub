// types.ts
export type FriendRequest = {
  id?: string; // Firestore document ID (optional)
  fromUid: string;
  toUid: string;
  status: "pending" | "accepted" | "ignored";
  createdAt: any;
  fromUsername?: string;
  fromPhoto?: string;
  toUsername?: string;
  toPhoto?: string;
};

export type SendFriendRequestParams = {
  toUid: string;
  toUsername?: string;
  toPhoto?: string;
};
