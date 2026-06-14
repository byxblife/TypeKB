import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const SCENES = [
  {
    id: "relax",
    name: "放鬆",
    english: "Ease",
    track: "Soft Morning",
    base: "#f4ede3",
    glowA: "#e8c9b8",
    glowB: "#d7ddd0",
    notes: [220, 277.18, 329.63],
  },
  {
    id: "focus",
    name: "專注",
    english: "Focus",
    track: "Clear Current",
    base: "#e9eff0",
    glowA: "#b8d1d7",
    glowB: "#cbd4df",
    notes: [196, 246.94, 293.66],
  },
  {
    id: "sleep",
    name: "睡前平靜",
    english: "Night",
    track: "Moonlit Air",
    base: "#eceaf1",
    glowA: "#c9c4dc",
    glowB: "#c8d5df",
    notes: [174.61, 220, 261.63],
  },
  {
    id: "recover",
    name: "低潮恢復",
    english: "Restore",
    track: "Tender Ground",
    base: "#edf0e8",
    glowA: "#c6d2bc",
    glowB: "#e2d2aa",
    notes: [207.65, 261.63, 311.13],
  },
  {
    id: "work",
    name: "工作沉澱",
    english: "Settle",
    track: "Quiet Desk",
    base: "#ecebe7",
    glowA: "#c5cdd2",
    glowB: "#d3c5b7",
    notes: [185, 233.08, 277.18],
  },
];

const THEMES = [
  { id: "stillness", name: "Stillness", description: "A quiet moment to return to yourself." },
  { id: "breathe", name: "Breathe", description: "Let one unhurried breath make a little more room." },
  { id: "one-thing", name: "One Thing", description: "Stay gently with what is here, one key at a time." },
  { id: "restore", name: "Restore", description: "Rest is not a detour; it is part of the way forward." },
  { id: "enough", name: "Enough", description: "You do not need to prove your worth in this moment." },
  { id: "begin-again", name: "Begin Again", description: "A small beginning is still a beginning." },
];

const SENTENCES = [
  {
    id: "o01",
    theme: "stillness",
    text: "Let this quiet moment hold you without asking you to become anything else.",
  },
  {
    id: "o02",
    theme: "stillness",
    text: "There is no need to hurry through a moment that was made for breathing.",
  },
  {
    id: "o03",
    theme: "breathe",
    text: "Take a slower breath and notice how the room makes space around you.",
  },
  {
    id: "o04",
    theme: "breathe",
    text: "The next breath does not need to solve everything; it only needs to arrive.",
  },
  {
    id: "o05",
    theme: "one-thing",
    text: "Give your attention to one gentle task and let the rest wait outside.",
  },
  {
    id: "o06",
    theme: "one-thing",
    text: "One letter, one word, one sentence; this is enough for the present moment.",
  },
  {
    id: "o07",
    theme: "restore",
    text: "You are allowed to pause before you know exactly what comes next.",
  },
  {
    id: "o08",
    theme: "restore",
    text: "A softer pace can still carry you toward the life you are shaping.",
  },
  {
    id: "o09",
    theme: "enough",
    text: "Your value remains steady, even on days when your energy feels small.",
  },
  {
    id: "o10",
    theme: "enough",
    text: "You have already done enough to deserve a quiet and forgiving evening.",
  },
  {
    id: "o11",
    theme: "begin-again",
    text: "Begin again without punishment; the path is patient and still waiting.",
  },
  {
    id: "o12",
    theme: "begin-again",
    text: "Small steps count, especially when they are taken with care and honesty.",
  },
  {
    id: "o13",
    theme: "stillness",
    text: "Listen for the space between your thoughts and rest there for a while.",
  },
  {
    id: "o14",
    theme: "restore",
    text: "Nothing is asking you to bloom in every season of your life.",
  },
  {
    id: "q01",
    theme: "stillness",
    text: "Nothing can bring you peace but yourself. Nothing can bring you peace but the triumph of principles.",
    author: "Ralph Waldo Emerson",
    source: "Essays: First Series, Self-Reliance",
    sourceUrl: "https://www.gutenberg.org/files/16643/16643-h/16643-h.htm",
  },
  {
    id: "q02",
    theme: "one-thing",
    text: "Our life is frittered away by detail. An honest man has hardly need to count more than his ten fingers.",
    author: "Henry David Thoreau",
    source: "Walden, Where I Lived, and What I Lived For",
    sourceUrl: "https://www.gutenberg.org/files/205/205-h/205-h.htm",
  },
  {
    id: "q03",
    theme: "begin-again",
    text: "I went to the woods because I wished to live deliberately, to front only the essential facts of life.",
    author: "Henry David Thoreau",
    source: "Walden, Where I Lived, and What I Lived For",
    sourceUrl: "https://www.gutenberg.org/files/205/205-h/205-h.htm",
  },
  {
    id: "q04",
    theme: "restore",
    text: "We suffer more often in imagination than in reality.",
    author: "Seneca",
    source: "Moral Letters to Lucilius, Letter 13",
    sourceUrl: "https://en.wikisource.org/wiki/Moral_letters_to_Lucilius/Letter_13",
  },
  {
    id: "q05",
    theme: "enough",
    text: "The best kind of revenge is, not to become like unto them.",
    author: "Marcus Aurelius",
    source: "Meditations, Book VI",
    sourceUrl: "https://www.gutenberg.org/files/2680/2680-h/2680-h.htm",
  },
  {
    id: "q06",
    theme: "breathe",
    text: "Such as thy thoughts and ordinary cogitations are, such will thy mind be in time.",
    author: "Marcus Aurelius",
    source: "Meditations, Book V",
    sourceUrl: "https://www.gutenberg.org/files/2680/2680-h/2680-h.htm",
  },
];

