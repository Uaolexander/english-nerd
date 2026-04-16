"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "Look! She ___ in the park.",               options: ["runs","is running","run","running"],         answer: 1 },
  { q: "I ___ to the gym every Monday.",           options: ["am going","go","goes","going"],              answer: 1 },
  { q: "They ___ TV right now.",                   options: ["watch","watches","are watching","is watching"],answer: 2 },
  { q: "Water ___ at 0°C.",                        options: ["is freezing","freeze","freezes","froze"],     answer: 2 },
  { q: "He ___ his homework at the moment.",       options: ["does","do","is doing","does"],                answer: 2 },
  { q: "She ___ French — it's her hobby.",         options: ["is studying","studies","study","studys"],     answer: 1 },
  { q: "I ___ she's right. (state verb)",          options: ["am thinking","think","thinks","am think"],   answer: 1 },
  { q: "He ___ coffee. (general preference)",      options: ["is loving","love","loves","is love"],        answer: 2 },
  { q: "We usually ___ dinner at 7 PM.",           options: ["are having","is having","have","has"],       answer: 2 },
  { q: "She ___ her grandmother this weekend.",    options: ["visits","is visiting","visit","visit"],      answer: 1 },
  { q: "This soup ___ delicious! (state verb)",    options: ["is tasting","taste","tastes","are tasting"], answer: 2 },
  { q: "He ___ in London temporarily.",            options: ["lives","live","is living","living"],         answer: 2 },
  { q: "The Earth ___ around the Sun.",            options: ["is going","go","goes","going"],              answer: 2 },
  { q: "Be quiet! The baby ___.",                  options: ["sleeps","sleep","is sleeping","are sleeping"],answer: 2 },
  { q: "I ___ what you mean. (state verb)",        options: ["am understanding","understand","understands","understanding"], answer: 1 },
  { q: "She ___ to work by bus every day.",        options: ["is going","goes","go","going"],              answer: 1 },
  { q: "They ___ a new project this month.",       options: ["work on","works on","are working on","is working on"], answer: 2 },
  { q: "He ___ tennis every Saturday.",            options: ["is playing","play","plays","playing"],       answer: 2 },
  { q: "I ___ tired right now.",                   options: ["feel","am feeling","is feeling","feels"],    answer: 1 },
  { q: "She always ___ early.",                    options: ["is arriving","arrive","arrives","arriving"], answer: 2 },
];

/* ─── Types ─────────────────────────────────────────────────────────────── */

type MCQ = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type ExSet = {
  no: 1 | 2 | 3 | 4;
  title: string;
  instructions: string;
  questions: MCQ[];
};

/* ─── Question data ─────────────────────────────────────────────────────── */

