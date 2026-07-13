import { useState, useEffect, useMemo } from "react";
import {
  LayoutDashboard, Briefcase, Users, Plus, Search, X, Upload, Trash2,
  Phone, Mail, MapPin, Calendar, FileText, Pencil, Download, Printer,
  Network, Banknote, Filter, Receipt, CreditCard, CalendarClock, Clock, AlertTriangle,
  FileSignature, ChevronRight
} from "lucide-react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

const LOGO = "data:image/jpeg;base64,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";

/* ============================================================
   אחסון מתמשך – נשמר בין מכשירים (חשבון Claude). נופל בחן לזיכרון
   בלבד אם window.storage לא זמין, כדי שהאפליקציה לעולם לא תקרוס.
============================================================ */
const firebaseConfig = {
  apiKey: "AIzaSyBguYJdzaIr7m0YVEkv1yHHnZ6AIVHS5_c",
  authDomain: "yam-networks.firebaseapp.com",
  projectId: "yam-networks",
  storageBucket: "yam-networks.firebasestorage.app",
  messagingSenderId: "399862494321",
  appId: "1:399862494321:web:2054819a021e6d189457d0",
};
const fbApp = initializeApp(firebaseConfig);
const auth = getAuth(fbApp);
const db = getFirestore(fbApp);

/* מפתחות עשויים להכיל תווים לא חוקיים למזהה מסמך — ממירים לבטוח */
const safeId = (key) => encodeURIComponent(key).replace(/\./g, "%2E").replace(/%2F/g, "_");

const store = {
  async get(key) {
    try {
      const snap = await getDoc(doc(db, "app_kv", safeId(key)));
      return snap.exists() ? snap.data().value : null;
    } catch { return null; }
  },
  async set(key, value) {
    try {
      await setDoc(doc(db, "app_kv", safeId(key)), { value, updatedAt: new Date().toISOString() });
      return true;
    } catch (e) {
      alert("שמירה נכשלה. בדקי את החיבור לאינטרנט ונסי שוב.");
      return false;
    }
  },
  async del(key) {
    try { await deleteDoc(doc(db, "app_kv", safeId(key))); } catch {}
  },
};

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const ils = (n) => (n || n === 0) ? `₪${Number(n).toLocaleString("he-IL")}` : "—";
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—";
const todayISO = () => new Date().toISOString().slice(0, 10);
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* חישוב תאריך תשלום משוער: מספר הימים עד סוף החודש + מספר ימי התנאי (שוטף+) */
function calcEstPayment(invoiceDate, termDays) {
  if (!invoiceDate || !termDays) return "";
  const d = new Date(invoiceDate);
  if (isNaN(d)) return "";
  const eom = new Date(d.getFullYear(), d.getMonth() + 1, 0);   // יום אחרון בחודש החשבונית
  eom.setDate(eom.getDate() + Number(termDays));
  return eom.toISOString().slice(0, 10);
}

/* ----------------------------- נתוני עזר ----------------------------- */
const STATUSES = {
  new:         { label: "חדש",     dot: "bg-slate-400",   chip: "bg-slate-100 text-slate-700" },
  in_progress: { label: "בעבודה",  dot: "bg-amber-500",   chip: "bg-amber-100 text-amber-800" },
  waiting:     { label: "ממתין",   dot: "bg-violet-500",  chip: "bg-violet-100 text-violet-800" },
  done:        { label: "הושלם",   dot: "bg-emerald-500", chip: "bg-emerald-100 text-emerald-800" },
  invoiced:    { label: "חויב",    dot: "bg-cyan-600",    chip: "bg-cyan-100 text-cyan-800" },
};
const STATUS_ORDER = ["new", "in_progress", "waiting", "done", "invoiced"];
const JOB_TYPES = ["התקנת תשתית וקווי רשת", "פתרון תקלות", "הגדרת ראוטר / סוויץ'", "התקנת WiFi", "מצלמות אבטחה", "התקנת שרת", "ארון תקשורת", "אחר"];
const PRIORITIES = { normal: { label: "רגיל", chip: "text-slate-500" }, high: { label: "גבוה", chip: "text-amber-600" }, urgent: { label: "דחוף", chip: "text-rose-600 font-semibold" } };
const PAYMENT_METHODS = { "": "—", check: "צ'ק", transfer: "העברה בנקאית" };
const PAYMENT_TERMS = [
  { v: "", label: "—" }, { v: "30", label: "שוטף 30" }, { v: "60", label: "שוטף 60" },
  { v: "70", label: "שוטף 70" }, { v: "90", label: "שוטף 90" }, { v: "120", label: "שוטף 120" },
];

const BUSINESS = { name: "ים רשתות תקשורת", taxId: "058830126", phone: "0526816852", email: "yamnet.yair@gmail.com", address: "רחוב הפרחים 3, חיפה, 34733" };
const mergeBiz = (st) => { const out = { ...BUSINESS }; if (st) for (const k in st) if (st[k]) out[k] = st[k]; return out; };

const TAGLINE = "תכנון והקמת רשתות תקשורת, התקנת מערכות וציוד תקשורת";
const ALLOCATION_THRESHOLD = 5000;

const blankJob = () => ({
  title: "", clientName: "", clientPhone: "", clientEmail: "",
  type: JOB_TYPES[0], status: "new", priority: "normal",
  scheduledDate: todayISO(), address: "", price: "", notes: "",
  quoteNumber: "", quoteDate: "",
  invoiceIssued: false, invoiceNumber: "", invoiceDate: "", allocationNumber: "",
  paymentMethod: "", paymentTerms: "", checkTransferDate: "", paymentReceivedDate: "",
});

/* מסמך HTML מסודר להדפסה / הורדה */
function renderJobHTML(job, docs) {
  const stLabel = STATUSES[job.status]?.label || "—";
  const est = calcEstPayment(job.invoiceDate, job.paymentTerms);
  const termLabel = PAYMENT_TERMS.find((t) => t.v === job.paymentTerms)?.label || "—";
  const methodLabel = PAYMENT_METHODS[job.paymentMethod] || "—";
  const imgs = docs.filter((d) => d.type && d.type.startsWith("image/") && d.url);
  const others = docs.filter((d) => !(d.type && d.type.startsWith("image/")));
  const r = (k, v) => `<tr><th>${esc(k)}</th><td>${esc(v) || "—"}</td></tr>`;
  const section = (title, rows) => `<h2>${esc(title)}</h2><table>${rows}</table>`;
  return `<!doctype html>
<html dir="rtl" lang="he"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>כרטיס עבודה – ${esc(job.title)}</title>
<style>
*{box-sizing:border-box}
body{font-family:system-ui,'Segoe UI',Arial,sans-serif;color:#0f172a;max-width:820px;margin:24px auto;padding:0 20px;line-height:1.5}
.top{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #0891b2;padding-bottom:12px;margin-bottom:8px}
.brand{font-size:13px;color:#64748b}
h1{font-size:22px;margin:4px 0}
.status{background:#0891b2;color:#fff;border-radius:999px;padding:4px 14px;font-size:13px;white-space:nowrap}
h2{font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:#0891b2;margin:18px 0 4px;border-bottom:1px solid #e2e8f0;padding-bottom:3px}
table{width:100%;border-collapse:collapse;font-size:14px}
th{text-align:right;color:#64748b;font-weight:500;width:170px;vertical-align:top;padding:3px 0}
td{padding:3px 0}
.desc{white-space:pre-wrap;font-size:14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px}
.imgs{display:flex;flex-wrap:wrap;gap:10px;margin-top:8px}
.imgs img{max-width:240px;max-height:240px;border:1px solid #e2e8f0;border-radius:8px}
.files{margin:6px 0;padding-right:18px}.files li{font-size:14px}
.foot{margin-top:28px;font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:8px}
@media print{body{margin:0}}
</style></head><body>
<div class="top">
  <div><div class="brand">ניהול עבודות · רשתות מחשבים</div><h1>${esc(job.title)}</h1><div class="brand">${esc(job.type || "")}</div></div>
  <div class="status">${esc(stLabel)}</div>
</div>
${section("פרטי לקוח", r("שם לקוח", job.clientName) + r("טלפון", job.clientPhone) + r("מייל", job.clientEmail) + r("כתובת", job.address))}
${section("פרטי עבודה", r("סוג עבודה", job.type) + r("עדיפות", PRIORITIES[job.priority]?.label) + r("תאריך", fmtDate(job.scheduledDate)) + r("מחיר", ils(job.price)))}
${job.notes ? `<h2>תיאור העבודה</h2><div class="desc">${esc(job.notes)}</div>` : ""}
${section("הצעת מחיר", r("מספר הצעה", job.quoteNumber) + r("תאריך", fmtDate(job.quoteDate)))}
${section("חשבונית", r("יצאה חשבונית", job.invoiceIssued ? "כן" : "לא") + r("מספר חשבונית", job.invoiceNumber) + r("תאריך", fmtDate(job.invoiceDate)) + r("מספר הקצאה", job.allocationNumber))}
${section("קבלת תשלום", r("אמצעי תשלום", methodLabel) + r("תנאי תשלום", termLabel) + r("תשלום משוער", est ? fmtDate(est) : "—") + r("תאריך הצ'ק / העברה", fmtDate(job.checkTransferDate)) + r("התקבל בפועל", fmtDate(job.paymentReceivedDate)))}
${imgs.length ? `<h2>מסמכים מצורפים</h2><div class="imgs">${imgs.map((d) => `<img src="${d.url}" alt="${esc(d.name)}">`).join("")}</div>` : ""}
${others.length ? `<h2>קבצים</h2><ul class="files">${others.map((d) => `<li>${esc(d.name)}</li>`).join("")}</ul>` : ""}
<div class="foot">הופק ב-${fmtDate(new Date().toISOString())} · להדפסה או שמירה כ-PDF: Ctrl/Cmd + P</div>
</body></html>`;
}

