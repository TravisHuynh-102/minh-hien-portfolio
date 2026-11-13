"use client";

import * as React from "react";
import {
  Briefcase,
  Layers,
  Rocket,
  Sparkles,
  Table2,
  TrendingUp,
} from "lucide-react";
import Timeline, {
  type TimelineItemData,
} from "@/components/ui/timeline-01-utils/timeline";
import { Badge } from "@/components/ui/badge";
import { useUIStore } from "@/store/use-ui-store";
import { cn } from "@/lib/utils";

type TimelineTrackFilter = "all" | "inhouse" | "freelance";

interface CategorizedTimelineItem extends TimelineItemData {
  track: "inhouse" | "freelance";
}

interface QuickReferenceRow {
  period: string;
  group: string;
  groupVariant: "cyan" | "violet" | "amber" | "emerald";
  role: string;
  focus: string;
  track: "inhouse" | "freelance";
}

const SUMMARY_PILLARS = {
  vi: [
    {
      metric: "2022 – HIỆN TẠI",
      subtitle: "Hơn 4 năm lộ trình chuyên môn xuyên suốt",
      accent: "border-[#C05E3E] bg-[#C05E3E] text-[#FAF9F6]",
      subText: "text-[#FAF9F6]/90",
    },
    {
      metric: "03 VỊ TRÍ IN-HOUSE",
      subtitle: "Quản trị Marcom, Sáng tạo, Đa phương tiện & Tăng trưởng",
      accent: "border-[#D1CCC4] bg-[#EFECE6] text-[#0E0E0E]",
      subText: "text-[#5C5852]",
    },
    {
      metric: "04 DỰ ÁN FREELANCE & STARTUP",
      subtitle: "Performance Ads B2B/B2C, Tư vấn 1:1 & Xây dựng thương hiệu",
      accent: "border-[#D1CCC4] bg-[#E6E2DA] text-[#0E0E0E]",
      subText: "text-[#5C5852]",
    },
  ],
  en: [
    {
      metric: "2022 – PRESENT",
      subtitle: "4+ years of continuous full-stack marketing & growth execution",
      accent: "border-[#C05E3E] bg-[#C05E3E] text-[#FAF9F6]",
      subText: "text-[#FAF9F6]/90",
    },
    {
      metric: "03 IN-HOUSE ROLES",
      subtitle: "Marcom Management, Creative Leadership, Multimedia & Growth",
      accent: "border-[#D1CCC4] bg-[#EFECE6] text-[#0E0E0E]",
      subText: "text-[#5C5852]",
    },
    {
      metric: "04 FREELANCE & STARTUP VENTURES",
      subtitle: "B2B/B2C Performance Ads, 1:1 Founder Advisory & Brand Growth",
      accent: "border-[#D1CCC4] bg-[#E6E2DA] text-[#0E0E0E]",
      subText: "text-[#5C5852]",
    },
  ],
};

