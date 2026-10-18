import React, { useState } from "react";
import { 
  Shield, 
  EyeOff, 
  Zap, 
  Lock, 
  Sliders, 
  Cpu, 
  Terminal, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw,
  ExternalLink,
  Layers,
  Sparkles
} from "lucide-react";

export default function Index() {
  const [activeMode, setActiveMode] = useState<"blur" | "replace" | "close_tab">("blur");
  const [simulatedSample, setSimulatedSample] = useState<"safe" | "explicit">("explicit");
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                Censorra
              </span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v1.0.0
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <a 
              href="#demo" 
              className="text-slate-400 hover:text-white transition-colors"
            >
              Interactive Simulator
            </a>
            <a 
              href="#architecture" 
              className="text-slate-400 hover:text-white transition-colors"
            >
              Architecture
            </a>
            <a 
              href="#installation" 
              className="text-slate-400 hover:text-white transition-colors"
            >
              Install Guide
            </a>
            <a
              href="https://github.com/krishnasharma1493/Censorra"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all text-xs"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 px-6">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real-Time AI Visual Content Moderation</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none mb-6">
            Intelligent Vision Shielding. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              Zero Privacy Compromises.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Censorra is an ultra-fast, Manifest V3 Chrome browser extension powered by Hugging Face vision models. It automatically analyzes, downsamples, and moderates explicit imagery on web pages before it enters your line of sight.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-semibold">
            <a
              href="#demo"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <span>Try Live Sandbox</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#installation"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all"
            >
              Quick Setup Guide
            </a>
          </div>
        </div>
      </section>

      {/* Interactive Sandbox Section */}
      <section id="demo" className="py-16 px-6 border-t border-slate-900 bg-slate-900/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              Interactive Policy Sandbox
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Simulate how Censorra intercepts incoming image rasters, processes them client-side, and dynamically enforces moderation policies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Control Panel */}
            <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  <span>Enforcement Policy</span>
                </h3>

                <div className="space-y-2 mb-6">
                  {[
                    { id: "blur", title: "Gaussian Blur", desc: "Non-destructive blur mask with click-to-reveal toggle" },
                    { id: "replace", title: "Shield Replacement", desc: "Swaps explicit node with privacy placeholder asset" },
                    { id: "close_tab", title: "Automated Tab Closure", desc: "Immediately terminates offending browser tab" }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => {
                        setActiveMode(mode.id as any);
                        setIsRevealed(false);
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        activeMode === mode.id
                          ? "bg-indigo-600/20 border-indigo-500/60 text-white"
                          : "bg-slate-800/40 border-slate-800/80 text-slate-400 hover:bg-slate-800/80"
                      }`}
                    >
                      <div className="font-semibold text-xs">{mode.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{mode.desc}</div>
                    </button>
                  ))}
                </div>

                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Test Subject
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSimulatedSample("explicit");
                      setIsRevealed(false);
                    }}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${
                      simulatedSample === "explicit"
                        ? "bg-red-500/20 border-red-500/50 text-red-300"
                        : "bg-slate-800/40 border-slate-800 text-slate-400"
                    }`}
                  >
                    Flagged Visual
                  </button>
                  <button
                    onClick={() => {
                      setSimulatedSample("safe");
                      setIsRevealed(false);
                    }}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${
                      simulatedSample === "safe"
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                        : "bg-slate-800/40 border-slate-800 text-slate-400"
                    }`}
                  >
                    Safe Image
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500">
                Classification model: <span className="text-slate-400">Falconsai/nsfw_image_detection</span>
              </div>
            </div>

            {/* Sandbox Canvas */}
            <div className="md:col-span-2 bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
                <span className="font-semibold text-slate-400">DOM Render Target Preview</span>
                <span className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold ${
                  simulatedSample === "explicit"
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                }`}>
                  {simulatedSample === "explicit" ? "NSFW Confidence: 94.2%" : "Safe Score: 98.7%"}
                </span>
              </div>

              {/* Visual Frame */}
              <div className="my-6 relative rounded-xl overflow-hidden min-h-[260px] flex items-center justify-center bg-slate-950 border border-slate-800/80">
                {activeMode === "close_tab" && simulatedSample === "explicit" ? (
                  <div className="text-center p-8">
                    <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-3">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div className="font-bold text-red-300 text-base mb-1">Tab Terminated</div>
                    <p className="text-xs text-slate-400 max-w-sm">
                      Under the 'Close Tab' policy, chrome.tabs.remove() terminates the current page immediately upon explicit detection.
                    </p>
                  </div>
                ) : (
                  <div className="relative w-full h-[260px] flex items-center justify-center p-4">
                    {/* Simulated Sample Render */}
                    <div
                      onClick={() => setIsRevealed(!isRevealed)}
                      className={`relative cursor-pointer transition-all duration-300 rounded-lg overflow-hidden flex items-center justify-center w-full max-w-md h-full ${
                        simulatedSample === "explicit" && !isRevealed
                          ? activeMode === "blur"
                            ? "blur-2xl brightness-90 outline outline-2 outline-indigo-500/60"
                            : "bg-slate-900 border border-indigo-500/30"
                          : "filter-none"
                      }`}
                    >
                      {activeMode === "replace" && simulatedSample === "explicit" && !isRevealed ? (
                        <div className="flex flex-col items-center justify-center p-6 text-center">
                          <EyeOff className="w-10 h-10 text-indigo-400 mb-2" />
                          <div className="font-bold text-sm text-slate-200">Protected by Censorra</div>
                          <div className="text-[11px] text-slate-400 mt-1">Image replaced by safety filter (Click to reveal)</div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-slate-300 font-mono text-xs p-6 text-center">
                          {simulatedSample === "explicit" ? (
                            <div>
                              <div className="text-red-400 font-bold mb-1">[Flagged Subject Preview]</div>
                              <div className="text-slate-400 text-[11px]">Sensitive visual pattern classified by vision transformer</div>
                            </div>
                          ) : (
                            <div>
                              <div className="text-emerald-400 font-bold mb-1">[Clean Subject Preview]</div>
                              <div className="text-slate-400 text-[11px]">Safe editorial image passed directly without DOM interference</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {simulatedSample === "explicit" && (
                      <div className="absolute bottom-6 right-6">
                        <button
                          onClick={() => setIsRevealed(!isRevealed)}
                          className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1.5 hover:bg-slate-800 shadow-lg"
                        >
                          <RefreshCw className="w-3 h-3 text-indigo-400" />
                          <span>{isRevealed ? "Re-apply Filter" : "Click to Reveal"}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Telemetry Indicator */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                <span>Dispatch Action: <strong className="text-indigo-400">{activeMode}</strong></span>
                <span>Latency: <strong className="text-emerald-400">~18ms (cached) / ~140ms (API)</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture & Pipeline */}
      <section id="architecture" className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-3">
            High-Performance Privacy Pipeline
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Censorra is architected for zero latency degradation, strict privacy preservation, and seamless DOM mutation tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base mb-2">1. Mutation Observer & Canvas</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Monitors dynamic DOM image insertions. Prior to transmission, images are scaled down client-side via an HTML5 canvas to a max 480px bounded box, reducing payload sizes by ~90%.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base mb-2">2. LRU Hashing & Model Query</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fast 32-bit bitwise hashing deduplicates seen images against an in-memory LRU cache. Uncached items query the Hugging Face FalconsAI Vision Transformer with exponential backoff.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base mb-2">3. Policy Dispatcher</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enforces user-selected policies in real-time. Supports non-destructive CSS Gaussian blur with interactive toggles, image substitution, or automated tab removal.
            </p>
          </div>
        </div>
      </section>

      {/* Installation Guide */}
      <section id="installation" className="py-16 px-6 border-t border-slate-900 bg-slate-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              Browser Installation Guide
            </h2>
            <p className="text-slate-400 text-sm">
              Compatible with Google Chrome, Brave, Arc, Edge, and all Chromium-based browsers.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-7 h-7 rounded-full bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-200">Open Extension Management</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Navigate to <code className="bg-slate-800 px-2 py-0.5 rounded text-indigo-300">chrome://extensions/</code> in Chrome or <code className="bg-slate-800 px-2 py-0.5 rounded text-indigo-300">brave://extensions/</code> in Brave.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-7 h-7 rounded-full bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-200">Enable Developer Mode</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Locate and turn on the <strong>Developer mode</strong> toggle located in the upper right corner of the Extensions dashboard.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-7 h-7 rounded-full bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-200">Load Unpacked Extension</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Click the <strong>Load unpacked</strong> button and select the root directory containing <code className="bg-slate-800 px-2 py-0.5 rounded text-indigo-300">manifest.json</code>.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-7 h-7 rounded-full bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                4
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-200">Pin to Toolbar & Configure</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Pin the Censorra shield icon to your toolbar to toggle between Blur, Replace, or Tab Closure policies, or customize Hugging Face tokens in <code className="bg-slate-800 px-2 py-0.5 rounded text-indigo-300">background.js</code>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-900 bg-slate-950 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-semibold text-slate-400">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span>Censorra — AI Content Moderation & Web Safety</span>
          </div>
          <div>
            Built & Engineered by <strong className="text-slate-300">Krishna Sharma</strong> • Released under MIT License
          </div>
        </div>
      </footer>
    </div>
  );
}
