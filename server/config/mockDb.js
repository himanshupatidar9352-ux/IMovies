// In-memory fallback database for instant out-of-the-box operation when MongoDB is not running locally.
const mockData = {
  users: [
    {
      _id: 'user_admin_01',
      name: 'IMovies Admin',
      email: 'admin@imovies.com',
      password: 'admin123',
      phone: '+1 800 555 0199',
      role: 'admin',
    },
    {
      _id: 'user_regular_02',
      name: 'Himanshu Sharma',
      email: 'user@imovies.com',
      password: 'user123',
      phone: '+1 555 012 3456',
      role: 'user',
    },
  ],
  theaters: [
    {
      _id: 'theater_01',
      name: 'PVR ICON Gold Screen',
      city: 'Mumbai',
      address: 'Phoenix Palladium, Lower Parel, Mumbai, Maharashtra 400013',
    },
    {
      _id: 'theater_02',
      name: 'Cinepolis Mega Multiplex',
      city: 'Delhi NCR',
      address: 'DLF Mall of India, Sector 18, Noida, Uttar Pradesh 201301',
    },
    {
      _id: 'theater_03',
      name: 'INOX Luxe Cinema',
      city: 'Bengaluru',
      address: 'Garuda Mall, Magrath Rd, Ashok Nagar, Bengaluru, Karnataka 560025',
    },
  ],
  movies: [
    {
      _id: 'movie_01',
      title: 'Dune: Part Two',
      description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe.',
      genre: ['Sci-Fi', 'Adventure', 'Action'],
      language: ['English', 'Hindi'],
      duration: 166,
      releaseDate: '2024-03-01',
      rating: 8.6,
      certificate: 'UA',
      posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
      trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
      director: 'Denis Villeneuve',
      cast: [
        { name: 'Timothée Chalamet', role: 'Paul Atreides' },
        { name: 'Zendaya', role: 'Chani' },
        { name: 'Austin Butler', role: 'Feyd-Rautha' },
      ],
      status: 'now_showing',
    },
    {
      _id: 'movie_02',
      title: 'Deadpool & Wolverine',
      description: 'Wolverine is recovering from his injuries when he crosses paths with the loudmouth, Deadpool. They team up to defeat a common enemy in a wild multiverse odyssey.',
      genre: ['Action', 'Comedy', 'Sci-Fi'],
      language: ['English', 'Hindi'],
      duration: 128,
      releaseDate: '2024-07-26',
      rating: 8.0,
      certificate: 'A',
      posterUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80',
      trailerUrl: 'https://www.youtube.com/watch?v=73_1biulkYk',
      director: 'Shawn Levy',
      cast: [
        { name: 'Ryan Reynolds', role: 'Deadpool' },
        { name: 'Hugh Jackman', role: 'Wolverine' },
      ],
      status: 'now_showing',
    },
    {
      _id: 'movie_03',
      title: 'Interstellar: 10th Anniversary',
      description: 'When Earth becomes uninhabitable, a team of researchers and astronauts travels through a wormhole in space in an attempt to ensure humanity\'s survival.',
      genre: ['Sci-Fi', 'Drama', 'Adventure'],
      language: ['English'],
      duration: 169,
      releaseDate: '2024-09-27',
      rating: 8.9,
      certificate: 'UA',
      posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
      trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
      director: 'Christopher Nolan',
      cast: [
        { name: 'Matthew McConaughey', role: 'Cooper' },
        { name: 'Anne Hathaway', role: 'Brand' },
      ],
      status: 'now_showing',
    },
    {
      _id: 'movie_04',
      title: 'Gladiator II',
      description: 'Years after witnessing the death of Maximus, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors who lead Rome.',
      genre: ['Action', 'Drama', 'Adventure'],
      language: ['English'],
      duration: 148,
      releaseDate: '2024-11-22',
      rating: 8.4,
      certificate: 'A',
      posterUrl: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
      trailerUrl: 'https://www.youtube.com/watch?v=4rgYUipGJNo',
      director: 'Ridley Scott',
      cast: [
        { name: 'Paul Mescal', role: 'Lucius' },
        { name: 'Denzel Washington', role: 'Macrinus' },
      ],
      status: 'now_showing',
    },
    {
      _id: 'movie_05',
      title: 'Avatar: Fire and Ash',
      description: 'The journey of Jake Sully and Neytiri continues as they encounter the Ash People, a volcanic clan of Na\'vi.',
      genre: ['Sci-Fi', 'Fantasy', 'Action'],
      language: ['English', 'Hindi'],
      duration: 180,
      releaseDate: '2025-12-19',
      rating: 9.1,
      certificate: 'UA',
      posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
      trailerUrl: 'https://www.youtube.com',
      director: 'James Cameron',
      status: 'upcoming',
    },
  ],
  shows: [],
  bookings: [],
};

// Generate shows dynamically for today and upcoming 4 days
const generateInitialShows = () => {
  const getFormattedDate = (offsetDays = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
  };

  const showtimes = ['10:00 AM', '01:30 PM', '05:00 PM', '08:30 PM', '11:15 PM'];
  const generated = [];

  for (let offset = 0; offset <= 3; offset++) {
    const dateStr = getFormattedDate(offset);
    mockData.movies.filter((m) => m.status === 'now_showing').forEach((m) => {
      mockData.theaters.forEach((t) => {
        showtimes.slice(0, 3).forEach((time, idx) => {
          generated.push({
            _id: `show_${m._id}_${t._id}_${offset}_${idx}`,
            movie: m,
            theater: t,
            screenNumber: 1,
            date: dateStr,
            startTime: time,
            format: idx === 0 ? 'IMAX 3D' : '2D',
            pricing: { silver: 180, gold: 260, vip: 420 },
            bookedSeats: idx === 0 ? ['A3', 'A4', 'C5', 'C6', 'D5', 'F3', 'F4'] : ['B2', 'B3'],
          });
        });
      });
    });
  }
  return generated;
};

mockData.shows = generateInitialShows();

// Add initial booking
const sampleShow = mockData.shows[0];
mockData.bookings.push({
  _id: 'booking_sample_01',
  bookingReference: 'IM-DEMO01',
  user: mockData.users[1],
  show: sampleShow,
  movie: sampleShow.movie,
  theater: sampleShow.theater,
  seats: [
    { seatNumber: 'C5', category: 'Gold', price: 260 },
    { seatNumber: 'C6', category: 'Gold', price: 260 },
  ],
  subtotal: 520,
  taxAndFees: 94,
  totalAmount: 614,
  paymentStatus: 'completed',
  bookingStatus: 'confirmed',
  paymentDetails: { method: 'CARD', transactionId: 'TXN_SAMPLE_001' },
  createdAt: new Date().toISOString(),
});

module.exports = mockData;

