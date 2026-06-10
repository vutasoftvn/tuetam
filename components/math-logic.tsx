"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Cuboid,
  Layers3,
  MoveHorizontal,
  Shapes,
  Sigma,
  Square,
  Triangle,
  Volume2,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

type TopicId = "numbers" | "shapes" | "compare" | "patterns" | "position";

type LessonVisual =
  | { kind: "number"; count: number; fruit: FruitKind }
  | "circle"
  | "square"
  | "triangle"
  | "big-small"
  | "long-short"
  | "red-blue"
  | "position";

type ExerciseVisual =
  | "one-apple"
  | "two-apples"
  | "two-orange"
  | "three-apples"
  | "circle-red"
  | "square-blue"
  | "big-block"
  | "small-block"
  | "pattern-ok"
  | "pattern-wrong"
  | "middle";

type FruitKind =
  | "apple"
  | "orange"
  | "banana"
  | "strawberry"
  | "grape"
  | "mango"
  | "pear"
  | "peach"
  | "watermelon"
  | "dragon-fruit";

type Lesson = {
  title: string;
  label: string;
  speakText: string;
  visual: LessonVisual;
};

type ExerciseOption = {
  label: string;
  correct: boolean;
  visual: ExerciseVisual;
};

type Exercise = {
  id: string;
  title: string;
  prompt: string;
  speakText: string;
  options: ExerciseOption[];
};

type Topic = {
  id: TopicId;
  label: string;
  subtitle: string;
  color: string;
  bg: string;
  icon: typeof Sigma;
  lessons: Lesson[];
  exercise: Exercise;
};

const numberNames = ["một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín", "mười"];
const numberFruits: { name: string; kind: FruitKind }[] = [
  { name: "táo", kind: "apple" },
  { name: "cam", kind: "orange" },
  { name: "chuối", kind: "banana" },
  { name: "dâu", kind: "strawberry" },
  { name: "nho", kind: "grape" },
  { name: "xoài", kind: "mango" },
  { name: "lê", kind: "pear" },
  { name: "đào", kind: "peach" },
  { name: "dưa hấu", kind: "watermelon" },
  { name: "thanh long", kind: "dragon-fruit" },
];

const fruitIcons: Record<FruitKind, { label: string; glyph: string; bg: string }> = {
  apple: { label: "táo", glyph: "Táo", bg: "#fee2e2" },
  orange: { label: "cam", glyph: "Cam", bg: "#ffedd5" },
  banana: { label: "chuối", glyph: "Chuối", bg: "#fef9c3" },
  strawberry: { label: "dâu", glyph: "Dâu", bg: "#fce7f3" },
  grape: { label: "nho", glyph: "Nho", bg: "#ede9fe" },
  mango: { label: "xoài", glyph: "Xoài", bg: "#fef3c7" },
  pear: { label: "lê", glyph: "Lê", bg: "#dcfce7" },
  peach: { label: "đào", glyph: "Đào", bg: "#ffe4e6" },
  watermelon: { label: "dưa hấu", glyph: "Dưa", bg: "#dcfce7" },
  "dragon-fruit": { label: "thanh long", glyph: "Thanh", bg: "#fae8ff" },
};

const numberLessons: Lesson[] = numberNames.map((name, index) => {
  const count = index + 1;
  const fruit = numberFruits[index];
  return {
    title: `Số ${count}`,
    label: `${count} quả ${fruit.name}`,
    speakText: `Số ${name}. ${capitalize(name)} quả ${fruit.name}.`,
    visual: { kind: "number", count, fruit: fruit.kind },
  };
});

