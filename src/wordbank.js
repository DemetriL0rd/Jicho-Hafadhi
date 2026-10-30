// ---- Word banks: job titles, employers and business words the reader recognises ----
// Add to these lists freely: one entry per item, lower case, plurals are handled automatically.

const JOB_TITLES = [
  // retail and sales
  "cashier","checkout operator","front end associate","sales assistant","sales associate","sales representative","sales rep","sales agent","sales executive","sales officer","sales person","salesperson","sales lady","sales man","shop attendant","shop assistant","shopkeeper","store clerk","store associate","retail assistant","retail associate","stock clerk","stocker","shelf stacker","merchandiser","customer assistant","floor assistant","store supervisor","store manager","shop manager","branch manager","assistant manager","team leader","team member","crew member","key holder","brand ambassador","promoter","field sales","market vendor",
  // food and hospitality
  "barista","waiter","waitress","server","food server","food handler","bartender","chef","sous chef","head chef","cook","line cook","kitchen assistant","kitchen porter","kitchen hand","dishwasher","baker","pastry chef","butcher","room attendant","room steward","housekeeping attendant","laundry attendant","receptionist","front desk agent","front office assistant","guest relations","concierge","porter","bellboy","bell attendant","steward","stewardess","cabin crew","flight attendant","tour guide","safari guide","tour operator","travel agent","events coordinator","restaurant manager","hotel manager","night auditor","lifeguard",
  // transport and logistics
  "driver","delivery driver","delivery rider","rider","boda boda rider","motorcycle rider","chauffeur","truck driver","lorry driver","bus driver","taxi driver","bolt driver","uber driver","forklift operator","dispatcher","logistics officer","logistics assistant","clearing agent","forwarding agent","warehouse assistant","warehouse operative","warehouse worker","warehouse clerk","picker","packer","loader","inventory clerk","storekeeper","store keeper","stores clerk","fleet manager","conductor","ship crew","deckhand","seafarer",
  // trades and construction
  "mechanic","auto mechanic","auto electrician","technician","electrician","plumber","welder","fabricator","carpenter","joiner","mason","bricklayer","painter","tiler","plasterer","roofer","fundi","construction worker","site supervisor","foreman","site engineer","surveyor","quantity surveyor","architect","draughtsman","machine operator","production operator","production worker","factory worker","assembler","quality controller","quality inspector","maintenance technician","refrigeration technician","solar technician","generator technician","panel beater","spray painter","tailor","seamstress","dressmaker","shoemaker","upholsterer",
  // office, finance and admin
  "accountant","accounts assistant","accounts clerk","bookkeeper","auditor","internal auditor","finance officer","finance assistant","bank teller","teller","loan officer","credit officer","relationship officer","relationship manager","insurance agent","administrator","administrative assistant","admin assistant","office assistant","office administrator","office manager","secretary","personal assistant","executive assistant","data clerk","records clerk","records officer","procurement officer","procurement assistant","hr officer","hr assistant","human resources officer","recruitment officer","payroll officer","front office manager","operations officer","operations manager","project manager","project officer","programme officer","program officer","monitoring and evaluation officer","field officer","research assistant","enumerator","translator","interpreter",
  // technology and media
  "software engineer","software developer","web developer","mobile developer","programmer","data analyst","data scientist","it support","it technician","it officer","network engineer","systems administrator","database administrator","graphic designer","ui designer","ux designer","video editor","photographer","videographer","journalist","reporter","editor","content writer","copywriter","content creator","social media manager","marketing officer","marketing assistant","marketing manager","digital marketer","communications officer","public relations officer",
  // health and care
  "nurse","registered nurse","enrolled nurse","staff nurse","midwife","clinical officer","doctor","medical officer","physician","pharmacist","pharmaceutical technologist","pharmacy technician","lab technician","laboratory technician","laboratory technologist","radiographer","dentist","dental assistant","physiotherapist","nutritionist","dietitian","community health worker","health assistant","medical attendant","caregiver","care assistant","care worker","support worker","social worker","counsellor","counselor","psychologist",
  // education
  "teacher","primary teacher","secondary teacher","tutor","lecturer","head teacher","headteacher","teaching assistant","early childhood teacher","school matron","librarian","trainer","instructor","driving instructor",
  // security, cleaning, grounds, farming
  "security guard","security officer","watchman","guard","askari","bouncer","cleaner","office cleaner","janitor","gardener","groundskeeper","caretaker","farm worker","farm hand","farm manager","farm supervisor","agronomist","veterinary officer","vet assistant","extension officer","fisherman","herdsman","fruit picker",
  // personal services
  "hairdresser","hair stylist","barber","beautician","cosmetologist","nail technician","makeup artist","massage therapist","fitness instructor","gym instructor","personal trainer",
  // general entry routes
  "intern","graduate trainee","management trainee","apprentice","volunteer","attendant","assistant","officer","clerk","supervisor","manager","coordinator","executive","specialist","consultant","analyst","engineer","operator","inspector","controller",
];

const DUTY_PHRASES = [
  "duties","responsibilities","what you'll do","what you will do","what you’ll do","your role","the role","about the role","role overview","role summary","job summary","job purpose","job description","key tasks","main tasks","tasks include","responsible for","you will be","you'll be","you’ll be","day-to-day","day to day","key duties","main duties","you will",
];

