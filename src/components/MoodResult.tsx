import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoodEntry } from "./MoodCheckIn";
import { CheckCircle, AlertCircle, MinusCircle, Sparkles } from "lucide-react";

interface MoodResultProps {
  latestEntry: MoodEntry;
}

const getSentimentIcon = (sentiment: string) => {
  switch (sentiment) {
    case "positive":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "negative":
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    default:
      return <MinusCircle className="w-5 h-5 text-gray-500" />;
  }
};

const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case "positive":
      return "text-green-600 bg-green-50 border-green-200";
    case "negative":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

export default function MoodResult({ latestEntry }: MoodResultProps) {
  return (
    <Card className="wellness-card bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-2 border-primary/20">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Sparkles className="w-6 h-6 text-accent animate-pulse" />
          <h3 className="text-2xl font-bold gradient-text">AI Analysis Complete</h3>
          <Sparkles className="w-6 h-6 text-accent animate-pulse" />
        </div>
        
        <div className="flex items-center justify-center space-x-4 mb-6">
          <Badge 
            variant="secondary"
            className={`mood-${latestEntry.mood} text-white text-lg px-4 py-2 font-bold`}
          >
            {latestEntry.mood.charAt(0).toUpperCase() + latestEntry.mood.slice(1)} Mood
          </Badge>
          
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 ${getSentimentColor(latestEntry.sentiment)}`}>
            {getSentimentIcon(latestEntry.sentiment)}
            <span className="font-semibold">
              {latestEntry.sentiment.charAt(0).toUpperCase() + latestEntry.sentiment.slice(1)} Sentiment
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h4 className="text-lg font-semibold mb-3 text-foreground flex items-center">
          <span className="mr-2">🤖</span>
          Personalized AI Recommendation
        </h4>
        <p className="text-muted-foreground leading-relaxed text-base">
          {latestEntry.recommendation}
        </p>
        
        <div className="mt-4 text-sm text-muted-foreground">
          <span className="flex items-center">
            <span className="mr-2">⏰</span>
            Recorded: {latestEntry.timestamp.toLocaleDateString()} at {latestEntry.timestamp.toLocaleTimeString()}
          </span>
        </div>
      </div>
    </Card>
  );
}