import { Resend } from "resend";
import { createHmac } from "crypto";
import { createServiceClient } from "@/lib/supabase/service";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? "hello@englishnerd.cc";
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://englishnerd.cc";

function unsubscribeUrl(email: string): string {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const token = createHmac("sha256", secret).update(email.toLowerCase().trim()).digest("hex");
  return `${SITE}/api/email/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
}

async function isOptedOut(email: string): Promise<boolean> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("email_opt_outs")
      .select("email")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();
    return !!data;
  } catch {
    return false;
  }
}

// ─── Shared design tokens ────────────────────────────────────────────────────

const BASE = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
</head>
<body style="margin:0;padding:0;background:#F4F4F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#F4F4F0;padding:48px 16px;">
<tr><td align="center">
<table width="540" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;max-width:540px;">
`;

const LOGO = `
<tr>
  <td align="center" style="padding-bottom:28px;">
    <a href="${SITE}" style="text-decoration:none;">
      <span style="display:inline-block;background:#111827;border-radius:12px;padding:7px 14px;">
        <span style="font-size:16px;font-weight:900;letter-spacing:-0.4px;color:#F5DA20;">English Nerd</span>
      </span>
    </a>
  </td>
</tr>
`;

const FOOTER = (unsubNote = "You received this email because you created an account on English Nerd.", unsubUrl?: string) => `
<tr><td style="padding:28px 40px 0;">
  <p style="margin:0;font-size:12px;color:#9CA3AF;line-height:1.7;text-align:center;">
    ${unsubNote}<br/>
    <a href="${SITE}" style="color:#9CA3AF;text-decoration:underline;">englishnerd.cc</a>${unsubUrl ? ` &nbsp;·&nbsp; <a href="${unsubUrl}" style="color:#9CA3AF;text-decoration:underline;">Unsubscribe</a>` : ""}
  </p>
</td></tr>
`;

const CLOSE = `
</table>
</td></tr>
</table>
</body>
</html>
`;

function card(topColor: string, content: string) {
  return `
<tr>
  <td style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.07),0 8px 32px rgba(0,0,0,0.06);">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr><td style="height:3px;background:${topColor};"></td></tr>
      <tr><td style="padding:36px 40px 40px;">${content}</td></tr>
    </table>
  </td>
</tr>`;
}

function btn(url: string, label: string, bg = "#111827", color = "#F5DA20") {
  return `
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:28px;">
  <tr><td align="center">
    <a href="${url}" style="display:inline-block;background:${bg};color:${color};font-size:15px;font-weight:800;text-decoration:none;padding:15px 44px;border-radius:12px;letter-spacing:-0.2px;">${label}</a>
  </td></tr>
</table>`;
}

function featureRow(emoji: string, title: string, desc: string) {
  return `
<tr>
  <td style="padding:10px 0;">
    <table cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td style="width:36px;vertical-align:top;padding-top:2px;font-size:18px;">${emoji}</td>
        <td>
          <p style="margin:0;font-size:14px;font-weight:700;color:#111827;">${title}</p>
          <p style="margin:2px 0 0;font-size:13px;color:#6B7280;line-height:1.5;">${desc}</p>
        </td>
      </tr>
    </table>
  </td>
</tr>`;
}

function divider() {
  return `<tr><td style="height:1px;background:#F3F4F6;margin:4px 0;"></td></tr>`;
}

// ─── 1. Welcome email ────────────────────────────────────────────────────────

export async function sendWelcomeEmail(to: string, name: string | null) {
  const firstName = name?.split(" ")[0] ?? "there";

  const html = BASE + LOGO + card(
    "linear-gradient(90deg,#7C3AED,#6366F1,#818CF8)",
    `
    <p style="margin:0 0 6px;font-size:24px;font-weight:900;color:#111827;letter-spacing:-0.5px;">Welcome to English Nerd 🎉</p>
    <p style="margin:0 0 28px;font-size:15px;color:#6B7280;line-height:1.6;">Hi ${firstName}, you've just made a great decision. Let's get your English to the next level.</p>

    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      ${featureRow("📖", "Grammar lessons A1 → C1", "Clear explanations, exercises and instant feedback across all levels.")}
      ${divider()}
      ${featureRow("⏱️", "12 tense topics", "Master every English tense with drills, quizzes and real examples.")}
      ${divider()}
      ${featureRow("📝", "Full vocabulary & tests", "Check your level and discover your vocabulary size.")}
      ${divider()}
      ${featureRow("🔥", "Streaks & progress tracking", "Your progress is saved automatically — never lose your work.")}
    </table>

    ${btn(`${SITE}/grammar/a1`, "Start Learning →")}

    <p style="margin:20px 0 0;font-size:13px;color:#9CA3AF;text-align:center;line-height:1.6;">
      Start from your level, go at your own pace.<br/>No pressure, just progress.
    </p>
    `
  ) + FOOTER() + CLOSE;

  await send(to, "Welcome to English Nerd 🎉", html);
}

// ─── 2. PRO gained ───────────────────────────────────────────────────────────

export async function sendProGainedEmail(to: string, name: string | null, expiresAt?: string | null) {
  const firstName = name?.split(" ")[0] ?? "there";
  const expiryLine = expiresAt
    ? `<p style="margin:8px 0 0;font-size:13px;color:#6B7280;">Your PRO access is active until <strong>${new Date(expiresAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</strong>.</p>`
    : "";

  const html = BASE + LOGO + card(
    "linear-gradient(90deg,#F59E0B,#FBBF24,#FCD34D)",
    `
    <div style="margin-bottom:20px;">
      <span style="display:inline-block;background:#FFFBEB;border:1.5px solid #FDE68A;border-radius:8px;padding:4px 12px;font-size:12px;font-weight:800;color:#D97706;letter-spacing:0.06em;text-transform:uppercase;">PRO Member</span>
    </div>

    <p style="margin:0 0 6px;font-size:22px;font-weight:900;color:#111827;letter-spacing:-0.5px;">You're officially PRO, ${firstName}! ⚡</p>
    <p style="margin:0 0 6px;font-size:15px;color:#6B7280;line-height:1.6;">Thank you for supporting English Nerd. You now have full access to everything.</p>
    ${expiryLine}

    <div style="background:#FFFBEB;border:1.5px solid #FDE68A;border-radius:14px;padding:20px 24px;margin:24px 0;">
      <p style="margin:0 0 14px;font-size:13px;font-weight:800;color:#92400E;text-transform:uppercase;letter-spacing:0.05em;">What's unlocked</p>
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        ${featureRow("📥", "Download materials", "PDF worksheets, vocabulary lists and grammar summaries.")}
        ${divider()}
        ${featureRow("🎓", "Certificates", "Get certificates for completed grammar and tense tests.")}
        ${divider()}
        ${featureRow("♾️", "Unlimited exercises", "No limits on any content across all levels.")}
        ${divider()}
        ${featureRow("🧠", "Full test results", "See detailed breakdowns for grammar, tenses and vocabulary tests.")}
      </table>
    </div>

    ${btn(`${SITE}/account`, "Go to your dashboard →", "#D97706", "#ffffff")}
    `
  ) + FOOTER("You received this because you upgraded to PRO on English Nerd.") + CLOSE;

  await send(to, "You're now a PRO member ⚡", html);
}

// ─── 3. PRO expired ──────────────────────────────────────────────────────────

export async function sendProExpiredEmail(to: string, name: string | null) {
  const firstName = name?.split(" ")[0] ?? "there";

  const html = BASE + LOGO + card(
    "linear-gradient(90deg,#94A3B8,#CBD5E1,#E2E8F0)",
    `
    <p style="margin:0 0 6px;font-size:22px;font-weight:900;color:#111827;letter-spacing:-0.5px;">Your PRO has ended, ${firstName}</p>
    <p style="margin:0 0 24px;font-size:15px;color:#6B7280;line-height:1.6;">
      Your PRO membership has expired. Your progress and streaks are safely saved — nothing is lost.
    </p>

    <div style="background:#F8FAFC;border:1.5px solid #E2E8F0;border-radius:14px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0 0 12px;font-size:13px;font-weight:800;color:#374151;text-transform:uppercase;letter-spacing:0.05em;">You're missing out on</p>
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        ${featureRow("📥", "Material downloads", "PDF worksheets and grammar summaries.")}
        ${divider()}
        ${featureRow("🎓", "Certificates", "Shareable proof of your grammar and tense mastery.")}
        ${divider()}
        ${featureRow("🧠", "Detailed test analytics", "Topic-level breakdowns and vocabulary size estimates.")}
      </table>
    </div>

    <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#111827;text-align:center;">Ready to continue where you left off?</p>
    <p style="margin:0 0 4px;font-size:13px;color:#6B7280;text-align:center;">Renew PRO and get back to full speed.</p>

    ${btn(`${SITE}/pro`, "Renew PRO →", "#7C3AED", "#ffffff")}
    `
  ) + FOOTER("You received this because your PRO membership on English Nerd has expired.") + CLOSE;

  await send(to, "Your PRO membership has ended", html);
}

// ─── 4. Teacher status gained ────────────────────────────────────────────────

export async function sendTeacherWelcomeEmail(to: string, name: string | null, studentLimit: number) {
  const firstName = name?.split(" ")[0] ?? "there";

  const html = BASE + LOGO + card(
    "linear-gradient(90deg,#0EA5E9,#38BDF8,#7DD3FC)",
    `
    <div style="margin-bottom:20px;">
      <span style="display:inline-block;background:#F0F9FF;border:1.5px solid #BAE6FD;border-radius:8px;padding:4px 12px;font-size:12px;font-weight:800;color:#0284C7;letter-spacing:0.06em;text-transform:uppercase;">Teacher Account</span>
    </div>

    <p style="margin:0 0 6px;font-size:22px;font-weight:900;color:#111827;letter-spacing:-0.5px;">Your classroom is ready, ${firstName} 🏫</p>
    <p style="margin:0 0 24px;font-size:15px;color:#6B7280;line-height:1.6;">
      You now have a Teacher account on English Nerd. You can manage up to <strong style="color:#111827;">${studentLimit} student${studentLimit !== 1 ? "s" : ""}</strong> and assign work directly through the platform.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      ${featureRow("👥", "Invite & manage students", "Send invite links and track who's accepted.")}
      ${divider()}
      ${featureRow("📋", "Create assignments", "Assign exercises, essays, homework and custom quizzes.")}
      ${divider()}
      ${featureRow("📊", "Track progress", "See each student's scores, weak areas and completed exercises.")}
      ${divider()}
      ${featureRow("📧", "Email notifications", "Students are automatically notified when you assign work.")}
    </table>

    ${btn(`${SITE}/account`, "Open your dashboard →", "#0284C7", "#ffffff")}

    <p style="margin:20px 0 0;font-size:13px;color:#9CA3AF;text-align:center;line-height:1.6;">
      Start by inviting your first student from the Students tab.
    </p>
    `
  ) + FOOTER("You received this because you activated a Teacher account on English Nerd.") + CLOSE;

  await send(to, "Your Teacher account is ready 🏫", html);
}

// ─── 5. Teacher subscription expired ─────────────────────────────────────────

export async function sendTeacherExpiredEmail(to: string, name: string | null) {
  const firstName = name?.split(" ")[0] ?? "there";

  const html = BASE + LOGO + card(
    "linear-gradient(90deg,#F59E0B,#FBBF24,#FDE68A)",
    `
    <div style="margin-bottom:20px;">
      <span style="display:inline-block;background:#FFFBEB;border:1.5px solid #FDE68A;border-radius:8px;padding:4px 12px;font-size:12px;font-weight:800;color:#B45309;letter-spacing:0.06em;text-transform:uppercase;">Teacher Account</span>
    </div>

    <p style="margin:0 0 6px;font-size:22px;font-weight:900;color:#111827;letter-spacing:-0.5px;">Your Teacher subscription has ended, ${firstName}</p>
    <p style="margin:0 0 24px;font-size:15px;color:#6B7280;line-height:1.6;">
      Your Teacher account on English Nerd is no longer active. Your students, assignments and progress data are safely stored — you just won't be able to invite new students or assign new work until you renew.
    </p>

    <div style="background:#FFFBEB;border:1.5px solid #FDE68A;border-radius:14px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0 0 12px;font-size:13px;font-weight:800;color:#92400E;text-transform:uppercase;letter-spacing:0.05em;">What's paused</p>
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        ${featureRow("🚫", "New student invites", "You can't invite new students until you renew.")}
        ${divider()}
        ${featureRow("📋", "New assignments", "Creating and assigning work is on hold.")}
        ${divider()}
        ${featureRow("📊", "Progress tracking", "Student dashboards are paused.")}
      </table>
    </div>

    <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#111827;text-align:center;">Ready to get back in the classroom?</p>
    <p style="margin:0 0 4px;font-size:13px;color:#6B7280;text-align:center;">Renew your Teacher plan and pick up right where you left off.</p>

    ${btn(`${SITE}/teacher`, "Renew Teacher plan →", "#D97706", "#ffffff")}
    `
  ) + FOOTER("You received this because your Teacher subscription on English Nerd has ended.") + CLOSE;

  await send(to, "Your Teacher subscription has ended", html);
}

// ─── 6. Payment failed ───────────────────────────────────────────────────────

export async function sendPaymentFailedEmail(to: string, name: string | null, isTeacher = false) {
  const firstName = name?.split(" ")[0] ?? "there";
  const planLabel = isTeacher ? "Teacher" : "PRO";
  const renewUrl = isTeacher ? `${SITE}/teacher` : `${SITE}/pro`;

  const html = BASE + LOGO + card(
    "linear-gradient(90deg,#EF4444,#F87171,#FCA5A5)",
    `
    <div style="margin-bottom:20px;">
      <span style="display:inline-block;background:#FEF2F2;border:1.5px solid #FECACA;border-radius:8px;padding:4px 12px;font-size:12px;font-weight:800;color:#DC2626;letter-spacing:0.06em;text-transform:uppercase;">Payment failed</span>
    </div>

    <p style="margin:0 0 6px;font-size:22px;font-weight:900;color:#111827;letter-spacing:-0.5px;">Your payment didn't go through, ${firstName}</p>
    <p style="margin:0 0 24px;font-size:15px;color:#6B7280;line-height:1.6;">
      We couldn't process your ${planLabel} subscription payment. <strong style="color:#111827;">Your access is still active</strong> — we'll retry automatically. To avoid any interruption, please update your payment details now.
    </p>

    <div style="background:#FEF2F2;border:1.5px solid #FECACA;border-radius:14px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0 0 12px;font-size:13px;font-weight:800;color:#991B1B;text-transform:uppercase;letter-spacing:0.05em;">What to do next</p>
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        ${featureRow("💳", "Update your payment method", "Log in to your billing portal and add a valid payment card.")}
        ${divider()}
        ${featureRow("🔄", "Automatic retry", "We'll retry the payment automatically — updating your card is enough.")}
        ${divider()}
        ${featureRow("✅", "Keep your access", "Once the payment goes through, everything continues as normal.")}
      </table>
    </div>

    ${btn(`${SITE}/billing-portal`, "Update payment method →", "#DC2626", "#ffffff")}

    <p style="margin:20px 0 0;font-size:13px;color:#9CA3AF;text-align:center;line-height:1.6;">
      Need help? <a href="${SITE}/contact" style="color:#9CA3AF;text-decoration:underline;">Contact us</a> and we'll sort it out.
    </p>
    `
  ) + FOOTER(`You received this because a payment for your English Nerd ${planLabel} subscription failed.`) + CLOSE;

  await send(to, `Action needed: your ${planLabel} payment didn't go through`, html);
}

// ─── 7. Subscription cancelled ───────────────────────────────────────────────

export async function sendSubscriptionCancelledEmail(to: string, name: string | null, endsAt: string | null, isTeacher = false) {
  const firstName = name?.split(" ")[0] ?? "there";
  const planLabel = isTeacher ? "Teacher" : "PRO";
  const renewUrl = isTeacher ? `${SITE}/teacher` : `${SITE}/pro`;

  const accessLine = endsAt
    ? `<p style="margin:0 0 24px;font-size:15px;color:#6B7280;line-height:1.6;">Your ${planLabel} access will continue until <strong style="color:#111827;">${new Date(endsAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</strong>. After that, you'll switch to a free account — your progress is safely saved.</p>`
    : `<p style="margin:0 0 24px;font-size:15px;color:#6B7280;line-height:1.6;">Your ${planLabel} subscription has been cancelled. Your progress and data are safely saved — nothing is lost.</p>`;

  const html = BASE + LOGO + card(
    "linear-gradient(90deg,#94A3B8,#CBD5E1,#E2E8F0)",
    `
    <p style="margin:0 0 6px;font-size:22px;font-weight:900;color:#111827;letter-spacing:-0.5px;">Subscription cancelled, ${firstName}</p>
    ${accessLine}

    <div style="background:#F8FAFC;border:1.5px solid #E2E8F0;border-radius:14px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0 0 12px;font-size:13px;font-weight:800;color:#374151;text-transform:uppercase;letter-spacing:0.05em;">Your data is safe</p>
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        ${featureRow("📊", "All progress saved", "Every exercise, score and streak you've built stays on your account.")}
        ${divider()}
        ${featureRow("🔒", "Account stays active", "You keep your free account — log in any time.")}
        ${divider()}
        ${featureRow("↩️", "Easy to come back", "Reactivate your ${planLabel} any time with one click.")}
      </table>
    </div>

    <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#111827;text-align:center;">Changed your mind?</p>
    <p style="margin:0 0 4px;font-size:13px;color:#6B7280;text-align:center;">You can reactivate any time — your progress will be right where you left it.</p>

    ${btn(renewUrl, `Reactivate ${planLabel} →`, "#7C3AED", "#ffffff")}
    `
  ) + FOOTER(`You received this because you cancelled your English Nerd ${planLabel} subscription.`) + CLOSE;

  await send(to, `Your ${planLabel} subscription has been cancelled`, html);
}

// ─── 8. Student linked to teacher ────────────────────────────────────────────

export async function sendStudentLinkedEmail(to: string, studentName: string | null, teacherName: string | null) {
  const firstName = studentName?.split(" ")[0] ?? "there";
  const teacher = teacherName ?? "your teacher";

  const html = BASE + LOGO + card(
    "linear-gradient(90deg,#10B981,#34D399,#6EE7B7)",
    `
    <div style="margin-bottom:20px;">
      <span style="display:inline-block;background:#ECFDF5;border:1.5px solid #A7F3D0;border-radius:8px;padding:4px 12px;font-size:12px;font-weight:800;color:#059669;letter-spacing:0.06em;text-transform:uppercase;">You're in!</span>
    </div>

    <p style="margin:0 0 6px;font-size:22px;font-weight:900;color:#111827;letter-spacing:-0.5px;">You've been added to ${teacher}'s class 📚</p>
    <p style="margin:0 0 24px;font-size:15px;color:#6B7280;line-height:1.6;">
      Hi ${firstName}! <strong style="color:#111827;">${teacher}</strong> has added you as a student on English Nerd. You can now receive assignments and track your progress together.
    </p>

    <div style="background:#ECFDF5;border:1.5px solid #A7F3D0;border-radius:14px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0 0 12px;font-size:13px;font-weight:800;color:#065F46;text-transform:uppercase;letter-spacing:0.05em;">What happens next</p>
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        ${featureRow("📬", "Receive assignments", "Your teacher will assign exercises, essays and quizzes for you.")}
        ${divider()}
        ${featureRow("✅", "Submit your work", "Complete assignments directly on the platform.")}
        ${divider()}
        ${featureRow("📈", "Track your progress", "Your results and scores are shared with your teacher.")}
      </table>
    </div>

    ${btn(`${SITE}/account`, "View your assignments →", "#059669", "#ffffff")}
    `
  ) + FOOTER(`You received this because ${teacher} added you as a student on English Nerd.`) + CLOSE;

  await send(to, `You've been added to ${teacher}'s class 📚`, html);
}

// ─── Assignment notification ─────────────────────────────────────────────────

type AssignmentEmailParams = {
  to: string;
  studentName: string | null;
  teacherName: string;
  assignmentTitle: string;
  assignmentType: string;
  dueDate?: string | null;
  instructions?: string | null;
  resourceUrl?: string | null;
  href?: string | null;
};

function categoryLabel(type: string): string {
  const map: Record<string, string> = {
    homework: "Homework", quiz: "Quiz", essay: "Essay",
    grammar: "Grammar", tenses: "Tenses", vocabulary: "Vocabulary",
  };
  return map[type] ?? "Assignment";
}

function categoryAccent(type: string): { bg: string; text: string; border: string } {
  if (type === "essay") return { bg: "#FFF1F2", text: "#E11D48", border: "#FECDD3" };
  if (type === "quiz") return { bg: "#EFF6FF", text: "#2563EB", border: "#BFDBFE" };
  if (type === "tenses") return { bg: "#F0F9FF", text: "#0284C7", border: "#BAE6FD" };
  if (type === "vocabulary") return { bg: "#FFFBEB", text: "#D97706", border: "#FDE68A" };
  return { bg: "#F5F3FF", text: "#7C3AED", border: "#DDD6FE" };
}

export async function sendAssignmentEmail(params: AssignmentEmailParams) {
  const { to, studentName, teacherName, assignmentTitle, assignmentType, dueDate, instructions, resourceUrl, href } = params;

  const name = studentName?.trim() || "there";
  const typeLabel = categoryLabel(assignmentType);
  const accent = categoryAccent(assignmentType);
  const ctaUrl = href ? `${SITE}${href}` : `${SITE}/account`;

  const dueLine = dueDate
    ? new Date(dueDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    : null;

  const fromLine = teacherName
    ? `<strong style="color:#111827;">${teacherName}</strong> assigned you new work`
    : "You have a new assignment";

  const html = BASE + LOGO + card(
    "linear-gradient(90deg,#7C3AED,#6366F1,#818CF8)",
    `
    <p style="margin:0 0 6px;font-size:22px;font-weight:900;color:#111827;letter-spacing:-0.5px;">Hi ${name} 👋</p>
    <p style="margin:0 0 28px;font-size:15px;color:#6B7280;line-height:1.5;">${fromLine}</p>

    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#F9FAFB;border:1.5px solid #E5E7EB;border-radius:14px;overflow:hidden;">
      <tr>
        <td style="padding:16px 20px 12px;">
          <span style="display:inline-block;background:${accent.bg};color:${accent.text};border:1px solid ${accent.border};border-radius:6px;padding:3px 10px;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">${typeLabel}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:0 20px 16px;">
          <p style="margin:0;font-size:18px;font-weight:800;color:#111827;letter-spacing:-0.3px;line-height:1.3;">${assignmentTitle}</p>
        </td>
      </tr>
      ${dueLine ? `<tr><td style="padding:12px 20px;border-top:1px solid #E5E7EB;"><span style="font-size:13px;font-weight:600;color:#EF4444;">⏰ Due ${dueLine}</span></td></tr>` : ""}
      ${instructions ? `<tr><td style="padding:14px 20px;border-top:1px solid #E5E7EB;"><p style="margin:0;font-size:14px;color:#4B5563;line-height:1.65;">${instructions.replace(/\n/g, "<br/>")}</p></td></tr>` : ""}
      ${resourceUrl ? `<tr><td style="padding:12px 20px;border-top:1px solid #E5E7EB;"><a href="${resourceUrl}" style="font-size:13px;font-weight:600;color:#7C3AED;text-decoration:none;">🔗 View resource →</a></td></tr>` : ""}
    </table>

    ${btn(ctaUrl, "Open assignment →")}
    `
  ) + FOOTER(`You received this because ${teacherName || "your teacher"} assigned you work on English Nerd.`, unsubscribeUrl(to)) + CLOSE;

  await send(to, `New ${typeLabel.toLowerCase()}: ${assignmentTitle}`, html);
}

// ─── Internal send helper ────────────────────────────────────────────────────

async function send(to: string, subject: string, html: string) {
  try {
    if (await isOptedOut(to)) {
      console.log("[email] skipped (opted out):", to);
      return;
    }
    await resend.emails.send({ from: `English Nerd <${FROM}>`, to, subject, html });
  } catch (e) {
    console.error("[email] send error:", subject, e);
  }
}