/* ============================================================ */
/* ----------------------------- עזרי הצעת מחיר ----------------------------- */
const addDays = (iso, n) => { const d = new Date(iso); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
function quoteTotals(q) {
  const sub = (q.items || []).reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.unitPrice) || 0), 0);
  const vat = sub * (Number(q.vatRate) || 0) / 100;
  return { sub, vat, total: sub + vat };
}
function renderQuoteHTML(q) {
  const t = quoteTotals(q);
  const b = q.business || {};
  const c = q.client || {};
  const contact = [b.taxId && ("ע.מ./ח.פ. " + b.taxId), b.phone, b.email, b.address].filter(Boolean).map(esc).join(" · ");
  const rows = (q.items || []).filter((it) => it.desc || it.qty || it.unitPrice).map((it, i) => {
    const line = (Number(it.qty) || 0) * (Number(it.unitPrice) || 0);
    return `<tr><td>${i + 1}</td><td class="desc">${esc(it.desc)}</td><td>${esc(it.qty)}</td><td>${ils(it.unitPrice)}</td><td>${ils(line)}</td></tr>`;
  }).join("");
  return `<!doctype html>
<html dir="rtl" lang="he"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>הצעת מחיר ${esc(q.quoteNumber)}</title>
<style>
*{box-sizing:border-box}
body{font-family:system-ui,'Segoe UI',Arial,sans-serif;color:#0f172a;max-width:820px;margin:24px auto;padding:0 22px;line-height:1.5}
.logo{width:100%;height:auto;display:block;border:1px solid #e2e8f0;border-radius:8px}
.contact{font-size:12px;color:#64748b;margin:8px 2px 0;text-align:center}
.tagline{font-size:13px;color:#0e7490;text-align:center;margin:8px 0 0;font-weight:500}
.bar{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid #0891b2;padding-bottom:8px;margin:18px 0 14px}
h1{font-size:24px;margin:0;color:#0e7490}
.meta{font-size:13px;color:#475569;text-align:left}
.meta b{color:#0f172a}
.to{font-size:14px;margin-bottom:12px}
.to .lbl{color:#64748b}
table.items{width:100%;border-collapse:collapse;font-size:13px;margin-top:6px}
table.items th{background:#f1f5f9;color:#334155;text-align:right;padding:8px;border:1px solid #e2e8f0}
table.items td{padding:8px;border:1px solid #e2e8f0;vertical-align:top}
table.items td.desc{width:50%}
.totals{margin-top:14px;margin-right:auto;width:300px;font-size:14px}
.totals div{display:flex;justify-content:space-between;padding:4px 2px}
.totals .grand{border-top:2px solid #0891b2;margin-top:4px;padding-top:8px;font-size:17px;font-weight:bold;color:#0e7490}
.notes{margin-top:18px;font-size:13px;white-space:pre-wrap;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px}
.sign{margin-top:34px;display:flex;justify-content:space-between;font-size:13px;color:#475569}
.foot{margin-top:26px;font-size:11px;color:#94a3b8;text-align:center;border-top:1px solid #e2e8f0;padding-top:8px}
@media print{body{margin:0}}
</style></head><body>
<img class="logo" src="${LOGO}" alt="">
<div class="tagline">${esc(TAGLINE)}</div>
${contact ? `<div class="contact">${contact}</div>` : ""}
<div class="bar"><h1>הצעת מחיר</h1>
  <div class="meta">מס׳ הצעה: <b>${esc(q.quoteNumber) || "—"}</b><br>תאריך: <b>${fmtDate(q.date)}</b><br>בתוקף עד: <b>${fmtDate(q.validUntil)}</b></div>
</div>
<div class="to"><span class="lbl">לכבוד:</span> <b>${esc(c.name) || "—"}</b>${c.company ? " · " + esc(c.company) : ""}<br>
${[c.phone, c.email, c.address].filter(Boolean).map(esc).join(" · ")}</div>
<table class="items"><thead><tr><th>#</th><th>תיאור</th><th>כמות</th><th>מחיר יחידה</th><th>סה״כ</th></tr></thead>
<tbody>${rows || '<tr><td colspan="5" style="text-align:center;color:#94a3b8">אין פריטים</td></tr>'}</tbody></table>
<div class="totals">
  <div><span>סכום ביניים</span><span>${ils(t.sub)}</span></div>
  <div><span>מע״מ ${esc(q.vatRate)}%</span><span>${ils(t.vat)}</span></div>
  <div class="grand"><span>סה״כ לתשלום</span><span>${ils(t.total)}</span></div>
</div>
${q.notes ? `<div class="notes">${esc(q.notes)}</div>` : ""}
<div class="sign"><div>בכבוד רב,<br><b>${esc(b.name) || ""}</b></div><div>חתימה: ____________________</div></div>
<div class="foot">הצעה זו תקפה עד ${fmtDate(q.validUntil)} · המחירים בתוספת מע״מ כחוק</div>
</body></html>`;
}

