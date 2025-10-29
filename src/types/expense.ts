
export type Expense = {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  paymentType: "CASH" | "ONLINE";
};

    