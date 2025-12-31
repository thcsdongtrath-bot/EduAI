
import React from 'react';
import { TestData } from '../types';

interface TeacherDashboardProps {
  activeTest: TestData | null;
  resultsCount: number;
  onCreateClick: () => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ activeTest, resultsCount, onCreateClick }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Chào mừng bạn trở lại, Thầy Cô! 👋</h2>
        <p className="text-slate-500 mt-2">Hôm nay bạn muốn soạn đề kiểm tra hay kiểm tra tiến độ học tập của lớp?</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-4">📚</div>
          <h3 className="text-lg font-bold text-slate-900">Đề đang mở</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{activeTest ? 1 : 0}</p>
          <p className="text-sm text-slate-500 mt-1">Sẵn sàng để học sinh làm bài</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl mb-4">✅</div>
          <h3 className="text-lg font-bold text-slate-900">Lượt nộp bài</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{resultsCount}</p>
          <p className="text-sm text-slate-500 mt-1">Từ các lớp khối 6, 7, 8, 9</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl mb-4">✨</div>
          <h3 className="text-lg font-bold text-slate-900">Điểm trung bình</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">7.2</p>
          <p className="text-sm text-slate-500 mt-1">Tăng 0.5 so với tuần trước</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-900">Đề kiểm tra gần đây</h3>
          <button 
            onClick={onCreateClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            + Soạn đề mới
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Tên đề</th>
                <th className="px-6 py-4 font-semibold">Khối</th>
                <th className="px-6 py-4 font-semibold">Đơn vị bài học</th>
                <th className="px-6 py-4 font-semibold">Trạng thái</th>
                <th className="px-6 py-4 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeTest ? (
                <tr>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{activeTest.title}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600">Khối {activeTest.grade}</td>
                  <td className="px-6 py-4 text-slate-600">{activeTest.unit}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Đang mở</span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:underline text-sm font-medium">Chi tiết</button>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Chưa có đề nào được tạo. Hãy bắt đầu soạn đề bằng AI!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
