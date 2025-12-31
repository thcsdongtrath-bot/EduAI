
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { StudentResult, TestData } from '../types';
import { analyzeResults } from '../services/geminiService';

interface AnalyticsDashboardProps {
  results: StudentResult[];
  test: TestData | null;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ results, test }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);

  const scoreData = [
    { name: '0-2', count: results.filter(r => r.score <= 2).length },
    { name: '2-5', count: results.filter(r => r.score > 2 && r.score <= 5).length },
    { name: '5-8', count: results.filter(r => r.score > 5 && r.score <= 8).length },
    { name: '8-10', count: results.filter(r => r.score > 8).length },
  ];

  const passRate = results.length > 0 ? (results.filter(r => r.score >= 5).length / results.length) * 100 : 0;
  
  const pieData = [
    { name: 'Đạt', value: passRate },
    { name: 'Chưa đạt', value: 100 - passRate },
  ];

  const COLORS = ['#10b981', '#ef4444'];

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (results.length > 0) {
        setAnalyzing(true);
        try {
          const text = await analyzeResults(results);
          setAiAnalysis(text || '');
        } catch (e) {
          console.error(e);
        } finally {
          setAnalyzing(false);
        }
      }
    };
    fetchAnalysis();
  }, [results]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Thống kê thông minh</h2>
          <p className="text-slate-500">Phân tích kết quả học tập tự động bởi Gemini AI</p>
        </div>
        <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-2">
          <span>📥</span> Xuất Google Sheet
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Phân bố điểm số</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Tỉ lệ Đạt / Chưa đạt</h3>
          <div className="h-64 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-medium">Đạt: {passRate.toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm font-medium">Chưa đạt: {(100 - passRate).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span>✨</span> Nhận xét & Đánh giá AI
          </h3>
          {analyzing ? (
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <p className="animate-pulse">Gemini đang phân tích dữ liệu lớp học...</p>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed opacity-90">{aiAnalysis || 'Chưa có dữ liệu để phân tích.'}</p>
            </div>
          )}
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none"></div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 font-bold text-slate-900">Danh sách kết quả chi tiết</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Học sinh</th>
                <th className="px-6 py-4">Lớp</th>
                <th className="px-6 py-4">Điểm số</th>
                <th className="px-6 py-4">Thời gian nộp</th>
                <th className="px-6 py-4">Đánh giá</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {results.map(r => (
                <tr key={r.id}>
                  <td className="px-6 py-4 font-medium text-slate-900">{r.studentName}</td>
                  <td className="px-6 py-4 text-slate-600">{r.studentClass}</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${r.score >= 8 ? 'text-green-600' : r.score >= 5 ? 'text-blue-600' : 'text-red-600'}`}>
                      {r.score}/10
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{new Date(r.submittedAt).toLocaleTimeString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      r.score >= 8 ? 'bg-green-100 text-green-700' : r.score >= 5 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {r.score >= 8 ? 'Giỏi' : r.score >= 6.5 ? 'Khá' : r.score >= 5 ? 'Trung bình' : 'Yếu'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
