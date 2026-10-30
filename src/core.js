// ---- Scoring core: mirrors Job_Ad_Risk_Scoring.xlsx ----
const FACTORS = [
 {id:"F1",name:"Location",group:"A",tiers:[
  ["Local job with a specific address",0],
  ["Neighbouring East African country, specific city and employer",2],
  ["Other country abroad, specific city and employer",4],
  ["Not stated at all",10,"nm"],
  ["Vague: 'abroad', 'overseas', a country but no city",8],
  ["Gulf (UAE, Qatar, Saudi, Oman, Kuwait, Bahrain): hotel, security, driving",8],
  ["Gulf: domestic work, housemaid, nanny",12],
  ["Russia",12],
  ["Thailand",12],
  ["Thailand + onward/border travel, or Myanmar / Cambodia / Laos",18]]},
 {id:"F2",name:"Salary",group:"C",tiers:[
  ["Within the normal range for the role",0],
  ["Not stated (incl. 'competitive salary')",2,"nm"],
  ["Vague: 'earn up to', 'big money', commission only",6],
  ["1.5–2× the typical pay for the role",5],
  ["2–3× the typical pay for the role",10],
  ["More than 3× the typical pay for the role",15]]},
 {id:"F3",name:"Fees and costs",group:"D",tiers:[
  ["Employer explicitly pays all costs",-3],
  ["No mention of fees",0,"nm"],
  ["Fee paid to an agency on the TaESA / NEA register",10],
  ["Costs repaid from wages",15],
  ["'Small' registration / processing / 'refundable' fee",18,"","crit"],
  ["Fee paid to a personal mobile money number",25,"","crit"],
  ["Several fees, or fees that increase over time",30,"","crit"]]},
 {id:"F4",name:"Visa and immigration",group:"B",tiers:[
  ["Work permit named, employer arranges it",0],
  ["Not mentioned",6,"nm"],
  ["Vague: 'we handle everything'",6],
  ["Travel on a tourist / visit visa, 'convert later'",20,"","crit"],
  ["Told to lie at immigration / say you're a tourist",25,"","crit"]]},
 {id:"F5",name:"Employer identity",group:"A",tiers:[
  ["Named, verifiable website, licensed agency",-5],
  ["Named, well-known or with a verifiable website",0],
  ["Named, but nothing can be verified",5],
  ["Description only: 'a big hotel in Dubai'",9],
  ["No employer mentioned",12,"nm"]]},
 {id:"F6",name:"Contact channel",group:"A",tiers:[
  ["Company email, office phone or official website",0],
  ["Company email plus WhatsApp",2],
  ["Personal contact only: WhatsApp, Telegram, Gmail or a local number",5],
  ["No named contact: 'comment interested', 'DM me', form link only",5,"nm"],
  ["Foreign number that doesn't match the job's country",8],
  ["Telegram only, foreign number",10]]},
 {id:"F7",name:"Job type / duties",group:"A",tiers:[
  ["Clear job title or duties",0],
  ["Vague duties",4],
  ["No duties described at all",8,"nm"],
  ["Domestic work",6],
  ["Customer service, data entry, online marketing, 'typing'",6],
  ["Model, hostess, massage, dancer, 'companion', bar work",12]]},
 {id:"F8",name:"Requirements",group:"A",tiers:[
  ["Relevant skills or education only",0],
  ["Age or gender limits that fit the job",2],
  ["None listed / 'anyone can apply'",2,"nm"],
  ["Young and female only, for a gender-neutral job",6],
  ["Appearance, 'single', full-body photos or measurements",12]]},
 {id:"F9",name:"Documents requested",group:"D",tiers:[
  ["None, or CV only",0,"nm"],
  ["ID copy before any interview",5],
  ["Passport copy plus photos up front",8],
  ["Original passport sent or handed over",15],
  ["Employer keeps your passport",20,"","crit"]]},
 {id:"F10",name:"Contract",group:"C",tiers:[
  ["Written contract before travel / start",0],
  ["Not mentioned",1,"nm"],
  ["'Sign when you arrive'",8],
  ["Verbal agreement only",10]]},
 {id:"F11",name:"Interview",group:"C",tiers:[
  ["Formal interview",0],
  ["Not mentioned, or format not stated",1,"nm"],
  ["Video call",1],
  ["Chat-only",5],
  ["None: 'hired immediately'",8]]},
 {id:"F12",name:"Urgency",group:"D",tiers:[
  ["None",0,"nm"],
  ["A normal application deadline",1],
  ["'Limited slots'",4],
  ["Travel within days",8]]},
 {id:"F13",name:"Targeting of young people",group:"D",tiers:[
  ["Adults with experience / not mentioned",0,"nm"],
  ["Targets school leavers or a narrow young age band",6],
  ["'Students welcome', 'work during holidays abroad'",8],
  ["No minimum age, or accepts under-18s",12],
  ["'No need for parent consent' / 'don't tell your parents'",15,"","crit"]]},
 {id:"F14",name:"How it reached you",group:"D",tiers:[
  ["Company page or job site",0],
  ["Unknown",0,"nm"],
  ["Shared in a general Facebook group",3],
  ["Forwarded by a friend",4],
  ["'A friend who already works there' recruiting you",6],
  ["Unsolicited message from a stranger",10]]},
 {id:"F15",name:"Travel arrangements",group:"B",tiers:[
  ["You book travel; employer reimburses with receipts",0],
  ["Not mentioned",2,"nm"],
  ["Employer books the flight to the destination",2],
  ["'Free flight' with no details",5],
  ["'Our agent will meet you at the airport'",6],
  ["Travel in a group, or with an escort",10],
  ["Land border crossing, onward car journey, night travel",15]]},
 {id:"F16",name:"Accommodation and movement",group:"C",tiers:[
  ["Housing allowance, or you choose where you live",0],
  ["Not mentioned",1,"nm"],
  ["Shared housing, address given",2],
  ["'Everything provided': free housing, food, phone",6],
  ["Live at the workplace or in a 'compound'",10],
  ["Rules about leaving, curfews, 'phones kept for security'",15,"","crit"]]},
 {id:"F17",name:"How salary is paid",group:"C",tiers:[
  ["Monthly, into your own bank / mobile money account",0],
  ["Not mentioned",0,"nm"],
  ["Cash only",5],
  ["Paid to an agent or family member, not you",10],
  ["Withheld for months, or 'paid at end of contract'",15]]},
 {id:"F18",name:"Sponsor or relationship framing",group:"D",tiers:[
  ["None",0,"nm"],
  ["'Mentor' offering career help",4],
  ["Sponsor offers school fees, phone or money",10],
  ["Sponsor wants to meet privately, or wants photos",15,"","crit"]]},
 {id:"F19",name:"Personal data the application asks for",group:"D",tiers:[
  ["Name, phone, CV or education only",0,"nm"],
  ["Form hosted off the company's site (Google Form, shortened link)",3],
  ["Date of birth, ID or passport number before any interview",6],
  ["Full-body photos, marital status, family or next-of-kin details",10],
  ["Mobile money PIN, one-time codes, bank or social media passwords",25,"","crit"]]},
];
// Where the ad was found + who shared it → F14 tier (deterministic, not left to the AI)
const SOURCES = [
 {v:"",label:"Not sure",kind:"unknown"},
 {v:"jobsite",label:"Job site (BrighterMonday, LinkedIn Jobs, Indeed, Ajira Portal)",kind:"official"},
 {v:"company",label:"The company's own website",kind:"official"},
 {v:"fbpage",label:"Facebook page or post",kind:"public"},
 {v:"fbgroup",label:"Facebook group",kind:"public"},
 {v:"igtt",label:"Instagram or TikTok",kind:"public"},
 {v:"whatsapp",label:"WhatsApp (message, group or status)",kind:"message"},
 {v:"telegram",label:"Telegram",kind:"message"},
 {v:"sms",label:"SMS / text message",kind:"message"},
 {v:"email",label:"Email",kind:"message"},
 {v:"poster",label:"Poster, flyer or radio",kind:"public"},
 {v:"inperson",label:"Someone told me in person",kind:"message"},
];
const SHARERS = [
 {v:"",label:"I found it myself"},
 {v:"friend",label:"A friend or relative passed it on"},
 {v:"insider",label:"A friend who says they work there"},
 {v:"stranger",label:"Someone I don't know contacted me"},
 {v:"unsure",label:"Not sure"},
];
function sourceTier(source, sharer){
  if (sharer==="stranger") return 6;
  if (sharer==="insider") return 5;
  if (sharer==="friend") return 4;
  const s = SOURCES.find(x=>x.v===source) || SOURCES[0];
  if (s.kind==="official") return 1;
  if (s.kind==="public") return 3;
  return 2;
}
// Quick questions for after applying: answer value → [factor, tier]
const TAPS = [
 {id:"pay",q:"Have they asked you to pay anything?",opts:[["","No"],["fee","Yes, a fee"],["mm","Yes, to a personal mobile money number"],["many","Yes, more than once"]],map:{fee:["F3",5],mm:["F3",6],many:["F3",7]}},
 {id:"docs",q:"What documents have they asked for?",opts:[["","None, or just a CV"],["id","A copy of my ID"],["pp","Passport copy and photos"],["orig","My original passport"]],map:{id:["F9",2],pp:["F9",3],orig:["F9",4]}},
 {id:"codes",q:"Have they asked for a PIN, a code sent to your phone, or a password?",opts:[["","No"],["yes","Yes"]],map:{yes:["F19",5]}},
 {id:"interview",q:"What was the interview like?",opts:[["","No interview yet"],["formal","Formal, in person"],["video","Video call"],["chat","Chat messages only"],["none","Hired without one"]],map:{formal:["F11",1],video:["F11",3],chat:["F11",4],none:["F11",5]}},
 {id:"visa",q:"Have they told you to travel on a tourist or visit visa?",opts:[["","No"],["yes","Yes"]],map:{yes:["F4",4]}},
 {id:"secret",q:"Have they told you to keep it secret, or not tell your parents?",opts:[["","No"],["yes","Yes"]],map:{yes:["F13",5]}},
 {id:"photos",q:"Have they asked for photos of you, or to meet somewhere private?",opts:[["","No"],["photos","Photos of me"],["meet","To meet in private"]],map:{photos:["F8",5],meet:["F18",4]}},
];
const ptsOf = (fid,t) => { const f=FACTORS.find(x=>x.id===fid); return f.tiers[t-1][1]; };
const SETTINGS = {capC:3, capP:-15, modExp:5, modAddr:-2};
const BANDS = [
 {name:"Lower risk",min:0,key:"low",msg:"No major warning signs found. Still check before paying or travelling."},
 {name:"Caution",min:15,key:"caution",msg:"Some warning signs. Talk to a teacher, Sheha or trusted adult."},
 {name:"High risk",min:35,key:"high",msg:"Several serious warning signs. Do not send money or documents."},
 {name:"Very high risk",min:60,key:"vhigh",msg:"This matches common trafficking patterns. Get help before you reply."},
];
const BONUSES = [
 {id:"B1",name:"Digital / customer-service job in Southeast Asia",pts:10,test:(t,s)=>t.F7===5&&(t.F1===9||t.F1===10)},
 {id:"B2",name:"Domestic work in the Gulf without a licensed agency",pts:8,test:(t,s)=>t.F1===7&&t.F5!==1},
 {id:"B3",name:"Hostess / model / massage job abroad",pts:8,test:(t,s)=>t.F7===6&&s.abroad},
 {id:"B4",name:"Pay over 2× typical + no experience + free flight",pts:6,test:(t,s)=>t.F2>=5&&s.noExp&&t.F15===4},
 {id:"B5",name:"Foreign phone number + no employer named",pts:5,test:(t,s)=>t.F6>=5&&t.F5===5},
 {id:"B6",name:"Targets young people + job abroad + fee",pts:10,test:(t,s)=>t.F13>=2&&s.abroad&&t.F3>=3},
 {id:"B7",name:"Escorted travel + live at workplace",pts:8,test:(t,s)=>t.F15>=6&&t.F16>=5},
 {id:"B9",name:"Well-known company name, but only personal contact details",pts:6,test:(t,s)=>t.F5===2&&(t.F6===3||t.F6>=5)},
 {id:"B8",name:"Sponsor offering money or a meeting + targets young people",pts:6,test:(t,s)=>t.F18>=3&&t.F13>=2},
];
const nmTier = f => f.tiers.findIndex(x=>x[2]==="nm")+1;

