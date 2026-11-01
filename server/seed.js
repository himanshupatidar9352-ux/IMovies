require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Movie = require('./models/Movie');
const Theater = require('./models/Theater');
const Show = require('./models/Show');
const Booking = require('./models/Booking');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/imovies');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing collections
    await User.deleteMany();
    await Movie.deleteMany();
    await Theater.deleteMany();
    await Show.deleteMany();
    await Booking.deleteMany();
    console.log('Cleared existing data.');

    // 1. Create Users
    const users = await User.create([
      {
        name: 'IMovies Admin',
        email: 'admin@imovies.com',
        password: 'admin123',
        phone: '+1 800 555 0199',
        role: 'admin',
      },
      {
        name: 'Himanshu Sharma',
        email: 'user@imovies.com',
        password: 'user123',
        phone: '+1 555 012 3456',
        role: 'user',
      },
    ]);
    console.log('✅ Seeded Users: admin@imovies.com / admin123 and user@imovies.com / user123');

    // 2. Create Theaters
    const theaters = await Theater.create([
      {
        name: 'PVR ICON Gold Screen',
        city: 'Mumbai',
        address: 'Phoenix Palladium, Lower Parel, Mumbai, Maharashtra 400013',
        screens: [
          { screenNumber: 1, name: 'Audi 1 - IMAX Laser', screenType: 'IMAX 3D', totalSeats: 60 },
          { screenNumber: 2, name: 'Audi 2 - Dolby Atmos', screenType: '4DX', totalSeats: 60 },
        ],
      },
      {
        name: 'Cinepolis Mega Multiplex',
        city: 'Delhi NCR',
        address: 'DLF Mall of India, Sector 18, Noida, Uttar Pradesh 201301',
        screens: [
          { screenNumber: 1, name: 'Screen 1 - 4DX Real', screenType: '4DX', totalSeats: 60 },
          { screenNumber: 2, name: 'Screen 2 - VIP Royale', screenType: '2D', totalSeats: 60 },
        ],
      },
      {
        name: 'INOX Luxe Cinema',
        city: 'Bengaluru',
        address: 'Garuda Mall, Magrath Rd, Ashok Nagar, Bengaluru, Karnataka 560025',
        screens: [
          { screenNumber: 1, name: 'Screen 1 - IMAX', screenType: 'IMAX 3D', totalSeats: 60 },
        ],
      },
    ]);
    console.log(`✅ Seeded ${theaters.length} Theaters`);

    // 3. Create Movies
    const movies = await Movie.create([
      {
        title: 'Dune: Part Two',
        description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe.',
        genre: ['Sci-Fi', 'Adventure', 'Action'],
        language: ['English', 'Hindi'],
        duration: 166,
        releaseDate: new Date('2024-03-01'),
        rating: 8.6,
        certificate: 'UA',
        posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
        trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
        director: 'Denis Villeneuve',
        cast: [
          { name: 'Timothée Chalamet', role: 'Paul Atreides' },
          { name: 'Zendaya', role: 'Chani' },
          { name: 'Rebecca Ferguson', role: 'Lady Jessica' },
          { name: 'Austin Butler', role: 'Feyd-Rautha' },
        ],
        status: 'now_showing',
      },
      {
        title: 'Deadpool & Wolverine',
        description: 'Wolverine is recovering from his injuries when he crosses paths with the loudmouth, Deadpool. They team up to defeat a common enemy in a wild multiverse odyssey.',
        genre: ['Action', 'Comedy', 'Sci-Fi'],
        language: ['English', 'Hindi', 'Spanish'],
        duration: 128,
        releaseDate: new Date('2024-07-26'),
        rating: 8.0,
        certificate: 'A',
        posterUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80',
        trailerUrl: 'https://www.youtube.com/watch?v=73_1biulkYk',
        director: 'Shawn Levy',
        cast: [
          { name: 'Ryan Reynolds', role: 'Wade Wilson / Deadpool' },
          { name: 'Hugh Jackman', role: 'Logan / Wolverine' },
          { name: 'Emma Corrin', role: 'Cassandra Nova' },
        ],
        status: 'now_showing',
      },
      {
        title: 'Interstellar: 10th Anniversary Re-Release',
        description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft along with a team of researchers to find a new planet for humans.',
        genre: ['Sci-Fi', 'Drama', 'Adventure'],
        language: ['English'],
        duration: 169,
        releaseDate: new Date('2024-09-27'),
        rating: 8.9,
        certificate: 'UA',
        posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
        trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
        director: 'Christopher Nolan',
        cast: [
          { name: 'Matthew McConaughey', role: 'Cooper' },
          { name: 'Anne Hathaway', role: 'Brand' },
          { name: 'Jessica Chastain', role: 'Murph' },
        ],
        status: 'now_showing',
      },
      {
        title: 'Gladiator II',
        description: 'Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome.',
        genre: ['Action', 'Drama', 'Adventure'],
        language: ['English'],
        duration: 148,
        releaseDate: new Date('2024-11-22'),
        rating: 8.4,
        certificate: 'A',
        posterUrl: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
        trailerUrl: 'https://www.youtube.com/watch?v=4rgYUipGJNo',
        director: 'Ridley Scott',
        cast: [
          { name: 'Paul Mescal', role: 'Lucius' },
          { name: 'Pedro Pascal', role: 'Marcus Acacius' },
          { name: 'Denzel Washington', role: 'Macrinus' },
        ],
        status: 'now_showing',
      },
      {
        title: 'Avatar: Fire and Ash',
        description: 'The journey of Jake Sully and Neytiri continues as they encounter the Ash People, a volcanic clan of Na\'vi, exploring new depths and conflicts across the moon of Pandora.',
        genre: ['Sci-Fi', 'Fantasy', 'Action'],
        language: ['English', 'Hindi'],
        duration: 180,
        releaseDate: new Date('2025-12-19'),
        rating: 9.1,
        certificate: 'UA',
        posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
        trailerUrl: 'https://www.youtube.com',
        director: 'James Cameron',
        cast: [
          { name: 'Sam Worthington', role: 'Jake Sully' },
          { name: 'Zoe Saldaña', role: 'Neytiri' },
        ],
        status: 'upcoming',
      },
    ]);
    console.log(`✅ Seeded ${movies.length} Movies`);

    // 4. Create Shows for Today and Next 3 Days
    const getFormattedDate = (offsetDays = 0) => {
      const d = new Date();
      d.setDate(d.getDate() + offsetDays);
      return d.toISOString().split('T')[0];
    };

    const showtimes = ['10:00 AM', '01:30 PM', '05:00 PM', '08:30 PM', '11:15 PM'];
    const showRecords = [];

    for (let dayOffset = 0; dayOffset <= 3; dayOffset++) {
      const dateStr = getFormattedDate(dayOffset);

      // Now showing movies
      const nowShowingMovies = movies.filter((m) => m.status === 'now_showing');

      for (const movie of nowShowingMovies) {
        for (const theater of theaters) {
          // Add 2 shows per theater per movie
          showtimes.slice(0, 3).forEach((time, idx) => {
            // Some pre-booked seats for realistic seat map
            const mockBooked = idx === 0 ? ['A3', 'A4', 'C5', 'C6', 'D5', 'F3', 'F4'] : ['B2', 'B3', 'E4'];

            showRecords.push({
              movie: movie._id,
              theater: theater._id,
              screenNumber: 1,
              date: dateStr,
              startTime: time,
              format: idx === 0 ? 'IMAX 3D' : '2D',
              language: 'English',
              pricing: {
                silver: 180,
                gold: 260,
                vip: 420,
              },
              bookedSeats: mockBooked,
            });
          });
        }
      }
    }

    const createdShows = await Show.insertMany(showRecords);
    console.log(`✅ Seeded ${createdShows.length} Shows`);

    // 5. Create a sample Booking for the regular user
    const sampleShow = createdShows[0];
    await Booking.create({
      bookingReference: 'IM-DEMO01',
      user: users[1]._id,
      show: sampleShow._id,
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
      paymentDetails: {
        method: 'Card',
        transactionId: 'TXN_SAMPLE_001',
      },
    });
    console.log('✅ Seeded Sample Booking for regular user');

    console.log('\n🌟 DATABASE SEEDING COMPLETED SUCCESSFULLY! 🌟');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();

