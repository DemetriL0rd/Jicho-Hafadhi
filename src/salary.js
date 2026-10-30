// ---- Salary benchmarks: typical entry-level monthly pay, by destination region and job type ----
// Researched 26 October 2026. Each figure keeps its source so the result can show where it came from.
// "est." marks a figure borrowed from a related job or region where no direct source was found.
// Scale (unchanged): under 1.5x the benchmark = normal, 1.5-2x = +5, 2-3x = +10, over 3x = +15.

// Exchange rates, units of USD per 1 unit of currency. Source: Pound Sterling Live / Barchart, 26 Oct 2026,
// except fixed Gulf pegs (AED, SAR, QAR, OMR, BHD) and the approximate KWD, CAD, AUD, UGX and RWF rates.
const FX_DATE = "26 Oct 2026";
const FX_USD = {
  mxn:1/18.59, // Pound Sterling Live, 27 Oct 2026 (GBP/MXN 24.80 / GBP/USD 1.334)
  // approximate, not checked this session: INR, CNY, ZAR, NGN, MYR, PHP, TRY, BRL, JPY, EGP, COP, CLP, PEN, ARS
  inr:1/88, cny:1/7.1, zar:1/17.5, ngn:1/1500, myr:1/4.2, php:1/58, try:1/42, brl:1/5.4, jpy:1/150, egp:1/48, cop:1/4000, clp:1/950, pen:1/3.7, ars:1/1400,
  usd:1, tsh:1/2645, ksh:1/129.9, rub:1/80.25, thb:1/33.73, pln:1/3.939, zmw:1/20.26,
  gbp:1.3342, eur:1.1223, aed:1/3.6725, sar:1/3.75, qar:1/3.64, omr:1/0.3845, bhd:1/0.376,
  jod:1/0.709, // fixed peg, 0.709 JOD per USD
  kwd:3.26, cad:0.73, aud:0.65, ugx:1/3700, rwf:1/1400,
};

const JOB_TYPES = [
  {key:"domestic", label:"domestic work", re:/\b(house ?maids?|maids?|domestic (work|workers?|help(ers?)?|staff|jobs?|servants?)|house ?help|house ?girls?|housekeepers? (for|in) (a |the )?(family|home|household)|nann(y|ies)|babysit\w*|au pairs?|home helpers?|household (work|chores|staff)|(work|live) with (a|the) family|family driver|private (home|household|residence))\b/i},
  {key:"care", label:"nursing and care", re:/\b(nurs(e|es|ing)|midwi(fe|ves)|care ?givers?|care (assistant|worker|home)s?|elderly care|aged care|healthcare assistants?|patient care|home care)\b/i},
  {key:"customer", label:"customer service and online work", re:/\b(customer (service|support|care|experience)|call cent(er|re)|contact cent(er|re)|support (agent|staff)|chat (agent|support|operator)s?|live chat|data entry|typing|typists?|telemarket\w*|tele-?sales|bpo|online (job|work|marketing|sales)|digital marketing|social media|crypto\w*|computer (work|job)|phone (support|sales)|translators?|game testers?)\b/i},
  {key:"hotel", label:"hotel, restaurant and cleaning work", re:/\b(hotels?|resorts?|lodges?|restaurants?|cafe|caf[eé]s?|waiters?|waitress(es)?|room attendants?|housekeeping|cleaners?|cleaning|janitors?|kitchen|chefs?|cooks?|bartenders?|baristas?|hospitality|stewards?|laundry|dishwash\w*|spa)\b/i},
  {key:"driver", label:"driving", re:/\b(drivers?|driving|chauffeurs?|delivery (rider|driver|boy)s?|truck|lorry|bus|taxi|couriers?|forklift)\b/i},
  {key:"security", label:"security", re:/\b(security(?! (clearance|requirements?|investigation|screening|checks?))|guards?|watchm[ae]n|askari|bouncers?|patrol)\b/i},
  {key:"factory", label:"factory, construction and farm work", re:/\b(factor(y|ies)|warehouses?|packers?|packing|packaging|assembly|production (line|worker)|machine operators?|construction|labou?rers?|masons?|welders?|carpenters?|plumbers?|electricians?|farms?|farming|fruit|harvest\w*|agricultur\w*|plantations?|fishing|poultry|loaders?|manual work|general workers?)\b/i},
  {key:"retail", label:"retail and sales", re:/\b(sales|shops?|cashiers?|stores?|supermarkets?|merchandis\w*|promoters?|boutique|marketers?|showroom)\b/i},
  {key:"professional", label:"skilled and professional work", re:/\b(teachers?|tutors?|lecturers?|accountants?|engineers?|developers?|programmers?|software|it support|administrators?|secretar(y|ies)|receptionists?|office (assistant|work)|clerks?|technicians?|pharmacists?|doctors?|architects?|managers?|analysts?|lawyers?|graduates?)\b/i},
];

