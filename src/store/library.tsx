import { createContext, use, useEffect, useState, type ReactNode } from 'react';

import { episodesForShow, type Review } from '@/data/podcasts';

export type Playlist = {
  id: string;
  name: string;
  episodeIds: string[];
};

export type Settings = {
  defaultSpeed: number;
  skipBack: number;
  skipForward: number;
  continuousPlayback: boolean;
  autoDownload: boolean;
  wifiOnly: boolean;
  newEpisodeAlerts: boolean;
  shareWithTimestamp: boolean;
};

type LibraryContextValue = {
  following: string[];
  liked: string[];
  downloads: Record<string, number>;
  playlists: Playlist[];
  interests: string[];
  settings: Settings;
  userReviews: Record<string, Review>;
  mutedShows: string[];
  isFollowing: (showId: string) => boolean;
  toggleFollow: (showId: string) => void;
  isLiked: (episodeId: string) => boolean;
  toggleLike: (episodeId: string) => void;
  startDownload: (episodeId: string) => void;
  removeDownload: (episodeId: string) => void;
  createPlaylist: (name: string) => Playlist;
  deletePlaylist: (playlistId: string) => void;
  toggleInPlaylist: (playlistId: string, episodeId: string) => void;
  toggleInterest: (categoryId: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  submitReview: (showId: string, review: Omit<Review, 'id' | 'author' | 'daysAgo'>) => void;
  toggleShowAlerts: (showId: string) => void;
};

const LibraryContext = createContext<LibraryContextValue | null>(null);

const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((item) => item !== id) : [id, ...list]);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [following, setFollowing] = useState<string[]>(['signal-and-noise', 'deep-space-diaries', 'code-review', 'kitchen-table']);
  const [liked, setLiked] = useState<string[]>([episodesForShow('deep-space-diaries')[1].id]);
  const [downloads, setDownloads] = useState<Record<string, number>>({
    [episodesForShow('signal-and-noise')[1].id]: 1,
  });
  const [playlists, setPlaylists] = useState<Playlist[]>([
    {
      id: 'commute',
      name: 'Morning commute',
      episodeIds: [episodesForShow('the-daily-brief')[0].id, episodesForShow('signal-and-noise')[0].id],
    },
  ]);
  const [interests, setInterests] = useState<string[]>(['technology', 'science', 'food']);
  const [userReviews, setUserReviews] = useState<Record<string, Review>>({});
  const [mutedShows, setMutedShows] = useState<string[]>([]);
  const [settings, setSettings] = useState<Settings>({
    defaultSpeed: 1,
    skipBack: 15,
    skipForward: 30,
    continuousPlayback: true,
    autoDownload: false,
    wifiOnly: true,
    newEpisodeAlerts: true,
    shareWithTimestamp: true,
  });

  const hasActiveDownloads = Object.values(downloads).some((progress) => progress < 1);

  useEffect(() => {
    if (!hasActiveDownloads) return;
    const interval = setInterval(() => {
      setDownloads((current) => {
        const next: Record<string, number> = {};
        for (const [id, progress] of Object.entries(current)) {
          next[id] = progress < 1 ? Math.min(1, progress + 0.2) : progress;
        }
        return next;
      });
    }, 400);
    return () => clearInterval(interval);
  }, [hasActiveDownloads]);

  const value: LibraryContextValue = {
    following,
    liked,
    downloads,
    playlists,
    interests,
    settings,
    userReviews,
    mutedShows,
    isFollowing: (showId) => following.includes(showId),
    toggleFollow: (showId) => setFollowing((list) => toggle(list, showId)),
    isLiked: (episodeId) => liked.includes(episodeId),
    toggleLike: (episodeId) => setLiked((list) => toggle(list, episodeId)),
    startDownload: (episodeId) => setDownloads((current) => ({ ...current, [episodeId]: current[episodeId] ?? 0 })),
    removeDownload: (episodeId) =>
      setDownloads((current) => {
        const { [episodeId]: _removed, ...rest } = current;
        return rest;
      }),
    createPlaylist: (name) => {
      const playlist = { id: `playlist-${Date.now()}`, name, episodeIds: [] };
      setPlaylists((list) => [...list, playlist]);
      return playlist;
    },
    deletePlaylist: (playlistId) => setPlaylists((list) => list.filter((playlist) => playlist.id !== playlistId)),
    toggleInPlaylist: (playlistId, episodeId) =>
      setPlaylists((list) =>
        list.map((playlist) =>
          playlist.id === playlistId
            ? {
                ...playlist,
                episodeIds: playlist.episodeIds.includes(episodeId)
                  ? playlist.episodeIds.filter((id) => id !== episodeId)
                  : [...playlist.episodeIds, episodeId],
              }
            : playlist,
        ),
      ),
    toggleInterest: (categoryId) => setInterests((list) => toggle(list, categoryId)),
    updateSettings: (patch) => setSettings((current) => ({ ...current, ...patch })),
    submitReview: (showId, review) =>
      setUserReviews((current) => ({
        ...current,
        [showId]: { ...review, id: `${showId}-mine`, author: 'You', daysAgo: 0 },
      })),
    toggleShowAlerts: (showId) => setMutedShows((list) => toggle(list, showId)),
  };

  return <LibraryContext value={value}>{children}</LibraryContext>;
}

export function useLibrary() {
  const context = use(LibraryContext);
  if (!context) throw new Error('useLibrary must be used inside LibraryProvider');
  return context;
}
