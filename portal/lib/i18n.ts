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
  shareResults: "Share results", linkCopied: "Link copied", shareTitle: "4D Results", shareText: "Check these Magnum 4D historical results.",
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
  paymentScan: "Scan the Touch ’n Go eWallet QR code to contribute.", paymentNote: "Payments are handled by your banking or eWallet app; 4D Results does not collect payment details.", back: "Back to results", contact: "Questions or suggestions? Email us.", language: "Language", privacyLink: "Privacy notice", privacyTitle: "Privacy notice", privacyUpdated: "Last updated: 2 September 2026", privacyIntro: "This notice explains how 4D Results handles the limited information used to operate this service.", privacyCollectTitle: "What we store", privacyCollect: "For manually entered searches, our application database stores the selected four-digit number or numbers, a random browser-tab session ID, the chosen language, and a timestamp. It does not store your name, email address, IP address, or browser user-agent in that database.", privacyPurposeTitle: "Why we use it", privacyPurpose: "We use this information only to understand anonymous search activity and improve the availability and usefulness of 4D Results.", privacyRetentionTitle: "Retention and protection", privacyRetention: "Search records are automatically deleted after 90 days. They are stored using Vercel and Neon services with access limited to operating the portal.", privacySharingTitle: "Sharing and payments", privacySharing: "We do not sell search information. A contribution made by scanning the Touch ’n Go QR code is handled by your banking or eWallet app; this portal does not receive or store payment-card or eWallet account information.", privacyChoiceTitle: "Your choices and contact", privacyChoice: "Slider and Pick for me activity is not recorded. For questions about this notice or a request concerning stored search information, contact us at info@result4d.com.my.",
};

export type Translation = typeof en;

const zh: Translation = {
  feedback: "意见反馈", eyebrow: "Magnum 4D 历史查询", headline: "您的号码上次中奖是什么时候？",
  heroCopy: "比较最多三个号码，查询超过40年的开彩历史。", updatedThrough: "开奖结果更新至",
  chooseNumbers: "选择号码", pickForMe: "帮我选", yourNumber: "您的号码", compare: "比较号码", optional: "可选",
  shareResults: "分享结果", linkCopied: "链接已复制", shareTitle: "4D Results", shareText: "查看这些 Magnum 4D 历史开奖结果。",
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
  paymentScan: "扫描 Touch ’n Go eWallet 二维码以支持我们。", paymentNote: "付款由您的银行或电子钱包应用处理；4D Results 不会收集付款资料。", back: "返回查询", contact: "有问题或建议？请发送电邮。", language: "语言", privacyLink: "隐私声明", privacyTitle: "隐私声明", privacyUpdated: "最后更新：2026年9月2日", privacyIntro: "本声明说明 4D Results 如何处理运营此服务所需的有限资料。", privacyCollectTitle: "我们储存的资料", privacyCollect: "对于手动输入的查询，应用数据库会储存所选的四位号码、随机浏览器标签会话 ID、所选语言和时间戳。该数据库不会储存您的姓名、电邮地址、IP 地址或浏览器 user-agent。", privacyPurposeTitle: "使用目的", privacyPurpose: "我们只使用这些资料了解匿名查询活动，并改善 4D Results 的可用性和实用性。", privacyRetentionTitle: "保存期限与保护", privacyRetention: "查询记录会在90天后自动删除。资料使用 Vercel 和 Neon 服务储存，仅限用于运营本门户。", privacySharingTitle: "分享与付款", privacySharing: "我们不会出售查询资料。扫描 Touch ’n Go 二维码所进行的支持付款由您的银行或电子钱包应用处理；本门户不会接收或储存付款卡或电子钱包账户资料。", privacyChoiceTitle: "您的选择与联系", privacyChoice: "滑杆和“帮我选”活动不会被记录。如对本声明或已储存的查询资料有疑问，请电邮 info@result4d.com.my。",
};

const ms: Translation = {
  feedback: "Maklum balas", eyebrow: "Peneroka sejarah Magnum 4D", headline: "Bilakah nombor anda kali terakhir menang?",
  heroCopy: "Bandingkan sehingga tiga nombor merentasi lebih 40 tahun sejarah cabutan.", updatedThrough: "Keputusan dikemas kini sehingga",
  chooseNumbers: "Pilih nombor anda", pickForMe: "Pilih untuk saya", yourNumber: "Nombor anda", compare: "Bandingkan", optional: "pilihan",
  shareResults: "Kongsi keputusan", linkCopied: "Pautan disalin", shareTitle: "4D Results", shareText: "Semak keputusan sejarah Magnum 4D ini.",
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
  paymentScan: "Imbas kod QR Touch ’n Go eWallet untuk menyumbang.", paymentNote: "Pembayaran dikendalikan oleh aplikasi bank atau eWallet anda; 4D Results tidak mengumpul butiran pembayaran.", back: "Kembali ke keputusan", contact: "Ada soalan atau cadangan? E-mel kami.", language: "Bahasa", privacyLink: "Notis privasi", privacyTitle: "Notis privasi", privacyUpdated: "Kemas kini terakhir: 2 September 2026", privacyIntro: "Notis ini menerangkan cara 4D Results mengendalikan maklumat terhad yang digunakan untuk mengendalikan perkhidmatan ini.", privacyCollectTitle: "Maklumat yang kami simpan", privacyCollect: "Untuk carian yang dimasukkan secara manual, pangkalan data aplikasi kami menyimpan nombor empat digit yang dipilih, ID sesi tab pelayar rawak, bahasa yang dipilih dan cap masa. Pangkalan data itu tidak menyimpan nama, e-mel, alamat IP atau user-agent pelayar anda.", privacyPurposeTitle: "Sebab kami menggunakannya", privacyPurpose: "Kami menggunakan maklumat ini hanya untuk memahami aktiviti carian tanpa nama dan meningkatkan ketersediaan serta kegunaan 4D Results.", privacyRetentionTitle: "Tempoh simpanan dan perlindungan", privacyRetention: "Rekod carian dipadam secara automatik selepas 90 hari. Ia disimpan menggunakan perkhidmatan Vercel dan Neon dengan akses terhad untuk mengendalikan portal.", privacySharingTitle: "Perkongsian dan pembayaran", privacySharing: "Kami tidak menjual maklumat carian. Sumbangan melalui imbasan kod QR Touch ’n Go dikendalikan oleh aplikasi bank atau eWallet anda; portal ini tidak menerima atau menyimpan butiran kad pembayaran atau akaun eWallet.", privacyChoiceTitle: "Pilihan dan hubungan anda", privacyChoice: "Aktiviti peluncur dan Pilih untuk saya tidak direkodkan. Untuk pertanyaan tentang notis ini atau permintaan berkaitan maklumat carian yang disimpan, hubungi info@result4d.com.my.",
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
