# Frog Sentinel — Camera & Room Monitoring (Future Optional Module)

> **Status:** Architecture notes only. Not part of the base XenoTrack product.
> **Module key:** `frog_sentinel_camera_monitoring`

## Overview

Frog Sentinel is a planned optional add-on that may support simple, low-cost camera setups for colony room monitoring. It is NOT required for core colony tracking and will not be enabled by default.

## Possible Future Capabilities

- Live room feed (local network only)
- Room entry/exit detection
- Light/dark cycle observation and logging
- Motion detection with timestamped events
- Feeding observation support
- Short video clip capture (converted to 3–10 static frames to save storage)
- Timestamped room events linked to colony data
- Camera-linked husbandry notes
- Optional review by lab staff
- Future integration with colony monitoring hardware/devices

## Use Cases

- Confirm room entry or disturbance events
- Monitor feeding behavior (observation only)
- Confirm lights are on/off at expected times
- Document unusual room activity
- Support colony security
- Support future husbandry review
- Connect room events to performance or colony changes later

## Architecture

### Tables (TODO — not created yet)

```sql
-- camera_devices
-- - id uuid primary key
-- - organization_id uuid references organizations(id)
-- - location_id uuid references locations(id)
-- - device_name text
-- - device_type text (webcam / ip_camera / pi_camera / usb_capture / other)
-- - connection_type text (local_network / usb / cloud / other)
-- - status text (active / offline / paused / removed)
-- - last_seen_at timestamptz
-- - created_at timestamptz

-- camera_events
-- - id uuid primary key
-- - organization_id uuid references organizations(id)
-- - camera_device_id uuid references camera_devices(id)
-- - location_id uuid references locations(id)
-- - event_type text (motion / room_entry / light_change / feeding_observed / manual_capture / other)
-- - event_started_at timestamptz
-- - event_ended_at timestamptz
-- - clip_url text (optional — short video clip)
-- - frame_set_url text (optional — folder/path for extracted frames)
-- - notes text
-- - reviewed_by uuid
-- - reviewed_at timestamptz
-- - created_at timestamptz

-- camera_event_frames
-- - id uuid primary key
-- - organization_id uuid references organizations(id)
-- - camera_event_id uuid references camera_events(id)
-- - image_url text
-- - frame_timestamp timestamptz
-- - frame_order integer
-- - created_at timestamptz

-- room_monitoring_settings
-- - id uuid primary key
-- - organization_id uuid references organizations(id)
-- - location_id uuid references locations(id)
-- - monitoring_enabled boolean default false
-- - capture_mode text (live_feed / motion_clips / static_frames / manual_only)
-- - frame_capture_count integer default 5
-- - retention_days integer default 30
-- - notify_on_motion boolean default false
-- - notify_on_light_change boolean default false
-- - notify_recipients jsonb
-- - created_at timestamptz
```

### Module Registration

Add `frog_sentinel_camera_monitoring` to the `organization_module_trials.module_name` check constraint when ready.

### Future Pages / Components

These would only appear if the module is enabled:

- `/sentinel` — Camera overview dashboard
- `/sentinel/devices` — Camera device setup and status
- `/sentinel/events` — Timestamped camera events
- `/sentinel/events/[id]` — Event detail with frames
- `/sentinel/settings` — Room monitoring configuration

### UI Entry Point

A settings card (not in main nav) will indicate:

> "Future module: Frog Sentinel Camera Monitoring"
> Optional room-monitoring tools may support light-cycle checks, entry/motion events,
> feeding observation, and timestamped clips or frames. Not active in the base product.

## Privacy & Security

- Camera monitoring is **opt-in only**
- No camera access by default
- No public camera feeds
- All media private to the organization
- User controls retention and notification settings
- No automatic sharing with Frog Social or any external service
- Organization admin must explicitly enable
- Storage follows same `{organization_id}/sentinel/{device_id}/{filename}` pattern

## Integration Points (Future)

- Link camera events to `frog_events` for correlation
- Link light-cycle observations to `environmental_observations`
- Feeding observations could cross-reference `feeding_logs` (husbandry module)
- Performance analysis could factor in disturbance events

## What This Is NOT

- Not a real-time surveillance system
- Not a biometric recognition tool
- Not a required module
- Not connected to external services
- Not accessible without explicit opt-in
