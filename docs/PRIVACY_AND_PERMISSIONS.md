# Privacy and Permissions

## Core Rule

**Private by default.**

All colony data belongs to the institution unless explicitly shared.

## Colony Register Data

Private to the organization. Includes:

- Frog records and cycle status
- Photos and embeddings
- Locations and bin states
- Use/rest history and rotation data
- Performance ratings and trends
- Protocols and results
- Environmental observations
- Notifications
- Team membership
- Analytics and reports
- Forecasts and recommendations

## Role-Based Access

### Owner

Full access. Can manage billing, delete organization, transfer ownership.

### Admin

Can manage team, settings, lab mode, modules, notification rules. Can delete frogs, manage shipments.

### Manager

Can manage locations, notifications, shipments, reports. Can view analytics.

### Tech

Can create/edit frogs, log events, upload photos, manage day-to-day operations.

### Viewer

Read-only access to frogs, locations, events, and reports.

## Organization-Level Settings

- primary_lab_mode: Chosen by admin/owner
- enabled_modules: Chosen by admin/owner
- rotation_settings: Managed by admin/manager
- notification_rules: Managed by admin/manager

## Supplier-Created Records

If Xenopus 1 or another supplier creates shipment records, the supplier may retain access to:

- Shipment date
- Order reference
- Original shipment inventory
- Supplier-created frog codes
- Supplier-created photos, if applicable

Customer-added data remains private unless explicitly shared.

## Frog Social Integration (Case Packet Architecture)

**Nothing is shared with Frog Social automatically.**

XenoTrack is the private source of truth. Frog Social receives only selected, user-approved case packets. No colony data is shared without explicit user action.

### Case Packets

A case packet is a curated, previewable bundle of selected XenoTrack records that a user may choose to send to Frog Social for case support.

Case packets may include (user selects each category):

- Selected frog records
- Selected bin/location records
- Use/rest history
- Performance ratings
- Movement/repopulation history
- Feeding logs (if husbandry module enabled)
- Husbandry checkpoints (if enabled)
- Environmental notes (if enabled)
- Photos (if selected)
- Protocols/results (if selected)
- Shipment/source/cohort data (if selected)
- User-written problem description
- Date range

### User Flow

1. Choose issue type
2. Choose scope (frog, bin, multiple bins, rack, room, shipment/cohort, custom date range)
3. Select data categories to include
4. Choose sharing mode
5. Preview exactly what will be shared
6. Submit case packet (or save as draft)

### Sharing Modes

| Mode | Description |
|------|-------------|
| Private case support | Only visible to Frog Social support team. Lab identity known but case is not public. |
| De-identified community case | Shared anonymously with community archive. Lab identity and frog IDs removed. |
| Public / attributed case | Shared publicly with lab name attached. |

**Default: Private case support.**

### Preview and Consent

Before submitting, the user must see:

- What records are included
- What records are excluded
- Whether lab identity is included
- Whether photos are included
- Whether source/shipment data is included
- Whether environmental/husbandry data is included
- Whether the case may contribute to broader case history

Clear language: "Your full colony register is not shared. Only the selected records below will be sent."

### Resolution Loop

When Frog Social resolves a case, resolution data may be returned to XenoTrack:

- Resolution summary
- Likely contributing factors
- Recommended actions
- Related case references
- Status: unresolved / monitoring / resolved
- User may choose to save resolution to bin/frog history

### Revocation

Users may revoke a shared case at any time. Revoking sets the case_link status to "revoked" and notifies Frog Social to remove shared data.

### Privacy Rules

- No automatic sharing — all case packets are user-initiated
- No background data collection by Frog Social
- Preview before every submission
- De-identification options available
- Resolution data is private to the organization until user shares further
- Module must be explicitly enabled before any UI appears

## Data Retention

- Organizations own their data
- Data persists until organization deletes it
- Deleted organizations have data permanently removed after grace period
- No cross-organization data sharing without explicit consent
