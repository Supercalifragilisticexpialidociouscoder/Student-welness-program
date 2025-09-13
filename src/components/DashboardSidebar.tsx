import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  BarChart3, 
  Heart, 
  Settings, 
  User, 
  Moon, 
  Sun,
  Menu,
  X,
  Trophy,
  Target,
  Calendar
} from "lucide-react";
import { MoodEntry } from "./MoodCheckIn";

interface DashboardSidebarProps {
  moodEntries: MoodEntry[];
  isDark: boolean;
  onToggleTheme: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function DashboardSidebar({ 
  moodEntries, 
  isDark, 
  onToggleTheme,
  isCollapsed,
  onToggleCollapse 
}: DashboardSidebarProps) {
  // Calculate streak
  const calculateStreak = () => {
    if (moodEntries.length === 0) return 0;
    
    const today = new Date();
    const sortedEntries = [...moodEntries].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    let streak = 0;
    let currentDate = new Date(today);
    
    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.timestamp);
      const diffTime = currentDate.getTime() - entryDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        streak++;
        currentDate = new Date(entryDate);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const streak = calculateStreak();
  
  // Calculate badges
  const getBadges = () => {
    const badges = [];
    const totalEntries = moodEntries.length;
    const positiveEntries = moodEntries.filter(e => e.sentiment === "positive").length;
    const positiveRatio = totalEntries > 0 ? positiveEntries / totalEntries : 0;
    
    if (streak >= 3) badges.push({ name: "3 Day Streak", icon: "🔥", color: "bg-orange-500" });
    if (streak >= 7) badges.push({ name: "Week Warrior", icon: "🏆", color: "bg-yellow-500" });
    if (streak >= 14) badges.push({ name: "Fortnight Hero", icon: "⭐", color: "bg-purple-500" });
    if (positiveRatio >= 0.7) badges.push({ name: "Positivity Master", icon: "🌟", color: "bg-green-500" });
    if (totalEntries >= 10) badges.push({ name: "Consistency King", icon: "👑", color: "bg-blue-500" });
    
    return badges;
  };

  const badges = getBadges();

  const navigation = [
    { name: "Dashboard", icon: BarChart3, current: true },
    { name: "Profile", icon: User, current: false },
    { name: "Settings", icon: Settings, current: false },
  ];

  if (isCollapsed) {
    return (
      <div className="fixed left-0 top-0 h-full w-16 bg-sidebar border-r border-sidebar-border z-40 flex flex-col">
        <div className="p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="w-8 h-8 p-0"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex-1 flex flex-col items-center space-y-4 p-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          
          <div className="space-y-2">
            {navigation.map((item) => (
              <Button
                key={item.name}
                variant={item.current ? "default" : "ghost"}
                size="sm"
                className="w-10 h-10 p-0"
              >
                <item.icon className="w-4 h-4" />
              </Button>
            ))}
          </div>
        </div>
        
        <div className="p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleTheme}
            className="w-10 h-10 p-0"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed left-0 top-0 h-full w-80 bg-sidebar border-r border-sidebar-border z-40 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-sidebar-foreground">Wellness</h2>
              <p className="text-xs text-sidebar-foreground/60">Monitor</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Streak Counter */}
      <div className="p-6 border-b border-sidebar-border">
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-primary/20">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-sidebar-foreground/80">Current Streak</p>
              <p className="text-2xl font-bold text-sidebar-foreground flex items-center">
                {streak} 
                <span className="text-sm ml-1">day{streak !== 1 ? 's' : ''}</span>
                {streak > 0 && <span className="ml-2">🔥</span>}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="p-6 border-b border-sidebar-border">
          <h3 className="text-sm font-medium text-sidebar-foreground mb-3 flex items-center">
            <Trophy className="w-4 h-4 mr-2" />
            Your Badges
          </h3>
          <div className="space-y-2">
            {badges.slice(0, 3).map((badge, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-sidebar-accent/50">
                <span className="text-lg">{badge.icon}</span>
                <span className="text-sm text-sidebar-foreground font-medium">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 p-6">
        <nav className="space-y-2">
          {navigation.map((item) => (
            <Button
              key={item.name}
              variant={item.current ? "default" : "ghost"}
              className="w-full justify-start"
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.name}
            </Button>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-sidebar-foreground/60">
            <Calendar className="w-4 h-4" />
            <span>{moodEntries.length} total entries</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleTheme}
            className="p-2"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}