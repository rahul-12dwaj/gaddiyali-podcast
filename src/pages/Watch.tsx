import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { VideoPlayer } from "../components/VideoPlayer";
import { CommentSection } from "../components/CommentSection";
import { Episode, Comment } from "../types";
import { useAuthStore } from "../store/useAuthStore";
import { db } from "../lib/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  addDoc,
} from "firebase/firestore";

export const Watch = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [randomPodcasts, setRandomPodcasts] = useState<Episode[]>([]);

  useEffect(() => {
    const fetchEpisodeData = async () => {
      const episodeDocRef = doc(db, "episodes", id);
      const episodeSnapshot = await getDoc(episodeDocRef);
      if (episodeSnapshot.exists()) {
        const episodeData = episodeSnapshot.data();
        setEpisode({
          id: episodeSnapshot.id,
          title: episodeData.title,
          description: episodeData.description,
          videoUrl: episodeData.videoUrl,
          thumbnailUrl: episodeData.thumbnailUrl,
          seasonNumber: episodeData.seasonNumber,
          episodeNumber: episodeData.episodeNumber,
          duration: episodeData.duration,
          likes: episodeData.likes,
          createdAt: episodeData.createdAt.toDate(),
        });
      }
    };

    const fetchComments = async () => {
      const commentsQuery = query(
        collection(db, "comments"),
        where("episodeId", "==", id)
      );
      const querySnapshot = await getDocs(commentsQuery);
      const fetchedComments: Comment[] = [];
      querySnapshot.forEach((doc) => {
        const commentData = doc.data();
        fetchedComments.push({
          id: doc.id,
          episodeId: commentData.episodeId,
          userId: commentData.userId,
          userDisplayName: commentData.userDisplayName,
          userPhotoUrl: commentData.userPhotoUrl,
          content: commentData.content,
          createdAt: commentData.createdAt.toDate(),
        });
      });
      setComments(fetchedComments);
    };

    const fetchRandomPodcasts = async () => {
      const querySnapshot = await getDocs(
        query(collection(db, "episodes"), limit(6))
      );
      const podcasts: Episode[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        podcasts.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          videoUrl: data.videoUrl,
          thumbnailUrl: data.thumbnailUrl,
          seasonNumber: data.seasonNumber,
          episodeNumber: data.episodeNumber,
          duration: data.duration,
          likes: data.likes,
          createdAt: data.createdAt.toDate(),
        });
      });
      setRandomPodcasts(podcasts);
    };

    fetchEpisodeData();
    fetchComments();
    fetchRandomPodcasts();
  }, [id]);

  const handleAddComment = async (content: string) => {
    if (!user || !episode) return;
    const commentData = {
      episodeId: episode.id,
      userId: user.uid,
      userDisplayName: user.displayName || "",
      userPhotoUrl: user.photoURL || "",
      content,
      createdAt: new Date(),
    };
    await addDoc(collection(db, "comments"), commentData);
    setComments([{ id: Date.now().toString(), ...commentData }, ...comments]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="aspect-w-16 aspect-h-9 sm:aspect-w-4 sm:aspect-h-3">
        <VideoPlayer
          url={episode?.videoUrl}
          title={episode?.title}
          onLike={() => {}}
          onAddToWatchLater={() => {}}
          isLiked={isLiked}
        />
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold dark:text-white mb-2">
          {episode?.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {episode?.description}
        </p>
      </div>

      {/* Always Visible Comments Section */}
      <CommentSection comments={comments} onAddComment={handleAddComment} />

      <div className="mt-8">
        <h3 className="text-lg font-semibold dark:text-white mb-4">
          More Podcasts You May Like
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {randomPodcasts.map((podcast) => (
            <div
              key={podcast.id}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow"
            >
              <img
                src={podcast.thumbnailUrl}
                alt={podcast.title}
                className="w-full h-32 object-cover rounded"
              />
              <h4 className="mt-2 text-md font-bold dark:text-white">
                {podcast.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {podcast.description.slice(0, 100)}...
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
