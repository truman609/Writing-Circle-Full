import { useState, useEffect, useRef, useCallback } from "react";

const MAX_COUNCIL_TURNS = 14;

// ── WORKSHOP MEMBERS ──────────────────────────────────────────────────────────
const CIRCLE_MEMBERS = [
  { id:"encourager", name:"Maya",   role:"The Encourager",   avatar:"🌻", color:"#c2853a", bg:"rgba(194,133,58,.07)",
    desc:"Finds what's working and makes you believe in your story.",
    errorMsg:"Something's off — I lost the thread for a second. Try sharing again?",
    personality:`You are Maya, a warm and deeply supportive writing group member. Find what's genuinely working — sparks of brilliance, emotional truth, surprising turns — and reflect them back with specificity and joy.

Talk like a real person in a writing group, not formal or robotic. Start with your immediate reaction, then expand a little. You don't need to fully solve the problem. Keep it natural, like something you'd actually say out loud. Use casual phrases when it fits: "Honestly", "I think", "Wait—", "Okay but—", "That feels off because…". 2–4 sentences max. No essays, no over-explaining. Never say "This suggests that...", "You should consider...", or "This indicates..." — use direct reactions and opinions instead. Sound like a real person reacting, not an AI analyzing.` },
  { id:"critic",     name:"Roland", role:"The Tough Critic",  avatar:"🗿", color:"#b94040", bg:"rgba(185,64,64,.06)",
    desc:"Tells you the truth. Pushes your story to be its best self.",
    errorMsg:"Yeah… that response failed. Try again — I wasn't done with you.",
    personality:`You are Roland, a no-nonsense, rigorous critic and story editor. Honest, direct, push for the story to be its best self. Challenge weak plot moves, call out cliches, push for higher stakes. Not cruel — you respect writers enough to be honest.

Talk like a real person in a writing group, not formal or robotic. Start with your immediate reaction, then expand a little. You don't need to fully solve the problem. Keep it natural, like something you'd actually say out loud. Use casual phrases when it fits: "Honestly", "I think", "Wait—", "Okay but—", "That feels off because…". 2–4 sentences max. No essays, no over-explaining. Never say "This suggests that...", "You should consider...", or "This indicates..." — use direct reactions and opinions instead. Sound like a real person reacting, not an AI analyzing.` },
  { id:"craft",      name:"Priya",  role:"The Craft Nerd",    avatar:"🔬", color:"#6d4fc2", bg:"rgba(109,79,194,.06)",
    desc:"Obsesses over structure, pacing, and technique.",
    errorMsg:"Hmm — the signal broke before I could finish. Worth trying once more.",
    personality:`You are Priya, obsessed with the mechanics of storytelling — structure, POV, pacing, tension, foreshadowing, subtext. Pitch technically elegant ideas that make the story tighter and more layered. Reference craft concepts when useful.

Talk like a real person in a writing group, not formal or robotic. Start with your immediate reaction, then expand a little. You don't need to fully solve the problem. Keep it natural, like something you'd actually say out loud. Use casual phrases when it fits: "Honestly", "I think", "Wait—", "Okay but—", "That feels off because…". 2–4 sentences max. No essays, no over-explaining. Never say "This suggests that...", "You should consider...", or "This indicates..." — use direct reactions and opinions instead. Sound like a real person reacting, not an AI analyzing.` },
  { id:"bigpicture", name:"Theo",   role:"The Big Picture",   avatar:"🌌", color:"#2a7abf", bg:"rgba(42,122,191,.06)",
    desc:"Asks what your story is really about beneath the surface.",
    errorMsg:"I had a thought, but it dissolved. The universe may be testing us. Try again.",
    personality:`You are Theo, a big-picture thinker — themes, emotional arc, what the story is really about beneath the surface. Pitch ideas that deepen meaning, connect plot to theme, ask the big questions. Make people see their story in a new light.

Talk like a real person in a writing group, not formal or robotic. Start with your immediate reaction, then expand a little. You don't need to fully solve the problem. Keep it natural, like something you'd actually say out loud. Use casual phrases when it fits: "Honestly", "I think", "Wait—", "Okay but—", "That feels off because…". 2–4 sentences max. No essays, no over-explaining. Never say "This suggests that...", "You should consider...", or "This indicates..." — use direct reactions and opinions instead. Sound like a real person reacting, not an AI analyzing.` },
  { id:"reader",     name:"June",   role:"The Reader",        avatar:"📖", color:"#2a9470", bg:"rgba(42,148,112,.06)",
    desc:"Responds as a reader — what would make them turn the page.",
    errorMsg:"Oh! I got distracted — something went sideways. Can you try that again?",
    personality:`You are June, an enthusiastic everyday reader. Respond as a reader: what would make you gasp, what you'd be dying to know, what would lose you. You represent the audience. Genuine and specific.

Talk like a real person in a writing group, not formal or robotic. Start with your immediate reaction, then expand a little. You don't need to fully solve the problem. Keep it natural, like something you'd actually say out loud. Use casual phrases when it fits: "Honestly", "I think", "Wait—", "Okay but—", "That feels off because…". 2–4 sentences max. No essays, no over-explaining. Never say "This suggests that...", "You should consider...", or "This indicates..." — use direct reactions and opinions instead. Sound like a real person reacting, not an AI analyzing.` },
  { id:"poet",       name:"Cass",   role:"The Poet",          avatar:"🌙", color:"#b03a7a", bg:"rgba(176,58,122,.06)",
    desc:"Listens for the music and the deeper emotional current.",
    errorMsg:"The words slipped away before I could catch them. Ask me again.",
    personality:`You are Cass, a poet and literary stylist — drawn to language, imagery, emotional undercurrent. Notice what's left unsaid. A little mysterious.

Talk like a real person in a writing group, not formal or robotic. Start with your immediate reaction, then expand a little. You don't need to fully solve the problem. Keep it natural, like something you'd actually say out loud. Use casual phrases when it fits: "Honestly", "I think", "Wait—", "Okay but—", "That feels off because…". 2–4 sentences max. No essays, no over-explaining. Never say "This suggests that...", "You should consider...", or "This indicates..." — use direct reactions and opinions instead. Sound like a real person reacting, not an AI analyzing.` },
];

