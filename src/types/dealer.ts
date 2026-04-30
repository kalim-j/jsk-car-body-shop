export type DealerType = "car_dealer" | "spare_parts" | "both";

export interface Dealer {
  id: string;
  name: string;
  owner_name?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  google_maps_url?: string | null;
  dealer_type?: string[];
  specializations?: string[];
  working_hours?: string | null;
  is_verified?: boolean;
  is_active?: boolean;
  years_experience?: number;
  average_rating?: number;
  total_reviews?: number;
  ai_score?: number;
  ai_recommendation_reason?: string | null;
  images?: string[];
  created_at?: string;
  updated_at?: string;

  // Added for Foursquare compatibility
  cleanPhone?: string | null;
  whatsappLink?: string | null;
  callLink?: string | null;
  website?: string | null;
  type?: string;
  lat?: number | null;
  lon?: number | null;
  mapsLink?: string | null;
  rating?: number | string | null;
  totalReviews?: number;
  openNow?: boolean | null;
  photo?: string | null;
  description?: string | null;
  source?: string;
  specialization?: string[];
  carTypes?: string[];
  verified?: boolean;
  status?: string;
  phone2?: string;
  joinedAt?: any;
}

export interface DealerReview {
  id: string;
  dealer_id: string;
  user_name: string;
  rating: number;
  review_text: string | null;
  tags: string[];
  is_verified_purchase: boolean;
  created_at: string;
}

export interface DealerInquiry {
  id: string;
  dealer_id: string;
  inquirer_name: string;
  phone: string;
  message: string | null;
  inquiry_type: "buy" | "sell" | "spare_parts" | "service";
  status: "pending" | "contacted" | "closed";
  created_at: string;
}
