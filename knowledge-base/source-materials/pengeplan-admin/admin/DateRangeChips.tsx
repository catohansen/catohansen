/**
 * Date Range Chips Component
 * 
 * Mobile-optimized date range selector with touch-friendly chips design.
 * Provides accessible, keyboard-navigable interface for analytics period selection.
 */

"use client";
import { useState, useEffect, useCallback } from "react";

export type DateRange = "1d" | "7d" | "30d" | "90d" | "custom";

export interface DateRangeChipsProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
  disabled?: boolean;
  showCustom?: boolean;
  labels?: Partial<Record<DateRange, string>>;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "compact" | "minimal";
}

const defaultLabels: Record<DateRange, string> = {
  "1d": "24t",
  "7d": "7d", 
  "30d": "30d",
  "90d": "90d",
  "custom": "Egendefinert"
};

const sizeClasses = {
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-2 text-sm", 
  lg: "px-5 py-3 text-base"
};

const variantClasses = {
  default: "rounded-full",
  compact: "rounded-lg",
  minimal: "rounded-md"
};

export default function DateRangeChips({
  value,
  onChange,
  className = "",
  disabled = false,
  showCustom = false,
  labels = {},
  size = "md",
  variant = "default"
}: DateRangeChipsProps) {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [touched, setTouched] = useState(false);
  
  const ranges: DateRange[] = ["1d", "7d", "30d", "90d"];
  if (showCustom) {
    ranges.push("custom");
  }
  
  const mergedLabels = { ...defaultLabels, ...labels };
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    if (disabled) return;
    
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        onChange(ranges[index]);
        setTouched(true);
        break;
      case "ArrowRight":
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % ranges.length);
        break;
      case "ArrowLeft":
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + ranges.length) % ranges.length);
        break;
      case "Home":
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case "End":
        e.preventDefault();
        setFocusedIndex(ranges.length - 1);
        break;
    }
  }, [disabled, onChange, ranges]);

  const handleClick = useCallback((range: DateRange) => {
    if (disabled) return;
    onChange(range);
    setTouched(true);
  }, [disabled, onChange]);

  const handleFocus = useCallback((index: number) => {
    setFocusedIndex(index);
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedIndex(-1);
  }, []);

  // Auto-focus first item on mount for accessibility
  useEffect(() => {
    if (touched && focusedIndex === -1) {
      const currentIndex = ranges.indexOf(value);
      setFocusedIndex(currentIndex >= 0 ? currentIndex : 0);
    }
  }, [touched, value, ranges]);

  return (
    <div 
      className={`flex gap-2 overflow-x-auto pb-2 scrollbar-hide ${className}`}
      role="tablist"
      aria-label="Velg tidsperiode"
    >
      {ranges.map((range, index) => {
        const isSelected = value === range;
        const isFocused = focusedIndex === index;
        const isDisabled = disabled;
        
        return (
          <button
            key={range}
            onClick={() => handleClick(range)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
            className={`
              ${sizeClasses[size]}
              ${variantClasses[variant]}
              font-medium transition-all duration-200 whitespace-nowrap
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              ${isSelected 
                ? "bg-white text-black shadow-sm transform scale-105" 
                : "bg-neutral-800 text-gray-200 hover:bg-neutral-700 hover:scale-105"
              }
              ${isFocused ? "ring-2 ring-blue-500" : ""}
              ${touched ? "focus:ring-2 focus:ring-blue-500" : ""}
            `}
            role="tab"
            tabIndex={isFocused ? 0 : -1}
            aria-selected={isSelected}
            aria-pressed={isSelected}
            disabled={isDisabled}
            title={`Velg ${mergedLabels[range]} periode`}
          >
            <span className="flex items-center gap-1">
              {mergedLabels[range]}
              {isSelected && (
                <span className="text-xs" aria-hidden="true">✓</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// Additional utility component for custom date range picker
export function CustomDateRangePicker({
  onSelect,
  className = ""
}: {
  onSelect: (start: Date, end: Date) => void;
  className?: string;
}) {
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  });
  
  const [endDate, setEndDate] = useState<Date>(new Date());

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSelect(startDate, endDate);
  }, [startDate, endDate, onSelect]);

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-300 mb-1">
            Fra dato
          </label>
          <input
            id="start-date"
            type="date"
            value={startDate.toISOString().split('T')[0]}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            className="w-full px-3 py-2 bg-neutral-800 text-white rounded border border-neutral-700 focus:ring-2 focus:ring-blue-500"
            max={endDate.toISOString().split('T')[0]}
          />
        </div>
        
        <div>
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-300 mb-1">
            Til dato
          </label>
          <input
            id="end-date"
            type="date"
            value={endDate.toISOString().split('T')[0]}
            onChange={(e) => setEndDate(new Date(e.target.value))}
            className="w-full px-3 py-2 bg-neutral-800 text-white rounded border border-neutral-700 focus:ring-2 focus:ring-blue-500"
            min={startDate.toISOString().split('T')[0]}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>
      
      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
      >
        Velg periode
      </button>
    </form>
  );
}
