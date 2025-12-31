
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
      setError('Mã phòng thi không chính xác!');
      return;
    }
    if (!studentInfo.name.trim() || !studentInfo.class.trim()) {
      setError('Vui lòng nhập đủ Họ tên và Lớp.');
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
        if (studentAnswer === q.answer) correctCount++;
      } else {
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. MÀN HÌNH KẾT QUẢ (RESPONSIVE)
  if (finished && currentResult) {
    const isPassed = currentResult.score >= 5;
    const scoreColor = currentResult.score >= 8 ? 'text-emerald-500' : currentResult.score >= 5 ? 'text-blue-500' : 'text-red-500';
    
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6 md:space-y-8 animate-in zoom-in duration-300 pb-20 px-2 sm:px-4">
        <div className="bg-white p-6 sm:p-10 md:p-12 rounded-[2rem] sm:rounded-[3rem] shadow-2xl border border-slate-100 text-center relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-2 sm:h-3 ${isPassed ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
          
          <div className="text-5xl sm:text-7xl mb-4 sm:mb-6">{isPassed ? '🎊' : '📚'}</div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-2">Hoàn thành bài thi!</h2>
          <p className="text-slate-500 text-sm sm:text-lg mb-6 sm:mb-10">
            Thí sinh: <span className="font-black text-slate-800">{currentResult.studentName}</span> • Lớp: <span className="font-black text-slate-800">{currentResult.studentClass}</span>
          </p>
          
          <div className="flex flex-col items-center justify-center bg-slate-50 py-6 sm:py-10 rounded-[2rem] mb-6 sm:mb-10 border border-slate-100">
            <p className="text-[10px] sm:text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Điểm của bạn</p>
            <div className={`text-7xl sm:text-9xl font-black ${scoreColor} drop-shadow-sm`}>
              {currentResult.score}
            </div>
            <div className="text-sm sm:text-xl font-bold text-slate-400 mt-2">thang điểm 10</div>
          </div>

          <button 
            onClick={() => { setStarted(false); setFinished(false); setCurrentResult(null); setAnswers({}); }}
            className="w-full sm:w-auto px-10 py-4 sm:py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl active:scale-95"
          >
            Quay lại trang chủ
          </button>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 px-2">Xem lại chi tiết</h3>
          {test?.questions.map((q, idx) => {
            const studentAns = answers[q.id] || "";
            const isCorrect = q.options && q.options.length > 0 
              ? studentAns === q.answer 
              : normalizeString(studentAns) === normalizeString(q.answer);

            return (
              <div key={q.id} className={`p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border-2 bg-white shadow-sm ${isCorrect ? 'border-emerald-100' : 'border-red-100'}`}>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black flex-shrink-0 text-lg ${isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {idx + 1}
                  </span>
                  <div className="flex-1 space-y-4">
                    <p className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">{q.content}</p>
                    <div className="grid grid-cols-1 gap-3">
                      <div className={`p-4 rounded-xl font-bold text-sm sm:text-base ${isCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        <span className="text-[10px] uppercase block opacity-60 mb-1">Bạn chọn:</span>
                        {studentAns || "(Bỏ trống)"}
                      </div>
                      {!isCorrect && (
                        <div className="p-4 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 font-bold text-sm sm:text-base">
                          <span className="text-[10px] uppercase block opacity-60 mb-1">Đáp án đúng:</span>
                          {q.answer}
                        </div>
                      )}
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

  // 2. MÀN HÌNH VÀO PHÒNG (RESPONSIVE)
  if (!started) {
    return (
      <div className="w-full max-w-md mx-auto bg-white p-6 sm:p-10 md:p-12 rounded-[2rem] sm:rounded-[3rem] shadow-2xl border border-slate-200 animate-in fade-in slide-in-from-top-4 duration-300 mt-4 sm:mt-10">
        <div className="text-center mb-8 sm:mb-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 text-emerald-600 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-4 sm:mb-6 border border-emerald-100">🎓</div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Vào phòng thi</h2>
          <p className="text-slate-500 mt-2 text-sm font-bold opacity-70 uppercase tracking-widest">English Pro Exam</p>
        </div>
        
        <div className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest ml-2">Mã phòng thi</label>
            <input 
              type="text" 
              className="w-full p-4 sm:p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl sm:rounded-3xl outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-400 transition-all font-mono text-2xl sm:text-3xl text-center font-black text-emerald-600 placeholder:text-slate-200 uppercase"
              placeholder="MÃ PHÒNG"
              value={studentInfo.testCodeInput}
              onChange={e => { setStudentInfo({...studentInfo, testCodeInput: e.target.value.toUpperCase()}); setError(''); }}
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest ml-2">Họ và tên</label>
              <input 
                type="text" 
                className="w-full p-4 sm:p-5 bg-slate-50 border-2 border-slate-100 rounded-xl sm:rounded-2xl focus:border-blue-400 outline-none transition-all font-bold text-sm sm:text-base"
                placeholder="Nhập tên của bạn"
                value={studentInfo.name}
                onChange={e => setStudentInfo({...studentInfo, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest ml-2">Lớp</label>
              <input 
                type="text" 
                className="w-full p-4 sm:p-5 bg-slate-50 border-2 border-slate-100 rounded-xl sm:rounded-2xl focus:border-blue-400 outline-none transition-all font-bold text-center text-sm sm:text-base"
                placeholder="Ví dụ: 6A1"
                value={studentInfo.class}
                onChange={e => setStudentInfo({...studentInfo, class: e.target.value})}
              />
            </div>
          </div>

          {error && <div className="p-3 sm:p-4 bg-red-50 text-red-600 rounded-xl text-[10px] sm:text-xs font-black animate-pulse text-center uppercase tracking-widest">{error}</div>}

          <button 
            disabled={!studentInfo.name || !studentInfo.class || !studentInfo.testCodeInput}
            onClick={handleStart}
            className="w-full py-5 sm:py-6 bg-emerald-600 text-white font-black text-lg sm:text-xl rounded-2xl sm:rounded-3xl hover:bg-emerald-700 shadow-xl transition-all active:scale-95 disabled:opacity-50 mt-4"
          >
            Bắt đầu làm bài 🚀
          </button>
        </div>
      </div>
    );
  }

  // 3. GIAO DIỆN LÀM BÀI (RESPONSIVE)
  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-8 animate-in fade-in duration-500 pb-20 px-1 sm:px-4">
      {/* Header thu gọn trên mobile */}
      <header className="bg-white/90 backdrop-blur-md p-3 sm:p-5 md:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-white shadow-xl flex justify-between items-center sticky top-2 z-30">
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-blue-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-sm sm:text-xl shadow-lg">{test?.grade}</div>
          <div className="overflow-hidden">
            <h3 className="text-xs sm:text-lg font-black text-slate-900 truncate max-w-[120px] sm:max-w-none">{test?.title}</h3>
            <p className="text-[8px] sm:text-xs text-slate-400 font-bold uppercase truncate">{studentInfo.name} • Lớp {studentInfo.class}</p>
          </div>
        </div>
        <div className="px-3 py-1.5 sm:px-6 sm:py-3 bg-red-50 rounded-lg sm:rounded-2xl border border-red-100 text-center min-w-[70px] sm:min-w-[100px]">
             <span className="text-[7px] sm:text-[10px] font-black text-red-400 block uppercase tracking-widest">Thời gian</span>
             <span className="text-sm sm:text-2xl font-mono font-black text-red-600">{test?.duration}:00</span>
        </div>
      </header>

      {/* Danh sách câu hỏi */}
      <div className="space-y-6 sm:space-y-10">
        {test?.questions.map((q, idx) => (
          <div key={q.id} className="bg-white p-5 sm:p-10 rounded-[1.5rem] sm:rounded-[3rem] border border-slate-200 shadow-sm transition-all duration-300">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black flex-shrink-0 text-lg sm:text-xl">{idx + 1}</span>
              <div className="space-y-4 sm:space-y-6 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[8px] sm:text-[10px] font-black uppercase tracking-wider">{q.type}</span>
                  <span className="text-slate-400 text-[10px] sm:text-sm italic font-bold">Instruction: {q.instruction}</span>
                </div>
                <p className="text-lg sm:text-2xl font-bold text-slate-900 leading-relaxed">{q.content}</p>
                
                {q.options && q.options.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
                    {q.options.map((opt, optIdx) => {
                      const label = String.fromCharCode(65 + optIdx);
                      const isSelected = answers[q.id] === label;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => setAnswers({...answers, [q.id]: label})}
                          className={`flex items-center gap-3 sm:gap-5 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 text-left transition-all active:scale-95 ${
                            isSelected ? 'border-blue-600 bg-blue-50/50' : 'border-slate-50 bg-slate-50'
                          }`}
                        >
                          <span className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-sm sm:text-lg font-black border-2 transition-all ${
                             isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-300 border-slate-100'
                          }`}>{label}</span>
                          <span className={`text-sm sm:text-lg font-bold ${isSelected ? 'text-blue-900' : 'text-slate-600'}`}>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="relative">
                    <textarea
                      rows={3}
                      className="w-full p-4 sm:p-8 bg-slate-50 border-2 border-slate-100 rounded-xl sm:rounded-[2rem] outline-none focus:border-blue-400 transition-all text-sm sm:text-xl font-bold"
                      placeholder="Nhập câu trả lời của bạn..."
                      value={answers[q.id] || ""}
                      onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}
                    ></textarea>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Nút nộp bài (Lớn, dễ bấm) */}
      <div className="flex flex-col items-center gap-3 pt-6 pb-20">
        <button 
          onClick={handleSubmit}
          className="w-full sm:w-auto px-12 sm:px-24 py-5 sm:py-8 bg-emerald-600 text-white font-black text-xl sm:text-3xl rounded-2xl sm:rounded-[2.5rem] hover:bg-emerald-700 shadow-xl active:scale-95 flex items-center justify-center gap-4 sm:gap-6"
        >
          <span>NỘP BÀI THI</span>
          <span className="text-2xl sm:text-4xl">🚀</span>
        </button>
        <p className="text-slate-400 text-[10px] sm:text-sm font-bold uppercase tracking-widest">Kiểm tra kỹ trước khi nộp</p>
      </div>
    </div>
  );
};

export default StudentPortal;
