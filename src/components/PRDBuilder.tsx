import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Sparkles, ArrowRight, ArrowLeft, Download, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PRD_SECTIONS = [
  {
    id: "problem",
    title: "Problem Statement",
    description: "What problem are you solving? Who experiences it?",
    placeholder: "Describe the core problem your product addresses...",
    example: `"Small business owners struggle to manage their inventory across multiple sales channels, leading to overselling, stockouts, and lost revenue. Current solutions are either too complex and expensive for SMBs or lack multi-channel integration.

Key pain points:
• Manual inventory updates across 3+ platforms take 2-3 hours daily
• 15% of orders result in overselling issues
• No real-time visibility into stock levels

Target users: Small retail businesses (5-50 employees) selling on e-commerce platforms, marketplaces, and physical stores."`,
    lelandLinks: [
      {
        title: "Understanding Users & Problem Spaces",
        url: "https://www.joinleland.com/content/course/urn:course:68cdb3b85d53ec4ea9359d04"
      },
      {
        title: "Requirements Gathering for UX Designers",
        url: "https://www.joinleland.com/content/item/urn:contentEntry:689b5d87dac66cae1ed96aae?fromName=Product+Management"
      },
      {
        title: "Product Discovery and Ideation",
        url: "https://www.joinleland.com/content/course/urn:course:68cdb6cbb1c8a7104e455eda/urn:contentEntry:68c8e577810fce6e6ae76f33"
      }
    ]
  },
  {
    id: "goals",
    title: "Goals & Success Metrics",
    description: "What does success look like?",
    placeholder: "Define clear, measurable goals and KPIs...",
    example: `Business Goals:
• Reduce inventory management time by 70%
• Eliminate overselling incidents within 3 months
• Increase customer retention by 25%

Success Metrics:
• Daily Active Users (DAU): 1,000 within 6 months
• Inventory sync accuracy: 99.5%
• Time to sync across channels: <30 seconds
• Customer satisfaction (CSAT): >4.5/5
• Churn rate: <5% monthly`,
    lelandLinks: [
      {
        title: "Metrics, Analytics, and Decision Making",
        url: "https://www.joinleland.com/content/course/urn:course:68cdbe15b1c8a7104e461624/urn:contentEntry:68c8e67d8945a7a314b53ad7"
      },
      {
        title: "Product Thinking & Strategy",
        url: "https://www.joinleland.com/content/course/urn:course:68cdaef05d53ec4ea9353196/urn:contentEntry:68c963cfb399bfc15f000206"
      }
    ]
  },
  {
    id: "user-stories",
    title: "User Stories",
    description: "How will users interact with this feature?",
    placeholder: "As a [user], I want to [action] so that [benefit]...",
    example: `As a store owner, I want to:
• Connect all my sales channels (Shopify, Amazon, eBay) in one dashboard so that I can view inventory in real-time
• Receive alerts when stock levels fall below threshold so that I can reorder before stockouts
• Automatically sync inventory changes across all platforms so that I don't have to manually update each channel

As a warehouse manager, I want to:
• Scan barcodes to update inventory so that changes reflect immediately across all channels
• View which products are selling fastest so that I can prioritize restocking`,
    lelandLinks: [
      {
        title: "Understanding Users & Problem Spaces",
        url: "https://www.joinleland.com/content/course/urn:course:68cdb3b85d53ec4ea9359d04"
      },
      {
        title: "Requirements Gathering for UX Designers",
        url: "https://www.joinleland.com/content/item/urn:contentEntry:689b5d87dac66cae1ed96aae?fromName=Product+Management"
      },
      {
        title: "Product Discovery and Ideation",
        url: "https://www.joinleland.com/content/course/urn:course:68cdb6cbb1c8a7104e455eda/urn:contentEntry:68c8e577810fce6e6ae76f33"
      }
    ]
  },
  {
    id: "requirements",
    title: "Requirements",
    description: "What needs to be built?",
    placeholder: "List functional and non-functional requirements...",
    example: `Functional Requirements:
• Multi-channel integration (Shopify, WooCommerce, Amazon, eBay)
• Real-time inventory synchronization (<30 sec delay)
• Low stock alerts (customizable thresholds)
• Barcode scanning via mobile app
• Inventory history and audit logs
• Bulk import/export via CSV

Non-Functional Requirements:
• 99.9% uptime
• Support 10,000+ SKUs per account
• Mobile-responsive dashboard
• GDPR compliant data handling
• API rate limiting: 100 requests/min`,
    lelandLinks: [
      {
        title: "Product Management 101",
        url: "https://www.joinleland.com/content/course/urn:course:68c9492fdf84b203d53079e7"
      },
      {
        title: "Requirements Gathering for UX Designers",
        url: "https://www.joinleland.com/content/item/urn:contentEntry:689b5d87dac66cae1ed96aae?fromName=Product+Management"
      }
    ]
  },
  {
    id: "scope",
    title: "Scope & Timeline",
    description: "What's in and out? When will it ship?",
    placeholder: "Define what's included in V1 and future iterations...",
    example: `V1 Scope (Q2 2024):
In Scope:
• Integration with Shopify and WooCommerce
• Real-time inventory sync
• Low stock email alerts
• Web dashboard with basic reporting
• CSV import/export

Out of Scope:
• Amazon/eBay integration (V2)
• Mobile app (V2)
• Advanced analytics and forecasting (V3)
• Multi-warehouse support (V3)

Timeline:
• Design & Planning: 2 weeks
• Development: 8 weeks
• Testing & QA: 2 weeks
• Beta Launch: Week 12`,
    lelandLinks: [
      {
        title: "Overview of Product Management",
        url: "https://www.joinleland.com/content/course/urn:course:68cdaef05d53ec4ea9353196"
      },
      {
        title: "Product Thinking & Strategy",
        url: "https://www.joinleland.com/content/course/urn:course:68cdaef05d53ec4ea9353196/urn:contentEntry:68c963cfb399bfc15f000206"
      },
      {
        title: "Product Discovery and Ideation",
        url: "https://www.joinleland.com/content/course/urn:course:68cdb6cbb1c8a7104e455eda/urn:contentEntry:68c8e577810fce6e6ae76f33"
      }
    ]
  },
];

