import { Heart, Brain, Sparkles } from "lucide-react";

export default function WellnessHeader() {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <div className="p-3 rounded-full bg-primary/10">
          <Brain className="w-8 h-8 text-primary" />
        </div>
        <Heart className="w-6 h-6 text-red-400 animate-pulse" />
        <Sparkles className="w-5 h-5 text-accent" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
        Student Wellness Monitor
      </h1>
      
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        Track your daily mood, understand your emotional patterns, and receive personalized 
        recommendations to support your mental wellness journey.
      </p>
      
      <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <span>Mood Tracking</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-secondary"></div>
          <span>AI Analysis</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-accent"></div>
          <span>Personal Insights</span>
        </div>
      </div>
    </div>
  );
}