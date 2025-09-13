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
    icon: Smile,
    description: "Feeling good and positive",
  },
  {
    type: "sad" as MoodType,
    label: "Sad",
    icon: Frown,
    description: "Feeling down or low",
  },
  {
    type: "stressed" as MoodType,
    label: "Stressed",
    icon: Zap,
    description: "Feeling overwhelmed or anxious",
  },
  {
    type: "neutral" as MoodType,
    label: "Neutral",
    icon: Minus,
    description: "Feeling balanced or okay",
  },
];

// Simple AI sentiment analysis function
const analyzeMood = (mood: MoodType): { sentiment: "positive" | "negative" | "neutral"; recommendation: string } => {
  switch (mood) {
    case "happy":
      return {
        sentiment: "positive",
        recommendation: "Great job! Keep up the positive energy. Consider sharing your joy with friends or celebrating your achievements."
      };
    case "sad":
      return {
        sentiment: "negative",
        recommendation: "It's okay to feel sad sometimes. Try taking a short walk, listening to uplifting music, or talking to a friend."
      };
    case "stressed":
      return {
        sentiment: "negative",
        recommendation: "Take a deep breath. Consider trying a 5-minute meditation, organizing your tasks, or doing some light exercise."
      };
    case "neutral":
      return {
        sentiment: "neutral",
        recommendation: "You're in a balanced state. This is a good time to plan ahead or try something new that might spark joy."
      };
    default:
      return {
        sentiment: "neutral",
        recommendation: "Take care of yourself and remember that every feeling is valid."
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
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold gradient-text mb-2">
          How are you feeling today?
        </h2>
        <p className="text-muted-foreground">
          Select your current mood to track your wellness journey
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {moodOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedMood === option.type;
          
          return (
            <div
              key={option.type}
              className={`mood-button mood-${option.type} ${
                isSelected ? "ring-2 ring-ring ring-offset-2" : ""
              }`}
              onClick={() => handleMoodSelect(option.type)}
            >
              <div className="flex flex-col items-center space-y-2">
                <Icon className="w-8 h-8" />
                <span className="font-semibold text-lg">{option.label}</span>
                <span className="text-sm opacity-90">{option.description}</span>
              </div>
            </div>
          );
        })}
      </div>

      {selectedMood && (
        <div className="text-center">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold"
            style={{ background: "var(--gradient-primary)" }}
          >
            {isSubmitting ? "Analyzing your mood..." : "Submit Mood Check-in"}
          </Button>
        </div>
      )}
    </Card>
  );
}

export type { MoodEntry };