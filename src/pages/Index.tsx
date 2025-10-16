import { useState } from "react";
import { Hero } from "@/components/Hero";
import { IdeaForm, IdeaFormData } from "@/components/IdeaForm";
import { PRDBuilder } from "@/components/PRDBuilder";

type AppState = "hero" | "idea-form" | "prd-builder";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("hero");
  const [ideaData, setIdeaData] = useState<IdeaFormData | null>(null);

  const handleGetStarted = () => {
    setAppState("idea-form");
  };

  const handleIdeaSubmit = (data: IdeaFormData) => {
    setIdeaData(data);
    setAppState("prd-builder");
  };

  const handleBackToHero = () => {
    setAppState("hero");
    setIdeaData(null);
  };

  const handleBackToIdea = () => {
    setAppState("idea-form");
  };

  return (
    <>
      {appState === "hero" && <Hero onGetStarted={handleGetStarted} />}
      {appState === "idea-form" && (
        <IdeaForm onSubmit={handleIdeaSubmit} onBack={handleBackToHero} />
      )}
      {appState === "prd-builder" && ideaData && (
        <PRDBuilder ideaData={ideaData} onBack={handleBackToIdea} />
      )}
    </>
  );
};

export default Index;
