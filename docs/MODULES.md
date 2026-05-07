# Product Ladder — Base Product & Future Add-ons

## Core Rule

XenoTrack starts as a **simple, standalone colony register**. The base product should not feel overcomplicated. Husbandry/Frog Sentinel, imaging/photo recognition, and Frog Social case-linking are **future add-ons**, not part of the required base product.

---

## Base Product: XenoTrack Colony Register

The base product focuses on:

| Feature | Description |
|---------|-------------|
| Private lab workspace | Secure, organization-scoped data |
| Bin-centered colony register | Bins as the primary operating unit |
| Frog inventory | Individual frog records inside bins |
| Frog photos (archive) | Upload and store photos with frog/bin/event records |
| Use/rest rotation tracking | Cycle states, rest timers, reuse windows |
| Repopulation planning | Bin capacity monitoring, GP source tracking |
| Next-use recommendations | Suggested bins for extraction |
| Performance notes | Post-use quality ratings |
| Past/future views | Historical timeline and upcoming calendar |
| Daily/weekly/monthly summaries | Colony status at a glance |
| Capacity forecasting | Run-out prediction, supply vs demand |
| Bottleneck detection | Bottleneck categories with severity |
| Email/SMS notifications | Rest-complete, overdue, repopulation needed |

**The base product should feel like:**
"Track your frogs and bins, know what is ready, know what needs rest, and avoid losing colony history."

**The base dashboard shows ONLY rotation/colony actions. No add-on features appear unless explicitly enabled.**

---

## Photo Upload: Now vs Later

### Now (Base Product)

- Users upload frog photos and bin photo sets
- Photos are stored as part of the colony archive
- Photos attach to: individual frogs, bins, shipments, or events
- Users can search/view photos manually
- Photos are stored in a structured way to support future learning

**Language:** "Upload photos now to build your colony archive. Future photo-ID tools may use these records to help match individual frogs."

### Later (Photo-ID Add-on)

- Cellphone-guided photo capture
- Photo quality scoring
- Image fingerprinting
- Photo-to-frog matching
- Pre-cataloged shipment records (Xenopus 1)
- Paid photo-ID/imaging add-on

**Do not build biometric matching now.**

---

## Future Paid Add-on: Photo-ID & Imaging

**Status: Coming soon**

Use structured frog photos and future image matching to help identify individual frogs and connect them to colony records.

Features:
- Phone-guided photo capture
- Image quality scoring
- Photo fingerprinting / image embeddings
- Photo-to-frog matching
- Xenopus 1 pre-cataloged shipment records
- Biometric matching engine

---

## Future Paid Add-on: Frog Sentinel

**Status: Coming soon**

Husbandry companion for labs that want deeper colony care tracking alongside standard rotation.

Features:
- Feeding schedules and logs
- Husbandry checkpoints (visual checks, post-use recovery, water quality)
- Environmental notes (temperature, pH, conductivity)
- Care alerts and recovery tracking
- Performance/husbandry correlations
- Deeper colony health support

---

## Future Paid Add-on: Frog Social Case Support

**Status: Future (architecture only)**

Optionally share selected records with Frog Social for expert case consultation.

Rules:
1. XenoTrack remains **private by default**
2. **No colony data goes to Frog Social automatically**
3. Users may choose to create case packets from selected records
4. Users **preview exactly what will be shared** before sending
5. De-identification options available
6. Resolution returned to private record
7. Users can revoke sharing at any time

**Not available to users now.** Architecture exists in schema and code but is not exposed in navigation or UI.

---

## Future Add-on: Visual Analytics

**Status: Future**

Charts, seasonality trends, and visual dashboards for colony performance and capacity.

---

## Navigation Behavior

### Default (base product)

```
Colony: Today's Actions, Bins & Rotation, Whole Colony, Frogs, Repopulation, Rooms & Racks
Forecast: Forecast, Capacity / Run-Out, Bottlenecks
Records: Events, Performance, Photos, History
System: Notices, Shipments, Workspace
```

### When add-ons are enabled (future)

Additional nav sections may appear for enabled modules only.
Add-ons do not appear in navigation until explicitly enabled by an admin.

---

## Module Entitlement (Technical)

The `organizations.enabled_modules` JSONB column lists active module names.

The `organization_module_trials` table tracks trial status per organization.

Future billing (Stripe, subscriptions, trial enforcement) will be added later. **Do NOT build billing yet.**

---

## Dashboard Behavior

The base dashboard shows only:
- Today's colony actions (bins needing repop, next-use, rest-complete, overdue)
- Run-out / bottleneck warnings
- Notices sent/pending
- Missing performance results

Add-on features only appear on the dashboard when their module is enabled.
**Add-ons enhance, not clutter, the core experience.**
