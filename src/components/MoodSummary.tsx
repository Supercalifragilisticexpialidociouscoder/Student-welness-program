import { Card } from "@/components/ui/card";
import { MoodEntry } from "./MoodCheckIn";
import { TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";

interface MoodSummaryProps {
  moodEntries: MoodEntry[];
}

export default function MoodSummary({ moodEntries }: MoodSummaryProps) {
  if (moodEntries.length === 0) {
    return (
      <Card className="wellness-card text-center py-8">
        <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No mood data yet</h3>
        <p className="text-muted-foreground text-sm">
          Start tracking your wellness journey!
        </p>
      </Card>
    );
  }

  const totalEntries = moodEntries.length;
  const positiveCount = moodEntries.filter(entry => entry.sentiment === "positive").length;
  const negativeCount = moodEntries.filter(entry => entry.sentiment === "negative").length;
  const neutralCount = moodEntries.filter(entry => entry.sentiment === "neutral").length;

  const positivePercentage = Math.round((positiveCount / totalEntries) * 100);
  const negativePercentage = Math.round((negativeCount / totalEntries) * 100);
  const neutralPercentage = Math.round((neutralCount / totalEntries) * 100);

  return (
    <Card className="wellness-card">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold gradient-text mb-2">📊 Mood Summary</h3>
        <p className="text-muted-foreground">Your emotional wellness overview</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600 mb-1">{positiveCount}</div>
          <div className="text-sm font-medium text-green-700 dark:text-green-400">Positive</div>
          <div className="text-xs text-green-600 mt-1">{positivePercentage}%</div>
        </div>

        <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
          <div className="flex items-center justify-center mb-2">
            <TrendingDown className="w-6 h-6 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600 mb-1">{negativeCount}</div>
          <div className="text-sm font-medium text-red-700 dark:text-red-400">Negative</div>
          <div className="text-xs text-red-600 mt-1">{negativePercentage}%</div>
        </div>

        <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/20 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-center mb-2">
            <Minus className="w-6 h-6 text-gray-600" />
          </div>
          <div className="text-2xl font-bold text-gray-600 mb-1">{neutralCount}</div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-400">Neutral</div>
          <div className="text-xs text-gray-600 mt-1">{neutralPercentage}%</div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <div className="text-sm text-muted-foreground">
          Total Entries: <span className="font-semibold text-foreground">{totalEntries}</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Keep tracking to build better insights! 🌟
        </div>
      </div>
    </Card>
  );
}