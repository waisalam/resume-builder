"use client";

import { useRef, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ExperienceItem {
  title: string;
  company: string;
  duration: string;
  description: string;
  bullets?: string[];
}
interface ProjectItem { name: string; description: string; }
interface EducationItem { degree: string; school: string; year: string; }
interface ResumeData {
  name: string; email?: string; phone?: string; location?: string;
  targetRole: string; summary: string; skills: string[];
  experience: ExperienceItem[]; education: EducationItem[]; projects?: ProjectItem[];
}
interface EnhancedData {
  summary: string; skills: string[];
  experience: ExperienceItem[]; projects: ProjectItem[];
}
type SectionKey = "summary" | "skills" | "experience" | "projects";
type SectionStatus = "idle" | "streaming" | "done" | "error";

const SECTION_LABELS: Record<SectionKey, string> = {
  summary: "Professional summary", skills: "Skills",
  experience: "Experience", projects: "Projects",
};
const SECTION_ORDER: SectionKey[] = ["summary", "skills", "experience", "projects"];

const INIT: ResumeData = {
  name: "", email: "", phone: "", location: "", targetRole: "", summary: "",
  skills: [],
  experience: [{ title: "", company: "", duration: "", description: "" }],
  education: [{ degree: "", school: "", year: "" }],
  projects: [{ name: "", description: "" }],
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function ResumeEnhancePage() {
  const [data, setData] = useState<ResumeData>(INIT);
  const [skillsInput, setSkillsInput] = useState("");
  const [status, setStatus] = useState<"idle" | "streaming" | "done" | "error">("idle");
  const [currentSection, setCurrentSection] = useState<SectionKey | null>(null);
  const [sectionStatuses, setSectionStatuses] = useState<Record<SectionKey, SectionStatus>>(
    { summary: "idle", skills: "idle", experience: "idle", projects: "idle" }
  );
  const [streamBuffers, setStreamBuffers] = useState<Record<SectionKey, string>>(
    { summary: "", skills: "", experience: "", projects: "" }
  );
  const [enhanced, setEnhanced] = useState<Partial<EnhancedData>>({});
  const [editPrompt, setEditPrompt] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // ── Field helpers ─────────────────────────────────────────────────────────

  const setField = <K extends keyof ResumeData>(k: K, v: ResumeData[K]) =>
    setData(p => ({ ...p, [k]: v }));

  function handleSkills(v: string) {
    setSkillsInput(v);
    setData(p => ({ ...p, skills: v.split(",").map(s => s.trim()).filter(Boolean) }));
  }

  function updateExp(i: number, f: keyof ExperienceItem, v: string) {
    setData(p => { const n = [...p.experience]; n[i] = { ...n[i], [f]: v }; return { ...p, experience: n }; });
  }
  function addExp() { setData(p => ({ ...p, experience: [...p.experience, { title: "", company: "", duration: "", description: "" }] })); }
  function removeExp(i: number) { setData(p => ({ ...p, experience: p.experience.length > 1 ? p.experience.filter((_, j) => j !== i) : p.experience })); }

  function updateEdu(i: number, f: keyof EducationItem, v: string) {
    setData(p => { const n = [...p.education]; n[i] = { ...n[i], [f]: v }; return { ...p, education: n }; });
  }
  function addEdu() { setData(p => ({ ...p, education: [...p.education, { degree: "", school: "", year: "" }] })); }
  function removeEdu(i: number) { setData(p => ({ ...p, education: p.education.length > 1 ? p.education.filter((_, j) => j !== i) : p.education })); }

  function updateProj(i: number, f: keyof ProjectItem, v: string) {
    setData(p => { const n = [...(p.projects ?? [])]; n[i] = { ...n[i], [f]: v }; return { ...p, projects: n }; });
  }
  function addProj() { setData(p => ({ ...p, projects: [...(p.projects ?? []), { name: "", description: "" }] })); }
  function removeProj(i: number) { setData(p => ({ ...p, projects: (p.projects?.length ?? 0) > 1 ? p.projects?.filter((_, j) => j !== i) : p.projects })); }

  // ── Streaming ─────────────────────────────────────────────────────────────

  async function handleGenerate() {
      console.log("📤 Sending data:", JSON.stringify(data, null, 2));
  console.log("📤 Skills:", data.skills);
  setStatus("streaming");
  setCurrentSection(null);
  setEnhanced({});  // ← this must be first and complete
  setStreamBuffers({ summary: "", skills: "", experience: "", projects: "" });
  setSectionStatuses({
    summary: "idle",
    skills: "idle",
    experience: "idle",
    projects: "idle",
  });

  abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/streamin-api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: abortRef.current.signal,
      });
      if (!res.ok) throw new Error("failed");
      if (!res.body) throw new Error("no body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n"); buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          try { handleEvent(JSON.parse(line)); } catch {}
        }
      }
    } catch (err: unknown) {
      if ((err as Error).name !== "AbortError") setStatus("error");
    }
  }

  function handleEvent(ev: { event: string; key?: SectionKey; text?: string; fullText?: string }) {
    const { key } = ev;
    switch (ev.event) {
      case "section_start": if (key) { setCurrentSection(key); setSectionStatuses(p => ({ ...p, [key]: "streaming" })); } break;
      case "chunk": if (key && ev.text) setStreamBuffers(p => ({ ...p, [key]: p[key] + ev.text })); break;
      case "section_done":
        if (key && ev.fullText) {
          setSectionStatuses(p => ({ ...p, [key]: "done" }));
          parseSection(key, ev.fullText);
        } break;
      case "section_error": if (key) setSectionStatuses(p => ({ ...p, [key]: "error" })); break;
      case "done": setStatus("done"); setCurrentSection(null); break;
    }
  }

  function parseSection(key: SectionKey, fullText: string) {
   const clean = fullText.replace(/```json/g, "").replace(/```/g, "").trim();
  
  if (key === "summary") {
    // ✅ Replace completely, don't spread old data
    setEnhanced(p => ({ ...p, summary: clean }));
  } else if (key === "skills") {
    setEnhanced(p => ({ ...p, skills: clean.split(",").map(s => s.trim()).filter(Boolean) }));
  } else if (key === "experience") {
    try { setEnhanced(p => ({ ...p, experience: JSON.parse(clean) })); } catch {}
  } else if (key === "projects") {
    try { setEnhanced(p => ({ ...p, projects: JSON.parse(clean) })); } catch {}
  }
  }

  function handleStop() { abortRef.current?.abort(); setStatus("idle"); }

  // ── AI edit with prompt ───────────────────────────────────────────────────

  async function handleEditWithAI() {
    if (!editPrompt.trim() || editLoading) return;
    setEditLoading(true);

    // Build the current final resume to send back
    const finalResume = {
      ...data,
      summary: enhanced.summary ?? data.summary,
      skills: enhanced.skills ?? data.skills,
      experience: enhanced.experience ?? data.experience,
      projects: enhanced.projects ?? data.projects,
    };

    try {
      // We call Gemini directly here to apply the user's edit prompt
      const res = await fetch("/api/edut-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: finalResume, prompt: editPrompt }),
      });
      const result = await res.json();
      if (result.summary) setEnhanced(p => ({ ...p, summary: result.summary }));
      if (result.skills) setEnhanced(p => ({ ...p, skills: result.skills }));
      if (result.experience) setEnhanced(p => ({ ...p, experience: result.experience }));
      if (result.projects) setEnhanced(p => ({ ...p, projects: result.projects }));
      setEditPrompt("");
    } catch {}
    setEditLoading(false);
  }

  // ── Section icon ──────────────────────────────────────────────────────────

  function SectionIcon({ sKey }: { sKey: SectionKey }) {
    const s = sectionStatuses[sKey];
    if (s === "done") return <span style={{ color: "#FF7A00", fontSize: 13 }}>✓</span>;
    if (s === "error") return <span style={{ color: "#ff4444", fontSize: 13 }}>✕</span>;
    if (s === "streaming") return <span style={S.spinner} className="spin">◌</span>;
    return <span style={{ color: "#444", fontSize: 13 }}>○</span>;
  }

  // ── Render sections ───────────────────────────────────────────────────────

  function renderSummary() {
    const text = enhanced.summary ?? streamBuffers.summary ?? data.summary;
    if (!text) return <p style={S.placeholder}>Summary will appear here after enhancement…</p>;
    return <p style={S.bodyText}>{text}{sectionStatuses.summary === "streaming" && <span style={S.cursor} />}</p>;
  }

  function renderSkills() {
    const chips = enhanced.skills ?? (streamBuffers.skills ? streamBuffers.skills.split(",").map(s => s.trim()).filter(Boolean) : data.skills);
    if (!chips.length) return <p style={S.placeholder}>Skills will appear here…</p>;
    return (
      <div style={S.chipWrap}>
        {chips.map((s, i) => <span key={i} style={S.chip}>{s}</span>)}
        {sectionStatuses.skills === "streaming" && <span style={S.cursor} />}
      </div>
    );
  }

  function renderExperience() {
    const done = enhanced.experience;
    if (done) return <>{done.map((e, i) => (
      <div key={i} style={S.expItem}>
        <div style={S.expTitle}>{e.title} <span style={{ color: "#FF7A00" }}>·</span> {e.company}</div>
        <div style={S.expMeta}>{e.duration}</div>
        <ul style={S.bulletList}>{(e.bullets ?? [e.description]).map((b, j) => <li key={j} style={S.bullet}>{b}</li>)}</ul>
      </div>
    ))}</>;
    const buf = streamBuffers.experience;
    if (buf) return <pre style={S.streamRaw}>{buf}<span style={S.cursor} /></pre>;
    if (!data.experience[0]?.title) return <p style={S.placeholder}>Experience will appear here…</p>;
    return <>{data.experience.map((e, i) => (
      <div key={i} style={S.expItem}>
        <div style={S.expTitle}>{e.title} <span style={{ color: "#FF7A00" }}>·</span> {e.company}</div>
        <div style={S.expMeta}>{e.duration}</div>
        <div style={S.bodyText}>{e.description}</div>
      </div>
    ))}</>;
  }

  function renderProjects() {
    const done = enhanced.projects;
    if (done) return <>{done.map((p, i) => (
      <div key={i} style={S.expItem}>
        <div style={S.expTitle}>{p.name}</div>
        <div style={S.bodyText}>{p.description}</div>
      </div>
    ))}</>;
    const buf = streamBuffers.projects;
    if (buf) return <pre style={S.streamRaw}>{buf}<span style={S.cursor} /></pre>;
    if (!data.projects?.[0]?.name) return <p style={S.placeholder}>Projects will appear here…</p>;
    return <>{data.projects?.map((p, i) => (
      <div key={i} style={S.expItem}>
        <div style={S.expTitle}>{p.name}</div>
        <div style={S.bodyText}>{p.description}</div>
      </div>
    ))}</>;
  }

  // ── UI ────────────────────────────────────────────────────────────────────

  return (
    <div style={S.page}>
      <style>{`
        *{box-sizing:border-box}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}
        .spin{display:inline-block;animation:spin 1s linear infinite}
        input,textarea{font-family:inherit;transition:border-color .15s}
        input:focus,textarea:focus{outline:none;border-color:#FF7A00 !important;box-shadow:0 0 0 2px rgba(255,122,0,0.12)}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:2px}
      `}</style>

      <div style={S.grid}>

        {/* ── LEFT ── */}
        <div style={S.left}>
          <div style={S.panelHeader}>
            <span style={S.panelTitle}>Resume details</span>
            {status === "streaming" && (
              <span style={S.liveBadge}>
                {[0, 0.2, 0.4].map((d, i) => <span key={i} style={{ ...S.dot, animationDelay: `${d}s` }} />)}
                live
              </span>
            )}
          </div>

          <div style={S.scrollArea}>

            {/* Basic info */}
            <Section title="Basic info">
              <Input placeholder="Full name *" value={data.name} onChange={v => setField("name", v)} />
              <Input placeholder="Target role *" value={data.targetRole} onChange={v => setField("targetRole", v)} />
              <Input placeholder="Email" value={data.email ?? ""} onChange={v => setField("email", v)} />
              <Input placeholder="Phone" value={data.phone ?? ""} onChange={v => setField("phone", v)} />
              <Input placeholder="Location" value={data.location ?? ""} onChange={v => setField("location", v)} />
            </Section>

            {/* Summary */}
            <Section title="Summary *">
              <Textarea placeholder="Write your current summary — AI will enhance it" value={data.summary} onChange={v => setField("summary", v)} rows={3} />
            </Section>

            {/* Skills */}
            <Section title="Skills *">
              <Textarea placeholder="React, TypeScript, Node.js, AWS (comma separated)" value={skillsInput} onChange={handleSkills} rows={2} />
            </Section>

            {/* Experience */}
            <Section title="Experience *" onAdd={addExp}>
              {data.experience.map((e, i) => (
                <GroupCard key={i} onRemove={() => removeExp(i)}>
                  <Input placeholder="Job title" value={e.title} onChange={v => updateExp(i, "title", v)} />
                  <Input placeholder="Company" value={e.company} onChange={v => updateExp(i, "company", v)} />
                  <Input placeholder="Duration e.g. 2021–Present" value={e.duration} onChange={v => updateExp(i, "duration", v)} />
                  <Textarea placeholder="What did you do? AI will rewrite this into bullets" value={e.description} onChange={v => updateExp(i, "description", v)} rows={3} />
                </GroupCard>
              ))}
            </Section>

            {/* Education */}
            <Section title="Education" onAdd={addEdu}>
              {data.education.map((e, i) => (
                <GroupCard key={i} onRemove={() => removeEdu(i)}>
                  <Input placeholder="Degree" value={e.degree} onChange={v => updateEdu(i, "degree", v)} />
                  <Input placeholder="School / University" value={e.school} onChange={v => updateEdu(i, "school", v)} />
                  <Input placeholder="Year" value={e.year} onChange={v => updateEdu(i, "year", v)} />
                </GroupCard>
              ))}
            </Section>

            {/* Projects */}
            <Section title="Projects" onAdd={addProj}>
              {(data.projects ?? []).map((p, i) => (
                <GroupCard key={i} onRemove={() => removeProj(i)}>
                  <Input placeholder="Project name" value={p.name} onChange={v => updateProj(i, "name", v)} />
                  <Textarea placeholder="Description — AI will make this professional" value={p.description} onChange={v => updateProj(i, "description", v)} rows={3} />
                </GroupCard>
              ))}
            </Section>

            {/* AI progress */}
            <Section title="AI progress">
              <div style={{ borderRadius: 8, overflow: "hidden", border: "0.5px solid #222" }}>
                {SECTION_ORDER.map(sKey => (
                  <div key={sKey} style={{
                    ...S.sectionRow,
                    background: currentSection === sKey ? "#1c1c1c" : "transparent",
                    borderLeft: currentSection === sKey ? "2px solid #FF7A00" : "2px solid transparent",
                  }}>
                    <SectionIcon sKey={sKey} />
                    <span style={{ ...S.sectionLabel, color: sectionStatuses[sKey] === "done" ? "#ddd" : sectionStatuses[sKey] === "streaming" ? "#fff" : "#555" }}>
                      {SECTION_LABELS[sKey]}
                    </span>
                    {sectionStatuses[sKey] === "streaming" && <span style={S.streamTag}>enhancing…</span>}
                    {sectionStatuses[sKey] === "done" && <span style={S.doneTag}>done</span>}
                  </div>
                ))}
              </div>
            </Section>

            {/* Edit with AI — shown only after generation */}
            {status === "done" && (
              <Section title="Edit with AI">
                <div style={{ background: "#0f0f0f", borderRadius: 8, padding: 12, border: "0.5px solid #2a2a2a" }}>
                  <p style={{ fontSize: 11, color: "#666", marginBottom: 8, lineHeight: 1.5 }}>
                    Describe any change — AI will update the resume instantly.
                  </p>
                  <Textarea
                    placeholder={`e.g. "Make the summary shorter and more confident"\n"Add Docker and Kubernetes to skills"\n"Rewrite the Stripe experience to focus on performance"`}
                    value={editPrompt}
                    onChange={setEditPrompt}
                    rows={4}
                  />
                  <button
                    style={{ ...S.primaryBtn, opacity: editPrompt.trim() && !editLoading ? 1 : 0.4, cursor: editPrompt.trim() && !editLoading ? "pointer" : "not-allowed", marginTop: 8 }}
                    onClick={handleEditWithAI}
                  >
                    {editLoading
                      ? <><span className="spin" style={{ display: "inline-block" }}>◌</span> Applying changes…</>
                      : <>✦ Apply AI edit</>}
                  </button>
                </div>
              </Section>
            )}

          </div>

          {/* Bottom action */}
          <div style={S.bottomBar}>
            {status === "idle" || status === "error" ? (
              <button style={S.primaryBtn} onClick={handleGenerate}>✦ Enhance with AI</button>
            ) : status === "streaming" ? (
              <button style={S.ghostBtn} onClick={handleStop}>✕ Stop generation</button>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ ...S.primaryBtn, flex: 1 }} onClick={() => alert("Save to DB with prisma.resume.create() — use the `enhanced` state")}>
                  Save resume
                </button>
                <button style={{ ...S.ghostBtn, flex: 1 }} onClick={handleGenerate}>↺ Redo</button>
              </div>
            )}
            {status === "error" && <p style={{ color: "#ff4444", fontSize: 12, marginTop: 8 }}>Something went wrong. Try again.</p>}
          </div>
        </div>

        {/* ── RIGHT: live preview ── */}
        <div style={S.right}>
          <div style={S.panelHeader}>
            <span style={S.panelTitle}>Live preview</span>
            {status === "done" && <span style={S.doneBadge}>✓ AI enhanced</span>}
            {status === "streaming" && <span style={S.liveBadge}>{[0,0.2,0.4].map((d,i)=><span key={i} style={{...S.dot,animationDelay:`${d}s`}}/>)} generating</span>}
          </div>

          <div style={S.preview}>
            <div style={S.resumeCard}>

              {/* Header */}
              <div style={{ paddingBottom: 16, marginBottom: 16, borderBottom: "0.5px solid #242424" }}>
                <div style={S.resumeName}>{data.name || "Your Name"}</div>
                <div style={S.resumeRole}>{data.targetRole || "Target Role"}</div>
                <div style={S.contactRow}>
                  {data.email && <span style={S.contactItem}>✉ {data.email}</span>}
                  {data.phone && <span style={S.contactItem}>✆ {data.phone}</span>}
                  {data.location && <span style={S.contactItem}>⌖ {data.location}</span>}
                </div>
              </div>

              <ResumeSection title="Professional summary" isStreaming={sectionStatuses.summary === "streaming"}>{renderSummary()}</ResumeSection>
              <ResumeSection title="Skills" isStreaming={sectionStatuses.skills === "streaming"}>{renderSkills()}</ResumeSection>
              <ResumeSection title="Experience" isStreaming={sectionStatuses.experience === "streaming"}>{renderExperience()}</ResumeSection>

              {(data.projects?.some(p => p.name)) && (
                <ResumeSection title="Projects" isStreaming={sectionStatuses.projects === "streaming"}>{renderProjects()}</ResumeSection>
              )}

              <ResumeSection title="Education" isStreaming={false}>
                {data.education.map((e, i) => (
                  <div key={i} style={S.expItem}>
                    <div style={S.expTitle}>{e.degree || "Degree"}</div>
                    <div style={S.expMeta}>{e.school || "School"}{e.year ? ` · ${e.year}` : ""}</div>
                  </div>
                ))}
              </ResumeSection>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Small reusable components ─────────────────────────────────────────────────

