
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    // Save the ref to focus position
    const inputRef = React.useRef<HTMLInputElement>(null);
    const combinedRef = useCombinedRefs(ref, inputRef);
    
    // Save cursor position before render
    const [cursorPosition, setCursorPosition] = React.useState<number | null>(null);
    
    React.useEffect(() => {
      // Restore cursor position after render if it was saved
      if (cursorPosition !== null && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.selectionStart = cursorPosition;
        inputRef.current.selectionEnd = cursorPosition;
        setCursorPosition(null);
      }
    }, [cursorPosition]);

    // Handle input to save cursor position
    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
      setCursorPosition(e.currentTarget.selectionStart);
      
      // Call the original onInput if it exists
      if (props.onInput) {
        props.onInput(e);
      }
    };
    
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={combinedRef}
        onInput={handleInput}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

// Helper function to combine refs
function useCombinedRefs<T>(...refs: React.Ref<T>[]) {
  const targetRef = React.useRef<T>(null);
  
  React.useEffect(() => {
    refs.forEach(ref => {
      if (!ref) return;
      
      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        (ref as React.MutableRefObject<T | null>).current = targetRef.current;
      }
    });
  }, [refs]);
  
  return targetRef;
}

export { Input }
