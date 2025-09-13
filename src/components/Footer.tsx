import { Heart, Rocket } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 py-8 border-t border-border/50">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <span className="text-muted-foreground">Built with</span>
          <Heart className="w-4 h-4 text-red-500 animate-pulse" />
          <span className="text-muted-foreground">at</span>
          <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            AI-THON2K25
          </span>
          <Rocket className="w-4 h-4 text-accent" />
        </div>
        
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Empowering students with AI-driven wellness insights</p>
          <p>🌱 Your mental health journey matters</p>
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground">
          <p>© 2025 Student Wellness Monitor | Making mental health accessible for everyone</p>
        </div>
      </div>
    </footer>
  );
}