interface PRDBuilderProps {
  ideaData: any;
  onBack: () => void;
}

export const PRDBuilder = ({ ideaData, onBack }: PRDBuilderProps) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [sections, setSections] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<string>("");
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [hoveredFeedback, setHoveredFeedback] = useState<number | null>(null);
  const { toast } = useToast();

  const progress = (Object.keys(sections).length / PRD_SECTIONS.length) * 100;
  const currentSectionData = PRD_SECTIONS[currentSection];

  const handleGetFeedback = async () => {
    const content = sections[currentSectionData.id] || "";
    if (!content.trim()) {
      toast({
        title: "Nothing to review",
        description: "Write something first to get AI feedback!",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingFeedback(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/prd-feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          section: currentSectionData.title,
          content,
          ideaContext: {
            productIdea: ideaData.productIdea,
            persona: ideaData.persona,
            company: ideaData.company,
            jobDescription: ideaData.jobDescription,
            customOutline: ideaData.customOutline,
            purpose: ideaData.purpose,
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to get feedback");
      
      const data = await response.json();
      setFeedback(data.feedback);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const handleNext = () => {
    if (currentSection < PRD_SECTIONS.length - 1) {
      setCurrentSection(currentSection + 1);
      setFeedback("");
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setFeedback("");
    }
  };

  const handleExport = () => {
    toast({
      title: "PRD Exported!",
      description: "Your PRD has been formatted and is ready to download.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            ← Back to Idea
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Build Your PRD</h1>
              <p className="text-muted-foreground">{ideaData.productIdea}</p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {Object.keys(sections).length}/{PRD_SECTIONS.length} Complete
            </Badge>
          </div>
          <Progress value={progress} className="mt-4 h-2" />
        </div>

        <div className={`grid grid-cols-1 gap-6 ${feedback ? 'lg:grid-cols-6' : 'lg:grid-cols-4'}`}>
          {/* Section Navigator */}
          <div className="lg:col-span-1">
            <Card className="p-4 sticky top-4">
              <h3 className="font-semibold mb-4">Sections</h3>
              <div className="space-y-2">
                {PRD_SECTIONS.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setCurrentSection(index);
                      setFeedback("");
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      currentSection === index
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {sections[section.id] ? (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">{section.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Editor */}
          <div className={`space-y-6 ${feedback ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
            <Card className="p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2">{currentSectionData.title}</h2>
                <p className="text-muted-foreground">{currentSectionData.description}</p>
              </div>

              <div className="mb-4 p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border-2 border-primary/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Best Practice Example
                  </h3>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 text-xs">
                    From Leland+
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground/90 whitespace-pre-wrap mb-3">{currentSectionData.example}</p>
                <div className="pt-3 border-t border-primary/10 space-y-2">
                  <div className="text-xs text-muted-foreground mb-2">
                    💡 <span className="font-medium">Leland+</span> provides expert-reviewed PM resources for students
                  </div>
                  {currentSectionData.lelandLinks && currentSectionData.lelandLinks.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-primary">Learn more from Leland+:</p>
                      {currentSectionData.lelandLinks.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors group"
                        >
                          <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          <span className="underline underline-offset-2">{link.title}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="relative">
                <Textarea
                  placeholder={currentSectionData.placeholder}
                  value={sections[currentSectionData.id] || ""}
                  onChange={(e) => {
                    setSections({ ...sections, [currentSectionData.id]: e.target.value });
                  }}
                  className="min-h-[300px] text-base mb-4"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleGetFeedback}
                  disabled={isGeneratingFeedback}
                  className="bg-gradient-to-r from-primary to-secondary"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isGeneratingFeedback ? "Analyzing..." : "Get AI Feedback"}
                </Button>
                <div className="flex-1" />
                <Button variant="outline" onClick={handlePrevious} disabled={currentSection === 0}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button onClick={handleNext} disabled={currentSection === PRD_SECTIONS.length - 1}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>

            {currentSection === PRD_SECTIONS.length - 1 && (
              <Button
                onClick={handleExport}
                className="w-full bg-success text-success-foreground py-6 text-lg"
              >
                <Download className="w-5 h-5 mr-2" />
                Export PRD
              </Button>
            )}
          </div>

          {/* Feedback Panel */}
          <div className={feedback ? 'lg:col-span-2' : 'lg:col-span-1'}>
            <Card className="p-6 sticky top-4">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-accent" />
                <h3 className="font-semibold">AI Feedback</h3>
              </div>
              {feedback ? (
                <div className="space-y-3">
                  {feedback.split('\n\n').filter(p => p.trim()).map((paragraph, idx) => {
                    const quotedText = paragraph.match(/"([^"]+)"/)?.[1];
                    const isHovered = hoveredFeedback === idx;
                    
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border-l-4 transition-all cursor-pointer ${
                          isHovered 
                            ? 'bg-primary/10 border-primary shadow-md' 
                            : 'bg-muted/50 border-transparent hover:bg-muted'
                        }`}
                        onMouseEnter={() => {
                          setHoveredFeedback(idx);
                          // Highlight the quoted text in the textarea
                          if (quotedText) {
                            const content = sections[currentSectionData.id] || "";
                            const startIndex = content.indexOf(quotedText);
                            if (startIndex !== -1) {
                              const textarea = document.querySelector('textarea');
                              if (textarea) {
                                textarea.focus();
                                textarea.setSelectionRange(startIndex, startIndex + quotedText.length);
                              }
                            }
                          }
                        }}
                        onMouseLeave={() => {
                          setHoveredFeedback(null);
                          const textarea = document.querySelector('textarea');
                          if (textarea) {
                            textarea.blur();
                          }
                        }}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{paragraph}</p>
                        {quotedText && (
                          <div className="mt-2 text-xs text-muted-foreground italic">
                            💡 Hover to highlight this text in your content
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">
                    Write your content and click "Get AI Feedback" for personalized suggestions with highlighted correlations.
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
