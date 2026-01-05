
export interface User {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  isVerified?: boolean;
  isActive?: boolean;
  followers?: string;
  following?: string;
  postsCount?: string;
  followingSince?: string;
  mutualFollows?: string;
}

export interface Reaction {
  emoji: string;
  senderId: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  reactions?: Reaction[];
  isSeen?: boolean;
}

export interface Conversation {
  id: string;
  user: User;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  messages: Message[];
  isAiEnabled?: boolean;
}

export interface PostData {
  id: string;
  user: User;
  imageUrl: string;
  caption: string;
  likes: number;
  commentsCount: number;
  timestamp: string;
  isLiked?: boolean;
  isSaved?: boolean;
  musicInfo?: string;
}

export interface Story {
  id: string;
  user: User;
  hasUnseenStory: boolean;
}

export enum AppView {
  FEED = 'feed',
  SEARCH = 'search',
  EXPLORE = 'explore',
  REELS = 'reels',
  MESSAGES = 'messages',
  NOTIFICATIONS = 'notifications',
  CREATE = 'create',
  PROFILE = 'profile'
}
