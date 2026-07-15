import { useFetcher } from "react-router";
import { useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ initialTheme, isExpanded = true, isMobile = false }: { initialTheme: "light" | "dark", isExpanded?: boolean, isMobile?: boolean }) {
  const fetcher = useFetcher();
  const [isDark, setIsDark] = useState(initialTheme === "dark");

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";

    // 1. Feedback visual imediato
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark", !isDark);

    // 2. Persiste no servidor em background
    fetcher.submit(
      { intent: "setTheme", theme: newTheme },
      { method: "post", action: "/api/config" }
    );
  };

  if (isMobile) {
    return (
      <button 
        className="relative w-11 h-11 flex items-center justify-center text-text-muted hover:text-text transition-colors"
        onClick={toggleTheme}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    );
  }

  return (
    <button 
      className={`mx-4 h-12 flex items-center rounded-xl transition-all ${isExpanded ? 'px-4' : 'w-12 mx-auto justify-center'} text-text-muted bg-transparent hover:bg-surface-light hover:text-text font-normal`}
      onClick={toggleTheme} 
      title="Alternar Tema"
    >
      <div className="shrink-0 flex items-center justify-center">
        {isDark ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
      </div>
      <span className={`ml-3 text-[14px] whitespace-nowrap transition-opacity delay-100 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>Tema</span>
    </button>
  );
}
