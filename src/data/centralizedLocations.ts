// Centralized location data for the entire application

export const indianCities = [
  // Major Metro Cities
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad",
  // Tier 1 Cities  
  "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam",
  "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut",
  "Rajkot", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Allahabad",
  "Ranchi", "Coimbatore", "Jabalpur", "Gwalior", "Vijayawada", "Jodhpur", "Madurai",
  // Tier 2 Cities
  "Raipur", "Kota", "Guwahati", "Chandigarh", "Solapur", "Hubli", "Mysore", "Tiruchirappalli",
  "Bareilly", "Aligarh", "Tiruppur", "Moradabad", "Jalandhar", "Bhubaneswar", "Salem",
  "Warangal", "Guntur", "Bikaner", "Noida", "Gurugram", "Dehradun", "Mangalore", "Kochi",
  "Thiruvananthapuram", "Kozhikode", "Thrissur"
];

export const globalCities = [
  // India
  ...indianCities,
  // Remote Options
  "Remote", "Work From Home", "Hybrid", "Remote - India", "Remote - Worldwide",
  // Middle East
  "Dubai, UAE", "Abu Dhabi, UAE", "Sharjah, UAE", "Doha, Qatar", "Riyadh, Saudi Arabia",
  "Jeddah, Saudi Arabia", "Kuwait City, Kuwait", "Manama, Bahrain", "Muscat, Oman",
  // Southeast Asia
  "Singapore", "Kuala Lumpur, Malaysia", "Bangkok, Thailand", "Jakarta, Indonesia",
  "Manila, Philippines", "Ho Chi Minh City, Vietnam", "Hanoi, Vietnam",
  // USA
  "New York, USA", "San Francisco, USA", "Los Angeles, USA", "Seattle, USA", "Austin, USA",
  "Boston, USA", "Chicago, USA", "Denver, USA", "Atlanta, USA", "Dallas, USA", "Miami, USA",
  // UK & Europe
  "London, UK", "Manchester, UK", "Edinburgh, UK", "Berlin, Germany", "Munich, Germany",
  "Amsterdam, Netherlands", "Paris, France", "Dublin, Ireland", "Zurich, Switzerland",
  "Stockholm, Sweden", "Copenhagen, Denmark", "Barcelona, Spain", "Madrid, Spain",
  // Canada
  "Toronto, Canada", "Vancouver, Canada", "Montreal, Canada", "Calgary, Canada",
  // Australia & NZ
  "Sydney, Australia", "Melbourne, Australia", "Brisbane, Australia", "Auckland, New Zealand",
  // Asia Pacific
  "Tokyo, Japan", "Hong Kong", "Seoul, South Korea", "Shanghai, China", "Beijing, China",
  "Shenzhen, China", "Taipei, Taiwan"
];

export const countries = [
  "India", "United States", "United Kingdom", "Canada", "Australia", "Germany",
  "Singapore", "UAE", "Netherlands", "France", "Ireland", "Switzerland",
  "Japan", "South Korea", "Malaysia", "New Zealand", "Sweden", "Denmark", "Spain"
];

export const statesByCountry: Record<string, string[]> = {
  "India": [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Chandigarh"
  ],
  "United States": [
    "California", "Texas", "New York", "Florida", "Illinois", "Pennsylvania",
    "Ohio", "Georgia", "North Carolina", "Michigan", "New Jersey", "Virginia",
    "Washington", "Massachusetts", "Arizona", "Colorado", "Tennessee", "Maryland"
  ],
  "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
  "Canada": ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba", "Saskatchewan"],
  "Australia": ["New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia"],
  "Germany": ["Bavaria", "Berlin", "Hamburg", "Hesse", "North Rhine-Westphalia", "Baden-Württemberg"],
  "UAE": ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"]
};

export const citiesByState: Record<string, string[]> = {
  // India
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Navi Mumbai"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tiruppur"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
  "Delhi": ["New Delhi", "Central Delhi", "South Delhi", "North Delhi", "East Delhi", "West Delhi"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Bhavnagar"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Noida", "Allahabad"],
  "Kerala": ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Kollam"],
  "Punjab": ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
  "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal", "Rohtak"],
  // USA
  "California": ["San Francisco", "Los Angeles", "San Diego", "San Jose", "Sacramento", "Oakland"],
  "Texas": ["Austin", "Dallas", "Houston", "San Antonio", "Fort Worth", "El Paso"],
  "New York": ["New York City", "Buffalo", "Rochester", "Albany", "Syracuse"],
  "Washington": ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue", "Redmond"],
  "Massachusetts": ["Boston", "Cambridge", "Worcester", "Springfield", "Lowell"],
  // UK
  "England": ["London", "Manchester", "Birmingham", "Liverpool", "Leeds", "Bristol", "Cambridge", "Oxford"],
  "Scotland": ["Edinburgh", "Glasgow", "Aberdeen", "Dundee"],
  // UAE
  "Dubai": ["Dubai City", "Dubai Marina", "Downtown Dubai", "Business Bay", "JLT"],
  "Abu Dhabi": ["Abu Dhabi City", "Al Ain", "Khalifa City"],
  // Canada
  "Ontario": ["Toronto", "Ottawa", "Mississauga", "Hamilton", "Brampton", "Waterloo"],
  "British Columbia": ["Vancouver", "Victoria", "Burnaby", "Surrey", "Richmond"],
  // Australia
  "New South Wales": ["Sydney", "Newcastle", "Wollongong", "Central Coast"],
  "Victoria": ["Melbourne", "Geelong", "Ballarat", "Bendigo"]
};

// Helper functions
export const getStatesForCountry = (country: string): string[] => {
  return statesByCountry[country] || [];
};

export const getCitiesForState = (state: string): string[] => {
  return citiesByState[state] || [];
};

export const getJobLocations = (): string[] => {
  return globalCities;
};

// Alias for backwards compatibility
export { globalCities as allLocations };
