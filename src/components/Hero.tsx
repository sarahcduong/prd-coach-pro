import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-accent/10 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8 py-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-accent-foreground">AI-Powered PRD Learning</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
          Master Product Specs
          <br />
          Like a Pro PM
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Learn to write clear, strategic PRDs through guided AI feedback. Build your portfolio and land your dream PM role.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button
            size="lg"
            onClick={onGetStarted}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-6"
          >
            Start Your First PRD
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 text-lg px-8 py-6"
          >
            View Examples
          </Button>
        </div>

        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="p-6 rounded-xl bg-card border border-border shadow-md">
            <div className="text-3xl font-bold text-primary mb-2">AI Feedback</div>
            <p className="text-muted-foreground">Real-time guidance on every section</p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border shadow-md">
            <div className="text-3xl font-bold text-secondary mb-2">Learn & Iterate</div>
            <p className="text-muted-foreground">Improve with structured examples</p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border shadow-md">
            <div className="text-3xl font-bold text-accent mb-2">Portfolio Ready</div>
            <p className="text-muted-foreground">Export professional documents</p>
          </div>
        </div>
      </div>
    </div>
  );
};
