import { useEffect, useState } from "react";
import { MonthList } from "../../utils/MonthList";

const DatePicker = ({
  setValidAge,
}: {
  setValidAge: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [day, setDay] = useState<number>(new Date().getDay());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth());

  const years = Array.from(new Array(100), (_, idx) => {
    return year - idx;
  });

  const getDaysInMonth = (year: number, currentMonth: number) =>
    new Date(year, currentMonth, 0).getDate();
  const [days, setDays] = useState(
    Array.from(new Array(getDaysInMonth(year, month)), (_, idx) => idx + 1)
  );

  useEffect(() => {
    const days = getDaysInMonth(year, month);
    const age = new Date().getFullYear() - year > 14;
    setValidAge(age);
    setDays(Array.from(new Array(days), (_, idx) => idx + 1));
  }, [month, year]);

  return (
    <div className="flex justify-center gap-3">
      <select
        className="p-2 rounded-sm text-gray-500 outline-gray-300 text-xs "
        onChange={(e) => {
          setMonth(Number(e.target.value) + 1);
        }}
      >
        {MonthList.map((month, idx) => {
          return (
            <option key={idx} value={idx}>
              {month}
            </option>
          );
        })}
      </select>
      <select
        className="p-2 rounded-sm text-gray-500 outline-gray-300 text-xs"
        onChange={(e) => setDay(Number(e.target.value))}
      >
        {days.map((day) => (
          <option key={day}>{day}</option>
        ))}
      </select>
      <select
        className="p-2 rounded-sm text-gray-500 outline-gray-300 text-xs"
        onChange={(e) => setYear(Number(e.target.value))}
      >
        {years.map((year) => (
          <option key={year}>{year}</option>
        ))}
      </select>
    </div>
  );
};

export default DatePicker;