// [USD per month, source]
const BENCH = {
  home: {
    domestic:[139,"KSh 18,047, Kenya minimum wage (Nairobi), May 2026"],
    hotel:[142,"TSh 375,000, Tanzania minimum wage for 4–5-star hotels, Jan 2026"],
    driver:[167,"KSh 21,749, Kenya minimum wage for light-vehicle drivers, Nov 2024"],
    security:[138,"KSh 17,977, Kenya minimum wage for night watchmen, Nov 2024"],
    factory:[167,"KSh 21,749, Kenya minimum wage for machine operators, Nov 2024"],
    customer:[176,"KSh 22,854, average customer service pay in Kenya (PayScale), Jul 2026"],
    retail:[167,"KSh 21,749, Kenya minimum wage for shop assistants, Nov 2024"],
    care:[395,"TSh 1,043,870, top of the starting range for nursing associates in Tanzania (WageIndicator), 2026"],
    professional:[316,"KSh 41,050, average junior software developer pay in Kenya (PayScale), Mar 2026"],
    general:[139,"KSh 18,047, Kenya minimum wage (Nairobi), May 2026"],
  },
  eastAfrica: {
    security:[114,"ZMW 2,313, Zambia minimum wage for guards incl. allowances, Jan 2024"],
    driver:[155,"ZMW 3,135, Zambia minimum wage for drivers incl. allowances, Jan 2024"],
    general:[114,"ZMW 2,313, Zambia minimum wage for general workers incl. allowances, Jan 2024"],
    _fallback:"home", _note:"est., Tanzania/Kenya figure",
  },
  gulf: {
    domestic:[275,"QAR 1,000, Qatar minimum wage with food and housing provided (ILO); Saudi minimum SAR 1,000 from Feb 2026"],
    hotel:[408,"AED 1,500, average room attendant pay in Dubai (GulfTalent), Sep 2024"],
    driver:[817,"AED 3,000, average light-duty driver pay in the UAE (GulfTalent), Sep 2024"],
    security:[545,"AED 2,000, private-company security guards in the UAE (Mahad Manpower), 2025"],
    factory:[357,"QAR 1,300, Qatar minimum wage with housing provided plus food allowance (ILO)"],
    customer:[1089,"AED 4,000, average customer service executive pay in Dubai (GulfTalent)"],
    retail:[817,"AED 3,000, average cashier and sales associate pay in the UAE (GulfTalent)"],
    care:[2042,"AED 7,500, middle of the AED 6,000–9,000 range for new nurses in Dubai (Two Continents), Oct 2025"],
    professional:[2042,"est., new-nurse pay in Dubai used as the skilled-work figure"],
    general:[408,"AED 1,500, average room attendant pay in Dubai (GulfTalent), Sep 2024"],
  },
  sea: {
    domestic:[287,"THB 9,672, Bangkok minimum wage (372 baht/day, 26 days), Jan 2025"],
    hotel:[308,"THB 10,400, minimum wage in Phuket/Chonburi/Rayong (400 baht/day, 26 days), Jan 2025"],
    driver:[308,"THB 10,400, Thailand top-rate minimum wage, Jan 2025"],
    security:[308,"THB 10,400, Thailand top-rate minimum wage, Jan 2025"],
    factory:[308,"THB 10,400, minimum wage in Chonburi/Rayong factory provinces, Jan 2025"],
    customer:[741,"THB 25,000, entry-level English-speaking customer service in Bangkok (RGF listing THB 20–25k; PayScale-cited THB 25–47k)"],
    retail:[623,"THB 21,000, sales associate in Bangkok (RGF listing, THB 18–21k)"],
    care:[741,"est., English-speaking customer service figure"],
    professional:[741,"est., English-speaking customer service figure"],
    general:[308,"THB 10,400, Thailand top-rate minimum wage, Jan 2025"],
  },
  russia: {
    general:[1429,"RUB 114,673, Russia's average manufacturing wage (Rosstat), Jul 2026"],
    _fallback:"self", _note:"used for all jobs",
  },
  uk: {
    general:[2755,"£12.71/hour, UK National Living Wage from Apr 2026, full-time"],
    care:[3452,"£31,049/year, NHS Band 5 starting salary, 2025/26"],
    professional:[3452,"est., NHS Band 5 starting salary"],
    _fallback:"self", _note:"used for jobs without their own figure",
  },
  us: {
    general:[4314,"$24.51/hour, US median pay for all occupations (BLS), May 2025, full-time"],
    retail:[2783,"$15.81/hour, US median pay for cashiers (BLS), May 2025, full-time"],
    _fallback:"self", _note:"US median pay for all jobs used",
  },
  jordan: {
    general:[409,"JOD 290, Jordan national minimum wage from Jan 2025 (WageIndicator)"],
    _fallback:"self", _note:"minimum wage used for all jobs",
  },
  latam: {
    general:[515,"MXN 9,582, Mexico general minimum wage, Jan 2026 (CONASAMI)"],
    _fallback:"self", _note:"Mexico minimum wage used for all jobs and all of Latin America",
  },
  poland: {
    general:[1220,"PLN 4,806, Poland minimum wage, 2026"],
    _fallback:"self", _note:"used for all jobs",
  },
};

function jobTypeOf(text){
  let best=null, bestN=0;
  JOB_TYPES.forEach(j=>{ const n=(text.match(new RegExp(j.re.source,"gi"))||[]).length; if(n>bestN){ best=j; bestN=n; } });
  return best || {key:"general", label:"general work"};
}
// region: home | eastAfrica | gulf | sea | russia | uk | us | poland | jordan | westOther | latam | otherWorld | vague
function benchmarkFor(region, jobKey){
  let note="";
  let r=region;
  if(r==="westOther"){ r="uk"; note="compared with UK pay"; }
  if(r==="vague"){ r="gulf"; note="destination not stated, so compared with Gulf pay"; }
  if(r==="otherWorld") return null; // no benchmark yet
  const tbl=BENCH[r];
  let row=tbl[jobKey];
  if(!row){
    if(tbl._fallback==="home"){ row=BENCH.home[jobKey]||BENCH.home.general; note=note||tbl._note; }
    else { row=tbl.general; if(jobKey!=="general") note=note||tbl._note; }
  }
  return {usd:row[0], source:row[1], note};
}
