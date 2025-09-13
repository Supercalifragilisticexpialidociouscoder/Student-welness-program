import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Zap } from "lucide-react";
import { MoodEntry } from "./MoodCheckIn";

interface StreakBadgesProps {
  moodEntries: MoodEntry[];
}

export default function StreakBadges({ moodEntries }: StreakBadgesProps) {
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
  const totalEntries = moodEntries.length;
  const positiveEntries = moodEntries.filter(e => e.sentiment === "positive").length;
  const positiveRatio = totalEntries > 0 ? positiveEntries / totalEntries : 0;

  // Calculate badges
  const badges = [];
  
  if (streak >= 3) badges.push({ 
    name: "3 Day Streak", 
    emoji: "🔥", 
    description: "Consistent tracking for 3 days!",
    color: "bg-orange-500"
  });
  
  if (streak >= 7) badges.push({ 
    name: "Week Warrior", 
    emoji: "🏆", 
    description: "Amazing 7-day streak!",
    color: "bg-yellow-500"
  });
  
  if (streak >= 14) badges.push({ 
    name: "Fortnight Hero", 
    emoji: "⭐", 
    description: "Incredible 2-week dedication!",
    color: "bg-purple-500"
  });
  
  if (positiveRatio >= 0.7 && totalEntries >= 5) badges.push({ 
    name: "Positivity Master", 
    emoji: "🌟", 
    description: "70%+ positive moods!",
    color: "bg-green-500"
  });
  
  if (totalEntries >= 10) badges.push({ 
    name: "Consistency King", 
    emoji: "👑", 
    description: "10+ mood entries recorded!",
    color: "bg-blue-500"
  });

  if (totalEntries >= 30) badges.push({ 
    name: "Wellness Legend", 
    emoji: "🎖️", 
    description: "30+ entries - you're a legend!",
    color: "bg-indigo-500"
  });

  return (
    <div className="space-y-6">
      {/* Streak Counter */}
      <Card className="wellness-card bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 rounded-full bg-primary/20">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold gradient-text">
                {streak} Day{streak !== 1 ? 's' : ''}
              </h3>
              <p className="text-muted-foreground">Current Streak</p>
            </div>
            {streak > 0 && <div className="text-3xl animate-pulse">🔥</div>}
          </div>
          
          {streak === 0 ? (
            <p className="text-sm text-muted-foreground">
              Start your wellness journey by checking in daily!
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Keep going! You're building a great habit 💪
            </p>
          )}
        </div>
      </Card>

      {/* Badges */}
      {badges.length > 0 && (
        <Card className="wellness-card">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Trophy className="w-6 h-6 text-accent" />
              <h3 className="text-xl font-bold gradient-text">Your Achievements</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Badges earned through your wellness journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {badges.map((badge, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-muted/30 to-muted/10 border border-border/50 hover:scale-105 transition-transform duration-200"
              >
                <div className="text-3xl">{badge.emoji}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{badge.name}</h4>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                </div>
                <Zap className="w-4 h-4 text-accent" />
              </div>
            ))}
          </div>
          
          {streak >= 3 && (
            <div className="mt-6 text-center">
              <Badge variant="secondary" className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2">
                <span className="mr-2">🎉</span>
                You're on fire! Keep the streak alive!
              </Badge>
            </div>
          )}
        </Card>
      )}

      {/* Motivational Message */}
      <Card className="wellness-card bg-gradient-to-r from-accent/5 to-primary/5 border-accent/20">
        <div className="text-center">
          <div className="text-2xl mb-3">🌱</div>
          <h3 className="font-semibold mb-2">Your Wellness Journey</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {totalEntries === 0 
              ? "Every journey begins with a single step. Start tracking your mood today!"
              : totalEntries < 5
              ? "Great start! Keep building this healthy habit one day at a time."
              : totalEntries < 15
              ? "You're building momentum! Your consistency is paying off."
              : "You're a wellness champion! Your dedication is inspiring."
            }
          </p>
        </div>
      </Card>
    </div>
  );
}