// import { useState } from 'react';

type DateSelectorProps = {
  dateRange: [Date | null, Date | null];
  setDateRange: (dateRange: [Date | null, Date | null]) => void;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DateSelector: React.FC<DateSelectorProps> = ({ dateRange, setDateRange }) => {

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange([event.target.value ? new Date(event.target.value) : null, dateRange[1]]);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange([dateRange[0], event.target.value ? new Date(event.target.value) : null]);
  };

  const handleDateRangeChange = () => {
    if (dateRange[0] && dateRange[1] && dateRange[0] > dateRange[1]) {
      setDateRange([dateRange[1], dateRange[0]]);
    }
  };

  return (
      <div className="inline-flex space-x-2">
        <div className="flex-1">
          <input
            type="date"
            name="start-date"
            id="start-date"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
            placeholder="Start date"
            value={dateRange[0] ? dateRange[0].toISOString().split('T')[0] : ''}
            onChange={handleStartDateChange}
          />
        </div>
        <div className="flex-1">
          <input
            type="date"
            name="end-date"
            id="end-date"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
            placeholder="End date"
            value={dateRange[1] ? dateRange[1].toISOString().split('T')[0] : ''}
            onChange={handleEndDateChange}
            onBlur={handleDateRangeChange}
          />
        </div>
      </div>
  );
};

export default DateSelector;
