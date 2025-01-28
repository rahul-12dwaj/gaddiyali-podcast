export interface Episode {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  seasonNumber: number;
  episodeNumber: number;
  duration: number;
  likes: number;
  createdAt: Date | { toDate: () => Date };
  category: string;
}

export interface Comment {
  id: string;
  episodeId: string;
  userId: string;
  userDisplayName: string;
  userPhotoUrl: string;
  content: string;
  createdAt: Date;
}

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  photoURL: string;
  watchHistory: string[];
  watchLater: string[];
  likedVideos: string[];
}