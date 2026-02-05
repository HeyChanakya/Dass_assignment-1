// Script to seed sample organizers/clubs
const mongoose = require('mongoose');
const Organizer = require('./models/Organizer');
require('dotenv').config();

const sampleOrganizers = [
  {
    loginEmail: 'dance.club@felicity.com',
    password: 'dance123',
    organizerName: 'Felicity Dance Club',
    category: 'Arts & Performance',
    description: 'We bring together passionate dancers from all styles - contemporary, hip-hop, classical, and more. Join us for workshops, performances, and competitions throughout the year.',
    contactEmail: 'dance@felicity.com',
    contactNumber: '+91-9876543210',
    followers: []
  },
  {
    loginEmail: 'tech.club@felicity.com',
    password: 'tech123',
    organizerName: 'Tech Innovators Society',
    category: 'Technology',
    description: 'A community of tech enthusiasts, developers, and innovators. We organize hackathons, coding workshops, tech talks, and innovation challenges to foster technological excellence.',
    contactEmail: 'tech@felicity.com',
    contactNumber: '+91-9876543211',
    followers: []
  },
  {
    loginEmail: 'music.club@felicity.com',
    password: 'music123',
    organizerName: 'Harmony Music Society',
    category: 'Arts & Performance',
    description: 'From classical to contemporary, rock to jazz - we celebrate all forms of music. Join us for concerts, jam sessions, music production workshops, and battle of the bands.',
    contactEmail: 'music@felicity.com',
    contactNumber: '+91-9876543212',
    followers: []
  },
  {
    loginEmail: 'drama.club@felicity.com',
    password: 'drama123',
    organizerName: 'Dramatics & Theatre Club',
    category: 'Arts & Performance',
    description: 'Experience the magic of theatre! We produce plays, organize street theatre, conduct acting workshops, and host theatre festivals. All aspiring actors and theatre lovers welcome.',
    contactEmail: 'drama@felicity.com',
    contactNumber: '+91-9876543213',
    followers: []
  },
  {
    loginEmail: 'sports.club@felicity.com',
    password: 'sports123',
    organizerName: 'Athletic Sports Club',
    category: 'Sports & Fitness',
    description: 'Promoting fitness and sportsmanship through various athletic events, tournaments, marathons, and fitness challenges. For athletes and fitness enthusiasts of all levels.',
    contactEmail: 'sports@felicity.com',
    contactNumber: '+91-9876543214',
    followers: []
  },
  {
    loginEmail: 'photography.club@felicity.com',
    password: 'photo123',
    organizerName: 'Lens & Light Photography',
    category: 'Arts & Media',
    description: 'Capture moments, tell stories. We organize photo walks, exhibitions, workshops on photography techniques, and annual photo contests. Open to all photography enthusiasts.',
    contactEmail: 'photo@felicity.com',
    contactNumber: '+91-9876543215',
    followers: []
  },
  {
    loginEmail: 'literature.club@felicity.com',
    password: 'lit123',
    organizerName: 'Literary Society',
    category: 'Literature & Writing',
    description: 'For the love of words and stories. Poetry slams, book clubs, creative writing workshops, author talks, and annual literary festivals. Writers and readers unite!',
    contactEmail: 'literature@felicity.com',
    contactNumber: '+91-9876543216',
    followers: []
  },
  {
    loginEmail: 'art.club@felicity.com',
    password: 'art123',
    organizerName: 'Fine Arts Collective',
    category: 'Arts & Media',
    description: 'A creative space for painters, sketchers, and digital artists. We host art exhibitions, live painting events, workshops on various mediums, and collaborative art projects.',
    contactEmail: 'art@felicity.com',
    contactNumber: '+91-9876543217',
    followers: []
  },
  {
    loginEmail: 'debate.club@felicity.com',
    password: 'debate123',
    organizerName: 'Debate & Oratory Forum',
    category: 'Academic',
    description: 'Sharpen your argumentation and public speaking skills. Parliamentary debates, Model UN, public speaking workshops, and inter-college debate competitions.',
    contactEmail: 'debate@felicity.com',
    contactNumber: '+91-9876543218',
    followers: []
  },
  {
    loginEmail: 'entrepreneurship.club@felicity.com',
    password: 'startup123',
    organizerName: 'E-Cell - Entrepreneurship Club',
    category: 'Business & Innovation',
    description: 'Fostering entrepreneurial spirit through startup workshops, pitch competitions, networking events with industry leaders, and mentorship programs for budding entrepreneurs.',
    contactEmail: 'ecell@felicity.com',
    contactNumber: '+91-9876543219',
    followers: []
  },
  {
    loginEmail: 'robotics.club@felicity.com',
    password: 'robot123',
    organizerName: 'Robotics & Automation Society',
    category: 'Technology',
    description: 'Build, code, innovate! We work on robotics projects, organize robo-wars, conduct workshops on Arduino, ROS, and participate in national robotics competitions.',
    contactEmail: 'robotics@felicity.com',
    contactNumber: '+91-9876543220',
    followers: []
  },
  {
    loginEmail: 'environment.club@felicity.com',
    password: 'green123',
    organizerName: 'Green Earth Environmental Club',
    category: 'Social & Environmental',
    description: 'Making our planet greener, one step at a time. Tree plantation drives, sustainability workshops, beach cleanups, and awareness campaigns on climate change.',
    contactEmail: 'green@felicity.com',
    contactNumber: '+91-9876543221',
    followers: []
  },
  {
    loginEmail: 'fashion.club@felicity.com',
    password: 'fashion123',
    organizerName: 'Vogue Fashion Society',
    category: 'Fashion & Design',
    description: 'Where style meets creativity. Annual fashion shows, styling workshops, sustainable fashion initiatives, and collaborations with fashion designers and brands.',
    contactEmail: 'fashion@felicity.com',
    contactNumber: '+91-9876543222',
    followers: []
  },
  {
    loginEmail: 'quiz.club@felicity.com',
    password: 'quiz123',
    organizerName: 'Quiz Masters Association',
    category: 'Academic',
    description: 'Test your knowledge across diverse topics. Weekly quiz nights, inter-college quiz competitions, trivia events, and knowledge-sharing sessions.',
    contactEmail: 'quiz@felicity.com',
    contactNumber: '+91-9876543223',
    followers: []
  },
  {
    loginEmail: 'gaming.club@felicity.com',
    password: 'game123',
    organizerName: 'Esports & Gaming Guild',
    category: 'Gaming',
    description: 'Competitive gaming at its best. PUBG, Valorant, FIFA tournaments, LAN gaming events, and game development workshops. For casual and professional gamers.',
    contactEmail: 'gaming@felicity.com',
    contactNumber: '+91-9876543224',
    followers: []
  }
];

const seedOrganizers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Clear existing organizers (except admin-created ones if any)
    const emailsToSeed = sampleOrganizers.map(o => o.loginEmail);
    await Organizer.deleteMany({ loginEmail: { $in: emailsToSeed } });
    console.log('Cleared existing sample organizers');

    // Create organizers
    const createdOrganizers = await Organizer.create(sampleOrganizers);
    console.log(`✅ Successfully seeded ${createdOrganizers.length} organizers!`);

    console.log('\n📋 Organizer Login Credentials:');
    console.log('================================');
    sampleOrganizers.forEach(org => {
      console.log(`\n${org.organizerName}`);
      console.log(`Email: ${org.loginEmail}`);
      console.log(`Password: ${org.password}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding organizers:', error);
    process.exit(1);
  }
};

seedOrganizers();
