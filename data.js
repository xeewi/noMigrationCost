// data.js — Salary constants and formula defaults
// Source: docs/feature-cost-shared-vs-duplicated.md §1.3, §7.1, §7.2
// No ES Module syntax — loaded via <script src> for file:// protocol compatibility

// =============================================================================
// SALARY_DEFAULTS
// French loaded employer cost: gross salary × 1.42 / 1607 hours/year
// Source: docs §1.3 — French developer market data
// =============================================================================
const SALARY_DEFAULTS = {
  junior: 32,  // €/h — loaded cost
  mid:    40,  // €/h — loaded cost
  senior: 51,  // €/h — loaded cost
  lead:   67   // €/h — loaded cost
};

// =============================================================================
// FORMULA_DEFAULTS
// Cost model parameters from research doc
// Source: docs §7.1 (shared code model), §7.2 (duplicated code model)
// =============================================================================
const FORMULA_DEFAULTS = {
  // Maintenance rates (annual, as fraction of initial dev cost)
  maintenanceRateShared:     0.18,  // 15–25% range; shared code lower bound (§7.1)
  maintenanceRateDuplicated: 0.22,  // 20–30% range; for Phase 2 duplicated model (§7.2)

  // Generalization and porting — Phase 2 shared-code model (§7.1)
  generalizationFactor: 1.3,  // 1.2–1.4 range: extra effort to make code reusable
  portingFactor:        0.65, // 0.5–0.8 range: fraction of dev cost to port to new context

  // Divergence and bug propagation — Phase 2 duplicated-code model (§7.2)
  divergenceRate:       0.20, // 15–30% per year: rate at which duplicated copies drift
  bugDuplicationFactor: 2.0,  // 1.5–3.0 range: multiplier for bugs in duplicated code

  // Time constants (French legal standards)
  hoursPerDay:  7,    // 35h/week ÷ 5 days = 7h/day (French statutory)
  hoursPerYear: 1607  // French annual legal working hours basis
};

// =============================================================================
// SENIORITY_LEVELS
// Fixed 4-slot grid for team composition input (D-01, D-02)
// =============================================================================
const SENIORITY_LEVELS = [
  { key: 'junior', label: 'Junior', defaultRate: SALARY_DEFAULTS.junior },
  { key: 'mid',    label: 'Mid',    defaultRate: SALARY_DEFAULTS.mid    },
  { key: 'senior', label: 'Senior', defaultRate: SALARY_DEFAULTS.senior },
  { key: 'lead',   label: 'Lead',   defaultRate: SALARY_DEFAULTS.lead   }
];
