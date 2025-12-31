
import React from 'react';
import { TestData } from '../types';

interface TeacherDashboardProps {
  activeTest: TestData | null;
  resultsCount: number;
  onCreateClick: () => void;
  onTogglePublish: () => void;
  onDeleteTest: () => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ 
  activeTest, 
  resultsCount, 
  onCreateClick, 
  onTogglePublish,
  onDeleteTest
}) => {
  const copyCode = () => {
    if (activeTest?.testCode) {
      navigator.clipboard.writeText(activeTest.testCode);
      alert(`Đã sao chép mã phòng: ${activeTest.testCode}`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Quản lý lớp học 👨‍🏫</h2>
          <p className="text-slate-500 mt-2">Dữ liệu được tự động lưu trữ bất cứ khi nào bạn thay đổi.</p>
        </div>
        <button 
          onClick={onCreateClick}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center gap-2"
        >
          <span>✨</span> Soạn đề mới
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-4">📚</div>
          <h3 className="text-lg font-bold text-slate-900">Đề đang soạn</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{activeTest ? 1 : 0}</p>
          <p className="text-sm text-slate-500 mt-1">Sẵn sàng để giao bài</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl mb-4">✅</div>
          <h3 className="text-lg font-bold text-slate-900">Lượt nộp bài</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{resultsCount}</p>
          <p className="text-sm text-slate-500 mt-1">Dữ liệu đã được lưu vĩnh viễn</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl mb-4">📢</div>
          <h3 className="text-lg font-bold text-slate-900">Trạng thái</h3>
          <p className={`text-xl font-bold mt-2 ${activeTest?.isPublished ? 'text-emerald-600' : 'text-slate-400'}`}>
            {activeTest?.isPublished ? 'Học sinh đang làm' : 'Đang tạm dừng'}
          </p>
        </div>
      </div>

      {activeTest && (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 bg-slate-900 text-white flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl font-black">
                {activeTest.grade}
              </div>
              <div>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Đề kiểm tra khối {activeTest.grade}</span>
                <h3 className="text-2xl font-black mt-1">{activeTest.title}</h3>
                <p className="text-slate-400 text-sm mt-1">Bài học: {activeTest.unit} • {activeTest.questions.length} câu hỏi</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
               <div className="bg-white/10 px-6 py-4 rounded-2xl text-center border border-white/10">
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Mã phòng thi</p>
                  <p className="text-2xl font-mono font-black text-blue-400">{activeTest.testCode}</p>
               </div>
               <button 
                 onClick={copyCode}
                 className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors"
                 title="Sao chép mã"
               >
                 📋
               </button>
            </div>
          </div>

          <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-4">
              <button 
                onClick={onTogglePublish}
                className={`px-8 py-4 rounded-2xl font-black text-lg shadow-lg transition-all flex items-center gap-3 ${
                  activeTest.isPublished 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:-translate-y-1'
                }`}
              >
                {activeTest.isPublished ? (
                  <><span className="text-2xl">⏹️</span> Dừng giao bài</>
                ) : (
                  <><span className="text-2xl">🚀</span> Giao bài cho học sinh</>
                )}
              </button>
              
              <button 
                onClick={() => window.open('/?role=student', '_blank')}
                className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center gap-3"
              >
                <span className="text-2xl">👁️</span> Xem trước (HS)
              </button>
            </div>

            <button 
              onClick={onDeleteTest}
              className="px-6 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-all"
            >
              🗑️ Xóa đề này
            </button>
          </div>

          <div className="px-8 pb-8">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3">
              <span className="text-xl">💡</span>
              <p className="text-sm text-blue-800 font-medium leading-relaxed">
                {activeTest.isPublished 
                  ? "Đề thi đang ở trạng thái CÔNG KHAI. Học sinh có mã phòng có thể vào làm bài ngay lúc này."
                  : "Đề thi đang TẠM DỪNG. Học sinh sẽ không thấy nội dung đề thi cho đến khi bạn nhấn nút 'Giao bài'."}
              </p>
            </div>
          </div>
        </div>
      )}

      {!activeTest && (
        <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
           <div className="text-6xl mb-6">📝</div>
           <h3 className="text-xl font-bold text-slate-900">Bạn chưa có đề thi nào</h3>
           <p className="text-slate-500 mt-2 max-w-sm mx-auto">Hãy sử dụng quyền năng của AI để tạo ra một đề kiểm tra chất lượng chỉ trong 30 giây!</p>
           <button 
             onClick={onCreateClick}
             className="mt-8 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-xl transition-all"
           >
             + Soạn đề ngay bây giờ
           </button>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
