export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: "ACTIVE" | "FINISHED";
  createdAt: string;
};
