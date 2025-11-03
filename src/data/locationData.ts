export const countries = [
  "United States",
  "India",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Singapore",
  "UAE",
  "Japan",
  "China",
  "Brazil",
  "Mexico",
  "South Africa",
  "Remote - Global"
];

export const statesByCountry: { [key: string]: string[] } = {
  "United States": [
    "California", "New York", "Texas", "Florida", "Illinois", "Pennsylvania",
    "Ohio", "Georgia", "North Carolina", "Michigan", "New Jersey", "Virginia",
    "Washington", "Arizona", "Massachusetts", "Tennessee", "Indiana", "Missouri",
    "Maryland", "Wisconsin", "Colorado", "Minnesota", "South Carolina", "Alabama"
  ],
  "India": [
    "Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", "Uttar Pradesh",
    "West Bengal", "Gujarat", "Telangana", "Rajasthan", "Kerala",
    "Madhya Pradesh", "Punjab", "Haryana", "Bihar", "Andhra Pradesh"
  ],
  "United Kingdom": [
    "England", "Scotland", "Wales", "Northern Ireland"
  ],
  "Canada": [
    "Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba",
    "Saskatchewan", "Nova Scotia", "New Brunswick", "Newfoundland and Labrador"
  ],
  "Australia": [
    "New South Wales", "Victoria", "Queensland", "Western Australia",
    "South Australia", "Tasmania", "Australian Capital Territory", "Northern Territory"
  ],
  "Germany": [
    "Bavaria", "North Rhine-Westphalia", "Baden-Württemberg", "Lower Saxony",
    "Hesse", "Saxony", "Rhineland-Palatinate", "Berlin", "Hamburg", "Bremen"
  ],
  "Remote - Global": ["Remote"]
};

export const citiesByState: { [key: string]: string[] } = {
  // United States
  "California": ["San Francisco", "Los Angeles", "San Diego", "San Jose", "Sacramento", "Oakland", "Fresno"],
  "New York": ["New York City", "Buffalo", "Rochester", "Albany", "Syracuse"],
  "Texas": ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth", "El Paso"],
  "Florida": ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale"],
  "Illinois": ["Chicago", "Aurora", "Naperville", "Joliet", "Rockford"],
  "Washington": ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue"],
  "Massachusetts": ["Boston", "Worcester", "Springfield", "Cambridge", "Lowell"],
  "Colorado": ["Denver", "Colorado Springs", "Aurora", "Boulder", "Fort Collins"],
  
  // India
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  "Delhi": ["New Delhi", "Delhi"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri"],
  "Punjab": ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
  "Haryana": ["Gurgaon", "Faridabad", "Panipat", "Ambala", "Karnal"],
  "Uttar Pradesh": ["Noida", "Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi"],
  "Kerala": ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Kollam"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati"],
  
  // United Kingdom
  "England": ["London", "Manchester", "Birmingham", "Leeds", "Liverpool", "Bristol", "Newcastle", "Sheffield"],
  "Scotland": ["Edinburgh", "Glasgow", "Aberdeen", "Dundee"],
  "Wales": ["Cardiff", "Swansea", "Newport"],
  "Northern Ireland": ["Belfast", "Derry", "Lisburn"],
  
  // Canada
  "Ontario": ["Toronto", "Ottawa", "Mississauga", "Brampton", "Hamilton", "London"],
  "Quebec": ["Montreal", "Quebec City", "Laval", "Gatineau"],
  "British Columbia": ["Vancouver", "Victoria", "Kelowna", "Abbotsford"],
  "Alberta": ["Calgary", "Edmonton", "Red Deer", "Lethbridge"],
  
  // Australia
  "New South Wales": ["Sydney", "Newcastle", "Wollongong", "Central Coast"],
  "Victoria": ["Melbourne", "Geelong", "Ballarat", "Bendigo"],
  "Queensland": ["Brisbane", "Gold Coast", "Sunshine Coast", "Townsville"],
  "Western Australia": ["Perth", "Fremantle", "Bunbury"],
  
  // Remote
  "Remote": ["Work From Home", "Remote Position"]
};

export const getStatesForCountry = (country: string): string[] => {
  return statesByCountry[country] || [];
};

export const getCitiesForState = (state: string): string[] => {
  return citiesByState[state] || [];
};
