// ---- English rule-based reader: runs in the browser, no AI, nothing leaves the device ----
// Each factor gets a tier from patterns in the text. Where several tiers match, the riskiest wins.
// Salary benchmarks and exchange rates live in salary.js, with their sources.

const CURRENCY_ALIASES = [
  [/^(\$|us\$|usd|dollars?)$/,"usd"], [/^(tsh|tzs)$/,"tsh"], [/^(ksh|kes)$/,"ksh"], [/^(aed|dirhams?)$/,"aed"],
  [/^(sar|riyals?)$/,"sar"], [/^qar$/,"qar"], [/^omr$/,"omr"], [/^kwd$/,"kwd"], [/^(jod|jd)$/,"jod"], [/^dinars?$/,"dinar"], [/^bhd$/,"bhd"], [/^(thb|baht)$/,"thb"],
  [/^(rub|rubles?|roubles?)$/,"rub"], [/^(€|eur|euros?)$/,"eur"], [/^(£|gbp|pounds?)$/,"gbp"], [/^cad$/,"cad"], [/^aud$/,"aud"], [/^(pln|zloty|złoty)$/,"pln"], [/^(zmw|kwacha)$/,"zmw"], [/^ugx$/,"ugx"], [/^rwf$/,"rwf"], [/^(mxn|pesos?)$/,"mxn"], [/^(inr|rupees?|rs\.?)$/,"inr"], [/^(cny|rmb|yuan)$/,"cny"], [/^(zar|rand)$/,"zar"], [/^(ngn|naira)$/,"ngn"], [/^(myr|ringgit)$/,"myr"], [/^php$/,"php"], [/^(try|lira)$/,"try"], [/^(brl|reais|real)$/,"brl"], [/^(jpy|yen)$/,"jpy"], [/^egp$/,"egp"], [/^cop$/,"cop"], [/^clp$/,"clp"], [/^pen$/,"pen"], [/^ars$/,"ars"], [/^shillings?$/,"shillings"],
];
const PHONE_CODES = [["855","Cambodia"],["856","Laos"],["95","Myanmar"],["66","Thailand"],["971","UAE"],["974","Qatar"],["966","Saudi Arabia"],["968","Oman"],["965","Kuwait"],["973","Bahrain"],["255","Tanzania"],["254","Kenya"],["256","Uganda"],["250","Rwanda"],["260","Zambia"],["257","Burundi"],["243","DR Congo"],["234","Nigeria"],["44","UK"],["52","Mexico"],["55","Brazil"],["57","Colombia"],["51","Peru"],["54","Argentina"],["56","Chile"],["27","South Africa"],["233","Ghana"],["20","Egypt"],["212","Morocco"],["92","Pakistan"],["880","Bangladesh"],["94","Sri Lanka"],["81","Japan"],["82","South Korea"],["62","Indonesia"],["84","Vietnam"],["380","Ukraine"],["98","Iran"],["964","Iraq"],["962","Jordan"],["961","Lebanon"],["972","Israel"],["263","Zimbabwe"],["264","Namibia"],["267","Botswana"],["244","Angola"],["251","Ethiopia"],["252","Somalia"],["249","Sudan"],["211","South Sudan"],["258","Mozambique"],["265","Malawi"],["91","India"],["86","China"],["63","Philippines"],["60","Malaysia"],["65","Singapore"],["90","Turkey"],["49","Germany"],["48","Poland"],["7","Russia"],["1","USA/Canada"]]
  .sort((a,b)=>b[0].length-a[0].length);
