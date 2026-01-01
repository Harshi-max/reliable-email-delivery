import { EmailComponent } from "../EmailTemplateBuilder/Builder"

export interface EmailTemplate {
  id: string
  name: string
  category: string
  description: string
  emoji: string
  components: EmailComponent[]
}

export const prebuiltTemplates: EmailTemplate[] = [
  {
    id: "interview-invitation",
    name: "Interview Invitation",
    category: "HR",
    description: "Professional interview invitation email",
    emoji: "💼",
    components: [
      {
        id: "text-header",
        type: "text",
        content: "Interview Invitation - [Position Title]",
        styles: { fontSize: "24px", fontWeight: "bold", color: "#2563eb", textAlign: "center", padding: "20px" }
      },
      {
        id: "text-greeting",
        type: "text", 
        content: "Dear [Candidate Name],\n\nWe are pleased to invite you for an interview for the [Position Title] role at [Company Name].",
        styles: { fontSize: "16px", color: "#374151", padding: "15px", textAlign: "left" }
      },
      {
        id: "text-details",
        type: "text",
        content: "📅 Date: [Interview Date]\n⏰ Time: [Interview Time]\n📍 Location: [Interview Location]\n👥 Interviewer(s): [Interviewer Names]",
        styles: { fontSize: "16px", color: "#1f2937", padding: "15px", backgroundColor: "#f3f4f6", textAlign: "left" }
      },
      {
        id: "button-confirm",
        type: "button",
        content: "Confirm Interview",
        styles: { backgroundColor: "#10b981", color: "#ffffff", padding: "12px 24px", borderRadius: "8px", textAlign: "center", href: "#" }
      },
      {
        id: "text-footer",
        type: "text",
        content: "Best regards,\n[Your Name]\n[Your Title]\n[Company Name]",
        styles: { fontSize: "14px", color: "#6b7280", padding: "20px", textAlign: "left" }
      }
    ]
  },
  {
    id: "internship-offer",
    name: "Internship Offer",
    category: "HR", 
    description: "Internship opportunity offer letter",
    emoji: "🎓",
    components: [
      {
        id: "text-header",
        type: "text",
        content: "🎉 Congratulations! Internship Offer",
        styles: { fontSize: "26px", fontWeight: "bold", color: "#7c3aed", textAlign: "center", padding: "25px" }
      },
      {
        id: "text-content",
        type: "text",
        content: "Dear [Student Name],\n\nWe are excited to offer you an internship position at [Company Name] for the [Department/Team] team.\n\n📋 Position: [Internship Title]\n📅 Duration: [Start Date] to [End Date]\n💰 Stipend: [Amount]\n📍 Location: [Office Location]",
        styles: { fontSize: "16px", color: "#374151", padding: "20px", textAlign: "left" }
      },
      {
        id: "button-accept",
        type: "button", 
        content: "Accept Offer",
        styles: { backgroundColor: "#7c3aed", color: "#ffffff", padding: "14px 28px", borderRadius: "10px", textAlign: "center", href: "#" }
      },
      {
        id: "text-next-steps",
        type: "text",
        content: "Next Steps:\n• Complete the attached forms\n• Attend orientation on [Date]\n• Bring required documents\n\nWelcome to the team! 🚀",
        styles: { fontSize: "15px", color: "#1f2937", padding: "20px", backgroundColor: "#ede9fe", textAlign: "left" }
      }
    ]
  },
  {
    id: "leave-request",
    name: "Leave Request",
    category: "HR",
    description: "Employee leave request template",
    emoji: "🏖️",
    components: [
      {
        id: "text-subject",
        type: "text",
        content: "Leave Request - [Your Name]",
        styles: { fontSize: "22px", fontWeight: "bold", color: "#dc2626", textAlign: "center", padding: "20px" }
      },
      {
        id: "text-request",
        type: "text",
        content: "Dear [Manager Name],\n\nI would like to request leave for the following period:\n\n📅 From: [Start Date]\n📅 To: [End Date]\n📝 Reason: [Leave Reason]\n📞 Emergency Contact: [Contact Details]",
        styles: { fontSize: "16px", color: "#374151", padding: "18px", textAlign: "left" }
      },
      {
        id: "text-handover",
        type: "text",
        content: "Work Handover:\n• [Task 1] - Assigned to [Colleague]\n• [Task 2] - Completed before leave\n• [Task 3] - Scheduled for return",
        styles: { fontSize: "15px", color: "#1f2937", padding: "15px", backgroundColor: "#fef3c7", textAlign: "left" }
      },
      {
        id: "text-closing",
        type: "text",
        content: "Thank you for your consideration.\n\nBest regards,\n[Your Name]\n[Your Position]",
        styles: { fontSize: "14px", color: "#6b7280", padding: "20px", textAlign: "left" }
      }
    ]
  },
  {
    id: "welcome-email",
    name: "Welcome Email",
    category: "Onboarding",
    description: "New employee welcome message",
    emoji: "👋",
    components: [
      {
        id: "text-welcome",
        type: "text",
        content: "Welcome to [Company Name]! 🎉",
        styles: { fontSize: "28px", fontWeight: "bold", color: "#059669", textAlign: "center", padding: "25px" }
      },
      {
        id: "image-company",
        type: "image",
        content: "",
        styles: { src: "https://via.placeholder.com/400x200?text=Company+Logo", alt: "Company Logo", width: "100%", padding: "20px" }
      },
      {
        id: "text-message",
        type: "text",
        content: "Dear [Employee Name],\n\nWelcome to our team! We're thrilled to have you join us at [Company Name]. Your skills and experience will be a great addition to our [Department] team.",
        styles: { fontSize: "16px", color: "#374151", padding: "20px", textAlign: "left" }
      },
      {
        id: "button-portal",
        type: "button",
        content: "Access Employee Portal",
        styles: { backgroundColor: "#059669", color: "#ffffff", padding: "14px 28px", borderRadius: "8px", textAlign: "center", href: "#" }
      },
      {
        id: "social-connect",
        type: "social",
        content: "Connect with us on social media",
        styles: { padding: "25px", textAlign: "center" }
      }
    ]
  },
  {
    id: "meeting-reminder",
    name: "Meeting Reminder", 
    category: "Business",
    description: "Professional meeting reminder",
    emoji: "📅",
    components: [
      {
        id: "text-reminder",
        type: "text",
        content: "📅 Meeting Reminder",
        styles: { fontSize: "24px", fontWeight: "bold", color: "#1d4ed8", textAlign: "center", padding: "20px" }
      },
      {
        id: "text-details",
        type: "text",
        content: "Hi [Name],\n\nThis is a friendly reminder about our upcoming meeting:\n\n📋 Topic: [Meeting Topic]\n📅 Date: [Meeting Date]\n⏰ Time: [Meeting Time]\n📍 Location: [Meeting Location/Link]",
        styles: { fontSize: "16px", color: "#374151", padding: "18px", textAlign: "left" }
      },
      {
        id: "text-agenda",
        type: "text",
        content: "Agenda:\n• [Agenda Item 1]\n• [Agenda Item 2]\n• [Agenda Item 3]\n\nPlease come prepared with any relevant materials.",
        styles: { fontSize: "15px", color: "#1f2937", padding: "15px", backgroundColor: "#dbeafe", textAlign: "left" }
      },
      {
        id: "button-join",
        type: "button",
        content: "Join Meeting",
        styles: { backgroundColor: "#1d4ed8", color: "#ffffff", padding: "12px 24px", borderRadius: "6px", textAlign: "center", href: "#" }
      }
    ]
  },
  {
    id: "newsletter",
    name: "Newsletter",
    category: "Marketing",
    description: "Company newsletter template",
    emoji: "📰",
    components: [
      {
        id: "text-header",
        type: "text",
        content: "📰 [Company] Newsletter - [Month Year]",
        styles: { fontSize: "26px", fontWeight: "bold", color: "#7c2d12", textAlign: "center", padding: "25px" }
      },
      {
        id: "text-intro",
        type: "text",
        content: "Hello [Name],\n\nWelcome to this month's newsletter! Here's what's happening at [Company Name].",
        styles: { fontSize: "16px", color: "#374151", padding: "15px", textAlign: "left" }
      },
      {
        id: "divider-1",
        type: "divider",
        content: "",
        styles: { height: "2px", backgroundColor: "#d97706", padding: "10px 0" }
      },
      {
        id: "text-news",
        type: "text",
        content: "🚀 Company Updates:\n• [Update 1]\n• [Update 2]\n• [Update 3]\n\n🎯 Upcoming Events:\n• [Event 1] - [Date]\n• [Event 2] - [Date]",
        styles: { fontSize: "15px", color: "#1f2937", padding: "20px", textAlign: "left" }
      },
      {
        id: "button-read-more",
        type: "button",
        content: "Read Full Newsletter",
        styles: { backgroundColor: "#d97706", color: "#ffffff", padding: "12px 24px", borderRadius: "8px", textAlign: "center", href: "#" }
      },
      {
        id: "social-footer",
        type: "social",
        content: "Follow us for more updates",
        styles: { padding: "20px", textAlign: "center" }
      }
    ]
  },
  {
    id: "project-update",
    name: "Project Update",
    category: "Business",
    description: "Project status update email",
    emoji: "📊",
    components: [
      {
        id: "text-title",
        type: "text",
        content: "📊 Project Update: [Project Name]",
        styles: { fontSize: "24px", fontWeight: "bold", color: "#0f766e", textAlign: "center", padding: "20px" }
      },
      {
        id: "text-status",
        type: "text",
        content: "Hi Team,\n\nHere's the latest update on [Project Name]:\n\n✅ Completed:\n• [Completed Task 1]\n• [Completed Task 2]\n\n🔄 In Progress:\n• [Current Task 1]\n• [Current Task 2]\n\n📋 Next Steps:\n• [Upcoming Task 1]\n• [Upcoming Task 2]",
        styles: { fontSize: "15px", color: "#374151", padding: "18px", textAlign: "left" }
      },
      {
        id: "text-metrics",
        type: "text",
        content: "📈 Key Metrics:\n• Progress: [X]% Complete\n• Timeline: [Status]\n• Budget: [Status]\n• Quality: [Status]",
        styles: { fontSize: "15px", color: "#1f2937", padding: "15px", backgroundColor: "#f0fdfa", textAlign: "left" }
      },
      {
        id: "button-dashboard",
        type: "button",
        content: "View Project Dashboard",
        styles: { backgroundColor: "#0f766e", color: "#ffffff", padding: "12px 24px", borderRadius: "6px", textAlign: "center", href: "#" }
      }
    ]
  },
  {
    id: "thank-you",
    name: "Thank You Email",
    category: "Customer Service",
    description: "Customer appreciation message",
    emoji: "🙏",
    components: [
      {
        id: "text-thanks",
        type: "text",
        content: "🙏 Thank You!",
        styles: { fontSize: "28px", fontWeight: "bold", color: "#be185d", textAlign: "center", padding: "25px" }
      },
      {
        id: "text-message",
        type: "text",
        content: "Dear [Customer Name],\n\nThank you for choosing [Company Name]! We truly appreciate your business and trust in our services.\n\nYour recent [purchase/interaction] means a lot to us, and we're committed to providing you with the best experience possible.",
        styles: { fontSize: "16px", color: "#374151", padding: "20px", textAlign: "left" }
      },
      {
        id: "text-offer",
        type: "text",
        content: "🎁 As a token of our appreciation, here's a special offer just for you:\n\n[Special Offer Details]\n\nUse code: THANKYOU20",
        styles: { fontSize: "16px", color: "#1f2937", padding: "18px", backgroundColor: "#fce7f3", textAlign: "center" }
      },
      {
        id: "button-redeem",
        type: "button",
        content: "Redeem Offer",
        styles: { backgroundColor: "#be185d", color: "#ffffff", padding: "14px 28px", borderRadius: "8px", textAlign: "center", href: "#" }
      },
      {
        id: "social-follow",
        type: "social",
        content: "Stay connected with us",
        styles: { padding: "20px", textAlign: "center" }
      }
    ]
  },
  {
    id: "event-invitation",
    name: "Event Invitation",
    category: "Events",
    description: "Professional event invitation",
    emoji: "🎪",
    components: [
      {
        id: "text-invitation",
        type: "text",
        content: "🎪 You're Invited!",
        styles: { fontSize: "26px", fontWeight: "bold", color: "#7c3aed", textAlign: "center", padding: "25px" }
      },
      {
        id: "text-event-details",
        type: "text",
        content: "Dear [Name],\n\nWe're excited to invite you to [Event Name]!\n\n📅 Date: [Event Date]\n⏰ Time: [Event Time]\n📍 Venue: [Event Location]\n🎯 Theme: [Event Theme]",
        styles: { fontSize: "16px", color: "#374151", padding: "20px", textAlign: "left" }
      },
      {
        id: "image-event",
        type: "image",
        content: "",
        styles: { src: "https://via.placeholder.com/400x200?text=Event+Banner", alt: "Event Banner", width: "100%", padding: "15px" }
      },
      {
        id: "text-highlights",
        type: "text",
        content: "Event Highlights:\n• [Highlight 1]\n• [Highlight 2]\n• [Highlight 3]\n\nDress Code: [Dress Code]\nRSVP by: [RSVP Date]",
        styles: { fontSize: "15px", color: "#1f2937", padding: "18px", backgroundColor: "#f3e8ff", textAlign: "left" }
      },
      {
        id: "button-rsvp",
        type: "button",
        content: "RSVP Now",
        styles: { backgroundColor: "#7c3aed", color: "#ffffff", padding: "14px 28px", borderRadius: "10px", textAlign: "center", href: "#" }
      }
    ]
  },
  {
    id: "password-reset",
    name: "Password Reset",
    category: "Security",
    description: "Password reset notification",
    emoji: "🔐",
    components: [
      {
        id: "text-security",
        type: "text",
        content: "🔐 Password Reset Request",
        styles: { fontSize: "24px", fontWeight: "bold", color: "#dc2626", textAlign: "center", padding: "20px" }
      },
      {
        id: "text-message",
        type: "text",
        content: "Hi [Username],\n\nWe received a request to reset your password for your [Company] account.\n\nIf you made this request, click the button below to reset your password:",
        styles: { fontSize: "16px", color: "#374151", padding: "18px", textAlign: "left" }
      },
      {
        id: "button-reset",
        type: "button",
        content: "Reset Password",
        styles: { backgroundColor: "#dc2626", color: "#ffffff", padding: "14px 28px", borderRadius: "8px", textAlign: "center", href: "#" }
      },
      {
        id: "text-security-note",
        type: "text",
        content: "⚠️ Security Note:\n• This link expires in 24 hours\n• If you didn't request this, please ignore this email\n• Never share your password with anyone\n\nFor security questions, contact: security@company.com",
        styles: { fontSize: "14px", color: "#1f2937", padding: "18px", backgroundColor: "#fef2f2", textAlign: "left" }
      }
    ]
  },
  {
    id: "product-launch",
    name: "Product Launch",
    category: "Marketing",
    description: "New product announcement",
    emoji: "🚀",
    components: [
      {
        id: "text-launch",
        type: "text",
        content: "🚀 Introducing [Product Name]",
        styles: { fontSize: "28px", fontWeight: "bold", color: "#0f766e", textAlign: "center", padding: "25px" }
      },
      {
        id: "image-product",
        type: "image",
        content: "",
        styles: { src: "https://via.placeholder.com/400x250?text=New+Product", alt: "New Product", width: "100%", padding: "20px" }
      },
      {
        id: "text-description",
        type: "text",
        content: "We're thrilled to announce the launch of [Product Name]!\n\n✨ Key Features:\n• [Feature 1]\n• [Feature 2]\n• [Feature 3]\n\n💰 Special Launch Price: [Price]\n📅 Available from: [Launch Date]",
        styles: { fontSize: "16px", color: "#374151", padding: "20px", textAlign: "left" }
      },
      {
        id: "button-preorder",
        type: "button",
        content: "Pre-Order Now",
        styles: { backgroundColor: "#0f766e", color: "#ffffff", padding: "16px 32px", borderRadius: "10px", textAlign: "center", href: "#" }
      },
      {
        id: "text-early-bird",
        type: "text",
        content: "🎁 Early Bird Offer:\nFirst 100 customers get 20% off!\nUse code: LAUNCH20",
        styles: { fontSize: "16px", color: "#1f2937", padding: "20px", backgroundColor: "#ecfdf5", textAlign: "center" }
      }
    ]
  },
  {
    id: "survey-request",
    name: "Survey Request",
    category: "Feedback",
    description: "Customer feedback survey",
    emoji: "📝",
    components: [
      {
        id: "text-survey",
        type: "text",
        content: "📝 We Value Your Feedback",
        styles: { fontSize: "24px", fontWeight: "bold", color: "#0369a1", textAlign: "center", padding: "20px" }
      },
      {
        id: "text-request",
        type: "text",
        content: "Dear [Customer Name],\n\nYour opinion matters to us! We'd love to hear about your recent experience with [Company/Product/Service].\n\nYour feedback helps us improve and serve you better.",
        styles: { fontSize: "16px", color: "#374151", padding: "18px", textAlign: "left" }
      },
      {
        id: "text-incentive",
        type: "text",
        content: "🎁 Complete our 5-minute survey and get:\n• 10% discount on your next purchase\n• Entry into our monthly prize draw\n• Early access to new features",
        styles: { fontSize: "15px", color: "#1f2937", padding: "18px", backgroundColor: "#dbeafe", textAlign: "left" }
      },
      {
        id: "button-survey",
        type: "button",
        content: "Take Survey (5 min)",
        styles: { backgroundColor: "#0369a1", color: "#ffffff", padding: "14px 28px", borderRadius: "8px", textAlign: "center", href: "#" }
      },
      {
        id: "text-thanks",
        type: "text",
        content: "Thank you for being a valued customer!\n\nBest regards,\nThe [Company] Team",
        styles: { fontSize: "14px", color: "#6b7280", padding: "20px", textAlign: "left" }
      }
    ]
  },
  {
    id: "holiday-greetings",
    name: "Holiday Greetings",
    category: "Seasonal",
    description: "Holiday wishes email",
    emoji: "🎄",
    components: [
      {
        id: "text-holiday",
        type: "text",
        content: "🎄 Season's Greetings!",
        styles: { fontSize: "28px", fontWeight: "bold", color: "#dc2626", textAlign: "center", padding: "25px" }
      },
      {
        id: "text-wishes",
        type: "text",
        content: "Dear [Name],\n\nAs the holiday season approaches, we want to take a moment to thank you for being part of our [Company] family.\n\nWishing you and your loved ones joy, peace, and happiness this holiday season!",
        styles: { fontSize: "16px", color: "#374151", padding: "20px", textAlign: "left" }
      },
      {
        id: "image-holiday",
        type: "image",
        content: "",
        styles: { src: "https://via.placeholder.com/400x200?text=Happy+Holidays", alt: "Holiday Greetings", width: "100%", padding: "20px" }
      },
      {
        id: "text-offer",
        type: "text",
        content: "🎁 Holiday Special:\n25% off everything in our store!\n\nUse code: HOLIDAY25\nValid until [End Date]",
        styles: { fontSize: "16px", color: "#1f2937", padding: "20px", backgroundColor: "#fef2f2", textAlign: "center" }
      },
      {
        id: "button-shop",
        type: "button",
        content: "Shop Holiday Sale",
        styles: { backgroundColor: "#dc2626", color: "#ffffff", padding: "14px 28px", borderRadius: "8px", textAlign: "center", href: "#" }
      },
      {
        id: "social-holiday",
        type: "social",
        content: "Share the holiday spirit with us",
        styles: { padding: "25px", textAlign: "center" }
      }
    ]
  },
  {
    id: "appointment-confirmation",
    name: "Appointment Confirmation",
    category: "Business",
    description: "Appointment booking confirmation",
    emoji: "📋",
    components: [
      {
        id: "text-confirmation",
        type: "text",
        content: "📋 Appointment Confirmed",
        styles: { fontSize: "24px", fontWeight: "bold", color: "#059669", textAlign: "center", padding: "20px" }
      },
      {
        id: "text-details",
        type: "text",
        content: "Dear [Client Name],\n\nYour appointment has been confirmed!\n\n📅 Date: [Appointment Date]\n⏰ Time: [Appointment Time]\n👤 With: [Service Provider]\n📍 Location: [Address]\n📞 Contact: [Phone Number]",
        styles: { fontSize: "16px", color: "#374151", padding: "18px", textAlign: "left" }
      },
      {
        id: "text-preparation",
        type: "text",
        content: "📝 What to bring:\n• [Item 1]\n• [Item 2]\n• [Item 3]\n\n⏰ Please arrive 15 minutes early\n📱 Confirmation Code: [Code]",
        styles: { fontSize: "15px", color: "#1f2937", padding: "18px", backgroundColor: "#ecfdf5", textAlign: "left" }
      },
      {
        id: "button-reschedule",
        type: "button",
        content: "Reschedule Appointment",
        styles: { backgroundColor: "#059669", color: "#ffffff", padding: "12px 24px", borderRadius: "6px", textAlign: "center", href: "#" }
      },
      {
        id: "text-contact",
        type: "text",
        content: "Need to make changes? Contact us:\n📞 [Phone] | 📧 [Email]\n\nWe look forward to seeing you!",
        styles: { fontSize: "14px", color: "#6b7280", padding: "20px", textAlign: "center" }
      }
    ]
  }
]