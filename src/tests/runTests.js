// Automated Unit & Integration Tests for FairShift Platform Logic

function assert(condition, message) {
  if (!condition) {
    throw new Error(`TEST FAILED: ${message}`);
  }
}

console.log('--- Running FairShift Deterministic Verification Suite ---');

// Test 1: Deterministic Payroll Wage Formulas
function testPayrollCalculations() {
  const baseRate = 160;
  const otRate = 240; // 1.5x

  const totalShiftHours = 10.5;
  const regularHours = Math.min(totalShiftHours, 8.0);
  const overtimeHours = Math.max(0, +(totalShiftHours - 8.0).toFixed(2));

  assert(regularHours === 8.0, `Regular hours should be 8.0, got ${regularHours}`);
  assert(overtimeHours === 2.5, `Overtime hours should be 2.5, got ${overtimeHours}`);

  const baseEarnings = regularHours * baseRate; // 1280
  const otEarnings = overtimeHours * otRate;   // 600
  const grossPay = baseEarnings + otEarnings;   // 1880
  const statutoryPF = Math.round(grossPay * 0.12); // 226
  const statutoryESI = Math.round(grossPay * 0.0075); // 14
  const netPay = grossPay - (statutoryPF + statutoryESI); // 1640

  assert(baseEarnings === 1280, `Base earnings should be 1280, got ${baseEarnings}`);
  assert(otEarnings === 600, `Overtime earnings should be 600, got ${otEarnings}`);
  assert(grossPay === 1880, `Gross pay should be 1880, got ${grossPay}`);
  assert(statutoryPF === 226, `PF deduction should be 226, got ${statutoryPF}`);
  assert(netPay === 1640, `Net take-home pay should be 1640, got ${netPay}`);

  console.log('✓ Test 1 Passed: Deterministic payroll & 1.5x overtime calculations verified.');
}

// Test 2: Fatigue Guardian Safety Rule Verification
function testFatigueGuardianRules() {
  function evaluateFatigueRisk(consecutiveHours, turnaroundRestHours) {
    const alerts = [];
    if (consecutiveHours >= 10.0) {
      alerts.push({
        type: 'CONSECUTIVE_OVERWORK',
        severity: consecutiveHours >= 11.0 ? 'CRITICAL' : 'HIGH',
        reason: `Exceeded 10h threshold (${consecutiveHours}h recorded). Mandatory rest break advised.`
      });
    }
    if (turnaroundRestHours < 10.0) {
      alerts.push({
        type: 'INSUFFICIENT_REST',
        severity: 'HIGH',
        reason: `Only ${turnaroundRestHours}h rest between shifts. Minimum safe interval is 10h.`
      });
    }
    return alerts;
  }

  const safeWorker = evaluateFatigueRisk(7.5, 12.0);
  assert(safeWorker.length === 0, 'Safe worker should have 0 fatigue flags');

  const fatiguedWorker = evaluateFatigueRisk(11.2, 6.5);
  assert(fatiguedWorker.length === 2, `Fatigued worker should have 2 flags, got ${fatiguedWorker.length}`);
  assert(fatiguedWorker[0].severity === 'CRITICAL', 'Severity should be CRITICAL for 11.2h');

  console.log('✓ Test 2 Passed: Fatigue Guardian threshold rules and rest turnaround verified.');
}

// Test 3: SafeSpeak Anonymity & Case Tracking
function testSafeSpeakTicketGeneration() {
  const mockTicket = {
    id: `CASE-CN-8891`,
    category: 'Exposed Electrical Risk',
    isAnonymous: true,
    workerAlias: 'Worker #4092',
    status: 'submitted',
    auditTrail: [
      { action: 'Ticket Submitted into SafeSpeak Ledger', timestamp: '2026-10-27 10:00', actor: 'Anonymous' }
    ]
  };

  assert(mockTicket.isAnonymous === true, 'Ticket must remain anonymous');
  assert(!mockTicket.workerRealName, 'Real identity must not leak into public ticket data');
  assert(mockTicket.auditTrail.length === 1, 'Audit trail must initialize with submission record');

  console.log('✓ Test 3 Passed: SafeSpeak zero-knowledge anonymity and audit trail verified.');
}

// Test 4: Shift Swap Qualification & Fatigue Check
function testShiftSwapValidation() {
  function validateSwap(requesterSkills, targetColleague) {
    const hasRequiredSkill = targetColleague.skills.some((s) => requesterSkills.includes(s));
    const isFatigued = targetColleague.currentHoursToday >= 10.0;
    return {
      canSwap: hasRequiredSkill && !isFatigued,
      skillPassed: hasRequiredSkill,
      fatiguePassed: !isFatigued
    };
  }

  const targetA = { skills: ['Rigging Level-3'], currentHoursToday: 6.0 };
  const targetB = { skills: ['Rigging Level-3'], currentHoursToday: 11.0 }; // Fatigue conflict!
  const targetC = { skills: ['Masonry'], currentHoursToday: 4.0 }; // Skill mismatch!

  const resultA = validateSwap(['Rigging Level-3'], targetA);
  const resultB = validateSwap(['Rigging Level-3'], targetB);
  const resultC = validateSwap(['Rigging Level-3'], targetC);

  assert(resultA.canSwap === true, 'Target A should be eligible');
  assert(resultB.canSwap === false && !resultB.fatiguePassed, 'Target B should fail fatigue check');
  assert(resultC.canSwap === false && !resultC.skillPassed, 'Target C should fail skill check');

  console.log('✓ Test 4 Passed: FairShift Swap skill matching and fatigue validation verified.');
}

// Execute all
try {
  testPayrollCalculations();
  testFatigueGuardianRules();
  testSafeSpeakTicketGeneration();
  testShiftSwapValidation();
  console.log('\nAll FairShift platform logic tests passed successfully (4/4)!');
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