const REQUIREMENT_PHRASES = [
  "requirements","qualifications","must be","must have","able to","ability to","willing to","willingness to","at least","minimum of","knowledge of","skills in","experience in","experience with","proficient","fluent","good communication","customer service skills","dependable","reliable","punctual","physically fit","valid driving licence","valid driver's license","certificate","diploma","degree","years of experience","years experience","form four","form six","o-level","a-level",
];

const VAGUE_JOB_PHRASES = [
  "various positions","various vacancies","various jobs","many positions","many vacancies","many jobs","several positions","multiple positions","all kinds of jobs","different jobs","general work","general jobs","jobs available","work available","any kind of work","all jobs","job opportunities abroad","work abroad","jobs abroad","overseas jobs","easy work","simple work","light work","work from home","online work",
];

const KNOWN_EMPLOYERS = [
  // retail and food, global
  "kroger","walmart","target stores","costco","amazon","aldi","lidl","tesco","sainsbury's","asda","morrisons","carrefour","spar","ikea","home depot","lowe's","best buy","walgreens","cvs","starbucks","mcdonald's","burger king","kfc","subway","pizza hut","domino's","dunkin","taco bell","wendy's","chick-fil-a","costa coffee","pret a manger","nando's","debonairs","chicken inn","java house","artcaffe",
  // East African retail, banks, telecoms and industry
  "shoprite","game stores","naivas","quickmart","carrefour kenya","chandarana","tuskys","village supermarket","shoppers plaza","mlimani city","vodacom","airtel","tigo","yas tanzania","halotel","ttcl","zantel","safaricom","mtn","crdb","nmb","nbc","stanbic","equity bank","kcb","absa","standard chartered","exim bank","dtb","diamond trust","azania bank","bank of africa","i&m bank","access bank","ecobank","azam","bakhresa","sbc tanzania","coca-cola","pepsi","tbl","tanzania breweries","serengeti breweries","east african breweries","kenya breweries","bidco","mohammed enterprises","metl","tanesco","dawasa","tpa","tanzania ports authority","air tanzania","precision air","kenya airways","twiga cement","tanga cement","dangote","barrick","geita gold mine","acacia","jumia","bolt","uber","glovo","dhl","maersk","g4s","sgs","knight support","unilever","nestle","nestlé","heineken","diageo","bata","toyota tanzania","cmc automobiles",
  // hotels, airlines and Gulf employers
  "marriott","hilton","hyatt","sheraton","radisson","kempinski","serena","melia","four points","holiday inn","accor","novotel","ibis","jumeirah","rotana","emaar","emirates airline","emirates group","flydubai","qatar airways","etihad","saudia","al futtaim","majid al futtaim","lulu","lulu hypermarket","al ghurair","landmark group","alshaya","dnata","transguard","serco",
  // health, education, NGOs and public bodies
  "aga khan","muhimbili","bugando","kcmc","amref","unicef","undp","unhcr","wfp","world health organization","world vision","care international","save the children","oxfam","plan international","red cross","msf","peace corps","usaid","giz","jica","brac","ministry of health","ministry of education",
];

const BUSINESS_WORDS = [
  "ltd","limited","llc","plc","inc","corp","corporation","company","co.","group","holdings","ventures","enterprises","enterprise","investments","industries","international","agency","recruitment","recruiters","consultants","consulting","consultancy","solutions","services","technologies","technology","tech","systems","traders","trading","wholesalers","distributors","supplies","suppliers","logistics","transport","freight","couriers","motors","garage","auto","construction","builders","engineering","contractors","properties","real estate","estates","farms","farm","agro","dairy","foods","food","beverages","breweries","bakery","bakeries","restaurant","cafe","café","grill","kitchen","lodge","lodges","hotel","hotels","resort","resorts","inn","suites","guest house","tours","safaris","travel","airlines","airways","supermarket","supermarkets","hypermarket","mart","store","stores","shop","shops","pharmacy","pharmaceuticals","chemist","clinic","hospital","dispensary","health centre","medical centre","laboratories","school","schools","academy","college","university","institute","bank","microfinance","sacco","insurance","assurance","telecom","communications","media","studio","studios","salon","spa","fitness","gym","security","cleaning","hygiene","textiles","garments","manufacturing","mining","petroleum","oil","energy","solar","electricals","electronics","foundation","trust","ngo","council","authority","ministry","commission","association","society","church","mission",
];

const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+").replace(/'/g, "['’]?");
const listRe = (arr, plural) => new RegExp("\\b(" + [...arr].sort((a,b)=>b.length-a.length).map(w=>escRe(w)+(plural && /[a-z]$/.test(w) ? "(?:e?s)?" : "")).join("|") + ")(?![\\w-])", "i");
const ROLE_RE = listRe(JOB_TITLES, true);
const DUTIES_RE = listRe(DUTY_PHRASES, false);
const REQUIREMENTS_RE = listRe(REQUIREMENT_PHRASES, false);
const VAGUE_JOB_RE = listRe(VAGUE_JOB_PHRASES, false);
const KNOWN_EMPLOYER_RE = listRe(KNOWN_EMPLOYERS, false);
// business words must match in any case inside an otherwise case-sensitive name pattern, so spell each letter as [xX]
const ciRe = s => [...s].map(ch => /[a-z]/i.test(ch) ? "["+ch.toLowerCase()+ch.toUpperCase()+"]" : /\s/.test(ch) ? "\\s+" : ch==="'" ? "['’]?" : ch.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("");
const BUSINESS_WORD_SRC = [...BUSINESS_WORDS].sort((a,b)=>b.length-a.length).map(ciRe).join("|");
