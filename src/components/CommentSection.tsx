import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Comment } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  onAddComment,
}) => {
  const { user } = useAuthStore();
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 dark:text-white">Comments</h3>
      
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-4">
            <img
              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`}
              alt={user.displayName || ''}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                rows={3}
              />
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Comment
              </button>
            </div>
          </div>
        </form>
      ) : (
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Please sign in to comment
        </p>
      )}

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <img
              src={comment.userPhotoUrl}
              alt={comment.userDisplayName}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold dark:text-white">
                  {comment.userDisplayName}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                </span>
              </div>
              <p className="mt-1 text-gray-800 dark:text-gray-200">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};