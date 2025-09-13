import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MoodCheckIn, { MoodEntry } from "@/components/MoodCheckIn";
import MoodDashboard from "@/components/MoodDashboard";
import WellnessHeader from "@/components/WellnessHeader";
import { Button } from "@/components/ui/button";
import { Download, BarChart3, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [activeTab, setActiveTab] = useState("checkin");
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
    
    // Auto-switch to dashboard after submission
    setTimeout(() => {
      setActiveTab("dashboard");
    }, 2000);
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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <WellnessHeader />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="checkin" className="flex items-center space-x-2">
                <PlusCircle className="w-4 h-4" />
                <span>Check-in</span>
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </TabsTrigger>
            </TabsList>
            
            {moodEntries.length > 0 && (
              <Button
                onClick={exportData}
                variant="outline"
                className="mt-4 sm:mt-0 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </Button>
            )}
          </div>

          <TabsContent value="checkin" className="space-y-6">
            <MoodCheckIn onMoodSubmit={handleMoodSubmit} />
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <MoodDashboard moodEntries={moodEntries} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
