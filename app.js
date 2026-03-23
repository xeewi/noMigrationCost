// app.js — Formula engine and Alpine.js appState component
// Depends on: data.js (loaded before this file via <script src>)
// No ES Module syntax — global scope only, file:// protocol compatible
//
// NOTE: In index.html, use x-model.number on numeric inputs so Alpine
// stores numbers, not strings. Arithmetic on strings produces NaN silently.

// =============================================================================
// Section A — Pure formula functions
// Declared with `function` keyword for global hoisting and browser-console
// testability (not arrow functions — see Pitfall 6 in RESEARCH.md).
// =============================================================================

/**
 * Convert story points to development hours.
 *
 * Formula (docs §1.2):
 *   hours = (storyPoints / velocity) × sprintWeeks × 5 × hoursPerDay
 *
 * Worked example: spToHours(40, 30, 2) = (40/30) × 2 × 5 × 7 ≈ 93.33
 *
 * @param {number} storyPoints  - Feature size in story points
 * @param {number} velocity     - Team velocity in SP/sprint
 * @param {number} sprintWeeks  - Sprint duration in weeks (1–4)
 * @returns {number} Estimated development hours
 */
function spToHours(storyPoints, velocity, sprintWeeks) {
  if (velocity <= 0) return 0;
  return (storyPoints / velocity) * sprintWeeks * 5 * FORMULA_DEFAULTS.hoursPerDay;
}

/**
 * Compute total standalone feature cost over a time horizon.
 *
 * Formula (docs §7.1 — Phase 1 standalone variant, no generalization factor):
 *   initialDev       = devHours × hourlyRate
 *   annualMaintenance = initialDev × maintenanceRateShared
 *   total            = initialDev + (annualMaintenance × years)
 *
 * Worked example: computeStandaloneCost(400, 65, 3)
 *   = 26000 + (4680 × 3) = 26000 + 14040 = 40040
 *
 * @param {number} devHours   - Estimated development hours
 * @param {number} hourlyRate - Blended team hourly rate (€/h)
 * @param {number} years      - Time horizon in years
 * @returns {number} Total cost in euros
 */
function computeStandaloneCost(devHours, hourlyRate, years) {
  if (devHours === 0 || hourlyRate === 0) return 0;
  const initialDev = devHours * hourlyRate;
  const annualMaintenance = initialDev * FORMULA_DEFAULTS.maintenanceRateShared;
  return initialDev + (annualMaintenance * years);
}

/**
 * Compute cost breakdown by category (D-11).
 *
 * Returns an array of 5 rows matching the breakdown table columns:
 *   { category: string, hours: number, cost: number, pct: number }
 *
 * Rows: Initial Development, Maintenance, Coordination, Bug Fixing, Sync Overhead.
 * Coordination / Bug Fixing / Sync Overhead are zero in Phase 1 (shared-code model
 * only; duplicated-code overhead is Phase 2).
 *
 * @param {number} devHours   - Estimated development hours
 * @param {number} hourlyRate - Blended team hourly rate (€/h)
 * @param {number} years      - Time horizon in years
 * @returns {Array<{category: string, hours: number, cost: number, pct: number}>}
 */
function computeBreakdown(devHours, hourlyRate, years) {
  const zero = { hours: 0, cost: 0, pct: 0 };

  if (devHours === 0 || hourlyRate === 0) {
    return [
      { category: 'Initial Development', ...zero },
      { category: 'Maintenance',         ...zero },
      { category: 'Coordination',        ...zero },
      { category: 'Bug Fixing',          ...zero },
      { category: 'Sync Overhead',       ...zero }
    ];
  }

  const initialDev = devHours * hourlyRate;
  const maintenanceCost = initialDev * FORMULA_DEFAULTS.maintenanceRateShared * years;
  const maintenanceHours = devHours * FORMULA_DEFAULTS.maintenanceRateShared * years;
  const total = initialDev + maintenanceCost;

  return [
    {
      category: 'Initial Development',
      hours: devHours,
      cost:  initialDev,
      pct:   total > 0 ? initialDev / total : 0
    },
    {
      category: 'Maintenance',
      hours: maintenanceHours,
      cost:  maintenanceCost,
      pct:   total > 0 ? maintenanceCost / total : 0
    },
    {
      category: 'Coordination',
      hours: 0,
      cost:  0,
      pct:   0
    },
    {
      category: 'Bug Fixing',
      hours: 0,
      cost:  0,
      pct:   0
    },
    {
      category: 'Sync Overhead',
      hours: 0,
      cost:  0,
      pct:   0
    }
  ];
}

