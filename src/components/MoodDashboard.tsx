import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoodEntry } from "./MoodCheckIn";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { Calendar, TrendingUp, Heart, Brain, Activity, Zap } from "lucide-react";

interface MoodDashboardProps {
  moodEntries: MoodEntry[];
}

const moodColors = {
  happy: "#4ade80",
  sad: "#60a5fa", 
  stressed: "#f87171",
  neutral: "#a1a1aa"
};

const sentimentColors = {
  positive: "#22c55e",
  negative: "#ef4444",
  neutral: "#6b7280"
};

export default function MoodDashboard({ moodEntries }: MoodDashboardProps) {
  // Prepare chart data
  const chartData = moodEntries.map((entry, index) => ({
    day: `Day ${index + 1}`,
    date: entry.timestamp.toLocaleDateString(),
    mood: entry.mood,
    moodValue: entry.mood === "happy" ? 4 : entry.mood === "neutral" ? 3 : entry.mood === "sad" ? 2 : 1,
    sentiment: entry.sentiment
  })).reverse();

  // Pie chart data for mood distribution
  const moodDistribution = Object.entries(
    moodEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([mood, count]) => ({
    name: mood.charAt(0).toUpperCase() + mood.slice(1),
    value: count,
    color: moodColors[mood as keyof typeof moodColors]
  }));

  // Calculate statistics
  const totalEntries = moodEntries.length;
  const positiveEntries = moodEntries.filter(entry => entry.sentiment === "positive").length;
  const positivePercentage = totalEntries > 0 ? Math.round((positiveEntries / totalEntries) * 100) : 0;

  const latestEntry = moodEntries[moodEntries.length - 1];

  if (totalEntries === 0) {
    return (
      <Card className="wellness-card text-center py-16">
        <div className="max-w-md mx-auto">
          <Brain className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
          <h3 className="text-2xl font-bold mb-4">Start Your Wellness Journey</h3>
          <p className="text-muted-foreground leading-relaxed">
            No mood entries yet! Complete your first mood check-in above to see your personalized 
            wellness dashboard with insights, trends, and AI-powered recommendations.
          </p>
          <div className="mt-6 text-sm text-muted-foreground">
            <span className="bg-primary/10 px-3 py-1 rounded-full">
              🎯 Track • 📊 Analyze • 🌱 Improve
            </span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="wellness-card">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-full bg-primary/10">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Check-ins</p>
              <p className="text-2xl font-bold">{totalEntries}</p>
            </div>
          </div>
        </Card>

        <Card className="wellness-card">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-full bg-secondary/10">
              <Heart className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Positive Days</p>
              <p className="text-2xl font-bold">{positivePercentage}%</p>
            </div>
          </div>
        </Card>

        <Card className="wellness-card">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-full bg-accent/10">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Mood</p>
              <Badge 
                variant="secondary" 
                className={`mood-${latestEntry?.mood} text-white`}
              >
                {latestEntry?.mood.charAt(0).toUpperCase() + latestEntry?.mood.slice(1)}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Enhanced Mood Trend Chart */}
        <Card className="wellness-card lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary" />
            📈 Mood Trend Over Time
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  domain={[0, 5]}
                  ticks={[1, 2, 3, 4]}
                  tickFormatter={(value) => {
                    const moods = ["", "Stressed", "Sad", "Neutral", "Happy"];
                    return moods[value] || "";
                  }}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  labelFormatter={(label, payload) => {
                    const entry = payload?.[0]?.payload;
                    return entry ? `${label} (${entry.date})` : label;
                  }}
                  formatter={(value: any, name) => {
                    const moods = ["", "😰 Stressed", "😢 Sad", "😐 Neutral", "😊 Happy"];
                    const entry = chartData.find(d => d.moodValue === value);
                    return [
                      moods[value] || value, 
                      `Sentiment: ${entry?.sentiment || 'unknown'}`
                    ];
                  }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    boxShadow: "0 8px 32px hsl(225 15% 15% / 0.1)"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="moodValue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={4}
                  fill="url(#moodGradient)"
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 3, r: 6 }}
                  activeDot={{ r: 10, stroke: "hsl(var(--primary))", strokeWidth: 3, fill: "hsl(var(--background))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Mood Distribution Donut Chart */}
        <Card className="wellness-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-secondary" />
            🍩 Mood Split
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={moodDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {moodDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    boxShadow: "0 8px 32px hsl(225 15% 15% / 0.1)"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Weekly Sentiment Bar Chart */}
        <Card className="wellness-card lg:col-span-2 xl:col-span-1">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-accent" />
            📊 Weekly Sentiment
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Positive', value: positiveEntries, color: '#22c55e' },
                  { name: 'Negative', value: moodEntries.filter(e => e.sentiment === 'negative').length, color: '#ef4444' },
                  { name: 'Neutral', value: moodEntries.filter(e => e.sentiment === 'neutral').length, color: '#6b7280' }
                ]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px"
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Sentiment Trend Mini Chart */}
        <Card className="wellness-card lg:col-span-2 xl:col-span-2">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-500" />
            🧠 Sentiment Evolution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  domain={[-1, 1]}
                  tickFormatter={(value) => {
                    if (value === 1) return "Positive";
                    if (value === 0) return "Neutral";
                    if (value === -1) return "Negative";
                    return "";
                  }}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value: any, name, props) => {
                    const sentiment = props.payload.sentiment;
                    return [sentiment.charAt(0).toUpperCase() + sentiment.slice(1), "Sentiment"];
                  }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey={(entry: any) => entry.sentiment === "positive" ? 1 : entry.sentiment === "negative" ? -1 : 0}
                  stroke="hsl(var(--secondary))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--secondary))", r: 4 }}
                  activeDot={{ r: 6, stroke: "hsl(var(--secondary))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Entries */}
      <Card className="wellness-card">
        <h3 className="text-lg font-semibold mb-4">Recent Mood Entries</h3>
        <div className="space-y-4">
          {moodEntries.slice(-5).reverse().map((entry) => (
            <div key={entry.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div className="flex items-center space-x-4">
                <Badge 
                  variant="secondary"
                  className={`mood-${entry.mood} text-white`}
                >
                  {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
                </Badge>
                <div>
                  <p className="font-medium">
                    Sentiment: 
                    <span className={`ml-2 font-semibold ${
                      entry.sentiment === "positive" ? "text-green-600" :
                      entry.sentiment === "negative" ? "text-red-600" : "text-gray-600"
                    }`}>
                      {entry.sentiment.charAt(0).toUpperCase() + entry.sentiment.slice(1)}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {entry.timestamp.toLocaleDateString()} at {entry.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Latest Recommendation */}
      {latestEntry && (
        <Card className="wellness-card bg-gradient-to-r from-primary/5 to-secondary/5">
          <h3 className="text-lg font-semibold mb-2">Personalized Recommendation</h3>
          <p className="text-muted-foreground leading-relaxed">
            {latestEntry.recommendation}
          </p>
        </Card>
      )}
    </div>
  );
}