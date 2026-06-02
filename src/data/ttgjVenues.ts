import { generatedTTGJVenues } from './ttgjVenues.generated';

export interface TTGJVenue {
  sourceId: string;
  name: string;
  nameJapanese: string;
  category: string;
  address: string;
  city: string;
  prefecture: string;
  postalCode: string;
  latitude: number | null;
  longitude: number | null;
  phone: string;
  website: string;
  imageUrl?: string;
  email: string;
  hours: string;
  description: string;
  specialties: string[];
  englishFriendly: string;
  priceRange: string;
  social: string;
  notes: string;
  status: string;
}

export const ttgjVenues = generatedTTGJVenues;
