import { Sparkles, Wand2, Film } from "lucide-react";

export const Hero = () => {
  return (
    <div className="text-center space-y-6 animate-fade-in">
      {/* Floating orbs background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px] animate-float" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-2s' }} />
      </div>
      
      {/* Logo and title */}
      <div className="relative">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="relative">
            <Film className="w-12 h-12 text-primary animate-pulse-glow" />
            <Sparkles className="w-5 h-5 text-secondary absolute -top-1 -right-1" />
          </div>
        </div>
        
        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight">
          <span className="text-gradient">Vision</span>
          <span className="text-foreground">Forge</span>
        </h1>
        
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Transform your stories into stunning AI-generated videos with cinematic visuals, 
          natural voiceover, and seamless transitions.
        </p>
      </div>

      {/* Feature badges */}
      <div className="flex flex-wrap justify-center gap-3 pt-4">
        {[
          { icon: Wand2, label: "AI Scene Generation" },
          { icon: Sparkles, label: "Stunning Visuals" },
          { icon: Film, label: "Pro-Quality Video" },
        ].map((feature, i) => (
          <div
            key={feature.label}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 text-sm text-muted-foreground animate-fade-in"
            style={{ animationDelay: `${0.2 + i * 0.1}s` }}
          >
            <feature.icon className="w-4 h-4 text-primary" />
            {feature.label}
          </div>
        ))}
      </div>
    </div>
  );
};
