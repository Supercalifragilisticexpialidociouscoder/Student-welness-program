import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MoodCheckIn, { MoodEntry } from "@/components/MoodCheckIn";
import MoodDashboard from "@/components/MoodDashboard";
import MoodResult from "@/components/MoodResult";
import MoodSummary from "@/components/MoodSummary";
import WellnessHeader from "@/components/WellnessHeader";
import MotivationalQuote from "@/components/MotivationalQuote";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Download, BarChart3, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [latestEntry, setLatestEntry] = useState<MoodEntry | null>(null);
  const { toast } = useToast();

  // Load mood entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem("studentWellnessMoods");
    if (savedEntries) {
      try {
        const parsedEntries = JSON.parse(savedEntries).map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }));
        setMoodEntries(parsedEntries);
      } catch (error) {
        console.error("Error parsing saved mood entries:", error);
      }
    }
  }, []);

  // Save mood entries to localStorage whenever they change
  useEffect(() => {
    if (moodEntries.length > 0) {
      localStorage.setItem("studentWellnessMoods", JSON.stringify(moodEntries));
    }
  }, [moodEntries]);

  const handleMoodSubmit = (entry: MoodEntry) => {
    setMoodEntries(prev => [...prev, entry]);
    setLatestEntry(entry);
  };

  const exportData = () => {
    if (moodEntries.length === 0) {
      toast({
        title: "No data to export",
        description: "Please record some mood entries first.",
        variant: "destructive"
      });
      return;
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      totalEntries: moodEntries.length,
      entries: moodEntries.map(entry => ({
        date: entry.timestamp.toISOString(),
        mood: entry.mood,
        sentiment: entry.sentiment,
        recommendation: entry.recommendation
      }))
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `wellness-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Data exported successfully!",
      description: "Your wellness data has been downloaded."
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <WellnessHeader />
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Mood Check-in */}
          <div className="lg:col-span-2">
            <MoodCheckIn onMoodSubmit={handleMoodSubmit} />
            
            {/* Show latest mood result if available */}
            {latestEntry && (
              <div className="mt-8">
                <MoodResult latestEntry={latestEntry} />
              </div>
            )}
          </div>
          
          {/* Right Column - Mood Summary */}
          <div>
            <MoodSummary moodEntries={moodEntries} />
          </div>
        </div>

        {/* Charts and Analytics Section */}
        {moodEntries.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold gradient-text flex items-center">
                <BarChart3 className="w-6 h-6 mr-2" />
                📊 Wellness Analytics Dashboard
              </h2>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-muted-foreground">
                  <Heart className="w-4 h-4 inline mr-1 text-red-400" />
                  {moodEntries.length} mood{moodEntries.length !== 1 ? 's' : ''} tracked
                </div>
                <Button
                  onClick={exportData}
                  variant="outline"
                  className="flex items-center space-x-2 hover:bg-primary/5"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Data</span>
                </Button>
              </div>
            </div>
            
            <MoodDashboard moodEntries={moodEntries} />
          </div>
        )}

        {/* Motivational Quote */}
        <div className="mb-8">
          <MotivationalQuote />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Index;
