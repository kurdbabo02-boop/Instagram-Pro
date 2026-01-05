
import { User, PostData, Story, Conversation } from './types';

export const CURRENT_USER: User = {
  id: 'me',
  username: 'design_ninja',
  fullName: 'Ninja Designer',
  avatar: 'https://picsum.photos/seed/ninja/150/150',
};

export const MOCK_USERS: User[] = [
  { 
    id: 'jordy', 
    username: 'jordymone9', 
    fullName: 'Jordy Mone', 
    avatar: 'https://picsum.photos/seed/jordy/200/200', 
    isVerified: true, 
    isActive: true,
    followers: '52 d.',
    postsCount: '340',
    followingSince: '2024',
    mutualFollows: 'lijpe en 1 andere persoon'
  },
  { id: '1', username: 'masta_otf', fullName: 'Masta', avatar: 'https://picsum.photos/seed/user1/150/150', isVerified: true, isActive: true },
  { id: '2', username: 'ezyunusemre', fullName: 'Yunus Emre', avatar: 'https://picsum.photos/seed/user2/150/150', isActive: false },
  { id: '3', username: 'emredreisechs', fullName: 'Emre', avatar: 'https://picsum.photos/seed/user3/150/150', isVerified: true, isActive: true },
  { id: '4', username: 'cestmocro', fullName: 'Cest MOCRO', avatar: 'https://picsum.photos/seed/user4/150/150', isActive: true },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-jordy',
    user: MOCK_USERS[0],
    lastMessage: 'Zakelijke chat',
    timestamp: 'Just now',
    unread: false,
    messages: []
  },
  {
    id: 'conv-1',
    user: MOCK_USERS[1],
    lastMessage: 'That design looks incredible! 🔥',
    timestamp: '2m',
    unread: true,
    messages: [
      { id: 'm1', senderId: '1', text: 'Hey, did you see the new update?', timestamp: '10:00 AM' },
      { id: 'm2', senderId: 'me', text: 'Not yet, checking it out now!', timestamp: '10:05 AM' },
      { id: 'm3', senderId: '1', text: 'That design looks incredible! 🔥', timestamp: '10:10 AM' },
    ]
  }
];

export const MOCK_STORIES: Story[] = [
  { id: 's1', user: MOCK_USERS[1], hasUnseenStory: true },
  { id: 's2', user: MOCK_USERS[2], hasUnseenStory: true },
  { id: 's3', user: MOCK_USERS[3], hasUnseenStory: true },
  { id: 's4', user: MOCK_USERS[4], hasUnseenStory: false },
];

export const INITIAL_POSTS: PostData[] = [
  {
    id: 'post-1',
    user: MOCK_USERS[4], // Cest Mocro
    imageUrl: 'https://picsum.photos/seed/snow/1080/1350',
    caption: 'Sneeuwpret in Nederland! ❄️☃️',
    likes: 45200,
    commentsCount: 1240,
    timestamp: '1h',
  },
  {
    id: 'post-2',
    user: MOCK_USERS[0],
    imageUrl: 'https://picsum.photos/seed/post2/1080/1080',
    caption: 'Back in the studio. 🎙️🔥 #MusicLife',
    likes: 8560,
    commentsCount: 156,
    timestamp: '4h',
  }
];
