export const photo = (id: string, width = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${width}&q=75&auto=format&fit=crop`;

export type Category = {
  id: string;
  name: string;
  image: string;
  color: string;
};

export type Chapter = {
  title: string;
  start: number;
};

export type Episode = {
  id: string;
  showId: string;
  number: number;
  title: string;
  description: string;
  duration: number;
  publishedDaysAgo: number;
  chapters: Chapter[];
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  daysAgo: number;
};

export type Show = {
  id: string;
  title: string;
  author: string;
  categoryId: string;
  image: string;
  description: string;
  rating: number;
  ratingCount: number;
  followers: number;
  episodeTitles: string[];
};

export type Friend = {
  id: string;
  name: string;
  avatar: string;
  episodeId: string;
  minutesAgo: number;
};

export const categories: Category[] = [
  { id: 'technology', name: 'Technology', image: photo('1518770660439-4636190af475', 600), color: '#1A5FFF' },
  { id: 'news', name: 'News', image: photo('1495020689067-958852a7765e', 600), color: '#E5484D' },
  { id: 'science', name: 'Science', image: photo('1462331940025-496dfbfc7564', 600), color: '#8E4EC6' },
  { id: 'business', name: 'Business', image: photo('1460925895917-afdab827c52f', 600), color: '#12A594' },
  { id: 'health', name: 'Health & Wellness', image: photo('1505751172876-fa1923c5c528', 600), color: '#30A46C' },
  { id: 'comedy', name: 'Comedy', image: photo('1527224857830-43a7acc85260', 600), color: '#F76B15' },
  { id: 'travel', name: 'Travel', image: photo('1488646953014-85cb44e25828', 600), color: '#0090FF' },
  { id: 'food', name: 'Food', image: photo('1504674900247-0877df9cc836', 600), color: '#E54666' },
  { id: 'sports', name: 'Sports', image: photo('1476480862126-209bfaa8edc8', 600), color: '#FFB224' },
  { id: 'arts', name: 'Film & Music', image: photo('1489599849927-2ee91cede3ba', 600), color: '#D6409F' },
];

export const shows: Show[] = [
  {
    id: 'signal-and-noise',
    title: 'Signal & Noise',
    author: 'Maya Chen',
    categoryId: 'technology',
    image: photo('1478737270239-2f02b77fc618'),
    description:
      'A weekly conversation about the technology shaping our lives. Maya Chen talks with founders, engineers, and researchers about AI, software, and the future of work.',
    rating: 4.8,
    ratingCount: 12840,
    followers: 284000,
    episodeTitles: [
      'The Agents Are Coming for Your Test Suite',
      'Why Every App Is Becoming a Chat App',
      'Inside the Chip Shortage, Two Years Later',
      'Open Source Is Eating the Model Layer',
      'The Quiet Death of the Password',
      'What Happened to the Metaverse?',
    ],
  },
  {
    id: 'the-daily-brief',
    title: 'The Daily Brief',
    author: 'Northwind Media',
    categoryId: 'news',
    image: photo('1504711434969-e33886168f5c'),
    description:
      'The biggest stories of the day, explained in twenty minutes. Every weekday morning, our newsroom breaks down what happened and why it matters.',
    rating: 4.6,
    ratingCount: 48210,
    followers: 1120000,
    episodeTitles: [
      'Markets Rally as Rates Hold Steady',
      'The Election Map, Explained',
      'A New Deal on Climate Finance',
      'Who Owns the Ocean Floor?',
      'The Housing Crunch Comes to the Suburbs',
      'Inside the Global Shipping Slowdown',
    ],
  },
  {
    id: 'deep-space-diaries',
    title: 'Deep Space Diaries',
    author: 'Dr. Lena Okafor',
    categoryId: 'science',
    image: photo('1446776811953-b23d57bd21aa'),
    description:
      'Astrophysicist Lena Okafor takes you on a tour of the cosmos, from black holes to the search for life on distant moons.',
    rating: 4.9,
    ratingCount: 9320,
    followers: 198000,
    episodeTitles: [
      'Listening for Life on Europa',
      'The Telescope That Saw the Dawn of Time',
      'What Is Dark Energy, Really?',
      'A Field Guide to Black Holes',
      'Mars, Without the Hype',
      'The Day the Sun Goes Quiet',
    ],
  },
  {
    id: 'founders-unfiltered',
    title: 'Founders Unfiltered',
    author: 'Jordan Blake',
    categoryId: 'business',
    image: photo('1556761175-5973dc0f32e7'),
    description:
      'Honest conversations with founders about the messy middle: the near-misses, the pivots, and the lessons nobody puts on LinkedIn.',
    rating: 4.7,
    ratingCount: 6120,
    followers: 143000,
    episodeTitles: [
      'We Almost Ran Out of Money Twice',
      'Hiring Your First Ten People',
      'The Pivot That Saved the Company',
      'Bootstrapping to $10M ARR',
      'How to Fire a Customer',
      'Founder Burnout Is a Strategy Problem',
    ],
  },
  {
    id: 'mindful-minutes',
    title: 'Mindful Minutes',
    author: 'Ava Lindqvist',
    categoryId: 'health',
    image: photo('1544367567-0f2fcb009e0b'),
    description:
      'Short, science-backed practices for a calmer mind. Guided breathing, sleep stories, and conversations with leading psychologists.',
    rating: 4.9,
    ratingCount: 22410,
    followers: 512000,
    episodeTitles: [
      'A Ten-Minute Reset for Busy Days',
      'Sleep Better Tonight',
      'The Science of Gratitude',
      'Breathing Through Anxiety',
      'Digital Detox Without the Guilt',
      'Building a Morning Ritual',
    ],
  },
  {
    id: 'laugh-track',
    title: 'Laugh Track',
    author: 'Sam & Riley',
    categoryId: 'comedy',
    image: photo('1516280440614-37939bbacd81'),
    description:
      'Two best friends, zero preparation. Sam and Riley riff on the week\u2019s weirdest headlines and answer your worst life questions.',
    rating: 4.5,
    ratingCount: 18900,
    followers: 389000,
    episodeTitles: [
      'We Tried a Silent Retreat (It Was Not Silent)',
      'Ranking Every Breakfast Cereal',
      'Your Group Chat Drama, Solved',
      'The Worst Wedding Speech Ever Given',
      'Live From a Very Small Airport',
      'Riley Learns to Drive Stick',
    ],
  },
  {
    id: 'wanderlust-radio',
    title: 'Wanderlust Radio',
    author: 'Kai Moreno',
    categoryId: 'travel',
    image: photo('1500530855697-b586d89ba3ee'),
    description:
      'Stories from the road and travel tips from people who live out of a backpack. Every episode is a new destination.',
    rating: 4.7,
    ratingCount: 5410,
    followers: 97000,
    episodeTitles: [
      'Slow Travel Through Portugal',
      'The Night Trains of Europe',
      'Lost (on Purpose) in Tokyo',
      'Packing Light for Six Months',
      'Iceland in the Off-Season',
      'How to Travel Without a Plan',
    ],
  },
  {
    id: 'kitchen-table',
    title: 'Kitchen Table',
    author: 'Priya Natarajan',
    categoryId: 'food',
    image: photo('1490645935967-10de6ba17061'),
    description:
      'Chef Priya Natarajan sits down with cooks, farmers, and food writers to talk about the meals that shaped them.',
    rating: 4.8,
    ratingCount: 7730,
    followers: 156000,
    episodeTitles: [
      'The Perfect Weeknight Pasta',
      'Why Your Bread Isn\u2019t Rising',
      'A Love Letter to Street Food',
      'Fermentation for Beginners',
      'Cooking for One (and Loving It)',
      'The Secret Life of Spices',
    ],
  },
  {
    id: 'run-the-numbers',
    title: 'Run the Numbers',
    author: 'Marcus Webb',
    categoryId: 'business',
    image: photo('1579621970563-ebec7560ff3e'),
    description:
      'Personal finance without the jargon. Marcus Webb breaks down investing, saving, and money habits in plain language.',
    rating: 4.6,
    ratingCount: 10340,
    followers: 231000,
    episodeTitles: [
      'Index Funds, Explained Simply',
      'Your First Budget That Actually Works',
      'Should You Rent or Buy?',
      'The Psychology of Spending',
      'Paying Off Debt, Fast',
      'Retirement in Your Twenties',
    ],
  },
  {
    id: 'frame-by-frame',
    title: 'Frame by Frame',
    author: 'Nora Ellis',
    categoryId: 'arts',
    image: photo('1485846234645-a62644f84728'),
    description:
      'A film lover\u2019s podcast. Deep dives into classic and new movies, with directors, critics, and the crews behind the camera.',
    rating: 4.7,
    ratingCount: 4890,
    followers: 88000,
    episodeTitles: [
      'The Year in Film So Far',
      'How Sound Design Makes a Scene',
      'Revisiting a Sci-Fi Classic',
      'The Art of the Opening Shot',
      'Indie Films You Missed',
      'Behind the Scenes With a Stunt Team',
    ],
  },
  {
    id: 'code-review',
    title: 'Code Review',
    author: 'Tomasz & Elena',
    categoryId: 'technology',
    image: photo('1461749280684-dccba630e2f6'),
    description:
      'Two senior engineers review real-world codebases, debate architecture, and share what they wish they knew earlier.',
    rating: 4.8,
    ratingCount: 3920,
    followers: 64000,
    episodeTitles: [
      'Testing Mobile Apps End to End',
      'Monorepos: Worth It?',
      'The Case for Boring Technology',
      'Reading Other People\u2019s Code',
      'TypeScript Tips We Use Every Day',
      'Shipping Without Fear',
    ],
  },
  {
    id: 'peak-performance',
    title: 'Peak Performance',
    author: 'Coach Dani Reyes',
    categoryId: 'sports',
    image: photo('1461896836934-ffe607ba8211'),
    description:
      'Training, recovery, and mindset from elite athletes and coaches. Practical advice for runners, lifters, and weekend warriors.',
    rating: 4.7,
    ratingCount: 6680,
    followers: 172000,
    episodeTitles: [
      'Training for Your First Marathon',
      'Recovery Is Training',
      'The Mental Game of Sport',
      'Strength Training for Runners',
      'Eating to Perform',
      'Coming Back From Injury',
    ],
  },
  {
    id: 'sound-check',
    title: 'Sound Check',
    author: 'DJ Okon',
    categoryId: 'arts',
    image: photo('1470225620780-dba8ba36b745'),
    description:
      'The stories behind the songs. Producers and artists break down how their biggest tracks came together, one layer at a time.',
    rating: 4.6,
    ratingCount: 3110,
    followers: 59000,
    episodeTitles: [
      'Anatomy of a Summer Hit',
      'The Return of Vinyl',
      'Making an Album in a Bedroom',
      'Why We Love Sad Songs',
      'The Producer Who Shaped a Decade',
      'Live Music After Dark',
    ],
  },
  {
    id: 'trail-notes',
    title: 'Trail Notes',
    author: 'Hannah Frost',
    categoryId: 'travel',
    image: photo('1506905925346-21bda4d32df4'),
    description:
      'Field recordings and stories from mountains, forests, and long-distance trails. Put on your boots and come along.',
    rating: 4.9,
    ratingCount: 2870,
    followers: 41000,
    episodeTitles: [
      'Sunrise on the Ridge',
      'Thru-Hiking the Pacific Crest',
      'The Quiet of the Old Forest',
      'Leave No Trace, Explained',
      'Camping in the Desert',
      'What the Mountains Taught Me',
    ],
  },
];

const durations = [2310, 3120, 1860, 2760, 3540, 1440, 2580, 4020];
const chapterNames = ['Intro', 'The big idea', 'Deep dive', 'Listener questions', 'Wrap-up'];

function buildEpisodes(show: Show, showIndex: number): Episode[] {
  const total = show.episodeTitles.length;
  return show.episodeTitles.map((title, i) => {
    const number = 100 + total - i - showIndex * 3;
    const duration = durations[(showIndex + i) % durations.length];
    const chapterCount = 4 + ((showIndex + i) % 2);
    const chapters = chapterNames.slice(0, chapterCount).map((name, c) => ({
      title: name,
      start: c === 0 ? 0 : Math.round((duration / chapterCount) * c),
    }));
    return {
      id: `${show.id}-${number}`,
      showId: show.id,
      number,
      title,
      description: `${show.author} digs into \u201C${title.replace(/[?.]$/, '')}\u201D. ${show.description} In this episode: what changed, why it matters, and what to watch next.`,
      duration,
      publishedDaysAgo: i * 7 + (showIndex % 4),
      chapters,
    };
  });
}

export const episodes: Episode[] = shows.flatMap(buildEpisodes);

export const showById = Object.fromEntries(shows.map((show) => [show.id, show])) as Record<string, Show>;
export const episodeById = Object.fromEntries(episodes.map((episode) => [episode.id, episode])) as Record<
  string,
  Episode
>;
export const categoryById = Object.fromEntries(categories.map((category) => [category.id, category])) as Record<
  string,
  Category
>;

export const episodesForShow = (showId: string) => episodes.filter((episode) => episode.showId === showId);

export const latestEpisode = (showId: string) => episodesForShow(showId)[0];

export const featuredShowIds = ['signal-and-noise', 'deep-space-diaries', 'mindful-minutes', 'wanderlust-radio'];

export const trendingShowIds = [
  'the-daily-brief',
  'laugh-track',
  'mindful-minutes',
  'run-the-numbers',
  'peak-performance',
  'kitchen-table',
];

const nthEpisode = (showId: string, index: number) => episodesForShow(showId)[index].id;

export const friends: Friend[] = [
  { id: 'f1', name: 'Olivia', avatar: photo('1494790108377-be9c29b29330', 200), episodeId: nthEpisode('deep-space-diaries', 0), minutesAgo: 4 },
  { id: 'f2', name: 'Ethan', avatar: photo('1500648767791-00dcc994a43e', 200), episodeId: nthEpisode('founders-unfiltered', 2), minutesAgo: 18 },
  { id: 'f3', name: 'Sofia', avatar: photo('1438761681033-6461ffad8d80', 200), episodeId: nthEpisode('kitchen-table', 1), minutesAgo: 42 },
  { id: 'f4', name: 'Liam', avatar: photo('1472099645785-5658abf4ff4e', 200), episodeId: nthEpisode('code-review', 0), minutesAgo: 65 },
  { id: 'f5', name: 'Zoe', avatar: photo('1534528741775-53994a69daeb', 200), episodeId: nthEpisode('laugh-track', 3), minutesAgo: 120 },
];

export const currentUser = {
  name: 'Alex Morgan',
  handle: '@alexlistens',
  avatar: photo('1507003211169-0a1dd7228f2d', 300),
};

const reviewPool: Omit<Review, 'id'>[] = [
  { author: 'nightowl_88', rating: 5, title: 'My commute essential', body: 'Smart, well researched, and never boring. I look forward to every new episode.', daysAgo: 3 },
  { author: 'curious_kate', rating: 5, title: 'Best in the category', body: 'The host asks the questions I would ask. Great guests and great pacing.', daysAgo: 9 },
  { author: 'marco.p', rating: 4, title: 'Great, but long', body: 'Love the content. Some episodes could be a little shorter, but I always finish them.', daysAgo: 16 },
  { author: 'listener42', rating: 5, title: 'Binged the whole archive', body: 'Found this last month and caught up on everything. Instantly recommended it to friends.', daysAgo: 27 },
  { author: 'jules_r', rating: 4, title: 'Solid every week', body: 'Consistent quality and great sound. Would love more listener Q&A episodes.', daysAgo: 41 },
];

export const reviewsForShow = (showId: string): Review[] => {
  const offset = shows.findIndex((show) => show.id === showId);
  return [0, 1, 2].map((i) => {
    const review = reviewPool[(offset + i) % reviewPool.length];
    return { ...review, id: `${showId}-review-${i}` };
  });
};
