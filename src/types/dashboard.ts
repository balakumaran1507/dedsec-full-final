export interface SolveRateData {
    time: string;
    solves: number;
    attempts: number;
    [key: string]: any;
}

export interface CategoryData {
    name: string;
    value: number;
    [key: string]: any;
}

export interface ActivityData {
    time: string;
    active: number;
    [key: string]: any;
}

export interface ChallengeDistribution {
    name: string;
    value: number;
    fill: string;
    [key: string]: any;
}

export interface MetricData {
    label: string;
    value: string;
    icon: any; // Lucide icon
    status: "normal" | "warning" | "clear";
}

export interface SolveLog {
    time: string;
    event: string;
    type: "success" | "warning" | "info";
}

export interface TeamStat {
    label: string;
    value: string;
    trend: string;
}

export interface TeamMember {
    id: string;
    name: string;
    status: "active" | "standby" | "offline";
    role: "CAPTAIN" | "CORE" | "MEMBER";
    specialty: string;
    lastSeen: string;
    solves: number;
    photoURL?: string;
}

export interface CtfEvent {
    id: string;
    name: string;
    status: "live" | "upcoming" | "complete";
    weight: string;
    start: string;
    duration: string;
    registered: boolean;
    result?: string;
    url?: string;
}

export interface Writeup {
    id: string;
    title: string;
    category: string;
    author: string;
    date: string;
    views: number;
    rating: number;
}

export interface TeamRanking {
    rank: number;
    name: string;
    country: string;
    rating: number;
    ctfs: number;
    points: number;
    highlight?: boolean;
}

export interface ChatChannel {
    id: string;
    name: string;
    unread: number;
}

export interface ChatMessage {
    id: number | string;
    user: string;
    role: "CAPTAIN" | "CORE" | "MEMBER";
    time: string;
    content: string;
}

export interface SolveHistoryData {
    month: string;
    solves: number;
    [key: string]: any;
}

export interface DifficultyStat {
    name: string;
    count: number;
    [key: string]: any;
}

export interface RecentSolve {
    name: string;
    category: string;
    points: number;
    time: string;
}

export interface Badge {
    name: string;
    desc: string;
    unlocked: boolean;
}

export interface Announcement {
    id: number | string;
    title: string;
    type: "urgent" | "info" | "normal" | "success";
    pinned: boolean;
    date: string;
    author: string;
    content: string;
}
