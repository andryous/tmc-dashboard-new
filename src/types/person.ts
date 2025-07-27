export type Person = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  personRole: "CUSTOMER" | "CONSULTANT";
  archived: boolean; 
};