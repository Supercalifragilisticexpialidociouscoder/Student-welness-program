import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Quote, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const motivationalQuotes = [
  {
    text: "The greatest revolution of our generation is the discovery that human beings, by changing the inner attitudes of their minds, can change the outer aspects of their lives.",
    author: "William James"
  },
  {
    text: "Mental health is not a destination, but a process. It's about how you drive, not where you're going.",
    author: "Noam Shpancer"
  },
  {
    text: "You are not your thoughts. You are the observer of your thoughts.",
    author: "Eckhart Tolle"
  },
  {
    text: "The strongest people are not those who show strength in front of the world, but those who fight battles we know nothing about.",
    author: "Unknown"
  },
  {
    text: "Your current situation is not your final destination. The best is yet to come.",
    author: "Unknown"
  },
  {
    text: "Healing isn't about erasing your story, it's about writing a better ending.",
    author: "Unknown"
  },
  {
    text: "Every day is a fresh start. You can always choose to begin again.",
    author: "Unknown"
  },
  {
    text: "Mental health is just as important as physical health. Both deserve care and attention.",
    author: "Unknown"
  },
  {
    text: "Progress, not perfection. Every small step forward counts.",
    author: "Unknown"
  },
  {
    text: "You have been assigned this mountain to show others it can be moved.",
    author: "Mel Robbins"
  }
];

export default function MotivationalQuote() {
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setCurrentQuote(motivationalQuotes[randomIndex]);
  };

  useEffect(() => {
    // Set random quote on component mount
    getRandomQuote();
  }, []);

  return (
    <Card className="wellness-card bg-gradient-to-r from-accent/10 to-secondary/10 border border-accent/20">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="p-3 bg-accent/20 rounded-full">
            <Quote className="w-6 h-6 text-accent" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <blockquote className="text-foreground font-medium leading-relaxed mb-3">
            "{currentQuote.text}"
          </blockquote>
          <cite className="text-muted-foreground text-sm font-medium">
            — {currentQuote.author}
          </cite>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={getRandomQuote}
          className="flex-shrink-0 p-2 hover:bg-accent/20"
          title="Get new quote"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}