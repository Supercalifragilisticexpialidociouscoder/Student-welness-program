import { useState, useEffect } from "react";
import MoodCheckIn, { MoodEntry } from "@/components/MoodCheckIn";
import MoodDashboard from "@/components/MoodDashboard";
import MoodResult from "@/components/MoodResult";
import MoodSummary from "@/components/MoodSummary";
import WellnessHeader from "@/components/WellnessHeader";
import MotivationalQuote from "@/components/MotivationalQuote";
import Footer from "@/components/Footer";
import DashboardSidebar from "@/components/DashboardSidebar";
import StreakBadges from "@/components/StreakBadges";
import { Button } from "@/components/ui/button";
import { Download, BarChart3, Heart, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [latestEntry, setLatestEntry] = useState<MoodEntry | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { toast } = useToast();

  // Load mood entries and theme from localStorage on component mount
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
    
    const savedTheme = localStorage.getItem("wellness-theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
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

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("wellness-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("wellness-theme", "light");
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
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
      {/* Dashboard Sidebar */}
      <DashboardSidebar 
        moodEntries={moodEntries}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-80'}`}>
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold">Wellness Monitor</h1>
          <div className="w-8"></div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <WellnessHeader />
          
          {/* Dashboard Grid Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mb-8">
            {/* Main Content Area */}
            <div className="xl:col-span-3 space-y-8">
              {/* Mood Check-in */}
              <MoodCheckIn onMoodSubmit={handleMoodSubmit} />
              
              {/* Show latest mood result if available */}
              {latestEntry && (
                <MoodResult latestEntry={latestEntry} />
              )}

              {/* Charts and Analytics Section */}
              {moodEntries.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold gradient-text flex items-center">
                      <BarChart3 className="w-6 h-6 mr-2" />
                      📊 Interactive Analytics Dashboard
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
              <MotivationalQuote />
            </div>
            
            {/* Right Sidebar - Gamification & Summary */}
            <div className="xl:col-span-1 space-y-6">
              <StreakBadges moodEntries={moodEntries} />
              <MoodSummary moodEntries={moodEntries} />
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Index;