const KEY_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Shift", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
  ["Space"],
];

const COMPLETION_MESSAGES = [
  "這一刻，你已經好好陪伴了自己。",
  "慢慢來，也是一種前進。",
  "謝謝你為自己留下一點安靜。",
  "很好，讓下一句自然地來。",
];

function readSavedState() {
  try {
    return JSON.parse(localStorage.getItem("typekb-prototype") || "{}");
  } catch {
    return {};
  }
}

function isTypeableCharacter(character) {
  return /[a-z]/i.test(character) || character === " ";
}

function nextTypeableIndex(text, start) {
  let index = start;
  while (index < text.length && !isTypeableCharacter(text[index])) index += 1;
  return index;
}

function countTypeableCharacters(text) {
  return [...text].filter(isTypeableCharacter).length;
}

function AmbientAudio({ scene, playing, volume }) {
  const engineRef = useRef(null);

  useEffect(() => {
    if (!playing) {
      if (engineRef.current) {
        engineRef.current.context.close();
        engineRef.current = null;
      }
      return undefined;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return undefined;

    const context = new AudioContext();
    const master = context.createGain();
    const filter = context.createBiquadFilter();
    master.gain.value = volume * 0.055;
    filter.type = "lowpass";
    filter.frequency.value = 760;
    filter.Q.value = 0.4;
    filter.connect(master);
    master.connect(context.destination);

    const oscillators = scene.notes.map((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = index === 0 ? "sine" : "triangle";
      oscillator.frequency.value = frequency / (index === 2 ? 2 : 1);
      oscillator.detune.value = index * 3 - 3;
      gain.gain.value = index === 0 ? 0.42 : 0.18;
      oscillator.connect(gain);
      gain.connect(filter);
      oscillator.start();
      return oscillator;
    });

    const pulse = context.createOscillator();
    const pulseGain = context.createGain();
    pulse.frequency.value = 0.08;
    pulseGain.gain.value = 110;
    pulse.connect(pulseGain);
    pulseGain.connect(filter.frequency);
    pulse.start();

    engineRef.current = { context, master, oscillators, pulse };
    return () => {
      oscillators.forEach((oscillator) => oscillator.stop());
      pulse.stop();
      context.close();
      engineRef.current = null;
    };
  }, [playing, scene]);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.master.gain.setTargetAtTime(
        volume * 0.055,
        engineRef.current.context.currentTime,
        0.25,
      );
    }
  }, [volume]);

  return null;
}

function HeaderControl({ label, value, open, onClick, children }) {
  return (
    <div className="control-wrap">
      <button className={`control-button ${open ? "is-open" : ""}`} onClick={onClick} type="button">
        <span>{label}</span>
        <strong>{value}</strong>
      </button>
      {open && <div className="popover">{children}</div>}
    </div>
  );
}

