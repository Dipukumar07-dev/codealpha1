import React, { useState, useEffect } from "react";
import { Check, AlertCircle, HelpCircle, Lightbulb, ChevronRight, Trophy } from "lucide-react";
import { Challenge } from "../types";
import { challenges } from "../challengesData";
import { motion } from "motion/react";

export default function SelectorLab() {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    success: boolean;
    matchedCount: number;
    matchedTexts: string[];
    error?: string;
  } | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);

  const challenge = challenges[currentChallengeIndex];

  // Evaluate the selector whenever the input changes
  useEffect(() => {
    if (!userInput.trim()) {
      setEvaluationResult(null);
      return;
    }

    try {
      // Create a sandbox element to parse HTML
      const sandbox = document.createElement("div");
      sandbox.innerHTML = challenge.htmlSnippet;

      let matchedTexts: string[] = [];

      if (challenge.selectorType === "css") {
        const nodes = sandbox.querySelectorAll(userInput);
        nodes.forEach((node) => {
          matchedTexts.push(node.textContent?.trim() || "");
        });
      } else {
        // XPath Evaluation
        const xpathResult = document.evaluate(
          userInput,
          sandbox,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null
        );
        
        for (let i = 0; i < xpathResult.snapshotLength; i++) {
          const node = xpathResult.snapshotItem(i);
          if (node) {
            matchedTexts.push(node.textContent?.trim() || "");
          }
        }
      }

      // Check if matched output is exactly equal to expected output
      const expected = challenge.expectedOutput;
      const isCorrect =
        matchedTexts.length === expected.length &&
        matchedTexts.every((val, index) => val === expected[index]);

      setEvaluationResult({
        success: isCorrect,
        matchedCount: matchedTexts.length,
        matchedTexts,
      });

      if (isCorrect && !completedChallenges.includes(challenge.id)) {
        setCompletedChallenges([...completedChallenges, challenge.id]);
      }
    } catch (err: any) {
      setEvaluationResult({
        success: false,
        matchedCount: 0,
        matchedTexts: [],
        error: err.message || "Invalid Selector Syntax",
      });
    }
  }, [userInput, currentChallengeIndex]);

  // Reset inputs when switching challenge
  const handleSelectChallenge = (index: number) => {
    setCurrentChallengeIndex(index);
    setUserInput("");
    setShowHint(false);
    setEvaluationResult(null);
  };

  const handleNextChallenge = () => {
    if (currentChallengeIndex < challenges.length - 1) {
      handleSelectChallenge(currentChallengeIndex + 1);
    }
  };

  // Pre-fill selector if they want to see the answer
  const handleSolve = () => {
    setUserInput(challenge.correctSelector[0]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="selector-lab-container">
      {/* Sidebar: Challenge Selection */}
      <div className="lg:col-span-4 space-y-4" id="sidebar-challenges">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800 text-lg">Your Lessons</h2>
            <div className="flex items-center space-x-1.5 text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-medium">
              <Trophy className="w-3.5 h-3.5" />
              <span>
                {completedChallenges.length}/{challenges.length} Done
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {challenges.map((c, idx) => {
              const isCurrent = idx === currentChallengeIndex;
              const isDone = completedChallenges.includes(c.id);

              return (
                <button
                  key={c.id}
                  onClick={() => handleSelectChallenge(idx)}
                  className={`w-full text-left p-3.5 rounded-xl transition flex items-center justify-between border ${
                    isCurrent
                      ? "bg-slate-900 border-slate-950 text-white shadow-sm"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-100 text-slate-700"
                  }`}
                  id={`btn-challenge-${c.id}`}
                >
                  <div className="truncate pr-2">
                    <p className={`font-semibold text-sm ${isCurrent ? "text-white" : "text-slate-800"}`}>
                      {c.title.split(".")[1] || c.title}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-medium uppercase ${
                          c.difficulty === "Beginner"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : c.difficulty === "Intermediate"
                            ? "bg-amber-50 text-amber-600 border border-amber-100"
                            : "bg-rose-50 text-rose-600 border border-rose-100"
                        }`}
                      >
                        {c.difficulty}
                      </span>
                      <span className="text-[10px] opacity-70 uppercase font-mono">{c.selectorType}</span>
                    </div>
                  </div>
                  {isDone ? (
                    <span className="bg-emerald-100 text-emerald-800 p-1 rounded-full flex-shrink-0">
                      <Check className="w-4.5 h-4.5 stroke-[2.5]" />
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 opacity-40" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pro Tip Box */}
        <div className="bg-indigo-50/70 border border-indigo-100 p-5 rounded-2xl">
          <h3 className="font-bold text-indigo-900 text-sm flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-indigo-600" />
            Scraping Insight
          </h3>
          <p className="text-xs text-indigo-700 leading-relaxed">
            When scraping complex production sites, prefer CSS selectors that rely on structured hierarchy
            (e.g., <code>.product-card h3</code>) over overly volatile auto-generated browser selectors
            which change frequently.
          </p>
        </div>
      </div>

      {/* Main Workspace: Active Challenge details, HTML, and evaluator */}
      <div className="lg:col-span-8 space-y-6" id="workspace-challenge">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                Lesson Challenge
              </span>
              <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">
                Selector Mode: {challenge.selectorType.toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{challenge.title}</h1>
            <p className="text-sm text-slate-500 mt-1">{challenge.description}</p>
          </div>

          {/* Goal & Instructions */}
          <div className="bg-slate-50 border border-slate-100 p-4.5 rounded-xl">
            <h4 className="font-bold text-slate-800 text-sm mb-1">Your Objective:</h4>
            <p className="text-sm text-slate-700 leading-relaxed">{challenge.instructions}</p>
          </div>

          {/* Target / Expected Result */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-indigo-50/40 p-4 rounded-xl border border-indigo-100/50">
              <p className="font-semibold text-indigo-800 mb-1.5 uppercase tracking-wider text-[10px]">
                Target Output ({challenge.expectedOutput.length} items):
              </p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {challenge.expectedOutput.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-indigo-900">
                    <span className="text-indigo-400">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="font-semibold text-slate-500 mb-1.5 uppercase tracking-wider text-[10px]">
                Your Matches ({evaluationResult?.matchedCount || 0} items):
              </p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {evaluationResult && evaluationResult.matchedTexts.length > 0 ? (
                  evaluationResult.matchedTexts.map((item, idx) => {
                    const isCorrectMatch = challenge.expectedOutput.includes(item);
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-1.5 ${
                          isCorrectMatch ? "text-emerald-700" : "text-amber-600"
                        }`}
                      >
                        <span className={isCorrectMatch ? "text-emerald-400" : "text-amber-400"}>
                          {isCorrectMatch ? "✓" : "•"}
                        </span>
                        <span className="truncate">{item}</span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-slate-400 italic">No elements matched yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Selector Entry */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-800">
              Enter {challenge.selectorType.toUpperCase()} Selector:
            </label>
            <div className="relative">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={
                  challenge.selectorType === "css"
                    ? "e.g. .current-price, h3.book-title"
                    : "e.g. //div[@class='news-item']/h2/text()"
                }
                className="w-full pl-4 pr-12 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono text-sm bg-slate-50/50"
                id="challenge-selector-input"
              />
              <div className="absolute right-3.5 top-3 flex items-center gap-2">
                {evaluationResult?.success ? (
                  <div className="bg-emerald-500 text-white rounded-full p-1" id="success-checkmark">
                    <Check className="w-4.5 h-4.5 stroke-[2.5]" />
                  </div>
                ) : evaluationResult?.error ? (
                  <div className="group relative">
                    <AlertCircle className="w-5 h-5 text-rose-500 cursor-pointer" />
                    <span className="absolute bottom-full right-0 mb-2 w-48 bg-slate-900 text-white text-[10px] p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 font-sans leading-tight">
                      {evaluationResult.error}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Hint & Solved controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  {showHint ? "Hide Hint" : "Need Hint?"}
                </button>
                <button
                  type="button"
                  onClick={handleSolve}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium"
                >
                  Reveal Solution
                </button>
              </div>

              {evaluationResult?.success && (
                <button
                  type="button"
                  onClick={handleNextChallenge}
                  disabled={currentChallengeIndex === challenges.length - 1}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-lg font-bold shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Lesson
                </button>
              )}
            </div>

            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50/70 border border-amber-100 text-amber-900 p-4 rounded-xl text-xs leading-relaxed"
              >
                <strong>Hint:</strong> {challenge.hint}
              </motion.div>
            )}
          </div>

          {/* HTML Source Snippet (Interactive) */}
          <div className="space-y-2">
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              HTML Source Code (Highlighting Sandbox)
            </span>
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-inner bg-slate-900 text-slate-100 p-4 font-mono text-xs max-h-96 overflow-y-auto leading-relaxed">
              <pre className="whitespace-pre-wrap">{challenge.htmlSnippet}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
