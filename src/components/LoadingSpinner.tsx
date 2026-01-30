import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "white";
}

export function LoadingSpinner({
  className,
  size = "md",
  variant = "default",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-[3px]",
    lg: "w-12 h-12 border-4",
  };

  const isWhite = variant === "white";

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div
        className={cn(
          "rounded-full animate-spin",
          isWhite ? "border-white/30 border-t-white" : "border-[#E5E5E5] border-t-[#1CB0F6]",
          sizeClasses[size],
        )}
      />
      {!isWhite && (
        <div
          className={cn(
            "absolute rounded-full border-transparent border-t-[#58CC02] animate-spin",
            sizeClasses[size],
          )}
          style={{ animationDuration: "1.5s" }}
        />
      )}
    </div>
  );
}