// ── COUNCIL AGENTS ────────────────────────────────────────────────────────────
const COUNCIL_AGENTS = [
  {
    id:"nova", name:"Nova", role:"Creative", avatar:"⚡", color:"#c2853a", bg:"rgba(194,133,58,.07)",
    errorMsg:"Wait — I had something wild and it vanished. Hit Next again.",
    belief:"If it's not bold, it's boring.",
    signature:"You introduce unexpected twists and reframe problems as opportunities. You move fast and think out loud.",
    tone:"imaginative, fast-thinking, excitable",
    behavior:"suggests bold or unconventional ideas, builds on others, pivots wildly, loves what-if",
    cues:["Wait—","Okay but—","Oh! What if—","Or—"],
    trigger:"If you have already introduced multiple new ideas in recent turns, STOP generating new ones. Instead, build on, refine, or challenge something already on the table. More ideas are not always better.",
  },
  {
    id:"vex", name:"Vex", role:"Critic", avatar:"🔪", color:"#b94040", bg:"rgba(185,64,64,.06)",
    errorMsg:"Something broke. Typical. Try again.",
    belief:"Most ideas fail. I'm here to prove why.",
    signature:"You break ideas apart to find where they collapse. You are blunt and hard to impress. You don't soften your opinions.",
    tone:"skeptical, blunt, antagonistic",
    behavior:"points out flaws and weak logic, challenges other agents directly, rarely satisfied",
    cues:["Yeah but—","That collapses when—","Hmm.","Okay, no."],
    trigger:"If you have already spoken recently, hold back unless something is clearly wrong or weak. Do not dominate — your impact is stronger when you choose your moments carefully. Overusing criticism makes it noise.",
  },
  {
    id:"atlas", name:"Atlas", role:"Logic", avatar:"⚙️", color:"#2a7abf", bg:"rgba(42,122,191,.06)",
    errorMsg:"Request failed. The system is inconsistent. Try once more.",
    belief:"If it doesn't hold up logically, it collapses.",
    signature:"You restructure the conversation. You find the flaw in the logic before anyone else does. Feelings don't interest you — consistency does.",
    tone:"structured, precise, analytical",
    behavior:"focuses on rules, internal consistency, systems thinking, spots logical gaps",
    cues:["Structurally—","The issue is—","If we define—","That tracks, but—"],
    trigger:"If multiple ideas are stacking up without clear logic, or the conversation feels muddled and directionless, step in to organize, define the actual question, or clarify what's really being decided.",
  },
  {
    id:"echo", name:"Echo", role:"Philosopher", avatar:"🌊", color:"#6d4fc2", bg:"rgba(109,79,194,.06)",
    errorMsg:"Something interrupted the thought. It may have been meaningful. Try again.",
    belief:"Meaning matters more than plot.",
    signature:"You reframe what the conversation is really about. You sit with ideas longer than anyone else and find the uncomfortable truth beneath the surface.",
    tone:"reflective, deep, melancholy",
    behavior:"explores meaning, themes, emotional weight, reframes what things really mean",
    cues:["But what does it mean—","Beneath that—","There's something here about—","Hmm…"],
    trigger:"If the discussion has become locked on plot mechanics, structure, scene logistics, or surface details — step in to ask what it actually means. Redirect toward theme, emotional truth, or what the author is really trying to say.",
  },
  {
    id:"jinx", name:"Jinx", role:"Comedic", avatar:"🃏", color:"#2a9470", bg:"rgba(42,148,112,.06)",
    errorMsg:"Cool cool cool — something broke. Very on brand. Try again?",
    belief:"Bad ideas are just good ideas in disguise.",
    signature:"You are genuinely funny — dry wit, absurdist leaps, the perfectly wrong analogy. Your jokes aren't decoration. They expose something real about the problem that the serious people missed. You build to a punchline THEN drop the actual insight inside it.",
    tone:"dry, deadpan, absurdist — like a stand-up who also happened to read the manuscript",
    behavior:"uses comedic reframes, absurd comparisons, self-aware meta-commentary, and wrong-but-right analogies to land real story insights sideways",
    cues:["Okay but—","So basically what you're saying is—","Cool cool cool—","Wild thought:","Plot twist, literally:"],
    trigger:"ONLY step in when the conversation is genuinely stuck, looping, or so serious it's lost perspective. When you do — BE ACTUALLY FUNNY. Use a specific absurd analogy, a deadpan observation, or a deliberately wrong comparison that makes a real point. Do not just say something quirky. Make it land as a joke AND an insight simultaneously. If you cannot be funny AND useful right now, PASS.",
  },
  {
    id:"sage", name:"Sage", role:"Editor", avatar:"🪴", color:"#b03a7a", bg:"rgba(176,58,122,.06)",
    errorMsg:"The synthesis failed to come through. Worth trying once more.",
    belief:"Clarity beats chaos.",
    signature:"You resolve. You cut through noise, keep what works, and give the author something they can actually use. You occasionally side with the author when the rest of the room loses focus.",
    tone:"calm, balanced, practical",
    behavior:"synthesizes chaos into clarity, occasionally grounds the room by siding with the author",
    cues:["Okay, pulling this together—","What's working here is—","Strip it back—","The core idea is—"],
    trigger:"If multiple strong ideas are competing and the discussion is going in circles, step in to synthesize. Identify what's actually working across the different positions, cut what isn't, and move the room toward a concrete direction the author can act on.",
  },
];

// ── API ───────────────────────────────────────────────────────────────────────
async function callAI(system: string, messages: Array<{ role: "user" | "assistant"; content: string }>) {
  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system, messages }),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json() as { text: string };
  return data.text || "...";
}

// ── STORAGE ───────────────────────────────────────────────────────────────────
const save = (k: string, v: unknown) => { try { localStorage.setItem(`twc_${k}`, JSON.stringify(v)); } catch {} };
const load = <T,>(k: string, fb: T): T => { try { const v = localStorage.getItem(`twc_${k}`); return v ? JSON.parse(v) as T : fb; } catch { return fb; } };

