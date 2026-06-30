import type { Vacation } from "../models/vacation";

export const exportLikesReportCsv = (vacations: Vacation[]) => {
  const header = "Destination,LikesCount";
  const rows = vacations.map((v) => `${escapeCell(v.Destination)},${v.likesCount || 0}`);
  const content = [header, ...rows].join("\n");

  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "vacations-likes-report.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const escapeCell = (value: string) => {
  const escaped = value.replaceAll('"', '""');
  return `"${escaped}"`;
};
