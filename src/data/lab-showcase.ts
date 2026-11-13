import type { LabShowcaseItem, SimulatorPreset } from "@/types/portfolio";

export const LAB_SHOWCASE_ITEMS: LabShowcaseItem[] = [
  {
    id: "lab-01",
    title: {
      vi: "Key Visual Chiến dịch Tuyển sinh Đại học 2025",
      en: "University Admissions 2025 Master Key Visual",
    },
    category: {
      vi: "IMC Key Visual & OOH",
      en: "IMC Key Visual & OOH",
    },
    format: "16:9",
    mediaType: "image",
    mediaSrc: "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/stock-images/767d99bb371a54d0d36751e8cecae43c.jpg",
    metricBadge: "+44% CTR vs Benchmark",
    hookMetric: "3.8% Outbound CTR",
    caption: {
      vi: "Đồng bộ nhận diện từ Billboard OOH đến bộ Banner Retargeting cá nhân hóa theo nhóm ngành.",
      en: "Unified visual system scaling from OOH billboards to major-specific dynamic retargeting banners.",
    },
  },
  {
    id: "lab-02",
    title: {
      vi: "Reels/TikTok 9:16: 'Một ngày ở Lab Công nghệ B2B'",
      en: "9:16 Reels/TikTok: 'Inside the B2B Tech Lab'",
    },
    category: {
      vi: "Short-form Video 9:16 (Paid Hook)",
      en: "9:16 Vertical Video (Paid Hook)",
    },
    format: "9:16",
    mediaType: "image",
    mediaSrc: "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/stock-images/821d815affa6496c39cbdeeec7a84603.jpg",
    metricBadge: "42.6% 3s Hook Rate",
    hookMetric: "-36% Cost Per Lead",
    caption: {
      vi: "Biến nội dung kỹ thuật khô khan thành video thực nghiệm 30s, kéo giảm 36% CPL trên Meta & TikTok Lead Ads.",
      en: "Turned dry technical specs into a 30s visual demo, cutting CPL by 36% on Meta & TikTok Lead Ads.",
    },
  },
  {
    id: "lab-03",
    title: {
      vi: "Sân khấu O2O Open Day & Trải nghiệm Thực tế (3,200+ người)",
      en: "O2O Open Day Stage & Experiential Zone (3,200+ Attendees)",
    },
    category: {
      vi: "Sự kiện O2O & Brand Activation",
      en: "O2O Event & Brand Activation",
    },
    format: "16:9",
    mediaType: "image",
    mediaSrc: "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/stock-images/937438c560ada1c83317f2c11b3454b0.jpg",
    metricBadge: "84% QR Check-in Rate",
    hookMetric: "620+ Hồ sơ chốt tại chỗ",
    caption: {
      vi: "Tích hợp mã QR định danh UTM tại từng quầy trải nghiệm để đẩy thẳng dữ liệu vào luồng Remarketing tự động.",
      en: "Embedded UTM-tagged QR check-ins at every booth to feed attendees directly into automated CRM remarketing.",
    },
  },
  {
    id: "lab-04",
    title: {
      vi: "Series Video 9:16 UGC & Founder Story cho D2C Flagship",
      en: "9:16 UGC & Founder Story Ad Series for D2C Flagship",
    },
    category: {
      vi: "Creative A/B Testing (9:16)",
      en: "Creative A/B Testing (9:16)",
    },
    format: "9:16",
    mediaType: "image",
    mediaSrc: "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/stock-images/98f89cb9994f5c382ab964062c4039db.jpg",
    metricBadge: "ROAS 5.1x (Winner Hook)",
    hookMetric: "28.4% Hold Rate @15s",
    caption: {
      vi: "Thử nghiệm 12 biến thể mở đầu (3 giây đầu) trong 7 ngày để tìm ra công thức video mang lại ROAS 5.1x.",
      en: "Tested 12 opening 3-second hooks in 7 days to isolate the winning narrative driving a 5.1x ROAS.",
    },
  },
  {
    id: "lab-05",
    title: {
      vi: "Tuyến bài PR Chiến lược & Infographic Báo cáo Ngành",
      en: "Tier-1 PR Editorial & Industry Benchmark Infographic",
    },
    category: {
      vi: "PR Truyền thông & Thought Leadership",
      en: "Public Relations & Thought Leadership",
    },
    format: "16:9",
    mediaType: "image",
    mediaSrc: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=640&h=640&fit=crop&q=70&auto=format",
    metricBadge: "18+ Đầu báo Tier-1",
    hookMetric: "+65% Branded Search Lift",
    caption: {
      vi: "Kết hợp PR báo chí chính thống với Lead Magnet Whitepaper giúp tăng 65% lượng tìm kiếm thương hiệu tự nhiên.",
      en: "Paired tier-1 media coverage with a gated whitepaper to lift organic branded search volume by 65%.",
    },
  },
  {
    id: "lab-06",
    title: {
      vi: "Kiến trúc Landing Page CRO & Phễu Quiz Phân loại Lead",
      en: "High-Converting Landing Page CRO & Lead Qualification Quiz",
    },
    category: {
      vi: "Landing Page UX & CRO",
      en: "Landing Page UX & CRO",
    },
    format: "16:9",
    mediaType: "image",
    mediaSrc: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=640&h=640&fit=crop&q=70&auto=format",
    metricBadge: "CVR 4.2% → 7.9%",
    hookMetric: "+88% Tỷ lệ điền Form",
    caption: {
      vi: "Thay biểu mẫu 9 trường tĩnh bằng Interactive Quiz 3 bước, tăng gấp đôi tỷ lệ hoàn tất đăng ký trên di động.",
      en: "Replaced a static 9-field form with a 3-step interactive quiz, nearly doubling mobile form completion.",
    },
  },
];