const topics: Topic[] = [
  {
    id: "numbers",
    label: "Đọc số",
    subtitle: "Nhìn số, nghe số, gắn với đồ vật thật.",
    color: "#e83e7b",
    bg: "#fff5f8",
    icon: Sigma,
    lessons: numberLessons,
    exercise: {
      id: "count-one",
      title: "Đếm quả táo",
      prompt: "Chọn nhóm có 1 quả táo.",
      speakText: "Con hãy chọn nhóm có một quả táo.",
      options: [
        { label: "1 quả táo", correct: true, visual: "one-apple" },
        { label: "2 quả cam", correct: false, visual: "two-orange" },
      ],
    },
  },
  {
    id: "shapes",
    label: "Hình dạng",
    subtitle: "Tròn, vuông, tam giác, chữ nhật.",
    color: "#17834e",
    bg: "#f0fff4",
    icon: Shapes,
    lessons: [
      {
        title: "Hình tròn",
        label: "Tròn đỏ",
        speakText: "Đây là hình tròn màu đỏ.",
        visual: "circle",
      },
      {
        title: "Hình vuông",
        label: "Vuông xanh",
        speakText: "Đây là hình vuông màu xanh.",
        visual: "square",
      },
      {
        title: "Hình tam giác",
        label: "Tam giác vàng",
        speakText: "Đây là hình tam giác màu vàng.",
        visual: "triangle",
      },
    ],
    exercise: {
      id: "pick-red-circle",
      title: "Tìm hình đúng",
      prompt: "Chọn hình tròn màu đỏ.",
      speakText: "Con hãy chọn hình tròn màu đỏ.",
      options: [
        { label: "Tròn đỏ", correct: true, visual: "circle-red" },
        { label: "Vuông xanh", correct: false, visual: "square-blue" },
      ],
    },
  },
  {
    id: "compare",
    label: "So sánh",
    subtitle: "To - nhỏ, dài - ngắn, cao - thấp.",
    color: "#0f6b8f",
    bg: "#eef9ff",
    icon: MoveHorizontal,
    lessons: [
      {
        title: "To - nhỏ",
        label: "Khối to và khối nhỏ",
        speakText: "Khối bên trái nhỏ hơn. Khối bên phải to hơn.",
        visual: "big-small",
      },
      {
        title: "Dài - ngắn",
        label: "Hàng dài và hàng ngắn",
        speakText: "Hàng có nhiều chấm hơn là hàng dài hơn.",
        visual: "long-short",
      },
    ],
    exercise: {
      id: "pick-big",
      title: "Chọn khối to",
      prompt: "Chọn khối to hơn.",
      speakText: "Con hãy chọn khối to hơn.",
      options: [
        { label: "Khối nhỏ", correct: false, visual: "small-block" },
        { label: "Khối to", correct: true, visual: "big-block" },
      ],
    },
  },
  {
    id: "patterns",
    label: "Quy luật",
    subtitle: "Xếp xen kẽ 1 đỏ - 1 xanh.",
    color: "#9f5f00",
    bg: "#fff8db",
    icon: Layers3,
    lessons: [
      {
        title: "Đỏ - xanh",
        label: "Đỏ, xanh, đỏ",
        speakText: "Một đỏ, một xanh, rồi lại một đỏ.",
        visual: "red-blue",
      },
    ],
    exercise: {
      id: "pick-pattern",
      title: "Chọn dãy đúng",
      prompt: "Chọn dãy 1 đỏ, 1 xanh, 1 đỏ.",
      speakText: "Con hãy chọn dãy một đỏ, một xanh, một đỏ.",
      options: [
        { label: "Đỏ xanh đỏ", correct: true, visual: "pattern-ok" },
        { label: "Đỏ đỏ xanh", correct: false, visual: "pattern-wrong" },
      ],
    },
  },
  {
    id: "position",
    label: "Vị trí",
    subtitle: "Trên, dưới, giữa, trước, sau.",
    color: "#7c3aed",
    bg: "#f5f0ff",
    icon: Cuboid,
    lessons: [
      {
        title: "Ở giữa",
        label: "Quả táo ở giữa",
        speakText: "Quả táo màu đỏ nằm ở giữa.",
        visual: "position",
      },
    ],
    exercise: {
      id: "pick-middle",
      title: "Chọn ở giữa",
      prompt: "Chọn đồ vật ở giữa.",
      speakText: "Con hãy chọn đồ vật ở giữa.",
      options: [
        { label: "Ở giữa", correct: true, visual: "middle" },
        { label: "Không ở giữa", correct: false, visual: "two-apples" },
      ],
    },
  },
];