function Section({ title, children, onAdd }: { title: string; children: React.ReactNode; onAdd?: () => void }) {
  return (
    <div style={{ padding: "14px 16px 4px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 500, color: "#FF7A00", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>{title}</span>
        {onAdd && <button onClick={onAdd} style={{ fontSize: 11, color: "#FF7A00", background: "none", border: "0.5px solid #FF7A0044", borderRadius: 4, padding: "2px 8px", cursor: "pointer" }}>+ Add</button>}
      </div>
      {children}
    </div>
  );
}

function GroupCard({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <div style={{ background: "#0f0f0f", border: "0.5px solid #222", borderRadius: 8, padding: "10px 12px", marginBottom: 8 }}>
      {children}
      <button onClick={onRemove} style={{ fontSize: 11, color: "#666", background: "none", border: "none", cursor: "pointer", padding: 0, marginTop: 2 }}>− Remove</button>
    </div>
  );
}

function Input({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <input placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
      style={{ width: "100%", background: "#0a0a0a", color: "#e8e8e8", border: "0.5px solid #2a2a2a", borderRadius: 6, padding: "8px 10px", fontSize: 13, marginBottom: 8, display: "block" }} />
  );
}

function Textarea({ placeholder, value, onChange, rows }: { placeholder: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} rows={rows ?? 3}
      style={{ width: "100%", background: "#0a0a0a", color: "#e8e8e8", border: "0.5px solid #2a2a2a", borderRadius: 6, padding: "8px 10px", fontSize: 13, marginBottom: 8, display: "block", resize: "vertical" as const, lineHeight: 1.5, fontFamily: "inherit" }} />
  );
}

function ResumeSection({ title, children, isStreaming }: { title: string; children: React.ReactNode; isStreaming: boolean }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: isStreaming ? "#FF7A00" : "#444", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 8, paddingBottom: 5, borderBottom: "0.5px solid #222", display: "flex", alignItems: "center", gap: 6 }}>
        {title}
        {isStreaming && <span style={{ fontSize: 9, color: "#FF7A00", fontWeight: 400, animation: "pulse 1.2s ease-in-out infinite", display: "inline-block" }}>● live</span>}
      </div>
      {children}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const S: Record<string, React.CSSProperties> = {
  page: { fontFamily: "system-ui,sans-serif", background: "#080808", height: "100vh", padding: 20, overflow: "hidden" },
  grid: { display: "grid", gridTemplateColumns: "340px 1fr", maxWidth: 1140, margin: "0 auto", border: "0.5px solid #1e1e1e", borderRadius: 12, overflow: "hidden", height: "100%", alignItems: "stretch" },
  left: { borderRight: "0.5px solid #1e1e1e", display: "flex", flexDirection: "column", background: "#111", height: "100%", overflow: "hidden" },
  right: { display: "flex", flexDirection: "column", background: "#0c0c0c", height: "100%", overflow: "hidden" },
  panelHeader: { padding: "13px 16px", borderBottom: "0.5px solid #1e1e1e", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#141414" },
  panelTitle: { fontSize: 13, fontWeight: 500, color: "#e8e8e8" },
  liveBadge: { display: "flex", alignItems: "center", gap: 3, fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "rgba(255,122,0,0.1)", color: "#FF7A00", border: "0.5px solid rgba(255,122,0,0.3)" },
  dot: { width: 4, height: 4, borderRadius: "50%", background: "#FF7A00", display: "inline-block", animation: "pulse 1.2s ease-in-out infinite" },
  doneBadge: { fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "rgba(255,122,0,0.1)", color: "#FF7A00", border: "0.5px solid rgba(255,122,0,0.3)" },
  scrollArea: { flex: 1, overflowY: "auto" as const, minHeight: 0 },
  bottomBar: { padding: "12px 16px 16px", borderTop: "0.5px solid #1e1e1e", background: "#111" },
  primaryBtn: { width: "100%", padding: "10px 14px", fontSize: 13, fontWeight: 500, border: "none", borderRadius: 8, cursor: "pointer", background: "#FF7A00", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 },
  ghostBtn: { width: "100%", padding: "10px 14px", fontSize: 13, border: "0.5px solid #2a2a2a", borderRadius: 8, cursor: "pointer", background: "none", color: "#888" },
  sectionRow: { display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", transition: "background .15s" },
  sectionLabel: { fontSize: 12, flex: 1 },
  streamTag: { fontSize: 10, color: "#FF7A00", fontStyle: "italic" },
  doneTag: { fontSize: 10, color: "#555" },
  spinner: { fontSize: 13, color: "#FF7A00", display: "inline-block" },
  preview: { flex: 1, padding: 20, overflowY: "auto" as const, minHeight: 0 },
  resumeCard: { background: "#141414", borderRadius: 12, border: "0.5px solid #222", padding: "24px 28px", maxWidth: 620, margin: "0 auto" },
  resumeName: { fontSize: 22, fontWeight: 600, color: "#fff", marginBottom: 2 },
  resumeRole: { fontSize: 13, color: "#FF7A00", fontWeight: 500, marginBottom: 8 },
  contactRow: { display: "flex", gap: 14, flexWrap: "wrap" as const },
  contactItem: { fontSize: 12, color: "#666" },
  bodyText: { fontSize: 13, color: "#bbb", lineHeight: 1.75 },
  placeholder: { fontSize: 13, color: "#333", fontStyle: "italic" },
  chipWrap: { display: "flex", flexWrap: "wrap" as const, gap: 5 },
  chip: { fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "rgba(255,122,0,0.08)", color: "#ffb366", border: "0.5px solid rgba(255,122,0,0.2)" },
  expItem: { marginBottom: 12 },
  expTitle: { fontSize: 13, fontWeight: 500, color: "#e8e8e8" },
  expMeta: { fontSize: 11, color: "#555", marginBottom: 4 },
  bulletList: { paddingLeft: 14, display: "flex", flexDirection: "column" as const, gap: 3 },
  bullet: { fontSize: 12, color: "#aaa", lineHeight: 1.65 },
  streamRaw: { fontSize: 12, color: "#555", whiteSpace: "pre-wrap" as const, fontFamily: "monospace", lineHeight: 1.6, background: "#0a0a0a", border: "0.5px solid #1e1e1e", padding: 10, borderRadius: 6 },
  cursor: { display: "inline-block", width: 2, height: 12, background: "#FF7A00", borderRadius: 1, verticalAlign: "text-bottom", marginLeft: 1, animation: "blink 0.9s step-end infinite" },
};