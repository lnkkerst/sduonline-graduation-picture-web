export function formatDateTime(startStr: string, endStr: string) {
  const start = new Date(startStr);
  const end = new Date(endStr);
  return {
    date: start.toLocaleDateString(),
    time: `${start.toLocaleTimeString()} - ${end.toLocaleTimeString()}`
  };
}
