import { createContext, use, useEffect, useReducer, type ReactNode } from 'react';

import { episodeById, episodesForShow } from '@/data/podcasts';
import { useLibrary } from '@/store/library';

export type SleepTimer = { kind: 'off' } | { kind: 'minutes'; remaining: number; total: number } | { kind: 'end' };

type State = {
  currentId: string | null;
  isPlaying: boolean;
  speed: number;
  queue: string[];
  sleepTimer: SleepTimer;
  positions: Record<string, number>;
  completed: string[];
  history: string[];
};

type Action =
  | { type: 'play'; episodeId: string; startAt?: number }
  | { type: 'toggle' }
  | { type: 'pause' }
  | { type: 'seek'; seconds: number }
  | { type: 'skip'; delta: number }
  | { type: 'setSpeed'; speed: number }
  | { type: 'setSleepTimer'; timer: SleepTimer }
  | { type: 'addToQueue'; episodeId: string }
  | { type: 'playNext'; episodeId: string }
  | { type: 'removeFromQueue'; episodeId: string }
  | { type: 'moveInQueue'; episodeId: string; direction: -1 | 1 }
  | { type: 'clearQueue' }
  | { type: 'markPlayed'; episodeId: string }
  | { type: 'markUnplayed'; episodeId: string }
  | { type: 'clearHistory' }
  | { type: 'tick'; continuous: boolean };

const without = (list: string[], id: string) => list.filter((item) => item !== id);

function restart(state: State, episodeId: string, at = 0): State {
  return {
    ...state,
    completed: without(state.completed, episodeId),
    positions: { ...state.positions, [episodeId]: at },
  };
}

function start(state: State, episodeId: string): State {
  const next: State = {
    ...state,
    currentId: episodeId,
    isPlaying: true,
    queue: without(state.queue, episodeId),
    history: [episodeId, ...without(state.history, episodeId)],
  };
  return state.completed.includes(episodeId) ? restart(next, episodeId) : next;
}

function seekTo(state: State, resolve: (position: number) => number): State {
  const { currentId } = state;
  if (!currentId) return state;
  const { duration } = episodeById[currentId];
  const position = Math.max(0, Math.min(duration - 1, resolve(state.positions[currentId] ?? 0)));
  return restart(state, currentId, position);
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'play': {
      const next = start(state, action.episodeId);
      return action.startAt === undefined ? next : restart(next, action.episodeId, action.startAt);
    }
    case 'toggle':
      if (state.isPlaying) return { ...state, isPlaying: false };
      return state.currentId ? start(state, state.currentId) : state;
    case 'pause':
      return { ...state, isPlaying: false };
    case 'seek':
      return seekTo(state, () => action.seconds);
    case 'skip':
      return seekTo(state, (position) => position + action.delta);
    case 'setSpeed':
      return { ...state, speed: action.speed };
    case 'setSleepTimer':
      return { ...state, sleepTimer: action.timer };
    case 'addToQueue':
      return state.queue.includes(action.episodeId) || action.episodeId === state.currentId
        ? state
        : { ...state, queue: [...state.queue, action.episodeId] };
    case 'playNext':
      return { ...state, queue: [action.episodeId, ...without(state.queue, action.episodeId)] };
    case 'removeFromQueue':
      return { ...state, queue: without(state.queue, action.episodeId) };
    case 'moveInQueue': {
      const index = state.queue.indexOf(action.episodeId);
      const target = index + action.direction;
      if (index < 0 || target < 0 || target >= state.queue.length) return state;
      const queue = [...state.queue];
      [queue[index], queue[target]] = [queue[target], queue[index]];
      return { ...state, queue };
    }
    case 'clearQueue':
      return { ...state, queue: [] };
    case 'markPlayed':
      return {
        ...state,
        isPlaying: action.episodeId === state.currentId ? false : state.isPlaying,
        completed: [...without(state.completed, action.episodeId), action.episodeId],
        positions: { ...state.positions, [action.episodeId]: episodeById[action.episodeId].duration },
      };
    case 'markUnplayed':
      return restart(state, action.episodeId);
    case 'clearHistory':
      return { ...state, history: [] };
    case 'tick': {
      const { currentId } = state;
      if (!state.isPlaying || !currentId) return state;
      const { duration } = episodeById[currentId];
      const position = (state.positions[currentId] ?? 0) + state.speed;
      let next: State = { ...state, positions: { ...state.positions, [currentId]: Math.min(position, duration) } };

      if (next.sleepTimer.kind === 'minutes') {
        const remaining = Math.max(0, next.sleepTimer.remaining - 1);
        next =
          remaining === 0
            ? { ...next, isPlaying: false, sleepTimer: { kind: 'off' } }
            : { ...next, sleepTimer: { ...next.sleepTimer, remaining } };
      }

      if (position < duration) return next;

      next = { ...next, completed: [...without(next.completed, currentId), currentId] };
      if (next.sleepTimer.kind === 'end') return { ...next, isPlaying: false, sleepTimer: { kind: 'off' } };
      const [upNext] = next.queue;
      return action.continuous && upNext ? start(next, upNext) : { ...next, isPlaying: false };
    }
  }
}