export function MathLogic() {
  const [activeTopicId, setActiveTopicId] = useState<TopicId>("numbers");
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const activeTopic = useMemo(
    () => topics.find((topic) => topic.id === activeTopicId) ?? topics[0],
    [activeTopicId],
  );

  function speak(text: string) {
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = "vi-VN";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  function choose(exercise: Exercise, option: ExerciseOption) {
    setAnswers((current) => ({ ...current, [exercise.id]: option.correct }));
  }

  return (
    <main className="min-h-screen bg-[#fff7d6] p-4 text-[#222] sm:p-6">
      <section className="mx-auto flex max-w-6xl flex-col gap-5">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] bg-white px-5 py-4 shadow-sm">
          <Link
            href="/"
            aria-label="Về trang chủ"
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3f4f6] text-[#333] transition-transform active:scale-95"
          >
            <ArrowLeft aria-hidden="true" size={26} strokeWidth={3} />
          </Link>
          <div className="min-w-0 flex-1 text-center">
            <h1 className="text-4xl font-black text-[#e83e7b] sm:text-5xl">Làm Quen Với Toán</h1>
            <p className="mt-1 text-base font-bold text-[#5d5d5d] sm:text-lg">Học theo chủ đề, nghe và làm bài tập</p>
          </div>
        </header>

        <nav className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5" aria-label="Chủ đề toán">
          {topics.map((topic) => {
            const selected = topic.id === activeTopic.id;
            const Icon = topic.icon;
            return (
              <button
                key={topic.id}
                type="button"
                aria-label={topic.label}
                aria-pressed={selected}
                onClick={() => setActiveTopicId(topic.id)}
                className={`flex min-h-24 items-center gap-4 rounded-3xl border-4 bg-white p-4 text-left shadow-sm transition-transform active:scale-95 ${
                  selected ? "border-current" : "border-white"
                }`}
                style={{ color: topic.color }}
              >
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: topic.bg }}
                >
                  <Icon aria-hidden="true" size={30} strokeWidth={3} />
                </span>
                <span className="min-w-0">
                  <span className="block text-xl font-black leading-tight">{topic.label}</span>
                </span>
              </button>
            );
          })}
        </nav>

        <section className="rounded-[2rem] border-4 border-white bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-3xl font-black" style={{ color: activeTopic.color }}>
                Học cùng bé
              </h2>
              <p className="mt-1 text-lg font-bold text-[#5f6368]">{activeTopic.subtitle}</p>
            </div>
          </div>

          <div
            className={`grid gap-4 md:grid-cols-2 ${
              activeTopic.id === "numbers" ? "lg:grid-cols-5" : "lg:grid-cols-3"
            }`}
          >
            {activeTopic.lessons.map((lesson) => (
              <article
                key={lesson.title}
                className="flex min-h-64 flex-col rounded-3xl border-4 border-[#f5f1e7] bg-[#fffaf0] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-3xl font-black" style={{ color: activeTopic.color }}>
                      {lesson.title}
                    </h3>
                  </div>
                  <SoundButton label={`Nghe bài học: ${lesson.title}`} onClick={() => speak(lesson.speakText)} />
                </div>
                <div className="mt-5 flex flex-1 items-center justify-center rounded-3xl bg-white/70 p-5">
                  <LessonVisualView visual={lesson.visual} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <ExerciseCard topic={activeTopic} onSpeak={speak} onChoose={choose} answer={answers[activeTopic.exercise.id]} />
      </section>
    </main>
  );
}

function SoundButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#fff4b8] text-[#8a5a00] shadow-sm transition-transform active:scale-95"
    >
      <Volume2 aria-hidden="true" size={28} strokeWidth={3} />
    </button>
  );
}

function ExerciseCard({
  topic,
  onSpeak,
  onChoose,
  answer,
}: {
  topic: Topic;
  onSpeak: (text: string) => void;
  onChoose: (exercise: Exercise, option: ExerciseOption) => void;
  answer: boolean | undefined;
}) {
  const exercise = topic.exercise;

  return (
    <section className="rounded-[2rem] border-4 border-white bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-3xl font-black" style={{ color: topic.color }}>
            Bài tập
          </h2>
          <h3 className="mt-1 text-2xl font-black text-[#333]">{exercise.title}</h3>
          <p className="mt-2 text-xl font-black leading-snug text-[#333]">{exercise.prompt}</p>
        </div>
        <SoundButton label={`Nghe bài tập: ${exercise.title}`} onClick={() => onSpeak(exercise.speakText)} />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {exercise.options.map((option) => (
          <button
            key={option.label}
            type="button"
            aria-label={option.label}
            onClick={() => onChoose(exercise, option)}
            className="flex min-h-40 flex-col items-center justify-center rounded-3xl border-4 border-[#f5f1e7] bg-[#fffaf0] p-4 transition-transform active:scale-95"
          >
            <ExerciseVisualView visual={option.visual} />
          </button>
        ))}
      </div>

      {answer !== undefined ? (
        <div
          className={`mt-4 flex min-h-14 items-center justify-center gap-2 rounded-2xl text-xl font-black ${
            answer ? "bg-[#dcfce7] text-[#16824a]" : "bg-[#ffe2e8] text-[#be2856]"
          }`}
        >
          {answer ? (
            <CheckCircle2 aria-hidden="true" size={26} strokeWidth={3} />
          ) : (
            <XCircle aria-hidden="true" size={26} strokeWidth={3} />
          )}
          {answer ? "Đúng rồi!" : "Thử lại nhé!"}
        </div>
      ) : null}
    </section>
  );
}