function MainApp() {
  const [view, setView] = useState("dashboard");
  const [jobs, setJobs] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingJob, setEditingJob] = useState(null);
  const [openJob, setOpenJob] = useState(null);
  const [editingClient, setEditingClient] = useState(null);

  useEffect(() => {
    (async () => {
      const j = await store.get("jobs");
      const c = await store.get("clients");
      setJobs(j ? JSON.parse(j) : []);
      setClients(c ? JSON.parse(c) : []);
      setLoading(false);
    })();
  }, []);

  const saveJobs = async (next) => { setJobs(next); await store.set("jobs", JSON.stringify(next)); };
  const saveClients = async (next) => { setClients(next); await store.set("clients", JSON.stringify(next)); };

  const upsertJob = async (job) => {
    const now = new Date().toISOString();
    if (job.id) await saveJobs(jobs.map((x) => x.id === job.id ? { ...job, updatedAt: now } : x));
    else await saveJobs([{ ...job, id: uid(), docs: [], createdAt: now, updatedAt: now }, ...jobs]);
    setEditingJob(null);
  };

  const deleteJob = async (job) => {
    for (const d of (job.docs || [])) await store.del("doc:" + d.id);
    await saveJobs(jobs.filter((x) => x.id !== job.id));
    setOpenJob(null);
  };

  const upsertClient = async (cl) => {
    if (cl.id) await saveClients(clients.map((x) => x.id === cl.id ? cl : x));
    else await saveClients([{ ...cl, id: uid() }, ...clients]);
    setEditingClient(null);
  };
  const deleteClient = async (id) => saveClients(clients.filter((x) => x.id !== id));

  const addDoc = async (jobId, meta, dataUrl) => {
    await store.set("doc:" + meta.id, dataUrl);
    const next = jobs.map((j) => j.id === jobId ? { ...j, docs: [...(j.docs || []), meta] } : j);
    await saveJobs(next);
    setOpenJob(next.find((j) => j.id === jobId));
  };
  const removeDoc = async (jobId, docId) => {
    await store.del("doc:" + docId);
    const next = jobs.map((j) => j.id === jobId ? { ...j, docs: (j.docs || []).filter((d) => d.id !== docId) } : j);
    await saveJobs(next);
    setOpenJob(next.find((j) => j.id === jobId));
  };

  const tabs = [
    { id: "dashboard", label: "כרטיס לקוח", Icon: LayoutDashboard },
    { id: "jobs", label: "עבודות", Icon: Briefcase },
    { id: "clients", label: "לקוחות", Icon: Users },
    { id: "quotes", label: "הצעת מחיר", Icon: FileSignature },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 text-slate-800"
         style={{ fontFamily: "system-ui, 'Segoe UI', Arial, sans-serif" }}>
            <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto">
          <img src={LOGO} alt="ים רשתות תקשורת · Yam Networks Communication" className="block w-full h-auto" />
          <p className="text-center text-sm text-cyan-700 font-medium py-1.5">{TAGLINE}</p>
        </div>
        <nav className="max-w-5xl mx-auto px-2 flex items-center gap-1 overflow-x-auto">
          {tabs.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setView(id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
                ${view === id ? "border-cyan-600 text-cyan-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}>
              <Icon size={17} /> {label}
            </button>
          ))}
          <button onClick={() => signOut(auth)} className="ms-auto text-sm text-slate-400 hover:text-rose-600 px-3 py-3 whitespace-nowrap">יציאה</button>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-20 text-slate-400">טוען נתונים…</div>
        ) : view === "dashboard" ? (
          <Dashboard jobs={jobs} onOpenJob={setOpenJob} onNew={() => setEditingJob("new")} onGoto={setView} />
        ) : view === "jobs" ? (
          <JobsView jobs={jobs} onOpenJob={setOpenJob} onNew={() => setEditingJob("new")} />
        ) : view === "clients" ? (
          <ClientsTab clients={clients} jobs={jobs} onOpenJob={setOpenJob}
            onNewJob={(cl) => setEditingJob({ ...blankJob(), clientName: cl.name, clientPhone: cl.phone || "", clientEmail: cl.email || "", address: cl.address || "" })}
            onNew={() => setEditingClient("new")} onEdit={setEditingClient} onDelete={deleteClient} />
        ) : (
          <QuotesTab clients={clients} />
        )}
      </main>

      {editingJob && (
        <JobForm job={editingJob === "new" ? null : editingJob} clients={clients}
          onSave={upsertJob} onClose={() => setEditingJob(null)} />
      )}
      {openJob && (
        <JobDetail job={jobs.find((j) => j.id === openJob.id) || openJob}
          onClose={() => setOpenJob(null)} onEdit={(j) => { setOpenJob(null); setEditingJob(j); }}
          onDelete={deleteJob} onAddDoc={addDoc} onRemoveDoc={removeDoc}
          onStatus={(j, s) => upsertJob({ ...j, status: s })} />
      )}
      {editingClient && (
        <ClientForm client={editingClient === "new" ? null : editingClient}
          onSave={upsertClient} onClose={() => setEditingClient(null)} />
      )}
    </div>
  );
}

