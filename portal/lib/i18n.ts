export type Language = "en" | "zh-CN" | "ms-MY";

export const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "zh-CN", label: "中文" },
  { value: "ms-MY", label: "Bahasa Melayu" },
];

const en = {
  feedback: "Feedback", eyebrow: "Magnum 4D history explorer", headline: "When did your number last win?",
  heroCopy: "Compare up to three numbers across more than 40 years of draw history.", updatedThrough: "Results updated through",
  chooseNumbers: "Choose your numbers", pickForMe: "Pick for me", yourNumber: "Your number", compare: "Compare", optional: "optional",
  slideNumber: "Or slide to choose your first number", uniqueError: "Each selected number must be unique.", prizeTypes: "Prize types",
  prizes: { "1": "1st prize", "2": "2nd prize", "3": "3rd prize", C: "Consolation", S: "Special" },
  loadError: "The history file could not be loaded. Please refresh and try again.", loading: "Loading draw history…",
  enterNumber: "Enter a number to begin", emptyCopy: "Your timeline and last-result summary will appear here.", resultsGraph: "Results graph",
  firstRecorded: "First recorded appearance", daysSincePrevious: "days since its previous appearance", draw: "Draw",
  resultTimeline: "Result timeline", matchingAppearances: "matching appearances", lastResult: "Last result",
  acrossPrizes: "Across selected prize types", latestDraw: "Latest draw", daysAgo: "days ago", appearancesTotal: "appearances in total",
  noMatching: "No matching result", tryPrize: "Try another prize type.", timeBetween: "Time between results",
  recentIntervals: "Most recent intervals in the selected range", noIntervals: "No intervals are available in this date range.", days: "days",
  enjoying: "Enjoying 4D Results?", supportCopy: "Help us keep this service available to everyone.", contribute: "Contribute to keep this service free",
  historicalOnly: "Historical information only", sendFeedback: "Send feedback", noGraphResults: "No matching results in this date range.",
  graphAria: "Timeline of selected number results", sixMonths: "6 months", oneYear: "1 year", twoYears: "2 years", fiveYears: "5 years", tenYears: "10 years", all: "All",
  contributionTitle: "Keep 4D Results free", contributionCopy: "We are preparing a secure way for supporters to help cover hosting and data costs.",
  contributionSoon: "Contribution options are coming soon.", back: "Back to results", contact: "Questions or suggestions? Email us.", language: "Language",
};

export type Translation = typeof en;

const zh: Translation = {
  feedback: "意见反馈", eyebrow: "Magnum 4D 历史查询", headline: "您的号码上次中奖是什么时候？",
  heroCopy: "比较最多三个号码，查询超过40年的开彩历史。", updatedThrough: "开奖结果更新至",
  chooseNumbers: "选择号码", pickForMe: "帮我选", yourNumber: "您的号码", compare: "比较号码", optional: "可选",
  slideNumber: "或滑动选择第一个号码", uniqueError: "所选号码必须各不相同。", prizeTypes: "奖项类型",
  prizes: { "1": "头奖", "2": "二奖", "3": "三奖", C: "安慰奖", S: "特别奖" },
  loadError: "无法载入历史资料，请刷新后重试。", loading: "正在载入开彩历史…",
  enterNumber: "输入号码以开始", emptyCopy: "时间线和最近开彩摘要将显示在这里。", resultsGraph: "开彩走势图",
  firstRecorded: "最早记录", daysSincePrevious: "天后再次出现", draw: "期号",
  resultTimeline: "开彩时间范围", matchingAppearances: "次符合记录", lastResult: "最近开彩",
  acrossPrizes: "按所选奖项类型", latestDraw: "最新一期", daysAgo: "天前", appearancesTotal: "次历史记录",
  noMatching: "没有符合的记录", tryPrize: "请选择其他奖项类型。", timeBetween: "两次开彩之间的天数",
  recentIntervals: "所选时间范围内的最近间隔", noIntervals: "此时间范围内没有可显示的间隔。", days: "天",
  enjoying: "喜欢 4D Results 吗？", supportCopy: "帮助我们继续为大家提供免费服务。", contribute: "支持我们维持免费服务",
  historicalOnly: "仅供历史资料参考", sendFeedback: "发送反馈", noGraphResults: "此时间范围内没有符合的结果。",
  graphAria: "所选号码开彩时间线", sixMonths: "6个月", oneYear: "1年", twoYears: "2年", fiveYears: "5年", tenYears: "10年", all: "全部",
  contributionTitle: "让 4D Results 保持免费", contributionCopy: "我们正在准备安全的支持方式，用于分担托管和数据成本。",
  contributionSoon: "支持选项即将推出。", back: "返回查询", contact: "有问题或建议？请发送电邮。", language: "语言",
};

