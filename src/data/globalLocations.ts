export const globalCities = [
  // Asia-Pacific
  "Mumbai, India",
  "Delhi, India", 
  "Bangalore, India",
  "Hyderabad, India",
  "Chennai, India",
  "Pune, India",
  "Kolkata, India",
  "Ahmedabad, India",
  "Tokyo, Japan",
  "Seoul, South Korea",
  "Singapore, Singapore",
  "Bangkok, Thailand",
  "Manila, Philippines",
  "Jakarta, Indonesia",
  "Kuala Lumpur, Malaysia",
  "Ho Chi Minh City, Vietnam",
  "Hong Kong, Hong Kong",
  "Taipei, Taiwan",
  "Shanghai, China",
  "Beijing, China",
  "Shenzhen, China",
  "Sydney, Australia",
  "Melbourne, Australia",
  "Brisbane, Australia",
  "Perth, Australia",
  "Auckland, New Zealand",
  
  // Europe
  "London, United Kingdom",
  "Berlin, Germany",
  "Munich, Germany",
  "Frankfurt, Germany",
  "Paris, France",
  "Amsterdam, Netherlands",
  "Stockholm, Sweden",
  "Copenhagen, Denmark",
  "Oslo, Norway",
  "Helsinki, Finland",
  "Zurich, Switzerland",
  "Geneva, Switzerland",
  "Vienna, Austria",
  "Dublin, Ireland",
  "Barcelona, Spain",
  "Madrid, Spain",
  "Milan, Italy",
  "Rome, Italy",
  "Warsaw, Poland",
  "Prague, Czech Republic",
  "Budapest, Hungary",
  "Bucharest, Romania",
  "Sofia, Bulgaria",
  "Athens, Greece",
  "Lisbon, Portugal",
  "Brussels, Belgium",
  "Luxembourg, Luxembourg",
  
  // North America
  "New York, USA",
  "San Francisco, USA",
  "Los Angeles, USA",
  "Chicago, USA",
  "Boston, USA",
  "Seattle, USA",
  "Austin, USA",
  "Denver, USA",
  "Atlanta, USA",
  "Miami, USA",
  "Dallas, USA",
  "Houston, USA",
  "Phoenix, USA",
  "San Diego, USA",
  "Portland, USA",
  "Washington DC, USA",
  "Philadelphia, USA",
  "Detroit, USA",
  "Minneapolis, USA",
  "Nashville, USA",
  "Toronto, Canada",
  "Vancouver, Canada",
  "Montreal, Canada",
  "Calgary, Canada",
  "Ottawa, Canada",
  "Mexico City, Mexico",
  "Guadalajara, Mexico",
  
  // South America
  "São Paulo, Brazil",
  "Rio de Janeiro, Brazil",
  "Buenos Aires, Argentina",
  "Santiago, Chile",
  "Lima, Peru",
  "Bogotá, Colombia",
  "Caracas, Venezuela",
  "Montevideo, Uruguay",
  "Quito, Ecuador",
  "La Paz, Bolivia",
  
  // Middle East & Africa
  "Dubai, UAE",
  "Abu Dhabi, UAE",
  "Doha, Qatar",
  "Riyadh, Saudi Arabia",
  "Kuwait City, Kuwait",
  "Tel Aviv, Israel",
  "Istanbul, Turkey",
  "Cairo, Egypt",
  "Lagos, Nigeria",
  "Johannesburg, South Africa",
  "Cape Town, South Africa",
  "Nairobi, Kenya",
  "Casablanca, Morocco",
  "Tunis, Tunisia",
  
  // Remote/Virtual
  "Remote",
  "Remote - Global",
  "Remote - Americas",
  "Remote - Europe",
  "Remote - Asia Pacific",
  "Hybrid",
  "Work From Home"
];

export const getRandomGlobalCity = () => {
  return globalCities[Math.floor(Math.random() * globalCities.length)];
};

export const getJobLocationsFromData = (jobs: any[]) => {
  const locations = jobs
    .map(job => job.location)
    .filter(location => location && location.trim() !== "")
    .reduce((unique: string[], location: string) => {
      if (!unique.includes(location)) {
        unique.push(location);
      }
      return unique;
    }, []);
  
  return locations.sort();
};

export const getFilteredGlobalCities = (searchTerm: string = "") => {
  if (!searchTerm) return globalCities.slice(0, 50); // Return first 50 for performance
  
  const filtered = globalCities.filter(city => 
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return filtered.slice(0, 20); // Limit to 20 results
};