import React from "react";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Circle } from "lucide-react";

interface SearchProgressIndicatorProps {
  currentStep:
    | "general"
    | "education_sites"
    | "program_specific"
    | "extracting_programs"
    | "ranking_programs"
    | "complete"
    | null;
  isComplete: boolean;
}

const SEARCH_STEPS = [
  {
    key: "general",
    label: "General Search",
    description: "Searching general sources",
  },
  {
    key: "education_sites",
    label: "Education Sites",
    description: "Searching education-specific sites",
  },
  {
    key: "program_specific",
    label: "Program Specific",
    description: "Finding specific programs",
  },
  {
    key: "extracting_programs",
    label: "Extracting Programs",
    description: "Processing program data",
  },
  {
    key: "ranking_programs",
    label: "Ranking Programs",
    description: "Ranking by relevance",
  },
  {
    key: "complete",
    label: "Completed",
    description: "Search Completed Successfully",
  },
];

const SearchProgressIndicator: React.FC<SearchProgressIndicatorProps> = ({
  currentStep,
  isComplete,
}) => {
  const getCurrentStepIndex = () => {
    if (!currentStep) return -1;
    return SEARCH_STEPS.findIndex((step) => step.key === currentStep);
  };

  const currentStepIndex = getCurrentStepIndex();

  // Only show 100% when truly complete, otherwise calculate based on current step
  const progressValue =
    currentStep === "complete" || isComplete
      ? 100
      : currentStep
      ? ((currentStepIndex + 1) / SEARCH_STEPS.length) * 100
      : 0;

  const getStepIcon = (stepIndex: number) => {
    if (
      stepIndex < currentStepIndex ||
      (currentStep === "complete" && stepIndex === currentStepIndex)
    ) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (stepIndex === currentStepIndex) {
      return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />;
    } else {
      return <Circle className="w-5 h-5 text-gray-300" />;
    }
  };

  const getStepColor = (stepIndex: number) => {
    if (isComplete || stepIndex < currentStepIndex) {
      return "text-green-600";
    } else if (stepIndex === currentStepIndex && !isComplete) {
      return "text-blue-600";
    } else {
      return "text-gray-400";
    }
  };

  if (!currentStep && !isComplete) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="mb-4">
        <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
          <span>Search Progress</span>
          <span>{Math.round(progressValue)}%</span>
        </div>
        <Progress value={progressValue} className="h-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {SEARCH_STEPS.map((step, index) => (
          <div key={step.key} className="flex flex-col items-center">
            <div className="flex items-center mb-2">{getStepIcon(index)}</div>
            <div className={`text-center ${getStepColor(index)}`}>
              <div className="font-semibold text-sm">{step.label}</div>
              <div className="text-xs text-gray-500 mt-1">
                {step.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchProgressIndicator;