const SETS: Record<1 | 2 | 3 | 4, ExSet> = {
  1: {
    no: 1,
    title: "Exercise 1 — Choose the correct form (clear context clues)",
    instructions:
      "Each sentence contains a time expression or context clue. Use Present Simple for habits, routines, facts, and permanent states. Use Present Continuous for actions happening right now or temporary situations.",
    questions: [
      {
        id: "1-1",
        prompt: "Look! She ___ in the park.",
        options: ["runs", "is running", "run", "running"],
        correctIndex: 1,
        explanation: "\"Look!\" signals an action happening right now → Present Continuous: is running.",
      },
      {
        id: "1-2",
        prompt: "I ___ to the gym every Monday.",
        options: ["am going", "go", "goes", "going"],
        correctIndex: 1,
        explanation: "\"Every Monday\" is a routine → Present Simple: go.",
      },
      {
        id: "1-3",
        prompt: "They ___ TV right now.",
        options: ["watch", "watches", "are watching", "is watching"],
        correctIndex: 2,
        explanation: "\"Right now\" signals an action in progress → Present Continuous: are watching.",
      },
      {
        id: "1-4",
        prompt: "Water ___ at 0°C.",
        options: ["is freezing", "freeze", "freezes", "froze"],
        correctIndex: 2,
        explanation: "Scientific fact / general truth → Present Simple: freezes.",
      },
      {
        id: "1-5",
        prompt: "He ___ on the phone at the moment.",
        options: ["talks", "talk", "is talking", "talking"],
        correctIndex: 2,
        explanation: "\"At the moment\" indicates an ongoing action → Present Continuous: is talking.",
      },
      {
        id: "1-6",
        prompt: "She usually ___ tea for breakfast.",
        options: ["is drinking", "are drinking", "drink", "drinks"],
        correctIndex: 3,
        explanation: "\"Usually\" marks a habit → Present Simple: drinks (she → +s).",
      },
      {
        id: "1-7",
        prompt: "Listen! Someone ___ on the door.",
        options: ["knocks", "knock", "is knocking", "knocked"],
        correctIndex: 2,
        explanation: "\"Listen!\" signals an action happening right now → Present Continuous: is knocking.",
      },
      {
        id: "1-8",
        prompt: "My father ___ as an engineer.",
        options: ["is working", "are working", "work", "works"],
        correctIndex: 3,
        explanation: "Permanent job/state → Present Simple: works (he → +s).",
      },
      {
        id: "1-9",
        prompt: "We ___ for the exam this week.",
        options: ["study", "studies", "is studying", "are studying"],
        correctIndex: 3,
        explanation: "\"This week\" indicates a temporary ongoing situation → Present Continuous: are studying.",
      },
      {
        id: "1-10",
        prompt: "The sun ___ in the west.",
        options: ["is setting", "set", "are setting", "sets"],
        correctIndex: 3,
        explanation: "General truth / fact of nature → Present Simple: sets.",
      },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Stative vs active meaning",
    instructions:
      "Some verbs (have, think, taste, see, look…) can be EITHER stative OR active depending on the meaning. Stative meaning → Present Simple. Active / physical meaning → Present Continuous. Read the context carefully!",
    questions: [
      {
        id: "2-1",
        prompt: "She ___ a beautiful house in the countryside.",
        options: ["is having", "have", "has", "are having"],
        correctIndex: 2,
        explanation: "\"Have\" = possession (stative) → Present Simple: has. Compare: She's having a party. (= activity)",
      },
      {
        id: "2-2",
        prompt: "They ___ dinner right now. Please don't disturb them.",
        options: ["have", "has", "is having", "are having"],
        correctIndex: 3,
        explanation: "\"Have dinner\" = activity (non-stative) → Present Continuous: are having. Compare: She has a car. (= possession)",
      },
      {
        id: "2-3",
        prompt: "I ___ this is a great idea!",
        options: ["am thinking", "thinks", "think", "is thinking"],
        correctIndex: 2,
        explanation: "\"Think\" = opinion (stative) → Present Simple: think. Compare: I'm thinking about it. (= mental process in progress)",
      },
      {
        id: "2-4",
        prompt: "She ___ about changing her job at the moment.",
        options: ["thinks", "think", "are thinking", "is thinking"],
        correctIndex: 3,
        explanation: "\"Think about\" = active mental process in progress → Present Continuous: is thinking. Compare: I think you're right. (= opinion)",
      },
      {
        id: "2-5",
        prompt: "This coffee ___ really bitter.",
        options: ["is tasting", "taste", "tastes", "are tasting"],
        correctIndex: 2,
        explanation: "\"Taste\" = flavour / sensation (stative) → Present Simple: tastes. Compare: The chef is tasting the soup. (= deliberate action)",
      },
      {
        id: "2-6",
        prompt: "The chef ___ the sauce to see if it needs more salt.",
        options: ["tastes", "taste", "is tasting", "are tasting"],
        correctIndex: 2,
        explanation: "\"Taste\" = deliberate physical action → Present Continuous: is tasting. Compare: This tastes great. (= sensation)",
      },
      {
        id: "2-7",
        prompt: "I ___ what you mean. That makes sense.",
        options: ["am seeing", "sees", "see", "is seeing"],
        correctIndex: 2,
        explanation: "\"See\" = understand (stative) → Present Simple: see. Compare: She's seeing a doctor. (= visiting / meeting)",
      },
      {
        id: "2-8",
        prompt: "He ___ a shower right now — he'll call you back in a minute.",
        options: ["has", "have", "are having", "is having"],
        correctIndex: 3,
        explanation: "\"Have a shower\" = activity (non-stative) → Present Continuous: is having. Compare: He has a car. (= possession)",
      },
      {
        id: "2-9",
        prompt: "You ___ tired. Did you sleep well last night?",
        options: ["are looking", "look", "looks", "is looking"],
        correctIndex: 1,
        explanation: "\"Look\" = appearance (stative) → Present Simple: look. Compare: She's looking out of the window. (= deliberate action)",
      },
      {
        id: "2-10",
        prompt: "He ___ a great time at the party — look at him dance!",
        options: ["has", "have", "are having", "is having"],
        correctIndex: 3,
        explanation: "\"Have a great time\" = activity / experience → Present Continuous: is having. Compare: He has two sisters. (= possession/fact)",
      },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Permanent vs temporary",
    instructions:
      "Some sentences describe both a permanent situation (Simple) and a temporary one (Continuous). Choose the correct form for each blank, paying attention to whether the situation is a permanent fact or a temporary arrangement.",
    questions: [
      {
        id: "3-1",
        prompt: "He usually ___ in Rome, but this year he ___ in London.",
        options: ["lives / is living", "is living / lives", "lives / lives", "is living / is living"],
        correctIndex: 0,
        explanation: "Permanent home → Simple (lives); temporary arrangement this year → Continuous (is living).",
      },
      {
        id: "3-2",
        prompt: "I ___ as a teacher but this week I ___ a training course.",
        options: ["am working / attend", "work / am attending", "work / attend", "am working / am attending"],
        correctIndex: 1,
        explanation: "Permanent job → Simple (work); temporary situation this week → Continuous (am attending).",
      },
      {
        id: "3-3",
        prompt: "She normally ___ to work but today she ___ the bus.",
        options: ["drives / is taking", "is driving / takes", "drives / takes", "is driving / is taking"],
        correctIndex: 0,
        explanation: "Normal routine → Simple (drives); today's exception → Continuous (is taking).",
      },
      {
        id: "3-4",
        prompt: "He ___ French, but this month he ___ Spanish too.",
        options: ["teaches / is teaching", "is teaching / teaches", "teaches / teaches", "is teaching / is teaching"],
        correctIndex: 0,
        explanation: "Permanent job → Simple (teaches); extra temporary duty → Continuous (is teaching).",
      },
      {
        id: "3-5",
        prompt: "They ___ in a big house, but right now they ___ in a small flat while it's being repaired.",
        options: ["live / are staying", "are living / stay", "live / stay", "are living / are staying"],
        correctIndex: 0,
        explanation: "Permanent residence → Simple (live); temporary arrangement → Continuous (are staying).",
      },
      {
        id: "3-6",
        prompt: "My sister ___ at the city hospital, but this week she ___ at a clinic downtown.",
        options: ["works / is working", "is working / works", "works / works", "is working / is working"],
        correctIndex: 0,
        explanation: "Permanent place of work → Simple (works); temporary this week → Continuous (is working).",
      },
      {
        id: "3-7",
        prompt: "He always ___ the newspaper in the morning, but today he ___ a magazine.",
        options: ["reads / is reading", "is reading / reads", "reads / reads", "is reading / is reading"],
        correctIndex: 0,
        explanation: "Habit with \"always\" → Simple (reads); today's exception → Continuous (is reading).",
      },
      {
        id: "3-8",
        prompt: "We ___ at home on Sundays, but this Sunday we ___ to a restaurant.",
        options: ["eat / are going", "are eating / go", "eat / go", "are eating / are going"],
        correctIndex: 0,
        explanation: "Regular Sunday habit → Simple (eat); a specific future arrangement → Continuous (are going).",
      },
      {
        id: "3-9",
        prompt: "She ___ maths at a secondary school, but this term she ___ a new curriculum.",
        options: ["teaches / is testing", "is teaching / tests", "teaches / tests", "is teaching / is testing"],
        correctIndex: 0,
        explanation: "Permanent job → Simple (teaches); temporary this term → Continuous (is testing).",
      },
      {
        id: "3-10",
        prompt: "He ___ his own business, but currently he ___ for a startup as a consultant.",
        options: ["runs / is working", "is running / works", "runs / works", "is running / is working"],
        correctIndex: 0,
        explanation: "Permanent fact → Simple (runs); temporary consulting role → Continuous (is working).",
      },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed advanced",
    instructions:
      "A mixed set testing all contrasts: stative verbs, now vs always, temporary vs permanent, and tricky meaning changes depending on the tense. Choose the best answer for each sentence.",
    questions: [
      {
        id: "4-1",
        prompt: "I ___ coffee. (habit)",
        options: ["am drinking", "drink", "drinks", "is drinking"],
        correctIndex: 1,
        explanation: "Habitual action → Present Simple: drink.",
      },
      {
        id: "4-2",
        prompt: "I ___ coffee right now.",
        options: ["drink", "drinks", "am drinking", "is drinking"],
        correctIndex: 2,
        explanation: "\"Right now\" = action in progress → Present Continuous: am drinking.",
      },
      {
        id: "4-3",
        prompt: "I ___ you're right. (opinion)",
        options: ["am thinking", "thinks", "is thinking", "think"],
        correctIndex: 3,
        explanation: "\"Think\" used as a stative (= have an opinion) → Present Simple: think.",
      },
      {
        id: "4-4",
        prompt: "I ___ about the problem right now. (active mental process)",
        options: ["think", "thinks", "am thinking", "is thinking"],
        correctIndex: 2,
        explanation: "\"Think about\" as an active process happening now is acceptable in Continuous: am thinking.",
      },
      {
        id: "4-5",
        prompt: "Prices ___ these days.",
        options: ["rise", "rises", "is rising", "are rising"],
        correctIndex: 3,
        explanation: "Changing/developing situation → Present Continuous: are rising.",
      },
      {
        id: "4-6",
        prompt: "___ you understand the instructions?",
        options: ["Are", "Is", "Do", "Does"],
        correctIndex: 2,
        explanation: "\"Understand\" is stative → question uses Present Simple: Do you understand?",
      },
      {
        id: "4-7",
        prompt: "We ___ them on Saturday. (arrangement)",
        options: ["meet", "meets", "is meeting", "are meeting"],
        correctIndex: 3,
        explanation: "Future arrangement → Present Continuous: are meeting.",
      },
      {
        id: "4-8",
        prompt: "The Earth ___ around the sun.",
        options: ["is orbiting", "orbit", "are orbiting", "orbits"],
        correctIndex: 3,
        explanation: "Scientific fact / general truth → Present Simple: orbits.",
      },
      {
        id: "4-9",
        prompt: "She ___ in Paris. (permanent)",
        options: ["is living", "are living", "live", "lives"],
        correctIndex: 3,
        explanation: "Permanent state → Present Simple: lives (she → +s).",
      },
      {
        id: "4-10",
        prompt: "He ___ in Paris for a few months. (temporary)",
        options: ["lives", "live", "is living", "are living"],
        correctIndex: 2,
        explanation: "\"For a few months\" = temporary situation → Present Continuous: is living.",
      },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Context Clues",
  2: "Stative Verbs",
  3: "Perm vs Temp",
  4: "Mixed",
};

/* ─── Helper components ─────────────────────────────────────────────────── */

function Formula({ parts }: { parts: Array<{ text: string; color?: string; dim?: boolean }> }) {
  const colors: Record<string, string> = {
    sky: "bg-sky-100 text-sky-800 border-sky-200",
    yellow: "bg-[#FFF3A3] text-amber-800 border-amber-300",
    red: "bg-red-100 text-red-800 border-red-200",
    violet: "bg-violet-100 text-violet-800 border-violet-200",
    slate: "bg-slate-100 text-slate-600 border-slate-200",
    green: "bg-emerald-100 text-emerald-800 border-emerald-200",
  };
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {parts.map((p, i) =>
        p.dim ? (
          <span key={i} className="text-slate-400 font-bold text-sm">
            +
          </span>
        ) : (
          <span
            key={i}
            className={`rounded-lg px-2.5 py-1 text-xs font-black border ${
              p.color ? colors[p.color] : colors.slate
            }`}
          >
            {p.text}
          </span>
        )
      )}
    </div>
  );
}

function Ex({ en }: { en: string }) {
  return (
    <div className="rounded-xl bg-white border border-black/8 px-3 py-2.5">
      <div className="font-semibold text-slate-900 text-sm">{en}</div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function SimpleVsContinuousClient() {
  const isPro = useIsPro();
  const [pdfLoading, setPdfLoading] = useState(false);
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});

  const current = SETS[exNo];

  const { save } = useProgress();

  useEffect(() => {
    if (checked && score) {
      save(exNo, score.percent, score.total);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  const score = useMemo(() => {
    if (!checked) return null;
    let correct = 0;
    for (const q of current.questions) {
      if (answers[q.id] === q.correctIndex) correct++;
    }
    const total = current.questions.length;
    return { correct, total, percent: Math.round((correct / total) * 100) };
  }, [checked, current, answers]);

  function reset() {
    setChecked(false);
    setAnswers({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function switchSet(n: 1 | 2 | 3 | 4) {
    setExNo(n);
    setChecked(false);
    setAnswers({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCheck() {
    setChecked(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function downloadPDF() {
    setPdfLoading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const W = 210, H = 297, ml = 15, mr = 15;
      const Y = "#F5DA20", BK = "#111111", GR = "#999999", LG = "#F2F2F2", MG = "#CCCCCC";

      function pageHeader(pageNum: number, sub: string) {
        pdf.setFillColor(Y); pdf.rect(0, 0, W, 2.5, "F");
        pdf.setFillColor("#FAFAFA"); pdf.rect(0, 2.5, W, 13, "F");
        pdf.setDrawColor("#EBEBEB"); pdf.setLineWidth(0.25); pdf.line(0, 15.5, W, 15.5);
        pdf.setFont("helvetica","bold"); pdf.setFontSize(11); pdf.setTextColor(BK);
        pdf.text("English Nerd", ml, 10.5);
        pdf.setFillColor(MG); pdf.circle(ml+27, 9.5, 0.7, "F");
        pdf.setFont("helvetica","normal"); pdf.setFontSize(8.5); pdf.setTextColor(GR);
        pdf.text(sub, ml+30, 10.5);
        pdf.setFont("helvetica","bold"); pdf.setFontSize(7.5); pdf.setTextColor(GR);
        pdf.text(`${pageNum} / 3`, W-mr, 10.5, { align: "right" });
      }
      function numCircle(x: number, y: number, n: number) {
        pdf.setFillColor(BK); pdf.circle(x+3.5, y+3.5, 3.5, "F");
        pdf.setFont("helvetica","bold"); pdf.setFontSize(8); pdf.setTextColor("#FFFFFF");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdf.text(String(n), x+3.5, y+3.5, { align:"center", baseline:"middle" } as any);
      }
      function pill(x: number, y: number, text: string, bg: string, fg: string) {
        const w=20, h=5.5;
        pdf.setFillColor(bg); pdf.roundedRect(x,y,w,h,1.2,1.2,"F");
        pdf.setFont("helvetica","bold"); pdf.setFontSize(7); pdf.setTextColor(fg);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdf.text(text, x+w/2, y+h/2, { align:"center", baseline:"middle" } as any);
      }

      pageHeader(1, "Present Simple vs Continuous Worksheet");
      pdf.setFillColor(BK); pdf.roundedRect(W-mr-22, 5, 22, 6, 1.5, 1.5, "F");
      pdf.setFont("helvetica","bold"); pdf.setFontSize(7.5); pdf.setTextColor(Y);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pdf.text("A2  LEVEL", W-mr-11, 8, { align:"center", baseline:"middle" } as any);
      let y = 19;
      pdf.setFillColor(Y); pdf.rect(ml, y, 2, 22, "F");
      pdf.setFont("helvetica","bold"); pdf.setFontSize(22); pdf.setTextColor(BK);
      pdf.text("Simple vs Continuous", ml+5, y+11);
      pdf.setFont("helvetica","normal"); pdf.setFontSize(10); pdf.setTextColor(GR);
      pdf.text("Present Simple \u00B7 Present Continuous \u00B7 4 exercises + answer key", ml+5, y+18);
      y += 27;

      const qH = 9;
      numCircle(ml, y, 1);
      pdf.setFont("helvetica","bold"); pdf.setFontSize(11); pdf.setTextColor(BK);
      pdf.text("Exercise 1", ml+10, y+5);
      const e1w = pdf.getTextWidth("Exercise 1");
      pill(ml+10+e1w+3, y+0.5, "EASY", "#D1FAE5", "#065F46");
      pdf.setFont("helvetica","normal"); pdf.setFontSize(8.5); pdf.setTextColor(GR);
      pdf.text("Clear context clues — choose the correct form.", ml+10+e1w+26, y+4.5);
      y += 11;
      const ex1 = [
        "1. Look! She ___ in the park.   a) runs   b) is running   c) run   d) running",
        "2. I ___ to the gym every Monday.   a) am going   b) go   c) goes   d) going",
        "3. They ___ TV right now.   a) watch   b) watches   c) are watching   d) is watching",
        "4. Water ___ at 0°C.   a) is freezing   b) freeze   c) freezes   d) froze",
        "5. He ___ his homework at the moment.   a) does   b) do   c) is doing   d) did",
        "6. She ___ French — it's her hobby.   a) is studying   b) studies   c) study   d) studys",
        "7. We usually ___ dinner at 7 PM.   a) are having   b) is having   c) have   d) has",
        "8. The Earth ___ around the Sun.   a) is going   b) go   c) goes   d) going",
        "9. Be quiet! The baby ___.   a) sleeps   b) sleep   c) is sleeping   d) are sleeping",
        "10. She always ___ early.   a) is arriving   b) arrive   c) arrives   d) arriving",
      ];
      ex1.forEach((line, i) => {
        pdf.setFont("helvetica","normal"); pdf.setFontSize(9); pdf.setTextColor("#222222");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdf.text(line, ml+2, y + i*qH, { baseline:"top" } as any);
        pdf.setDrawColor(LG); pdf.setLineWidth(0.2);
        pdf.line(ml, y+(i+1)*qH-1, W-mr, y+(i+1)*qH-1);
      });
      y += ex1.length * qH + 5;

      numCircle(ml, y, 2);
      pdf.setFont("helvetica","bold"); pdf.setFontSize(11); pdf.setTextColor(BK);
      pdf.text("Exercise 2", ml+10, y+5);
      const e2w = pdf.getTextWidth("Exercise 2");
      pill(ml+10+e2w+3, y+0.5, "MEDIUM", "#FEF3C7", "#92400E");
      pdf.setFont("helvetica","normal"); pdf.setFontSize(8.5); pdf.setTextColor(GR);
      pdf.text("Stative verbs — choose the correct form.", ml+10+e2w+26, y+4.5);
      y += 11;
      const ex2 = [
        "1. I ___ she's right. (think = state)   a) am thinking   b) think   c) thinks   d) am think",
        "2. He ___ coffee. (love = state)   a) is loving   b) love   c) loves   d) is love",
        "3. I ___ what you mean. (understand = state)   a) am understanding   b) understand   c) understands",
        "4. This soup ___ delicious! (taste = state)   a) is tasting   b) taste   c) tastes   d) are tasting",
        "5. She ___ a new car. (want = state)   a) is wanting   b) want   c) wants   d) are wanting",
        "6. We ___ this idea. (like = state)   a) are liking   b) like   c) likes   d) is liking",
        "7. He ___ French. (know = state)   a) is knowing   b) know   c) knows   d) are knowing",
        "8. I ___ tired. (feel = state)   a) feel   b) am feeling   c) is feeling   d) feels",
        "9. It ___ expensive. (seem = state)   a) is seeming   b) seem   c) seems   d) are seeming",
        "10. She ___ the answer. (know = state)   a) is knowing   b) know   c) knows   d) knowing",
      ];
      ex2.forEach((line, i) => {
        pdf.setFont("helvetica","normal"); pdf.setFontSize(9); pdf.setTextColor("#222222");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdf.text(line, ml+2, y + i*qH, { baseline:"top" } as any);
        pdf.setDrawColor(LG); pdf.setLineWidth(0.2);
        pdf.line(ml, y+(i+1)*qH-1, W-mr, y+(i+1)*qH-1);
      });

      pdf.setFont("helvetica","normal"); pdf.setFontSize(7.5); pdf.setTextColor(MG);
      pdf.text("englishnerd.cc", ml, H-7);
      pdf.text("1 / 3", W-mr, H-7, { align:"right" });

      // PAGE 2
      pdf.addPage();
      pageHeader(2, "Present Simple vs Continuous Worksheet");
      y = 20;
      numCircle(ml, y, 3);
      pdf.setFont("helvetica","bold"); pdf.setFontSize(11); pdf.setTextColor(BK);
      pdf.text("Exercise 3", ml+10, y+5);
      const e3w = pdf.getTextWidth("Exercise 3");
      pill(ml+10+e3w+3, y+0.5, "MEDIUM", "#FEF3C7", "#92400E");
      pdf.setFont("helvetica","normal"); pdf.setFontSize(8.5); pdf.setTextColor(GR);
      pdf.text("Permanent vs temporary — choose the correct form.", ml+10+e3w+26, y+4.5);
      y += 11;
      const ex3 = [
        "1. He ___ in London temporarily.   a) lives   b) live   c) is living   d) living",
        "2. She ___ her grandmother this weekend.   a) visits   b) visit   c) is visiting   d) visiting",
        "3. They ___ a new project this month.   a) work on   b) works on   c) are working on   d) is working on",
        "4. He ___ tennis every Saturday.   a) is playing   b) play   c) plays   d) playing",
        "5. She ___ to work by bus every day.   a) is going   b) goes   c) go   d) going",
        "6. I ___ with my parents while my flat is being renovated.   a) live   b) am living   c) is living",
        "7. He usually ___ at 6 AM.   a) is getting up   b) get up   c) gets up   d) getting up",
        "8. They ___ a new language at the moment.   a) learn   b) learns   c) are learning   d) is learning",
        "9. This company ___ products worldwide every year.   a) exports   b) is exporting   c) export",
        "10. She ___ her report right now, so she can't talk.   a) writes   b) write   c) is writing",
      ];
      ex3.forEach((line, i) => {
        pdf.setFont("helvetica","normal"); pdf.setFontSize(9); pdf.setTextColor("#222222");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdf.text(line, ml+2, y + i*qH, { baseline:"top" } as any);
        pdf.setDrawColor(LG); pdf.setLineWidth(0.2);
        pdf.line(ml, y+(i+1)*qH-1, W-mr, y+(i+1)*qH-1);
      });
      y += ex3.length * qH + 6;

      numCircle(ml, y, 4);
      pdf.setFont("helvetica","bold"); pdf.setFontSize(11); pdf.setTextColor(BK);
      pdf.text("Exercise 4", ml+10, y+5);
      const e4w = pdf.getTextWidth("Exercise 4");
      pill(ml+10+e4w+3, y+0.5, "HARD", "#FEE2E2", "#991B1B");
      pdf.setFont("helvetica","normal"); pdf.setFontSize(8.5); pdf.setTextColor(GR);
      pdf.text("Advanced mixed — all rules.", ml+10+e4w+26, y+4.5);
      y += 11;
      const ex4 = [
        "1. Hurry up! The taxi ___ outside.   a) waits   b) wait   c) is waiting   d) has waited",
        "2. She ___ five languages fluently. (habit/skill)   a) speaks   b) is speaking   c) speak",
        "3. I can't talk now — I ___ a meeting. (in progress)   a) have   b) am having   c) having",
        "4. He ___ to work every day. (routine)   a) is driving   b) drives   c) drive   d) driving",
        "5. They ___ dinner at the moment. (in progress)   a) are cooking   b) cook   c) cooks",
        "6. Water ___ at 100°C. (scientific fact)   a) is boiling   b) boil   c) boils   d) boiled",
        "7. She ___ a new book. (in progress)   a) writes   b) write   c) is writing   d) written",
        "8. He ___ you. (state — recognise)   a) is recognising   b) recognises   c) recognise",
        "9. I ___ the library every Saturday. (routine)   a) am visiting   b) visits   c) visit",
        "10. She ___ my sister — they met yesterday. (state)   a) is knowing   b) knows   c) know",
      ];
      ex4.forEach((line, i) => {
        pdf.setFont("helvetica","normal"); pdf.setFontSize(9); pdf.setTextColor("#222222");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdf.text(line, ml+2, y + i*qH, { baseline:"top" } as any);
        pdf.setDrawColor(LG); pdf.setLineWidth(0.2);
        pdf.line(ml, y+(i+1)*qH-1, W-mr, y+(i+1)*qH-1);
      });

      pdf.setFont("helvetica","normal"); pdf.setFontSize(7.5); pdf.setTextColor(MG);
      pdf.text("englishnerd.cc", ml, H-7);
      pdf.text("2 / 3", W-mr, H-7, { align:"right" });

      // PAGE 3 — Answer Key
      pdf.addPage();
      pageHeader(3, "Present Simple vs Continuous — Answer Key");
      y = 20;
      pdf.setFillColor(Y); pdf.rect(ml, y, 2, 20, "F");
      pdf.setFont("helvetica","bold"); pdf.setFontSize(24); pdf.setTextColor(BK);
      pdf.text("Answer Key", ml+5, y+10);
      pdf.setFont("helvetica","normal"); pdf.setFontSize(10); pdf.setTextColor(GR);
      pdf.text("Check your answers below", ml+5, y+17);
      y += 26;

      const answerSections = [
        { lbl:"Exercise 1", sub:"Clear context clues", ans:["b) is running","b) go","c) are watching","c) freezes","c) is doing","b) studies","c) have","c) goes","c) is sleeping","c) arrives"] },
        { lbl:"Exercise 2", sub:"Stative verbs", ans:["b) think","c) loves","b) understand","c) tastes","c) wants","b) like","c) knows","a) feel","c) seems","c) knows"] },
        { lbl:"Exercise 3", sub:"Permanent vs temporary", ans:["c) is living","c) is visiting","c) are working on","c) plays","b) goes","b) am living","c) gets up","c) are learning","a) exports","c) is writing"] },
        { lbl:"Exercise 4", sub:"Advanced mixed", ans:["c) is waiting","a) speaks","b) am having","b) drives","a) are cooking","c) boils","c) is writing","b) recognises","c) visit","b) knows"] },
      ];
      answerSections.forEach(({ lbl, sub, ans }, si) => {
        numCircle(ml, y, si+1);
        pdf.setFont("helvetica","bold"); pdf.setFontSize(12); pdf.setTextColor(BK);
        pdf.text(lbl, ml+10, y+5);
        const lblW = pdf.getTextWidth(lbl);
        pdf.setFont("helvetica","normal"); pdf.setFontSize(9); pdf.setTextColor(GR);
        pdf.text(sub, ml+10+lblW+4, y+4.5);
        pdf.setDrawColor(LG); pdf.setLineWidth(0.3); pdf.line(ml, y+9, W-mr, y+9);
        y += 13;
        const chipW=24, chipH=7.5, chipStep=36;
        ans.forEach((a, ai) => {
          const col = ai % 5; const row = Math.floor(ai/5);
          const cx = ml + col*chipStep; const cy = y + row*14;
          pdf.setFont("helvetica","bold"); pdf.setFontSize(8); pdf.setTextColor(MG);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pdf.text(`${ai+1}.`, cx, cy+chipH/2, { baseline:"middle" } as any);
          pdf.setFillColor(Y); pdf.roundedRect(cx+6, cy, chipW, chipH, 1.5, 1.5, "F");
          pdf.setFont("helvetica","bold"); pdf.setFontSize(8); pdf.setTextColor(BK);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pdf.text(a, cx+6+chipW/2, cy+chipH/2, { align:"center", baseline:"middle" } as any);
        });
        y += 2*14 + 8;
      });

      pdf.setDrawColor(LG); pdf.setLineWidth(0.3); pdf.line(ml, H-12, W-mr, H-12);
      pdf.setFont("helvetica","normal"); pdf.setFontSize(7.5); pdf.setTextColor(MG);
      pdf.text("englishnerd.cc — Free English Grammar", ml, H-7);
      pdf.text("Present Simple vs Continuous \u00B7 A2 \u00B7 Free to print & share", W-mr, H-7, { align:"right" });

      pdf.save("EnglishNerd_PresentSimple_VsContinuous_A2.pdf");
    } catch(e) { console.error(e); }
    finally { setPdfLoading(false); }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <a className="hover:text-slate-900 transition" href="/">Home</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses">Tenses</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses/present-simple">Present Simple</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Simple vs Continuous</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Present Simple{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">vs Continuous</span>
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">
              Medium
            </span>
            <span className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">
              A2
            </span>
          </div>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Master the difference between <b>Present Simple</b> and <b>Present Continuous</b> with 40 multiple choice questions across four sets: context clues, stative verbs, permanent vs temporary, and advanced mixed.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left column */}
          {isPro ? (
            <div className="">
              <div className=""><SpeedRound gameId="ps-vs-pc" subject="Simple vs Continuous" questions={SPEED_QUESTIONS} variant="sidebar" /></div>
            </div>
          ) : (
            <AdUnit variant="sidebar-dark" />
          )}

          {/* Main content */}
          <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">

            {/* Tab bar */}
            <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
              <button
                onClick={() => setTab("exercises")}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                  tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"
                }`}
              >
                Exercises
              </button>
              <button
                onClick={() => setTab("explanation")}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                  tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"
                }`}
              >
                Explanation
              </button>
              <PDFButton onDownload={downloadPDF} loading={pdfLoading} />
              <div className="ml-auto hidden sm:flex items-center gap-2 text-sm text-slate-600">
                <span className="text-slate-400 text-xs">Set:</span>
                {([1, 2, 3, 4] as const).map((n) => (
                  <button
                    key={n}
                    onClick={() => switchSet(n)}
                    title={SET_LABELS[n]}
                    className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${
                      exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-8">
              {tab === "exercises" ? (
                <>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-black text-slate-900">{current.title}</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">{current.instructions}</p>

                    {/* Mobile set switcher */}
                    <div className="mt-3 flex sm:hidden items-center gap-2 text-sm text-slate-600">
                      <span className="text-slate-400 text-xs">Set:</span>
                      {([1, 2, 3, 4] as const).map((n) => (
                        <button
                          key={n}
                          onClick={() => switchSet(n)}
                          className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${
                            exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Questions */}
                  <div className="mt-8 space-y-5">
                    {current.questions.map((q, idx) => {
                      const chosen = answers[q.id] ?? null;
                      const isCorrect = checked && chosen === q.correctIndex;
                      const isWrong = checked && chosen !== null && chosen !== q.correctIndex;
                      const noAnswer = checked && chosen === null;

                      return (
                        <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-900">{q.prompt}</div>
                              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                {q.options.map((opt, oi) => (
                                  <label
                                    key={oi}
                                    className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 transition ${
                                      chosen === oi
                                        ? "border-[#F5DA20] bg-[#F5DA20]/20"
                                        : "border-black/10 bg-white hover:bg-black/5"
                                    } ${checked ? "cursor-default" : ""}`}
                                  >
                                    <input
                                      type="radio"
                                      name={q.id}
                                      disabled={checked}
                                      checked={chosen === oi}
                                      onChange={() =>
                                        setAnswers((p) => ({ ...p, [q.id]: oi }))
                                      }
                                      className="accent-[#F5DA20]"
                                    />
                                    <span className="text-sm text-slate-900">{opt}</span>
                                  </label>
                                ))}
                              </div>
                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && (
                                    <div className="text-emerald-700 font-semibold">✅ Correct</div>
                                  )}
                                  {isWrong && (
                                    <div className="text-red-700 font-semibold">❌ Wrong</div>
                                  )}
                                  {noAnswer && (
                                    <div className="text-amber-700 font-semibold">⚠ No answer</div>
                                  )}
                                  <div className="mt-1.5 text-slate-600">
                                    <b className="text-slate-900">Correct answer:</b>{" "}
                                    {q.options[q.correctIndex]} — {q.explanation}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="mt-8 space-y-4">
                    <div className="flex flex-wrap gap-3 items-center">
                      {!checked ? (
                        <button
                          onClick={handleCheck}
                          className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
                        >
                          Check Answers
                        </button>
                      ) : (
                        <button
                          onClick={reset}
                          className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition"
                        >
                          Try Again
                        </button>
                      )}
                      {checked && exNo < 4 && (
                        <button
                          onClick={() => switchSet((exNo + 1) as 1 | 2 | 3 | 4)}
                          className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition"
                        >
                          Next Exercise →
                        </button>
                      )}
                    </div>

                    {score && (
                      <div
                        className={`rounded-2xl border p-4 ${
                          score.percent >= 80
                            ? "border-emerald-200 bg-emerald-50"
                            : score.percent >= 50
                            ? "border-amber-200 bg-amber-50"
                            : "border-red-200 bg-red-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div
                              className={`text-3xl font-black ${
                                score.percent >= 80
                                  ? "text-emerald-700"
                                  : score.percent >= 50
                                  ? "text-amber-700"
                                  : "text-red-700"
                              }`}
                            >
                              {score.percent}%
                            </div>
                            <div className="mt-0.5 text-sm text-slate-600">
                              {score.correct} out of {score.total} correct
                            </div>
                          </div>
                          <div className="text-3xl">
                            {score.percent >= 80 ? "🎉" : score.percent >= 50 ? "💪" : "📖"}
                          </div>
                        </div>
                        <div className="mt-3 h-2 w-full rounded-full bg-black/10 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              score.percent >= 80
                                ? "bg-emerald-500"
                                : score.percent >= 50
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${score.percent}%` }}
                          />
                        </div>
                        <div className="mt-2 text-xs text-slate-500">
                          {score.percent >= 80
                            ? "Excellent! Move on to the next exercise."
                            : score.percent >= 50
                            ? "Good effort! Review the wrong answers and try once more."
                            : "Keep practising — check the Explanation tab and try again."}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Explanation Formula={Formula} Ex={Ex} />
              )}
            </div>
          </section>

          {/* Right column */}
          {isPro ? (
            <aside className="flex flex-col gap-3">
              <p className="px-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">Recommended for you</p>
              {[
                { title: "Quiz — Multiple Choice", href: "/tenses/present-simple/quiz", img: "/topics/exercises/quiz.jpg", level: "A1", badge: "bg-emerald-500", reason: "Practise core PS rules" },
                { title: "Advanced Mixed", href: "/tenses/present-simple/ps-pc-advanced", img: "/topics/exercises/ps-pc-advanced.jpg", level: "A2+", badge: "bg-violet-500", reason: "Harder mixed exercises" },
                { title: "Fill in the Blank", href: "/tenses/present-simple/fill-in-blank", img: "/topics/exercises/fill-in-blank.jpg", level: "A1", badge: "bg-emerald-500", reason: "Write the correct form" },
              ].map((rec) => (
                <a key={rec.href} href={rec.href} className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                    <img src={rec.img} alt={rec.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <span className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-md ${rec.badge}`}>{rec.level}</span>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-sm font-bold leading-snug text-slate-800 transition group-hover:text-slate-900">{rec.title}</p>
                    {rec.reason && <p className="mt-1 text-[11px] font-semibold leading-snug text-amber-600">{rec.reason}</p>}
                  </div>
                </a>
              ))}
              <a href="/tenses/present-simple" className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-500 transition hover:bg-slate-50 hover:text-slate-700">
                All Present Simple
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </a>
            </aside>
          ) : (
            <AdUnit variant="sidebar-dark" />
          )}
        </div>

        {/* SpeedRound for non-PRO */}
        {!isPro && (
          <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
            <div className="hidden lg:block" />
            <SpeedRound gameId="ps-vs-pc" subject="Simple vs Continuous" questions={SPEED_QUESTIONS} />
            <div className="hidden lg:block" />
          </div>
        )}

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a
            href="/tenses/present-simple/do-dont-do-i"
            className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
          >
            ← do / does
          </a>
          <a
            href="/tenses/present-simple/ps-pc-advanced"
            className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
          >
            Next: Advanced Mixed →
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Explanation tab ─────────────────────────────────────────────────────── */

function Explanation({
  Formula,
  Ex,
}: {
  Formula: (props: { parts: Array<{ text: string; color?: string; dim?: boolean }> }) => React.JSX.Element;
  Ex: (props: { en: string }) => React.JSX.Element;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">
          Present Simple vs Present Continuous
        </h2>
        <p className="text-slate-500 text-sm">
          Two tenses — two different perspectives on time. Learn when to use each.
        </p>
      </div>

      {/* Two gradient cards side by side */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Present Simple card */}
        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">✅</span>
            <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">
              Present Simple
            </span>
          </div>
          <div className="space-y-2 mb-3">
            <div className="text-xs font-black text-slate-500 uppercase tracking-wide mb-1">
              Affirmative
            </div>
            <Formula
              parts={[
                { text: "Subject", color: "sky" },
                { dim: true, text: "+" },
                { text: "verb (+s/es)", color: "green" },
              ]}
            />
            <div className="text-xs font-black text-slate-500 uppercase tracking-wide mt-2 mb-1">
              Negative
            </div>
            <Formula
              parts={[
                { text: "Subject", color: "sky" },
                { dim: true, text: "+" },
                { text: "don't / doesn't", color: "red" },
                { dim: true, text: "+" },
                { text: "verb", color: "green" },
              ]}
            />
          </div>
          <div className="space-y-1.5">
            <Ex en="She drinks coffee every morning." />
            <Ex en="Water boils at 100°C." />
            <Ex en="He lives in London." />
          </div>
        </div>

        {/* Present Continuous card */}
        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔄</span>
            <span className="text-sm font-black text-sky-700 uppercase tracking-widest">
              Present Continuous
            </span>
          </div>
          <div className="space-y-2 mb-3">
            <div className="text-xs font-black text-slate-500 uppercase tracking-wide mb-1">
              Affirmative
            </div>
            <Formula
              parts={[
                { text: "Subject", color: "sky" },
                { dim: true, text: "+" },
                { text: "am/is/are", color: "violet" },
                { dim: true, text: "+" },
                { text: "verb + -ing", color: "yellow" },
              ]}
            />
            <div className="text-xs font-black text-slate-500 uppercase tracking-wide mt-2 mb-1">
              Negative
            </div>
            <Formula
              parts={[
                { text: "Subject", color: "sky" },
                { dim: true, text: "+" },
                { text: "am/is/are not", color: "red" },
                { dim: true, text: "+" },
                { text: "verb + -ing", color: "yellow" },
              ]}
            />
          </div>
          <div className="space-y-1.5">
            <Ex en="She is talking on the phone." />
            <Ex en="I'm staying at a hotel this week." />
            <Ex en="Prices are rising." />
          </div>
        </div>
      </div>

      {/* When to use comparison table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">
            📋
          </span>
          <h3 className="font-black text-slate-900">When to use each tense</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left font-black text-emerald-600 pb-2 pr-4">
                  ✅ Present Simple
                </th>
                <th className="text-left font-black text-sky-600 pb-2">
                  🔄 Present Continuous
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Habits & routines", "Actions happening RIGHT NOW"],
                ["General truths / facts", "Temporary situations"],
                ["Permanent states", "Changing / developing situations"],
                ["Stative verbs (always!)", "Future arrangements"],
              ].map(([simple, continuous], i) => (
                <tr key={i}>
                  <td className="py-2.5 pr-4 text-slate-700">
                    <span className="text-emerald-600 font-bold mr-1.5">•</span>
                    {simple}
                  </td>
                  <td className="py-2.5 text-slate-700">
                    <span className="text-sky-600 font-bold mr-1.5">•</span>
                    {continuous}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 grid sm:grid-cols-2 gap-2">
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2">
            <div className="text-xs font-black text-emerald-700 mb-1">Simple examples</div>
            <div className="text-sm text-slate-700 italic">She teaches maths. (job)</div>
            <div className="text-sm text-slate-700 italic">I work at a hospital. (permanent)</div>
          </div>
          <div className="rounded-xl bg-sky-50 border border-sky-100 px-3 py-2">
            <div className="text-xs font-black text-sky-700 mb-1">Continuous examples</div>
            <div className="text-sm text-slate-700 italic">She is teaching a new class this term. (temporary)</div>
            <div className="text-sm text-slate-700 italic">We are meeting them on Saturday. (arrangement)</div>
          </div>
        </div>
      </div>

      {/* Stative verbs amber warning */}
      <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">⚠</span>
          <h3 className="font-black text-amber-800">Stative verbs — NEVER use in Continuous!</h3>
        </div>
        <p className="text-sm text-amber-700 mb-4">
          These verbs describe states, feelings, possession, or mental processes. They are always used in Present Simple, even when talking about right now.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          {[
            "know", "want", "like", "love", "hate",
            "believe", "understand", "own", "belong",
            "seem", "need", "prefer", "remember",
            "forget", "mean", "cost", "contain",
          ].map((verb) => (
            <div
              key={verb}
              className="rounded-lg bg-white border border-amber-200 px-2.5 py-1.5 text-center text-sm font-black text-amber-800"
            >
              {verb}
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          <div className="rounded-xl bg-white border border-amber-200 px-3 py-2">
            <span className="text-emerald-600 font-black text-xs mr-2">✅</span>
            <span className="text-sm font-semibold text-slate-900">I know the answer.</span>
            <span className="ml-2 text-xs text-slate-500">(NOT: I am knowing…)</span>
          </div>
          <div className="rounded-xl bg-white border border-amber-200 px-3 py-2">
            <span className="text-emerald-600 font-black text-xs mr-2">✅</span>
            <span className="text-sm font-semibold text-slate-900">She loves chocolate.</span>
            <span className="ml-2 text-xs text-slate-500">(NOT: She is loving…)</span>
          </div>
          <div className="rounded-xl bg-white border border-amber-200 px-3 py-2">
            <span className="text-emerald-600 font-black text-xs mr-2">✅</span>
            <span className="text-sm font-semibold text-slate-900">This bag belongs to me.</span>
            <span className="ml-2 text-xs text-slate-500">(NOT: This bag is belonging…)</span>
          </div>
        </div>
      </div>

      {/* Time expressions */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-sm">
            🕐
          </span>
          <h3 className="font-black text-slate-900">Time expression clues</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-black text-emerald-700 uppercase tracking-wide mb-2">
              Present Simple
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                "always", "usually", "often", "sometimes",
                "rarely", "never", "every day", "every week",
                "on Mondays", "in the morning", "at 7 o'clock",
              ].map((expr) => (
                <span
                  key={expr}
                  className="rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-800"
                >
                  {expr}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-black text-sky-700 uppercase tracking-wide mb-2">
              Present Continuous
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                "now", "right now", "at the moment",
                "currently", "today", "this week",
                "this month", "this year", "look!", "listen!", "at present",
              ].map((expr) => (
                <span
                  key={expr}
                  className="rounded-lg bg-sky-50 border border-sky-200 px-2.5 py-1 text-xs font-semibold text-sky-800"
                >
                  {expr}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contrast examples */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">
            ↔
          </span>
          <h3 className="font-black text-slate-900">Contrast: same verb, different meaning</h3>
        </div>
        <div className="space-y-3">
          {[
            {
              simple: "I drink coffee.",
              simpleNote: "habit",
              continuous: "I'm drinking coffee.",
              continuousNote: "right now",
            },
            {
              simple: "He lives in Paris.",
              simpleNote: "permanent",
              continuous: "He's living in Paris.",
              continuousNote: "temporary",
            },
            {
              simple: "She teaches maths.",
              simpleNote: "her job",
              continuous: "She's teaching a new class this term.",
              continuousNote: "temporary",
            },
            {
              simple: "I think you're right.",
              simpleNote: "opinion (stative)",
              continuous: "I'm thinking about it.",
              continuousNote: "active process",
            },
          ].map(({ simple, simpleNote, continuous, continuousNote }, i) => (
            <div key={i} className="grid sm:grid-cols-2 gap-2">
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2.5">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wide mb-1">
                  Simple — {simpleNote}
                </div>
                <div className="font-semibold text-slate-900 text-sm italic">{simple}</div>
              </div>
              <div className="rounded-xl bg-sky-50 border border-sky-200 px-3 py-2.5">
                <div className="text-xs font-black text-sky-600 uppercase tracking-wide mb-1">
                  Continuous — {continuousNote}
                </div>
                <div className="font-semibold text-slate-900 text-sm italic">{continuous}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