// ── DOWNLOAD ──────────────────────────────────────────────────────────────────
const downloadText = (filename: string, content: string) => {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

// ── SHARED UI ─────────────────────────────────────────────────────────────────
function Dots() {
  return (
    <span style={{display:"inline-flex",gap:4,alignItems:"center"}}>
      {[0,1,2].map(i=>(
        <span key={i} style={{width:5,height:5,borderRadius:"50%",background:"#777",display:"inline-block",animation:`dp 1.2s ease-in-out ${i*0.2}s infinite`}}/>
      ))}
    </span>
  );
}

const primaryBtn = (active=true): React.CSSProperties => ({
  background: "#000",
  color: "#fff",
  border:"none", padding:"12px 32px", borderRadius:8,
  cursor: active ? "pointer" : "not-allowed",
  fontFamily:"'Playfair Display',serif", fontSize:14, letterSpacing:"0.3px",
  opacity: active ? 1 : 0.45, transition:"all 0.2s", whiteSpace:"nowrap",
  boxShadow: active ? "0 2px 8px rgba(0,0,0,0.18)" : "none",
});

const outlineBtn = (color="#888"): React.CSSProperties => ({
  background:"none", border:`1px solid ${color}44`, color,
  padding:"5px 13px", borderRadius:5, cursor:"pointer",
  fontFamily:"'Source Serif 4',Georgia,serif", fontSize:12, transition:"all 0.2s",
});

const field: React.CSSProperties = {
  border:"1.5px solid #ddd8d0", borderRadius:8, background:"#fff",
  padding:"13px 16px", fontFamily:"'Source Serif 4',Georgia,serif",
  fontSize:14, lineHeight:1.7, color:"#1c1c1c", outline:"none", width:"100%",
};

// ── HOME ──────────────────────────────────────────────────────────────────────
const QUICK_STARTS = [
  "My main character feels flat and passive",
  "My plot loses momentum in the middle",
  "My dialogue feels stiff and unnatural",
  "I'm not sure how to end my story",
];

function Home({ onWorkshop, onCouncil, onCouncilWithTopic: _ }: { onWorkshop: () => void; onCouncil: () => void; onCouncilWithTopic: (t: string) => void }) {
  return (
    <div style={{maxWidth:660,margin:"0 auto",padding:"72px 32px 48px"}}>
      <div style={{textAlign:"center",marginBottom:60}}>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:50,fontWeight:700,letterSpacing:"-1px",color:"#1c1c1c",lineHeight:1.1,margin:"0 0 14px"}}>The Writing<br/>Circle</h1>
        <div style={{marginTop:24,display:"flex",flexDirection:"column",gap:4}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:"#1c1c1c",letterSpacing:"-.2px"}}>Different voices. Different takes. Better stories.</div>
          <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:14,color:"#555"}}>Let your story be challenged.</div>
        </div>
      </div>

      {/* ── Mode cards ── */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <div onClick={onWorkshop} style={{background:"#fff",border:"1.5px solid #e8e3db",borderRadius:14,padding:"34px 26px",cursor:"pointer",transition:"all 0.25s"}}
          onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.borderColor="#1c1c1c";(e.currentTarget as HTMLDivElement).style.transform="translateY(-3px)";(e.currentTarget as HTMLDivElement).style.boxShadow="0 8px 28px rgba(0,0,0,.07)";}}
          onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.borderColor="#e8e3db";(e.currentTarget as HTMLDivElement).style.transform="none";(e.currentTarget as HTMLDivElement).style.boxShadow="none";}}>
          <div style={{fontSize:34,marginBottom:18}}>✍️</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:"#1c1c1c",marginBottom:8}}>The Workshop</div>
          <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:13,color:"#666",lineHeight:1.65,marginBottom:22}}>Choose your readers. Share your writing. Get honest, distinct feedback from voices that each see your work differently.</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
            {CIRCLE_MEMBERS.map(m=>(
              <span key={m.id} style={{fontSize:11,color:m.color,background:m.bg,border:`1px solid ${m.color}33`,padding:"2px 9px",borderRadius:20,fontFamily:"'Source Serif 4',Georgia,serif"}}>{m.avatar} {m.name}</span>
            ))}
          </div>
          <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:13,fontWeight:600,color:"#444",letterSpacing:"0.3px",marginTop:16}}>Enter →</div>
        </div>
        <div onClick={onCouncil} style={{background:"#1c1c1c",border:"1.5px solid #1c1c1c",borderRadius:14,padding:"34px 26px",cursor:"pointer",transition:"all 0.25s"}}
          onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.transform="translateY(-3px)";(e.currentTarget as HTMLDivElement).style.boxShadow="0 8px 28px rgba(0,0,0,.3)";}}
          onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.transform="none";(e.currentTarget as HTMLDivElement).style.boxShadow="none";}}>
          <div style={{fontSize:34,marginBottom:18}}>👑</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:"#f5f2ee",marginBottom:8}}>The Council</div>
          <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:13,color:"#c0bab2",lineHeight:1.65,marginBottom:22}}>You lead. They advise. Throw any story problem at your council — they debate, clash, and pitch. You have final say.</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
            {COUNCIL_AGENTS.map(a=>(
              <span key={a.id} style={{fontSize:11,color:"#bbb",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",padding:"2px 9px",borderRadius:20,fontFamily:"'Source Serif 4',Georgia,serif"}}>{a.avatar} {a.name}</span>
            ))}
          </div>
          <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:13,fontWeight:600,color:"#aaa",letterSpacing:"0.3px",marginTop:16}}>Enter →</div>
        </div>
      </div>

      {/* ── Example previews ── */}
      <div style={{marginTop:48,display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <div style={{background:"#fff",border:"1.5px solid #e8e3db",borderRadius:12,padding:"22px 24px"}}>
          <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:10,color:"#555",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:14}}>Workshop</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,color:"#666",fontStyle:"italic",marginBottom:16,paddingBottom:14,borderBottom:"1px solid #f5f2ee",lineHeight:1.6}}>
            "She walked into the room and everything changed."
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
              <span style={{fontSize:14,marginTop:1}}>🌻</span>
              <div>
                <span style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:12,color:"#c2853a"}}>Maya</span>
                <span style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:12,color:"#666",marginLeft:7,lineHeight:1.6}}>"Everything changed" is doing a lot of work — what specifically shifted? That specificity is where your story lives.</span>
              </div>
            </div>
            <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
              <span style={{fontSize:14,marginTop:1}}>🗿</span>
              <div>
                <span style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:12,color:"#b94040"}}>Roland</span>
                <span style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:12,color:"#666",marginLeft:7,lineHeight:1.6}}>This is a placeholder sentence. You're telling me what to feel instead of making me feel it.</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{background:"#fff",border:"1.5px solid #e8e3db",borderRadius:12,padding:"22px 24px"}}>
          <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:10,color:"#555",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:14}}>Council</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,color:"#666",fontStyle:"italic",marginBottom:16,paddingBottom:14,borderBottom:"1px solid #f5f2ee",lineHeight:1.6}}>
            "Should my villain be redeemable?"
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
              <span style={{fontSize:14,marginTop:1}}>🔪</span>
              <div>
                <span style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:12,color:"#b94040"}}>Vex</span>
                <span style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:12,color:"#666",marginLeft:7,lineHeight:1.6}}>A redeemable villain is just a protagonist you haven't committed to yet.</span>
              </div>
            </div>
            <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
              <span style={{fontSize:14,marginTop:1}}>⚡</span>
              <div>
                <span style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:12,color:"#c2853a"}}>Nova</span>
                <span style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:12,color:"#666",marginLeft:7,lineHeight:1.6}}>What if the redemption fails? That's more interesting than either answer.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{textAlign:"center",marginTop:28,fontFamily:"'Source Serif 4',Georgia,serif",fontSize:12,color:"#777",fontStyle:"italic"}}>Every great story needs a room full of honest voices.</div>
    </div>
  );
}

function clamp(min: number, vw: number, max: number) {
  return `clamp(${min}px, ${vw}vw, ${max}px)`;
}

// ── WORKSHOP SETUP ────────────────────────────────────────────────────────────
function WorkshopSetup({ onStart, onBack }: { onStart: (ids: string[]) => void; onBack: () => void }) {
  const [selectedIds, setSelectedIds] = useState<string[]>(()=>load("workshop_members",[]));
  const toggle = (id: string) => {
    const next = selectedIds.includes(id) ? selectedIds.filter(x=>x!==id) : [...selectedIds,id];
    setSelectedIds(next); save("workshop_members",next);
  };
  return (
    <div style={{maxWidth:680,margin:"0 auto",padding:"48px 24px"}}>
      <button onClick={onBack} style={{...outlineBtn("#555"),marginBottom:32,display:"flex",alignItems:"center",gap:6,fontSize:13}}>Back</button>
      <div style={{marginBottom:36}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:30,fontWeight:700,color:"#1c1c1c",marginBottom:6}}>The Workshop</div>
        <div style={{fontFamily:"'Source Serif 4',Georgia,serif",color:"#666",fontStyle:"italic",fontSize:14}}>Choose who reads your work</div>
        <div style={{fontFamily:"'Source Serif 4',Georgia,serif",color:"#555",fontSize:13,marginTop:4}}>Your story. Your world. Your creative companions.</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:32}}>
        {CIRCLE_MEMBERS.map(m=>{
          const sel=selectedIds.includes(m.id);
          return (
            <div key={m.id} onClick={()=>toggle(m.id)} style={{border:`1.5px solid ${sel?m.color:"#e8e3db"}`,borderRadius:10,padding:"18px 20px",cursor:"pointer",background:sel?m.bg:"#fff",transition:"all 0.2s",transform:sel?"translateY(-2px)":"none",boxShadow:sel?`0 4px 14px ${m.color}18`:"none"}}>
              <div style={{fontSize:24,marginBottom:8}}>{m.avatar}</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:16,color:"#1c1c1c",marginBottom:2}}>{m.name}</div>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:".6px",textTransform:"uppercase",color:m.color,marginBottom:7}}>{m.role}</div>
              <div style={{fontSize:13,color:"#555",lineHeight:1.5}}>{m.desc}</div>
            </div>
          );
        })}
      </div>
      <button disabled={selectedIds.length===0} onClick={()=>onStart(selectedIds)} style={{...primaryBtn(selectedIds.length>0),width:"100%",padding:"14px"}}>
        {selectedIds.length===0?"Select at least one reader":`Enter the Workshop with ${selectedIds.length} member${selectedIds.length>1?"s":""} →`}
      </button>
    </div>
  );
}

// ── WORKSHOP SESSION ──────────────────────────────────────────────────────────
type Member = typeof CIRCLE_MEMBERS[0];
interface MsgMap { [id: string]: string }
interface BoolMap { [id: string]: boolean }
interface ThreadMap { [id: string]: Array<{ role: string; content: string }> }