const TIMELINE_ITEMS_VI: CategorizedTimelineItem[] = [
  // ================= PHẦN 1: IN-HOUSE / FULL-TIME =================
  {
    id: "uef-marcom",
    track: "inhouse",
    date: "04/2024 – Hiện tại",
    groupTag: "In-house / Full-time",
    groupVariant: "cyan",
    title: "Marcom Executive & Creative Team Leader",
    organization: "Đại học Kinh tế - Tài chính TP.HCM (UEF)",
    metricPill: "Chuỗi 5 Chiến dịch Thương hiệu & Tuyển sinh Trọng điểm",
    description:
      "Dẫn dắt hoạt động Quản trị Truyền thông Thương hiệu (Marcom), đội ngũ Sáng tạo đa phương tiện và điều phối các chiến dịch sự kiện – tuyển sinh quy mô toàn trường.",
    bullets: [
      {
        label: "Quản trị đội ngũ & sản xuất đa kênh",
        text: "Quản lý phát triển nội dung, sản xuất video, thiết kế đồ họa và điều phối truyền thông sự kiện trên hệ sinh thái kênh số của nhà trường.",
      },
      {
        label: "Chiến dịch thương hiệu & tuyển sinh",
        text: 'Trực tiếp dẫn dắt truyền thông tuyển sinh và định hình các chuỗi nội dung thương hiệu chủ lực gồm "Voice of UEFers", "HUMANS OF UEF", "UEF GLOBAL CONNECT", "UEF REAL-WORLD READY" và "UEF IMPACT IN ACTION".',
      },
      {
        label: "Truyền thông sự kiện trọng điểm",
        text: "Điều phối truyền thông cho Lễ tốt nghiệp (04/2026 & 08/2026), cuộc thi công nghệ UniHackfest 2026 (06/2026), Miss UEF 2026 và chiến dịch thương hiệu kỷ niệm 19 năm thành lập UEF.",
      },
      {
        label: "Phát triển dự án & đối tác",
        text: 'Xây dựng và khởi chạy đề án thí điểm "UEF Student Ambassadors" (The Alpha Cohort – 10/2026, ngân sách 10,5 triệu VNĐ); phối hợp hoàn thiện Phụ lục hợp đồng quảng cáo với đối tác agency (09/2026).',
      },
    ],
    tags: [
      "Voice of UEFers",
      "HUMANS OF UEF",
      "UniHackfest 2026",
      "Miss UEF 2026",
      "UEF Student Ambassadors",
    ],
    image:
      "https://cdn.21st.dev/assets/localized/0ea25e6c9f3a254d713265295d48f2f515a3ce40d9cf2adcfd9454a3a96df996.webp",
  },
  {
    id: "nanovet-pharma",
    track: "inhouse",
    date: "04/2023 – 04/2024",
    groupTag: "In-house / Full-time",
    groupVariant: "cyan",
    title: "Marketing Executive",
    organization: "Nanovet Pharma JSC",
    metricPill: "Chuẩn hóa Trade Kit cho >50 Đại lý Phân phối",
    description:
      "Phụ trách hoạch định truyền thông sản phẩm, sản xuất đa phương tiện và chuẩn hóa hệ thống tài liệu bán hàng cho mạng lưới đại lý toàn quốc.",
    bullets: [
      {
        label: "Triển khai Marketing tổng thể",
        text: "Phụ trách lập kế hoạch và vận hành các hoạt động truyền thông – tiếp thị sản phẩm của doanh nghiệp trên các kênh mục tiêu.",
      },
      {
        label: "Sản xuất ấn phẩm đa phương tiện",
        text: "Trực tiếp thiết kế, sản xuất các ấn phẩm truyền thông đa phương tiện (multimedia) phục vụ nhận diện thương hiệu và chiến dịch bán hàng.",
      },
      {
        label: "Hỗ trợ hệ thống phân phối",
        text: "Xây dựng và chuẩn hóa bộ tài liệu truyền thông – bán hàng chuyên biệt hỗ trợ mạng lưới hơn 50 đại lý phân phối trên thị trường.",
      },
    ],
    tags: [
      "Integrated Marketing",
      "Multimedia Production",
      "50+ Distribution Dealers",
      "Sales Enablement Kit",
    ],
    image:
      "https://cdn.21st.dev/assets/localized/8fcabd896d283359f9f601b92bce74fc06aa48f368e56afbd21dca69a9742809.webp",
  },
  {
    id: "aircity-cgo",
    track: "inhouse",
    date: "07/2022 – 03/2023",
    groupTag: "In-house / Full-time",
    groupVariant: "cyan",
    title: "CGO's Assistant (Trợ lý Giám đốc Tăng trưởng)",
    organization: "AirCity Co., Ltd",
    metricPill: "B2B Lead-Generation & Strategic Partnerships",
    description:
      "Đồng hành trực tiếp cùng Chief Growth Officer tại PropTech Startup trong hoạch định kế hoạch kinh doanh, tối ưu phễu chuyển đổi và phát triển đối tác.",
    bullets: [
      {
        label: "Thực thi kế hoạch tăng trưởng",
        text: "Hỗ trợ trực tiếp Giám đốc Tăng trưởng (Chief Growth Officer) trong công tác hoạch định, theo dõi và điều phối các kế hoạch phát triển kinh doanh.",
      },
      {
        label: "Tối ưu chuyển đổi & đối tác",
        text: "Trực tiếp tối ưu hóa các chiến dịch thu hút khách hàng tiềm năng (lead-generation) và quản trị quan hệ với các đối tác chiến lược.",
      },
    ],
    tags: [
      "CGO Office",
      "Growth Planning",
      "Lead Generation",
      "Strategic Partnerships",
    ],
    image:
      "https://cdn.21st.dev/assets/localized/f8596260a4e342a4a2d85e821ff477a8e71182f373aea763dfd4f13fe657f5fa.webp",
  },

  // ================= PHẦN 2: FREELANCE, TƯ VẤN & KHỞI NGHIỆP =================
  {
    id: "freelance-sparring-partner",
    track: "freelance",
    date: "06/2026 – Hiện tại",
    groupTag: "Freelance & Advisory",
    groupVariant: "amber",
    title: "Freelance Digital Performance Planner & Founder Sparring Partner",
    organization: "Hoạt động Tư vấn & Triển khai Độc lập (Huỳnh Minh Hiển)",
    metricPill: "Ngân sách B2B 180 Triệu VNĐ/năm • 3DS & Trutech",
    description:
      "Cung cấp dịch vụ hoạch định Performance Ads đa nền tảng (Campaign/Retainer), chiến lược B2B 12 tháng cho doanh nghiệp công nghiệp công nghệ cao và cố vấn vận hành 1:1 cho Founder.",
    bullets: [
      {
        label: "Hoạch định & Tối ưu Performance Ads",
        text: "Cung cấp dịch vụ quảng cáo đa nền tảng (Facebook, Google) theo 2 mô hình: chạy lẻ theo chiến dịch ngắn hạn (Campaign-based) và quản trị dài hạn theo tháng/quý (Retainer-based), bao gồm tư vấn phân phối, cam kết KPIs và báo cáo định kỳ.",
      },
      {
        label: "Chiến lược B2B Performance 12 tháng",
        text: "Trực tiếp thực thi chiến dịch B2B Digital Performance Marketing cho 3D Smart Solutions (3DS) và Trutech (từ 08/2026) với ngân sách quảng cáo 180 triệu VNĐ/năm, bao gồm chuỗi video 9:16 nhắm mục tiêu nhóm sản xuất HMLV tại Khu Công nghệ cao TP.HCM và chiến dịch hội thảo B2B (12/2026).",
      },
      {
        label: "Cố vấn vận hành 1:1 (Advisory)",
        text: "Phát triển và triển khai khung cố vấn chiến lược & kiểm toán vận hành (Strategic Operations Audit & Founder Sparring Partner) dành riêng cho các founder chuyên môn kỹ thuật.",
      },
    ],
    tags: [
      "Facebook & Google Ads",
      "3D Smart Solutions (3DS)",
      "Trutech B2B",
      "HMLV Saigon Hi-Tech Park",
      "Founder Sparring Partner",
    ],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "los-gatos-creativo",
    track: "freelance",
    date: "06/2023 – 02/2025",
    groupTag: "Startup / Co-Founder",
    groupVariant: "violet",
    title: "Co-Founder & Growth Manager",
    organization: "Los Gatos Creativo",
    metricPill: "+200% Doanh thu Dự án trong 3 Tháng",
    description:
      "Đồng sáng lập Creative & Growth Studio, điều hành trực tiếp đội ngũ 5 nhân sự và tư vấn chiến lược thương hiệu – tăng trưởng cho khách hàng SME.",
    bullets: [
      {
        label: "Điều hành đội ngũ sáng tạo",
        text: "Đồng sáng lập và trực tiếp quản trị vận hành đội ngũ gồm 5 nhân sự phụ trách thiết kế, nội dung và truyền thông.",
      },
      {
        label: "Tư vấn thương hiệu & tăng trưởng",
        text: "Cung cấp giải pháp tư vấn nhận diện thương hiệu và thực thi chiến lược tăng trưởng, giúp doanh thu dự án tăng 200% trong vòng 3 tháng.",
      },
    ],
    tags: [
      "Co-Founder",
      "5-Member Creative Team",
      "Brand Identity",
      "+200% Revenue in 3 Months",
    ],
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "lean-social",
    track: "freelance",
    date: "06/2022 – 05/2023",
    groupTag: "Startup / Founding Team",
    groupVariant: "violet",
    title: "Founding Team & Community Manager",
    organization: "LEAN Social",
    metricPill: "Xây dựng Cộng đồng Gen Z từ Giai đoạn 0 → 1",
    description:
      "Tham gia đội ngũ sáng lập từ giai đoạn khởi tạo, định hình chiến lược sản phẩm và phát triển cộng đồng người dùng mục tiêu thuộc phân khúc Gen Z.",
    bullets: [
      {
        label: "Đội ngũ sáng lập",
        text: "Tham gia xây dựng dự án từ giai đoạn khởi tạo, đóng góp định hướng phát triển sản phẩm và chiến lược tiếp cận người dùng trẻ.",
      },
      {
        label: "Phát triển cộng đồng Gen Z",
        text: "Phụ trách định hướng nội dung và trực tiếp xây dựng, mở rộng cộng đồng người dùng mục tiêu thuộc phân khúc Gen Z.",
      },
    ],
    tags: [
      "Founding Team",
      "Go-to-Market Strategy",
      "Gen Z Community Growth",
      "Content Direction",
    ],
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "tiktok-batansach",
    track: "freelance",
    date: "02/2022 – 06/2022",
    groupTag: "Dự án / Team Leader",
    groupVariant: "emerald",
    title: "Team Leader",
    organization: "Dự án kênh TikTok BaTanSach",
    metricPill: "Tối ưu Thuật toán & Độ phủ Tự nhiên Short-form Video",
    description:
      "Quản lý toàn trình dây chuyền sản xuất nội dung video ngắn trên nền tảng TikTok từ nghiên cứu chủ đề, kịch bản đến quay dựng và tối ưu chỉ số tương tác.",
    bullets: [
      {
        label: "Quản lý sản xuất nội dung ngắn",
        text: "Dẫn dắt đội ngũ sáng tạo nội dung, quản lý xuyên suốt quy trình từ nghiên cứu chủ đề, lên kịch bản đến tổ chức quay dựng.",
      },
      {
        label: "Tối ưu hóa kênh TikTok",
        text: "Trực tiếp theo dõi chỉ số tương tác và tối ưu hóa định dạng video ngắn nhằm gia tăng độ phủ tự nhiên trên nền tảng TikTok.",
      },
    ],
    tags: [
      "TikTok Growth",
      "Short-Form Video Production",
      "Scriptwriting & Directing",
      "Organic Reach Optimization",
    ],
    image:
      "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=1200&q=85",
  },
];