const initialCurrent = episodesForShow('signal-and-noise')[0].id;

function createInitialState(speed: number): State {
  return {
    currentId: initialCurrent,
    isPlaying: false,
    speed,
    queue: [episodesForShow('code-review')[0].id, episodesForShow('kitchen-table')[0].id],
    sleepTimer: { kind: 'off' },
    positions: {
      [initialCurrent]: 754,
      [episodesForShow('deep-space-diaries')[0].id]: 1320,
      [episodesForShow('founders-unfiltered')[1].id]: 410,
    },
    completed: [episodesForShow('signal-and-noise')[2].id],
    history: [initialCurrent, episodesForShow('deep-space-diaries')[0].id, episodesForShow('founders-unfiltered')[1].id],
  };
}

type PlayerContextValue = {
  currentId: string | null;
  isPlaying: boolean;
  speed: number;
  queue: string[];
  sleepTimer: SleepTimer;
  history: string[];
  play: (episodeId: string, startAt?: number) => void;
  toggle: () => void;
  pause: () => void;
  seek: (seconds: number) => void;
  skip: (delta: number) => void;
  setSpeed: (speed: number) => void;
  setSleepTimer: (timer: SleepTimer) => void;
  addToQueue: (episodeId: string) => void;
  playNext: (episodeId: string) => void;
  removeFromQueue: (episodeId: string) => void;
  moveInQueue: (episodeId: string, direction: -1 | 1) => void;
  clearQueue: () => void;
  markPlayed: (episodeId: string) => void;
  markUnplayed: (episodeId: string) => void;
  clearHistory: () => void;
};

type ProgressContextValue = {
  positions: Record<string, number>;
  completed: string[];
};

const PlayerContext = createContext<PlayerContextValue | null>(null);
const ProgressContext = createContext<ProgressContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const { settings } = useLibrary();
  const [state, dispatch] = useReducer(reducer, settings.defaultSpeed, createInitialState);
  const { currentId, isPlaying } = state;
  const continuous = settings.continuousPlayback;

  useEffect(() => {
    if (!isPlaying || !currentId) return;
    const interval = setInterval(() => dispatch({ type: 'tick', continuous }), 1000);
    return () => clearInterval(interval);
  }, [isPlaying, currentId, continuous]);

  const value: PlayerContextValue = {
    currentId,
    isPlaying,
    speed: state.speed,
    queue: state.queue,
    sleepTimer: state.sleepTimer,
    history: state.history,
    play: (episodeId, startAt) => dispatch({ type: 'play', episodeId, startAt }),
    toggle: () => dispatch({ type: 'toggle' }),
    pause: () => dispatch({ type: 'pause' }),
    seek: (seconds) => dispatch({ type: 'seek', seconds }),
    skip: (delta) => dispatch({ type: 'skip', delta }),
    setSpeed: (speed) => dispatch({ type: 'setSpeed', speed }),
    setSleepTimer: (timer) => dispatch({ type: 'setSleepTimer', timer }),
    addToQueue: (episodeId) => dispatch({ type: 'addToQueue', episodeId }),
    playNext: (episodeId) => dispatch({ type: 'playNext', episodeId }),
    removeFromQueue: (episodeId) => dispatch({ type: 'removeFromQueue', episodeId }),
    moveInQueue: (episodeId, direction) => dispatch({ type: 'moveInQueue', episodeId, direction }),
    clearQueue: () => dispatch({ type: 'clearQueue' }),
    markPlayed: (episodeId) => dispatch({ type: 'markPlayed', episodeId }),
    markUnplayed: (episodeId) => dispatch({ type: 'markUnplayed', episodeId }),
    clearHistory: () => dispatch({ type: 'clearHistory' }),
  };

  return (
    <PlayerContext value={value}>
      <ProgressContext value={{ positions: state.positions, completed: state.completed }}>{children}</ProgressContext>
    </PlayerContext>
  );
}

export function usePlayer() {
  const context = use(PlayerContext);
  if (!context) throw new Error('usePlayer must be used inside PlayerProvider');
  return context;
}

export function useProgress() {
  const context = use(ProgressContext);
  if (!context) throw new Error('useProgress must be used inside PlayerProvider');
  return context;
}

export function useEpisodeProgress(episodeId: string) {
  const { positions, completed } = useProgress();
  const duration = episodeById[episodeId]?.duration ?? 1;
  const position = positions[episodeId] ?? 0;
  const isCompleted = completed.includes(episodeId);
  return {
    position,
    isCompleted,
    isStarted: position > 0 && !isCompleted,
    fraction: isCompleted ? 1 : Math.min(1, position / duration),
    remaining: Math.max(0, duration - position),
  };
}
