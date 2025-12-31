
import React, { useState, useEffect } from 'react';
import { TestData, StudentResult } from '../types';

interface StudentPortalProps {
  test: TestData | null;
  onSubmit: (result: StudentResult) => void;
  results: StudentResult[];
}

const StudentPortal: React.FC<StudentPortalProps> = ({ test, onSubmit, results }) => {
  const [studentInfo, setStudentInfo] = useState({ name: '', class: '', testCodeInput: '' });
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentResult, setCurrentResult] = useState<StudentResult | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  const normalizeString = (str: string) => {
    return str.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[.?!,]/g, '');
  };

  const handleStart = () => {
    if (!test || !test.isPublished) {
      setError('Phòng thi này hiện đang đóng hoặc chưa được giáo viên kích hoạt.');
      return;
    }
    if (studentInfo.testCodeInput.toUpperCase() !== test.testCode?.toUpperCase()) {
      setError('Mã phòng thi không chính xác. Vui lòng kiểm tra lại!');
      return;
    }
    if (!studentInfo.name.trim() || !studentInfo.class.trim()) {
      setError('Vui lòng nhập đầy đủ Họ tên và Lớp.');
      return;
    }
    setStarted(true);
    setError('');
  };

  const handleSubmit = () => {
    if (!test) return;
    
    let correctCount = 0;
    test.questions.forEach(q => {
      const studentAnswer = answers[q.id] || "";
      if (q.options && q.options.length > 0) {
        // Trắc nghiệm
        if (studentAnswer === q.answer) correctCount++;
      } else {
        // Tự luận (sắp xếp/viết lại)
        if (normalizeString(studentAnswer) === normalizeString(q.answer)) correctCount++;
      }
    });
    
    const rawScore = (correctCount / test.questions.length) * 10;
    const finalScore = Math.round(rawScore * 10) / 10;

    const result: StudentResult = {
      id: Math.random().toString(36).substr(2, 9),
      studentName: studentInfo.name,
      studentClass: studentInfo.class,
      score: finalScore,
      maxScore: 10,
      submittedAt: new Date().toISOString(),
      answers
    };
    
    setCurrentResult(result);
    setFinished(true);
    onSubmit(result);
    // Cuộn lên đầu trang để xem kết quả
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // MÀN HÌNH KẾT QUẢ - Ưu tiên hiển thị hàng đầu
  if (finished && currentResult) {
    const isPassed = currentResult.score >= 5;
    const scoreColor = currentResult.score >= 8 ? 'text-emerald-500' : currentResult.score >= 5 ? 'text-blue-500' : 'text-red-500';
    
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in duration-300 pb-20">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 text-center relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-3 ${isPassed ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
          
          <div className="text-7xl mb-6">{isPassed ? '🎊' : '📚'}</div>
          <h2 className="text-4xl font-black text-slate-900 mb-2">Chúc mừng bạn đã hoàn thành!</h2>
          <p className="text-slate-500 text-lg mb-10">Thí sinh: <span className="font-black text-slate-800">{currentResult.studentName}</span> • Lớp: <span className="font-black text-slate-800">{currentResult.studentClass}</span></p>
          
          <div className="flex flex-col items-center justify-center bg-slate-50 py-10 rounded-[2.5rem] mb-10 border border-slate-100">
            <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Điểm số của bạn</p>
            <div className={`text-9xl font-black ${scoreColor} drop-shadow-sm`}>
              {currentResult.score}
            </div>
            <div className="text-xl font-bold text-slate-400 mt-2">thang điểm 10</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="p-6 bg-blue-50 rounded-3xl text-left border border-blue-100">
              <h4 className="font-black text-blue-800 mb-2 flex items-center gap-2">
                <span>🤖</span> Nhận xét thông minh:
              </h4>
              <p className="text-blue-700 text-sm leading-relaxed font-medium italic">
                {currentResult.score >= 9 ? "Tuyệt vời! Bạn là một ngôi sao Tiếng Anh thực thụ. Hãy tiếp tục phát huy nhé!" :
                 currentResult.score >= 7 ? "Rất tốt! Bạn nắm vững kiến thức trọng tâm. Một chút cẩn thận nữa là đạt điểm tối đa rồi." :
                 currentResult.score >= 5 ? "Khá ổn. Bạn đã đạt mức yêu cầu, hãy ôn tập thêm các câu sai để tiến bộ hơn." :
                 "Cố gắng lên! Kết quả này chưa phản ánh hết khả năng của bạn đâu. Hãy ôn lại bài và thử lại nhé."}
              </p>
            </div>
            <div className="p-6 bg-slate-900 rounded-3xl text-left text-white">
              <h4 className="font-black mb-2 flex items-center gap-2 text-blue-400">
                <span>📍</span> Ghi chú bài làm:
              </h4>
              <ul className="text-xs space-y-2 opacity-80 font-medium">
                <li>• Thời gian nộp: {new Date(currentResult.submittedAt).toLocaleTimeString('vi-VN')}</li>
                <li>• Tổng số câu hỏi: {test?.questions.length}</li>
                <li>• Kết quả đã được gửi tới giáo viên chủ nhiệm.</li>
              </ul>
            </div>
          </div>

          <button 
            onClick={() => { setStarted(false); setFinished(false); setCurrentResult(null); setAnswers({}); }}
            className="px-12 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            Quay lại trang chủ
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-2xl font-black text-slate-900">Xem lại chi tiết</h3>
            <span className="px-4 py-2 bg-white rounded-full text-xs font-bold text-slate-400 border border-slate-200 uppercase tracking-widest">Đáp án & Giải thích</span>
          </div>
          
          {test?.questions.map((q, idx) => {
            const studentAns = answers[q.id] || "";
            const isCorrect = q.options && q.options.length > 0 
              ? studentAns === q.answer 
              : normalizeString(studentAns) === normalizeString(q.answer);

            return (
              <div key={q.id} className={`p-8 rounded-[2rem] border-2 bg-white transition-all shadow-sm ${isCorrect ? 'border-emerald-100' : 'border-red-100'}`}>
                <div className="flex gap-6">
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black flex-shrink-0 text-lg ${isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {idx + 1}
                  </span>
                  <div className="flex-1 space-y-4">
                    <p className="text-xl font-bold text-slate-900 leading-relaxed">{q.content}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`p-4 rounded-2xl font-bold ${isCorrect ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                        <span className="text-[10px] uppercase block opacity-60 mb-1">Bạn đã chọn:</span>
                        {studentAns || "(Bỏ trống)"}
                      </div>
                      
                      {!isCorrect && (
                        <div className="p-4 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100 font-bold">
                          <span className="text-[10px] uppercase block opacity-60 mb-1">Đáp án đúng:</span>
                          {q.answer}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">💡 Giải thích từ AI:</p>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // TRẠNG THÁI PHÒNG THI ĐÓNG
  if (!test || !test.isPublished) {
    if (started) setStarted(false);
    return (
      <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-200 text-center max-w-2xl mx-auto animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-slate-50 text-slate-400 rounded-[2rem] flex items-center justify-center text-5xl mx-auto mb-8 border border-slate-100">🔒</div>
        <h3 className="text-3xl font-black text-slate-900">Phòng thi đang đóng</h3>
        <p className="text-slate-500 mt-4 text-lg leading-relaxed font-medium">
          Giáo viên hiện chưa mở bài kiểm tra hoặc đã kết thúc buổi giao bài. 
          Vui lòng quay lại sau hoặc liên hệ với giáo viên của bạn.
        </p>
      </div>
    );
  }

  // MÀN HÌNH VÀO PHÒNG (LOGIN)
  if (!started) {
    return (
      <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-200 max-w-lg mx-auto animate-in fade-in slide-in-from-top-4 duration-300">
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center text-4xl mx-auto mb-6 border border-emerald-100">🎓</div>
          <h2 className="text-4xl font-black text-slate-900">Vào phòng thi</h2>
          <p className="text-slate-500 mt-2 font-bold opacity-70">EduAI English Pro Examination</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-[0.2em] ml-2">Mã phòng thi</label>
            <input 
              type="text" 
              className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none focus:ring-8 focus:ring-emerald-50 focus:border-emerald-400 transition-all font-mono text-3xl text-center font-black text-emerald-600 placeholder:text-slate-200 uppercase"
              placeholder="ENGX-XXXX"
              value={studentInfo.testCodeInput}
              onChange={e => { setStudentInfo({...studentInfo, testCodeInput: e.target.value.toUpperCase()}); setError(''); }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-[0.2em] ml-2">Họ và tên</label>
              <input 
                type="text" 
                className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-400 outline-none transition-all font-bold"
                placeholder="Nguyễn Văn A"
                value={studentInfo.name}
                onChange={e => setStudentInfo({...studentInfo, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-[0.2em] ml-2">Lớp</label>
              <input 
                type="text" 
                className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-400 outline-none transition-all font-bold text-center"
                placeholder="6A1"
                value={studentInfo.class}
                onChange={e => setStudentInfo({...studentInfo, class: e.target.value})}
              />
            </div>
          </div>

          {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-black animate-bounce text-center uppercase tracking-wider">{error}</div>}

          <button 
            disabled={!studentInfo.name || !studentInfo.class || !studentInfo.testCodeInput}
            onClick={handleStart}
            className="w-full py-6 bg-emerald-600 text-white font-black text-xl rounded-3xl hover:bg-emerald-700 shadow-2xl shadow-emerald-100 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            Bắt đầu làm bài 🚀
          </button>
        </div>
      </div>
    );
  }

  // GIAO DIỆN LÀM BÀI
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] border border-white shadow-2xl flex justify-between items-center sticky top-4 z-20">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-200">{test.grade}</div>
          <div>
            <h3 className="text-xl font-black text-slate-900 leading-none">{test.title}</h3>
            <p className="text-xs text-slate-400 mt-2 font-black uppercase tracking-widest">{studentInfo.name} • Lớp {studentInfo.class}</p>
          </div>
        </div>
        <div className="px-6 py-3 bg-red-50 rounded-2xl border border-red-100 text-center">
             <span className="text-[10px] font-black text-red-400 block uppercase tracking-widest mb-0.5">Thời gian còn lại</span>
             <span className="text-2xl font-mono font-black text-red-600">{test.duration}:00</span>
        </div>
      </header>

      <div className="space-y-10">
        {test.questions.map((q, idx) => (
          <div key={q.id} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="flex gap-8">
              <span className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black flex-shrink-0 text-xl shadow-lg">{idx + 1}</span>
              <div className="space-y-6 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-blue-100">{q.type}</span>
                  <span className="text-slate-400 text-sm italic font-bold">Instruction: {q.instruction}</span>
                </div>
                <p className="text-2xl font-bold text-slate-900 leading-relaxed">{q.content}</p>
                
                {q.options && q.options.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {q.options.map((opt, optIdx) => {
                      const label = String.fromCharCode(65 + optIdx);
                      const isSelected = answers[q.id] === label;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => setAnswers({...answers, [q.id]: label})}
                          className={`flex items-center gap-5 p-6 rounded-3xl border-2 text-left transition-all group ${
                            isSelected ? 'border-blue-600 bg-blue-50/50 ring-8 ring-blue-50' : 'border-slate-50 bg-slate-50 hover:border-slate-200'
                          }`}
                        >
                          <span className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black border-2 transition-all ${
                             isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-200' : 'bg-white text-slate-300 border-slate-100 group-hover:border-slate-300'
                          }`}>{label}</span>
                          <span className={`text-lg font-bold ${isSelected ? 'text-blue-900' : 'text-slate-600'}`}>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="relative">
                    <textarea
                      rows={4}
                      className="w-full p-8 bg-slate-50 border-2 border-slate-100 rounded-[2rem] outline-none focus:ring-8 focus:ring-blue-50 focus:border-blue-400 transition-all text-xl font-bold placeholder:text-slate-200"
                      placeholder="Type your answer here..."
                      value={answers[q.id] || ""}
                      onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}
                    ></textarea>
                    <div className="absolute top-4 right-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">Writing Section</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4 pt-10 pb-20">
        <button 
          onClick={handleSubmit}
          className="px-24 py-8 bg-emerald-600 text-white font-black text-3xl rounded-[2.5rem] hover:bg-emerald-700 shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:-translate-y-2 transition-all active:scale-95 flex items-center gap-6"
        >
          <span>NỘP BÀI THI</span>
          <span className="text-4xl">🚀</span>
        </button>
        <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">Hãy kiểm tra kỹ bài làm trước khi nộp</p>
      </div>
    </div>
  );
};

export default StudentPortal;
