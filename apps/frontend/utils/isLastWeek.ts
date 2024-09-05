function isLastWeek(dateString: Date) {
  const inputDate = new Date(dateString);
  const today = new Date();
  const currentDay = today.getDay();
  const startOfThisWeek = new Date(today);
  startOfThisWeek.setDate(
    today.getDate() - currentDay + (currentDay === 0 ? -6 : 1)
  );

  const startOfLastWeek = new Date(startOfThisWeek);
  startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

  const endOfLastWeek = new Date(startOfThisWeek);
  endOfLastWeek.setDate(startOfThisWeek.getDate() - 1);

  return inputDate >= startOfLastWeek && inputDate <= endOfLastWeek;
}

export default isLastWeek;
