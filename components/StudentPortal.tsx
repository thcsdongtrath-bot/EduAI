
import React, { useState } from 'react';
import { TestData, StudentResult } from '../types';

interface StudentPortalProps {
  test: TestData | null;
  onSubmit: (result: StudentResult) => void;
  results: StudentResult[];
}

const StudentPortal: React.FC<StudentPortalProps> = ({ test, onSubmit, results }) => {
  const [studentInfo, setStudentInfo] = useState({ name: '', class: '', id: '' });
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentResult, setCurrentResult] = useState<StudentResult | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const normalizeString = (str: string) => {
    return str.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[.?!,]/g, '');
  };

  if (!test) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
        <div className="text-6xl mb-6">😴</div>
        <h3 className="text-xl font-bold text-slate-900">Chưa có bài kiểm tra nào được mở</h3>
        <p className="text-slate-500 mt-2">Vui lòng quay lại sau khi giáo viên đã kích hoạt đề bài.</p>
      </div>
    );
  }

  // Màn hình Kết quả
  if (finished && currentResult) {
    const isPassed = currentResult.score >= 5;
    return (
      <div className="space-y-8 animate-in zoom-in duration-300">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 text-center relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-2 ${isPassed ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <div className="text-6xl mb-4">{isPassed ? '🎉' : '✍️'}</div>
          <h2 className="text-3xl font-bold text-slate-900">Kết quả bài làm</h2>
          <p className="text-slate-500 mt-2">Thí sinh: <span className="font-bold text-slate-700">{currentResult.studentName}</span> - Lớp: {currentResult.studentClass}</p>
          
          <div className="mt-8 flex justify-center">
            <div className="relative">
              <svg className="w-40 h-40">
                <circle className="text-slate-100" strokeWidth="10" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80" />
                <circle 
                  className={isPassed ? "text-green-500" : "text-red-500"} 
                  strokeWidth="10" 
                  strokeDasharray={440} 
                  strokeDashoffset={440 - (currentResult.score / 10) * 440} 
                  strokeLinecap="round" 
                  stroke="currentColor" 
                  fill="transparent" 
                  r="70" cx="80" cy="80" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-900">{currentResult.score}</span>
                <span className="text-sm text-slate-500 font-bold">/ 10</span>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-slate-50 rounded-2xl inline-block text-left max-w-md mx-auto">
            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span>🤖</span> Nhận xét từ AI:
            </h4>
            <p className="text-slate-600 italic">
              {currentResult.score >= 9 ? "Xuất sắc! Bạn đã nắm rất vững kiến thức bài học này. Hãy tiếp tục phát huy nhé!" :
               currentResult.score >= 7 ? "Khá lắm! Bạn hiểu bài tốt, chỉ cần chú ý một chút ở các câu vận dụng cao." :
               currentResult.score >= 5 ? "Đạt yêu cầu. Bạn cần ôn tập thêm phần từ vựng và ngữ pháp để điểm cao hơn." :
               "Bạn cần dành thêm thời gian ôn luyện lại kiến thức Unit này. Đừng nản lòng nhé!"}
            </p>
          </div>

          <div className="mt-8 flex gap-4 justify-center">
            <button 
              onClick={() => { setStarted(false); setFinished(false); setCurrentResult(null); setAnswers({}); }}
              className="px-6 py-3 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-all"
            >
              Thoát
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900 px-2">Xem lại bài làm</h3>
          {test.questions.map((q, idx) => {
            const studentAns = answers[q.id] || "";
            const isCorrect = q.options && q.options.length > 0 
              ? studentAns === q.answer 
              : normalizeString(studentAns) === normalizeString(q.answer);

            return (
              <div key={q.id} className={`p-6 rounded-2xl border-2 bg-white transition-all ${isCorrect ? 'border-green-100 shadow-sm' : 'border-red-100 shadow-sm'}`}>
                <div className="flex gap-4">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold flex-shrink-0 ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-400 uppercase mb-1">{q.type}</p>
                    <p className="text-lg font-medium text-slate-900 mb-4">{q.content}</p>
                    
                    <div className="space-y-2">
                      <div className={`p-3 rounded-lg flex items-center justify-between ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                        <span><strong>Bạn chọn:</strong> {studentAns || "(Bỏ trống)"}</span>
                        <span>{isCorrect ? '✔️ Đúng' : '❌ Sai'}</span>
                      </div>
                      {!isCorrect && (
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-800">
                          <strong>Đáp án đúng:</strong> {q.answer}
                        </div>
                      )}
                      <div className="mt-3 p-3 bg-amber-50 rounded-lg text-amber-800 text-sm italic">
                        <strong>Giải thích:</strong> {q.explanation}
                      </div>
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

  // Màn hình Đăng nhập
  if (!started) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-lg mx-auto animate-in fade-in slide-in-from-top-4 duration-300">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🎓</div>
          <h2 className="text-2xl font-bold text-slate-900">Đăng nhập làm bài</h2>
          <p className="text-slate-500">Vui lòng điền thông tin chính xác</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên</label>
            <input 
              type="text" 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Nguyễn Văn A"
              value={studentInfo.name}
              onChange={e => setStudentInfo({...studentInfo, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Lớp</label>
            <input 
              type="text" 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="6A1"
              value={studentInfo.class}
              onChange={e => setStudentInfo({...studentInfo, class: e.target.value})}
            />
          </div>
          <button 
            disabled={!studentInfo.name || !studentInfo.class}
            onClick={() => setStarted(true)}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Bắt đầu làm bài ngay
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    let correctCount = 0;
    test.questions.forEach(q => {
      const studentAnswer = answers[q.id] || "";
      if (q.options && q.options.length > 0) {
        if (studentAnswer === q.answer) correctCount++;
      } else {
        if (normalizeString(studentAnswer) === normalizeString(q.answer)) {
          correctCount++;
        }
      }
    });
    
    const score = (correctCount / test.questions.length) * 10;
    const finalScore = Math.round(score * 10) / 10;

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
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-slate-200 flex justify-between items-center sticky top-4 z-20 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold">
            {test.grade}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{test.title}</h3>
            <p className="text-sm text-slate-500">Thí sinh: {studentInfo.name} - Lớp: {studentInfo.class}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="px-4 py-2 bg-red-50 border border-red-100 rounded-xl">
             <span className="text-xs font-bold text-red-400 block uppercase">Thời gian</span>
             <span className="text-xl font-mono font-bold text-red-600">{test.duration}:00</span>
          </div>
        </div>
      </header>

      <div className="space-y-6">
        {test.questions.map((q, idx) => (
          <div key={q.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex gap-6">
              <span className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold flex-shrink-0 text-lg">
                {idx + 1}
              </span>
              <div className="space-y-4 flex-1">
                <div className="inline-block px-4 py-1.5 bg-blue-50 rounded-full text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
                  {q.type}
                </div>
                <p className="text-slate-500 text-sm font-medium italic">{q.instruction}</p>
                <p className="text-xl font-bold text-slate-900 leading-relaxed">{q.content}</p>
                
                {q.options && q.options.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {q.options.map((opt, optIdx) => {
                      const label = String.fromCharCode(65 + optIdx);
                      const isSelected = answers[q.id] === label;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => setAnswers({...answers, [q.id]: label})}
                          className={`flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md ring-4 ring-blue-50' 
                              : 'border-slate-50 hover:border-blue-100 bg-slate-50 text-slate-600'
                          }`}
                        >
                          <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                             isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-300 border-slate-200'
                          }`}>
                            {label}
                          </span>
                          <span className="font-semibold">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-6">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Câu trả lời tự luận:</label>
                    <textarea
                      rows={3}
                      className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all text-slate-900 font-semibold text-lg"
                      placeholder="Hãy viết câu trả lời của bạn vào đây..."
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

      <div className="flex justify-center pt-10 pb-20">
        <button 
          onClick={handleSubmit}
          className="group relative px-20 py-5 bg-green-600 text-white font-black text-xl rounded-3xl hover:bg-green-700 shadow-2xl transform transition hover:-translate-y-2 active:scale-95 flex items-center gap-4"
        >
          <span>Nộp bài & Xem điểm</span>
          <span className="bg-white/20 p-2 rounded-xl group-hover:rotate-12 transition-transform">🚀</span>
        </button>
      </div>
    </div>
  );
};

export default StudentPortal;
