// components/ui/switch.tsx
'use client';

import * as React from 'react';

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function Switch({ checked, onCheckedChange, ...props }: SwitchProps) {
  return (
    <label
      className="inline-flex items-center cursor-pointer"
      role="switch"
      aria-checked={checked}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        {...props}
      />
      <span
        className={`w-10 h-6 rounded-full relative transition-colors ${
          checked ? 'bg-green-500' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform ${
            checked ? 'translate-x-4 bg-white shadow-md scale-105' : 'bg-white'
          }`}
        />
      </span>
    </label>
  );
}
