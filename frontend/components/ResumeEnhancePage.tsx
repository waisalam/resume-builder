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
    setStatus("streaming");
    setCurrentSection(null);
    setEnhanced({});
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

    const finalResume = {
      ...data,
      summary: enhanced.summary ?? data.summary,
      skills: enhanced.skills ?? data.skills,
      experience: enhanced.experience ?? data.experience,
      projects: enhanced.projects ?? data.projects,
    };

    try {
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
    if (s === "done") return <span style={S.sectionIconDone}>✓</span>;
    if (s === "error") return <span style={S.sectionIconError}>✕</span>;
    if (s === "streaming") return <span style={S.spinner} className="spin" />;
    return <span style={S.sectionIconIdle} />;
  }

  // ── Render sections ───────────────────────────────────────────────────────

  function renderSummary() {
    const text = enhanced.summary ?? streamBuffers.summary ?? data.summary;
    if (!text) return <p style={S.placeholder}>Summary will appear here after enhancement…</p>;
    return (
      <p style={S.bodyText}>
        {text}
        {sectionStatuses.summary === "streaming" && <span style={S.cursor} />}
      </p>
    );
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
    if (done) return (
      <>
        {done.map((e, i) => (
          <div key={i} style={S.expItem}>
            <div style={S.expTitle}>{e.title} <span style={S.expDot}>·</span> {e.company}</div>
            <div style={S.expMeta}>{e.duration}</div>
            <ul style={S.bulletList}>{(e.bullets ?? [e.description]).map((b, j) => <li key={j} style={S.bullet}>{b}</li>)}</ul>
          </div>
        ))}
      </>
    );
    const buf = streamBuffers.experience;
    if (buf) return <pre style={S.streamRaw}>{buf}<span style={S.cursor} /></pre>;
    if (!data.experience[0]?.title) return <p style={S.placeholder}>Experience will appear here…</p>;
    return (
      <>
        {data.experience.map((e, i) => (
          <div key={i} style={S.expItem}>
            <div style={S.expTitle}>{e.title} <span style={S.expDot}>·</span> {e.company}</div>
            <div style={S.expMeta}>{e.duration}</div>
            <div style={S.bodyText}>{e.description}</div>
          </div>
        ))}
      </>
    );
  }

  function renderProjects() {
    const done = enhanced.projects;
    if (done) return (
      <>
        {done.map((p, i) => (
          <div key={i} style={S.expItem}>
            <div style={S.expTitle}>{p.name}</div>
            <div style={S.bodyText}>{p.description}</div>
          </div>
        ))}
      </>
    );
    const buf = streamBuffers.projects;
    if (buf) return <pre style={S.streamRaw}>{buf}<span style={S.cursor} /></pre>;
    if (!data.projects?.[0]?.name) return <p style={S.placeholder}>Projects will appear here…</p>;
    return (
      <>
        {data.projects?.map((p, i) => (
          <div key={i} style={S.expItem}>
            <div style={S.expTitle}>{p.name}</div>
            <div style={S.bodyText}>{p.description}</div>
          </div>
        ))}
      </>
    );
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
        input:focus,textarea:focus{outline:none;border-color:#FF7A00 !important;box-shadow:0 0 0 2px rgba(255,122,0,0.15)}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:3px}
        ::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.25)}
        .btn-primary:hover{background:#ff8c33 !important;}
        .btn-ghost:hover{background:rgba(255,255,255,0.06) !important;color:#fff !important;}
        .glass-section {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.5);
          margin-bottom: 12px;
          overflow: hidden;
        }
        .glass-group-card {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border: 0.5px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 8px;
          transition: border-color .2s ease;
        }
        .glass-group-card:hover{border-color:rgba(255,122,0,0.2);}
        .glass-resume-card {
          background: rgba(20,20,20,0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 24px 28px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          transition: border-color .2s, box-shadow .2s;
        }
        .glass-resume-card:hover {
          border-color: rgba(255,255,255,0.12);
        }
        .grid-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          width: 100%;
          max-width: 1400px;
          gap: 16px;
          height: 100dvh;
          padding: 16px;
        }
        @media (max-width: 768px) {
          .grid-container {
            grid-template-columns: 1fr;
            height: auto;
            min-height: 100dvh;
            overflow-y: auto;
          }
          .grid-container .left-panel, .grid-container .right-panel {
            max-height: none;
            height: auto;
            overflow: visible;
          }
        }
        .left-panel, .right-panel {
          display: flex;
          flex-direction: column;
          background: rgba(15,15,15,0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 0.5px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 0 40px rgba(0,0,0,0.4);
        }
        .panel-header {
          padding: 12px 16px;
          border-bottom: 0.5px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255,255,255,0.02);
          font-size: 12px;
          font-weight: 500;
          color: #e8e8e8;
        }
        .scroll-area {
          flex: 1;
          overflow-y: auto;
          min-height: 0;
          padding: 0 0 10px 0;
        }
        .bottom-bar {
          padding: 12px 14px 14px;
          border-top: 0.5px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
        }
        input, textarea {
          background: rgba(10,10,10,0.8);
          color: #e8e8e8;
          border: 0.5px solid rgba(255,255,255,0.08);
          border-radius: 6px;
          padding: 8px 10px;
          font-size: 13px;
          width: 100%;
          display: block;
          margin-bottom: 8px;
          font-family: inherit;
        }
        textarea{
          resize: vertical;
          line-height: 1.5;
        }
      `}</style>

      <div className="grid-container">

        {/* ── LEFT ── */}
        <div className="left-panel">
          <div className="panel-header">
            <span style={S.panelTitle}>Resume details</span>
            {status === "streaming" && (
              <span style={S.liveBadgeSmall}>
                <span style={S.badgeDot} /> live
              </span>
            )}
            {status === "done" && (
              <span style={S.doneBadgeSmall}>✓ enhanced</span>
            )}
          </div>

          <div className="scroll-area">

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
              <div style={S.progressPanel}>
                {SECTION_ORDER.map(sKey => (
                  <div key={sKey} style={{
                    ...S.sectionRow,
                    background: currentSection === sKey ? "rgba(255,255,255,0.04)" : "transparent",
                    borderLeft: currentSection === sKey ? "2px solid #FF7A00" : "2px solid transparent",
                    transition: "all .2s ease",
                  }}>
                    <SectionIcon sKey={sKey} />
                    <span style={{
                      ...S.sectionLabel,
                      color: sectionStatuses[sKey] === "done" ? "#e0e0e0" : sectionStatuses[sKey] === "streaming" ? "#fff" : "#666"
                    }}>
                      {SECTION_LABELS[sKey]}
                    </span>
                    {sectionStatuses[sKey] === "streaming" && <span style={S.streamTag}>enhancing…</span>}
                    {sectionStatuses[sKey] === "done" && <span style={S.doneTagSmall}>done</span>}
                  </div>
                ))}
              </div>
            </Section>

          </div>

          {/* Bottom action */}
          <div className="bottom-bar">
            {status === "idle" || status === "error" ? (
              <button className="btn-primary" style={S.primaryBtn} onClick={handleGenerate}>✦ Enhance with AI</button>
            ) : status === "streaming" ? (
              <button className="btn-ghost" style={S.ghostBtn} onClick={handleStop}>✕ Stop generation</button>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn-primary" style={{ ...S.primaryBtn, flex: 1 }} onClick={() => alert("Save to DB with prisma.resume.create() — use the `enhanced` state")}>
                  Save resume
                </button>
                <button className="btn-ghost" style={{ ...S.ghostBtn, flex: 1 }} onClick={handleGenerate}>↺ Redo</button>
              </div>
            )}
            {status === "error" && <p style={{ color: "#ff4444", fontSize: 12, marginTop: 8 }}>Something went wrong. Try again.</p>}
          </div>
        </div>

        {/* ── RIGHT: live preview / AI prompt input ── */}
        <div className="right-panel">
          <div className="panel-header">
            <span style={S.panelTitle}>Live preview</span>
            {status === "done" && <span style={S.doneBadgeSmall}>✓ AI enhanced</span>}
            {status === "streaming" && <span style={S.liveBadgeSmall}><span style={S.badgeDot} /> generating</span>}
          </div>

          <div className="scroll-area">
            <div className="glass-resume-card">
              {/* Header */}
              <div style={S.resumeHeader}>
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

              {(data.projects?.some(p => p.name) || enhanced.projects?.length) && (
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

            {/* ── AI prompt input (shown after generation) ── */}
            {status === "done" && (
              <div className="glass-section" style={{ marginTop: 16, padding: 16 }}>
                <p style={{ fontSize: 11, color: "#999", marginBottom: 10 }}>
                  Refine further with AI — describe any change you want
                </p>
                <Textarea
                  placeholder={`e.g. "Make the summary more confident"\n"Add Docker and Kubernetes to skills"\n"Rewrite the Stripe experience to focus on performance"`}
                  value={editPrompt}
                  onChange={setEditPrompt}
                  rows={4}
                />
                <button
                  className="btn-primary"
                  style={{
                    ...S.primaryBtn,
                    opacity: editPrompt.trim() && !editLoading ? 1 : 0.4,
                    cursor: editPrompt.trim() && !editLoading ? "pointer" : "not-allowed",
                    marginTop: 10,
                  }}
                  onClick={handleEditWithAI}
                >
                  {editLoading ? (
                    <><span className="spin" style={{ display: "inline-block" }} /> Applying…</>
                  ) : (
                    <>✦ Apply AI edit</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Small reusable components ─────────────────────────────────────────────────

function Section({ title, children, onAdd }: { title: string; children: React.ReactNode; onAdd?: () => void }) {
  return (
    <div className="glass-section" style={{ padding: "0 0 10px 0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px 4px", marginBottom: 4 }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: "#FF7A00", textTransform: "uppercase", letterSpacing: "0.08em" }}>{title}</span>
        {onAdd && (
          <button onClick={onAdd} style={{ fontSize: 11, color: "#FF7A00", background: "none", border: "0.5px solid rgba(255,122,0,0.3)", borderRadius: 4, padding: "2px 8px", cursor: "pointer", transition: "background .15s" }}
            className="btn-ghost">+ Add</button>
        )}
      </div>
      <div style={{ padding: "0 14px" }}>
        {children}
      </div>
    </div>
  );
}

function GroupCard({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <div className="glass-group-card">
      {children}
      <button onClick={onRemove} style={{ fontSize: 11, color: "#666", background: "none", border: "none", cursor: "pointer", padding: 0, marginTop: 2, transition: "color .15s" }}
        onMouseEnter={e => e.currentTarget.style.color = "#aaa"}
        onMouseLeave={e => e.currentTarget.style.color = "#666"}>− Remove</button>
    </div>
  );
}

function Input({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <input placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
      style={{ marginBottom: 8 }} />
  );
}

function Textarea({ placeholder, value, onChange, rows }: { placeholder: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} rows={rows ?? 3}
      style={{ marginBottom: 8 }} />
  );
}

function ResumeSection({ title, children, isStreaming }: { title: string; children: React.ReactNode; isStreaming: boolean }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: isStreaming ? "#FF7A00" : "#666", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, paddingBottom: 5, borderBottom: "0.5px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 6 }}>
        {title}
        {isStreaming && <span style={{ fontSize: 9, color: "#FF7A00", fontWeight: 400, animation: "pulse 1.2s ease-in-out infinite", display: "inline-block" }}>● live</span>}
      </div>
      {children}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const S: Record<string, React.CSSProperties> = {
  page: {
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    background: "radial-gradient(ellipse at top, #1a1a1a 0%, #0a0a0a 70%)",
    minHeight: "100dvh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  panelTitle: {
    fontSize: 12,
    fontWeight: 500,
    color: "#ccc",
  },
  liveBadgeSmall: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: 10,
    padding: "2px 8px",
    borderRadius: 20,
    background: "rgba(255,122,0,0.1)",
    color: "#FF7A00",
    border: "0.5px solid rgba(255,122,0,0.3)",
    fontWeight: 400,
  },
  badgeDot: {
    width: 5,
    height: 5,
    borderRadius: "50%",
    background: "#FF7A00",
    display: "inline-block",
    animation: "pulse 1.2s ease-in-out infinite",
  },
  doneBadgeSmall: {
    fontSize: 10,
    padding: "2px 8px",
    borderRadius: 20,
    background: "rgba(255,122,0,0.1)",
    color: "#FF7A00",
    border: "0.5px solid rgba(255,122,0,0.3)",
  },
  primaryBtn: {
    width: "100%",
    padding: "9px 0",
    fontSize: 12,
    fontWeight: 500,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    background: "#FF7A00",
    color: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    transition: "background .15s",
  },
  ghostBtn: {
    width: "100%",
    padding: "9px 0",
    fontSize: 12,
    border: "0.5px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    cursor: "pointer",
    background: "none",
    color: "#aaa",
    transition: "background .15s, color .15s",
  },
  progressPanel: {
    borderRadius: 8,
    overflow: "hidden",
    border: "0.5px solid rgba(255,255,255,0.06)",
    background: "rgba(255,255,255,0.02)",
  },
  sectionRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "7px 12px",
    transition: "background .15s",
    borderBottom: "0.5px solid rgba(255,255,255,0.04)",
    fontSize: 12,
  },
  sectionLabel: {
    flex: 1,
    fontSize: 11,
    fontWeight: 400,
  },
  sectionIconDone: {
    color: "#FF7A00",
    fontSize: 10,
    fontWeight: 600,
  },
  sectionIconError: {
    color: "#ff4444",
    fontSize: 10,
    fontWeight: 600,
  },
  sectionIconIdle: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#444",
    display: "inline-block",
  },
  spinner: {
    width: 10,
    height: 10,
    border: "1.5px solid #FF7A00",
    borderTopColor: "transparent",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.6s linear infinite",
  },
  streamTag: {
    fontSize: 9,
    color: "#FF7A00",
    fontStyle: "italic",
  },
  doneTagSmall: {
    fontSize: 9,
    color: "#888",
  },
  resumeHeader: {
    paddingBottom: 16,
    marginBottom: 16,
    borderBottom: "0.5px solid rgba(255,255,255,0.08)",
  },
  resumeName: {
    fontSize: 22,
    fontWeight: 600,
    color: "#fff",
    marginBottom: 4,
  },
  resumeRole: {
    fontSize: 13,
    color: "#FF7A00",
    fontWeight: 500,
    marginBottom: 8,
  },
  contactRow: {
    display: "flex",
    gap: 14,
    flexWrap: "wrap" as const,
  },
  contactItem: {
    fontSize: 12,
    color: "#888",
  },
  bodyText: {
    fontSize: 13,
    color: "#bbb",
    lineHeight: 1.75,
  },
  placeholder: {
    fontSize: 13,
    color: "#444",
    fontStyle: "italic",
  },
  chipWrap: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 5,
  },
  chip: {
    fontSize: 11,
    padding: "3px 10px",
    borderRadius: 20,
    background: "rgba(255,122,0,0.08)",
    color: "#ffb366",
    border: "0.5px solid rgba(255,122,0,0.2)",
    transition: "background .15s, border-color .15s",
  },
  expItem: {
    marginBottom: 12,
  },
  expTitle: {
    fontSize: 13,
    fontWeight: 500,
    color: "#e8e8e8",
    marginBottom: 2,
  },
  expDot: {
    color: "#FF7A00",
    margin: "0 4px",
  },
  expMeta: {
    fontSize: 11,
    color: "#666",
    marginBottom: 4,
  },
  bulletList: {
    paddingLeft: 14,
    display: "flex",
    flexDirection: "column" as const,
    gap: 3,
    marginTop: 4,
  },
  bullet: {
    fontSize: 12,
    color: "#aaa",
    lineHeight: 1.65,
  },
  streamRaw: {
    fontSize: 12,
    color: "#555",
    whiteSpace: "pre-wrap" as const,
    fontFamily: "monospace",
    lineHeight: 1.6,
    background: "rgba(0,0,0,0.5)",
    border: "0.5px solid rgba(255,255,255,0.06)",
    padding: 10,
    borderRadius: 6,
  },
  cursor: {
    display: "inline-block",
    width: 2,
    height: 12,
    background: "#FF7A00",
    borderRadius: 1,
    verticalAlign: "text-bottom",
    marginLeft: 1,
    animation: "blink 0.9s step-end infinite",
  },
};