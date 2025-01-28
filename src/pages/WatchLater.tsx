import React from 'react';
import { EpisodeCard } from '../components/EpisodeCard';
import { useAuthStore } from '../store/useAuthStore';
import { Episode } from '../types';

export const WatchLater = () => {
  const { user } = useAuthStore();
  
  // Mock data - Replace with Firebase data
  const watchLaterEpisodes: Episode[] = [];

  const handleRemoveFromWatchLater = async (episodeId: string) => {
    // Implement remove from watch later functionality with Firebase
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-600 dark:text-gray-400">
          Please sign in to view your watch later list
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold dark:text-white mb-8">Watch Later</h1>
      
      {watchLaterEpisodes.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          Your watch later list is empty
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchLaterEpisodes.map((episode) => (
            <EpisodeCard
              key={episode.id}
              episode={episode}
              onWatchLater={() => handleRemoveFromWatchLater(episode.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};