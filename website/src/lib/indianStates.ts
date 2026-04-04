export const INDIAN_STATES: Record<string, string[]> = {
  "Delhi": [
    "New Delhi",
    "North Delhi",
    "South Delhi",
    "East Delhi",
    "West Delhi"
  ],
  "Karnataka": [
    "Bengaluru Urban",
    "Bengaluru Rural",
    "Mysuru",
    "Mangaluru"
  ],
  "Kerala": [
    "Ernakulam",
    "Thiruvananthapuram",
    "Kozhikode",
    "Kochi"
  ],
  "Maharashtra": [
    "Mumbai City",
    "Mumbai Suburban",
    "Pune",
    "Nagpur"
  ],
  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Tiruchirappalli"
  ],
  "Telangana": [
    "Hyderabad",
    "Warangal",
    "Nizamabad"
  ]
};

export const ALL_STATES = Object.keys(INDIAN_STATES).sort();
