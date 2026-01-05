
import { Conversation, Message, User, Reaction } from '../types';
import { MOCK_CONVERSATIONS, CURRENT_USER } from '../constants';

// Stabiele sleutels voor persistentie
const STORAGE_KEY = 'insta_pro_2026_chats';
const OWN_USER_KEY = 'insta_pro_2026_profile';

export const storageService = {
  getOwnUser: (): User & { bio?: string; website?: string } => {
    const data = localStorage.getItem(OWN_USER_KEY);
    if (!data) {
      const initial = { 
        ...CURRENT_USER, 
        fullName: 'Design Ninja',
        bio: 'Creatieve technoloog die de toekomst van UI & AI verkent. ✨', 
        website: 'ninja.ontwerp/portfolio' 
      };
      localStorage.setItem(OWN_USER_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },

  updateOwnUser: (updates: Partial<User & { bio?: string; website?: string }>) => {
    const current = storageService.getOwnUser();
    const updated = { ...current, ...updates };
    localStorage.setItem(OWN_USER_KEY, JSON.stringify(updated));
    return updated;
  },

  getOwnUsername: (): string => {
    return storageService.getOwnUser().username;
  },

  getConversations: (): Conversation[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_CONVERSATIONS));
      return MOCK_CONVERSATIONS;
    }
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : MOCK_CONVERSATIONS;
    } catch (e) {
      return MOCK_CONVERSATIONS;
    }
  },

  saveConversations: (conversations: Conversation[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  },

  deleteConversation: (convId: string) => {
    const conversations = storageService.getConversations();
    const updated = conversations.filter(c => c.id !== convId);
    storageService.saveConversations(updated);
    return updated;
  },

  deleteMessage: (convId: string, messageId: string) => {
    const conversations = storageService.getConversations();
    const updated = conversations.map(c => {
      if (c.id === convId) {
        const filteredMessages = c.messages.filter(m => m.id !== messageId);
        return {
          ...c,
          messages: filteredMessages,
          lastMessage: filteredMessages.length > 0 ? filteredMessages[filteredMessages.length - 1].text : 'Geen berichten'
        };
      }
      return c;
    });
    storageService.saveConversations(updated);
    return updated;
  },

  markAsRead: (convId: string) => {
    const conversations = storageService.getConversations();
    const updated = conversations.map(c => {
      if (c.id === convId) {
        return { ...c, unread: false };
      }
      return c;
    });
    storageService.saveConversations(updated);
    return updated;
  },

  markMessageAsSeen: (convId: string, messageId: string) => {
    const conversations = storageService.getConversations();
    const updated = conversations.map(c => {
      if (c.id === convId) {
        const messages = c.messages.map(m => {
          if (m.id === messageId) {
            return { ...m, isSeen: true };
          }
          return m;
        });
        return { ...c, messages };
      }
      return c;
    });
    storageService.saveConversations(updated);
    return updated;
  },

  addConversation: (user: User) => {
    const conversations = storageService.getConversations();
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      user,
      lastMessage: 'Geen berichten',
      timestamp: 'Nu',
      unread: false,
      messages: []
    };
    const updated = [newConv, ...conversations];
    storageService.saveConversations(updated);
    return updated;
  },

  updateUser: (userId: string, updates: Partial<User>) => {
    const conversations = storageService.getConversations();
    const updated = conversations.map(c => {
      if (c.user.id === userId) {
        return {
          ...c,
          user: { ...c.user, ...updates }
        };
      }
      return c;
    });
    storageService.saveConversations(updated);
    return updated;
  },

  addMessage: (convId: string, message: Message) => {
    const conversations = storageService.getConversations();
    const updated = conversations.map(c => {
      if (c.id === convId) {
        const updatedMsgs = [...c.messages, message];
        return {
          ...c,
          messages: updatedMsgs,
          lastMessage: message.text,
          timestamp: 'Nu',
          unread: message.senderId !== 'me'
        };
      }
      return c;
    });
    storageService.saveConversations(updated);
    return updated;
  },

  toggleAiMode: (convId: string) => {
    const conversations = storageService.getConversations();
    const updated = conversations.map(c => {
      if (c.id === convId) {
        return { ...c, isAiEnabled: !c.isAiEnabled };
      }
      return c;
    });
    storageService.saveConversations(updated);
    return updated;
  },

  addReaction: (convId: string, messageId: string, reaction: Reaction) => {
    const conversations = storageService.getConversations();
    const updated = conversations.map(c => {
      if (c.id === convId) {
        const updatedMessages = c.messages.map(m => {
          if (m.id === messageId) {
            const existingReactions = m.reactions || [];
            const filtered = existingReactions.filter(r => r.senderId !== reaction.senderId);
            return { ...m, reactions: [...filtered, reaction] };
          }
          return m;
        });
        return { ...c, messages: updatedMessages };
      }
      return c;
    });
    storageService.saveConversations(updated);
    return updated;
  }
};
