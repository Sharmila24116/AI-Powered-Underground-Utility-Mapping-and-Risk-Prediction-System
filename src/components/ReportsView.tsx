import React, { useState } from 'react';
import {
  FileText,
  Download,
  Eye,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Search,
  Calendar,
  User,
  MapPin,
  HardHat,
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ExcavationReport } from '../types';
import { ReportPdfTemplate } from './ReportPdfTemplate';

interface ReportsViewProps {
  reports: ExcavationReport[];
  onDeleteReport: (id: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ reports, onDeleteReport }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<ExcavationReport | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const filteredReports = reports.filter((r) => {
    return (
      r.reportNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.engineerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.prediction.locationName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Download PDF Report Generator
  const handleDownloadPdf = async (report: ExcavationReport) => {
    setSelectedReport(report);
    setIsGeneratingPdf(true);

    setTimeout(async () => {
      const element = document.getElementById('pdf-report-document');
      if (!element) {
        setIsGeneratingPdf(false);
        return alert('PDF report document element not found.');
      }

      try {
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${report.reportNumber}_Excavation_Safety_Permit.pdf`);
      } catch (err) {
        console.error('Error generating PDF:', err);
        alert('Error generating PDF document.');
      } finally {
        setIsGeneratingPdf(false);
      }
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-400" />
            Excavation Permits & Risk Reports History
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Archived field risk scans, safety clearance certificates, and signed PDF excavation permits.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search report number, engineer, or site..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Reports Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="font-bold text-sm text-slate-900 dark:text-white font-mono">
                  {report.reportNumber}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    report.prediction.overallRiskLevel === 'High Risk'
                      ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                      : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  {report.prediction.overallRiskLevel}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>{report.prediction.locationName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>Engineer: {report.engineerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <HardHat className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Planned Depth: {report.prediction.plannedDepthMeters}m</span>
                </div>
              </div>
            </div>

            {/* Card Buttons */}
            <div className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedReport(report)}
                className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Permit</span>
              </button>

              <button
                onClick={() => handleDownloadPdf(report)}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-md transition-colors"
                title="Download PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>

              <button
                onClick={() => onDeleteReport(report.id)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View Permit Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">
                Excavation Permit Details: {selectedReport.reportNumber}
              </h3>
              <button onClick={() => setSelectedReport(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <ReportPdfTemplate prediction={selectedReport.prediction} />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                Close
              </button>

              <button
                onClick={() => handleDownloadPdf(selectedReport)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>Download Signed PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
