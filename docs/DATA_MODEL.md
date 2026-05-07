# Data Model

## Core Tables

### organizations

Represents a lab, institution, supplier, or admin organization.

Fields:

- id
- name
- organization_type: lab, supplier, platform
- primary_lab_mode: extract, developmental, ovary_oocyte, transgenic, general
- enabled_modules: JSON array of enabled module keys
- created_at

### users

Application users (managed via Supabase Auth).

Fields:

- id
- email
- name
- phone_number
- notification_preferences
- created_at

### organization_memberships

Connects users to organizations.

Fields:

- id
- organization_id
- user_id
- role: owner, admin, manager, tech, viewer
- created_at

### rotation_settings

Lab-configurable rotation parameters per organization.

Fields:

- id
- organization_id
- minimum_rest_days (e.g., 90)
- target_rest_days (e.g., 120)
- overdue_after_days (e.g., 135)
- preferred_reuse_window_start (e.g., 90)
- preferred_reuse_window_end (e.g., 120)
- default_target_bin_capacity (e.g., 8)
- default_mode: extract, developmental, ovary_oocyte, transgenic, general
- created_at

### locations

Rooms, racks, bins, tanks, tubs, cohorts.

Fields:

- id
- organization_id
- parent_location_id
- location_type: room, rack, bin, tank, tub, cohort
- label
- capacity
- status: active, inactive, quarantine, hold
- notes
- created_at

### frogs

Individual animal records.

Fields:

- id
- organization_id
- public_code (globally unique, e.g., XL-2025-0042)
- local_id (institution-specific)
- source
- shipment_id
- sex: male, female, unknown
- size_class: juvenile, sub-adult, adult, large-adult
- status: active, resting, retired, deceased
- current_location_id
- created_at
- updated_at

### frog_cycle_status

Computed/cached rotation state per frog.

Fields:

- id
- frog_id
- current_cycle_state: available, scheduled, recently_used, resting, rest_complete, overdue, hold_monitor, retired, deceased
- last_used_at
- rest_started_at
- rest_complete_at
- overdue_at
- use_count
- average_performance_score
- performance_trend: improving, stable, declining
- do_not_use: boolean
- retirement_candidate: boolean
- updated_at

### bin_cycle_status

Computed/cached rotation state per bin (location).

Fields:

- id
- location_id
- current_cycle_state: general_population, recent_arrival, ready_for_use, scheduled_next, recently_used, needs_repopulation, resting, rest_complete, overdue, hold_monitor
- last_used_at
- rest_started_at
- rest_complete_at
- overdue_at
- target_capacity
- current_count
- use_count
- average_performance_score
- performance_trend: improving, stable, declining
- updated_at

### frog_events

Use, rest, performance, health, movement, and protocol history.

Fields:

- id
- organization_id
- frog_id (nullable for bin-level events)
- location_id
- event_type: use, rest_start, rest_complete, performance, health, movement, extraction, squeeze, injection, breeding, fertilization, embryo_staging, protocol_result, environmental_note
- event_date
- notes
- outcome
- created_by
- created_at

### frog_photos

Photos attached to frogs.

Fields:

- id
- organization_id
- frog_id
- image_url
- thumbnail_url
- photo_type: dorsal, ventral, side, general, health, shipment, event
- uploaded_by
- quality_status
- future_embedding_status: not_started, queued, processing, complete, failed
- created_at

### frog_measurements

Reserved for future weight/SVL/body condition.

Fields:

- id
- organization_id
- frog_id
- measurement_type: weight, svl, body_width
- value
- unit
- linked_photo_id
- capture_method
- confidence_score
- measured_at

### image_embeddings

Reserved for future biometric matching.

Fields:

- id
- organization_id
- frog_id
- frog_photo_id
- embedding (vector)
- model_name
- created_at

### shipments

Supplier or lab shipment archive.

Fields:

- id
- organization_id
- supplier_organization_id
- shipment_date
- order_reference
- status: draft, in_transit, received, claimed
- claim_status: unclaimed, claimed, expired
- created_at

### performance_ratings

Individual performance scores per use event.

Fields:

- id
- organization_id
- frog_id
- location_id
- event_id
- score (1–5 numeric)
- quality_label: poor, fair, good, excellent
- usable: yes, partial, no
- notes
- protocol_id
- result_id
- created_at

### protocols

Lab protocol definitions.

Fields:

- id
- organization_id
- name
- protocol_type
- notes
- version
- active: boolean
- created_at

### results

Structured result records linked to events/protocols.

Fields:

- id
- organization_id
- protocol_id
- event_id
- frog_id
- location_id
- result_type
- outcome_summary
- data_json (flexible structured data)
- created_at

### environmental_observations

Environmental and husbandry data.

Fields:

- id
- organization_id
- location_id
- frog_id (optional)
- event_id (optional)
- protocol_id (optional)
- observation_type: water_temperature, room_temperature, ph, conductivity, water_source, feeding_change, lighting_change, filtration_change, density_change, disturbance, husbandry_intervention, seasonal_note, staff_change, protocol_change
- value (numeric, nullable)
- unit
- notes
- observed_at
- created_at

### recommendations

System-generated recommendations for rotation/repopulation.

Fields:

- id
- organization_id
- recommendation_type: next_use, repopulation, rest_complete, overdue_review, performance_review
- target_location_id
- target_frog_id
- reason
- priority: low, medium, high, urgent
- status: pending, accepted, dismissed, expired
- created_at

### notification_rules

Notification settings per organization.

Fields:

- id
- organization_id
- rule_type: rest_complete, overdue, repopulation, next_use, missing_result, weekly_summary, daily_summary, environment_note, performance_decline, forecast_summary
- channel: email, sms, in_app
- enabled: boolean
- schedule (cron or frequency string)
- created_at

### notification_events

Actual messages sent or queued.

Fields:

- id
- organization_id
- user_id
- channel: email, sms, in_app
- subject
- body
- status: queued, sent, delivered, failed
- sent_at
- created_at

## Analytics / Reporting (Derived)

The following are derived/aggregated views or queries, not necessarily separate tables:

- Colony state counts (frogs by cycle state, bins by cycle state)
- Monthly performance summary
- Seasonal performance summary
- Rest-duration vs performance correlation
- Source/cohort/shipment performance summary
- Environmental observation trends
- 30/60/90/120-day availability forecast
- Repopulation demand over time
