# Repopulation and Bin Guidance

## Purpose

Help staff decide which bins/tanks to use when repopulating, rotating, or moving frogs.

The system must prevent colony management from relying on memory or scattered notes, especially for labs with 50–75 bins and 300–400 frogs.

## Inputs

- Bin/tank capacity and target capacity
- Current frog count vs target
- Frog sex/size class
- Frog cycle state (available, resting, overdue, etc.)
- Bin cycle state (ready, resting, needs repopulation, etc.)
- Rest status and rest-complete dates
- Recent health notes
- Recent performance history
- Source/cohort/shipment
- Movement history
- Quarantine status
- Environmental observations
- Lab-mode-specific preferences

## Basic Rules v1

A bin is a good candidate for repopulation if:

- It has capacity below target
- It does not have active health warnings
- It is compatible with the frog's sex/size/class
- It is not flagged as quarantine/hold
- It has no recent abnormal performance cluster
- Its cycle state is appropriate (general_population, ready_for_use, needs_repopulation)

A frog is a good candidate for use if:

- It is active
- Its cycle state is available or rest_complete
- It has no active health warning
- It meets the lab's minimum rest interval
- Its recent performance does not indicate review/retirement
- It is not flagged do_not_use

A bin is the next best use candidate if:

- Its cycle state is ready_for_use or rest_complete
- Its rest period meets or exceeds target rest days
- It has adequate frog count
- Its average performance is acceptable
- It has no active warnings

## Output

The system should show:

### Repopulation Recommendations

- Bins needing repopulation
- Current count vs target capacity
- Number of frogs needed
- Eligible source bins/frogs from general population
- Bins/frogs to avoid and why
- Source/cohort/shipment information if available

### Next-Use Recommendations

- Next recommended bins for use
- Reason strings explaining each recommendation
- Rest duration and availability dates
- Performance history
- Use count this cycle and historical

### Warnings

- Bins to avoid with reasons
- Frogs to avoid with reasons
- Overdue bins needing attention
- Performance decline alerts

## Bulk Operations

Without bulk actions, the product will not work for 300–400 frog colonies.

Required bulk actions:

- Bulk assign frogs to bin
- Bulk log use event for entire bin
- Bulk move frogs to rest
- Bulk mark rest complete
- Bulk repopulate bin
- Filter by ready/resting/overdue/performance/location
- Export CSV of current state

## Example: Repopulation

"Rack 2 / Bin 14 needs repopulation. Current: 3/8. Add 5 mature females. Suggested source: General Population / Bin GP-4. Avoid frogs used within 90 days."

## Example: Next Use

"Next suggested extraction bin: Rack 1 / Bin 6. Reason: rest complete 112 days, 8 frogs available, average performance 4.2/5, no active warnings."

## Example: Bin Card

```
Rack 2 / Bin 14
Status: Needs Repopulation
Current: 3 frogs | Target: 8
Deficit: 5 mature females needed
Suggested source: General Population / Bin GP-4
Avoid: Frogs used within 90 days
Last used: Feb 10, 2026
Performance: 3.8 / 5 average
```

## Example: Ready Bin Card

```
Rack 1 / Bin 6
Status: Ready for Use
Rest completed: Apr 20, 2026
Days ready: 14
Current count: 10 frogs
Average performance: 4.2 / 5
Use count this cycle: 0
Recommended action: Use next for extraction
```
