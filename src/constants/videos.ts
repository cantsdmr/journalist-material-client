export interface Video {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  tags: string[];
  ethicValue: number;
  fund: number;
}

export const allVideos: Video[] = [
  { id: 1, title: "News Summary - May 15, 2024", description: "Let's take a look at what the newspapers are reporting today.\nTheme music by: John Doe", thumbnail: "https://via.placeholder.com/150", tags: ["news", "summary", "daily", "headlines"], ethicValue: 4.5, fund: 1200 },
  { id: 2, title: "Tech Innovations 2024", description: "The latest innovations in technology for the year 2024.", thumbnail: "https://via.placeholder.com/150", tags: ["tech", "innovation", "2024"], ethicValue: 4.0, fund: 500 },
  { id: 3, title: "Health Tips for a Better Life", description: "Simple and effective health tips for a better and healthier life.", thumbnail: "https://via.placeholder.com/150", tags: ["health", "tips", "lifestyle"], ethicValue: 3.5, fund: 800 },
  { id: 4, title: "Exploring the Universe", description: "Join us as we explore the vastness of the universe.", thumbnail: "https://via.placeholder.com/150", tags: ["space", "universe", "exploration"], ethicValue: 5.0, fund: 1500 },
  { id: 5, title: "Cooking Masterclass", description: "Learn to cook like a master chef with these simple recipes.", thumbnail: "https://via.placeholder.com/150", tags: ["cooking", "recipes", "masterclass"], ethicValue: 4.8, fund: 700 },
  { id: 6, title: "Travel Guide 2024", description: "Top travel destinations to explore in 2024.", thumbnail: "https://via.placeholder.com/150", tags: ["travel", "guide", "2024"], ethicValue: 4.3, fund: 900 },
  { id: 7, title: "Financial Advice for Millennials", description: "Practical financial advice for millennials.", thumbnail: "https://via.placeholder.com/150", tags: ["finance", "advice", "millennials"], ethicValue: 4.1, fund: 1100 },
  { id: 8, title: "Fitness Routine for Busy People", description: "A quick and effective fitness routine for busy individuals.", thumbnail: "https://via.placeholder.com/150", tags: ["fitness", "routine", "busy"], ethicValue: 3.8, fund: 600 },
  { id: 9, title: "The History of Music", description: "An in-depth look at the history of music.", thumbnail: "https://via.placeholder.com/150", tags: ["music", "history"], ethicValue: 5.0, fund: 1300 },
  { id: 10, title: "Gardening Tips for Beginners", description: "Essential gardening tips for those just starting out.", thumbnail: "https://via.placeholder.com/150", tags: ["gardening", "tips", "beginners"], ethicValue: 4.7, fund: 400 },
  { id: 11, title: "DIY Home Projects", description: "Fun and easy DIY projects to improve your home.", thumbnail: "https://via.placeholder.com/150", tags: ["DIY", "home", "projects"], ethicValue: 3.9, fund: 200 },
  { id: 12, title: "Learning a New Language", description: "Tips and tricks for learning a new language quickly.", thumbnail: "https://via.placeholder.com/150", tags: ["language", "learning"], ethicValue: 4.6, fund: 1000 },
  { id: 13, title: "Mindfulness and Meditation", description: "The benefits of mindfulness and meditation for mental health.", thumbnail: "https://via.placeholder.com/150", tags: ["mindfulness", "meditation", "mental health"], ethicValue: 4.9, fund: 2500 },
  { id: 14, title: "Automotive Trends 2024", description: "The latest trends in the automotive industry.", thumbnail: "https://via.placeholder.com/150", tags: ["automotive", "trends", "2024"], ethicValue: 4.2, fund: 300 },
  { id: 15, title: "Fashion Trends for Spring", description: "The hottest fashion trends for the upcoming spring season.", thumbnail: "https://via.placeholder.com/150", tags: ["fashion", "spring", "trends"], ethicValue: 4.4, fund: 450 },
  { id: 16, title: "Book Recommendations", description: "Top book recommendations for your reading list.", thumbnail: "https://via.placeholder.com/150", tags: ["books", "recommendations"], ethicValue: 4.7, fund: 150 },
  { id: 17, title: "Pet Care 101", description: "Basic pet care tips for new pet owners.", thumbnail: "https://via.placeholder.com/150", tags: ["pets", "care", "tips"], ethicValue: 4.3, fund: 230 },
  { id: 18, title: "Sustainable Living", description: "How to live a more sustainable and eco-friendly life.", thumbnail: "https://via.placeholder.com/150", tags: ["sustainability", "eco-friendly", "living"], ethicValue: 5.0, fund: 750 },
  { id: 19, title: "Interior Design Ideas", description: "Creative interior design ideas for your home.", thumbnail: "https://via.placeholder.com/150", tags: ["interior design", "ideas"], ethicValue: 4.1, fund: 980 },
  { id: 20, title: "Understanding Cryptocurrencies", description: "A beginner's guide to understanding cryptocurrencies.", thumbnail: "https://via.placeholder.com/150", tags: ["cryptocurrency", "guide"], ethicValue: 4.5, fund: 650 },
  { id: 21, title: "Title 21", description: "Description 21", thumbnail: "https://via.placeholder.com/150", tags: ["tag21"], ethicValue: 4.5, fund: 650 },
  { id: 22, title: "Title 22", description: "Description 22", thumbnail: "https://via.placeholder.com/150", tags: ["tag22"], ethicValue: 4.5, fund: 650 },
  { id: 23, title: "Title 23", description: "Description 23", thumbnail: "https://via.placeholder.com/150", tags: ["tag23"], ethicValue: 4.5, fund: 650 },
  { id: 24, title: "Title 24", description: "Description 24", thumbnail: "https://via.placeholder.com/150", tags: ["tag24"], ethicValue: 4.5, fund: 650 },
  { id: 25, title: "Title 25", description: "Description 25", thumbnail: "https://via.placeholder.com/150", tags: ["tag25"], ethicValue: 4.5, fund: 650 },
];
