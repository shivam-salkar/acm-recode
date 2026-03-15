import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative min-w-32 cursor-pointer overflow-hidden rounded-full border bg-background px-4 py-2 text-center font-semibold flex items-center justify-center gap-2",
        className,
      )}
      {...props}
    >
      <div className="absolute left-[8%] top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary transition-all duration-300 group-hover:scale-[100] group-hover:bg-primary z-0 opacity-100"></div>

      <span className="relative z-10 inline-block transition-all duration-300 group-hover:translate-x-1 sm:group-hover:translate-x-2 pl-4">
        {text}
      </span>

      <div className="absolute inset-0 z-20 flex h-full w-full items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300 group-hover:opacity-100">
        <span className="whitespace-nowrap">{text}</span>
        <ArrowRight size={16} />
      </div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
