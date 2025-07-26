// components/ui/toggle-group.tsx
'use client';

import * as React from 'react';

interface ToggleGroupProps {
  type: 'single';
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

interface ToggleGroupItemProps {
  value: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export function ToggleGroup({
  type,
  value,
  onValueChange,
  className,
  children
}: ToggleGroupProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;
        return React.cloneElement(child, {
          selected: child.props.value === value,
          onSelect: () => onValueChange(child.props.value)
        });
      })}
    </div>
  );
}

export function ToggleGroupItem({
  value,
  children,
  selected,
  onSelect
}: ToggleGroupItemProps & { selected?: boolean }) {
  return (
    <button
      onClick={onSelect}
      className={`px-3 py-1 rounded border text-sm transition-all ${
        selected
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );
}
