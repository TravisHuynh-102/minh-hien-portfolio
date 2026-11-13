import type {
  CapabilityPillar,
  CareerMilestone,
  CredentialItem,
  HeroMetric,
  LocalizedText,
  TestimonialItem,
} from "@/types/portfolio";

export const SITE_CONFIG = {
  marketerName: "MINH HIỂN",
  marketerFullTitle: {
    vi: "Full-Stack Marketer — Chiến lược MarCom & Tăng trưởng Performance",
    en: "Full-Stack Marketer — MarCom Strategy & Performance Growth",
  } satisfies LocalizedText,
  roleCode: "FULL-STACK MARKETER | MARCOM STRATEGY & PERFORMANCE GROWTH",
  email: "hien.growth@marketer-portfolio.vn",
  phone: "+84 909 688 924",
  zaloUrl: "https://zalo.me/84909688924",
  linkedinUrl: "https://linkedin.com/in/fullstack-marketer-growth",
  cvPath: "/cv.pdf",
  location: {
    vi: "TP. Hồ Chí Minh, Việt Nam",
    en: "Ho Chi Minh City, Vietnam",
  } satisfies LocalizedText,
  availabilityBadge: {
    vi: "Sẵn sàng nhận dự án & Full-time",
    en: "Available for Projects & Roles",
  } satisfies LocalizedText,
  navItems: [
    {
      id: "work",
      href: "/#work",
      label: { vi: "Dự án", en: "Work" } satisfies LocalizedText,
    },
    {
      id: "lab",
      href: "/#lab",
      label: { vi: "Không gian 3D", en: "3D Lab" } satisfies LocalizedText,
    },
    {
      id: "journey",
      href: "/#journey",
      label: { vi: "Hành trình", en: "Journey" } satisfies LocalizedText,
    },
    {
      id: "contact",
      href: "/#contact",
      label: { vi: "Liên hệ", en: "Contact" } satisfies LocalizedText,
    },
  ],
  hero: {
    eyebrow: {
      vi: "FULL-STACK MARKETER | MARCOM STRATEGY & PERFORMANCE GROWTH",
      en: "FULL-STACK MARKETER | MARCOM STRATEGY & PERFORMANCE GROWTH",
    } satisfies LocalizedText,
    headline: {
      vi: "Xây dựng câu chuyện thương hiệu chạm cảm xúc và chuyển hóa thành tăng trưởng doanh số đo lường được.",
      en: "Architecting emotionally resonant brand narratives that convert into measurable revenue growth.",
    } satisfies LocalizedText,
    subheadline: {
      vi: "Kết hợp tư duy chiến lược IMC/MarCom với kỷ luật tối ưu phễu Performance, dữ liệu hành vi và vòng lặp Data-to-Creative thực chiến.",
      en: "Bridging full-funnel IMC strategy with rigorous paid media optimization, attribution analytics, and rapid Data-to-Creative feedback loops.",
    } satisfies LocalizedText,
    primaryCta: {
      vi: "Xem Case Studies ↓",
      en: "Explore Case Studies ↓",
    } satisfies LocalizedText,
    secondaryCta: {
      vi: "Sao chép Email",
      en: "Copy Email",
    } satisfies LocalizedText,
    copiedFeedback: {
      vi: "Đã copy email!",
      en: "Email copied!",
    } satisfies LocalizedText,
    portraitCaption: {
      vi: "CREATIVE × DATA LOOP ARCHITECT",
      en: "CREATIVE × DATA LOOP ARCHITECT",
    } satisfies LocalizedText,
    portraitSubCaption: {
      vi: "5+ năm điều phối IMC, B2B/Edu Lead Gen & E-Commerce CRO",
      en: "5+ yrs orchestrating IMC, B2B/Edu Lead Gen & E-Commerce CRO",
    } satisfies LocalizedText,
  },
  heroMetrics: [
    {
      id: "marcom-reach",
      categoryLabel: {
        vi: "01 / ĐỘ PHỦ MARCOM",
        en: "01 / MARCOM REACH",
      },
      value: "50M+ Views",
      label: {
        vi: "Tổng lượt tiếp cận đa kênh",
        en: "Cross-Channel Organic & Paid Reach",
      },
      subtext: {
        vi: "Tích hợp chuỗi Short-form Video 9:16, PR báo chí & Sự kiện O2O.",
        en: "Integrated across 9:16 vertical video series, tier-1 PR, and O2O activations.",
      },
    },
    {
      id: "budget-scale",
      categoryLabel: {
        vi: "02 / QUY MÔ NGÂN SÁCH",
        en: "02 / BUDGET SCALE",
      },
      value: "3.5 Tỷ+ VNĐ",
      label: {
        vi: "9-Figure VND Scale управляемый",
        en: "9-Figure VND Scale Managed",
      },
      subtext: {
        vi: "Phân bổ kỷ luật trên Meta, Google, TikTok & LinkedIn với ROAS dương.",
        en: "Disciplined allocation across Meta, Google, TikTok & LinkedIn with positive ROAS.",
      },
    },
    {
      id: "funnel-efficiency",
      categoryLabel: {
        vi: "03 / HIỆU SUẤT PHỄU",
        en: "03 / FUNNEL EFFICIENCY",
      },
      value: "-32% CPL",
      label: {
        vi: "Giảm chi phí mỗi Lead chất lượng",
        en: "Blended Cost-Per-Lead Reduction",
      },
      subtext: {
        vi: "Nhờ đồng bộ thông điệp Creative 3 giây đầu và tối ưu UX Landing Page.",
        en: "Driven by 3-second creative hook testing and high-intent landing page CRO.",
      },
    },
    {
      id: "project-depth",
      categoryLabel: {
        vi: "04 / CHIỀU SÂU DỰ ÁN",
        en: "04 / PROJECT DEPTH",
      },
      value: "15+ Chiến dịch",
      label: {
        vi: "Chiến dịch Full-Funnel trọng điểm",
        en: "End-to-End Full-Funnel Campaigns",
      },
      subtext: {
        vi: "Trải rộng từ Tuyển sinh Giáo dục, Công nghệ B2B đến Bán lẻ E-Commerce.",
        en: "Spanning Higher Education Admissions, B2B Industrial Tech, and Retail CRO.",
      },
    },
  ] satisfies HeroMetric[],
  capabilities: [
    {
      id: "brand-marcom",
      code: "PILLAR 01 // MARCOM & BRAND",
      title: {
        vi: "Brand Strategy & MarCom Execution",
        en: "Brand Strategy & MarCom Execution",
      },
      subtitle: {
        vi: "Kiến tạo Big Idea và hệ sinh thái nội dung giúp hạ nhiệt chi phí mua media.",
        en: "Crafting Big Ideas and content ecosystems that organically lower paid media CAC.",
      },
      coreStrengths: [
        {
          vi: "Lập kế hoạch IMC đa điểm chạm (TOFU-MOFU-BOFU) bám sát mục tiêu doanh thu.",
          en: "Full-funnel IMC planning (TOFU-MOFU-BOFU) anchored to commercial P&L targets.",
        },
        {
          vi: "Chỉ đạo sản xuất Key Visual, kịch bản Short-form 9:16 (TikTok/Reels) & TVC.",
          en: "Creative direction for Key Visuals, high-retention 9:16 vertical scripts & brand films.",
        },
        {
          vi: "Tổ chức sự kiện O2O, chuỗi Brand Ambassador, PR truyền thông và quản trị Agency.",
          en: "O2O flagship events, Brand Ambassador programs, tier-1 PR, and agency governance.",
        },
      ],
      deliverables: [
        { vi: "IMC Master Plan & Creative Brief", en: "IMC Master Plan & Creative Brief" },
        { vi: "Ma trận Hook Video 9:16", en: "9:16 Video Hook Matrix" },
        { vi: "Kịch bản Sự kiện & PR Angle", en: "O2O Event Playbook & PR Angles" },
      ],
      tools: ["Figma", "Adobe CC", "CapCut Pro", "Notion Creative Ops", "PR Newswire"],
    },
    {
      id: "performance-cro",
      code: "PILLAR 02 // PERFORMANCE & CRO",
      title: {
        vi: "Performance Marketing & Funnel CRO",
        en: "Performance Marketing & Funnel CRO",
      },
      subtitle: {
        vi: "Vận hành ngân sách đa kênh dựa trên thực nghiệm A/B và chất lượng SQL thực tế.",
        en: "Scaling multi-channel paid acquisition via structured A/B testing and SQL quality.",
      },
      coreStrengths: [
        {
          vi: "Chiến lược Paid Media đa kênh: Meta Ads, Google Search/PMax, TikTok & LinkedIn B2B.",
          en: "Multi-channel media buying across Meta Ads, Google Search/PMax, TikTok & LinkedIn B2B.",
        },
        {
          vi: "Tối ưu phễu B2B/Edu Lead Gen & E-Commerce: nâng tỷ lệ MQL sang SQL thực chất.",
          en: "B2B/Edu Lead Gen & E-Commerce funnel engineering focused on MQL-to-SQL velocity.",
        },
        {
          vi: "Thực nghiệm Creative Testing hàng tuần và tối ưu chuyển đổi Landing Page (CRO).",
          en: "Weekly creative sprint testing and heatmap-backed Landing Page CRO iterations.",
        },
      ],
      deliverables: [
        { vi: "Kiến trúc Retargeting đa tầng", en: "Multi-Layer Retargeting Architecture" },
        { vi: "Ma trận A/B Test Creative & LP", en: "Creative & LP A/B Testing Matrix" },
        { vi: "Kiểm toán & Tối ưu CPL / ROAS", en: "CPL / ROAS Efficiency Audits" },
      ],
      tools: ["Meta Ads", "Google Ads", "TikTok Ads", "LinkedIn Campaign Manager", "Hotjar / Clarity"],
    },
    {
      id: "data-martech-ai",
      code: "PILLAR 03 // DATA, MARTECH & AI",
      title: {
        vi: "Data Analytics, Martech & AI Ops",
        en: "Data Analytics, Martech & AI Ops",
      },
      subtitle: {
        vi: "Khép kín dữ liệu từ cú click quảng cáo đầu tiên đến doanh thu ghi nhận trong CRM.",
        en: "Closing the attribution loop from first ad impression to verified CRM revenue.",
      },
      coreStrengths: [
        {
          vi: "Thiết lập Tracking chuẩn xác: GA4, Google Tag Manager, Meta CAPI & Offline Conversion.",
          en: "End-to-end tracking setup: GA4, Google Tag Manager, Server-side CAPI & Offline Conversions.",
        },
        {
          vi: "Xây dựng Dashboard BI thời gian thực trên Looker Studio, SQL cơ bản & Advanced Excel.",
          en: "Executive real-time BI dashboards in Looker Studio, SQL cohort queries & financial modeling.",
        },
        {
          vi: "Ứng dụng AI & Automation (Make/Zapier/LLM) tăng gấp 3 tốc độ nghiên cứu và sản xuất.",
          en: "AI workflow automation (Make/Zapier/LLMs) accelerating research and creative variants by 3x.",
        },
      ],
      deliverables: [
        { vi: "Hệ thống GA4 + GTM + CAPI", en: "GA4 + GTM + CAPI Attribution Stack" },
        { vi: "Looker Studio Live P&L Dashboard", en: "Looker Studio Live P&L Dashboard" },
        { vi: "Luồng CRM Lead Scoring tự động", en: "Automated CRM Lead Scoring Flows" },
      ],
      tools: ["GA4", "Google Tag Manager", "Looker Studio", "HubSpot / CRM", "SQL / BigQuery", "Claude / GPT Ops"],
    },
  ] satisfies CapabilityPillar[],
  allToolsStrip: [
    "Meta Business Suite",
    "Google Ads (Search/PMax)",
    "TikTok For Business",
    "LinkedIn Ads",
    "GA4 & Server-Side GTM",
    "Conversion API (CAPI)",
    "Looker Studio BI",
    "HubSpot / Salesforce CRM",
    "Microsoft Clarity / Hotjar",
    "Figma & Creative Direction",
    "Notion / Linear Agile Ops",
    "AI Workflow Automation",
  ],
  careerMilestones: [
    {
      id: "milestone-1",
      period: "06/2026 — PRESENT",
      role: {
        vi: "Freelance Digital Performance Planner & Founder Sparring Partner",
        en: "Freelance Digital Performance Planner & Founder Sparring Partner",
      },
      organization: {
        vi: "Hoạt động Tư vấn & Triển khai Độc lập (Huỳnh Minh Hiển)",
        en: "Independent Consulting & Performance Practice (Huynh Minh Hien)",
      },
      badge: { vi: "Freelance & Advisory", en: "Freelance & Advisory" },
      achievement: {
        vi: "Thực thi chiến lược B2B Performance 12 tháng cho 3D Smart Solutions (3DS) & Trutech (ngân sách 180 triệu VNĐ/năm) và cố vấn vận hành 1:1 cho Founder.",
        en: "Executing 12-month B2B Performance campaigns for 3D Smart Solutions (3DS) & Trutech (180M VND/year budget) alongside 1:1 Founder Sparring Partner advisory.",
      },
    },
    {
      id: "milestone-2",
      period: "04/2024 — PRESENT",
      role: {
        vi: "Marcom Executive & Creative Team Leader",
        en: "Marcom Executive & Creative Team Leader",
      },
      organization: {
        vi: "Đại học Kinh tế - Tài chính TP.HCM (UEF)",
        en: "Ho Chi Minh City University of Economics and Finance (UEF)",
      },
      badge: { vi: "In-house / Full-time", en: "In-house / Full-time" },
      achievement: {
        vi: "Quản trị đội ngũ nội dung, video, thiết kế; dẫn dắt 5 chuỗi thương hiệu chủ lực, sự kiện UniHackfest 2026, Miss UEF 2026 và đề án UEF Student Ambassadors.",
        en: "Leading content, video, and design teams; spearheading 5 flagship brand series, UniHackfest 2026, Miss UEF 2026, and the UEF Student Ambassadors pilot.",
      },
    },
    {
      id: "milestone-3",
      period: "06/2023 — 02/2025",
      role: {
        vi: "Co-Founder & Growth Manager",
        en: "Co-Founder & Growth Manager",
      },
      organization: {
        vi: "Los Gatos Creativo",
        en: "Los Gatos Creativo",
      },
      badge: { vi: "Startup / Co-Founder", en: "Startup / Co-Founder" },
      achievement: {
        vi: "Đồng sáng lập và quản trị đội ngũ 5 nhân sự sáng tạo; tư vấn nhận diện thương hiệu và thực thi chiến lược giúp doanh thu dự án tăng 200% sau 3 tháng.",
        en: "Co-founded and managed a 5-member creative squad; delivered brand identity and growth execution that boosted project revenue by 200% in 3 months.",
      },
    },
    {
      id: "milestone-4",
      period: "04/2023 — 04/2024",
      role: {
        vi: "Marketing Executive",
        en: "Marketing Executive",
      },
      organization: {
        vi: "Nanovet Pharma JSC",
        en: "Nanovet Pharma JSC",
      },
      badge: { vi: "In-house / Full-time", en: "In-house / Full-time" },
      achievement: {
        vi: "Triển khai Marketing tổng thể, sản xuất ấn phẩm đa phương tiện (multimedia) và chuẩn hóa bộ tài liệu bán hàng cho hơn 50 đại lý phân phối.",
        en: "Operated integrated product marketing, produced multimedia assets, and standardized sales enablement toolkits for 50+ distribution dealers.",
      },
    },
  ] satisfies CareerMilestone[],
  testimonials: [
    {
      id: "quote-1",
      quote: {
        vi: "Hiếm có Marketer nào vừa chỉ đạo được Key Visual và kịch bản sự kiện chạm cảm xúc, vừa tự tay đọc bảng phân rã CPL/SQL để xoay trục quảng cáo ngay trong tuần.",
        en: "Rarely do you find a marketer who can direct emotionally sharp Key Visuals and events while dissecting CPL-to-SQL cohort tables to pivot ad spend mid-week.",
      },
      author: "Trần Minh Quân",
      role: {
        vi: "Chief Marketing Officer (CMO)",
        en: "Chief Marketing Officer (CMO)",
      },
      company: {
        vi: "Hệ thống Giáo dục Đại học & Quốc tế",
        en: "National Higher Education Group",
      },
      metricHighlight: "+128% KPI Tuyển sinh / Admissions Target",
    },
    {
      id: "quote-2",
      quote: {
        vi: "Vòng lặp Data-to-Creative mà bạn ấy thiết lập đã giải quyết triệt để mâu thuẫn giữa đội Brand và đội Ads, giúp công ty giảm 38% chi phí săn khách hàng B2B.",
        en: "The Data-to-Creative feedback loop built here permanently bridged the gap between our Brand and Paid Media teams, cutting B2B acquisition cost by 38%.",
      },
      author: "Lê Hoàng Nam",
      role: {
        vi: "Founder & Managing Director",
        en: "Founder & Managing Director",
      },
      company: {
        vi: "B2B Industrial Tech Vietnam",
        en: "B2B Industrial Tech Vietnam",
      },
      metricHighlight: "2.4x Pipeline Velocity | -38% CPL",
    },
    {
      id: "quote-3",
      quote: {
        vi: "Tư duy kiểm thử Landing Page CRO và theo dõi Offline CAPI cực kỳ bài bản. Mỗi đồng ngân sách chi ra đều được chứng minh bằng số liệu doanh thu thực.",
        en: "Methodical Landing Page CRO and server-side CAPI attribution. Every VND of media spend was rigorously mapped back to verified pipeline revenue.",
      },
      author: "Nguyễn Thu Hà",
      role: {
        vi: "Head of Digital Growth & E-Commerce",
        en: "Head of Digital Growth & E-Commerce",
      },
      company: {
        vi: "Omnichannel D2C Retail Group",
        en: "Omnichannel D2C Retail Group",
      },
      metricHighlight: "ROAS 4.8x | +41% Checkout CVR",
    },
  ] satisfies TestimonialItem[],
  credentials: [
    {
      id: "cert-1",
      issuer: "Google Skillshop",
      title: {
        vi: "Google Analytics 4 & Google Ads Search/Video Professional",
        en: "Google Analytics 4 & Google Ads Search/Video Professional",
      },
      year: "2025",
      credentialCode: "GA4-ADS-PRO",
    },
    {
      id: "cert-2",
      issuer: "Meta Blueprint",
      title: {
        vi: "Meta Certified Media Planning & Creative Strategy",
        en: "Meta Certified Media Planning & Creative Strategy",
      },
      year: "2024",
      credentialCode: "META-410-101",
    },
    {
      id: "cert-3",
      issuer: "CXL Institute / HubSpot",
      title: {
        vi: "Conversion Rate Optimization (CRO) & B2B Funnel Attribution",
        en: "Conversion Rate Optimization (CRO) & B2B Funnel Attribution",
      },
      year: "2024",
      credentialCode: "CRO-ATTR-09",
    },
  ] satisfies CredentialItem[],
  footer: {
    eyebrow: {
      vi: "07 / SẴN SÀNG ĐỒNG HÀNH TĂNG TRƯỞNG",
      en: "07 / READY FOR HIGH-IMPACT GROWTH",
    } satisfies LocalizedText,
    headline: {
      vi: "Đang tìm một Full-Stack Marketer biết biến ngân sách thương hiệu thành tăng trưởng đo lường được?",
      en: "Looking for a Full-Stack Marketer who turns brand equity into measurable pipeline and revenue?",
    } satisfies LocalizedText,
    subtext: {
      vi: "Trao đổi trực tiếp về bài toán phễu chuyển đổi, chiến dịch IMC sắp tới hoặc cơ hội hợp tác chiến lược.",
      en: "Let's discuss your current funnel bottlenecks, upcoming IMC launches, or full-time/advisory roles.",
    } satisfies LocalizedText,
    collaborationModes: [
      {
        code: "MODE 01",
        title: {
          vi: "Full-time MarCom / Growth Lead",
          en: "Full-time MarCom / Growth Lead",
        } satisfies LocalizedText,
        desc: {
          vi: "Dẫn dắt chiến lược IMC, quản trị đội ngũ In-house/Agency và chịu trách nhiệm KPI phễu.",
          en: "Leading full-funnel IMC, managing in-house/agency squads, and owning pipeline KPIs.",
        } satisfies LocalizedText,
      },
      {
        code: "MODE 02",
        title: {
          vi: "Freelance Performance Planner",
          en: "Freelance Performance Planner",
        } satisfies LocalizedText,
        desc: {
          vi: "Thiết kế ma trận Creative Testing, tối ưu Ads đa kênh và nâng tỷ lệ chuyển đổi Landing Page.",
          en: "Architecting creative testing sprints, multi-channel paid media, and Landing Page CRO.",
        } satisfies LocalizedText,
      },
      {
        code: "MODE 03",
        title: {
          vi: "1:1 Strategic & Ops Advisory",
          en: "1:1 Strategic & Ops Advisory",
        } satisfies LocalizedText,
        desc: {
          vi: "Kiểm toán hệ thống GA4/CAPI, xây dựng Looker Studio Dashboard và chuẩn hóa vòng lặp Data-Creative.",
          en: "Auditing GA4/CAPI attribution, Looker Studio BI dashboards, and Data-to-Creative workflows.",
        } satisfies LocalizedText,
      },
    ],
  },
};