function LessonVisualView({ visual }: { visual: LessonVisual }) {
  if (typeof visual === "object") {
    return <NumberScene number={`${visual.count}`} count={visual.count} fruit={visual.fruit} />;
  }
  if (visual === "circle") return <Circle size={92} className="text-[#ef4444]" fill="currentColor" strokeWidth={3} />;
  if (visual === "square") return <Square size={92} className="text-[#3b82f6]" fill="currentColor" strokeWidth={3} />;
  if (visual === "triangle") return <Triangle size={96} className="text-[#f59e0b]" fill="currentColor" strokeWidth={3} />;
  if (visual === "big-small") {
    return (
      <span className="flex items-end gap-8" aria-hidden="true">
        <span className="h-14 w-14 rounded-2xl bg-[#60a5fa]" />
        <span className="h-24 w-24 rounded-3xl bg-[#60a5fa]" />
      </span>
    );
  }
  if (visual === "long-short") {
    return (
      <span className="grid gap-4" aria-hidden="true">
        <DotRow colors={["#f97316", "#f97316", "#f97316"]} />
        <DotRow colors={["#f97316", "#f97316", "#f97316", "#f97316", "#f97316"]} />
      </span>
    );
  }
  if (visual === "red-blue") return <DotRow colors={["#ef4444", "#3b82f6", "#ef4444"]} />;
  return (
    <span className="flex items-center gap-4">
      <Fruit fruit="apple" />
      <Fruit fruit="apple" />
      <Fruit fruit="apple" />
    </span>
  );
}

function ExerciseVisualView({ visual }: { visual: ExerciseVisual }) {
  if (visual === "one-apple") return <AppleRow count={1} />;
  if (visual === "two-apples") return <AppleRow count={2} />;
  if (visual === "two-orange") return <FruitRow count={2} fruit="orange" />;
  if (visual === "three-apples") return <AppleRow count={3} />;
  if (visual === "circle-red") return <Circle size={72} className="text-[#ef4444]" fill="currentColor" strokeWidth={3} />;
  if (visual === "square-blue") return <Square size={72} className="text-[#3b82f6]" fill="currentColor" strokeWidth={3} />;
  if (visual === "small-block") return <span className="h-16 w-16 rounded-2xl bg-[#60a5fa]" aria-hidden="true" />;
  if (visual === "big-block") return <span className="h-24 w-24 rounded-3xl bg-[#60a5fa]" aria-hidden="true" />;
  if (visual === "pattern-ok") return <DotRow colors={["#ef4444", "#3b82f6", "#ef4444"]} />;
  if (visual === "pattern-wrong") return <DotRow colors={["#ef4444", "#ef4444", "#3b82f6"]} />;
  return (
    <span className="flex items-center gap-4">
      <Fruit fruit="apple" />
      <Fruit fruit="apple" />
      <Fruit fruit="apple" />
    </span>
  );
}

function NumberScene({ number, count, fruit }: { number: string; count: number; fruit: FruitKind }) {
  return (
    <span className="grid w-full items-center justify-items-center gap-4">
      <span className="text-7xl font-black leading-none text-[#e83e7b]" aria-hidden="true">
        {number}
      </span>
      <FruitRow count={count} fruit={fruit} />
    </span>
  );
}

function FruitRow({ count, fruit }: { count: number; fruit: FruitKind }) {
  return (
    <span className="flex max-w-full flex-wrap items-center justify-center gap-2">
      {Array.from({ length: count }, (_, index) => (
        <Fruit key={index} fruit={fruit} />
      ))}
    </span>
  );
}

function AppleRow({ count }: { count: number }) {
  return <FruitRow count={count} fruit="apple" />;
}

function Fruit({ fruit }: { fruit: FruitKind }) {
  const icon = fruitIcons[fruit];
  return (
    <span
      role="img"
      aria-label={icon.label}
      className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-white text-center text-[0.68rem] font-black leading-none text-[#222] shadow-sm"
      style={{ backgroundColor: icon.bg }}
    >
      {icon.glyph}
    </span>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function DotRow({ colors }: { colors: string[] }) {
  return (
    <span className="flex items-center justify-center gap-3" aria-hidden="true">
      {colors.map((color, index) => (
        <span key={`${color}-${index}`} className="h-12 w-12 rounded-full" style={{ backgroundColor: color }} />
      ))}
    </span>
  );
}