const TIMELINE_ITEMS_EN: CategorizedTimelineItem[] = [
  {
    id: "uef-marcom",
    track: "inhouse",
    date: "04/2024 – Present",
    groupTag: "In-house / Full-time",
    groupVariant: "cyan",
    title: "Marcom Executive & Creative Team Leader",
    organization: "Ho Chi Minh City University of Economics and Finance (UEF)",
    metricPill: "5 Flagship Brand Series & University-Wide Campaigns",
    description:
      "Spearheading brand communications, leading the multi-disciplinary creative production team, and orchestrating flagship institutional & enrollment campaigns.",
    bullets: [
      {
        label: "Team Leadership & Cross-Channel Production",
        text: "Manage content development, video production, graphic design, and event communications across the university's digital ecosystem.",
      },
      {
        label: "Brand & Enrollment Campaigns",
        text: 'Lead enrollment marketing and architect flagship brand content series including "Voice of UEFers", "HUMANS OF UEF", "UEF GLOBAL CONNECT", "UEF REAL-WORLD READY", and "UEF IMPACT IN ACTION".',
      },
      {
        label: "Flagship Event Communications",
        text: "Orchestrate end-to-end communications for Graduation Ceremonies (04/2026 & 08/2026), UniHackfest 2026 Tech Competition (06/2026), Miss UEF 2026, and the UEF 19th Anniversary Brand Campaign.",
      },
      {
        label: "Project & Partner Development",
        text: 'Designed and launched the pilot "UEF Student Ambassadors" program (The Alpha Cohort – 10/2026, 10.5M VND budget) and finalized agency advertising contract addendums (09/2026).',
      },
    ],
    tags: [
      "Voice of UEFers",
      "HUMANS OF UEF",
      "UniHackfest 2026",
      "Miss UEF 2026",
      "UEF Student Ambassadors",
    ],
    image:
      "https://cdn.21st.dev/assets/localized/0ea25e6c9f3a254d713265295d48f2f515a3ce40d9cf2adcfd9454a3a96df996.webp",
  },
  {
    id: "nanovet-pharma",
    track: "inhouse",
    date: "04/2023 – 04/2024",
    groupTag: "In-house / Full-time",
    groupVariant: "cyan",
    title: "Marketing Executive",
    organization: "Nanovet Pharma JSC",
    metricPill: "Standardized Sales & Trade Kit for 50+ Dealers",
    description:
      "Executed integrated product marketing, produced multimedia brand assets, and built standardized sales enablement toolkits for a nationwide dealer network.",
    bullets: [
      {
        label: "Integrated Marketing Execution",
        text: "Planned and operated end-to-end product communication and marketing campaigns across target industry channels.",
      },
      {
        label: "Multimedia Asset Production",
        text: "Designed and produced multimedia communication materials supporting brand identity and commercial sales campaigns.",
      },
      {
        label: "Distribution Network Enablement",
        text: "Built and standardized specialized marketing and sales collateral supporting a network of over 50 distribution dealers.",
      },
    ],
    tags: [
      "Integrated Marketing",
      "Multimedia Production",
      "50+ Distribution Dealers",
      "Sales Enablement Kit",
    ],
    image:
      "https://cdn.21st.dev/assets/localized/8fcabd896d283359f9f601b92bce74fc06aa48f368e56afbd21dca69a9742809.webp",
  },
  {
    id: "aircity-cgo",
    track: "inhouse",
    date: "07/2022 – 03/2023",
    groupTag: "In-house / Full-time",
    groupVariant: "cyan",
    title: "CGO's Assistant (Assistant to Chief Growth Officer)",
    organization: "AirCity Co., Ltd",
    metricPill: "B2B Lead-Generation & Strategic Partnerships",
    description:
      "Worked directly alongside the Chief Growth Officer to plan business expansion, optimize lead-generation funnels, and manage strategic partnerships.",
    bullets: [
      {
        label: "Growth Plan Execution",
        text: "Directly assisted the Chief Growth Officer (CGO) in planning, tracking, and coordinating business development initiatives.",
      },
      {
        label: "Conversion Optimization & Partnerships",
        text: "Optimized lead-generation campaigns and managed relationships with key strategic partners.",
      },
    ],
    tags: [
      "CGO Office",
      "Growth Planning",
      "Lead Generation",
      "Strategic Partnerships",
    ],
    image:
      "https://cdn.21st.dev/assets/localized/f8596260a4e342a4a2d85e821ff477a8e71182f373aea763dfd4f13fe657f5fa.webp",
  },
  {
    id: "freelance-sparring-partner",
    track: "freelance",
    date: "06/2026 – Present",
    groupTag: "Freelance & Advisory",
    groupVariant: "amber",
    title: "Freelance Digital Performance Planner & Founder Sparring Partner",
    organization: "Independent Consulting & Performance Practice (Huynh Minh Hien)",
    metricPill: "180M VND/Year B2B Ad Budget • 3DS & Trutech",
    description:
      "Delivering multi-platform Performance Ads (Campaign & Retainer models), 12-month B2B industrial performance roadmaps, and 1:1 operational advisory for technical founders.",
    bullets: [
      {
        label: "Performance Ads Planning & Optimization",
        text: "Provide Facebook & Google Ads services under two models: short-term Campaign-based bursts and long-term monthly/quarterly Retainers, including media allocation, KPI commitments, and periodic reporting.",
      },
      {
        label: "12-Month B2B Performance Strategy",
        text: "Execute B2B Digital Performance Marketing for 3D Smart Solutions (3DS) and Trutech (from 08/2026) with a 180M VND/year ad budget, featuring 9:16 vertical video series targeting HMLV manufacturers at Saigon Hi-Tech Park and a B2B seminar campaign (12/2026).",
      },
      {
        label: "1:1 Operational Advisory",
        text: "Developed and deployed the Strategic Operations Audit & Founder Sparring Partner framework tailored specifically for technical founders.",
      },
    ],
    tags: [
      "Facebook & Google Ads",
      "3D Smart Solutions (3DS)",
      "Trutech B2B",
      "HMLV Saigon Hi-Tech Park",
      "Founder Sparring Partner",
    ],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "los-gatos-creativo",
    track: "freelance",
    date: "06/2023 – 02/2025",
    groupTag: "Startup / Co-Founder",
    groupVariant: "violet",
    title: "Co-Founder & Growth Manager",
    organization: "Los Gatos Creativo",
    metricPill: "+200% Project Revenue Growth within 3 Months",
    description:
      "Co-founded a creative & growth agency, managing a 5-member cross-functional team and delivering brand identity & growth consulting.",
    bullets: [
      {
        label: "Creative Team Operations",
        text: "Co-founded and directly managed a 5-member team across graphic design, content creation, and media communications.",
      },
      {
        label: "Brand & Growth Consulting",
        text: "Delivered brand identity consulting and executed growth strategies that increased project revenue by 200% within 3 months.",
      },
    ],
    tags: [
      "Co-Founder",
      "5-Member Creative Team",
      "Brand Identity",
      "+200% Revenue in 3 Months",
    ],
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "lean-social",
    track: "freelance",
    date: "06/2022 – 05/2023",
    groupTag: "Startup / Founding Team",
    groupVariant: "violet",
    title: "Founding Team & Community Manager",
    organization: "LEAN Social",
    metricPill: "0 → 1 Gen Z Community & Product Positioning",
    description:
      "Joined the founding team at inception to shape youth go-to-market strategy and scale the target Gen Z user community.",
    bullets: [
      {
        label: "Founding Team Strategy",
        text: "Contributed to product direction and youth user acquisition strategy from the earliest founding stage.",
      },
      {
        label: "Gen Z Community Growth",
        text: "Directed content pillars and actively built and expanded the target Gen Z user community.",
      },
    ],
    tags: [
      "Founding Team",
      "Go-to-Market Strategy",
      "Gen Z Community Growth",
      "Content Direction",
    ],
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "tiktok-batansach",
    track: "freelance",
    date: "02/2022 – 06/2022",
    groupTag: "Project / Team Leader",
    groupVariant: "emerald",
    title: "Team Leader",
    organization: "BaTanSach TikTok Channel Project",
    metricPill: "End-to-End Short-Form Video & Organic Reach Growth",
    description:
      "Led the creative content team across topic research, scriptwriting, filming, and TikTok algorithm optimization.",
    bullets: [
      {
        label: "Short-Form Content Production Lead",
        text: "Led the content team across the full production pipeline from topic research and scriptwriting to filming and editing.",
      },
      {
        label: "TikTok Channel Optimization",
        text: "Tracked engagement metrics and optimized short-video formats to maximize organic reach on TikTok.",
      },
    ],
    tags: [
      "TikTok Growth",
      "Short-Form Video Production",
      "Scriptwriting & Directing",
      "Organic Reach Optimization",
    ],
    image:
      "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=1200&q=85",
  },
];