/* ----------------------------- כרטיס לקוח (סקירה) ----------------------------- */
function Dashboard({ jobs, onOpenJob, onNew, onGoto }) {
  const stats = useMemo(() => {
    const active = jobs.filter((j) => ["new", "in_progress", "waiting"].includes(j.status)).length;
    const inProg = jobs.filter((j) => j.status === "in_progress").length;
    const waiting = jobs.filter((j) => j.status === "waiting").length;
    const awaitingPay = jobs.filter((j) => j.invoiceIssued && !j.paymentReceivedDate).length;
    const month = new Date().getMonth(), year = new Date().getFullYear();
    const revenue = jobs.filter((j) => j.paymentReceivedDate).reduce((s, j) => s + (Number(j.price) || 0), 0);
    const monthRevenue = jobs.filter((j) => {
      if (!j.paymentReceivedDate) return false;
      const d = new Date(j.paymentReceivedDate); return d.getMonth() === month && d.getFullYear() === year;
    }).reduce((s, j) => s + (Number(j.price) || 0), 0);
    return { active, inProg, waiting, awaitingPay, revenue, monthRevenue };
  }, [jobs]);

  const recent = [...jobs].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 6);
  const cards = [
    { label: "עבודות פעילות", value: stats.active, sub: `${stats.inProg} בעבודה · ${stats.waiting} ממתינות`, accent: "text-amber-600" },
    { label: "ממתין לתשלום", value: stats.awaitingPay, sub: "חשבונית יצאה, טרם שולם", accent: "text-violet-600" },
    { label: "התקבל החודש", value: ils(stats.monthRevenue), sub: `סה"כ התקבל: ${ils(stats.revenue)}`, accent: "text-emerald-600" },
  ];

  if (jobs.length === 0) {
    return (
      <Empty Icon={Briefcase} title="עוד אין עבודות"
        body="הוסיפו את העבודה הראשונה כדי להתחיל לעקוב אחרי לקוחות, סטטוסים, הצעות מחיר, חשבוניות ותשלומים."
        action={<PrimaryBtn onClick={onNew}><Plus size={18} /> עבודה חדשה</PrimaryBtn>} />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">סקירה כללית</h2>
        <PrimaryBtn onClick={onNew}><Plus size={18} /> עבודה חדשה</PrimaryBtn>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className={`text-2xl font-bold mt-1 ${c.accent}`}>{c.value}</p>
            <p className="text-xs text-slate-400 mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
        <p className="text-sm font-semibold text-slate-600 mb-3">לפי סטטוס</p>
        <div className="flex flex-wrap gap-2">
          {STATUS_ORDER.map((s) => {
            const n = jobs.filter((j) => j.status === s).length;
            const { label, dot } = STATUSES[s];
            return (
              <div key={s} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
                <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
                <span className="text-sm text-slate-600">{label}</span>
                <span className="text-sm font-bold text-slate-800">{n}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <p className="font-semibold text-slate-700">עודכן לאחרונה</p>
          <button onClick={() => onGoto("jobs")} className="text-sm text-cyan-700 hover:underline">לכל העבודות</button>
        </div>
        <ul className="divide-y divide-slate-100">
          {recent.map((j) => <JobRow key={j.id} job={j} onClick={() => onOpenJob(j)} />)}
        </ul>
      </div>
    </div>
  );
}

/* ----------------------------- רשימת עבודות ----------------------------- */
function JobsView({ jobs, onOpenJob, onNew }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    return jobs
      .filter((j) => status === "all" ? true : j.status === status)
      .filter((j) => {
        if (!q.trim()) return true;
        const t = (j.title + " " + j.clientName + " " + (j.address || "") + " " + (j.type || "") + " " + (j.invoiceNumber || "") + " " + (j.quoteNumber || "")).toLowerCase();
        return t.includes(q.toLowerCase());
      })
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [jobs, q, status]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold">עבודות</h2>
        <PrimaryBtn onClick={onNew}><Plus size={18} /> עבודה חדשה</PrimaryBtn>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="חיפוש לפי לקוח, כתובת, מספר חשבונית/הצעה…"
            className="w-full pr-10 pl-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter size={16} className="text-slate-400 shrink-0" />
          <FilterChip active={status === "all"} onClick={() => setStatus("all")}>הכל</FilterChip>
          {STATUS_ORDER.map((s) => (
            <FilterChip key={s} active={status === s} onClick={() => setStatus(s)}>{STATUSES[s].label}</FilterChip>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Empty Icon={Search} title="אין תוצאות" body="נסו לשנות את החיפוש או הסינון." />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {filtered.map((j) => <JobRow key={j.id} job={j} onClick={() => onOpenJob(j)} />)}
          </ul>
        </div>
      )}
    </div>
  );
}

function JobRow({ job, onClick }) {
  const st = STATUSES[job.status] || STATUSES.new;
  return (
    <li>
      <button onClick={onClick} className="w-full text-right px-5 py-3.5 hover:bg-slate-50 flex items-center gap-3">
        <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${st.dot}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-slate-800 truncate">{job.title}</p>
            {job.priority && job.priority !== "normal" && (
              <span className={`text-xs ${PRIORITIES[job.priority].chip}`}>{PRIORITIES[job.priority].label}</span>
            )}
          </div>
          <p className="text-sm text-slate-500 truncate">{job.clientName}{job.type ? " · " + job.type : ""}</p>
        </div>
        <div className="text-left shrink-0">
          <span className={`text-xs px-2 py-1 rounded-full ${st.chip}`}>{st.label}</span>
          <p className="text-xs text-slate-400 mt-1">{fmtDate(job.scheduledDate)}</p>
        </div>
        {(job.docs?.length > 0) && <FileText size={15} className="text-slate-300 shrink-0" />}
      </button>
    </li>
  );
}

/* ----------------------------- טופס עבודה ----------------------------- */
function JobForm({ job, clients, onSave, onClose }) {
  const [f, setF] = useState(job || blankJob());
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const valid = f.title.trim() && f.clientName.trim();
  const est = calcEstPayment(f.invoiceDate, f.paymentTerms);
  const seg = (on) => `flex-1 text-sm py-2 rounded-lg border transition-colors ${on ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-300"}`;

  return (
    <Modal title={job?.id ? "עריכת עבודה" : "עבודה חדשה"} onClose={onClose} wide>
      <div className="space-y-5">
        <Section title="פרטי העבודה">
          <Field label="כותרת העבודה *">
            <Input value={f.title} onChange={(e) => set("title", e.target.value)} placeholder="לדוגמה: התקנת ארון תקשורת – משרד קומה 2" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="שם לקוח *">
              <Input value={f.clientName} onChange={(e) => set("clientName", e.target.value)} list="clients-dl" placeholder="שם" />
              <datalist id="clients-dl">{clients.map((c) => <option key={c.id} value={c.name} />)}</datalist>
            </Field>
            <Field label="טלפון"><Input value={f.clientPhone} onChange={(e) => set("clientPhone", e.target.value)} placeholder="050-0000000" /></Field>
          </div>
          <Field label="כתובת מייל">
            <Input type="email" value={f.clientEmail} onChange={(e) => set("clientEmail", e.target.value)} placeholder="name@example.com" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="סוג עבודה">
              <Select value={f.type} onChange={(e) => set("type", e.target.value)}>{JOB_TYPES.map((t) => <option key={t}>{t}</option>)}</Select>
            </Field>
            <Field label="עדיפות">
              <Select value={f.priority} onChange={(e) => set("priority", e.target.value)}>
                {Object.entries(PRIORITIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="סטטוס">
              <Select value={f.status} onChange={(e) => set("status", e.target.value)}>
                {STATUS_ORDER.map((s) => <option key={s} value={s}>{STATUSES[s].label}</option>)}
              </Select>
            </Field>
            <Field label="תאריך"><Input type="date" value={f.scheduledDate} onChange={(e) => set("scheduledDate", e.target.value)} /></Field>
            <Field label="מחיר (₪)"><Input type="number" value={f.price} onChange={(e) => set("price", e.target.value)} placeholder="0" /></Field>
          </div>
          <Field label="כתובת / אתר העבודה"><Input value={f.address} onChange={(e) => set("address", e.target.value)} placeholder="רחוב, עיר" /></Field>
          <Field label="תיאור העבודה">
            <textarea value={f.notes} onChange={(e) => set("notes", e.target.value)} rows={3}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="פירוט העבודה, הציוד שהותקן, מה בוצע ומה נותר…" />
          </Field>
        </Section>

        <Section title="הצעת מחיר" Icon={FileSignature}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="מספר הצעת מחיר"><Input value={f.quoteNumber} onChange={(e) => set("quoteNumber", e.target.value)} placeholder="לדוגמה: 1024" /></Field>
            <Field label="תאריך"><Input type="date" value={f.quoteDate} onChange={(e) => set("quoteDate", e.target.value)} /></Field>
          </div>
          <p className="text-xs text-slate-400">את מסמך ההצעה מעלים בכרטיס העבודה אחרי השמירה.</p>
        </Section>

        <Section title="חשבונית" Icon={Receipt}>
          {Number(f.price) >= ALLOCATION_THRESHOLD && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-300 rounded-lg p-3 text-sm text-amber-800">
              <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-600" />
              <span>חשבונית בסך {ils(f.price)} (מעל 5,000 ₪ לפני מע״מ) — נדרש <b>מספר הקצאה</b> מרשות המסים (חשבוניות ישראל). הפיקו אותו באזור האישי ברשות המסים והזינו אותו בשדה למטה.</span>
            </div>
          )}
          <Field label="האם יצאה חשבונית">
            <div className="flex gap-2">
              <button type="button" onClick={() => set("invoiceIssued", true)} className={seg(f.invoiceIssued === true)}>כן</button>
              <button type="button" onClick={() => set("invoiceIssued", false)} className={seg(f.invoiceIssued === false)}>לא</button>
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="מספר חשבונית"><Input value={f.invoiceNumber} onChange={(e) => set("invoiceNumber", e.target.value)} placeholder="לדוגמה: 2048" /></Field>
            <Field label="תאריך חשבונית"><Input type="date" value={f.invoiceDate} onChange={(e) => set("invoiceDate", e.target.value)} /></Field>
          </div>
          <Field label="מספר הקצאה (חשבוניות ישראל)"><Input value={f.allocationNumber} onChange={(e) => set("allocationNumber", e.target.value)} placeholder="נדרש לחשבונית מעל 5,000 ₪" /></Field>
        </Section>

        <Section title="קבלת תשלום" Icon={CreditCard}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="אמצעי תשלום">
              <Select value={f.paymentMethod} onChange={(e) => set("paymentMethod", e.target.value)}>
                {Object.entries(PAYMENT_METHODS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </Select>
            </Field>
            <Field label="תנאי תשלום">
              <Select value={f.paymentTerms} onChange={(e) => set("paymentTerms", e.target.value)}>
                {PAYMENT_TERMS.map((t) => <option key={t.v} value={t.v}>{t.label}</option>)}
              </Select>
            </Field>
          </div>
          <Field label="תאריך תשלום משוער (מחושב)">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
              <CalendarClock size={16} className="text-slate-400" />
              {est ? fmtDate(est) : <span className="text-slate-400">יחושב לפי תאריך החשבונית + התנאי</span>}
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="תאריך הצ'ק / העברה"><Input type="date" value={f.checkTransferDate} onChange={(e) => set("checkTransferDate", e.target.value)} /></Field>
            <Field label="תאריך קבלת תשלום בפועל"><Input type="date" value={f.paymentReceivedDate} onChange={(e) => set("paymentReceivedDate", e.target.value)} /></Field>
          </div>
        </Section>
      </div>

      <div className="flex gap-3 mt-6">
        <PrimaryBtn disabled={!valid} onClick={() => onSave(f)}>{job?.id ? "שמירה" : "הוספה"}</PrimaryBtn>
        <GhostBtn onClick={onClose}>ביטול</GhostBtn>
      </div>
    </Modal>
  );
}

/* ----------------------------- פרטי עבודה + מסמכים + הדפסה ----------------------------- */
function JobDetail({ job, onClose, onEdit, onDelete, onAddDoc, onRemoveDoc, onStatus }) {
  const [confirmDel, setConfirmDel] = useState(false);
  const [busy, setBusy] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [err, setErr] = useState("");
  const st = STATUSES[job.status] || STATUSES.new;
  const est = calcEstPayment(job.invoiceDate, job.paymentTerms);
  const docs = job.docs || [];
  const quoteDocs = docs.filter((d) => d.category === "quote");
  const invoiceDocs = docs.filter((d) => d.category === "invoice");
  const generalDocs = docs.filter((d) => !d.category || d.category === "general");

  const handleFiles = async (fileList, category) => {
    setErr("");
    for (const file of Array.from(fileList)) {
      if (file.size > 4 * 1024 * 1024) { setErr(`"${file.name}" גדול מ-4MB ולא הועלה.`); continue; }
      setBusy(true);
      const dataUrl = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file);
      });
      await onAddDoc(job.id, { id: uid(), name: file.name, type: file.type, size: file.size, category }, dataUrl);
      setBusy(false);
    }
  };

  const doExport = async (mode) => {
    setExporting(true);
    try {
      const enriched = [];
      for (const d of docs) { const url = await store.get("doc:" + d.id); enriched.push({ ...d, url }); }
      const html = renderJobHTML(job, enriched);
      if (mode === "print") {
        const w = window.open("", "_blank");
        if (w) { w.document.write(html); w.document.close(); w.focus(); setTimeout(() => { try { w.print(); } catch {} }, 400); setExporting(false); return; }
      }
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = ("כרטיס_" + (job.clientName || "לקוח") + "_" + (job.title || "עבודה")).replace(/[\\/:*?"<>|\s]+/g, "_") + ".html";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    } catch {}
    setExporting(false);
  };

  return (
    <Modal title="כרטיס עבודה" onClose={onClose} wide>
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
            <p className="text-slate-500">{job.type}</p>
          </div>
          <span className={`text-sm px-3 py-1 rounded-full ${st.chip} shrink-0`}>{st.label}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {STATUS_ORDER.map((s) => (
            <button key={s} onClick={() => onStatus(job, s)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors
                ${job.status === s ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"}`}>
              {STATUSES[s].label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm bg-slate-50 rounded-xl p-4 border border-slate-200">
          <Info Icon={Users} label="לקוח" value={job.clientName} />
          <Info Icon={Phone} label="טלפון" value={job.clientPhone || "—"} />
          <Info Icon={Mail} label="מייל" value={job.clientEmail || "—"} />
          <Info Icon={MapPin} label="כתובת" value={job.address || "—"} />
          <Info Icon={Calendar} label="תאריך" value={fmtDate(job.scheduledDate)} />
          <Info Icon={Banknote} label="מחיר" value={ils(job.price)} />
        </div>

        {job.notes && (
          <Block title="תיאור העבודה">
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{job.notes}</p>
          </Block>
        )}

        <DocSection title="הצעת מחיר" Icon={FileSignature} busy={busy}
          onFiles={(fl) => handleFiles(fl, "quote")} docs={quoteDocs} onRemove={(id) => onRemoveDoc(job.id, id)}>
          <RowFacts items={[["מספר הצעה", job.quoteNumber || "—"], ["תאריך", fmtDate(job.quoteDate)]]} />
        </DocSection>

        <DocSection title="חשבונית" Icon={Receipt} busy={busy}
          onFiles={(fl) => handleFiles(fl, "invoice")} docs={invoiceDocs} onRemove={(id) => onRemoveDoc(job.id, id)}>
          <>
            {Number(job.price) >= ALLOCATION_THRESHOLD && !job.allocationNumber && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-300 rounded-lg p-2.5 text-sm text-amber-800 mb-2">
                <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-600" />
                <span>נדרש מספר הקצאה — החשבונית מעל 5,000 ₪.</span>
              </div>
            )}
            <RowFacts items={[
              ["יצאה חשבונית", job.invoiceIssued ? "כן" : "לא"],
              ["מספר חשבונית", job.invoiceNumber || "—"],
              ["תאריך", fmtDate(job.invoiceDate)],
              ["מספר הקצאה", job.allocationNumber || "—"],
            ]} />
          </>
        </DocSection>

        <Block title="קבלת תשלום" Icon={CreditCard}>
          <RowFacts items={[
            ["אמצעי תשלום", PAYMENT_METHODS[job.paymentMethod] || "—"],
            ["תנאי תשלום", PAYMENT_TERMS.find((t) => t.v === job.paymentTerms)?.label || "—"],
          ]} />
          <RowFacts items={[
            ["תשלום משוער", est ? fmtDate(est) : "—"],
            ["תאריך הצ'ק / העברה", fmtDate(job.checkTransferDate)],
            ["התקבל בפועל", fmtDate(job.paymentReceivedDate)],
          ]} />
        </Block>

        <DocSection title="מסמכים נוספים" Icon={FileText} busy={busy}
          onFiles={(fl) => handleFiles(fl, "general")} docs={generalDocs} onRemove={(id) => onRemoveDoc(job.id, id)} />

        {err && <p className="text-xs text-rose-600">{err}</p>}

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
          <GhostBtn onClick={() => onEdit(job)}><Pencil size={16} /> עריכה</GhostBtn>
          <GhostBtn onClick={() => doExport("print")} disabled={exporting}><Printer size={16} /> הדפסה</GhostBtn>
          <GhostBtn onClick={() => doExport("file")} disabled={exporting}><Download size={16} /> הורדה</GhostBtn>
          <div className="flex-1" />
          {confirmDel ? (
            <div className="flex gap-2 items-center">
              <button onClick={() => onDelete(job)} className="text-sm px-3 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700">אישור מחיקה</button>
              <button onClick={() => setConfirmDel(false)} className="text-sm text-slate-500">ביטול</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDel(true)} className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50">
              <Trash2 size={16} /> מחיקה
            </button>
          )}
        </div>
        {exporting && <p className="text-xs text-slate-400">מכין מסמך…</p>}
      </div>
    </Modal>
  );
}

function RowFacts({ items }) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
      {items.map(([k, v]) => (
        <span key={k} className="text-slate-600"><span className="text-slate-400">{k}: </span><span className="font-medium text-slate-800">{v}</span></span>
      ))}
    </div>
  );
}

function DocSection({ title, Icon, children, onFiles, docs, onRemove, busy }) {
  return (
    <div className="border border-slate-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">{Icon && <Icon size={16} className="text-slate-400" />}{title}</p>
        <label className="flex items-center gap-1.5 text-sm text-cyan-700 hover:text-cyan-800 cursor-pointer">
          <Upload size={16} /> העלאה
          <input type="file" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
        </label>
      </div>
      {children}
      {busy && <p className="text-xs text-slate-400">מעלה…</p>}
      {docs.length > 0 ? (
        <ul className="space-y-2">{docs.map((d) => <DocItem key={d.id} doc={d} onRemove={() => onRemove(d.id)} />)}</ul>
      ) : (
        <p className="text-xs text-slate-400 border border-dashed border-slate-300 rounded-lg py-3 text-center">אין קבצים (עד 4MB לקובץ)</p>
      )}
    </div>
  );
}

function DocItem({ doc, onRemove }) {
  const [url, setUrl] = useState(null);
  useEffect(() => { (async () => setUrl(await store.get("doc:" + doc.id)))(); }, [doc.id]);
  const isImg = doc.type?.startsWith("image/");
  const kb = doc.size ? (doc.size / 1024).toFixed(0) + " KB" : "";
  return (
    <li className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-2.5">
      <div className="h-10 w-10 rounded grid place-items-center bg-slate-100 shrink-0 overflow-hidden">
        {isImg && url ? <img src={url} alt="" className="h-full w-full object-cover" /> : <FileText size={18} className="text-slate-400" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-700 truncate">{doc.name}</p>
        <p className="text-xs text-slate-400">{kb}</p>
      </div>
      {url && <a href={url} download={doc.name} className="p-2 text-slate-400 hover:text-cyan-700"><Download size={16} /></a>}
      <button onClick={onRemove} className="p-2 text-slate-400 hover:text-rose-600"><Trash2 size={16} /></button>
    </li>
  );
}

/* ----------------------------- לקוחות + כרטיס לקוח ----------------------------- */
function ClientDocRow({ doc }) {
  const [url, setUrl] = useState(null);
  useEffect(() => { (async () => setUrl(await store.get("doc:" + doc.id)))(); }, [doc.id]);
  const isImg = doc.type && doc.type.startsWith("image/");
  const cat = doc.category === "quote" ? "הצעת מחיר" : doc.category === "invoice" ? "חשבונית" : "מסמך";
  return (
    <li className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-2.5">
      <div className="h-10 w-10 rounded grid place-items-center bg-slate-100 shrink-0 overflow-hidden">
        {isImg && url ? <img src={url} alt="" className="h-full w-full object-cover" /> : <FileText size={18} className="text-slate-400" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-700 truncate">{doc.name}</p>
        <p className="text-xs text-slate-400 truncate">{cat} · {doc.jobTitle}</p>
      </div>
      {url && <a href={url} download={doc.name} className="p-2 text-slate-400 hover:text-cyan-700"><Download size={16} /></a>}
    </li>
  );
}

function ClientsTab({ clients, jobs, onOpenJob, onNewJob, onNew, onEdit, onDelete }) {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("jobs");
  const [quotes, setQuotes] = useState([]);
  useEffect(() => { (async () => { const data = await store.get("quotes"); setQuotes(data ? JSON.parse(data) : []); })(); }, []);
  const exportQuoteDoc = (qt, mode) => {
    const html = renderQuoteHTML(qt);
    if (mode === "print") { const w = window.open("", "_blank"); if (w) { w.document.write(html); w.document.close(); w.focus(); setTimeout(() => { try { w.print(); } catch {} }, 400); return; } }
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = ("הצעת_מחיר_" + (qt.quoteNumber || "") + "_" + ((qt.client && qt.client.name) || "")).replace(/[\\/:*?"<>|\s]+/g, "_") + ".html";
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  const countFor = (name) => jobs.filter((j) => j.clientName === name).length;

  if (selected) {
    const clientJobs = jobs.filter((j) => j.clientName === selected.name).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    const clientQuotes = quotes.filter((qt) => (qt.client && qt.client.name) === selected.name).sort((a, b) => new Date(b.updatedAt || b.date) - new Date(a.updatedAt || a.date));
    const sum = (arr) => arr.reduce((s, j) => s + (Number(j.price) || 0), 0);
    const active = clientJobs.filter((j) => ["new", "in_progress", "waiting"].includes(j.status)).length;
    const invoiced = sum(clientJobs.filter((j) => j.invoiceIssued));
    const received = sum(clientJobs.filter((j) => j.paymentReceivedDate));
    const open = sum(clientJobs.filter((j) => j.invoiceIssued && !j.paymentReceivedDate));
    const quoted = clientQuotes.reduce((s, qt) => s + quoteTotals(qt).total, 0);

    const events = [];
    clientJobs.forEach((j) => {
      if (j.createdAt) events.push({ d: j.createdAt, dot: "bg-slate-400", text: "נפתחה עבודה: " + j.title });
      if (j.invoiceIssued && j.invoiceDate) events.push({ d: j.invoiceDate, dot: "bg-cyan-600", text: "חשבונית" + (j.invoiceNumber ? " #" + j.invoiceNumber : "") + " — " + j.title, amount: j.price });
      if (j.paymentReceivedDate) events.push({ d: j.paymentReceivedDate, dot: "bg-emerald-500", text: "התקבל תשלום — " + j.title, amount: j.price });
    });
    clientQuotes.forEach((qt) => { if (qt.date) events.push({ d: qt.date, dot: "bg-violet-500", text: "הצעת מחיר #" + qt.quoteNumber, amount: quoteTotals(qt).total }); });
    events.sort((a, b) => new Date(b.d) - new Date(a.d));

    const financeRows = clientJobs.filter((j) => j.invoiceIssued || j.invoiceNumber || j.invoiceDate);
    const allDocs = [];
    clientJobs.forEach((j) => (j.docs || []).forEach((dc) => allDocs.push({ ...dc, jobTitle: j.title })));

    const innerTabs = [
      { id: "jobs", label: "עבודות (" + clientJobs.length + ")" },
      { id: "quotes", label: "הצעות מחיר (" + clientQuotes.length + ")" },
      { id: "finance", label: "כספים" },
      { id: "docs", label: "מסמכים (" + allDocs.length + ")" },
      { id: "timeline", label: "ציר זמן" },
    ];

    return (
      <div className="space-y-4">
        <button onClick={() => { setSelected(null); setTab("jobs"); }} className="text-sm text-cyan-700 flex items-center gap-1 hover:underline">
          <ChevronRight size={16} /> חזרה לרשימת הלקוחות
        </button>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-slate-900">{selected.name}</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mt-1">
                {selected.phone && <span className="flex items-center gap-1"><Phone size={13} />{selected.phone}</span>}
                {selected.email && <span className="flex items-center gap-1"><Mail size={13} />{selected.email}</span>}
                {selected.address && <span className="flex items-center gap-1"><MapPin size={13} />{selected.address}</span>}
              </div>
            </div>
            <button onClick={() => onEdit(selected)} className="p-2 text-slate-400 hover:text-cyan-700 shrink-0"><Pencil size={16} /></button>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <button onClick={() => onNewJob(selected)} className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700"><Plus size={15} /> עבודה חדשה</button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Stat label="עבודות פעילות" value={active + " / " + clientJobs.length} />
          <Stat label="הוצע (הצעות)" value={ils(quoted)} accent="text-slate-700" />
          <Stat label="חויב" value={ils(invoiced)} accent="text-cyan-700" />
          <Stat label="התקבל" value={ils(received)} accent="text-emerald-600" />
          <Stat label="יתרה פתוחה" value={ils(open)} accent="text-violet-600" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {innerTabs.map((it) => (
            <button key={it.id} onClick={() => setTab(it.id)}
              className={`text-sm px-3 py-1.5 rounded-full whitespace-nowrap border shrink-0 ${tab === it.id ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"}`}>
              {it.label}
            </button>
          ))}
        </div>

        {tab === "jobs" ? (
          clientJobs.length === 0 ? <Empty Icon={Briefcase} title="אין עבודות ללקוח זה" body="לחצו על 'עבודה חדשה' כדי להוסיף." />
          : <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"><ul className="divide-y divide-slate-100">{clientJobs.map((j) => <JobRow key={j.id} job={j} onClick={() => onOpenJob(j)} />)}</ul></div>
        ) : tab === "quotes" ? (
          clientQuotes.length === 0 ? <Empty Icon={FileSignature} title="אין הצעות מחיר ללקוח זה" body="ניתן ליצור הצעה בלשונית 'הצעת מחיר'." />
          : <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
              {clientQuotes.map((qt) => (
                <div key={qt.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 truncate">הצעה #{qt.quoteNumber}</p>
                    <p className="text-sm text-slate-500">{fmtDate(qt.date)} · {ils(quoteTotals(qt).total)}</p>
                  </div>
                  <button onClick={() => exportQuoteDoc(qt, "print")} className="p-2 text-slate-400 hover:text-cyan-700"><Printer size={16} /></button>
                  <button onClick={() => exportQuoteDoc(qt, "file")} className="p-2 text-slate-400 hover:text-cyan-700"><Download size={16} /></button>
                </div>
              ))}
            </div>
        ) : tab === "finance" ? (
          financeRows.length === 0 ? <Empty Icon={Receipt} title="אין נתונים כספיים" body="חשבוניות ותשלומים יופיעו כאן לאחר מילוי בעבודות." />
          : <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-slate-500 border-b border-slate-100"><th className="text-right p-3 font-medium">חשבונית</th><th className="text-right p-3 font-medium">תאריך</th><th className="text-right p-3 font-medium">סכום</th><th className="text-right p-3 font-medium">תשלום צפוי</th><th className="text-right p-3 font-medium">סטטוס</th></tr></thead>
                <tbody>
                  {financeRows.map((j) => (
                    <tr key={j.id} className="border-b border-slate-50">
                      <td className="p-3">{j.invoiceNumber || "—"}<div className="text-xs text-slate-400 truncate">{j.title}</div></td>
                      <td className="p-3">{fmtDate(j.invoiceDate)}</td>
                      <td className="p-3">{ils(j.price)}</td>
                      <td className="p-3">{(() => { const e = calcEstPayment(j.invoiceDate, j.paymentTerms); return e ? fmtDate(e) : "—"; })()}</td>
                      <td className="p-3">{j.paymentReceivedDate ? <span className="text-emerald-600">שולם {fmtDate(j.paymentReceivedDate)}</span> : <span className="text-violet-600">פתוח</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        ) : tab === "docs" ? (
          allDocs.length === 0 ? <Empty Icon={FileText} title="אין מסמכים" body="מסמכים שתעלו בעבודות יופיעו כאן מרוכזים." />
          : <ul className="space-y-2">{allDocs.map((dc) => <ClientDocRow key={dc.id} doc={dc} />)}</ul>
        ) : (
          events.length === 0 ? <Empty Icon={Clock} title="אין פעילות עדיין" body="פתיחת עבודה, חשבונית ותשלום יופיעו כאן בציר זמן." />
          : <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <ol className="space-y-4">
                {events.map((ev, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className={`h-3 w-3 rounded-full ${ev.dot} mt-1`} />
                      {i < events.length - 1 && <span className="w-px flex-1 bg-slate-200 mt-1" />}
                    </div>
                    <div className="pb-1">
                      <p className="text-sm text-slate-800">{ev.text}{ev.amount ? " · " + ils(ev.amount) : ""}</p>
                      <p className="text-xs text-slate-400">{fmtDate(ev.d)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
        )}
      </div>
    );
  }

  const list = clients.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">לקוחות</h2>
        <PrimaryBtn onClick={onNew}><Plus size={18} /> לקוח חדש</PrimaryBtn>
      </div>
      <div className="relative">
        <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="הקלידו שם לקוח כדי לראות את העבודות שלו…"
          className="w-full pr-10 pl-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
      </div>
      {clients.length === 0 ? (
        <Empty Icon={Users} title="עוד אין לקוחות" body="הוסיפו לקוחות כדי לבחור אותם במהירות בעת יצירת עבודה ולצפות בכל העבודות שלהם." />
      ) : list.length === 0 ? (
        <Empty Icon={Search} title="אין לקוח בשם הזה" body="נסו שם אחר או הוסיפו לקוח חדש." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {list.map((c) => (
            <div key={c.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:border-cyan-400 transition-colors flex items-start justify-between">
              <button onClick={() => setSelected(c)} className="text-right min-w-0 flex-1">
                <p className="font-semibold text-slate-800">{c.name}</p>
                {c.phone && <p className="text-sm text-slate-500 flex items-center gap-1 mt-1"><Phone size={13} />{c.phone}</p>}
                {c.email && <p className="text-sm text-slate-500 flex items-center gap-1"><Mail size={13} />{c.email}</p>}
                <p className="text-xs text-cyan-700 mt-2">{countFor(c.name)} עבודות · לחצו לצפייה</p>
              </button>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => onEdit(c)} className="p-1.5 text-slate-400 hover:text-cyan-700"><Pencil size={15} /></button>
                <button onClick={() => onDelete(c.id)} className="p-1.5 text-slate-400 hover:text-rose-600"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ClientForm({ client, onSave, onClose }) {
  const [f, setF] = useState(client || { name: "", phone: "", email: "", address: "", notes: "" });
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  return (
    <Modal title={client ? "עריכת לקוח" : "לקוח חדש"} onClose={onClose}>
      <div className="space-y-4">
        <Field label="שם *"><Input value={f.name} onChange={(e) => set("name", e.target.value)} /></Field>
        <Field label="טלפון"><Input value={f.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
        <Field label="כתובת מייל"><Input type="email" value={f.email} onChange={(e) => set("email", e.target.value)} /></Field>
        <Field label="כתובת"><Input value={f.address} onChange={(e) => set("address", e.target.value)} /></Field>
        <Field label="הערות"><Input value={f.notes} onChange={(e) => set("notes", e.target.value)} /></Field>
      </div>
      <div className="flex gap-3 mt-6">
        <PrimaryBtn disabled={!f.name.trim()} onClick={() => onSave(f)}>{client ? "שמירה" : "הוספה"}</PrimaryBtn>
        <GhostBtn onClick={onClose}>ביטול</GhostBtn>
      </div>
    </Modal>
  );
}

/* ----------------------------- הצעות מחיר ----------------------------- */
function QuotesTab({ clients }) {
  const [quotes, setQuotes] = useState([]);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [seq, setSeq] = useState(1000);

  useEffect(() => { (async () => {
    const qs = await store.get("quotes");
    const bz = await store.get("business");
    setQuotes(qs ? JSON.parse(qs) : []);
    setBusiness(mergeBiz(bz ? JSON.parse(bz) : null));
    const sq = await store.get("quoteSeq");
    setSeq(sq ? parseInt(sq) : 1000);
    setLoading(false);
  })(); }, []);

  const saveQuotes = async (next) => { setQuotes(next); await store.set("quotes", JSON.stringify(next)); };
  const maxExisting = () => { const nums = quotes.map((x) => parseInt(x.quoteNumber)).filter((n) => !isNaN(n)); return nums.length ? Math.max(...nums) : 0; };
  const nextNumber = () => String(Math.max(seq, maxExisting()) + 1);

  const onSave = async (q) => {
    await store.set("business", JSON.stringify(q.business)); setBusiness(q.business);
    const now = new Date().toISOString();
    let next, saved;
    if (q.id) { next = quotes.map((x) => x.id === q.id ? { ...q, updatedAt: now } : x); saved = next.find((x) => x.id === q.id); }
    else { saved = { ...q, id: uid(), createdAt: now, updatedAt: now }; next = [saved, ...quotes]; }
    await saveQuotes(next);
    const num = parseInt(saved.quoteNumber);
    if (!isNaN(num) && num > seq) { setSeq(num); await store.set("quoteSeq", String(num)); }
    setEditing(saved); return saved;
  };
  const onDelete = async (id) => { await saveQuotes(quotes.filter((x) => x.id !== id)); };

  if (loading) return <div className="text-center py-20 text-slate-400">טוען…</div>;

  if (editing) {
    const initial = editing === "new"
      ? { quoteNumber: nextNumber(), date: todayISO(), validUntil: addDays(todayISO(), 30),
          business: business, client: { name: "", company: "", phone: "", email: "", address: "" },
          items: [{ id: uid(), desc: "", qty: 1, unitPrice: "" }], vatRate: 18, notes: "תוקף ההצעה: 30 יום. תנאי תשלום: שוטף + 30." }
      : { ...editing, business: editing.business || business };
    return <QuoteBuilder key={editing === "new" ? "new" : editing.id} initial={initial} clients={clients}
      onSave={onSave} onBack={() => setEditing(null)} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">הצעות מחיר</h2>
        <PrimaryBtn onClick={() => setEditing("new")}><Plus size={18} /> הצעה חדשה</PrimaryBtn>
      </div>
      {quotes.length === 0 ? (
        <Empty Icon={FileSignature} title="עוד אין הצעות מחיר"
          body="צרו הצעת מחיר חדשה, מלאו את הפריטים, וייצאו מסמך ממותג עם הלוגו."
          action={<PrimaryBtn onClick={() => setEditing("new")}><Plus size={18} /> הצעה חדשה</PrimaryBtn>} />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {[...quotes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).map((q) => {
              const t = quoteTotals(q);
              return (
                <li key={q.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50">
                  <button onClick={() => setEditing(q)} className="text-right flex-1 min-w-0">
                    <p className="font-medium text-slate-800 truncate">הצעה #{q.quoteNumber} · {q.client?.name || "ללא לקוח"}</p>
                    <p className="text-sm text-slate-500">{fmtDate(q.date)} · {ils(t.total)}</p>
                  </button>
                  <button onClick={() => onDelete(q.id)} className="p-2 text-slate-400 hover:text-rose-600"><Trash2 size={16} /></button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function QuoteBuilder({ initial, clients, onSave, onBack }) {
  const [q, setQ] = useState(initial);
  const [exporting, setExporting] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const t = quoteTotals(q);
  const set = (k, v) => setQ((s) => ({ ...s, [k]: v }));
  const setBiz = (k, v) => setQ((s) => ({ ...s, business: { ...s.business, [k]: v } }));
  const setClient = (k, v) => setQ((s) => ({ ...s, client: { ...s.client, [k]: v } }));
  const setItem = (id, k, v) => setQ((s) => ({ ...s, items: s.items.map((it) => it.id === id ? { ...it, [k]: v } : it) }));
  const addItem = () => setQ((s) => ({ ...s, items: [...s.items, { id: uid(), desc: "", qty: 1, unitPrice: "" }] }));
  const removeItem = (id) => setQ((s) => ({ ...s, items: s.items.filter((it) => it.id !== id) }));

  const doSave = () => { onSave(q); setSavedMsg("נשמר"); setTimeout(() => setSavedMsg(""), 2000); };
  const doExport = async (mode) => {
    setExporting(true);
    const html = renderQuoteHTML(q);
    let opened = false;
    if (mode === "print") {
      const w = window.open("", "_blank");
      if (w) { w.document.write(html); w.document.close(); w.focus(); setTimeout(() => { try { w.print(); } catch {} }, 400); opened = true; }
    }
    if (!opened) {
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
      a.download = ("הצעת_מחיר_" + (q.quoteNumber || "") + "_" + (q.client?.name || "")).replace(/[\\/:*?"<>|\s]+/g, "_") + ".html";
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }
    setExporting(false);
    onSave(q);
  };

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="text-sm text-cyan-700 flex items-center gap-1 hover:underline"><ChevronRight size={16} /> חזרה להצעות</button>

      <Section title="פרטי העסק">
        <div className="grid grid-cols-2 gap-3">
          <Field label="שם העסק"><Input value={q.business.name} onChange={(e) => setBiz("name", e.target.value)} /></Field>
          <Field label="ע.מ. / ח.פ."><Input value={q.business.taxId} onChange={(e) => setBiz("taxId", e.target.value)} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="טלפון"><Input value={q.business.phone} onChange={(e) => setBiz("phone", e.target.value)} /></Field>
          <Field label="מייל"><Input value={q.business.email} onChange={(e) => setBiz("email", e.target.value)} /></Field>
        </div>
        <Field label="כתובת"><Input value={q.business.address} onChange={(e) => setBiz("address", e.target.value)} /></Field>
      </Section>

      <Section title="פרטי ההצעה">
        <div className="grid grid-cols-3 gap-3">
          <Field label="מספר הצעה"><Input value={q.quoteNumber} onChange={(e) => set("quoteNumber", e.target.value)} /></Field>
          <Field label="תאריך"><Input type="date" value={q.date} onChange={(e) => set("date", e.target.value)} /></Field>
          <Field label="בתוקף עד"><Input type="date" value={q.validUntil} onChange={(e) => set("validUntil", e.target.value)} /></Field>
        </div>
      </Section>

      <Section title="פרטי הלקוח">
        <div className="grid grid-cols-2 gap-3">
          <Field label="שם לקוח">
            <Input value={q.client.name} onChange={(e) => setClient("name", e.target.value)} list="quote-clients-dl" />
            <datalist id="quote-clients-dl">{(clients || []).map((c) => <option key={c.id} value={c.name} />)}</datalist>
          </Field>
          <Field label="חברה"><Input value={q.client.company} onChange={(e) => setClient("company", e.target.value)} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="טלפון"><Input value={q.client.phone} onChange={(e) => setClient("phone", e.target.value)} /></Field>
          <Field label="מייל"><Input value={q.client.email} onChange={(e) => setClient("email", e.target.value)} /></Field>
        </div>
        <Field label="כתובת"><Input value={q.client.address} onChange={(e) => setClient("address", e.target.value)} /></Field>
      </Section>

      <Section title="פריטים">
        <div className="space-y-2">
          {q.items.map((it, i) => {
            const line = (Number(it.qty) || 0) * (Number(it.unitPrice) || 0);
            return (
              <div key={it.id} className="border border-slate-200 rounded-lg p-3 relative">
                <button onClick={() => removeItem(it.id)} className="absolute left-2 top-2 p-1 text-slate-300 hover:text-rose-600"><X size={16} /></button>
                <Input value={it.desc} onChange={(e) => setItem(it.id, "desc", e.target.value)} placeholder={`תיאור הפריט / השירות ${i + 1}`} />
                <div className="grid grid-cols-3 gap-2 mt-2 items-end">
                  <Field label="כמות"><Input type="number" value={it.qty} onChange={(e) => setItem(it.id, "qty", e.target.value)} /></Field>
                  <Field label="מחיר יחידה (₪)"><Input type="number" value={it.unitPrice} onChange={(e) => setItem(it.id, "unitPrice", e.target.value)} /></Field>
                  <div className="text-sm text-slate-600 pb-2">סה״כ: <span className="font-semibold text-slate-800">{ils(line)}</span></div>
                </div>
              </div>
            );
          })}
        </div>
        <button onClick={addItem} className="mt-1 text-sm text-cyan-700 hover:text-cyan-800 flex items-center gap-1"><Plus size={16} /> הוספת שורה</button>
      </Section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        <Section title={'מע"מ'}>
          <Field label={'שיעור מע"מ (%)'}><Input type="number" value={q.vatRate} onChange={(e) => set("vatRate", e.target.value)} /></Field>
        </Section>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm space-y-1">
          <div className="flex justify-between"><span className="text-slate-500">סכום ביניים</span><span>{ils(t.sub)}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">מע״מ {q.vatRate || 0}%</span><span>{ils(t.vat)}</span></div>
          <div className="flex justify-between border-t border-slate-300 pt-2 mt-1 text-base font-bold text-cyan-700"><span>סה״כ לתשלום</span><span>{ils(t.total)}</span></div>
        </div>
      </div>

      <Section title="הערות ותנאים">
        <textarea value={q.notes} onChange={(e) => set("notes", e.target.value)} rows={3}
          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="תנאי תשלום, תוקף ההצעה, אחריות, הערות…" />
      </Section>

      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
        <PrimaryBtn onClick={doSave}>שמירה</PrimaryBtn>
        <GhostBtn onClick={() => doExport("print")} disabled={exporting}><Printer size={16} /> הדפסה</GhostBtn>
        <GhostBtn onClick={() => doExport("file")} disabled={exporting}><Download size={16} /> הורדה</GhostBtn>
        {savedMsg && <span className="text-sm text-emerald-600">{savedMsg}</span>}
        {exporting && <span className="text-xs text-slate-400">מכין מסמך…</span>}
      </div>
    </div>
  );
}

/* ----------------------------- רכיבי UI משותפים ----------------------------- */
function Modal({ title, children, onClose, wide }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        className={`bg-white w-full ${wide ? "sm:max-w-2xl" : "sm:max-w-lg"} rounded-t-2xl sm:rounded-2xl shadow-xl max-h-screen overflow-y-auto`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h3 className="font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700"><X size={20} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
const Section = ({ title, Icon, children }) => (
  <div className="space-y-3">
    <p className="text-xs font-bold uppercase tracking-wide text-cyan-700 flex items-center gap-2 border-b border-slate-100 pb-1">
      {Icon && <Icon size={14} />}{title}
    </p>
    {children}
  </div>
);
const Block = ({ title, Icon, children }) => (
  <div className="border border-slate-200 rounded-xl p-4 space-y-2">
    <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">{Icon && <Icon size={16} className="text-slate-400" />}{title}</p>
    {children}
  </div>
);
const Stat = ({ label, value, accent }) => (
  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-center">
    <p className="text-xs text-slate-500">{label}</p>
    <p className={`text-lg font-bold ${accent || "text-slate-800"}`}>{value}</p>
  </div>
);
const Field = ({ label, children }) => (
  <label className="block"><span className="text-sm font-medium text-slate-600 mb-1 block">{label}</span>{children}</label>
);
const Input = (props) => (
  <input {...props} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
);
const Select = (props) => (
  <select {...props} className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
);
const PrimaryBtn = ({ children, ...p }) => (
  <button {...p} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-600 text-white font-medium hover:bg-cyan-700 disabled:opacity-40 disabled:cursor-not-allowed">{children}</button>
);
const GhostBtn = ({ children, ...p }) => (
  <button {...p} className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 disabled:opacity-40">{children}</button>
);
const FilterChip = ({ active, children, ...p }) => (
  <button {...p} className={`text-sm px-3 py-1.5 rounded-full whitespace-nowrap border shrink-0 ${active ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"}`}>{children}</button>
);
const Info = ({ Icon, label, value }) => (
  <div className="flex items-center gap-2 min-w-0"><Icon size={15} className="text-slate-400 shrink-0" />
    <span className="text-slate-400 shrink-0">{label}:</span><span className="text-slate-700 font-medium truncate">{value}</span></div>
);
function Empty({ Icon, title, body, action }) {
  return (
    <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
      <Icon size={40} className="mx-auto text-slate-300" />
      <p className="font-semibold text-slate-700 mt-3">{title}</p>
      <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto px-4">{body}</p>
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}


/* ----------------------------- התחברות + שער כניסה ----------------------------- */
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    setErr(""); setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e) {
      setErr("התחברות נכשלה — בדקי את האימייל והסיסמה ונסי שוב.");
    }
    setBusy(false);
  };
  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 grid place-items-center p-4" style={{ fontFamily: "system-ui, 'Segoe UI', Arial, sans-serif" }}>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 w-full max-w-sm">
        <img src={LOGO} alt="ים רשתות תקשורת" className="w-full h-auto rounded-lg" />
        <h1 className="text-lg font-bold text-center text-slate-800 mt-4 mb-4">התחברות למערכת</h1>
        <div className="space-y-3">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="אימייל"
            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="סיסמה"
            onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          {err && <p className="text-sm text-rose-600">{err}</p>}
          <button onClick={submit} disabled={busy}
            className="w-full py-2.5 rounded-lg bg-cyan-600 text-white font-medium hover:bg-cyan-700 disabled:opacity-50">
            {busy ? "מתחבר…" : "כניסה"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(undefined);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);
  if (user === undefined) return <div dir="rtl" className="min-h-screen grid place-items-center text-slate-400" style={{ fontFamily: "system-ui, sans-serif" }}>טוען…</div>;
  if (!user) return <Login />;
  return <MainApp />;
}