/**
 * Format a number as a Euro currency string (French locale, no decimals).
 *
 * @param {number} value
 * @returns {string} e.g. "40 040 €"
 */
function formatEur(value) {
  if (!value || isNaN(value)) return '—';
  return value.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  });
}

/**
 * Format a decimal as a percentage string with one decimal place.
 *
 * @param {number} value - e.g. 0.65
 * @returns {string} e.g. "65.0%"
 */
function formatPct(value) {
  return (value * 100).toFixed(1) + '%';
}

/**
 * Format a number of hours, rounded to nearest integer.
 *
 * @param {number} value
 * @returns {string} e.g. "400 h"
 */
function formatHours(value) {
  return Math.round(value) + ' h';
}

// =============================================================================
// Section B — Alpine.js appState component
// Return object drives x-data on the root element in index.html.
// =============================================================================

/**
 * Alpine.js single-component state for the Feature Cost Calculator.
 *
 * Usage in index.html: <body x-data="appState()">
 *
 * All inputs are reactive via x-model.number (numeric) or x-model (string).
 * All outputs are computed getters that recalculate automatically.
 */
function appState() {
  return {
    // -------------------------------------------------------------------------
    // Team state (D-01: fixed 4-slot grid)
    // -------------------------------------------------------------------------
    team: SENIORITY_LEVELS.map(function(level) {
      return {
        seniority:  level.label,
        headcount:  0,
        hourlyRate: level.defaultRate
      };
    }),

    // -------------------------------------------------------------------------
    // Feature sizing state
    // -------------------------------------------------------------------------
    sizingMode:  'sp',     // 'sp' | 'hours'  (D-05 tab switch)
    storyPoints: 0,        // story points count (D-06)
    velocity:    30,       // SP/sprint default from docs §1.2 (D-06)
    sprintWeeks: 2,        // sprint duration in weeks (D-06)
    directHours: 0,        // direct hour input (D-07)
    directDays:  0,        // direct days input (D-07)
    directUnit:  'hours',  // 'hours' | 'days' (D-07 toggle)

    // -------------------------------------------------------------------------
    // Time horizon (D-09: preset buttons — 1, 3, 5, 10 years)
    // -------------------------------------------------------------------------
    horizonYears: 3,

    // -------------------------------------------------------------------------
    // Computed: team weighted-average hourly rate (D-04, TEAM-05)
    // Returns 0 when no headcount declared (prevents division by zero)
    // -------------------------------------------------------------------------
    get teamAverageRate() {
      const totalHeadcount = this.team.reduce(function(s, r) { return s + r.headcount; }, 0);
      if (totalHeadcount === 0) return 0;
      const weightedSum = this.team.reduce(function(s, r) { return s + r.headcount * r.hourlyRate; }, 0);
      return weightedSum / totalHeadcount;
    },

    // -------------------------------------------------------------------------
    // Computed: estimated development hours (D-08, SIZE-05)
    // Branches on sizingMode — SP path uses spToHours(), direct path converts
    // -------------------------------------------------------------------------
    get devHours() {
      if (this.sizingMode === 'sp') {
        return spToHours(this.storyPoints, this.velocity, this.sprintWeeks);
      } else {
        if (this.directUnit === 'days') return this.directDays * FORMULA_DEFAULTS.hoursPerDay;
        return this.directHours;
      }
    },

    // -------------------------------------------------------------------------
    // Computed: total standalone cost (COST-01)
    // -------------------------------------------------------------------------
    get standaloneCost() {
      return computeStandaloneCost(this.devHours, this.teamAverageRate, this.horizonYears);
    },

    // -------------------------------------------------------------------------
    // Computed: breakdown rows array (COST-02, D-11)
    // -------------------------------------------------------------------------
    get costBreakdown() {
      return computeBreakdown(this.devHours, this.teamAverageRate, this.horizonYears);
    },

    // -------------------------------------------------------------------------
    // Computed: are outputs ready to display? (UI-SPEC States)
    // -------------------------------------------------------------------------
    get hasValidInputs() {
      return this.teamAverageRate > 0 && this.devHours > 0;
    }
  };
}
