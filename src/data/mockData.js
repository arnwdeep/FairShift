// FairShift Data & Multilingual Engine (Dot UI Minimalist Architecture, Zero Emojis)
import { translations as allTranslations } from './translations';

export const translations = allTranslations;

export const sectorConfigs = {
  construction: {
    id: "construction",
    name: "Construction",
    code: "SEC-01",
    siteName: "Apex Infrastructure Pier 4B",
    location: "Metro Corridor, Sector 7",
    geoCoords: "12.8231 N, 80.0442 E (100m perimeter)",
    worker: {
      name: "Ramesh Kumar",
      initials: "RK",
      role: "Lead Rigging Specialist",
      badgeId: "FS-CN-4092",
      joinDate: "March 2024",
      baseRatePerHour: 160,
      otRatePerHour: 240,
      lifetimeHours: 1420,
      verifiedShifts: 178,
      safetyScore: 98,
      certifications: [
        {
          id: "c1",
          title: "Rigging & Scaffolding Safety Level-3",
          issuer: "DGMS Verified",
          date: "Jan 2025",
          status: "Verified",
          hash: "0x8F9a2B"
        },
        {
          id: "c2",
          title: "Fall Arrest & High-Altitude Pass",
          issuer: "National Safety Council",
          date: "Nov 2024",
          status: "Verified",
          hash: "0x3D7c9A"
        },
        {
          id: "c3",
          title: "Crane Signals Ground Pass",
          issuer: "Site Safety Board",
          date: "Feb 2024",
          status: "Verified",
          hash: "0x11E0F5"
        }
      ]
    },
    hazardCategories: [
      { id: "fall", label: "Fall Hazard / Missing Scaffolding Guardrail", severity: "High" },
      { id: "machinery", label: "Crane Blind Spot / Heavy Vehicle", severity: "High" },
      { id: "electrical", label: "Exposed High-Voltage Cable", severity: "High" },
      { id: "ppe", label: "Damaged Boots or Hard Hat", severity: "Medium" },
      { id: "silica", label: "Silica Dust / Inadequate N95 Mask", severity: "Medium" },
      { id: "welfare", label: "Water Refill / Heat Stall", severity: "Low" }
    ],
    initialGrievances: [
      {
        id: "GRV-CN-101",
        workerAnonymousId: "Worker #4092",
        category: "Fall Hazard / Missing Scaffolding Guardrail",
        urgency: "High",
        status: "under_review",
        timestamp: "08:45",
        audioSeconds: 14,
        description: "Scaffold clamp on 3rd tier pier wobbling when loaded with rebars.",
        assignedTo: "Engr. Murugan",
        actionLog: "Inspection crew dispatched to Pier 4B scaffolding."
      },
      {
        id: "GRV-CN-102",
        workerAnonymousId: "Worker #3881",
        category: "Water Refill / Heat Stall",
        urgency: "Low",
        status: "resolved",
        timestamp: "Yesterday",
        audioSeconds: 9,
        description: "Water tanker at gate 2 was empty under peak noon heat.",
        assignedTo: "Deepa",
        actionLog: "1000L cold water refill dispatched."
      },
      {
        id: "GRV-CN-103",
        workerAnonymousId: "Worker #5104",
        category: "Exposed High-Voltage Cable",
        urgency: "High",
        status: "submitted",
        timestamp: "10:10",
        audioSeconds: 18,
        description: "Pump power cable insulation torn near batching plant puddle.",
        assignedTo: "Electrical Desk",
        actionLog: "Report queued for site isolation."
      }
    ],
    workersRoster: [
      { id: "W1", name: "Ramesh Kumar", role: "Scaffolder Lead", checkIn: "07:30", hoursWorked: 6.8, ot: 0, fatigue: "low", backToBack: false },
      { id: "W2", name: "Anand Velu", role: "Concrete Pourer", checkIn: "05:00", hoursWorked: 11.2, ot: 3.2, fatigue: "high", backToBack: true },
      { id: "W3", name: "Sunil Sharma", role: "Crane Operator", checkIn: "07:00", hoursWorked: 7.5, ot: 0, fatigue: "low", backToBack: false },
      { id: "W4", name: "K. Mohan", role: "Steel Rebar Tech", checkIn: "06:00", hoursWorked: 10.5, ot: 2.5, fatigue: "high", backToBack: false },
      { id: "W5", name: "Vikas Yadav", role: "Masonry Mason", checkIn: "08:00", hoursWorked: 6.0, ot: 0, fatigue: "low", backToBack: false },
      { id: "W6", name: "P. Rajan", role: "Excavator Operator", checkIn: "06:30", hoursWorked: 9.8, ot: 1.8, fatigue: "medium", backToBack: true }
    ],
    attritionData: {
      turnoverRiskPercent: 24,
      riskLevel: "medium",
      keyDrivers: [
        { factor: "Excessive Weekend Overtime", impact: "High", change: "+14%" },
        { factor: "Heat Stress During Pour", impact: "High", change: "3 flags" },
        { factor: "Overtime Transparency", impact: "Low", change: "Audited" }
      ],
      recommendations: [
        "Enforce 45-min shaded rotation during 12:00-14:30 heat peaks (SDG 8.8)",
        "Cap maximum overtime to 2.5 hours per shift for machinery operators",
        "Maintain automatic daily payslip ledger visibility"
      ]
    }
  },

  campus: {
    id: "campus",
    name: "Campus Staff",
    code: "SEC-02",
    siteName: "Central University Facilities",
    location: "Science Quad & Hostels",
    geoCoords: "12.8235 N, 80.0415 E (200m perimeter)",
    worker: {
      name: "Selvi Murugan",
      initials: "SM",
      role: "Sanitation Facility Lead",
      badgeId: "FS-ED-8120",
      joinDate: "June 2023",
      baseRatePerHour: 140,
      otRatePerHour: 210,
      lifetimeHours: 1980,
      verifiedShifts: 245,
      safetyScore: 99,
      certifications: [
        {
          id: "e1",
          title: "Bio-Safety Protocol Standard",
          issuer: "ISSA Certified",
          date: "Feb 2025",
          status: "Verified",
          hash: "0x77A141"
        },
        {
          id: "e2",
          title: "Chemical Spill Kit & Fume Management",
          issuer: "Pollution Board",
          date: "Oct 2024",
          status: "Verified",
          hash: "0x99C208"
        },
        {
          id: "e3",
          title: "Ergonomic Material Handling",
          issuer: "Campus Authority",
          date: "May 2024",
          status: "Verified",
          hash: "0x44D8E1"
        }
      ]
    },
    hazardCategories: [
      { id: "chemical", label: "Lab Chemical Spill / Solvent Fumes", severity: "High" },
      { id: "slip", label: "Wet Polished Floor / No Caution Sign", severity: "Medium" },
      { id: "biowaste", label: "Unsealed Medical Waste Bag", severity: "High" },
      { id: "trolley", label: "Broken Waste Trolley Lift", severity: "Low" },
      { id: "gloves", label: "Shortage of Heavy-Duty Nitrile Gloves", severity: "Medium" },
      { id: "nightlighting", label: "Dark Hostels Alley / Broken Floodlight", severity: "Medium" }
    ],
    initialGrievances: [
      {
        id: "GRV-ED-201",
        workerAnonymousId: "Worker #8120",
        category: "Lab Chemical Spill / Solvent Fumes",
        urgency: "High",
        status: "under_review",
        timestamp: "09:12",
        audioSeconds: 16,
        description: "Chemistry Lab 3 sink pipe leaked solvent. Strong fumes, need carbon respirator.",
        assignedTo: "Dr. Priya",
        actionLog: "Ventilation active. Lab isolated for neutralization."
      },
      {
        id: "GRV-ED-202",
        workerAnonymousId: "Worker #7914",
        category: "Shortage of Heavy-Duty Nitrile Gloves",
        urgency: "Medium",
        status: "resolved",
        timestamp: "Yesterday",
        audioSeconds: 11,
        description: "Sanitation closet on Floor 4 ran out of thick gloves.",
        assignedTo: "Stores Desk",
        actionLog: "Box of 200 industrial grade gloves delivered."
      },
      {
        id: "GRV-ED-203",
        workerAnonymousId: "Worker #6502",
        category: "Dark Hostels Alley / Broken Floodlight",
        urgency: "Medium",
        status: "submitted",
        timestamp: "07:40",
        audioSeconds: 12,
        description: "Hostel 8 alley has blind spot during 5 AM sanitation shift.",
        assignedTo: "Electrician Desk",
        actionLog: "Work order queued for LED replacement."
      }
    ],
    workersRoster: [
      { id: "F1", name: "Selvi Murugan", role: "Sanitation Lead", checkIn: "06:00", hoursWorked: 6.5, ot: 0, fatigue: "low", backToBack: false },
      { id: "F2", name: "Meena Kumari", role: "Bio-Waste Handler", checkIn: "05:00", hoursWorked: 10.8, ot: 2.8, fatigue: "high", backToBack: true },
      { id: "F3", name: "K. Balamurugan", role: "Campus Grounds Keeper", checkIn: "06:30", hoursWorked: 7.2, ot: 0, fatigue: "low", backToBack: false },
      { id: "F4", name: "Suresh Mani", role: "Hostel Maintenance", checkIn: "08:00", hoursWorked: 6.0, ot: 0, fatigue: "low", backToBack: false },
      { id: "F5", name: "Geetha Rani", role: "Lab Sanitizer", checkIn: "05:30", hoursWorked: 11.0, ot: 3.0, fatigue: "high", backToBack: true },
      { id: "F6", name: "Dinesh Babu", role: "HVAC Tech", checkIn: "07:00", hoursWorked: 8.0, ot: 0, fatigue: "low", backToBack: false }
    ],
    attritionData: {
      turnoverRiskPercent: 18,
      riskLevel: "low",
      keyDrivers: [
        { factor: "Back-to-Back Night Shifts", impact: "High", change: "2 staff" },
        { factor: "Protective Gear Refresh", impact: "Medium", change: "Improved" },
        { factor: "Overtime Recognition", impact: "Low", change: "Verified" }
      ],
      recommendations: [
        "Enforce 12-hour rest gap between overnight deep-clean and morning shifts",
        "Weekly automated glove & respirator restocking alert",
        "Monthly digital skill accreditation record for zero-incident shifts"
      ]
    }
  }
};
