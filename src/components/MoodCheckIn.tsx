import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smile, Frown, Zap, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export type MoodType = "happy" | "sad" | "stressed" | "neutral";

interface MoodEntry {
  id: string;
  mood: MoodType;
  sentiment: "positive" | "negative" | "neutral";
  recommendation: string;
  timestamp: Date;
}

interface MoodCheckInProps {
  onMoodSubmit: (entry: MoodEntry) => void;
}

const moodOptions = [
  {
    type: "happy" as MoodType,
    label: "Happy",
    emoji: "😊",
    icon: Smile,
    description: "Feeling good and positive",
    color: "from-green-400 to-green-500"
  },
  {
    type: "sad" as MoodType,
    label: "Sad", 
    emoji: "😢",
    icon: Frown,
    description: "Feeling down or low",
    color: "from-blue-400 to-blue-500"
  },
  {
    type: "stressed" as MoodType,
    label: "Stressed",
    emoji: "😰",
    icon: Zap,
    description: "Feeling overwhelmed or anxious",
    color: "from-red-400 to-red-500"
  },
  {
    type: "neutral" as MoodType,
    label: "Neutral",
    emoji: "😐",
    icon: Minus,
    description: "Feeling balanced or okay",
    color: "from-gray-400 to-gray-500"
  },
];

// Enhanced AI sentiment analysis with more detailed recommendations
const analyzeMood = (mood: MoodType): { sentiment: "positive" | "negative" | "neutral"; recommendation: string } => {
  switch (mood) {
    case "happy":
      return {
        sentiment: "positive",
        recommendation: "🌟 Amazing! Your positive energy is contagious. Consider sharing this joy with friends, celebrating your achievements, or using this momentum to tackle a challenging task. Keep shining!"
      };
    case "sad":
      return {
        sentiment: "negative", 
        recommendation: "🤗 It's completely normal to feel sad sometimes. Try taking a gentle 10-minute walk outside, listening to your favorite uplifting playlist, or reaching out to a trusted friend. Remember, this feeling will pass."
      };
    case "stressed":
      return {
        sentiment: "negative",
        recommendation: "🧘‍♂️ Take a deep breath - you've got this! Try the 4-7-8 breathing technique, organize your tasks by priority, or do 5 minutes of stretching. Consider breaking big tasks into smaller, manageable steps."
      };
    case "neutral":
      return {
        sentiment: "neutral",
        recommendation: "⚖️ You're in a balanced, reflective state - that's valuable! This is a perfect time to plan ahead, try something new that might spark joy, or practice gratitude by listing 3 things you're thankful for today."
      };
    default:
      return {
        sentiment: "neutral",
        recommendation: "💙 Remember that every emotion is valid and part of your human experience. Take care of yourself and be kind to your feelings."
      };
  }
};

export default function MoodCheckIn({ onMoodSubmit }: MoodCheckInProps) {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
  };

  const handleSubmit = async () => {
    if (!selectedMood) return;

    setIsSubmitting(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      const analysis = analyzeMood(selectedMood);
      const entry: MoodEntry = {
        id: crypto.randomUUID(),
        mood: selectedMood,
        sentiment: analysis.sentiment,
        recommendation: analysis.recommendation,
        timestamp: new Date(),
      };

      onMoodSubmit(entry);
      
      toast({
        title: "Mood recorded successfully!",
        description: "Your wellness journey continues. Check your dashboard for insights.",
      });

      setSelectedMood(null);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Card className="wellness-card">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold gradient-text mb-3">
          How are you feeling today?
        </h2>
        <p className="text-muted-foreground text-lg">
          Track your daily mood & boost your wellness 🌱
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {moodOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedMood === option.type;
          
          return (
            <div
              key={option.type}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 ${
                isSelected 
                  ? "ring-4 ring-primary ring-offset-4 scale-105 shadow-2xl" 
                  : "hover:scale-105 hover:shadow-xl"
              }`}
              onClick={() => handleMoodSelect(option.type)}
            >
              <div className={`mood-${option.type} p-6 h-full min-h-[140px] flex flex-col items-center justify-center space-y-3 relative`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="text-5xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                  {option.emoji}
                </div>
                
                <Icon className="w-6 h-6 text-white/90" />
                
                <div className="text-center relative z-10">
                  <span className="font-bold text-xl text-white block">{option.label}</span>
                  <span className="text-sm text-white/80 block mt-1 px-2 leading-tight">
                    {option.description}
                  </span>
                </div>
                
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedMood && (
        <div className="text-center bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-xl border border-border/50">
          <div className="mb-4">
            <div className="text-2xl mb-2">
              {moodOptions.find(option => option.type === selectedMood)?.emoji}
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              Mood: {selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)}
            </h3>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-4 text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            style={{ background: "var(--gradient-primary)" }}
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing your mood...</span>
              </div>
            ) : (
              "🧠 Analyze My Mood"
            )}
          </Button>
        </div>
      )}
    </Card>
  );
}

export type { MoodEntry };