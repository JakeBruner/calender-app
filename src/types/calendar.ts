export type SelectedRange = [Date | null, Date | null];

export interface Day {
  date: Date;
  isCurrentMonth?: boolean;
  isSelected?: boolean;
}