export const SIMULATOR_PRESETS: SimulatorPreset[] = [
  {
    id: "b2b-lead",
    label: {
      vi: "B2B Lead Gen / SaaS",
      en: "B2B Lead Gen / SaaS",
    },
    badge: "HIGH-TICKET SQL FUNNEL",
    defaultBudgetVndM: 250,
    defaultCpcVndK: 18,
    defaultLandingCvr: 5.5,
    defaultSqlCloseRate: 16,
    avgDealValueVndM: 12.5,
    benchmarkCplVndK: 360,
    benchmarkCvr: 4.5,
    strategicNoteHigh: {
      vi: "Tối ưu tốt: CPL đang thấp hơn chuẩn ngành B2B. Đề xuất dồn 25% ngân sách sang Retargeting Case Study Video & đồng bộ Offline CAPI từ CRM để giữ chất lượng SQL.",
      en: "Optimal Efficiency: CPL beats B2B benchmarks. Shift 25% budget to Case Study Video retargeting & sync CRM Offline CAPI to scale SQL volume.",
    },
    strategicNoteLowCvr: {
      vi: "Cảnh báo CRO (< 4.0% CVR): Lưu lượng click vào tốt nhưng rớt ở trang đích. Cần rút gọn Form xuống 3 bước (Progressive Profiling) và khớp tiêu đề Hero với thông điệp Ads.",
      en: "CRO Bottleneck (< 4.0% CVR): Strong click volume but high landing page drop-off. Implement a 3-step progressive form and align Hero copy with ad hooks.",
    },
    strategicNoteHighCpl: {
      vi: "Cảnh báo CPL cao: Giá thầu CPC và chi phí mỗi Lead đang vượt ngưỡng an toàn. Cần tung ngay 4-6 biến thể Video 9:16 mới (nâng Hook Rate >35%) để hạ CPM/CPC.",
      en: "High CPL Alert: Acquisition cost exceeds benchmark. Launch 4-6 fresh 9:16 vertical video hooks (targeting >35% 3s Hook Rate) to lower auction CPM/CPC.",
    },
  },
  {
    id: "edu-admissions",
    label: {
      vi: "Tuyển sinh / Giáo dục",
      en: "Education Admissions",
    },
    badge: "OMNICHANNEL IMC + LEAD",
    defaultBudgetVndM: 400,
    defaultCpcVndK: 9,
    defaultLandingCvr: 8.2,
    defaultSqlCloseRate: 12,
    avgDealValueVndM: 8.5,
    benchmarkCplVndK: 140,
    benchmarkCvr: 6.5,
    strategicNoteHigh: {
      vi: "Phễu Tuyển sinh khỏe: Tỷ lệ đăng ký tư vấn vượt chuẩn. Nên kích hoạt chuỗi Zalo ZNS / Email Automation và mời tham gia Open Day O2O để tăng tỷ lệ nhập học thực tế.",
      en: "Healthy Admissions Funnel: Inquiry CVR outperforms benchmark. Trigger automated Zalo ZNS / SMS nurturing and O2O Open Day invites to maximize enrollment yield.",
    },
    strategicNoteLowCvr: {
      vi: "Điểm nghẽn Trang đích (< 5.5% CVR): Phụ huynh/học sinh còn phân vân học phí & đầu ra. Cần bổ sung bảng tính học bổng tương tác và video cựu sinh viên ngay trên Fold 1.",
      en: "Landing Page Friction (< 5.5% CVR): Prospects hesitate on tuition & outcomes. Embed an interactive scholarship calculator and alumni proof above the fold.",
    },
    strategicNoteHighCpl: {
      vi: "Chi phí Lead Tuyển sinh cao: Cạnh tranh mùa cao điểm đang đẩy CPC tăng. Hãy tách chiến dịch theo từng nhóm ngành cụ thể và dùng Reels của Đại sứ Sinh viên để kéo CTR.",
      en: "Elevated Seasonal CPL: Peak-season auction pressure detected. Segment ad sets by academic major and deploy student ambassador Reels to boost organic CTR.",
    },
  },
  {
    id: "ecommerce-retail",
    label: {
      vi: "E-Commerce / D2C Retail",
      en: "E-Commerce / D2C Retail",
    },
    badge: "CREATIVE VELOCITY & ROAS",
    defaultBudgetVndM: 300,
    defaultCpcVndK: 5,
    defaultLandingCvr: 3.6,
    defaultSqlCloseRate: 68,
    avgDealValueVndM: 1.2,
    benchmarkCplVndK: 160,
    benchmarkCvr: 2.8,
    strategicNoteHigh: {
      vi: "Hiệu suất ROAS bứt phá: Công thức Video UGC + Bundle Offer đang hoạt động hiệu quả. Có thể tăng ngân sách +20% mỗi 48h cho nhóm Ad Set thắng và mở rộng Lookalike 3%.",
      en: "Strong ROAS Momentum: UGC video hooks + bundle offers are converting cleanly. Scale winning ad sets by +20% every 48h and expand 3% Value Lookalikes.",
    },
    strategicNoteLowCvr: {
      vi: "Rò rỉ Giỏ hàng (< 2.5% CVR): Khách xem sản phẩm nhưng bỏ giỏ. Cần ghim thanh Sticky Add-to-Cart trên mobile, thêm Freeship Progress Bar và đánh giá video thật.",
      en: "Checkout Leakage (< 2.5% CVR): High browse intent but cart abandonment. Add a mobile sticky Add-to-Cart bar, free-shipping threshold meter, and video reviews.",
    },
    strategicNoteHighCpl: {
      vi: "Biên lợi nhuận mỏng do CPA cao: Creative hiện tại đã bão hòa (Ad Fatigue). Cần làm mới góc tiếp cận Problem-Solution trong 3 giây đầu và đẩy gói Combo tăng AOV.",
      en: "Margin Compression from High CPA: Creative fatigue detected. Refresh opening 3-second problem/solution hooks and introduce tiered bundles to lift AOV.",
    },
  },
];
