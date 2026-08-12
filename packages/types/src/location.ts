export type LocationFeature = "drive-through";

export type DayHours = {
  open: string;
  close: string;
};

export type LocationHours = {
  weekday: DayHours;
  weekend: DayHours;
};

export type Location = {
  id: string;
  slug: string;
  name: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  hours: LocationHours;
  isActive: boolean;
  features: LocationFeature[];
};