const QUICK_REFERENCE_MATRIX: {
  vi: QuickReferenceRow[];
  en: QuickReferenceRow[];
} = {
  vi: [
    {
      period: "06/2026 – Nay",
      group: "Freelance",
      groupVariant: "amber",
      role: "Digital Performance Planner & Sparring Partner",
      focus:
        "Quảng cáo Campaign/Retainer; B2B 3DS & Trutech (180tr/năm); Cố vấn 1:1",
      track: "freelance",
    },
    {
      period: "04/2024 – Nay",
      group: "In-house",
      groupVariant: "cyan",
      role: "Marcom Executive & Creative Team Leader",
      focus:
        "ĐH UEF – Quản lý nội dung, video, thiết kế, tuyển sinh & sự kiện lớn",
      track: "inhouse",
    },
    {
      period: "06/2023 – 02/2025",
      group: "Startup",
      groupVariant: "violet",
      role: "Co-Founder & Growth Manager",
      focus:
        "Los Gatos Creativo – Quản lý team 5 người, tăng 200% doanh thu sau 3 tháng",
      track: "freelance",
    },
    {
      period: "04/2023 – 04/2024",
      group: "In-house",
      groupVariant: "cyan",
      role: "Marketing Executive",
      focus: "Nanovet Pharma JSC – Sản xuất multimedia, bộ tài liệu cho >50 đại lý",
      track: "inhouse",
    },
    {
      period: "07/2022 – 03/2023",
      group: "In-house",
      groupVariant: "cyan",
      role: "CGO's Assistant",
      focus: "AirCity Co., Ltd – Tối ưu lead-generation & phát triển đối tác",
      track: "inhouse",
    },
    {
      period: "06/2022 – 05/2023",
      group: "Startup",
      groupVariant: "violet",
      role: "Founding Team & Community Manager",
      focus: "LEAN Social – Định hướng nội dung & xây dựng cộng đồng Gen Z",
      track: "freelance",
    },
    {
      period: "02/2022 – 06/2022",
      group: "Dự án",
      groupVariant: "emerald",
      role: "Team Leader",
      focus: "TikTok BaTanSach – Quản lý kịch bản, sản xuất & tối ưu video ngắn",
      track: "freelance",
    },
  ],
  en: [
    {
      period: "06/2026 – Present",
      group: "Freelance",
      groupVariant: "amber",
      role: "Digital Performance Planner & Sparring Partner",
      focus:
        "Campaign/Retainer Ads; B2B 3DS & Trutech (180M VND/yr); 1:1 Founder Advisory",
      track: "freelance",
    },
    {
      period: "04/2024 – Present",
      group: "In-house",
      groupVariant: "cyan",
      role: "Marcom Executive & Creative Team Leader",
      focus:
        "UEF University – Content, video, design leadership, enrollment & flagship events",
      track: "inhouse",
    },
    {
      period: "06/2023 – 02/2025",
      group: "Startup",
      groupVariant: "violet",
      role: "Co-Founder & Growth Manager",
      focus:
        "Los Gatos Creativo – Led 5-person team, +200% project revenue in 3 months",
      track: "freelance",
    },
    {
      period: "04/2023 – 04/2024",
      group: "In-house",
      groupVariant: "cyan",
      role: "Marketing Executive",
      focus:
        "Nanovet Pharma JSC – Multimedia production & sales kits for 50+ dealers",
      track: "inhouse",
    },
    {
      period: "07/2022 – 03/2023",
      group: "In-house",
      groupVariant: "cyan",
      role: "CGO's Assistant",
      focus: "AirCity Co., Ltd – Lead-generation optimization & strategic partners",
      track: "inhouse",
    },
    {
      period: "06/2022 – 05/2023",
      group: "Startup",
      groupVariant: "violet",
      role: "Founding Team & Community Manager",
      focus: "LEAN Social – Content direction & Gen Z community building",
      track: "freelance",
    },
    {
      period: "02/2022 – 06/2022",
      group: "Project",
      groupVariant: "emerald",
      role: "Team Leader",
      focus:
        "TikTok BaTanSach – Scriptwriting, production & short-video optimization",
      track: "freelance",
    },
  ],
};

