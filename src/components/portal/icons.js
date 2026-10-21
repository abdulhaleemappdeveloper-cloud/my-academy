import {
  Activity, Award, Banknote, BarChart3, Bell, BookOpen, Briefcase, Building2, Bus, CalendarClock,
  CalendarDays, ClipboardCheck, ClipboardList, Cog, Coins, Database, FileText, FolderOpen,
  GraduationCap, HeartPulse, History, Image as ImageIcon, Inbox, KeyRound, Landmark, Layers,
  LayoutDashboard, Library, LifeBuoy, ListChecks, Megaphone, MessagesSquare, Package, PanelsTopLeft,
  PenLine, Plug, Receipt, School, ScrollText, ShieldCheck, SlidersHorizontal, Sparkles, Target,
  Timer, TrendingUp, Trophy, UserCog, UserPlus, Users, Wallet,
} from 'lucide-react';

/** Icon registry so navigation definitions stay declarative. */
export const ICONS = {
  Activity, Award, Banknote, BarChart3, Bell, BookOpen, Briefcase, Building2, Bus, CalendarClock,
  CalendarDays, ClipboardCheck, ClipboardList, Cog, Coins, Database, FileText, FolderOpen,
  GraduationCap, HeartPulse, History, ImageIcon, Inbox, KeyRound, Landmark, Layers, LayoutDashboard,
  Library, LifeBuoy, ListChecks, Megaphone, MessagesSquare, Package, PanelsTopLeft, PenLine, Plug,
  Receipt, School, ScrollText, ShieldCheck, SlidersHorizontal, Sparkles, Target, Timer, TrendingUp,
  Trophy, UserCog, UserPlus, Users, Wallet,
};

export const icon = (name) => ICONS[name] || LayoutDashboard;