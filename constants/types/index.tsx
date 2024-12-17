export interface IUser {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  phoneNumber: string;
  totalDonations?: number;
}

export type UserPost = Omit<IUser, "_id" | "totalDonations">;
export type User = Omit<IUser, "password">;

export interface ISynagogue {
  _id: string;
  fullName: string;
  affiliation: string;
  address: Address;
  coordinate?: Coordinate;
  prayerTimes: PrayerTimes;
  averageDonations: number;
  donationsCount: number;
}

export type SynagoguePost = Omit<ISynagogue, "_id" | "averageDonations" | "donationsCount">;

export type PrayerDetails = {
  time: string;
  createdAt: Date;
};

type PrayerTimes = {
  shacharit: PrayerDetails[];
  mincha: PrayerDetails[];
  arvit: PrayerDetails[];
};

export interface IDonor {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  phoneNumber: string;
  age: number;
  gender: string;
  familyStatus: string;
  affiliation: string;
  address: Address;
  coordinate?: Coordinate;
  averageDonations: number;
}

export type DonorPost = Omit<IDonor, "_id" | "averageDonations">;

export interface IDonation {
  _id: string;
  amount: number;
  method: string;
  frequency: string;
  numOfMonths: number;
  notes: string;
  createdAt: Date;
  donorType: string;
  donor?: IDonor | ISynagogue;
  donorId: string;
}

export type DonationPost = Omit<IDonation, "_id" | "createdAt">;

export type Address = {
  country: string;
  city: string;
  street: string;
  building: string;
  apartment?: number;
};

export type Coordinate = {
  type: string;
  coordinates: Array<number>;
};
