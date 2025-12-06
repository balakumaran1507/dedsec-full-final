'use client';

/**
 * Activity Feed Component
 *
 * Displays real-time team activities with automatic updates
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActivityFeedItem } from '@/types/activity';
import { subscribeToActivities } from '@/lib/db/activityFeed';
import { FileText, Users, Trophy, Bell, UserPlus, Flag, Sparkles } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

interface ActivityFeedProps {
  maxItems?: number;
  showTitle?: boolean;
  className?: string;
}

const getActivityIcon = (type: ActivityFeedItem['type']) => {
  switch (type) {
    case 'writeup_created':
      return <FileText className="w-4 h-4" />;
    case 'ctf_joined':
      return <Users className="w-4 h-4" />;
    case 'challenge_solved':
      return <Trophy className="w-4 h-4" />;
    case 'achievement_unlocked':
      return <Sparkles className="w-4 h-4" />;
    case 'member_joined':
      return <UserPlus className="w-4 h-4" />;
    case 'ctf_completed':
      return <Flag className="w-4 h-4" />;
    case 'announcement_created':
      return <Bell className="w-4 h-4" />;
    default:
      return <Bell className="w-4 h-4" />;
  }
};

const getRoleColor = (role: string) => {
  switch (role.toLowerCase()) {
    case 'founder':
      return 'text-red-400';
    case 'admin':
      return 'text-purple-400';
    case 'member':
      return 'text-green-400';
    default:
      return 'text-gray-400';
  }
};

const formatTimestamp = (timestamp: Timestamp | Date): string => {
  const date =
    timestamp && 'toDate' in timestamp
      ? timestamp.toDate()
      : timestamp instanceof Date
      ? timestamp
      : new Date();

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export default function ActivityFeed({
  maxItems = 10,
  showTitle = true,
  className = '',
}: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityFeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToActivities(maxItems, (newActivities) => {
      setActivities(newActivities);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [maxItems]);

  if (loading) {
    return (
      <div className={`space-y-2 ${className}`}>
        {showTitle && (
          <h3 className="text-xs font-mono text-green-400 mb-3">
            [ACTIVITY_FEED]
          </h3>
        )}
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-black/40 border border-green-500/20 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className={`${className}`}>
        {showTitle && (
          <h3 className="text-xs font-mono text-green-400 mb-3">
            [ACTIVITY_FEED]
          </h3>
        )}
        <div className="text-center py-8 border border-green-500/20 rounded bg-black/40">
          <p className="text-gray-500 font-mono text-sm">
            No recent activity
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {showTitle && (
        <h3 className="text-xs font-mono text-green-400 mb-3">
          [ACTIVITY_FEED]
        </h3>
      )}

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="border border-green-500/30 bg-black/60 rounded p-3 hover:border-green-400/50 transition-all hover:bg-black/80"
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 w-8 h-8 rounded bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400">
                  {getActivityIcon(activity.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`font-mono text-sm ${getRoleColor(activity.userRole)}`}
                    >
                      {activity.userName}
                    </span>
                    <span className="text-gray-600 text-xs">•</span>
                    <span className="text-gray-500 text-xs font-mono">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>

                  <p className="text-gray-300 text-sm font-mono">
                    {activity.content}
                  </p>

                  {/* Metadata badges */}
                  {activity.metadata && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {activity.metadata.category && (
                        <span className="px-2 py-0.5 text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded">
                          {activity.metadata.category}
                        </span>
                      )}
                      {activity.metadata.points && (
                        <span className="px-2 py-0.5 text-xs font-mono bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 rounded">
                          +{activity.metadata.points} pts
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
