import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Circle, Clock, BookOpen, Brain, 
  BarChart3, Plus, Trash2, Sparkles, Send, 
  GraduationCap, Calendar, Settings, Play, Pause, RotateCcw, 
  Search, ShieldCheck, Database, Award, Flame
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

interface Note {
  id: string;
  title: string;
  course: string;
  content: string;
  updatedAt: string;
}

interface Flashcard {
  q: string;
  a: string;
}

export function StudentProductivityApp({ onElementSelect }: { onElementSelect?: (element: any) => void }) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks' | 'tutor' | 'notes' | 'timer' | 'analytics'>('dashboard');
  
  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Implement Binary Search Tree in C++', course: 'CS 201', dueDate: 'Tomorrow, 5:00 PM', priority: 'High', completed: false },
    { id: '2', title: 'Read Multivariable Calculus Ch. 4 (Jacobians)', course: 'MATH 302', dueDate: 'Nov 6, 11:59 PM', priority: 'Medium', completed: true },
    { id: '3', title: 'Draft Research Proposal on Transformer Attention', course: 'AI 405', dueDate: 'Nov 8, 2:00 PM', priority: 'High', completed: false },
    { id: '4', title: 'Organic Chemistry Lab Prep: Esterification', course: 'CHEM 210', dueDate: 'Nov 9, 9:00 AM', priority: 'Low', completed: false },
    { id: '5', title: 'Submit Linear Algebra Problem Set #5', course: 'MATH 240', dueDate: 'Nov 10, 6:00 PM', priority: 'Medium', completed: false },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCourse, setNewTaskCourse] = useState('CS 201');
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Notes state
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Backpropagation & Gradient Descent Derivation',
      course: 'AI 405',
      content: 'Chain rule applied across multilayer perceptron. Loss function L(w) with learning rate alpha. Key insight: compute gradients backwards to reuse intermediate activations.',
      updatedAt: '2 hours ago',
    },
    {
      id: '2',
      title: 'Stokes Theorem & Vector Surface Integrals',
      course: 'MATH 302',
      content: 'Line integral around closed boundary curve equals surface integral of curl over bounded orientation. Useful for fluid circulation and electromagnetic flux.',
      updatedAt: 'Yesterday',
    },
    {
      id: '3',
      title: 'Red-Black Tree Balancing Invariants',
      course: 'CS 201',
      content: '1. Every node is red or black. 2. Root is black. 3. No two consecutive red nodes. 4. Equal black height on all root-to-leaf paths.',
      updatedAt: '3 days ago',
    },
  ]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0]);
  const [newNoteTitle, setNewNoteTitle] = useState('');

  // AI Tutor Chat state
  const [tutorMessages, setTutorMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; flashcards?: Flashcard[] }>>([
    {
      sender: 'ai',
      text: "Hello Alex! I am your AI Study Assistant. I can summarize lecture slides, generate flashcards, explain difficult STEM concepts, or quiz you for your upcoming CS 201 and MATH 302 midterms. What are we studying today?",
    },
  ]);
  const [tutorInput, setTutorInput] = useState('');
  const [isTutorThinking, setIsTutorThinking] = useState(false);

  // Pomodoro Timer state
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [timerMode, setTimerMode] = useState<'focus' | 'break'>('focus');

  useEffect(() => {
    let interval: any = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
      if (timerMode === 'focus') {
        setTimerMode('break');
        setTimerSeconds(5 * 60);
      } else {
        setTimerMode('focus');
        setTimerSeconds(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds, timerMode]);

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      course: newTaskCourse,
      dueDate: 'Due in 3 days',
      priority: newTaskPriority,
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleTutorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorInput.trim() || isTutorThinking) return;

    const userQuery = tutorInput.trim();
    setTutorMessages((prev) => [...prev, { sender: 'user', text: userQuery }]);
    setTutorInput('');
    setIsTutorThinking(true);

    setTimeout(() => {
      let aiResponse = '';
      let generatedCards: Flashcard[] | undefined = undefined;

      if (userQuery.toLowerCase().includes('quiz') || userQuery.toLowerCase().includes('flashcard')) {
        aiResponse = "Here are 3 high-yield review cards on this concept:";
        generatedCards = [
          { q: 'What is the time complexity of searching an AVL tree?', a: 'O(log n) worst-case due to strict balance factor of {-1, 0, +1}.' },
          { q: 'How does backpropagation compute weight updates?', a: 'It calculates the partial derivative of the error with respect to each weight via chain rule.' },
          { q: 'What does the Jacobian matrix represent geometrically?', a: 'The local linear transformation and distortion ratio of a multivariable vector field.' }
        ];
      } else if (userQuery.toLowerCase().includes('calculus') || userQuery.toLowerCase().includes('math')) {
        aiResponse = "In Multivariable Calculus, when changing variables in a double or triple integral, the Jacobian determinant |J| acts as the local area scaling factor: dx dy = |∂(x,y)/∂(u,v)| du dv. Would you like a step-by-step example with polar coordinates?";
      } else {
        aiResponse = `Great question on "${userQuery}". Let's break this down into 3 core principles:
1. Core definition and first principles.
2. Step-by-step problem-solving strategy.
3. Common midterm exam pitfalls to avoid.

Shall I generate a 5-question practice quiz to test your mastery?`;
      }

      setTutorMessages((prev) => [
        ...prev,
        { sender: 'ai', text: aiResponse, flashcards: generatedCards },
      ]);
      setIsTutorThinking(false);
    }, 600);
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === 'pending') return !t.completed;
    if (taskFilter === 'completed') return t.completed;
    return true;
  });

  return (
    <div 
      className="h-full w-full bg-slate-900 text-slate-100 flex flex-col font-sans select-none overflow-hidden"
      data-component="StudentProductivityApp"
      data-file="src/components/preview-apps/StudentProductivityApp.tsx"
    >
      {/* Top Banner Navigation */}
      <header className="h-14 border-b border-slate-800 bg-slate-950/80 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <GraduationCap className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              PulseDesk AI
              <span className="text-[10px] text-emerald-400 font-mono font-medium bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-800/40">v2.4 Production</span>
            </div>
          </div>
        </div>

        {/* Tab switcher buttons */}
        <nav className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${activeTab === 'tasks' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Tasks ({tasks.filter(t => !t.completed).length})
          </button>
          <button
            onClick={() => setActiveTab('tutor')}
            className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-colors ${activeTab === 'tutor' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Brain className="h-3 w-3 text-emerald-300" />
            AI Tutor
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${activeTab === 'notes' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Notes
          </button>
          <button
            onClick={() => setActiveTab('timer')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${activeTab === 'timer' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Focus Timer
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${activeTab === 'analytics' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Analytics
          </button>
        </nav>

        {/* User Profile & Database Indicator */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Database className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">PostgreSQL Synced</span>
          </div>
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="h-6 w-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">
              AC
            </div>
            <span className="text-slate-300 font-medium hidden md:inline">Alex Chen</span>
          </div>
        </div>
      </header>

      {/* Main Viewport Content */}
      <main className="flex-1 overflow-y-auto p-5">
        {activeTab === 'dashboard' && (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Welcome banner & Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Welcome back, Alex</h1>
                <p className="text-xs text-slate-400 mt-1">You have 3 high-priority assignments due this week. Your current study streak is 12 days!</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
                  <Flame className="h-4 w-4 text-amber-500" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">STREAK</span>
                    <span className="text-white font-bold tabular-nums">12 Days</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
                  <Award className="h-4 w-4 text-emerald-400" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">CURRENT GPA</span>
                    <span className="text-emerald-400 font-bold tabular-nums">3.92 / 4.0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Upcoming Deadlines */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-400" />
                    Urgent Deliverables
                  </h3>
                  <button onClick={() => setActiveTab('tasks')} className="text-xs text-emerald-400 hover:underline">View all</button>
                </div>
                <div className="space-y-2">
                  {tasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 flex items-start gap-2.5">
                      <button onClick={() => toggleTask(task.id)} className="mt-0.5 text-slate-500 hover:text-emerald-400">
                        {task.completed ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Circle className="h-4 w-4" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-medium truncate ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {task.title}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="text-emerald-400">{task.course}</span>
                          <span>·</span>
                          <span>{task.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Study Assistant Quick Prompter */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Brain className="h-4 w-4 text-purple-400" />
                    AI Study Companion
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Ask questions, generate flashcards, or simplify complex theorems before your exam.
                  </p>
                </div>
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      setActiveTab('tutor');
                      setTutorInput('Generate 3 practice quiz questions for CS 201 Trees & Heaps');
                    }}
                    className="w-full text-left p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:border-emerald-500/50 hover:text-white transition-colors"
                  >
                    💡 Quiz me on CS 201 Binary Trees
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('tutor');
                      setTutorInput('Explain Jacobians and change of variables in 3 bullet points');
                    }}
                    className="w-full text-left p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:border-emerald-500/50 hover:text-white transition-colors"
                  >
                    📐 Explain Jacobians & Surface Integrals
                  </button>
                </div>
              </div>

              {/* Quick Focus Session */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Clock className="h-4 w-4 text-emerald-400" />
                    Focus Deep Work
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">25-minute Pomodoro focus block to enter deep flow.</p>
                </div>
                <div className="text-center py-2">
                  <div className="text-3xl font-mono font-bold text-white tracking-widest tabular-nums">
                    {formatTimer(timerSeconds)}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-medium uppercase tracking-wider mt-1">
                    {timerMode === 'focus' ? 'Deep Study Interval' : 'Rest Break'}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setTimerActive(!timerActive);
                    setActiveTab('timer');
                  }}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  {timerActive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  {timerActive ? 'Pause Session' : 'Start Focus Session'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tasks View */}
        {activeTab === 'tasks' && (
          <div className="max-w-4xl mx-auto space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Assignment & Task Tracker</h2>
                <p className="text-xs text-slate-400">Organized with automated priority sorting and PostgreSQL persistence.</p>
              </div>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setTaskFilter('all')}
                  className={`px-2.5 py-1 rounded transition-colors ${taskFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
                >
                  All ({tasks.length})
                </button>
                <button
                  onClick={() => setTaskFilter('pending')}
                  className={`px-2.5 py-1 rounded transition-colors ${taskFilter === 'pending' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
                >
                  Pending ({tasks.filter(t => !t.completed).length})
                </button>
                <button
                  onClick={() => setTaskFilter('completed')}
                  className={`px-2.5 py-1 rounded transition-colors ${taskFilter === 'completed' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
                >
                  Completed ({completedCount})
                </button>
              </div>
            </div>

            {/* Add Task Form */}
            <form onSubmit={addTask} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-wrap gap-2 items-center">
              <input
                type="text"
                placeholder="Add a new assignment, problem set, or reading..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1 min-w-[200px] bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <select
                value={newTaskCourse}
                onChange={(e) => setNewTaskCourse(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="CS 201">CS 201 (Algorithms)</option>
                <option value="MATH 302">MATH 302 (Calc III)</option>
                <option value="AI 405">AI 405 (Deep Learning)</option>
                <option value="CHEM 210">CHEM 210 (Org Chem)</option>
              </select>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Task
              </button>
            </form>

            {/* Tasks List */}
            <div className="space-y-2">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-xl bg-slate-950 border transition-all flex items-center justify-between gap-3 ${
                    task.completed ? 'border-slate-800/60 opacity-70' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button onClick={() => toggleTask(task.id)} className="text-slate-500 hover:text-emerald-400 transition-colors">
                      {task.completed ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <Circle className="h-5 w-5" />}
                    </button>
                    <div className="min-w-0">
                      <div className={`text-xs font-semibold ${task.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                        {task.title}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="text-emerald-400 font-medium">{task.course}</span>
                        <span>·</span>
                        <span>{task.dueDate}</span>
                        <span>·</span>
                        <span className={`font-mono ${
                          task.priority === 'High' ? 'text-rose-400' : task.priority === 'Medium' ? 'text-amber-400' : 'text-slate-400'
                        }`}>
                          {task.priority} Priority
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-slate-600 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-900 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Tutor View */}
        {activeTab === 'tutor' && (
          <div className="max-w-4xl mx-auto h-[550px] flex flex-col bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
            <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-400" />
                <span className="text-xs font-bold text-white">AI Study Assistant & Tutor</span>
                <span className="text-[10px] text-slate-400">Context: Alex Chen (CS & Math)</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                <ShieldCheck className="h-3.5 w-3.5" />
                Syllabus Verified
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {tutorMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 max-w-2xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div
                    className={`h-7 w-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                      msg.sender === 'user' ? 'bg-emerald-600 text-white' : 'bg-purple-900/40 text-purple-300 border border-purple-800/50'
                    }`}
                  >
                    {msg.sender === 'user' ? 'AC' : <Brain className="h-4 w-4" />}
                  </div>
                  <div
                    className={`p-3.5 rounded-xl text-xs leading-relaxed space-y-3 ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600/20 text-emerald-100 border border-emerald-500/30'
                        : 'bg-slate-900 text-slate-200 border border-slate-800'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>
                    {msg.flashcards && (
                      <div className="space-y-2 pt-1 border-t border-slate-800">
                        <div className="text-[11px] font-semibold text-emerald-400">Interactive Flashcards:</div>
                        {msg.flashcards.map((card, cidx) => (
                          <div key={cidx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                            <div className="font-semibold text-slate-200">Q: {card.q}</div>
                            <div className="text-slate-400">A: {card.a}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTutorThinking && (
                <div className="flex gap-2 text-xs text-slate-400 items-center">
                  <Sparkles className="h-3.5 w-3.5 text-purple-400 animate-spin" />
                  Generating study explanation...
                </div>
              )}
            </div>

            <form onSubmit={handleTutorSubmit} className="p-3 border-t border-slate-800 bg-slate-900/30 flex gap-2">
              <input
                type="text"
                placeholder="Ask about formulas, proof strategies, algorithms, or ask for a quiz..."
                value={tutorInput}
                onChange={(e) => setTutorInput(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                disabled={isTutorThinking || !tutorInput.trim()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Send className="h-3 w-3" />
                Ask Tutor
              </button>
            </form>
          </div>
        )}

        {/* Notes View */}
        {activeTab === 'notes' && (
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 h-[520px]">
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 space-y-3 flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Notebooks ({notes.length})</h3>
                <button
                  onClick={() => {
                    const newN: Note = {
                      id: Date.now().toString(),
                      title: 'New Study Note',
                      course: 'CS 201',
                      content: 'Start writing markdown lecture notes here...',
                      updatedAt: 'Just now',
                    };
                    setNotes([newN, ...notes]);
                    setSelectedNote(newN);
                  }}
                  className="p-1 rounded bg-slate-900 border border-slate-800 text-emerald-400 hover:bg-slate-800"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-1.5">
                {notes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => setSelectedNote(note)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors ${
                      selectedNote?.id === note.id
                        ? 'bg-emerald-950/40 border border-emerald-500/40 text-white'
                        : 'bg-slate-900/60 border border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-semibold truncate">{note.title}</div>
                    <div className="text-[10px] text-slate-500 flex items-center justify-between mt-1">
                      <span>{note.course}</span>
                      <span>{note.updatedAt}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 bg-slate-950 rounded-xl border border-slate-800 p-4 flex flex-col justify-between">
              {selectedNote ? (
                <div className="space-y-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <input
                      type="text"
                      value={selectedNote.title}
                      onChange={(e) => {
                        const updated = { ...selectedNote, title: e.target.value };
                        setSelectedNote(updated);
                        setNotes(notes.map((n) => (n.id === updated.id ? updated : n)));
                      }}
                      className="bg-transparent text-sm font-bold text-white focus:outline-none flex-1"
                    />
                    <span className="text-[11px] text-emerald-400 font-mono">{selectedNote.course}</span>
                  </div>
                  <textarea
                    value={selectedNote.content}
                    onChange={(e) => {
                      const updated = { ...selectedNote, content: e.target.value };
                      setSelectedNote(updated);
                      setNotes(notes.map((n) => (n.id === updated.id ? updated : n)));
                    }}
                    rows={12}
                    className="flex-1 bg-slate-900/40 p-3 rounded-lg border border-slate-800/80 text-xs text-slate-300 font-mono resize-none focus:outline-none focus:border-emerald-500"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Markdown supported · Auto-saved to Cloud DB</span>
                    <button
                      onClick={() => {
                        setNotes(notes.filter((n) => n.id !== selectedNote.id));
                        setSelectedNote(notes[0] || null);
                      }}
                      className="text-rose-400 hover:underline"
                    >
                      Delete Note
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500 text-center my-auto">Select or create a note to view content.</div>
              )}
            </div>
          </div>
        )}

        {/* Pomodoro Timer View */}
        {activeTab === 'timer' && (
          <div className="max-w-md mx-auto text-center space-y-6 py-8">
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 space-y-6">
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => {
                    setTimerMode('focus');
                    setTimerSeconds(25 * 60);
                    setTimerActive(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    timerMode === 'focus' ? 'bg-emerald-600 text-white' : 'text-slate-400 bg-slate-900'
                  }`}
                >
                  Focus Block (25m)
                </button>
                <button
                  onClick={() => {
                    setTimerMode('break');
                    setTimerSeconds(5 * 60);
                    setTimerActive(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    timerMode === 'break' ? 'bg-emerald-600 text-white' : 'text-slate-400 bg-slate-900'
                  }`}
                >
                  Short Break (5m)
                </button>
              </div>

              <div className="text-6xl font-mono font-extrabold text-white tracking-widest tabular-nums my-4">
                {formatTimer(timerSeconds)}
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setTimerActive(!timerActive)}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-lg shadow-emerald-950"
                >
                  {timerActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {timerActive ? 'Pause' : 'Start Focus'}
                </button>
                <button
                  onClick={() => {
                    setTimerActive(false);
                    setTimerSeconds(timerMode === 'focus' ? 25 * 60 : 5 * 60);
                  }}
                  className="p-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analytics View */}
        {activeTab === 'analytics' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400 text-xs">Total Study Hours</div>
                <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">48.5 hrs</div>
                <div className="text-[10px] text-emerald-400 mt-1 font-mono">↑ 14% vs last week</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400 text-xs">Assignments Done</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">38 / 42</div>
                <div className="text-[10px] text-slate-500 mt-1 font-mono">90.4% completion rate</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400 text-xs">Flashcards Mastered</div>
                <div className="text-2xl font-bold font-mono text-purple-400 mt-1 tabular-nums">142 cards</div>
                <div className="text-[10px] text-purple-400 mt-1 font-mono">Anki space-repetition active</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400 text-xs">Cumulative GPA</div>
                <div className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">3.92</div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">Top 5% of class</div>
              </div>
            </div>

            {/* Weekly Study Distribution Chart */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Weekly Study Hours by Course</h3>
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>CS 201: Algorithms & Data Structures</span>
                    <span className="font-mono text-emerald-400 tabular-nums">18.5 hrs (38%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '38%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>AI 405: Deep Neural Networks</span>
                    <span className="font-mono text-purple-400 tabular-nums">15.0 hrs (31%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '31%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>MATH 302: Multivariable Calculus</span>
                    <span className="font-mono text-blue-400 tabular-nums">10.0 hrs (21%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '21%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>CHEM 210: Organic Chemistry</span>
                    <span className="font-mono text-amber-400 tabular-nums">5.0 hrs (10%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '10%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