// ---- Weights: a sparse set of changes from the baseline. null/{} = baseline. ----
// {mult:{F2:0.5}, tier:{"F1.9":15}, bands:{caution,high,vhigh}, bonus:{B1:8}, set:{capC,capP,modExp,modAddr}}
const r1 = n => Math.round(n*10)/10;
function tierPts(fid, t, W){
  const f = FACTORS.find(x=>x.id===fid); const base = f.tiers[t-1][1];
  if (!W) return base;
  const k = fid+"."+t;
  const v = (W.tier && W.tier[k]!=null) ? W.tier[k] : base;
  const m = (W.mult && W.mult[fid]!=null) ? W.mult[fid] : 1;
  return r1(v*m);
}
function bandMins(W){
  const b = (W && W.bands) || {};
  return {caution: b.caution!=null?b.caution:BANDS[1].min, high: b.high!=null?b.high:BANDS[2].min, vhigh: b.vhigh!=null?b.vhigh:BANDS[3].min};
}
function setting(W, k){ return (W && W.set && W.set[k]!=null) ? W.set[k] : SETTINGS[k]; }
function bonusOf(W, b){ return (W && W.bonus && W.bonus[b.id]!=null) ? W.bonus[b.id] : b.pts; }

function scoreAd(s, W){
  const t = {};
  FACTORS.forEach(f=>{ const v = Number(s.tiers && s.tiers[f.id]); t[f.id] = (v>=1 && v<=f.tiers.length) ? v : nmTier(f); });
  const rows = FACTORS.map(f=>{
    const tier = f.tiers[t[f.id]-1];
    const pts = (f.group==="B" && !s.abroad) ? 0 : tierPts(f.id, t[f.id], W);
    return {f, tier:t[f.id], desc:tier[0], pts, nm:tier[2]==="nm", crit:tier[3]==="crit"};
  });
  const factorPts = r1(rows.reduce((a,r)=>a+r.pts,0));
  const modExp = s.noExp ? setting(W,"modExp") : 0;
  const modAddr = (s.address && [3,6,7,8,9].includes(t.F1)) ? setting(W,"modAddr") : 0;
  const cNM = rows.filter(r=>r.f.group==="C"&&r.nm).reduce((a,r)=>a+r.pts,0);
  const capAdj = r1(-Math.max(0, cNM - setting(W,"capC")));
  const prot = rows.filter(r=>r.pts<0).reduce((a,r)=>a+r.pts,0) + modAddr;
  const protAdj = r1(Math.max(prot, setting(W,"capP")) - prot);
  const bonuses = BONUSES.filter(b=>b.test(t,s)).map(b=>({...b, pts:bonusOf(W,b)})).filter(b=>b.pts!==0);
  const bonusPts = bonuses.reduce((a,b)=>a+b.pts,0);
  const total = r1(Math.max(0, factorPts+modExp+modAddr+capAdj+protAdj+bonusPts));
  const critical = rows.filter(r=>r.crit);
  const mins = bandMins(W);
  let band = BANDS[0];
  if (total>=mins.caution) band = BANDS[1];
  if (total>=mins.high) band = BANDS[2];
  if (total>=mins.vhigh) band = BANDS[3];
  if (critical.length) band = BANDS[3];
  return {tiers:t, rows, factorPts, modExp, modAddr, capAdj, protAdj, bonuses, bonusPts, total, critical, band};
}
// Effective tiers: tester's manual picks win; otherwise the higher-risk of the AI's tier and a quick-question answer; F14 from the source selectors.
function effectiveTiers(st){
  const t = {};
  FACTORS.forEach(f=>{
    let v = (st.base && st.base[f.id]) || nmTier(f);
    if (f.id==="F14" && (st.source || st.sharer)) v = sourceTier(st.source, st.sharer);
    TAPS.forEach(q=>{ const m = q.map[(st.taps||{})[q.id]]; if (m && m[0]===f.id && ptsOf(f.id,m[1]) > ptsOf(f.id,v)) v = m[1]; });
    if (st.overrides && st.overrides[f.id]) v = st.overrides[f.id];
    t[f.id] = v;
  });
  return t;
}
if (typeof module !== "undefined") module.exports = {FACTORS, scoreAd, BANDS, effectiveTiers, sourceTier, TAPS, tierPts};
