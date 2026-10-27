// FairShift Reactive Database & Business Logic Engine (Aligned with UN SDG 8)
// Provides deterministic payroll, attendance audit trails, SafeSpeak, Fatigue Guardian, Skill Passport, Shift Swap, and Offline Sync.

const STORAGE_KEY = 'fairshift_db_v2';

// Initial Seed Data across Construction and Campus sectors
const initialDatabase = {
  users: [
    {
      id: 'usr_w1',
      employeeId: 'FS-CN-4092',
      name: 'Ramesh Kumar',
      initials: 'RK',
      role: 'worker',
      sector: 'construction',
      jobRole: 'Lead Rigging Specialist',
      workplace: 'Apex Infrastructure Pier 4B',
      baseRatePerHour: 160,
      otRatePerHour: 240,
      preferredLanguage: 'en',
      skills: ['Rigging Level-3', 'Fall Arrest Pass', 'Scaffold Safety'],
      activeShiftId: 'shf_active_1'
    },
    {
      id: 'usr_w2',
      employeeId: 'FS-ED-8120',
      name: 'Selvi Murugan',
      initials: 'SM',
      role: 'worker',
      sector: 'campus',
      jobRole: 'Sanitation Facility Lead',
      workplace: 'Central Campus Facilities',
      baseRatePerHour: 140,
      otRatePerHour: 210,
      preferredLanguage: 'ta',
      skills: ['Bio-Safety Standard', 'Chemical Spill Kit', 'Ergonomic Handling'],
      activeShiftId: 'shf_active_2'
    },
    {
      id: 'usr_sup1',
      employeeId: 'FS-SUP-101',
      name: 'Murugan Sundaram',
      initials: 'MS',
      role: 'supervisor',
      sector: 'construction',
      jobRole: 'Site Operations Supervisor',
      workplace: 'Apex Infrastructure Pier 4B'
    },
    {
      id: 'usr_hr1',
      employeeId: 'FS-HR-204',
      name: 'Deepa Narayanan',
      initials: 'DN',
      role: 'hr',
      sector: 'campus',
      jobRole: 'Workforce & Payroll Compliance Officer',
      workplace: 'Central Campus Facilities'
    },
    {
      id: 'usr_adm1',
      employeeId: 'FS-ADM-001',
      name: 'Site Director V. Sharma',
      initials: 'VS',
      role: 'admin',
      sector: 'construction',
      jobRole: 'General Administrator & Safety Director',
      workplace: 'Regional Operations Hub'
    }
  ],

  attendance: [
    {
      id: 'att_101',
      workerId: 'usr_w1',
      employeeId: 'FS-CN-4092',
      workerName: 'Ramesh Kumar',
      sector: 'construction',
      date: '2026-10-27',
      clockIn: '07:30',
      clockOut: null, // Active shift
      breakMinutes: 30,
      hoursWorked: 6.8,
      regularHours: 6.8,
      overtimeHours: 0,
      status: 'active',
      isOfflineRecorded: false,
      discrepancyReported: false,
      auditHistory: [
        { action: 'QR Geo-fence Clock In', timestamp: '2026-10-27 07:30:12', actor: 'Ramesh Kumar' }
      ]
    },
    {
      id: 'att_102',
      workerId: 'usr_w1',
      employeeId: 'FS-CN-4092',
      workerName: 'Ramesh Kumar',
      sector: 'construction',
      date: '2026-10-26',
      clockIn: '07:00',
      clockOut: '17:30',
      breakMinutes: 45,
      hoursWorked: 9.75,
      regularHours: 8.0,
      overtimeHours: 1.75,
      status: 'completed',
      isOfflineRecorded: false,
      discrepancyReported: false,
      auditHistory: [
        { action: 'Clock In', timestamp: '2026-10-26 07:00:00', actor: 'Ramesh Kumar' },
        { action: 'Clock Out', timestamp: '2026-10-26 17:30:00', actor: 'Ramesh Kumar' }
      ]
    },
    {
      id: 'att_103',
      workerId: 'usr_w1',
      employeeId: 'FS-CN-4092',
      workerName: 'Ramesh Kumar',
      sector: 'construction',
      date: '2026-10-25',
      clockIn: '06:00',
      clockOut: '17:30',
      breakMinutes: 30,
      hoursWorked: 11.0,
      regularHours: 8.0,
      overtimeHours: 3.0,
      status: 'completed',
      isOfflineRecorded: false,
      discrepancyReported: true,
      discrepancyNotes: 'Worker requested review of lunch break deduction during continuous concrete pour.',
      auditHistory: [
        { action: 'Discrepancy Reported', timestamp: '2026-10-26 08:15:00', actor: 'Ramesh Kumar' }
      ]
    },
    {
      id: 'att_201',
      workerId: 'usr_w2',
      employeeId: 'FS-ED-8120',
      workerName: 'Selvi Murugan',
      sector: 'campus',
      date: '2026-10-27',
      clockIn: '06:00',
      clockOut: null,
      breakMinutes: 30,
      hoursWorked: 6.5,
      regularHours: 6.5,
      overtimeHours: 0,
      status: 'active',
      isOfflineRecorded: false,
      discrepancyReported: false,
      auditHistory: [
        { action: 'RFID Gate Clock In', timestamp: '2026-10-27 06:00:00', actor: 'Selvi Murugan' }
      ]
    }
  ],

  payroll: [
    {
      id: 'pay_oct_01',
      workerId: 'usr_w1',
      employeeId: 'FS-CN-4092',
      workerName: 'Ramesh Kumar',
      period: 'October 2026 (Month-to-Date)',
      regularHours: 168.0,
      overtimeHours: 24.5,
      baseRate: 160,
      otRate: 240,
      regularPay: 26880,
      overtimePay: 5880,
      grossEarnings: 32760,
      statutoryPF: 3931, // 12%
      statutoryESI: 246, // 0.75%
      adjustments: 0,
      netPay: 28583,
      status: 'estimated', // 'estimated' | 'approved' | 'paid'
      auditHash: '0x99A41E80B4'
    },
    {
      id: 'pay_sep_01',
      workerId: 'usr_w1',
      employeeId: 'FS-CN-4092',
      workerName: 'Ramesh Kumar',
      period: 'September 2026',
      regularHours: 192.0,
      overtimeHours: 18.0,
      baseRate: 160,
      otRate: 240,
      regularPay: 30720,
      overtimePay: 4320,
      grossEarnings: 35040,
      statutoryPF: 4205,
      statutoryESI: 263,
      adjustments: 500, // Safety compliance bonus
      netPay: 31072,
      status: 'paid',
      auditHash: '0x3C104FB821'
    }
  ],

  discrepancies: [
    {
      id: 'DISC-8812',
      workerId: 'usr_w1',
      workerName: 'Ramesh Kumar',
      attendanceId: 'att_103',
      category: 'Missing Overtime / Uncredited 45 Minutes',
      claimedHours: 11.75,
      recordedHours: 11.0,
      explanation: 'Overtime concrete pouring went until 17:45 but gate terminal closed at 17:00.',
      status: 'under_investigation',
      submittedAt: '2026-10-26 09:10',
      assignedTo: 'Murugan Sundaram (Supervisor)',
      resolutionNotes: 'Site gate logs cross-referenced with batching plant records. Pending supervisor sign-off.'
    }
  ],

  hazardsAndGrievances: [
    {
      id: 'CASE-CN-101',
      sector: 'construction',
      type: 'safety_hazard',
      category: 'Fall Hazard / Missing Scaffolding Guardrail',
      severity: 'High',
      isAnonymous: true,
      workerId: 'usr_w1',
      workerAlias: 'Worker #4092',
      workplace: 'Apex Infrastructure Pier 4B - East Elevation',
      description: 'Scaffold clamp on 3rd tier pier wobbling when loaded with rebars. Missing toe-board on east side.',
      status: 'under_investigation',
      assignedTo: 'Murugan Sundaram (Site Safety Lead)',
      audioDuration: 14,
      photoAttached: true,
      createdAt: '2026-10-27 08:45',
      auditTrail: [
        { action: 'Ticket Submitted', timestamp: '2026-10-27 08:45', actor: 'Anonymous Worker' },
        { action: 'Assigned to Safety Lead', timestamp: '2026-10-27 09:00', actor: 'System' },
        { action: 'Inspection Dispatched', timestamp: '2026-10-27 09:15', actor: 'Murugan Sundaram' }
      ]
    },
    {
      id: 'CASE-CN-102',
      sector: 'construction',
      type: 'grievance',
      category: 'Unpaid Extended Shift / Unsafe Break Interval',
      severity: 'Medium',
      isAnonymous: true,
      workerId: 'usr_w1',
      workerAlias: 'Worker #3881',
      workplace: 'Pier 4B Ground Batching Plant',
      description: 'Sub-contractor foreman instructed workers to skip hydration break during peak heat (38°C).',
      status: 'resolved',
      assignedTo: 'Deepa Narayanan (HR)',
      audioDuration: 9,
      photoAttached: false,
      createdAt: '2026-10-26 14:15',
      auditTrail: [
        { action: 'Ticket Submitted', timestamp: '2026-10-26 14:15', actor: 'Anonymous Worker' },
        { action: 'HR Investigation Opened', timestamp: '2026-10-26 14:35', actor: 'Deepa Narayanan' },
        { action: 'Mandatory Shaded Rest Protocol Enforced & Foreman Notified', timestamp: '2026-10-26 15:30', actor: 'Deepa Narayanan' }
      ]
    },
    {
      id: 'CASE-ED-201',
      sector: 'campus',
      type: 'safety_hazard',
      category: 'Lab Chemical Spill / Acid Fume Exposure',
      severity: 'High',
      isAnonymous: true,
      workerId: 'usr_w2',
      workerAlias: 'Worker #8120',
      workplace: 'Science Block C - Chemistry Lab 3',
      description: 'Sink drainage pipe leaked pungent solvent during mop up. Strong fumes, need proper carbon respirator kit.',
      status: 'under_investigation',
      assignedTo: 'Dr. Priya (Campus Bio-Safety)',
      audioDuration: 16,
      photoAttached: true,
      createdAt: '2026-10-27 09:12',
      auditTrail: [
        { action: 'Emergency Ticket Submitted', timestamp: '2026-10-27 09:12', actor: 'Anonymous Staff' },
        { action: 'Exhaust Fan & Lab Isolation Activated', timestamp: '2026-10-27 09:20', actor: 'Dr. Priya' }
      ]
    }
  ],

  fatigueAlerts: [
    {
      id: 'fat_01',
      workerId: 'usr_w1',
      workerName: 'Anand Velu',
      role: 'Concrete Pourer',
      sector: 'construction',
      consecutiveHours: 11.2,
      restPeriodBeforeShift: 6.5, // Insufficient rest (<10h)
      severity: 'Critical',
      flagType: 'Excessive Consecutive Hours (>10h)',
      explanation: 'Worker logged 11.2 hours continuously without mandatory 45-min rest interval. Prior shift turnaround was only 6.5h.',
      supervisorActionRequired: 'Authorize mandatory rest rotation before heavy machinery assignment.',
      status: 'open',
      createdAt: '2026-10-27 10:15'
    },
    {
      id: 'fat_02',
      workerId: 'usr_w3',
      workerName: 'Meena Kumari',
      role: 'Bio-Waste Handler',
      sector: 'campus',
      consecutiveHours: 10.8,
      restPeriodBeforeShift: 7.0,
      severity: 'High',
      flagType: 'Back-to-Back Night & Morning Shift',
      explanation: 'Overnight campus deep sanitization shift completed at 01:00, followed by morning shift starting at 08:00.',
      supervisorActionRequired: 'Reassign shift to relief colleague.',
      status: 'open',
      createdAt: '2026-10-27 09:30'
    }
  ],

  skillsPassport: [
    {
      id: 'sk_01',
      workerId: 'usr_w1',
      title: 'Level-3 Rigging & Scaffolding Safety',
      issuingAuthority: 'DGMS Approved Safety Board',
      issueDate: '2025-01-10',
      expiryDate: '2027-01-10',
      isVerified: true,
      verifiedBy: 'Site Safety Inspector #44',
      verificationHash: '0x8F9a2B1e'
    },
    {
      id: 'sk_02',
      workerId: 'usr_w1',
      title: 'High-Altitude Fall Arrest Certification',
      issuingAuthority: 'National Safety Council',
      issueDate: '2024-11-05',
      expiryDate: '2026-11-05',
      isVerified: true,
      verifiedBy: 'National Safety Auditor',
      verificationHash: '0x3D7c9A44'
    },
    {
      id: 'sk_03',
      workerId: 'usr_w2',
      title: 'Institutional Bio-Safety Protocol',
      issuingAuthority: 'International Sanitary Supply Association (ISSA)',
      issueDate: '2025-02-15',
      expiryDate: '2027-02-15',
      isVerified: true,
      verifiedBy: 'Campus Health Desk',
      verificationHash: '0x77A141F0'
    }
  ],

  shiftSwaps: [
    {
      id: 'SWAP-101',
      requesterId: 'usr_w1',
      requesterName: 'Ramesh Kumar',
      currentShift: 'Morning Rigging (07:00 - 15:30) • Oct 29',
      targetWorkerId: 'usr_w4',
      targetWorkerName: 'Sunil Sharma',
      proposedShift: 'Evening Rigging (15:00 - 23:30) • Oct 29',
      reason: 'Family medical appointment in forenoon',
      skillsMatched: true,
      fatigueCheckPassed: true,
      status: 'pending_supervisor_approval', // 'pending_supervisor_approval' | 'approved' | 'rejected'
      createdAt: '2026-10-27 09:40',
      supervisorNotes: 'Awaiting shift roster confirmation.'
    }
  ],

  workplacePulse: [
    {
      id: 'pls_01',
      sector: 'construction',
      date: '2026-10-26',
      question: 'Hydration and shade availability at Pier 4B',
      rating: 4, // 1 to 5
      category: 'Facilities & Heat Stress',
      feedbackText: 'Cold water refill was delayed yesterday but restored today.'
    },
    {
      id: 'pls_02',
      sector: 'campus',
      date: '2026-10-26',
      question: 'Availability of chemical protective gloves in Science Quad',
      rating: 3,
      category: 'Safety & Equipment',
      feedbackText: 'Nitrile gloves ran out in morning; restock needed weekly.'
    }
  ],

  notifications: [
    {
      id: 'notif_01',
      userId: 'usr_w1',
      title: 'Shift Overtime Accruing',
      message: 'You have worked 6.8h today. Overtime rate (1.5x) automatically activates after 8.0 hours.',
      type: 'info',
      read: false,
      timestamp: 'Today, 10:15'
    },
    {
      id: 'notif_02',
      userId: 'usr_w1',
      title: 'Safety Ticket Case Assigned',
      message: 'Your report CASE-CN-101 (Scaffolding clamp wobble) was assigned to Safety Lead Murugan.',
      type: 'safety',
      read: false,
      timestamp: 'Today, 09:00'
    },
    {
      id: 'notif_03',
      userId: 'usr_sup1',
      title: 'Critical Fatigue Alert Flagged',
      message: 'Anand Velu has exceeded 11.2 consecutive hours on Pier 4B. Mandatory rest break advised.',
      type: 'fatigue',
      read: false,
      timestamp: 'Today, 10:15'
    }
  ],

  auditLog: [
    { id: 'aud_1', timestamp: '2026-10-27 07:30', actor: 'Ramesh Kumar', action: 'QR Check-In', details: 'Pier 4B East Gate GPS verified' },
    { id: 'aud_2', timestamp: '2026-10-27 08:45', actor: 'Worker #4092', action: 'Hazard Submitted', details: 'CASE-CN-101 Scaffolding wobble' },
    { id: 'aud_3', timestamp: '2026-10-27 09:15', actor: 'Murugan Sundaram', action: 'Safety Crew Dispatched', details: 'Dispatched to Pier 4B Scaffolding' }
  ],

  offlineQueue: []
};