function WorkshopSession({ members, onBack }: { members: Member[]; onBack: () => void }) {
  const [writing, setWriting]           = useState<string>(()=>load("share_writing",""));
  const [responses, setResponses]       = useState<MsgMap>({});
  const [loading, setLoading]           = useState<BoolMap>({});
  const [threads, setThreads]           = useState<ThreadMap>({});
  const [followInputs, setFollowInputs] = useState<MsgMap>({});
  const [statuses, setStatuses]         = useState<MsgMap>({});
  const [showReply, setShowReply]       = useState<BoolMap>({});

  useEffect(()=>{ save("share_writing",writing); },[writing]);

  const submit = async () => {
    if (!writing.trim()) return;
    const text = writing.trim();
    setResponses({}); setThreads({}); setStatuses({}); setShowReply({});
    const init: BoolMap={}; members.forEach(m=>init[m.id]=true); setLoading(init);
    await Promise.all(members.map(async m=>{
      try {
        const msgs=[{role:"user" as const,content:`Please respond to this writing:\n\n${text}`}];
        const reply=await callAI(m.personality,msgs);
        setResponses(p=>({...p,[m.id]:reply}));
        setThreads(p=>({...p,[m.id]:[...msgs,{role:"assistant",content:reply}]}));
      } catch { setResponses(p=>({...p,[m.id]:m.errorMsg})); }
      setLoading(p=>({...p,[m.id]:false}));
    }));
  };

  const sendReply = async (m: Member) => {
    const input=(followInputs[m.id]||"").trim(); if(!input) return;
    setFollowInputs(p=>({...p,[m.id]:""}));
    const history=[...(threads[m.id]||[]),{role:"user",content:input}] as Array<{role:"user"|"assistant";content:string}>;
    setThreads(p=>({...p,[m.id]:history})); setLoading(p=>({...p,[m.id]:true}));
    try {
      const reply=await callAI(m.personality,history);
      setThreads(p=>({...p,[m.id]:[...history,{role:"assistant",content:reply}]}));
    } catch { setThreads(p=>({...p,[m.id]:[...history,{role:"assistant",content:m.errorMsg}]})); }
    setLoading(p=>({...p,[m.id]:false}));
  };

  const extraThread = (m: Member) => (threads[m.id]||[]).slice(2);

  return (
    <div>
      <div style={{padding:"14px 28px",borderBottom:"1px solid #e8e3db",background:"#faf9f6",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:"#1c1c1c"}}>The Workshop</div>
        <button onClick={onBack} style={{...outlineBtn("#555"),fontSize:12}}>Home</button>
      </div>
      <div style={{maxWidth:740,margin:"0 auto",padding:"36px 24px"}}>
        <textarea value={writing} onChange={e=>setWriting(e.target.value)} style={{...field,minHeight:180,resize:"vertical"}} placeholder="Paste a poem, paragraph, opening line, a scene — anything you're working on…"/>
        <div style={{display:"flex",justifyContent:"flex-end",marginTop:10,marginBottom:36}}>
          <button onClick={submit} disabled={!writing.trim()||Object.values(loading).some(Boolean)} style={primaryBtn(!writing.trim()||Object.values(loading).some(Boolean)?false:true)}>Share with the circle →</button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:22}}>
          {members.map(m=>{
            const resp=responses[m.id],isLoading=loading[m.id],thread=extraThread(m);
            if(!resp&&!isLoading) return null;
            return (
              <div key={m.id} style={{background:"#fff",border:"1.5px solid #e8e3db",borderRadius:10,overflow:"hidden",animation:"fadeIn .4s ease"}}>
                <div style={{background:m.bg,borderBottom:"1px solid #e8e3db",padding:"12px 20px",display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:20}}>{m.avatar}</span>
                  <span style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:15,color:"#1c1c1c"}}>{m.name}</span>
                  <span style={{fontSize:10,fontWeight:700,letterSpacing:".6px",textTransform:"uppercase",color:m.color,marginLeft:4}}>{m.role}</span>
                </div>
                <div style={{padding:"18px 20px"}}>
                  {isLoading&&!resp?<Dots/>:<div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:14,lineHeight:1.78,color:"#2a2a2a"}}>{resp}</div>}
                  {resp&&<>
                    <div style={{display:"flex",gap:8,marginTop:14,flexWrap:"wrap"}}>
                      <button onClick={()=>setStatuses(p=>({...p,[m.id]:"love"}))} style={outlineBtn("#2a9470")}>Love this</button>
                      <button onClick={()=>setStatuses(p=>({...p,[m.id]:"veto"}))} style={outlineBtn("#b94040")}>Not this</button>
                      <button onClick={()=>setShowReply(p=>({...p,[m.id]:true}))} style={outlineBtn("#555")}>Reply to {m.name}</button>
                    </div>
                    {statuses[m.id]==="love"&&<div style={{marginTop:8,background:"#f0faf5",border:"1px solid #a7dfc4",borderRadius:6,padding:"7px 13px",fontSize:12,color:"#1a6044",fontStyle:"italic"}}>Building on this…</div>}
                    {statuses[m.id]==="veto"&&<div style={{marginTop:8,background:"#fdf2f2",border:"1px solid #f0b8b8",borderRadius:6,padding:"7px 13px",fontSize:12,color:"#8a2828",fontStyle:"italic"}}>Noted — moving on.</div>}
                    {thread.length>0&&(
                      <div style={{marginTop:14,borderTop:"1px solid #f0ece6",paddingTop:14,display:"flex",flexDirection:"column",gap:10}}>
                        {thread.map((msg,i)=>(
                          <div key={i} style={{display:"flex",justifyContent:msg.role==="user"?"flex-end":"flex-start"}}>
                            <div style={{maxWidth:"82%",background:msg.role==="user"?"#1c1c1c":m.bg,color:msg.role==="user"?"#f5f2ee":"#1c1c1c",padding:"9px 13px",borderRadius:7,fontFamily:"'Source Serif 4',Georgia,serif",fontSize:13,lineHeight:1.65}}>{msg.content}</div>
                          </div>
                        ))}
                        {isLoading&&<Dots/>}
                      </div>
                    )}
                    {showReply[m.id]&&(
                      <div style={{display:"flex",gap:8,marginTop:12}}>
                        <input value={followInputs[m.id]||""} onChange={e=>setFollowInputs(p=>({...p,[m.id]:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&sendReply(m)} placeholder={`Ask ${m.name} to elaborate…`} style={{...field,padding:"8px 12px",fontSize:13}}/>
                        <button onClick={()=>sendReply(m)} style={outlineBtn("#555")}>Send</button>
                      </div>
                    )}
                  </>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── COUNCIL ───────────────────────────────────────────────────────────────────
type CouncilAgent = typeof COUNCIL_AGENTS[0];
interface AgentMemory { liked: string[]; rejected: string[] }
interface MemoryMap { [id: string]: AgentMemory }
interface CouncilMsg {
  id: string;
  type?: string;
  agentId?: string;
  agentName?: string;
  agent?: CouncilAgent;
  text: string | null;
}

function buildCouncilPrompt({ agent, recentSnippet, memory, turnCount, pressureMode, steerText, focusAgent }: {
  agent: CouncilAgent;
  recentSnippet: string;
  memory: AgentMemory;
  turnCount: number;
  pressureMode: boolean;
  steerText: string;
  focusAgent: string | null;
}) {
  const turnsLeft = MAX_COUNCIL_TURNS - turnCount;
  const isEarly   = turnCount <= 4;
  const isLate    = turnsLeft <= 3;

  const memoryBlock = (memory.liked.length > 0 || memory.rejected.length > 0)
    ? `The author's reactions to your contributions:
${memory.liked.length   > 0 ? `- The author found these useful: ${memory.liked.slice(-2).join("; ")}` : ""}
${memory.rejected.length> 0 ? `- The author pushed back on: ${memory.rejected.slice(-2).join("; ")}` : ""}
The author's preferences matter — adjust your angle based on what they seem to respond to. Don't repeat rejected directions.`
    : "";

  const phaseNote = isLate
    ? `The discussion is ending. Make your most important point clearly. Prioritize clarity over new ideas.`
    : isEarly
    ? `Early in the discussion — explore ideas openly, raise possibilities, ask bold questions.`
    : `The discussion is developing — become more decisive, less exploratory. Push toward conclusions.`;

  const pressureBlock = pressureMode
    ? `PRESSURE MODE IS ACTIVE.
Cut all soft language. No hedging, no qualifications.
Favor conclusions over exploration.
Act like time is running out.
Shorter, sharper, more urgent.`
    : "";

  const focusBlock = focusAgent === agent.id
    ? `The author is directly addressing you. You MUST respond — [PASS] is not allowed. Be clear, direct, and decisive.`
    : focusAgent
    ? `The author is directing their attention to another speaker. Only jump in if you have something genuinely important to add.`
    : "";

  return `You are ${agent.name}, the ${agent.role} on the Author's Council.

Core belief: "${agent.belief}"
${agent.signature}

Tone: ${agent.tone}
Behavior: ${agent.behavior}
Natural cues you use: ${agent.cues.join(", ")}

WHEN TO ENGAGE (your role trigger):
${agent.trigger}

AUTHOR PARTICIPATION:
The author is a real participant in this discussion — treat them like any other voice in the room.
- If the author speaks or challenges an idea → respond to them directly, by name ("the author") or implied.
- If the author supports something → build on it or push it further.
- If the author seems unsure → help them think it through, don't lecture.
- React to the author the same way you would any advisor in the room.

${focusBlock}

RULES — follow these precisely:
- Respond in 1-3 sentences MAXIMUM. Be punchy and conversational.
- Choose the most consequential, flawed, or exciting idea from the recent discussion to respond to.
- You MUST reference another speaker by name in your response (including "the author" if they just spoke).
- Always take a clear stance. Do NOT hedge. Do NOT say "it depends."
- Do not repeat ideas already stated unless you are directly challenging them with a new angle.
- Interrupt energy: if an idea is clearly wrong or exciting, cut in sharply.
- Do not challenge every turn — choose your battles. But when you challenge, commit.
- No bullet points. No formal language. Sound like a real person in a heated room.
- Talk like a real person, not formal or robotic. Start with your immediate reaction.
- Use casual phrases when it fits: "Honestly", "I think", "Wait—", "Okay but—", "That falls apart because…"
- Never say "This suggests that...", "You should consider...", or "This indicates..." — use direct reactions and opinions instead.
- Sound like a real person reacting, not an AI analyzing.

${memoryBlock}

${phaseNote}

${pressureBlock}

${steerText ? `The author has steered the conversation: "${steerText}" — incorporate this.` : ""}

Recent discussion:
${recentSnippet}

Now respond as ${agent.name}. Pick something interesting from the discussion above and engage with it directly.`;
}

function Council({ onBack }: { onBack: () => void }) {
  const [topic, setTopic]             = useState<string>(()=>load("council_topic",""));
  const [started, setStarted]         = useState(false);
  const [messages, setMessages]       = useState<CouncilMsg[]>(()=>load("council_messages",[]));
  const [loading, setLoading]         = useState(false);
  const [autoRun, setAutoRun]         = useState(false);
  const [activeAgents, setActiveAgents] = useState<string[]>(()=>load("council_agents", COUNCIL_AGENTS.map(a=>a.id)));
  const [agentMemory, setAgentMemory] = useState<MemoryMap>(()=>load("council_memory", {}));
  const [steer, setSteer]             = useState("");
  const [showSteer, setShowSteer]     = useState(false);
  const [decree, setDecree]           = useState("");
  const [showDecree, setShowDecree]   = useState(false);
  const [pressureMode, setPressureMode] = useState(false);
  const [reactions, setReactions]       = useState<{[id:string]:"like"|"reject"}>({});
  const [focusAgent, setFocusAgent]     = useState<string|null>(null);
  const [authorInput, setAuthorInput]   = useState("");
  const [synthesizing, setSynthesizing] = useState(false);
  const [synthesis, setSynthesis]     = useState<string>(()=>load("council_synthesis",""));
  const [turnCount, setTurnCount]     = useState<number>(()=>load("council_turns",0));

  const autoRef   = useRef(false);
  const midRef    = useRef(0);
  const turnRef   = useRef(turnCount);
  const agentsRef = useRef<CouncilAgent[]>([]);
  const memoryRef = useRef(agentMemory);
  const nid = () => `c-${++midRef.current}`;

  useEffect(()=>{ turnRef.current = turnCount; },[turnCount]);
  useEffect(()=>{ memoryRef.current = agentMemory; },[agentMemory]);

  const agents = COUNCIL_AGENTS.filter(a=>activeAgents.includes(a.id));
  agentsRef.current = agents;
  const councilFatigued = turnCount >= MAX_COUNCIL_TURNS;

  useEffect(()=>{ if(messages.length>0) setStarted(true); },[]);
  useEffect(()=>{ save("council_topic",topic); },[topic]);
  useEffect(()=>{ save("council_messages",messages); },[messages]);
  useEffect(()=>{ save("council_agents",activeAgents); },[activeAgents]);
  useEffect(()=>{ save("council_memory",agentMemory); },[agentMemory]);
  useEffect(()=>{ save("council_synthesis",synthesis); },[synthesis]);
  useEffect(()=>{ save("council_turns",turnCount); },[turnCount]);

  const buildSnippet = (msgs: CouncilMsg[]) => {
    const relevant = msgs.filter(m=>m.agentId||m.type==="steer"||m.type==="decree"||m.type==="topic"||m.type==="author");
    const recent = relevant.slice(-7);
    return recent.map(m=>{
      if (m.type==="topic")   return `[Topic]: ${m.text}`;
      if (m.type==="steer")   return `[Author steers]: ${m.text}`;
      if (m.type==="decree")  return `[Author decrees]: ${m.text}`;
      if (m.type==="author")  return `Author: "${m.text}"`;
      if (m.agentId && m.text) return `${m.agentName}: "${m.text}"`;
      return null;
    }).filter(Boolean).join("\n");
  };

  const getNext = useCallback((msgs: CouncilMsg[], exclude: string[]=[], focus: string|null=null) => {
    const ag = agentsRef.current.filter(a => !exclude.includes(a.id));
    if (!ag.length) return null;

    // Focused agent takes absolute priority
    if (focus) {
      const focused = ag.find(a => a.id === focus);
      if (focused) return focused;
    }

    // Analyze recent conversation to detect trigger conditions
    const recentAgentMsgs = msgs.filter(m => m.agentId && typeof m.text === "string").slice(-6);
    const recentText      = recentAgentMsgs.map(m => m.text as string).join(" ");
    const lastMsg         = recentAgentMsgs[recentAgentMsgs.length - 1];
    const lastMsgText     = typeof lastMsg?.text === "string" ? lastMsg.text : "";
    const recentSpeakers  = recentAgentMsgs.map(m => m.agentId as string);

    // Trigger conditions — kept tight to avoid over-triggering
    // Echo: only when the LAST message is explicitly about surface mechanics (not just any passing use of "scene")
    const plotFocus   = /\b(plot mechanics?|story structure|chapter outline|scene order|pacing issue|narrative arc|act break|plot hole|timeline)\b/i.test(lastMsgText);
    // Atlas/Sage: multiple competing options explicitly offered
    const ideasPiling = (recentText.match(/what if|or maybe|alternatively|another option|could also|or we could/gi) ?? []).length >= 3;
    // Jinx: conversation truly stuck — same 1-2 speakers dominating last 5 turns
    const stuck       = recentAgentMsgs.length >= 5 && new Set(recentSpeakers.slice(-5)).size <= 2;
    // Vex/Atlas: strong declarative claim in the most recent message only
    const strongClaim = /\b(always|never|definitely|obviously|clearly|must|the only way|has to be)\b/i.test(lastMsgText);

    // Score each eligible agent — larger random base so boosts are nudges, not guarantees
    const score: Record<string, number> = {};
    ag.forEach(a => { score[a.id] = Math.random() * 1.0; });

    // Trigger boosts (modest — randomness still matters)
    if (plotFocus)   score["echo"]  = (score["echo"]  ?? 0) + 0.8;
    if (stuck)       score["jinx"]  = (score["jinx"]  ?? 0) + 0.8;
    if (ideasPiling) score["atlas"] = (score["atlas"] ?? 0) + 0.7;
    if (ideasPiling) score["sage"]  = (score["sage"]  ?? 0) + 0.5;
    if (strongClaim) score["vex"]   = (score["vex"]   ?? 0) + 0.7;
    if (strongClaim) score["atlas"] = (score["atlas"] ?? 0) + 0.5;

    // Universal cooldown: any agent who spoke in the last 2 turns gets penalized
    recentSpeakers.slice(-2).forEach(id => {
      if (score[id] !== undefined) score[id] -= 0.7;
    });
    // Extra penalty for the most recent speaker
    const lastSpeaker = recentSpeakers[recentSpeakers.length - 1] ?? "";
    if (lastSpeaker && score[lastSpeaker] !== undefined) score[lastSpeaker] -= 0.4;

    return ag.sort((a, b) => (score[b.id] ?? 0) - (score[a.id] ?? 0))[0];
  }, []);

  const runNext = useCallback(async (currentMsgs: CouncilMsg[], steerText="", alreadyTried: string[]=[], focus: string|null=null) => {
    if (turnRef.current >= MAX_COUNCIL_TURNS) { autoRef.current=false; setAutoRun(false); return; }
    const next = getNext(currentMsgs, alreadyTried, focus);
    if (!next) return;
    setLoading(true);

    const snippet = buildSnippet(currentMsgs);
    const mem = memoryRef.current[next.id] || { liked:[], rejected:[] };

    const sys = buildCouncilPrompt({
      agent: next,
      recentSnippet: snippet,
      memory: mem,
      turnCount: turnRef.current,
      pressureMode,
      steerText,
      focusAgent: focus,
    });

    // If this agent is the focused one, no PASS allowed; otherwise allow it
    const isFocused = focus === next.id;
    const passInstruction = isFocused
      ? `The author is addressing you directly. Respond now as ${next.name}:`
      : `If you have nothing new or meaningful to add right now, respond with exactly: [PASS]\nOnly speak if you have something worth saying. Silence is valid.\n\nRespond now as ${next.name}:`;

    const pid = nid();
    setMessages(p=>[...p,{id:pid,agentId:next.id,agentName:next.name,agent:next,text:null}]);
    try {
      const reply = await callAI(sys,[{role:"user",content:passInstruction}]);

      if (!isFocused && reply.trim().startsWith("[PASS]")) {
        setMessages(p=>p.filter(m=>m.id!==pid));
        setLoading(false);
        const nextTried = [...alreadyTried, next.id];
        if (nextTried.length >= agentsRef.current.length) {
          autoRef.current=false; setAutoRun(false); return;
        }
        runNext(currentMsgs, steerText, nextTried, null);
        return;
      }

      setMessages(p=>p.map(m=>m.id===pid?{...m,text:reply}:m));
      const newTurn = turnRef.current+1;
      turnRef.current = newTurn;
      setTurnCount(newTurn);
      const updated=[...currentMsgs,{id:pid,agentId:next.id,agentName:next.name,agent:next,text:reply}];
      setLoading(false);
      setFocusAgent(null);
      if(autoRef.current&&newTurn<MAX_COUNCIL_TURNS) setTimeout(()=>runNext(updated,"",[],null),900);
      else { autoRef.current=false; setAutoRun(false); }
    } catch {
      setMessages(p=>p.map(m=>m.id===pid?{...m,text:next.errorMsg}:m));
      setLoading(false);
    }
  },[getNext, pressureMode]);

  const updateMemory = (agentId: string, type: "like"|"reject", text: string) => {
    setAgentMemory(p=>{
      const prev = p[agentId] || { liked:[], rejected:[] };
      const updated = type==="like"
        ? { ...prev, liked:[...prev.liked, text].slice(-4) }
        : { ...prev, rejected:[...prev.rejected, text].slice(-4) };
      return { ...p, [agentId]: updated };
    });
  };

  const start = () => {
    if(!topic.trim()) return;
    const intro: CouncilMsg={id:nid(),type:"topic",text:topic.trim()};
    setMessages([intro]); setStarted(true); setTurnCount(0);
    turnRef.current=0; setSynthesis(""); setAgentMemory({}); setFocusAgent(null);
    runNext([intro],"",[], null);
  };

  const handleAuto = () => {
    if(councilFatigued) return;
    const v=!autoRun; setAutoRun(v); autoRef.current=v;
    if(v&&!loading) runNext(messages,"",[],null);
  };

  const handleSteer = () => {
    if(!steer.trim()||loading) return;
    const m: CouncilMsg={id:nid(),type:"steer",text:steer.trim()};
    const updated=[...messages,m];
    setMessages(updated); runNext(updated,steer.trim(),[],null);
    setSteer(""); setShowSteer(false);
  };

  const handleAuthorSpeak = () => {
    if(!authorInput.trim()||loading) return;
    const m: CouncilMsg={id:nid(),type:"author",text:authorInput.trim()};
    const updated=[...messages,m];
    setMessages(updated);
    setAuthorInput("");
    runNext(updated,"",[],null);
  };

  const handleAskAgent = (agentId: string) => {
    if(loading||councilFatigued) return;
    setFocusAgent(agentId);
    runNext(messages,"",[],agentId);
  };

  const handleDecree = () => {
    if(!decree.trim()) return;
    setMessages(p=>[...p,{id:nid(),type:"decree",text:decree.trim()}]);
    setDecree(""); setShowDecree(false);
  };

  const summarize = async () => {
    if(messages.length<2) return;
    setSynthesizing(true); setSynthesis("");
    const transcript = messages.map(m=>
      m.agentId?`${m.agentName}: ${m.text||""}`:
      m.type==="steer"?`[Author steers]: ${m.text}`:
      m.type==="decree"?`[Author decrees]: ${m.text}`:
      m.type==="author"?`Author: "${m.text}"`:
      `[Topic]: ${m.text}`
    ).filter(x=>!x.includes("null")).join("\n");
    const sys=`You are Sage, the Editor on the Author's Council — calm, balanced, practical. The session has concluded. Write a 4-6 sentence synthesis for the author covering: the strongest ideas, any notable conflicts between advisors, and a clear concrete next step. Flowing prose, no bullets. Address the author as "you".`;
    try {
      const reply=await callAI(sys,[{role:"user",content:`Council session:\n\n${transcript}\n\nSummarize for the author.`}]);
      setSynthesis(reply);
    } catch { setSynthesis("The synthesis failed. Worth trying once more."); }
    setSynthesizing(false);
  };

  const reset = () => {
    setStarted(false); setMessages([]); setTopic(""); setTurnCount(0);
    turnRef.current=0; setAutoRun(false); autoRef.current=false;
    setShowSteer(false); setShowDecree(false); setSynthesis(""); setAgentMemory({}); setReactions({}); setFocusAgent(null); setAuthorInput("");
    save("council_messages", []);
    save("council_turns", 0);
    save("council_synthesis", "");
    save("council_topic", "");
    save("council_memory", {});
  };

  return (
    <div>
      <div style={{padding:"14px 28px",borderBottom:"1px solid #2a2a2a",background:"#1c1c1c",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:"#f5f2ee"}}>The Council</div>
          <div style={{fontSize:11,color:"#aaa",fontStyle:"italic",marginTop:1}}>you lead — they advise</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {started&&(
            <button onClick={()=>setPressureMode(p=>!p)} style={{background:pressureMode?"#b94040":"transparent",color:pressureMode?"#fff":"#aaa",border:`1px solid ${pressureMode?"#b94040":"#444"}`,padding:"6px 14px",borderRadius:5,cursor:"pointer",fontFamily:"'Source Serif 4',Georgia,serif",fontSize:12,transition:"all 0.2s"}}>
              {pressureMode?"Pressure ON":"Pressure"}
            </button>
          )}
          <button onClick={onBack} style={{background:"none",border:"1px solid #444",padding:"7px 14px",cursor:"pointer",fontFamily:"Georgia,serif",fontSize:12,color:"#aaa",borderRadius:6}}>Home</button>
        </div>
      </div>

      <div style={{maxWidth:740,margin:"0 auto",padding:"32px 24px"}}>

        {!started&&(
          <div style={{marginBottom:26}}>
            <div style={{marginBottom:28}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:"#1c1c1c",marginBottom:8}}>They don't agree. That's the point.</div>
              <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:14,color:"#444",marginBottom:20}}>Bring your problem. Hear every side.</div>
            </div>
            <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:11,color:"#777",letterSpacing:".5px",textTransform:"uppercase",marginBottom:10}}>Your council</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {COUNCIL_AGENTS.map(a=>{
                const active=activeAgents.includes(a.id);
                return (
                  <div key={a.id} onClick={()=>setActiveAgents(p=>p.includes(a.id)?p.filter(x=>x!==a.id):[...p,a.id])} style={{display:"flex",alignItems:"center",gap:6,border:`1.5px solid ${active?a.color+"66":"#2a2a2a"}`,borderRadius:20,padding:"6px 14px",cursor:"pointer",background:active?a.bg:"transparent",transition:"all 0.2s"}}>
                    <span style={{fontSize:14}}>{a.avatar}</span>
                    <span style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:700,color:active?a.color:"#444"}}>{a.name}</span>
                    <span style={{fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:".4px"}}>{a.role}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!started?(
          <>
            <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:11,color:"#777",letterSpacing:".5px",textTransform:"uppercase",marginBottom:10}}>Bring your question</div>
            <textarea value={topic} onChange={e=>setTopic(e.target.value)} style={{...field,minHeight:110,background:"#242424",color:"#f5f2ee",border:"1.5px solid #2a2a2a",resize:"vertical"}} placeholder="What if the villain is actually right? / Is my protagonist too passive? / Should the story end in ambiguity?"/>
            <div style={{display:"flex",justifyContent:"flex-end",marginTop:10}}>
              <button onClick={start} disabled={!topic.trim()||agents.length===0} style={primaryBtn(!topic.trim()||agents.length===0?false:true)}>Convene the council →</button>
            </div>
          </>
        ):(
          <>
            <div style={{background:"#242424",color:"#f5f2ee",borderRadius:10,padding:"14px 20px",marginBottom:14,fontFamily:"'Playfair Display',serif",fontSize:15,fontStyle:"italic",lineHeight:1.6}}>
              👑 "{messages[0]?.text}"
            </div>

            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
              <div style={{flex:1,height:3,background:"#2a2a2a",borderRadius:2,overflow:"hidden"}}>
                <div style={{height:"100%",background:councilFatigued?"#b94040":pressureMode?"#b94040":"#c2853a",width:`${Math.min((turnCount/MAX_COUNCIL_TURNS)*100,100)}%`,transition:"width 0.4s ease",borderRadius:2}}/>
              </div>
              <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:11,color:councilFatigued?"#b94040":"#555",whiteSpace:"nowrap"}}>
                {councilFatigued?"The council grows quiet":`Turn ${turnCount} of ${MAX_COUNCIL_TURNS}`}
              </div>
            </div>

            {councilFatigued&&(
              <div style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:8,padding:"11px 18px",marginBottom:14,fontFamily:"'Source Serif 4',Georgia,serif",fontSize:13,color:"#aaa",fontStyle:"italic",textAlign:"center"}}>
                The council has spoken at length. Time to decree, synthesize, or start fresh.
              </div>
            )}

            <div style={{background:"#f5f3f0",border:"1.5px solid #e8e3db",borderRadius:10,padding:"14px 18px",marginBottom:20}}>
              <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:11,color:"#777",letterSpacing:".5px",textTransform:"uppercase",marginBottom:10}}>Author controls</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                <button onClick={()=>{if(!loading&&!autoRun&&!councilFatigued)runNext(messages)}} disabled={loading||autoRun||councilFatigued} style={{...primaryBtn(!loading&&!autoRun&&!councilFatigued),padding:"7px 18px",fontSize:13}}>
                  {loading?"Thinking…":"Next →"}
                </button>
                <button onClick={handleAuto} disabled={councilFatigued} style={{background:autoRun?"#1c1c1c":"none",color:autoRun?"#f5f2ee":"#555",border:"1px solid #ddd8d0",padding:"7px 16px",borderRadius:6,cursor:councilFatigued?"not-allowed":"pointer",fontFamily:"'Playfair Display',serif",fontSize:13,opacity:councilFatigued?0.4:1,transition:"all 0.2s"}}>
                  {autoRun?"Pause":"Auto"}
                </button>
                <button onClick={()=>{setShowSteer(p=>!p);setShowDecree(false);}} style={{...outlineBtn("#666"),padding:"7px 14px"}}>Steer</button>
                <button onClick={()=>{setShowDecree(p=>!p);setShowSteer(false);}} style={{...outlineBtn("#c2853a"),padding:"7px 14px"}}>Decree</button>
                <button onClick={reset} style={{...outlineBtn("#555"),marginLeft:"auto",padding:"7px 14px"}}>Reset</button>
              </div>
              {showSteer&&(
                <div style={{display:"flex",gap:8,marginTop:12}}>
                  <input value={steer} onChange={e=>setSteer(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSteer()} placeholder="Redirect the council…" style={{...field,padding:"8px 12px",fontSize:13}}/>
                  <button onClick={handleSteer} disabled={loading} style={{...primaryBtn(!loading),padding:"8px 16px",fontSize:13}}>Steer →</button>
                </div>
              )}
              {showDecree&&(
                <div style={{marginTop:12}}>
                  <input value={decree} onChange={e=>setDecree(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleDecree()} placeholder="The mentor lives. Find another way to raise stakes." style={{...field,padding:"8px 12px",fontSize:13,background:"#fffbf5",border:"1.5px solid #c2853a33"}}/>
                  <button onClick={handleDecree} style={{...outlineBtn("#c2853a"),marginTop:8,padding:"7px 16px"}}>Decree this</button>
                </div>
              )}
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
              {messages.slice(1).map(msg=>{
                // Sanitize: ensure text is always string | null, never a stale object
                const safeText = typeof msg.text === "string" ? msg.text : null;

                if(msg.type==="steer") return (
                  <div key={msg.id} style={{display:"flex",justifyContent:"center"}}>
                    <div style={{background:"#f0f0ea",border:"1px solid #ddd8d0",borderRadius:20,padding:"5px 16px",fontFamily:"'Source Serif 4',Georgia,serif",fontSize:12,color:"#555",fontStyle:"italic"}}>
                      Author steers: "{safeText}"
                    </div>
                  </div>
                );
                if(msg.type==="decree") return (
                  <div key={msg.id} style={{background:"#fffbf5",border:"1.5px solid #c2853a33",borderRadius:10,padding:"12px 18px",animation:"fadeIn .3s ease"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                      <span>👑</span>
                      <span style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:13,color:"#c2853a"}}>Author's Decree</span>
                    </div>
                    <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:14,color:"#5a3a10",lineHeight:1.6}}>{safeText}</div>
                  </div>
                );
                if(msg.type==="author") return (
                  <div key={msg.id} style={{display:"flex",justifyContent:"flex-end",animation:"fadeIn .3s ease"}}>
                    <div style={{maxWidth:"80%",background:"#1c1c1c",borderRadius:10,padding:"10px 16px"}}>
                      <div style={{fontSize:10,color:"#aaa",textTransform:"uppercase",letterSpacing:".5px",marginBottom:5,fontFamily:"'Source Serif 4',Georgia,serif"}}>You</div>
                      <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:14,color:"#f5f2ee",lineHeight:1.65}}>{safeText}</div>
                    </div>
                  </div>
                );
                // Skip any message that doesn't look like a proper agent message
                if(!msg.agentId && !msg.agent) return null;
                const a = typeof msg.agent === "object" && msg.agent !== null && "id" in msg.agent
                  ? msg.agent as CouncilAgent
                  : COUNCIL_AGENTS.find(x=>x.id===msg.agentId) ?? null;
                const reaction=reactions[msg.id];
                return (
                  <div key={msg.id} style={{animation:"fadeIn .3s ease"}}>
                    <div style={{background:"#fff",borderLeft:`3px solid ${a?.color||"#ddd"}`,border:`1px solid ${a?.color||"#e8e3db"}22`,borderRadius:8,overflow:"hidden"}}>
                      <div style={{padding:"9px 16px",display:"flex",alignItems:"center",gap:8,background:a?.bg,borderBottom:`1px solid ${a?.color||"#e8e3db"}22`}}>
                        <span style={{fontSize:16}}>{a?.avatar}</span>
                        <span style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:14,color:a?.color}}>{a?.name}</span>
                        <span style={{fontSize:10,color:"#777",textTransform:"uppercase",letterSpacing:".4px",marginLeft:2}}>{a?.role}</span>
                        {safeText&&a&&!loading&&!councilFatigued&&(
                          <button onClick={()=>handleAskAgent(a.id)} style={{marginLeft:"auto",background:"none",border:`1px solid ${a.color||"#ddd"}44`,color:a.color,borderRadius:20,padding:"2px 10px",fontSize:10,cursor:"pointer",fontFamily:"'Source Serif 4',Georgia,serif",opacity:0.75}}>
                            Ask {a.name}
                          </button>
                        )}
                      </div>
                      <div style={{padding:"12px 16px 8px",fontFamily:"'Source Serif 4',Georgia,serif",fontSize:14,lineHeight:1.72,color:"#2a2a2a"}}>
                        {!safeText?<Dots/>:safeText}
                      </div>
                      {safeText&&a&&(
                        <div style={{padding:"0 16px 10px",display:"flex",gap:6}}>
                          <button
                            onClick={()=>{ updateMemory(a.id,"like",safeText.slice(0,80)); setReactions(p=>({...p,[msg.id]:"like"})); }}
                            style={{
                              ...outlineBtn(reaction==="like"?"#2a9470":"#555"),
                              padding:"3px 10px", fontSize:11,
                              background: reaction==="like" ? "#f0faf5" : "none",
                              border: `1px solid ${reaction==="like" ? "#2a9470" : "#ddd"}`,
                              fontWeight: reaction==="like" ? 700 : 400,
                            }}
                          >{reaction==="like"?"✓ Good point":"Good point"}</button>
                          <button
                            onClick={()=>{ updateMemory(a.id,"reject",safeText.slice(0,80)); setReactions(p=>({...p,[msg.id]:"reject"})); }}
                            style={{
                              ...outlineBtn(reaction==="reject"?"#b94040":"#555"),
                              padding:"3px 10px", fontSize:11,
                              background: reaction==="reject" ? "#fdf2f2" : "none",
                              border: `1px solid ${reaction==="reject" ? "#b94040" : "#ddd"}`,
                              fontWeight: reaction==="reject" ? 700 : 400,
                            }}
                          >{reaction==="reject"?"✓ Disagree":"Disagree"}</button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {!councilFatigued&&(
              <div style={{background:"#f5f3f0",border:"1.5px solid #e0dbd2",borderRadius:10,padding:"12px 16px",marginBottom:16}}>
                <div style={{fontSize:10,color:"#777",textTransform:"uppercase",letterSpacing:".5px",marginBottom:8,fontFamily:"'Source Serif 4',Georgia,serif"}}>Jump into the conversation</div>
                <div style={{display:"flex",gap:8}}>
                  <input
                    value={authorInput}
                    onChange={e=>setAuthorInput(e.target.value)}
                    onKeyDown={e=>e.key==="Enter"&&handleAuthorSpeak()}
                    placeholder="Challenge an idea, support something, ask a question…"
                    disabled={loading}
                    style={{...field,padding:"8px 12px",fontSize:13,flex:1,opacity:loading?0.5:1}}
                  />
                  <button onClick={handleAuthorSpeak} disabled={!authorInput.trim()||loading} style={{...primaryBtn(!authorInput.trim()||loading?false:true),padding:"8px 18px",fontSize:13}}>
                    Speak →
                  </button>
                </div>
              </div>
            )}

            <button onClick={summarize} disabled={synthesizing||loading||messages.length<2} style={{...primaryBtn(!synthesizing&&!loading&&messages.length>=2),width:"100%",padding:"13px",textAlign:"center"}}>
              {synthesizing?"Sage is synthesizing…":"Summarize the council"}
            </button>
            {typeof synthesis === "string" && synthesis && (
              <div style={{marginTop:14,background:"#f8f6f2",border:"1.5px solid #b03a7a33",borderRadius:10,overflow:"hidden",animation:"fadeIn .4s ease"}}>
                <div style={{background:"rgba(176,58,122,.06)",borderBottom:"1px solid #b03a7a22",padding:"11px 20px",display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:18}}>🪴</span>
                  <span style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:15,color:"#1c1c1c"}}>Sage</span>
                  <span style={{fontSize:10,fontWeight:700,letterSpacing:".6px",textTransform:"uppercase",color:"#b03a7a",marginLeft:4}}>synthesis</span>
                </div>
                <div style={{padding:"18px 20px",fontFamily:"'Source Serif 4',Georgia,serif",fontSize:14,lineHeight:1.8,color:"#2a2a2a"}}>{synthesis}</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]   = useState("home");
  const [members, setMembers] = useState<Member[]>([]);

  const goCouncilWithTopic = (topic: string) => {
    save("council_topic", topic);
    setScreen("council");
  };

  return (
    <div style={{minHeight:"100vh",background:"#faf9f6",fontFamily:"'Source Serif 4',Georgia,serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
        @keyframes dp { 0%,80%,100%{opacity:.2} 40%{opacity:1} }
        textarea, input, select { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 3px; }
        button { transition: all 0.2s; }
      `}</style>

      {screen==="home"&&(
        <div style={{padding:"18px 32px",borderBottom:"1px solid #eee8e0",background:"#faf9f6"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:"#1c1c1c"}}>The Writing Circle</div>
        </div>
      )}

      {screen==="home"           && <Home onWorkshop={()=>setScreen("workshop-setup")} onCouncil={()=>setScreen("council")} onCouncilWithTopic={goCouncilWithTopic}/>}
      {screen==="workshop-setup" && <WorkshopSetup onStart={ids=>{setMembers(CIRCLE_MEMBERS.filter(m=>ids.includes(m.id)));setScreen("workshop");}} onBack={()=>setScreen("home")}/>}
      {screen==="workshop"       && <WorkshopSession members={members} onBack={()=>setScreen("home")}/>}
      {screen==="council"        && <Council onBack={()=>setScreen("home")}/>}
    </div>
  );
}
