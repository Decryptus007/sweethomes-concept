import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const dayPickerStyles = `
  .rdp {
    --rdp-cell-size: 40px;
    --rdp-accent-color: #000;
    --rdp-background-color: #000;
    --rdp-accent-color-dark: #000;
    --rdp-background-color-dark: #000;
    --rdp-outline: 2px solid var(--rdp-accent-color);
    --rdp-outline-selected: 2px solid #000;
    margin: 0;
    background: white;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
  
  .rdp-months {
    display: flex;
    flex-direction: column;
  }
  
  @media (min-width: 768px) {
    .rdp-months {
      flex-direction: row;
      gap: 24px;
    }
  }
  
  .rdp-month {
    margin: 0;
  }
  
  .rdp-table {
    margin: 8px 0 0 0;
  }
  
  .rdp-head_cell {
    font-size: 12px;
    font-weight: 600;
    color: #666;
    padding: 8px 0;
  }
  
  .rdp-cell {
    padding: 2px;
  }
  
  .rdp-day {
    border-radius: 50%;
    font-size: 14px;
    font-weight: 500;
    border: none;
    background: none;
    color: #000;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  
  .rdp-day:hover:not(.rdp-day_disabled) {
    background-color: #f3f4f6;
  }
  
  .rdp-day_selected {
    background-color: #000 !important;
    color: white !important;
  }
  
  .rdp-day_range_start,
  .rdp-day_range_end {
    background-color: #000 !important;
    color: white !important;
  }
  
  .rdp-day_range_middle {
    background-color: #f3f4f6 !important;
    color: #000 !important;
    border-radius: 0 !important;
  }
  
  .rdp-day_disabled {
    color: #ccc;
    cursor: not-allowed;
  }
  
  .rdp-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  
  .rdp-nav_button {
    background: none;
    border: none;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }
  
  .rdp-nav_button:hover {
    background-color: #f3f4f6;
  }
  
  .rdp-caption_label {
    font-weight: 600;
    font-size: 16px;
    color: #000;
  }
`;
