import { createContext, useContext, ReactNode } from "react";
import { useAuth } from "./AuthContext";

type IndustryType = "pharmacy" | "footwear";

interface IndustryContextType {
  industryType: IndustryType;
  isPharmacy: boolean;
  isFootwear: boolean;
}

const IndustryContext = createContext<IndustryContextType | undefined>(undefined);

export function IndustryProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  // Default to pharmacy if no user or no industry set
  const industryType: IndustryType = (user?.company?.industryType as IndustryType) || "pharmacy";

  return (
    <IndustryContext.Provider
      value={{
        industryType,
        isPharmacy: industryType === "pharmacy",
        isFootwear: industryType === "footwear",
      }}
    >
      {children}
    </IndustryContext.Provider>
  );
}

export function useIndustry() {
  const context = useContext(IndustryContext);
  if (context === undefined) {
    throw new Error("useIndustry must be used within an IndustryProvider");
  }
  return context;
}