export function App() {
  const saved = useMemo(readSavedState, []);
  const [sceneId, setSceneId] = useState(saved.sceneId || "relax");
  const [themeId, setThemeId] = useState(saved.themeId || "stillness");
  const [pendingThemeId, setPendingThemeId] = useState(null);
  const [sentenceIndex, setSentenceIndex] = useState(saved.sentenceIndex || 0);
  const [cursor, setCursor] = useState(0);
  const [statuses, setStatuses] = useState([]);
  const [errors, setErrors] = useState(0);
  const [backspaces, setBackspaces] = useState(0);
  const [startedAt, setStartedAt] = useState(null);
  const [pausedAt, setPausedAt] = useState(null);
  const [pausedMs, setPausedMs] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [introVisible, setIntroVisible] = useState(!saved.seenIntro);
  const [openControl, setOpenControl] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(saved.musicPlaying ?? false);
  const [volume, setVolume] = useState(saved.volume ?? 0.28);
  const [reducedMotion, setReducedMotion] = useState(
    saved.reducedMotion ?? window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [stats, setStats] = useState(
    saved.stats || { totalWpm: 0, totalAccuracy: 0, completed: 0, companionDays: 0 },
  );

  const scene = SCENES.find((item) => item.id === sceneId) || SCENES[0];
  const theme = THEMES.find((item) => item.id === themeId) || THEMES[0];
  const availableSentences = useMemo(() => {
    const matched = SENTENCES.filter((item) => item.theme === themeId);
    return matched.length ? matched : SENTENCES;
  }, [themeId]);
  const sentence = availableSentences[sentenceIndex % availableSentences.length];
  const nextIndex = nextTypeableIndex(sentence.text, cursor);
  const nextCharacter = sentence.text[nextIndex] || "";
  const nextKeyLabel = nextCharacter === " " ? "Space" : nextCharacter;
  const currentProgress =
    statuses.filter(Boolean).length / countTypeableCharacters(sentence.text);
  const averageWpm = stats.completed ? Math.round(stats.totalWpm / stats.completed) : 0;
  const averageAccuracy = stats.completed
    ? Math.round(stats.totalAccuracy / stats.completed)
    : 0;

  const persist = useCallback(
    (overrides = {}) => {
      localStorage.setItem(
        "typekb-prototype",
        JSON.stringify({
          sceneId,
          themeId,
          sentenceIndex,
          musicPlaying,
          volume,
          reducedMotion,
          stats,
          seenIntro: !introVisible,
          ...overrides,
        }),
      );
    },
    [
      introVisible,
      musicPlaying,
      reducedMotion,
      sceneId,
      sentenceIndex,
      stats,
      themeId,
      volume,
    ],
  );

  useEffect(() => {
    persist();
  }, [persist]);

  const resetRound = useCallback(() => {
    setCursor(0);
    setStatuses([]);
    setErrors(0);
    setBackspaces(0);
    setStartedAt(null);
    setPausedAt(null);
    setPausedMs(0);
    setIsComplete(false);
  }, []);

  const begin = useCallback(() => {
    setIntroVisible(false);
    setIsStarted(true);
    setIsPaused(false);
    setOpenControl(null);
    if (!saved.seenIntro && !musicPlaying) setMusicPlaying(true);
    persist({ seenIntro: true });
  }, [musicPlaying, persist, saved.seenIntro]);

  const togglePause = useCallback(() => {
    if (!isStarted) {
      begin();
      return;
    }
    if (isPaused) {
      setPausedMs((value) => value + (pausedAt ? performance.now() - pausedAt : 0));
      setPausedAt(null);
      setIsPaused(false);
    } else {
      setPausedAt(performance.now());
      setIsPaused(true);
      setOpenControl(null);
    }
  }, [begin, isPaused, isStarted, pausedAt]);

  const openWithPause = (name) => {
    setOpenControl((current) => (current === name ? null : name));
    if (isStarted && !isPaused) {
      setPausedAt(performance.now());
      setIsPaused(true);
    }
  };

  const completeRound = useCallback(
    (finalErrors) => {
      const finishedAt = performance.now();
      const elapsedMinutes = Math.max(
        (finishedAt - (startedAt || finishedAt) - pausedMs) / 60000,
        0.03,
      );
      const typeableCharacters = countTypeableCharacters(sentence.text);
      const wpm = Math.round(typeableCharacters / 5 / elapsedMinutes);
      const accuracy = Math.round(
        (typeableCharacters / (typeableCharacters + finalErrors)) * 100,
      );
      const nextStats = {
        totalWpm: stats.totalWpm + wpm,
        totalAccuracy: stats.totalAccuracy + accuracy,
        completed: stats.completed + 1,
        companionDays: Math.max(stats.companionDays, 1),
      };
      setStats(nextStats);
      setIsComplete(true);
      persist({ stats: nextStats });

      window.setTimeout(() => {
        if (pendingThemeId) {
          setThemeId(pendingThemeId);
          setPendingThemeId(null);
          setSentenceIndex(0);
        } else {
          setSentenceIndex((value) => value + 1);
        }
        resetRound();
      }, reducedMotion ? 350 : 1600);
    },
    [
      pausedMs,
      pendingThemeId,
      persist,
      reducedMotion,
      resetRound,
      sentence.text,
      startedAt,
      stats,
    ],
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        togglePause();
        return;
      }

      const target = event.target;
      const isControlFocused =
        target instanceof Element &&
        Boolean(target.closest("button, a, input, select, textarea, [tabindex]"));
      if (
        event.key === "Tab" &&
        !event.shiftKey &&
        !isControlFocused &&
        isStarted &&
        !isPaused &&
        !settingsOpen &&
        !sourceOpen
      ) {
        event.preventDefault();
        setMusicPlaying((value) => !value);
        return;
      }

      if (!isStarted || isPaused || isComplete || settingsOpen || sourceOpen) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key === "Backspace") {
        event.preventDefault();
        if (backspaces >= 3) return;
        let previous = cursor - 1;
        while (previous >= 0 && !isTypeableCharacter(sentence.text[previous])) previous -= 1;
        if (previous >= 0) {
          setCursor(previous);
          setStatuses((current) => {
            const next = [...current];
            next[previous] = undefined;
            return next;
          });
          setBackspaces((value) => value + 1);
        }
        return;
      }

      const isLetterKey = /^[a-zA-Z]$/.test(event.key);
      const isSpaceKey = event.key === " ";
      if (!isLetterKey && !isSpaceKey) return;
      event.preventDefault();
      if (!startedAt) setStartedAt(performance.now());
      const targetIndex = nextTypeableIndex(sentence.text, cursor);
      const expectedCharacter = sentence.text[targetIndex];
      if (!expectedCharacter) return;
      const correct = event.key === expectedCharacter;
      const nextErrors = errors + (correct ? 0 : 1);
      const nextStatuses = [...statuses];
      nextStatuses[targetIndex] = correct ? "correct" : "wrong";
      setStatuses(nextStatuses);
      setErrors(nextErrors);
      setBackspaces(0);
      const following = nextTypeableIndex(sentence.text, targetIndex + 1);
      setCursor(following);
      if (following >= sentence.text.length) completeRound(nextErrors);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    backspaces,
    completeRound,
    cursor,
    errors,
    isComplete,
    isPaused,
    isStarted,
    sentence.text,
    settingsOpen,
    sourceOpen,
    startedAt,
    statuses,
    togglePause,
  ]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && isStarted && !isPaused) {
        setPausedAt(performance.now());
        setIsPaused(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [isPaused, isStarted]);

  const chooseScene = (id) => {
    setSceneId(id);
    setOpenControl(null);
  };

  const chooseTheme = (id) => {
    if (statuses.some(Boolean)) {
      setPendingThemeId(id);
    } else {
      setThemeId(id);
      setSentenceIndex(0);
      resetRound();
    }
    setOpenControl(null);
  };

  const openSettings = () => {
    if (isStarted && !isPaused) {
      setPausedAt(performance.now());
      setIsPaused(true);
    }
    setSettingsOpen(true);
    setOpenControl(null);
  };

  const clearStats = () => {
    const nextStats = { totalWpm: 0, totalAccuracy: 0, completed: 0, companionDays: 0 };
    setStats(nextStats);
    persist({ stats: nextStats });
  };

  const themeStyle = {
    "--scene-base": scene.base,
    "--scene-glow-a": scene.glowA,
    "--scene-glow-b": scene.glowB,
  };

  return (
    <div
      className={`app-shell scene-${scene.id} ${reducedMotion ? "reduced-motion" : ""} ${
        isComplete ? "is-complete" : ""
      }`}
      style={themeStyle}
      onMouseDown={(event) => {
        if (!isStarted && event.target.closest("button") === null) begin();
      }}
    >
      <AmbientAudio scene={scene} playing={musicPlaying} volume={volume} />
      <div className="atmosphere atmosphere-one" />
      <div className="atmosphere atmosphere-two" />
      <div className="grain" />

      <header className={isStarted && !isPaused ? "dimmed" : ""}>
        <button className="brand" type="button" onClick={() => setIntroVisible(true)}>
          <span className="brand-mark">T</span>
          <span>
            <strong>TypeKB</strong>
            <small>Type a little softer</small>
          </span>
        </button>

        <nav aria-label="體驗控制">
          <HeaderControl
            label="情境"
            value={scene.name}
            open={openControl === "scene"}
            onClick={() => openWithPause("scene")}
          >
            {SCENES.map((item) => (
              <button
                className={item.id === sceneId ? "selected" : ""}
                key={item.id}
                onClick={() => chooseScene(item.id)}
                type="button"
              >
                <span>{item.name}</span>
                <small>{item.english}</small>
              </button>
            ))}
          </HeaderControl>

          <HeaderControl
            label="今日主題"
            value={theme.name}
            open={openControl === "theme"}
            onClick={() => openWithPause("theme")}
          >
            {THEMES.map((item) => (
              <button
                className={item.id === themeId ? "selected" : ""}
                key={item.id}
                onClick={() => chooseTheme(item.id)}
                type="button"
              >
                <span>{item.name}</span>
                <small>{item.description}</small>
              </button>
            ))}
          </HeaderControl>

          <button
            className={`simple-control ${musicPlaying ? "active" : ""}`}
            onClick={() => setMusicPlaying((value) => !value)}
            title="打字時可按 Tab 切換音樂"
            type="button"
          >
            <span>音樂</span>
            <strong>{musicPlaying ? "播放中 · Tab" : "已關閉 · Tab"}</strong>
          </button>
          <button className="simple-control" onClick={togglePause} type="button">
            <span>{isPaused ? "狀態" : "練習"}</span>
            <strong>{isPaused ? "繼續" : "暫停"}</strong>
          </button>
          <button className="settings-button" onClick={openSettings} type="button">
            設定
          </button>
        </nav>
      </header>

      <main className={isPaused ? "paused" : ""}>
        <section className="theme-block" aria-live="polite">
          <p>Today&apos;s theme</p>
          <h1>{theme.name}</h1>
          <span>{theme.description}</span>
          {pendingThemeId && (
            <div className="pending-theme">
              下一句將套用 {THEMES.find((item) => item.id === pendingThemeId)?.name}
            </div>
          )}
        </section>

        <section className="sentence-stage" aria-label="打字練習內容">
          <p className="sentence-text">
            {sentence.text.split("").map((character, index) => {
              const isLetter = /[a-z]/i.test(character);
              const isCurrent = index === nextIndex && !isComplete && !isPaused;
              return (
                <span
                  className={[
                    isLetter ? "letter" : "punctuation",
                    statuses[index] || "",
                    isCurrent ? "current" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  key={`${sentence.id}-${index}`}
                >
                  {character}
                </span>
              );
            })}
          </p>

          <div className="sentence-meta">
            {sentence.author ? (
              <>
                <span>— {sentence.author}</span>
                <button onClick={() => setSourceOpen(true)} type="button">
                  查看來源
                </button>
              </>
            ) : (
              <span>TypeKB original</span>
            )}
          </div>

          <div className="progress-track" aria-label={`句子進度 ${Math.round(currentProgress * 100)}%`}>
            <span style={{ width: `${currentProgress * 100}%` }} />
          </div>

          <div className="status-message" aria-live="polite">
            {isComplete
              ? COMPLETION_MESSAGES[stats.completed % COMPLETION_MESSAGES.length]
              : isPaused
                ? "慢慢來，準備好再繼續。"
                : isStarted
              ? nextCharacter
                    ? `下一個按鍵 ${nextKeyLabel}`
                    : "讓下一句慢慢抵達"
                  : "點一下畫面，慢慢開始"}
          </div>
        </section>

        <section className="keyboard-zone" aria-label="QWERTY 鍵盤提示">
          <div className="mobile-key-hint">
            <span>下一個字母</span>
            <strong>{isPaused ? "—" : nextKeyLabel || "—"}</strong>
            <small>手機版為簡化提示</small>
          </div>
          <div className="keyboard">
            {KEY_ROWS.map((row, rowIndex) => (
              <div className={`key-row row-${rowIndex + 1}`} key={row.join("-")}>
                {row.map((keyName) => {
                  const isTarget =
                    !isPaused &&
                    ((keyName === "Space" && nextCharacter === " ") ||
                      (keyName.length === 1 &&
                        keyName === nextCharacter.toUpperCase()));
                  const isShift =
                    !isPaused && keyName === "Shift" && /[A-Z]/.test(nextCharacter);
                  return (
                    <div
                      className={`key ${isTarget || isShift ? "target" : ""} ${
                        keyName === "Space" ? "space" : ""
                      } ${keyName.length > 1 ? "wide" : ""}`}
                      key={keyName}
                    >
                      {keyName}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <div>
          <span>今日平均</span>
          <strong>{averageWpm || "—"}</strong>
          <small>WPM</small>
        </div>
        <div>
          <span>今日正確率</span>
          <strong>{stats.completed ? `${averageAccuracy}%` : "—"}</strong>
          <small>按鍵準確度</small>
        </div>
        <div>
          <span>今日完成</span>
          <strong>{stats.completed || "—"}</strong>
          <small>句</small>
        </div>
        <div>
          <span>累積陪伴</span>
          <strong>{stats.companionDays || "—"}</strong>
          <small>天</small>
        </div>
        <div className="track-info">
          <span>暫用音景</span>
          <strong>{scene.track}</strong>
          <small>{scene.name}情境 · 即時合成</small>
        </div>
      </footer>

      {introVisible && (
        <div className="intro-layer" role="dialog" aria-modal="true" aria-label="開始 TypeKB">
          <div>
            <p>Welcome to a quieter moment.</p>
            <h2>留一點時間，讓自己慢下來。</h2>
            <span>點一下開始，跟著亮起的字母，慢慢輸入眼前的句子。</span>
            <button onClick={begin} type="button">
              開始這一刻
            </button>
            <small>建議使用實體英文 QWERTY 鍵盤</small>
          </div>
        </div>
      )}

      {isPaused && isStarted && !settingsOpen && openControl === null && (
        <div className="pause-layer">
          <div>
            <p>Practice paused</p>
            <h2>慢慢來，準備好再繼續。</h2>
            <button onClick={togglePause} type="button">
              繼續練習
            </button>
            <small>音樂與光影會繼續陪伴你 · Esc 也可以繼續</small>
          </div>
        </div>
      )}

      {settingsOpen && (
        <div className="modal-backdrop" onMouseDown={() => setSettingsOpen(false)}>
          <aside
            className="settings-panel"
            onMouseDown={(event) => event.stopPropagation()}
            aria-label="設定"
          >
            <div className="panel-heading">
              <div>
                <p>Preferences</p>
                <h2>設定</h2>
              </div>
              <button onClick={() => setSettingsOpen(false)} type="button">
                關閉
              </button>
            </div>

            <label className="setting-row">
              <span>
                <strong>音樂音量</strong>
                <small>目前為 {Math.round(volume * 100)}%</small>
              </span>
              <input
                max="0.8"
                min="0"
                onChange={(event) => setVolume(Number(event.target.value))}
                step="0.01"
                type="range"
                value={volume}
              />
            </label>

            <label className="setting-row toggle-row">
              <span>
                <strong>減少動態效果</strong>
                <small>停止背景漂移與完成擴散</small>
              </span>
              <input
                checked={reducedMotion}
                onChange={(event) => setReducedMotion(event.target.checked)}
                type="checkbox"
              />
            </label>

            <div className="settings-note">
              <strong>Prototype 說明</strong>
              <p>
                目前音樂為瀏覽器即時合成的暫用 ambient 音景，不代表正式選曲。打字紀錄只保存在此瀏覽器。
              </p>
            </div>

            <div className="settings-note">
              <strong>鍵盤支援</strong>
              <p>
                第一版以英文 QWERTY 配置為主。大小寫嚴格判定，單字間空白需按 Space，標點由系統自動略過；打字時可按 Tab 切換音樂。
              </p>
            </div>

            <button className="secondary-action" onClick={() => setIntroVisible(true)} type="button">
              重新播放操作提示
            </button>
            <button className="secondary-action quiet-danger" onClick={clearStats} type="button">
              清除 Prototype 練習紀錄
            </button>
          </aside>
        </div>
      )}

      {sourceOpen && (
        <div className="modal-backdrop centered" onMouseDown={() => setSourceOpen(false)}>
          <div className="source-card" onMouseDown={(event) => event.stopPropagation()}>
            <p>Verified quotation</p>
            <h2>{sentence.author}</h2>
            <blockquote>{sentence.text}</blockquote>
            <dl>
              <div>
                <dt>作品／文獻</dt>
                <dd>{sentence.source}</dd>
              </div>
              <div>
                <dt>查證狀態</dt>
                <dd>已對照公開原典英文版本</dd>
              </div>
            </dl>
            <div className="source-actions">
              <a href={sentence.sourceUrl} rel="noreferrer" target="_blank">
                開啟原典
              </a>
              <button onClick={() => setSourceOpen(false)} type="button">
                返回
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
