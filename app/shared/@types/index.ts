interface IUserData {
  id?: string;
  name: string;
  email: string;
  password: string;
  image?: string;
  sex?: string;
  address: string;
  phone: string;
  birthdate?: string;
}

interface ICardProps {
  item: IListData;
  rating?: { averageRating: number; totalReviews: number };
  onClick: (
    event: React.MouseEvent<HTMLDivElement>,
    id: string | undefined
  ) => void;
  itemType: "restaurant" | "dish";
}

interface ILoginData {
  email: string;
  password: string;
}

interface IEventProps {
  target: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
}

interface IAuthContextData {
  user: IUserData | null;
  token: string | null;
  setUser: (user: IUserData | null) => void;
  setToken: (token: string | null) => void;
}

interface IChildrenProps {
  children: React.ReactNode;
}

interface ICustomInputProps {
  id: string;
  name: string;
  placeholder: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  type: string;
  mask?: (value: string) => string;
}

interface ICustomSelectProps {
  id: string;
  name: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
  options: { value: string; label: string }[];
}

interface IListData {
  id: string;
  name: string;
  image?: string;
  createdAt: string;
  updatedAt?: string;
}

interface IRestaurantData extends IListData {
  address: string;
  phone: string;
  openingTime: string;
  closingTime: string;
}

interface IDishData extends IListData {
  description: string;
  price: number;
  mealType: string;
}

export type {
  IUserData,
  IListData,
  ICardProps,
  IDishData,
  ICustomSelectProps,
  IRestaurantData,
  ICustomInputProps,
  ILoginData,
  IEventProps,
  IAuthContextData,
  IChildrenProps,
};