const ms: Translation = {
  feedback: "Maklum balas", eyebrow: "Peneroka sejarah Magnum 4D", headline: "Bilakah nombor anda kali terakhir menang?",
  heroCopy: "Bandingkan sehingga tiga nombor merentasi lebih 40 tahun sejarah cabutan.", updatedThrough: "Keputusan dikemas kini sehingga",
  chooseNumbers: "Pilih nombor anda", pickForMe: "Pilih untuk saya", yourNumber: "Nombor anda", compare: "Bandingkan", optional: "pilihan",
  slideNumber: "Atau luncurkan untuk memilih nombor pertama", uniqueError: "Setiap nombor yang dipilih mestilah unik.", prizeTypes: "Jenis hadiah",
  prizes: { "1": "Hadiah pertama", "2": "Hadiah kedua", "3": "Hadiah ketiga", C: "Saguhati", S: "Khas" },
  loadError: "Fail sejarah tidak dapat dimuatkan. Sila muat semula dan cuba lagi.", loading: "Memuatkan sejarah cabutan…",
  enterNumber: "Masukkan nombor untuk bermula", emptyCopy: "Garis masa dan ringkasan keputusan terakhir akan dipaparkan di sini.", resultsGraph: "Graf keputusan",
  firstRecorded: "Kemunculan pertama direkodkan", daysSincePrevious: "hari sejak kemunculan sebelumnya", draw: "Cabutan",
  resultTimeline: "Garis masa keputusan", matchingAppearances: "kemunculan sepadan", lastResult: "Keputusan terakhir",
  acrossPrizes: "Untuk jenis hadiah yang dipilih", latestDraw: "Cabutan terkini", daysAgo: "hari lalu", appearancesTotal: "jumlah kemunculan",
  noMatching: "Tiada keputusan sepadan", tryPrize: "Cuba jenis hadiah lain.", timeBetween: "Masa antara keputusan",
  recentIntervals: "Selang terkini dalam julat yang dipilih", noIntervals: "Tiada selang tersedia dalam julat tarikh ini.", days: "hari",
  enjoying: "Suka 4D Results?", supportCopy: "Bantu kami mengekalkan perkhidmatan ini untuk semua.", contribute: "Sumbang untuk mengekalkan perkhidmatan ini percuma",
  historicalOnly: "Maklumat sejarah sahaja", sendFeedback: "Hantar maklum balas", noGraphResults: "Tiada keputusan sepadan dalam julat tarikh ini.",
  graphAria: "Garis masa keputusan nombor terpilih", sixMonths: "6 bulan", oneYear: "1 tahun", twoYears: "2 tahun", fiveYears: "5 tahun", tenYears: "10 tahun", all: "Semua",
  contributionTitle: "Kekalkan 4D Results percuma", contributionCopy: "Kami sedang menyediakan cara yang selamat untuk penyokong membantu kos pengehosan dan data.",
  contributionSoon: "Pilihan sumbangan akan tersedia tidak lama lagi.", back: "Kembali ke keputusan", contact: "Ada soalan atau cadangan? E-mel kami.", language: "Bahasa",
};

export const TRANSLATIONS: Record<Language, Translation> = { en, "zh-CN": zh, "ms-MY": ms };

export function detectLanguage(): Language {
  const stored = localStorage.getItem("4d-results-language");
  if (stored === "en" || stored === "zh-CN" || stored === "ms-MY") return stored;
  const browser = navigator.language.toLowerCase();
  if (browser.startsWith("zh")) return "zh-CN";
  if (browser.startsWith("ms")) return "ms-MY";
  return "en";
}
