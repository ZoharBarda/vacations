export interface Vacation {
  VacationID: number;
  Destination: string;
  Description: string;
  StartDate: string;
  EndDate: string;
  Price: number;
  ImageFileName?: string | null;
  CreatedByUserID?: number;
  likesCount?: number;
  likedByUser?: boolean;
}

export interface VacationFormValues {
  destination: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  imageFile?: File | null;
  imageFileName?: string;
}

export interface VacationsState {
  items: Vacation[];
  loading: boolean;
  error: string | null;
}

export type VacationFilter = "ALL" | "MY_LIKES" | "ACTIVE" | "FUTURE";
