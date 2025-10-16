import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Lightbulb } from "lucide-react";

interface IdeaFormProps {
  onSubmit: (data: IdeaFormData) => void;
  onBack: () => void;
}

export interface IdeaFormData {
  productIdea: string;
  persona?: string;
  company?: string;
  jobDescription?: string;
}

export const IdeaForm = ({ onSubmit, onBack }: IdeaFormProps) => {
  const [formData, setFormData] = useState<IdeaFormData>({
    productIdea: "",
    persona: "",
    company: "",
    jobDescription: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.productIdea.trim()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10 px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            ← Back
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <Lightbulb className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Tell Us Your Idea</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Share your product or feature idea. The more context you provide, the better the AI can help.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="shadow-lg border-2">
            <CardHeader>
              <CardTitle>Product Idea</CardTitle>
              <CardDescription>
                What product or feature do you want to spec out?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="productIdea" className="text-base font-semibold">
                  Your Idea *
                </Label>
                <Textarea
                  id="productIdea"
                  placeholder="E.g., A mobile app that helps college students find study partners based on their courses and schedules..."
                  value={formData.productIdea}
                  onChange={(e) => setFormData({ ...formData, productIdea: e.target.value })}
                  className="min-h-[120px] text-base"
                  required
                />
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Optional Context
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="persona" className="text-base">
                    Target Persona
                  </Label>
                  <Input
                    id="persona"
                    placeholder="E.g., College students aged 18-24..."
                    value={formData.persona}
                    onChange={(e) => setFormData({ ...formData, persona: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="text-base">
                    Company/Context
                  </Label>
                  <Input
                    id="company"
                    placeholder="E.g., EdTech startup, B2C mobile-first..."
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobDescription" className="text-base">
                    Target Role
                  </Label>
                  <Input
                    id="jobDescription"
                    placeholder="E.g., APM at Meta, Growth PM..."
                    value={formData.jobDescription}
                    onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 py-6 text-lg"
                disabled={!formData.productIdea.trim()}
              >
                Generate PRD Outline
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};