export const TimelineBlock01 = () => {
  const { lang } = useUIStore();
  const [activeTrack, setActiveTrack] =
    React.useState<TimelineTrackFilter>("all");
  const [showMatrix, setShowMatrix] = React.useState(false);

  const allItems = lang === "vi" ? TIMELINE_ITEMS_VI : TIMELINE_ITEMS_EN;
  const inhouseItems = React.useMemo(
    () => allItems.filter((item) => item.track === "inhouse"),
    [allItems]
  );
  const freelanceItems = React.useMemo(
    () => allItems.filter((item) => item.track === "freelance"),
    [allItems]
  );

  const pillars = SUMMARY_PILLARS[lang];
  const matrixRows = QUICK_REFERENCE_MATRIX[lang];

  return (
    <section className="overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        {/* =========================================================
            HEADER & 3 SUMMARY PILLARS (CLAUDE CRIMSON FRAME)
        ========================================================= */}
        <div className="rounded-t-lg border border-[#D1CCC4] bg-[#FAF9F6] px-6 py-10 md:px-10 md:py-14 lg:px-14 lg:py-16">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-3xl space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge
                  variant="default"
                  className="rounded-lg px-3 py-1 font-mono text-xs uppercase tracking-wider"
                >
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                  {lang === "vi"
                    ? "CV EXPERIENCE TIMELINE // 2022 – HIỆN TẠI"
                    : "CV EXPERIENCE TIMELINE // 2022 – PRESENT"}
                </Badge>
                <Badge
                  variant="secondary"
                  className="rounded-lg px-3 py-1 font-mono text-xs"
                >
                  HUỲNH MINH HIỂN
                </Badge>
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl font-bold tracking-tight text-[#0E0E0E] sm:text-3xl md:text-4xl lg:text-[42px] lg:leading-[1.15]">
                  {lang === "vi"
                    ? "Timeline Kinh Nghiệm Chuyên Môn"
                    : "Professional Experience Timeline"}
                </h2>
                <p className="font-mono text-xs font-semibold tracking-wide text-[#C05E3E] sm:text-sm">
                  Marcom & Creative Team Leader &nbsp;|&nbsp; Digital Performance
                  Planner &nbsp;|&nbsp; Founder Sparring Partner
                </p>
                <p className="text-sm leading-relaxed text-[#5C5852] md:text-base">
                  {lang === "vi"
                    ? "Hơn 4 năm lộ trình chuyên môn xuyên suốt kết hợp giữa quản trị hệ thống Marcom & đội ngũ Sáng tạo In-house tại các tổ chức giáo dục đại học, dược phẩm, công nghệ với thực chiến Performance Ads B2B/B2C & Cố vấn vận hành độc lập."
                    : "Over 4 years of continuous progression combining In-House Marcom & Creative leadership across higher education, pharma, and PropTech with independent B2B/B2C Performance Ads and 1:1 Founder Advisory."}
                </p>
              </div>
            </div>

            {/* Track Switcher Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTrack("all")}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 font-mono text-xs transition-colors",
                  activeTrack === "all"
                    ? "border-[#C05E3E] bg-[#C05E3E] font-semibold text-[#FAF9F6]"
                    : "border-[#D1CCC4] bg-[#EFECE6] text-[#0E0E0E] hover:bg-[#E6E2DA]"
                )}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>
                  {lang === "vi" ? "Tất cả (07)" : "All Milestones (07)"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTrack("inhouse")}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 font-mono text-xs transition-colors",
                  activeTrack === "inhouse"
                    ? "border-[#C05E3E] bg-[#C05E3E] font-semibold text-[#FAF9F6]"
                    : "border-[#D1CCC4] bg-[#EFECE6] text-[#0E0E0E] hover:bg-[#E6E2DA]"
                )}
              >
                <Briefcase className="h-3.5 w-3.5" />
                <span>
                  {lang === "vi" ? "Phần 1: In-house (03)" : "Part 1: In-house (03)"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTrack("freelance")}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 font-mono text-xs transition-colors",
                  activeTrack === "freelance"
                    ? "border-[#C05E3E] bg-[#C05E3E] font-semibold text-[#FAF9F6]"
                    : "border-[#D1CCC4] bg-[#EFECE6] text-[#0E0E0E] hover:bg-[#E6E2DA]"
                )}
              >
                <Rocket className="h-3.5 w-3.5" />
                <span>
                  {lang === "vi"
                    ? "Phần 2: Freelance & Startup (04)"
                    : "Part 2: Freelance & Startup (04)"}
                </span>
              </button>
            </div>
          </div>

          {/* 3 Headline Summary Stat Cards from CV Document */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className={cn("rounded-lg border p-4 sm:p-5", pillar.accent)}
              >
                <div className="font-mono text-base font-bold tracking-tight sm:text-lg">
                  {pillar.metric}
                </div>
                <p
                  className={cn(
                    "mt-1 text-xs leading-relaxed sm:text-sm",
                    pillar.subText
                  )}
                >
                  {pillar.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================
            PHẦN 1: KINH NGHIỆM LÀM VIỆC CHÍNH THỨC (IN-HOUSE / FULL-TIME)
        ========================================================= */}
        {(activeTrack === "all" || activeTrack === "inhouse") && (
          <div className="border-x border-b border-[#D1CCC4]">
            <div className="border-b border-[#D1CCC4] bg-[#E6E2DA] px-6 py-4 md:px-10">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Briefcase className="h-4 w-4 text-[#C05E3E]" />
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0E0E0E] sm:text-sm">
                    {lang === "vi"
                      ? "PHẦN 1. KINH NGHIỆM LÀM VIỆC CHÍNH THỨC (IN-HOUSE / FULL-TIME)"
                      : "PART 1. OFFICIAL IN-HOUSE / FULL-TIME EXPERIENCE"}
                  </h3>
                </div>
                <span className="font-mono text-xs text-[#5C5852]">
                  {lang === "vi"
                    ? "Giáo dục Đại học • Dược phẩm • Công nghệ (2022 – Hiện tại)"
                    : "Higher Education • Pharmaceuticals • PropTech (2022 – Present)"}
                </span>
              </div>
            </div>

            <Timeline items={inhouseItems} />
          </div>
        )}

        {/* =========================================================
            PHẦN 2: KINH NGHIỆM FREELANCE, TƯ VẤN & DỰ ÁN KHỞI NGHIỆP
        ========================================================= */}
        {(activeTrack === "all" || activeTrack === "freelance") && (
          <div className="border-x border-b border-[#D1CCC4]">
            <div className="border-b border-[#D1CCC4] bg-[#E6E2DA] px-6 py-4 md:px-10">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="h-4 w-4 text-[#C05E3E]" />
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0E0E0E] sm:text-sm">
                    {lang === "vi"
                      ? "PHẦN 2. KINH NGHIỆM FREELANCE, TƯ VẤN & DỰ ÁN KHỞI NGHIỆP"
                      : "PART 2. FREELANCE, ADVISORY & STARTUP VENTURES"}
                  </h3>
                </div>
                <span className="font-mono text-xs text-[#5C5852]">
                  {lang === "vi"
                    ? "Tư vấn độc lập • Performance Ads B2B/B2C • Đồng sáng lập (2022 – Hiện tại)"
                    : "Independent Advisory • B2B/B2C Performance Ads • Co-Founding (2022 – Present)"}
                </span>
              </div>
            </div>

            <Timeline items={freelanceItems} />
          </div>
        )}

        {/* =========================================================
            PHẦN 3: BẢNG TỔNG HỢP ĐỐI CHIẾU NHANH (QUICK REFERENCE MATRIX)
        ========================================================= */}
        <div className="rounded-b-lg border-x border-b border-[#D1CCC4] bg-[#EFECE6] px-6 py-8 md:px-10 md:py-12">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#C05E3E]">
                <Table2 className="h-4 w-4" />
                <span>
                  {lang === "vi"
                    ? "PHẦN 3. BẢNG TỔNG HỢP ĐỐI CHIẾU NHANH (QUICK REFERENCE MATRIX)"
                    : "PART 3. QUICK REFERENCE MATRIX (EXECUTIVE SUMMARY)"}
                </span>
              </div>
              <p className="mt-1 text-xs text-[#5C5852] sm:text-sm">
                {lang === "vi"
                  ? "Bảng tóm tắt phục vụ tra cứu nhanh toàn bộ 07 cột mốc chuyên môn từ 2022 đến nay."
                  : "Consolidated 7-milestone matrix for rapid executive and recruiter screening (2022 – Present)."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowMatrix((prev) => !prev)}
              className="self-start rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] px-3.5 py-1.5 font-mono text-xs text-[#0E0E0E] transition hover:bg-[#E6E2DA] sm:self-auto"
            >
              {showMatrix
                ? lang === "vi"
                  ? "Thu gọn bảng"
                  : "Collapse Matrix"
                : lang === "vi"
                  ? "Mở rộng bảng (07)"
                  : "Expand Matrix (07)"}
            </button>
          </div>

          {showMatrix && (
            <div className="mt-6 overflow-x-auto rounded-lg border border-[#D1CCC4] bg-[#FAF9F6]">
              <table className="w-full min-w-[680px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#D1CCC4] bg-[#E6E2DA] font-mono text-[11px] uppercase tracking-wider text-[#5C5852]">
                    <th className="px-4 py-3.5">
                      {lang === "vi" ? "Giai đoạn" : "Period"}
                    </th>
                    <th className="px-4 py-3.5">
                      {lang === "vi" ? "Phân nhóm" : "Category"}
                    </th>
                    <th className="px-4 py-3.5">
                      {lang === "vi" ? "Vị trí / Vai trò" : "Role / Title"}
                    </th>
                    <th className="px-4 py-3.5">
                      {lang === "vi"
                        ? "Đơn vị / Trọng tâm kết quả"
                        : "Organization / Key Deliverables"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D1CCC4] text-xs sm:text-sm">
                  {matrixRows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      onClick={() => setActiveTrack(row.track)}
                      className="cursor-pointer transition-colors hover:bg-[#F5F3ED]"
                    >
                      <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs font-semibold text-[#C05E3E]">
                        {row.period}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5">
                        <Badge
                          variant={row.groupVariant}
                          className="rounded-lg px-2.5 py-0.5 text-[11px]"
                        >
                          {row.group}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-[#0E0E0E]">
                        {row.role}
                      </td>
                      <td className="px-4 py-3.5 text-[#5C5852]">
                        {row.focus}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TimelineBlock01;
