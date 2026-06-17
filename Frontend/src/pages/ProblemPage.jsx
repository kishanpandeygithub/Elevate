import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import Editor from '@monaco-editor/react';
import axios from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import ChatAi from '../component/ChatAi';
import { checkAuth } from '../authSlice';

const ProblemPage = () => {

     const { problemId } = useParams();
     const navigate = useNavigate();
     const dispatch = useDispatch();
     
     const { isAuthenticated,loading , user } = useSelector((state) => state.auth);

     const [problem, setProblem] = useState(null);
     const [code, setCode] = useState('');
     const [language, setLanguage] = useState('javascript');
     const [solutionsLanguage, setSolutionsLanguage] = useState('javascript');
     const [isRunning, setIsRunning] = useState(false);
     const [isSubmitting, setIsSubmitting] = useState(false);
     const [runResults, setRunResults] = useState(null);
     const [submissionResult, setSubmissionResult] = useState(null);
     const [submissions, setSubmissions] = useState([]);
     const [isLoading, setIsLoading] = useState(true);
     const [error, setError] = useState(null);
     const [leftPanelTab, setLeftPanelTab] = useState('description');
     const [iniCode, setIniCode] = useState(null);
     const [showReferenceSolution, setShowReferenceSolution] = useState(false);
     const [selectedSubmission, setSelectedSubmission] = useState(null);
     const [availableLanguages, setAvailableLanguages] = useState([]);

     const [authChecked, setAuthChecked] = useState(false);

     const editorRef = useRef(null);
     const isGuest = user?.firstName === 'Guest';

     // FIX: Check authentication from server on component mount
     useEffect(() => {
          const verifyAuth = async () => {
               try {
                    // Call checkAuth to verify token with server
                    await dispatch(checkAuth()).unwrap();
               } catch (err) {
                    // If checkAuth fails, user is not authenticated
                    console.log('Auth check failed:', err);
               } finally {
                    setAuthChecked(true);
               }
          };

          verifyAuth();
     }, [dispatch]);


     useEffect(() => {
          
          if(!authChecked)return;

          if (!problemId) {
               setError('No problem ID in URL');
               setIsLoading(false);
               return;
          }
          if(loading)return;
          if (!isAuthenticated) {
               setError('Please login to view problems');
               setIsLoading(false);
               return;
          }

          const fetchProblem = async () => {
               try {
                    setIsLoading(true);
                    const response = await axios.get(`/problem/problemById/${problemId}`);
                    const prob = response.data;

                    const langs = prob.startCode.map(sc => sc.language);
                    setAvailableLanguages(langs);

                    let defaultLang = 'javascript';
                    if (langs.includes('javascript')) defaultLang = 'javascript';
                    else if (langs.length > 0) defaultLang = langs[0];
                    setLanguage(defaultLang);
                    setSolutionsLanguage(defaultLang);

                    const initialCodeObj = prob.startCode.find(sc => sc.language === defaultLang);
                    const initialCode = initialCodeObj?.initialCode || '// Write your code here';
                    setIniCode(initialCode);
                    setCode(initialCode);

                    setProblem(prob);
                    setIsLoading(false);
               } catch (err) {
                    console.error(err);
                    setError('Failed to load problem');
                    setIsLoading(false);
               }
          };
          
          fetchProblem();
     }, [problemId, isAuthenticated, loading ,authChecked]);

     useEffect(() => {
          if (problem && problem.startCode) {
               const matched = problem.startCode.find(sc => sc.language === language);
               const newCode = matched?.initialCode || '';
               setIniCode(newCode);
               setCode(newCode);
          }
     }, [language, problem]);

     const fetchSubmissions = async () => {
          try {
               const response = await axios.get(`/problem/submittedProblem/${problemId}`);
               const data = response.data;
               if (Array.isArray(data)) {
                    setSubmissions(data);
               } else {
                    setSubmissions([]);
               }
          } catch (err) {
               console.error('Failed to fetch submissions', err);
               setSubmissions([]);
          }
     };

     const handleRunCode = async () => {
          if (!code.trim()) return;
          setIsRunning(true);
          setRunResults(null);
          setSubmissionResult(null);
          try {
               const response = await axios.post(`/submission/run/${problemId}`, { code, language });
               setRunResults(response.data);
               setLeftPanelTab('results');
          } catch (err) {
               setRunResults({ error: err.response?.data || 'Failed to run code' });
               setLeftPanelTab('results');
          } finally {
               setIsRunning(false);
          }
     };

     const handleSubmitCode = async () => {
          if (!code.trim()) return;
          setIsSubmitting(true);
          setSubmissionResult(null);
          setRunResults(null);
          try {
               const response = await axios.post(`/submission/submit/${problemId}`, { code, language });
               setSubmissionResult(response.data);
               setLeftPanelTab('results');
               fetchSubmissions();
          } catch (err) {
               setSubmissionResult({ error: err.response?.data || 'Failed to submit code' });
               setLeftPanelTab('results');
          } finally {
               setIsSubmitting(false);
          }
     };

     const handleClearEditor = () => setCode(iniCode);

     const handleLoginClick = async () => {
          if (user?.firstName === 'Guest') await dispatch(logoutUser());
          navigate('/login');
     };

     const getStatusColor = (status) => {
          switch (status?.toLowerCase()) {
               case 'accepted': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
               case 'wrong': return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
               case 'error': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
               default: return 'bg-zinc-800 text-zinc-400';
          }
     };

     if (isLoading||loading) {
          return (
               <div className="flex justify-center items-center h-screen bg-[#070708]">
                    <div className="flex flex-col items-center gap-3">
                         <div className="animate-spin rounded-full border-t-2 border-b-2 border-orange-500 w-12 h-12" />
                         <span className="text-zinc-500 text-xs font-medium tracking-wider uppercase">Loading Workspace...</span>
                    </div>
               </div>
          );
     }

     if (error) {
          return (
               <div className="flex items-center justify-center h-screen bg-[#070708] text-zinc-300 px-4">
                    <div className="text-center max-w-sm bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl">
                         <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-4">✕</div>
                         <h2 className="text-base font-bold text-zinc-200 mb-2">{error}</h2>
                         <p className="text-xs text-zinc-500 mb-5">Ensure you are properly authenticated or verify the route address context.</p>
                         <button onClick={() => window.location.reload()} className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-sm font-semibold rounded-xl text-zinc-200 transition-colors">Try Again</button>
                    </div>
               </div>
          );
     }

     if (!problem) return null;

     const formatLanguageName = (lang) => {
          if (lang === 'c++') return 'C++';
          if (lang === 'javascript') return 'JavaScript';
          return lang.charAt(0).toUpperCase() + lang.slice(1);
     };

     return (
          <div className="flex h-screen bg-[#070708] text-zinc-300 antialiased font-sans overflow-hidden">

               {/* Left Pane - Layout Context details */}
               <div className="w-1/2 flex flex-col border-r border-zinc-900 bg-[#09090b]">
                    {/* Problem Header Information */}
                    <div className="p-6 pb-4 flex-shrink-0 bg-gradient-to-b from-zinc-950/40 to-transparent">
                         <h1 className="text-xl font-bold text-zinc-100 tracking-tight mb-3">{problem.title}</h1>
                         <div className="flex items-center gap-2">
                              <span className={`px-2.5 py-0.5 rounded-md text-xs font-black uppercase tracking-wider ${problem.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-400' :
                                   problem.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-500' :
                                        'bg-rose-500/10 text-rose-400'
                                   }`}>
                                   {problem.difficulty}
                              </span>
                              <span className="text-[11px] font-medium bg-zinc-900 text-zinc-400 border border-zinc-800/80 px-2 py-0.5 rounded-md">
                                   {problem.tags}
                              </span>
                         </div>
                    </div>

                    {/* Left Navigation Workspace Controls */}
                    <div className="flex px-4 border-b border-zinc-900 flex-shrink-0 bg-zinc-950/20 gap-1">
                         {['description', 'solutions', 'submissions', 'chatAi'].map((tab) => (
                              <button
                                   key={tab}
                                   onClick={() => {
                                        setLeftPanelTab(tab);
                                        if (tab === 'submissions') fetchSubmissions();
                                   }}
                                   className={`px-4 py-2.5 text-xs font-bold tracking-wide uppercase border-b-2 transition-all ${leftPanelTab === tab
                                        ? 'text-orange-500 border-orange-500 bg-orange-500/[0.02]'
                                        : 'text-zinc-500 border-transparent hover:text-zinc-300'
                                        }`}
                              >
                                   {tab}
                              </button>
                         ))}
                         {(runResults || submissionResult) && (
                              <button
                                   onClick={() => setLeftPanelTab('results')}
                                   className={`px-4 py-2.5 text-xs font-bold tracking-wide uppercase border-b-2 transition-all relative ${leftPanelTab === 'results'
                                        ? 'text-orange-500 border-orange-500 bg-orange-500/[0.02]'
                                        : 'text-zinc-400 border-transparent'
                                        }`}
                              >
                                   Results
                                   {leftPanelTab !== 'results' && <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>}
                              </button>
                         )}
                    </div>

                    {/* Tab Panels Content Viewport */}
                    <div className="flex-1 min-h-0 overflow-hidden">
                         <div className="h-full overflow-y-auto p-6 space-y-6">

                              {/* Description Context Viewport */}
                              {leftPanelTab === 'description' && (
                                   <div className="space-y-6">
                                        <div className="text-zinc-300 leading-relaxed text-sm font-normal whitespace-pre-line bg-zinc-950/30 p-4 border border-zinc-900 rounded-xl">
                                             {problem.description}
                                        </div>

                                        <div className="space-y-4">
                                             <h3 className="text-xs font-black uppercase tracking-wider text-zinc-500">Visible Test Cases</h3>
                                             {problem.visibleTestCases.map((testCase, index) => (
                                                  <div key={index} className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-900 space-y-3">
                                                       <div>
                                                            <span className="font-mono text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Input</span>
                                                            <pre className="bg-zinc-900 text-zinc-300 p-3 rounded-lg border border-zinc-850 mt-1.5 overflow-x-auto text-xs font-mono">{testCase.input}</pre>
                                                       </div>
                                                       <div>
                                                            <span className="font-mono text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Output</span>
                                                            <pre className="bg-zinc-900 text-emerald-400 p-3 rounded-lg border border-zinc-850 mt-1.5 overflow-x-auto text-xs font-mono">{testCase.output}</pre>
                                                       </div>
                                                       {testCase.explanation && (
                                                            <p className="text-xs text-zinc-400 border-l-2 border-zinc-800 pl-3 italic">{testCase.explanation}</p>
                                                       )}
                                                  </div>
                                             ))}
                                        </div>
                                   </div>
                              )}

                              {/* Solutions Context Viewport */}
                              {leftPanelTab === 'solutions' && (
                                   <div className="space-y-4">
                                        {!showReferenceSolution ? (
                                             <div className="text-center py-12 bg-zinc-950/30 rounded-xl border border-zinc-900">
                                                  <button onClick={() => setShowReferenceSolution(true)} className="btn btn-sm bg-orange-500 hover:bg-orange-600 border-none text-black font-bold normal-case rounded-lg px-6">
                                                       Reveal Solutions
                                                  </button>
                                             </div>
                                        ) : (
                                             <div className="space-y-4">
                                                  <div className="flex items-center justify-between bg-zinc-950 p-3 border border-zinc-900 rounded-xl">
                                                       <span className="text-xs font-semibold text-zinc-400">Target Environment:</span>
                                                       <select value={solutionsLanguage} onChange={(e) => setSolutionsLanguage(e.target.value)} className="select select-xs bg-zinc-900 border-zinc-800 focus:outline-none rounded-lg text-xs text-zinc-300">
                                                            {availableLanguages.map(lang => (
                                                                 <option key={lang} value={lang}>{formatLanguageName(lang)}</option>
                                                            ))}
                                                       </select>
                                                  </div>
                                                  <pre className="bg-zinc-950 text-zinc-300 p-4 rounded-xl border border-zinc-900 overflow-x-auto text-xs font-mono leading-relaxed">
                                                       {problem.referenceSolution?.find(s => s.language === solutionsLanguage)?.completeCode || 'No solution available'}
                                                  </pre>
                                             </div>
                                        )}
                                   </div>
                              )}

                              {/* Submissions Context Viewport */}
                              {leftPanelTab === 'submissions' && !isGuest && (
                                   <div className="space-y-4">
                                        <h3 className="text-xs font-black uppercase tracking-wider text-zinc-500">Your Submissions</h3>
                                        {submissions?.length > 0 ? (
                                             <div className="space-y-2.5">
                                                  {submissions.map(sub => (
                                                       <div key={sub._id} className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-zinc-800 transition-colors">
                                                            <div className="space-y-1.5">
                                                                 <div className="flex items-center gap-2">
                                                                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${getStatusColor(sub.status)}`}>
                                                                           {sub.status}
                                                                      </span>
                                                                      <span className="text-[11px] text-zinc-500 font-mono">{new Date(sub.createdAt).toLocaleString()}</span>
                                                                 </div>
                                                                 <div className="text-[11px] text-zinc-400 font-mono">
                                                                      Lang: <span className="text-zinc-200">{sub.language}</span> • Run: <span className="text-zinc-200">{sub.runtime}ms</span> • Mem: <span className="text-zinc-200">{sub.memory}KB</span> • Score: <span className="text-zinc-200">{sub.testCasesPassed}/{sub.testCasesTotal}</span>
                                                                 </div>
                                                            </div>
                                                            <button onClick={() => setSelectedSubmission(sub)} className="btn btn-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800 hover:border-zinc-700 normal-case rounded-lg font-medium self-start sm:self-center">
                                                                 View Code
                                                            </button>
                                                       </div>
                                                  ))}
                                             </div>
                                        ) : (
                                             <div className="text-center py-12 bg-zinc-950/20 border border-zinc-900 rounded-xl text-xs text-zinc-500">No submissions found for this timeline profile.</div>
                                        )}
                                   </div>
                              )}

                              {/* //left pannel chatAi context window */}
                              {leftPanelTab === 'chatAi' && (
                                   <div className="space-y-6">
                                        <div className="text-zinc-300 leading-relaxed text-sm font-normal whitespace-pre-line bg-zinc-950/30 p-4 border border-zinc-900 rounded-xl">
                                            Here You can Chat with the AI
                                        </div>

                                        <div className="space-y-4">
                                             <h3 className="text-xs font-black uppercase tracking-wider text-zinc-500">Chat With Ai</h3>

                                             <ChatAi problem={problem} ></ChatAi>
                                        </div>
                                   </div>
                              )}

                              {/* Guest Auth Boundary for Submissions */}
                              {leftPanelTab === 'submissions' && isGuest && (
                                   <div className="text-center py-12 bg-zinc-950/20 border border-zinc-900 rounded-xl">
                                        <button onClick={handleLoginClick} className="btn btn-sm bg-rose-500 hover:bg-rose-600 border-none text-white font-bold normal-case rounded-lg px-6">
                                             Login to view submissions
                                        </button>
                                   </div>
                              )}

                              {/* Live Core Engine Results Tab */}
                              {leftPanelTab === 'results' && (
                                   <div className="space-y-4">
                                        <h3 className="text-xs font-black uppercase tracking-wider text-zinc-500">{submissionResult ? 'Submission Terminal Output' : 'Test Case Logs'}</h3>

                                        {submissionResult && (
                                             <div className={`p-4 rounded-xl border border-zinc-900 space-y-3 ${submissionResult.status === 'accepted' ? 'bg-emerald-500/[0.02]' : 'bg-rose-500/[0.02]'}`}>
                                                  <div className={`font-mono text-sm font-black uppercase tracking-wider ${submissionResult.status === 'accepted' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                       {submissionResult.status === 'accepted' ? '🎉 Verdict: Accepted' : `❌ Verdict: ${submissionResult.status}`}
                                                  </div>
                                                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono bg-zinc-950 p-2 rounded-lg border border-zinc-900">
                                                       <div><p className="text-zinc-500 text-[10px] uppercase">Runtime</p><p className="text-zinc-200 mt-0.5 font-bold">{submissionResult.runtime}ms</p></div>
                                                       <div><p className="text-zinc-500 text-[10px] uppercase">Memory</p><p className="text-zinc-200 mt-0.5 font-bold">{submissionResult.memory}KB</p></div>
                                                       <div><p className="text-zinc-500 text-[10px] uppercase">Passed</p><p className="text-zinc-200 mt-0.5 font-bold">{submissionResult.testCasesPassed}/{submissionResult.testCasesTotal}</p></div>
                                                  </div>
                                                  {submissionResult.errorMessage && <pre className="text-xs p-3 bg-zinc-950 border border-zinc-900 text-rose-400 font-mono rounded-lg overflow-x-auto whitespace-pre-wrap">{submissionResult.errorMessage}</pre>}
                                             </div>
                                        )}

                                        {runResults && Array.isArray(runResults) && (
                                             <div className="space-y-3">
                                                  <div className="text-xs font-mono text-zinc-400 bg-zinc-950 p-3 rounded-xl border border-zinc-900">
                                                       Execution Success Rate: <span className="font-bold text-zinc-200">{runResults.filter(r => r.status_id === 3).length} / {runResults.length} passed</span>
                                                  </div>
                                                  {runResults.map((res, idx) => (
                                                       <div key={idx} className="border border-zinc-900 bg-zinc-950/40 p-3.5 rounded-xl space-y-2">
                                                            <div className={`font-mono text-xs font-bold ${res.status_id === 3 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                                 Test Case {idx + 1}: {res.status_id === 3 ? '✓ Passed' : '✕ Failed'}
                                                            </div>
                                                            {res.stdout && <pre className="text-xs bg-zinc-950 border border-zinc-900 p-2.5 rounded-md font-mono text-zinc-400 overflow-x-auto">{res.stdout}</pre>}
                                                            {res.stderr && <pre className="text-xs bg-rose-950/20 border border-rose-900/30 p-2.5 rounded-md font-mono text-rose-400 overflow-x-auto">{res.stderr}</pre>}
                                                       </div>
                                                  ))}
                                             </div>
                                        )}
                                        {!runResults && !submissionResult && <div className="text-center py-12 text-xs text-zinc-500 font-mono">Execute system execution arrays to query response objects.</div>}
                                   </div>
                              )}
                         </div>
                    </div>
               </div>

               {/* Right Pane - Professional Code Editor Grid */}
               <div className="w-1/2 flex flex-col h-full bg-zinc-950 relative">
                    {/* Monaco Header Interface Controllers */}
                    <div className="flex items-center justify-between p-3 border-b border-zinc-900 bg-[#09090b]">
                         <div className="flex items-center gap-4">
                              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="select select-xs bg-zinc-950 border-zinc-800 focus:outline-none rounded-lg text-xs text-zinc-300 font-semibold">
                                   {availableLanguages.map(lang => (
                                        <option key={lang} value={lang}>{formatLanguageName(lang)}</option>
                                   ))}
                              </select>
                         </div>
                         <div className="flex items-center gap-1.5">
                              <button onClick={handleClearEditor} className="btn btn-xs btn-ghost text-zinc-400 hover:bg-zinc-900 normal-case rounded-md font-bold text-xs">
                                   Clear
                              </button>
                              <button onClick={handleRunCode} disabled={isRunning} className="btn btn-xs bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-200 normal-case rounded-md font-bold text-xs disabled:opacity-40">
                                   {isRunning ? 'Running...' : 'Run Code'}
                              </button>
                              {!isGuest ? (
                                   <button onClick={handleSubmitCode} disabled={isSubmitting} className="btn btn-xs bg-orange-500 hover:bg-orange-600 border-none text-black normal-case rounded-md font-black text-xs disabled:opacity-40">
                                        {isSubmitting ? 'Submitting...' : 'Submit'}
                                   </button>
                              ) : (
                                   <button onClick={handleLoginClick} className="btn btn-xs bg-rose-600 hover:bg-rose-700 border-none text-white normal-case rounded-md font-bold text-xs">
                                        Login
                                   </button>
                              )}
                         </div>
                    </div>

                    {/* Monaco Core Viewport Frame Wrapper */}
                    <div className="flex-grow bg-zinc-950 pt-2 border-5 border-green-500 rounded-2xl ">
                         <Editor
                              height="100%"
                              language={language === 'c++' ? 'cpp' : language}
                              value={code}
                              onChange={setCode}
                              theme="vs-dark"
                              options={{
                                   minimap: { enabled: false },
                                   fontSize: 14, // Bumped slightly for better readability
                                   // Premium developer font stack
                                   fontFamily: "Geist Mono, SF Mono, Cascadia Code, Fira Code, Menlo, Consolas, monospace",
                                   fontLigatures: true, // Enables beautiful symbol connections (e.g., => looks like an actual arrow)

                                   // Modern Look & Layout Enhancements
                                   lineNumbers: "on",
                                   roundedSelection: true,
                                   scrollBeyondLastLine: false,
                                   readOnly: false,
                                   cursorBlinking: "smooth", // Makes cursor fading elegant
                                   cursorSmoothCaretAnimation: "on", // Cursor glides smoothly across characters
                                   smoothScrolling: true, // Fluid window scrolling inertia

                                   // Code Clarity Settings
                                   bracketPairColorization: { enabled: true }, // Color-matches open/close brackets automatically
                                   renderLineHighlight: "all", // Soft highlight background on the active coding line
                                   cursorSurroundingLines: 5, // Keeps a 5-line safe margin when scrolling up/down
                                   padding: { top: 16, bottom: 16 }
                              }}
                         />
                    </div>
               </div>

               {/* Premium Structured Submission Code Modal View */}
               {selectedSubmission && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                         <div className="bg-zinc-950 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden border border-zinc-900 flex flex-col shadow-2xl">
                              <div className="flex justify-between items-center p-4 border-b border-zinc-900 bg-[#09090b]">
                                   <div>
                                        <h3 className="text-sm font-bold text-zinc-200">Historical Code String</h3>
                                        <p className="text-[11px] text-zinc-500 mt-0.5 font-mono">ID Target context: {selectedSubmission._id}</p>
                                   </div>
                                   <button onClick={() => setSelectedSubmission(null)} className="text-zinc-500 hover:text-zinc-200 transition-colors font-sans text-sm p-1">✕</button>
                              </div>
                              <div className="p-5 overflow-auto bg-zinc-950/40 flex-1">
                                   <pre className="bg-zinc-900 p-4 rounded-xl text-xs font-mono border border-zinc-850 text-zinc-300 overflow-x-auto leading-relaxed">{selectedSubmission.code}</pre>
                              </div>
                              <div className="p-3 border-t border-zinc-900 bg-[#09090b] flex justify-end">
                                   <button onClick={() => setSelectedSubmission(null)} className="btn btn-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800 normal-case rounded-lg font-medium px-4 py-1.5 h-auto">
                                        Dismiss Window
                                   </button>
                              </div>
                         </div>
                    </div>
               )}
          </div>
     );
};

export default ProblemPage;