// Database helper functions with localStorage synchronization
class FairShiftDB {
  constructor() {
    this.db = this.loadDatabase();
    this.listeners = new Set();
  }

  loadDatabase() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('LocalStorage load error, using default seed:', e);
    }
    this.persist(initialDatabase);
    return JSON.parse(JSON.stringify(initialDatabase));
  }

  persist(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data || this.db));
    } catch (e) {
      console.error('LocalStorage persist error:', e);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.persist(this.db);
    this.listeners.forEach((cb) => {
      try {
        cb(this.db);
      } catch (err) {
        console.error('Listener callback error:', err);
      }
    });
  }

  // Get current DB state
  getState() {
    return this.db;
  }

  // 1. Worker & Shift Operations
  clockIn(workerId, sector, isOffline = false) {
    const worker = this.db.users.find((u) => u.id === workerId);
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 5);
    const dateStr = now.toISOString().slice(0, 10);

    const newAttendance = {
      id: `att_${Date.now()}`,
      workerId,
      employeeId: worker ? worker.employeeId : 'FS-GEN',
      workerName: worker ? worker.name : 'Unknown Worker',
      sector: sector || (worker ? worker.sector : 'construction'),
      date: dateStr,
      clockIn: timeStr,
      clockOut: null,
      breakMinutes: 0,
      hoursWorked: 0.1,
      regularHours: 0.1,
      overtimeHours: 0,
      status: 'active',
      isOfflineRecorded: isOffline,
      discrepancyReported: false,
      auditHistory: [
        { action: isOffline ? 'Offline Clock In' : 'QR Geo-fence Clock In', timestamp: `${dateStr} ${timeStr}`, actor: worker ? worker.name : 'Worker' }
      ]
    };

    this.db.attendance.unshift(newAttendance);

    this.addAuditEntry(
      worker ? worker.name : 'Worker',
      'Clock In',
      `Shift started at ${timeStr} (${sector})`
    );

    this.addNotification({
      userId: workerId,
      title: 'Shift Started',
      message: `Clock-in confirmed at ${timeStr}. Attendance verified on site ledger.`,
      type: 'info'
    });

    this.notify();
    return newAttendance;
  }

  clockOut(workerId, currentShiftDurationHours) {
    const activeAtt = this.db.attendance.find((a) => a.workerId === workerId && a.status === 'active');
    const worker = this.db.users.find((u) => u.id === workerId);
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 5);
    const dateStr = now.toISOString().slice(0, 10);

    const totalHours = Math.max(currentShiftDurationHours || 8.0, 0.1);
    const regularHours = Math.min(totalHours, 8.0);
    const overtimeHours = Math.max(0, +(totalHours - 8.0).toFixed(2));

    if (activeAtt) {
      activeAtt.clockOut = timeStr;
      activeAtt.hoursWorked = totalHours;
      activeAtt.regularHours = regularHours;
      activeAtt.overtimeHours = overtimeHours;
      activeAtt.status = 'completed';
      activeAtt.auditHistory.push({
        action: 'Clock Out & Sign-off',
        timestamp: `${dateStr} ${timeStr}`,
        actor: worker ? worker.name : 'Worker'
      });
    }

    // Check Fatigue Guardian Rule
    if (totalHours >= 10.0) {
      this.db.fatigueAlerts.unshift({
        id: `fat_${Date.now()}`,
        workerId,
        workerName: worker ? worker.name : 'Worker',
        role: worker ? worker.jobRole : 'Specialist',
        sector: worker ? worker.sector : 'construction',
        consecutiveHours: totalHours,
        restPeriodBeforeShift: 10.0,
        severity: totalHours >= 11.0 ? 'Critical' : 'High',
        flagType: 'Shift Exceeds 10.0h Limit',
        explanation: `Worker logged ${totalHours}h today exceeding standard safety fatigue threshold.`,
        supervisorActionRequired: 'Supervisor check mandatory before next scheduled shift.',
        status: 'open',
        createdAt: `${dateStr} ${timeStr}`
      });

      this.addNotification({
        userId: 'usr_sup1',
        title: 'Fatigue Alert Flagged',
        message: `${worker ? worker.name : 'Worker'} logged ${totalHours}h. Review required before additional shift assignment.`,
        type: 'fatigue'
      });
    }

    this.addAuditEntry(
      worker ? worker.name : 'Worker',
      'Clock Out',
      `Shift ended at ${timeStr}. Total: ${totalHours}h (OT: ${overtimeHours}h)`
    );

    this.notify();
  }

  // 2. Submit Discrepancy
  reportAttendanceDiscrepancy(attendanceId, claimedHours, explanation, workerId) {
    const att = this.db.attendance.find((a) => a.id === attendanceId);
    const worker = this.db.users.find((u) => u.id === workerId);
    const dateStr = new Date().toISOString().slice(0, 16).replace('T', ' ');

    if (att) {
      att.discrepancyReported = true;
      att.discrepancyNotes = explanation;
      att.auditHistory.push({
        action: 'Discrepancy Lodged by Worker',
        timestamp: dateStr,
        actor: worker ? worker.name : 'Worker'
      });
    }

    const newDisc = {
      id: `DISC-${Date.now().toString().slice(-4)}`,
      workerId,
      workerName: worker ? worker.name : 'Worker',
      attendanceId,
      category: 'Attendance & Overtime Reconciliation',
      claimedHours: parseFloat(claimedHours) || 8.0,
      recordedHours: att ? att.hoursWorked : 0,
      explanation,
      status: 'under_investigation',
      submittedAt: dateStr,
      assignedTo: 'HR Compliance Officer',
      resolutionNotes: 'Case queued for electronic badge check.'
    };

    this.db.discrepancies.unshift(newDisc);

    this.addAuditEntry(
      worker ? worker.name : 'Worker',
      'Discrepancy Lodged',
      `Ticket ${newDisc.id} filed for attendance ID ${attendanceId}`
    );

    this.addNotification({
      userId: workerId,
      title: 'Discrepancy Ticket Created',
      message: `Your attendance review request (${newDisc.id}) has been registered with HR compliance.`,
      type: 'payroll'
    });

    this.notify();
    return newDisc;
  }

  // 3. Resolve Discrepancy (Admin/HR)
  resolveDiscrepancy(discrepancyId, resolutionNotes, adjustedHours, actorName = 'HR Officer') {
    const disc = this.db.discrepancies.find((d) => d.id === discrepancyId);
    const dateStr = new Date().toISOString().slice(0, 16).replace('T', ' ');

    if (disc) {
      disc.status = 'resolved';
      disc.resolutionNotes = resolutionNotes;
      disc.resolvedAt = dateStr;

      if (adjustedHours && disc.attendanceId) {
        const att = this.db.attendance.find((a) => a.id === disc.attendanceId);
        if (att) {
          att.hoursWorked = parseFloat(adjustedHours);
          att.regularHours = Math.min(att.hoursWorked, 8.0);
          att.overtimeHours = Math.max(0, +(att.hoursWorked - 8.0).toFixed(2));
          att.auditHistory.push({
            action: `Hours adjusted to ${adjustedHours}h by HR (${resolutionNotes})`,
            timestamp: dateStr,
            actor: actorName
          });
        }
      }

      this.addAuditEntry(
        actorName,
        'Discrepancy Resolved',
        `Ticket ${discrepancyId} closed with resolution: ${resolutionNotes}`
      );

      this.addNotification({
        userId: disc.workerId,
        title: 'Payroll Discrepancy Resolved',
        message: `Your claim (${discrepancyId}) was resolved: ${resolutionNotes}`,
        type: 'payroll'
      });
    }

    this.notify();
  }

  // 4. Submit Safety Hazard / SafeSpeak Grievance
  submitCase(caseData) {
    const dateStr = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const id = `CASE-${(caseData.sector || 'SEC').slice(0, 2).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    const newCase = {
      id,
      sector: caseData.sector || 'construction',
      type: caseData.type || 'safety_hazard', // 'safety_hazard' | 'grievance'
      category: caseData.category || 'General Workplace Safety',
      severity: caseData.severity || 'High',
      isAnonymous: caseData.isAnonymous !== false,
      workerId: caseData.workerId,
      workerAlias: caseData.isAnonymous ? `Worker #${(caseData.workerId || '0000').slice(-4)}` : caseData.workerName,
      workplace: caseData.workplace || 'Active Site Zone',
      description: caseData.description || 'Voice note transcript attached.',
      status: 'submitted',
      assignedTo: 'Dispatching Safety Crew',
      audioDuration: caseData.audioDuration || 0,
      photoAttached: !!caseData.photoAttached,
      createdAt: dateStr,
      auditTrail: [
        { action: 'Ticket Submitted into SafeSpeak Ledger', timestamp: dateStr, actor: caseData.isAnonymous ? 'Anonymous' : (caseData.workerName || 'Worker') }
      ]
    };

    this.db.hazardsAndGrievances.unshift(newCase);

    this.addAuditEntry(
      caseData.isAnonymous ? 'Anonymous' : (caseData.workerName || 'Worker'),
      'Case Created',
      `Ticket ${id} (${newCase.category}, Severity: ${newCase.severity})`
    );

    // Notify administrators/supervisors
    this.addNotification({
      userId: 'usr_adm1',
      title: `Critical Hazard Reported (${id})`,
      message: `${newCase.category} reported at ${newCase.workplace}. Severity: ${newCase.severity}.`,
      type: 'safety'
    });

    if (caseData.workerId) {
      this.addNotification({
        userId: caseData.workerId,
        title: 'Report Received (SafeSpeak)',
        message: `Tracking ID: ${id}. Zero-retaliation protected. Status: Submitted.`,
        type: 'safety'
      });
    }

    this.notify();
    return newCase;
  }

  // 5. Update Case Status (Investigate / Resolve / Assign)
  updateCaseStatus(caseId, status, actionLog, assignedTo, actor = 'Safety Officer') {
    const c = this.db.hazardsAndGrievances.find((item) => item.id === caseId);
    const dateStr = new Date().toISOString().slice(0, 16).replace('T', ' ');

    if (c) {
      c.status = status;
      if (assignedTo) c.assignedTo = assignedTo;
      c.auditTrail.push({
        action: actionLog,
        timestamp: dateStr,
        actor
      });

      this.addAuditEntry(actor, `Case ${status}`, `Ticket ${caseId}: ${actionLog}`);

      if (c.workerId) {
        this.addNotification({
          userId: c.workerId,
          title: `Report Status Updated: ${status.replace('_', ' ').toUpperCase()}`,
          message: `Your report (${caseId}) status is now ${status}. Corrective action: ${actionLog}`,
          type: 'safety'
        });
      }
    }

    this.notify();
  }

  // 6. FairShift Shift Swap
  requestShiftSwap(swapData) {
    const dateStr = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const id = `SWAP-${Date.now().toString().slice(-4)}`;

    const newSwap = {
      id,
      requesterId: swapData.requesterId,
      requesterName: swapData.requesterName,
      currentShift: swapData.currentShift,
      targetWorkerId: swapData.targetWorkerId,
      targetWorkerName: swapData.targetWorkerName,
      proposedShift: swapData.proposedShift,
      reason: swapData.reason,
      skillsMatched: true,
      fatigueCheckPassed: true,
      status: 'pending_supervisor_approval',
      createdAt: dateStr,
      supervisorNotes: 'Awaiting supervisor safety review.'
    };

    this.db.shiftSwaps.unshift(newSwap);

    this.addAuditEntry(
      swapData.requesterName,
      'Shift Swap Requested',
      `${id}: Request with ${swapData.targetWorkerName}`
    );

    this.addNotification({
      userId: 'usr_sup1',
      title: 'Shift Swap Approval Requested',
      message: `${swapData.requesterName} requested swap with ${swapData.targetWorkerName}.`,
      type: 'swap'
    });

    this.notify();
    return newSwap;
  }

  approveShiftSwap(swapId, supervisorName = 'Murugan Sundaram') {
    const swap = this.db.shiftSwaps.find((s) => s.id === swapId);
    if (swap) {
      swap.status = 'approved';
      swap.supervisorNotes = `Approved by ${supervisorName}. Roster updated.`;

      this.addAuditEntry(supervisorName, 'Swap Approved', `Ticket ${swapId}`);

      this.addNotification({
        userId: swap.requesterId,
        title: 'Shift Swap Approved',
        message: `Your swap request (${swapId}) with ${swap.targetWorkerName} has been approved.`,
        type: 'swap'
      });

      this.addNotification({
        userId: swap.targetWorkerId,
        title: 'Shift Assignment Updated',
        message: `Shift swap (${swapId}) approved. New shift: ${swap.currentShift}.`,
        type: 'swap'
      });
    }
    this.notify();
  }

  rejectShiftSwap(swapId, reason, supervisorName = 'Murugan Sundaram') {
    const swap = this.db.shiftSwaps.find((s) => s.id === swapId);
    if (swap) {
      swap.status = 'rejected';
      swap.supervisorNotes = reason || 'Rejected due to fatigue turnaround conflict.';

      this.addAuditEntry(supervisorName, 'Swap Rejected', `Ticket ${swapId}: ${reason}`);

      this.addNotification({
        userId: swap.requesterId,
        title: 'Shift Swap Declined',
        message: `Your swap request (${swapId}) was declined: ${swap.supervisorNotes}`,
        type: 'swap'
      });
    }
    this.notify();
  }

  // 7. Workplace Pulse
  submitPulse(rating, question, feedbackText, sector = 'construction') {
    const newPulse = {
      id: `pls_${Date.now()}`,
      sector,
      date: new Date().toISOString().slice(0, 10),
      question,
      rating: parseInt(rating) || 5,
      category: 'Workplace Climate & Facilities',
      feedbackText: feedbackText || 'No comments'
    };

    this.db.workplacePulse.unshift(newPulse);
    this.notify();
    return newPulse;
  }

  // 8. Offline Queue Sync
  enqueueOfflineAction(action) {
    this.db.offlineQueue.push({
      ...action,
      queuedAt: new Date().toISOString()
    });
    this.notify();
  }

  syncOfflineQueue() {
    if (!this.db.offlineQueue || this.db.offlineQueue.length === 0) return 0;

    let syncedCount = 0;
    const queue = [...this.db.offlineQueue];
    this.db.offlineQueue = [];

    queue.forEach((item) => {
      if (item.type === 'clock_in') {
        this.clockIn(item.workerId, item.sector, true);
        syncedCount++;
      } else if (item.type === 'submit_hazard') {
        this.submitCase(item.payload);
        syncedCount++;
      }
    });

    this.addAuditEntry('System Sync', 'Offline Queue Flushed', `Synchronized ${syncedCount} offline records`);
    this.notify();
    return syncedCount;
  }

  // Audit and Notification Helpers
  addAuditEntry(actor, action, details) {
    this.db.auditLog.unshift({
      id: `aud_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      actor,
      action,
      details
    });
  }

  addNotification(notif) {
    this.db.notifications.unshift({
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      userId: notif.userId || 'usr_w1',
      title: notif.title,
      message: notif.message,
      type: notif.type || 'info',
      read: false,
      timestamp: 'Just now'
    });
  }

  markNotificationRead(id) {
    const n = this.db.notifications.find((item) => item.id === id);
    if (n) {
      n.read = true;
      this.notify();
    }
  }

  markAllNotificationsRead(userId) {
    this.db.notifications.forEach((n) => {
      if (!userId || n.userId === userId) {
        n.read = true;
      }
    });
    this.notify();
  }
}

// Export singleton instance
export const fairShiftDB = new FairShiftDB();
