import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  customOutline?: string;
  templateFile?: File;
  purpose: "recruiting" | "deliverable";
}

export const IdeaForm = ({ onSubmit, onBack }: IdeaFormProps) => {
  const [formData, setFormData] = useState<IdeaFormData>({
    productIdea: "",
    persona: "",
    company: "",
    jobDescription: "",
    customOutline: "",
    purpose: "deliverable",
  });
  const [templateFile, setTemplateFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.productIdea.trim()) {
      onSubmit({ ...formData, templateFile: templateFile || undefined });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTemplateFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-12">
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
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  What is this PRD for? *
                </Label>
                <RadioGroup
                  value={formData.purpose}
                  onValueChange={(value: "recruiting" | "deliverable") =>
                    setFormData({ ...formData, purpose: value })
                  }
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="deliverable" id="deliverable" />
                    <Label htmlFor="deliverable" className="font-normal cursor-pointer">
                      Company Deliverable
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="recruiting" id="recruiting" />
                    <Label htmlFor="recruiting" className="font-normal cursor-pointer">
                      Recruiting/Interview Exercise
                    </Label>
                  </div>
                </RadioGroup>
              </div>

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
                    {formData.purpose === "deliverable" ? "Current Role" : "Target Role"}
                  </Label>
                  <Input
                    id="jobDescription"
                    placeholder={
                      formData.purpose === "deliverable"
                        ? "E.g., Senior Product Manager at TechCorp"
                        : "E.g., APM at Meta, Growth PM..."
                    }
                    value={formData.jobDescription}
                    onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {formData.purpose === "deliverable"
                      ? "Your current position and company"
                      : "The role you're preparing for"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Custom PRD Structure
                </h3>
                <p className="text-sm text-muted-foreground">
                  Different companies use different PRD formats. You can upload a template or describe your preferred outline.
                </p>
                
                <div className="space-y-2">
                  <Label htmlFor="customOutline" className="text-base">
                    Describe Your Preferred Outline
                  </Label>
                  <Textarea
                    id="customOutline"
                    placeholder="E.g., 1. Executive Summary 2. Problem Statement 3. Goals & Metrics 4. User Stories..."
                    value={formData.customOutline}
                    onChange={(e) => setFormData({ ...formData, customOutline: e.target.value })}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="templateFile" className="text-base">
                    Or Upload a Template
                  </Label>
                  <Input
                    id="templateFile"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  {templateFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {templateFile.name}
                    </p>
                  )}
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