const GULF = ["UAE","Qatar","Saudi Arabia","Oman","Kuwait","Bahrain"];
const HOME = ["Tanzania"]; // the students using the tool are in Tanzania
const LOCS = [
  [/\b(myanmar|burma|myawaddy|shwe kokko|kk park)\b/i,"Myanmar",10],
  [/\b(cambodia|phnom penh|sihanoukville)\b/i,"Cambodia",10],
  [/\b(laos|lao pdr|vientiane|golden triangle)\b/i,"Laos",10],
  [/\b(thailand|bangkok|pattaya|phuket|chiang mai|chiang rai|mae sot)\b/i,"Thailand",9],
  [/\b(russia|moscow|st\.? petersburg|tatarstan|alabuga|yelabuga)\b/i,"Russia",8],
  [/\b(uae|u\.a\.e|united arab emirates|dubai|abu dhabi|sharjah|ajman)\b/i,"UAE","gulf"],
  [/\b(qatar|doha)\b/i,"Qatar","gulf"],
  [/\b(saudi|ksa|riyadh|jeddah|dammam)\b/i,"Saudi Arabia","gulf"],
  [/\b(oman|muscat)\b/i,"Oman","gulf"],
  [/\bkuwait\b/i,"Kuwait","gulf"],
  [/\b(bahrain|manama)\b/i,"Bahrain","gulf"],
  [/\b(london|manchester|birmingham|glasgow|edinburgh|toronto|vancouver|montreal|calgary|ottawa|winnipeg|new york|los angeles|houston|chicago|dallas|atlanta|miami|boston|seattle|denver|phoenix|philadelphia|detroit|indianapolis|fort wayne|bloomington|columbus|nashville|charlotte|minneapolis|st\.? louis|san francisco|las vegas|berlin|munich|hamburg|frankfurt|warsaw|warszawa|krak[oó]w|wroc[lł]aw|gda[nń]sk|poznan|dublin|amsterdam|rotterdam|brussels|paris|lyon|rome|milan|madrid|barcelona|lisbon|vienna|zurich|stockholm|oslo|copenhagen|helsinki|prague|budapest|bucharest|athens|sydney|melbourne|perth|brisbane|adelaide|auckland|wellington)\b/i,"West (city)",3],
  [/\b(uk|united kingdom|england|scotland|wales|ireland|canada|ontario|alberta|british columbia|quebec|usa|u\.s\.a?|united states|america|alabama|alaska|arizona|arkansas|california|colorado|connecticut|delaware|florida|georgia|hawaii|idaho|illinois|indiana|iowa|kansas|kentucky|louisiana|maine|maryland|massachusetts|michigan|minnesota|mississippi|missouri|montana|nebraska|nevada|new hampshire|new jersey|new mexico|north carolina|north dakota|ohio|oklahoma|oregon|pennsylvania|rhode island|south carolina|south dakota|tennessee|texas|utah|vermont|virginia|washington state|west virginia|wisconsin|wyoming|germany|poland|netherlands|belgium|france|italy|spain|portugal|austria|switzerland|sweden|norway|denmark|finland|czech republic|czechia|hungary|romania|greece|australia|new zealand|europe|schengen)\b/i,"West (country)",5],
  [/\b(kenya|nairobi|mombasa|kisumu|nakuru|eldoret|thika|malindi|naivasha|uganda|kampala|entebbe|jinja|rwanda|kigali|burundi|bujumbura|gitega|zambia|lusaka|ndola|kitwe|malawi|lilongwe|blantyre|mozambique|maputo|congo|drc|kinshasa|goma|lubumbashi|ethiopia|addis ababa|south sudan|juba|somalia|mogadishu)\b/i,"East Africa",2],
  [/\b(tanzania|dar es salaam|dar|arusha|dodoma|mwanza|zanzibar|unguja|pemba|moshi|mbeya|tanga|morogoro|iringa|kigoma|tabora|mtwara|lindi|songea|musoma|bukoba|shinyanga|singida|sumbawanga|njombe|kibaha|bagamoyo|babati|geita|mikocheni|kariakoo|kinondoni|ilala|temeke)\b/i,"Home",1],
  [/\b(abroad|overseas|outside the country|outside (tanzania|kenya|africa)|foreign country|international (job|placement|vacanc(y|ies)))\b/i,"Abroad (vague)",5],
  [/\b(mexico city|ciudad de m[eé]xico|cdmx|guadalajara|monterrey|puebla|tijuana|canc[uú]n|m[eé]rida|quer[eé]taro|le[oó]n|ciudad ju[aá]rez|playa del carmen|bogot[aá]|medell[ií]n|cali|cartagena|lima|santiago|buenos aires|c[oó]rdoba|s[aã]o paulo|rio de janeiro|bras[ií]lia|caracas|quito|guayaquil|la paz|montevideo|asunci[oó]n|havana|santo domingo|guatemala city|san salvador|tegucigalpa|managua|panama city|kingston)\b/i,"Latin America (city)",3],
  [/\b(mexico|m[eé]xico|guatemala|honduras|el salvador|nicaragua|costa rica|panama|colombia|venezuela|ecuador|peru|bolivia|chile|argentina|uruguay|paraguay|brazil|brasil|cuba|dominican republic|haiti|jamaica|puerto rico|latin america|south america|central america)\b/i,"Latin America (country)",5],
  [/\b(beijing|shanghai|guangzhou|shenzhen|mumbai|delhi|new delhi|bangalore|bengaluru|chennai|hyderabad|kolkata|karachi|lahore|islamabad|dhaka|kathmandu|colombo|tokyo|osaka|seoul|busan|taipei|hong kong|singapore|kuala lumpur|penang|jakarta|bali|manila|cebu|hanoi|ho chi minh city|saigon|istanbul|ankara|antalya|tehran|baghdad|erbil|beirut|amman|tel aviv|jerusalem|cairo|alexandria|casablanca|rabat|tunis|algiers|tripoli|lagos|abuja|accra|kumasi|johannesburg|cape town|durban|pretoria|windhoek|gaborone|harare|bulawayo|luanda|dakar|abidjan|douala|yaound[eé]|khartoum|asmara|djibouti city|antananarivo|port louis|victoria seychelles|kyiv|kiev|minsk|almaty|astana|tashkent|baku|tbilisi|yerevan|belgrade|zagreb|sofia|tirana|nicosia|valletta|reykjavik|tallinn|riga|vilnius|bratislava|ljubljana|ulaanbaatar|kabul)\b/i,"World (city)",3],
  [/\b(china|india|pakistan|bangladesh|sri lanka|nepal|bhutan|japan|south korea|korea|taiwan|malaysia|indonesia|philippines|vietnam|singapore|turkey|t[uü]rkiye|iran|iraq|israel|jordan|lebanon|syria|yemen|egypt|morocco|algeria|tunisia|libya|nigeria|ghana|south africa|namibia|botswana|zimbabwe|angola|cameroon|senegal|ivory coast|c[oô]te d['’]ivoire|sudan|eritrea|djibouti|madagascar|mauritius|seychelles|comoros|lesotho|eswatini|swaziland|gabon|mali|niger|burkina faso|benin|togo|guinea|sierra leone|liberia|gambia|ukraine|belarus|moldova|kazakhstan|uzbekistan|kyrgyzstan|tajikistan|turkmenistan|armenia|azerbaijan|serbia|croatia|bosnia|montenegro|albania|north macedonia|bulgaria|slovakia|slovenia|estonia|latvia|lithuania|cyprus|malta|iceland|luxembourg|maldives|mongolia|afghanistan|asia|middle east)\b/i,"World (country)",5],
];
const FREE_MAIL = /^(gmail|googlemail|yahoo|ymail|hotmail|outlook|live|icloud|aol|proton|protonmail|mail|gmx)\./i;
const NOT_COMPANY_DOMAIN = /^(gmail|googlemail|yahoo|ymail|hotmail|outlook|live|icloud|aol|proton|protonmail|facebook|fb|instagram|tiktok|wa|whatsapp|t|bit|tinyurl|cutt|shorturl|forms|google|docs|youtube|linkedin|twitter|x)\./i;
const COMPANY_STOP = /^(A|An|The|Our|We|Big|Large|Top|Leading|Reputable|International|Famous|Good|Best|This|Your|New|Great|Well|Known|Private|Public|Local|General|Senior|Junior|Head|Chief|Assistant|Hiring|Urgent|Urgently|Wanted|Needed|Apply|Job|Jobs|Work|Full|Part|Night|Day|Male|Female|Plot|WhatsApp|Telegram|Facebook|Google|Instagram|TikTok|Zoom|Salary|Pay|Contact|Requirements|Duties|Location|Dear|Hello|Hi|Join|Come|Get|Earn|Send|Call|Visit)$/;

// One pattern table per factor: [tier, regex]. Explicit logic below handles F1, F2, F5, F6, F7.
const RULES = {
  F3: [
    [7, /\b(another|additional|second|extra|further) (fee|payment|charge)s?\b|\bthen (you )?pay\b.{0,60}\b(fee|deposit)\b|\bbalance of (the )?(fee|payment)\b/i],
    [6, /\b(m-?pesa|tigo ?pesa|mixx by yas|airtel money|halo ?pesa|t-?pesa|mtn mobile money|lipa (na|namba) m-?pesa|till number|paybill)\b|\b(pay|paid|deposit|transfer|send (the |your )?(money|fee|payment|amount|deposit|tsh|ksh|\$)|fee|tsh|ksh)\b.{0,40}(\+?25[45]|\b0)[67]\d{2}[\s-]?\d{3}[\s-]?\d{3}\b/i],
    [5, /\b(registration|processing|application|medical|training|visa|booking|uniform|placement|recruitment|agency|service|commitment|security|interview|admin(istration)?|documentation) (fee|fees|charge|charges|cost)\b|\brefundable (fee|deposit)\b|\bpay (a |the )?(small )?(fee|deposit)\b|\bfee of\b/i],
    [4, /\b(deduct(ed|ions?)? from (your )?(salary|wages?|pay)|repay(ment)? (from|out of)|pay (it |this )?back (from|out of) (your )?(salary|wages?)|salary deduction)\b/i],
    [1, /\b(no (recruitment |placement |agency |registration )?fees?\b|free of charge|employer (pays|covers|will pay|will cover)|(all )?costs? (are |will be )?(covered|paid) by (the )?employer|we (never|do not|don'?t) charge)/i],
  ],
  F4: [
    [5, /\b(tell|say to) (them|immigration|the officers?|the airport)\b.{0,30}\b(tourist|holiday|visit)|\bsay (that )?(you are|you're) (a tourist|on holiday|visiting)|\bdon'?t (tell|say|mention)\b.{0,30}\b(work|job)\b|\bpretend\b/i],
    [4, /\b(tourist visa|visit(ing|or)? visa|holiday visa|travel on a visit|convert(ed)? (it )?(to a work|later|on arrival|when you arrive)|change (the |your )?visa (there|later|on arrival|when you arrive))\b/i],
    [3, /\b(we (will )?(handle|process|arrange|take care of|sort out) (everything|all (the )?(documents|papers|paperwork|travel documents))|visa (is )?(guaranteed|100 ?%)|all documents (are )?(processed|arranged))\b/i],
    [1, /\b(work permit|employment visa|work visa|employment pass)\b|\bemployer (pays|covers|arranges|provides|processes)( for)?\b.{0,25}\bvisa\b|\bvisa (is |will be )?(paid|arranged|provided|processed) by (the )?employer\b/i],
  ],
  F8: [
    [5, /\b(attractive|beautiful|pretty|slim|good[- ]looking|sexy|curvy|single (ladies|girls|women)|must be single|unmarried|full[- ]body (photo|picture|pic)s?|body measurements|bust|send (your |us |me )?(recent )?(photos|pictures|pics))\b/i],
    [4, /\b(ladies|girls|females?|women)\b.{0,40}\b(1[6-9]|2\d)\s?(-|–|to)\s?(2\d|3[0-5])\b|\b(young|youthful) (ladies|girls|women|females)\b/i],
    [3, /\b(no (qualifications?|requirements?|education|skills?) (needed|required|necessary)|anyone can apply|everyone can apply|all are welcome|no certificate needed)\b/i],
    [2, /\b(aged? (between )?\d{2}|\d{2}\s?(-|–|to)\s?\d{2} (years|yrs)|male (applicants|candidates)|female (applicants|candidates)|men only|women only)\b/i],
    [1, /\b(degree|diploma|certificate|qualification|\d\+? years?'? (of )?experience|experience (in|of|with)|form (four|six|4|6) (certificate|graduate)|csee|acsee|kcse|driving licen[cs]e|fluent in|proficien(t|cy))\b/i],
  ],
  F9: [
    [5, /\b(we (will )?(keep|hold) (your )?passport|passport (will be )?(kept|held|retained|kept safe) by|hand (over )?(your )?passport (to|for) (safe ?keeping|the (employer|agent|company))|employer (keeps|holds) (the |your )?passport|passports? (are |is )?kept (by|for) (safe ?keeping|the company))\b/i],
    [4, /\b(send|bring|submit|hand over|courier|post) (us |me )?(your )?(original passport|passport book|actual passport)\b|\boriginal passport\b/i],
    [3, /\b(passport (copy|scan|photo|details|number|bio ?data page)|cop(y|ies) of (your )?passport|scan (of )?(your )?passport)\b/i],
    [2, /\b(cop(y|ies) of (your )?(national )?id|id (card )?copy|national id|nida|birth certificate)\b/i],
  ],
  F10: [
    [4, /\b(no (need for a |written )?contract|verbal (agreement|contract)|no paperwork)\b/i],
    [3, /\b(contract (will be |is )?(signed|given|issued|provided) (on|upon|after|when you) (arrival|arrive|arriving)|sign (the |your )?contract (when you arrive|on arrival|there|at the destination)|contract (is )?(given|provided) there)\b/i],
    [1, /\b(written contract|signed contract before|sign (the |a )?contract before|contract (will be )?(signed|provided|given) before)\b/i],
  ],
  F11: [
    [5, /\b(no interview|without (an )?interview|hired (immediately|instantly|on the spot)|instant (hiring|employment|recruitment)|guaranteed (job|employment|placement))\b/i],
    [4, /\b(interview (will be )?(via|on|through|by) (whatsapp|telegram|chat|text|sms|messag\w*)|chat interview|text interview)\b/i],
    [3, /\b(video (call|interview)|zoom|google meet|teams interview|skype)\b/i],
    [1, /\b(interviews? (will be )?(held|conducted) (at|in|on)|face[- ]to[- ]face interview|in[- ]person interview|interview (venue|date)|walk[- ]in interview|shortlisted (candidates|applicants) will be (called|invited|contacted))\b/i],
  ],
  F12: [
    [4, /\b(travel|fly|flight|departure|depart|leave)\b.{0,40}\b(this week|next week|within (a few |\d+ )?days|in (\d|two|three|a few) days|tomorrow|immediately|asap)\b|\burgent(ly)? (travel|departure)\b/i],
    [3, /\b(limited (slots|spaces|places|positions|vacancies|seats)|only \d+ (slots|places|spaces|positions|vacancies|seats)( left| remaining)?|few slots|slots are filling|first come,? first served|hurry|don'?t miss|act (now|fast)|apply (now|today) before)\b/i],
    [2, /\b(deadline|closing date|apply (by|before) \d|applications close)\b|\b(by|before) \d{1,2}(st|nd|rd|th)? (jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/i],
  ],
  F13: [
    [5, /\b(no (need for |need of )?(parent(al)?|guardian)('?s)? (consent|permission|approval)|don'?t tell (your )?(parents|family|anyone)|keep (it|this) (a )?secret|without (telling )?(your )?parents)\b/i],
    [4, /\b(1[3-7] ?(years?|yrs) (old|and above)|aged? 1[3-7]\b|from (age )?1[3-7]\b|under[- ]?18s?|no (minimum )?age (limit|requirement)|any age)\b/i],
    [3, /\b(students (are )?welcome|(holiday|vacation|summer) (jobs?|work) (abroad|overseas)|work (during|in) (the )?(school )?holidays|student (jobs?|work) abroad)\b/i],
    [2, /\b(school leavers?|form (four|six|4|6) leavers?|recent school leavers|just finished school)\b|\b(1[8-9]|2[0-5])\s?(-|–|to)\s?(2[0-5])\s?(years|yrs)\b|\b(aged?|ages|ladies|girls|boys|youths?|women|men|candidates)\b.{0,15}\b(1[8-9]|2[0-5])\s?(-|–|to)\s?(2[0-5])\b/i],
  ],
  F15: [
    [7, /\b(by road|cross(ing)? the border|border crossing|(drive|car|bus|van|boat) (you )?(to|across) (the )?(border|myanmar|cambodia|laos)|onward (journey|travel)|transfer(red)? (by car|by road|to the border)|travel at night|night (bus|travel))\b/i],
    [6, /\b(travel (together )?(in|as) a group|group (travel|departure)|escort(ed)?|accompanied by (our|an|the) (agent|staff)|our agent will travel with)\b/i],
    [5, /\b((agent|someone|our (staff|representative|team|driver)) will (meet|pick|receive|collect) you|airport pick ?-?up|picked up at the airport)\b/i],
    [4, /\b(free (flight|air ?ticket|ticket|travel|transport)|flight (is )?(free|paid for)|we (pay|cover) (for )?(your )?(flight|ticket|travel))\b/i],
    [3, /\b(air ?ticket (is )?(provided|included|paid by (the )?employer)|employer (provides|pays for|books) (the |your )?(air ?ticket|flight))\b|\bemployer (pays|covers|provides|books)( for)?\b.{0,25}\b(flights?|air ?tickets?)\b/i],
    [1, /\b(flights?|air ?tickets?|tickets?|travel|airfare|relocation)\b[^.\n]{0,40}\breimburs\w*|\breimburs\w*[^.\n]{0,40}\b(flights?|air ?tickets?|tickets?|travel|airfare|relocation)\b/i],
  ],
  F16: [
    [6, /\b(curfew|not allowed to leave|cannot leave|can'?t leave|phones? (will be )?(kept|collected|held|taken)|hand in (your )?phones?|no (personal )?phones? allowed|stay (inside|within) the (compound|premises))\b/i],
    [5, /\b(compound|live[- ]in|stay (at|in) the (workplace|office|company premises|employer'?s house)|live at (the )?(workplace|employer'?s)|on[- ]site (housing|accommodation)|dormitor(y|ies))\b/i],
    [4, /\b(free (accommodation|housing|food|meals|room|lodging)|accommodation (and|&) (food|meals) (provided|free|included)|everything (is )?(provided|free|paid)|all expenses paid)\b/i],
    [3, /\bshared (accommodation|housing|apartment|room|house)\b/i],
    [1, /\b(housing|accommodation|rent) allowance\b/i],
  ],
  F17: [
    [5, /\b(paid at the end of (the )?contract|salary (will be )?(held|withheld|saved)|end[- ]of[- ]contract (payment|bonus only)|first (\d+|two|three) months'? salary)\b/i],
    [4, /\b(salary (is )?(paid|sent) (to|through) (the |our )?(agent|agency|family|parents)|agent (will )?(collect|receive)s? (your )?salary)\b/i],
    [3, /\b(paid in cash|cash payment|cash only)\b/i],
    [1, /\b(paid (monthly )?(into|to) your (own )?(bank|account)|bank transfer|monthly salary (paid )?(into|to) (your )?(bank|account))\b/i],
  ],
  F18: [
    [4, /\b(meet (me )?(privately|alone|in private|at (my|a) (hotel|house|place))|private meeting|send (me )?(your )?(photos?|pictures?|pics) (privately|to me))\b/i],
    [3, /\b(sponsor(ship)?|i (can|will) pay (for )?your (school|college|university)? ?fees|pay your school fees|buy you a (phone|laptop)|(help|support) you (financially|with money))\b/i],
    [2, /\b(mentor(ship)?|i can (help|guide) you|career (help|guidance))\b/i],
  ],
  F19: [
    [5, /\b(pin|one[- ]time (code|password)|otp|verification code|the code (we|i) (sent|send|will send)|your password|m-?pesa pin)\b/i],
    [4, /\b(full[- ]body|marital status|next of kin|family (details|members)|parents'? (names|details|phone)|height and weight)\b/i],
    [3, /\b(date of birth|d\.o\.b|dob\b|passport (number|no\.?)|id (number|no\.?)|nida (number|no\.?)|national id number)\b/i],
    [2, /\b(forms\.gle|docs\.google\.com\/forms|google form|bit\.ly|tinyurl|cutt\.ly|shorturl)\b/i],
  ],
};
const NO_EXP = /\b(no (prior |previous |work )?experience( is)? (needed|required|necessary)|without (any )?experience|experience (is )?not (required|necessary|needed)|no experience)\b/i;
const ADDRESS = /\b(p\.?\s?o\.?\s?box\s?\d+|plot (no\.?\s?)?\d+|\d+\s+[a-z]+\s+(street|road|avenue|rd|st)\b|(street|road|avenue)\b.{0,20}\d|[a-z]+ (building|tower|plaza|house),? (floor|\d))/i;
const VAGUE_PAY = /\b(earn up to|up to \$|unlimited (income|earnings)|big money|commission[- ](only|based)|earn (as much as|more than)|huge (salary|income)|make money fast)\b/i;
const DOMESTIC = /\b(house ?maids?|domestic (workers?|work|helpers?)|nann(y|ies)|house ?help|housekeepers?|caregivers?|babysitters?|home care)\b/i;
const RISKY_JOBS = [
  [6, /\b(hostess(es)?|massage|masseuse|spa therapist|dancers?|bar (girls?|ladies|lady|work)|companions?|escorts?|models?|modell?ing|entertainers?|nightclub|night club|karaoke)\b/i],
  [5, /\b(customer (service|support|care)|data entry|typing|typists?|online (marketing|sales|jobs?)|chat (agents?|support|operators?)|call cent(er|re)|telemarketing|crypto|digital marketing|social media (agents?|marketing)|tele-?sales|live chat)\b/i],
  [4, DOMESTIC],
];
const ROLE = ROLE_RE; // job titles: see wordbank.js
const DUTIES = DUTIES_RE; // duty phrases: see wordbank.js

function readJob(texts){
  const labels=["Ad","Form","After"];
  let full=""; const spans=[];
  (texts||[]).forEach((t,i)=>{ t=String(t||"").trim(); if(!t) return; const start=full.length; full+=t+"\n\n"; spans.push({i,start,end:start+t.length}); });
  const stageOf = idx => { const s=spans.find(x=>idx>=x.start && idx<=x.end); return s ? labels[s.i] : "Ad"; };
  const snip = m => {
    let a=Math.max(0,m.index-24), b=Math.min(full.length,m.index+m[0].length+24);
    while(a>0 && a>m.index-40 && !/\s/.test(full[a-1])) a--;
    while(b<full.length && b<m.index+m[0].length+40 && !/\s/.test(full[b])) b++;
    let s=full.slice(a,b).replace(/\s+/g," ").trim();
    return `${stageOf(m.index)}: “${a>0?"…":""}${s}${b<full.length?"…":""}”`;
  };
  const find = re => { const r=new RegExp(re.source, re.flags.replace("g","")); return r.exec(full); };
  const findAll = re => { const r=new RegExp(re.source, re.flags.includes("g")?re.flags:re.flags+"g"); const out=[]; let m; while((m=r.exec(full))){ out.push(m); if(m[0]==="") r.lastIndex++; } return out; };
  const pts = (fid,t) => FACTORS.find(f=>f.id===fid).tiers[t-1][1];
  const base={}, evidence={};
  const choose = (fid, cands) => {
    if(!cands.length) return;
    cands.sort((a,b)=>pts(fid,b[0])-pts(fid,a[0]) || b[0]-a[0]);
    base[fid]=cands[0][0]; evidence[fid]=cands[0][1];
  };
  const negated = m => /\b(no|not|never|without|zero|free of|don'?t|do not|won'?t|will not)\b[\w\s-]{0,14}$/i.test(full.slice(Math.max(0,m.index-24), m.index));
  const findPos = re => findAll(re).find(m=>!negated(m)) || null;
  const EEO = /\b(without regard to|regardless of|irrespective of|discriminat\w*|equal (employment )?opportunit\w*|protected (characteristics?|class|veteran)|eeo\b|affirmative action)/i;
  const sentenceOf = m => { const a=Math.max(full.lastIndexOf(".",m.index), full.lastIndexOf("\n",m.index)); let b=full.slice(m.index).search(/\.(\s|$)|\n/); b = b<0 ? full.length : m.index+b; return full.slice(a+1,b); };
  const inEEO = m => EEO.test(sentenceOf(m));
  const findReal = re => findAll(re).find(m=>!inEEO(m)) || null;
  const tableFactor = fid => choose(fid, RULES[fid].map(([t,re])=>{ const m = (fid==="F3" && t>=4) ? findPos(re) : findReal(re); return m&&!inEEO(m)?[t,snip(m)]:null; }).filter(Boolean));

  // F1 location
  const locHits = LOCS.map(([re,name,tier])=>{ const m=find(re); return m?{name,tier,m}:null; }).filter(Boolean);
  const domestic = find(DOMESTIC);
  const onward = find(RULES.F15[0][1]);
  const jobCountries = new Set(locHits.map(h=>h.name));
  // a named Western city is more specific than its country or state, so drop the vaguer match
  ["West","Latin America","World"].forEach(g=>{ if(locHits.some(h=>h.name===g+" (city)")) for(let i=locHits.length-1;i>=0;i--) if(locHits[i].name===g+" (country)") locHits.splice(i,1); });
  const f1c = locHits.map(h=>{
    let t=h.tier;
    if(t==="gulf") t = domestic ? 7 : 6;
    if(h.name==="Thailand" && onward) t=10;
    return [t, snip(h.m)];
  });
  choose("F1", f1c);
  const f1 = base.F1;
  const abroad = locHits.some(h=>h.name!=="Home");

  // phone numbers
  const phones = findAll(/(?:\+|\b00)\s?(\d[\d\s().-]{6,18}\d)/).map(m=>{
    const d=m[1].replace(/\D/g,""); const cc=PHONE_CODES.find(([c])=>d.startsWith(c));
    return {m, country: cc?cc[1]:"unknown", code: cc?cc[0]:""};
  });
  const localPhone = find(/\b0[67]\d{2}[\s-]?\d{3}[\s-]?\d{3}\b/);
  const PHONE_ALIASES = {"UK":/\b(uk|united kingdom|england|scotland|wales|london|manchester|birmingham)\b/i, "USA/Canada":/\b(usa|u\.s\.a?|united states|america|canada)\b/i, "UAE":/\b(uae|dubai|abu dhabi|sharjah|emirates)\b/i};
  const namedInAd = c => (PHONE_ALIASES[c] || new RegExp("\\b"+c.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"\\b","i")).test(full) || (c==="USA/Canada" && locHits.some(h=>/West/.test(h.name) && !/\b(uk|united kingdom|england|europe|germany|poland|france|italy|spain|london)\b/i.test(h.m[0])));
  const matchesJob = c => HOME.includes(c) || jobCountries.has(c) || namedInAd(c) || (GULF.includes(c) && [...jobCountries].some(j=>GULF.includes(j)));
  const foreign = phones.find(p=>p.country!=="unknown" && !matchesJob(p.country));

  // F2 salary
  const vague = find(VAGUE_PAY);
  const homeIsKenya = /\bkenya|nairobi|mombasa|ksh|kes\b/i.test(full) && !/\btanzania|dar es salaam|tsh|tzs\b/i.test(full);
  const amounts=[];
  const AMT = "(\\d{1,3}(?:[,\\s]\\d{3})+|\\d+(?:\\.\\d+)?)\\s?(k|m|million)?";
  const CUR = "(\\$|us\\$|usd|dollars?|tsh|tzs|ksh|kes|aed|dirhams?|sar|riyals?|qar|omr|kwd|jod|jd|dinars?|bhd|thb|baht|rub|rubles?|roubles?|€|eur|euros?|£|gbp|pounds?|cad|aud|pln|zloty|złoty|zmw|kwacha|ugx|rwf|mxn|pesos?|inr|rupees?|cny|rmb|yuan|zar|rand|ngn|naira|myr|ringgit|php|try|lira|brl|reais|jpy|yen|egp|cop|clp|pen|ars|shillings?)";
  const addAmt = (m, cur, num, mult) => {
    const before=full.slice(Math.max(0,m.index-40), m.index).toLowerCase(), after=full.slice(m.index+m[0].length, m.index+m[0].length+30).toLowerCase();
    if(/(fee|deposit|charge|registration|processing|cost|ticket|price|send|pay (a|the)\b)/.test(before) && !/(salary|earn|wage|income)/.test(before)) return;
    if(/^\s*(fee|deposit|registration|processing)/.test(after)) return;
    let c=(CURRENCY_ALIASES.find(([re])=>re.test(cur.toLowerCase()))||[0,"usd"])[1];
    if(c==="shillings") c = homeIsKenya ? "ksh" : "tsh";
    if(c==="dinar") c = /\b(jordan|amman)\b/i.test(full) ? "jod" : /\bbahrain|manama\b/i.test(full) ? "bhd" : "kwd";
    if(c==="mxn" && /^pesos?$/i.test(cur) && /\bphilippines|manila\b/i.test(full)) c="php";
    let n=parseFloat(num.replace(/[,\s]/g,"")); if(!isFinite(n)) return;
    if(mult){ const k=mult.toLowerCase(); n *= k==="k"?1e3:1e6; }
    let per="month", f=1;
    if(/^\s*(\/|per|a|each)?\s?(hour|hr)\b|^\s*hourly/.test(after)){ per="hour"; f=176; }
    else if(/^\s*(\/|per|a|each)?\s?day\b|^\s*daily/.test(after)){ per="day"; f=26; }
    else if(/^\s*(\/|per|a|each)?\s?week\b|^\s*weekly/.test(after)){ per="week"; f=4.33; }
    else if(/^\s*(\/|per|a|each)?\s?(year|annum)\b|^\s*(annually|yearly|p\.a)/.test(after)){ per="year"; f=1/12; }
    const usd = n*f*FX_USD[c];
    if(usd>=20 && usd<=50000) amounts.push({usd, m, per});
  };
  findAll(new RegExp(CUR+"\\s?"+AMT+"\\b","i")).forEach(m=>addAmt(m, m[1], m[2], m[3]));
  findAll(new RegExp(AMT+"\\s?"+CUR+"\\b","i")).forEach(m=>addAmt(m, m[3], m[1], m[2]));
  const westUK=/\b(uk|united kingdom|england|scotland|wales|london|manchester|birmingham)\b/i.test(full);
  const westPL=/\b(poland|warsaw|warszawa|krak[oó]w|wroc[lł]aw|gda[nń]sk|poznan|lodz)\b/i.test(full);
  const US_RE = /\b(usa|u\.s\.a?|united states|america|new york|los angeles|houston|chicago|dallas|atlanta|miami|boston|seattle|denver|phoenix|philadelphia|detroit|indianapolis|fort wayne|bloomington|columbus|nashville|charlotte|minneapolis|st\.? louis|san francisco|las vegas|alabama|alaska|arizona|arkansas|california|colorado|connecticut|delaware|florida|hawaii|idaho|illinois|indiana|iowa|kansas|kentucky|louisiana|maine|maryland|massachusetts|michigan|minnesota|mississippi|missouri|montana|nebraska|nevada|new hampshire|new jersey|new mexico|north carolina|north dakota|ohio|oklahoma|oregon|pennsylvania|rhode island|south carolina|south dakota|tennessee|texas|utah|vermont|virginia|washington|west virginia|wisconsin|wyoming)\b/i;
  const westUS = !westUK && !westPL && locHits.some(h=>h.name.startsWith("West") && US_RE.test(h.m[0]));
  const isJordan = locHits.some(h=>/\b(jordan|amman|irbid|zarqa|aqaba)\b/i.test(h.m[0]));
  const citizenOnly = find(/\b(must (be|hold) (a )?(u\.?s\.?|us|united states|american) citizen(ship)?|(u\.?s\.?|us|united states) citizenship (is )?required|(active|current) (dod |us |u\.s\. )?(secret|top secret|ts\/sci) (security )?clearance)\b/i) ? "us"
    : find(/\bmust (be|hold) (a )?(uk|british) (citizen|national|passport)\w*\b/i) ? "uk" : null;
  const isWest = locHits.some(h=>h.name.startsWith("West")), isLatam = locHits.some(h=>h.name.startsWith("Latin America")), isWorld = locHits.some(h=>h.name.startsWith("World"));
  const region = f1===10||f1===9 ? "sea" : f1===8 ? "russia" : (f1===6||f1===7) ? "gulf"
    : (f1===3||f1===5) && isWest ? (westUK ? "uk" : westPL ? "poland" : westUS ? "us" : "westOther")
    : (f1===3||f1===5) && isLatam ? "latam"
    : (f1===3||f1===5) && isWorld ? (isJordan ? "jordan" : "otherWorld")
    : f1===5 ? "vague" : f1===2 ? "eastAfrica" : "home";
  const payRegion = citizenOnly && region!=="home" && region!==citizenOnly ? citizenOnly : region;
  const REGION_LABEL = {us:"the US", jordan:"Jordan", home:"Tanzania", eastAfrica:"East Africa (incl. Kenya)", gulf:"the Gulf", sea:"Thailand/Southeast Asia", russia:"Russia", uk:"the UK", poland:"Poland", westOther:"Europe/North America", latam:"Mexico/Latin America", otherWorld:"that country", vague:"an unstated country"};
  const job = jobTypeOf(full);
  const B0 = benchmarkFor(payRegion, job.key), B = B0 && payRegion!==region ? {...B0, note:[B0.note, `the ad is only open to ${citizenOnly==="us"?"US":"UK"} citizens, so its pay is compared with ${citizenOnly==="us"?"US":"UK"} pay`].filter(Boolean).join("; ")} : B0, bench = B ? B.usd : null;
  const f2c=[];
  if(amounts.length && !bench){
    const top=amounts.sort((a,b)=>b.usd-a.usd)[0];
    f2c.push([1, `${snip(top.m)} ≈ $${Math.round(top.usd).toLocaleString()} a month. There is no salary benchmark for this country yet, so the amount was not compared`]);
  }
  else if(amounts.length){
    const top=amounts.sort((a,b)=>b.usd-a.usd)[0], ratio=top.usd/bench;
    const t = ratio>3 ? 6 : ratio>2 ? 5 : ratio>=1.5 ? 4 : 1;
    f2c.push([t, `${snip(top.m)} ≈ $${Math.round(top.usd).toLocaleString()} a month, ${ratio.toFixed(1)}× the $${bench.toLocaleString()} benchmark for ${job.label} in ${REGION_LABEL[payRegion]} (${B.source}${B.note?"; "+B.note:""})`]);
  }
  if(vague) f2c.push([3, snip(vague)]);
  choose("F2", f2c);

  // F3, F4, F8-F13, F15-F19 from the tables
  ["F3","F4","F8","F9","F10","F11","F12","F13","F15","F16","F17","F18","F19"].forEach(tableFactor);
  // several separate fee mentions also count as "several fees"
  const feeHits = findAll(RULES.F3[2][1]).filter(m=>!negated(m));
  if(feeHits.length>=2 && (base.F3||0)<7){ base.F3=7; evidence.F3=`${snip(feeHits[0])} and ${feeHits.length-1} more fee mention${feeHits.length>2?"s":""}`; }

  // F5 employer identity: a known business, a name with a business word, "X is hiring", or "join X"
  const notPlace = s => !LOCS.some(([re])=>new RegExp(re.source,"i").test(s));
  const okName = s => s && !COMPANY_STOP.test(s.split(/\s+/)[0]) && notPlace(s);
  const capName = "([A-Z][\\w&'’-]*(?:[ \\t]+(?:&[ \\t]+|of[ \\t]+|and[ \\t]+)?[A-Z][\\w&'’-]*){0,3})"; // names stay on one line
  const firstOk = (re, g) => { let m; const r=new RegExp(re.source, re.flags.includes("g")?re.flags:re.flags+"g"); while((m=r.exec(full))){ if(okName(m[g])) return m; r.lastIndex=m.index+1; } return null; }; // retry just after a rejected start
  const company = firstOk(new RegExp("\\b"+capName+"[ \\t]+(?:"+BUSINESS_WORD_SRC+")(?![\\w-])"), 1);
  const brand = find(KNOWN_EMPLOYER_RE);
  const hiringName = firstOk(new RegExp("\\b"+capName+"\\s+(?:is|are)\\s+(?:now\\s+|currently\\s+|urgently\\s+)?(?:hiring|recruiting|looking for|seeking|inviting|expanding)"), 1);
  const joinName = firstOk(new RegExp("\\b(?:join|work for|work with|employer:|company:|organi[sz]ation:|hiring company:)\\s+"+capName, "i"), 1);
  const named = company || brand || hiringName || joinName;
  const domains = findAll(/\b(?:https?:\/\/)?(?:www\.)?((?:[a-z0-9-]+\.)+(?:co\.tz|co\.ke|go\.tz|or\.tz|ac\.tz|com|org|net|ae|qa|sa|om|com\.au|co\.uk))\b/i)
    .filter(m=>!NOT_COMPANY_DOMAIN.test(m[1]));
  const careersSite = find(/\b(careers? (website|site|page|portal)|official (website|careers)|our website|company website|apply (online )?(at|through|via|on) (our|the) (website|careers|portal))\b/i);
  const companyEmail = findAll(/\b[a-z0-9._%+-]+@([a-z0-9-]+\.[a-z.]+)\b/i).find(m=>!FREE_MAIL.test(m[1]));
  const jobPortal = find(/\b(apply (with|on|via|through) (indeed|linkedin|glassdoor|brightermonday|fuzu|ajira portal)|(linkedin )?easy apply|(powered|hosted) by\s+(paycor|workday|greenhouse|lever|icims|taleo|smartrecruiters|bamboohr|jobvite|workable|adp|ukg|ultipro|successfactors|recruitee|teamtailor|personio)|myworkdayjobs|greenhouse\.io|jobs\.lever\.co|icims\.com|smartrecruiters\.com|paycor)\b/i);
  const verifiable = domains.length || careersSite || companyEmail || jobPortal;
  const licence = find(/\b(licen[cs]e (no\.?|number|#)|licen[cs]ed by|taesa|nea[- ](licen|regist|accredit)\w*|registration (no\.?|number))/i);
  const descOnly = find(/\b(a (big|large|well[- ]known|reputable|top|leading|international|famous|5[- ]star|five[- ]star|major|growing|fast[- ]growing|established|tech[- ]driven|digital|global|multinational)\b.{0,25}?\b(company|hotel|firm|employer|organi[sz]ation|restaurant|factory|agency|supermarket|business|brand|group)|our client|a client)\b/i);
  const nameText = m => (m===company ? m[0] : m[1]&&m!==brand ? m[1] : m[0]).trim();
  if(named && verifiable && licence){ base.F5=1; evidence.F5=`${snip(named)}: “${nameText(named)}”, with a website or company contact and a licence number`; }
  else if(brand && !verifiable){ base.F5=2; evidence.F5=`${snip(brand)}: “${brand[0]}” is a well-known company. Check the job on its official website before applying, because scammers often borrow famous names`; }
  else if(named && verifiable){ base.F5=2; evidence.F5=`${snip(named)}: “${nameText(named)}”, checkable through ${domains.length?domains[0][1]:companyEmail?"a company email address":careersSite?"its careers website":"its listing on a recognised job site (“"+jobPortal[0].trim()+"”)"}`; }
  else if(domains.length){ base.F5=2; evidence.F5=snip(domains[0]); }
  else if(named){ base.F5=3; evidence.F5=`${snip(named)}: “${nameText(named)}”, but no website or company contact to check it${brand?" (scammers often use well-known names)":""}`; }
  else if(descOnly){ base.F5=4; evidence.F5=snip(descOnly); }

  // F6 contact channel
  const tg = find(/\btelegram\b|\bt\.me\//i), wa = find(/\bwhats ?app\b|\bwa\.me\//i);
  const emails = findAll(/\b[a-z0-9._%+-]+@([a-z0-9-]+\.[a-z.]+)\b/i);
  const coEmail = emails.find(m=>!FREE_MAIL.test(m[1])), freeEmail = emails.find(m=>FREE_MAIL.test(m[1]));
  const dmOnly = find(/\b(comment (below|"?interested"?|"?yes"?|"?me"?)|dm (me|us)|inbox (me|us)|pm (me|us)|message (me|us) (privately|in private|on messenger)|send (me|us) a (private )?message)\b/i) || find(RULES.F19[3][1]);
  if(tg && foreign){ base.F6=6; evidence.F6=`${snip(tg)}; ${foreign.m[0].trim()} is a ${foreign.country} number`; }
  else if(foreign){ base.F6=5; evidence.F6=`${snip(foreign.m)} is a ${foreign.country} number, but the job is ${jobCountries.size&&abroad?"in "+[...jobCountries].filter(c=>c!=="Home").join(", "):"local"}`; }
  else if(coEmail && wa){ base.F6=2; evidence.F6=`${snip(coEmail)} plus WhatsApp`; }
  else if(coEmail){ base.F6=1; evidence.F6=snip(coEmail); }
  else if(careersSite || domains.length || jobPortal){ const m=careersSite||domains[0]||jobPortal; if(wa||tg){ base.F6=2; evidence.F6=`${snip(m)} plus ${wa?"WhatsApp":"Telegram"}`; } else { base.F6=1; evidence.F6=`${snip(m)}: applications go through ${m===jobPortal?"a recognised job site":"an official website"}`; } }
  else if(wa||tg||phones.length||localPhone||freeEmail){ const m=wa||tg||localPhone||freeEmail||phones[0].m; base.F6=3; evidence.F6=snip(m); }
  else if(dmOnly){ base.F6=4; evidence.F6=snip(dmOnly); }

  // F7 job type / duties: risky kinds of work first; otherwise a recognised job title or duties means the job is defined
  const risky = RISKY_JOBS.map(([t,re])=>{ const m=find(re); return m?[t,snip(m)]:null; }).filter(Boolean);
  if(risky.length) choose("F7", risky);
  else {
    const role=find(ROLE), duties=find(DUTIES), vagueJob=find(VAGUE_JOB_RE);
    if(role){ base.F7=1; evidence.F7=`${snip(role)}: recognised job title “${role[0]}”`; }
    else if(duties){ base.F7=1; evidence.F7=snip(duties); }
    else if(vagueJob){ base.F7=2; evidence.F7=snip(vagueJob); }
  }
  // requirements written in everyday words still count as requirements
  if(!base.F8){ const req=find(REQUIREMENTS_RE); if(req){ base.F8=1; evidence.F8=snip(req); } }

  const noExpM = find(NO_EXP), addrM = find(ADDRESS);
  const found = FACTORS.filter(f=>base[f.id] && pts(f.id, base[f.id])>0).length;
  return { base, evidence, abroad, noExp:!!noExpM, address:!!addrM,
    summary: found ? `The rules found ${found} warning sign${found===1?"":"s"} in the text.` : "The rules found no warning signs in the text." };
}
