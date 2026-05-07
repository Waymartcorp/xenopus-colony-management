# Environmental and Results Data

## Environmental Observations

### Purpose

Track environmental and husbandry conditions that may affect colony performance. This is private XenoTrack operational data, not Frog Social.

### Manual Entries (MVP)

- Water temperature
- Room temperature
- pH
- Conductivity
- Water source / water change
- Feeding changes
- Lighting changes
- Filtration / system changes
- Density changes
- Disturbance / vibration notes
- Husbandry interventions
- Seasonal notes
- Staff / protocol changes

### Linkable To

- Room
- Rack
- Bin / tank / tub
- Frog (optional)
- Event
- Protocol
- Result
- Date range

### Future Integration Placeholders

- Sensor / monitoring integrations
- Automated water quality monitoring
- Colony monitoring device integrations
- Environmental observations linked to rooms, systems, bins, frogs, events, protocols, and date ranges

Do not build hardware integration yet.

### Analytics Value

Environmental data enables:
- Performance vs temperature correlation
- Performance vs pH correlation
- Performance vs density correlation
- Performance before/after feeding changes
- Performance before/after husbandry interventions
- Seasonal pattern identification

---

## Protocols

### Purpose

Track named lab protocols and link them to events and results.

### Fields

- name
- protocol_type (extraction, breeding, fertilization, injection, culture, etc.)
- notes
- version
- active flag
- organization-specific

### Usage

- Events can reference a protocol
- Results are linked to protocols
- Performance can be analyzed by protocol
- Protocol changes are trackable over time

---

## Results

### Purpose

Structured outcome records linked to events and protocols.

### Fields

- result_type
- outcome_summary (text)
- data_json (flexible structured data for lab-specific fields)
- linked to: frog, bin/location, protocol, event
- date/time
- created_by user

### Example Result Types

- Extraction yield (oocyte count, quality)
- Fertilization rate
- Embryo survival rate
- Developmental staging outcome
- Screening result (positive/negative/pending)
- General performance note

### Lab-Mode-Specific Results

- Extract Lab: oocyte count, quality grade, usable portion
- Developmental: fertilization %, embryo count, staging
- Ovary/Oocyte: quality score, volume, color
- Transgenic: genotype confirmed, expression level

---

## Performance Ratings

### Purpose

Standardized scoring for individual use events.

### Fields

- score: 1–5 numeric
- quality_label: poor, fair, good, excellent
- usable: yes, partial, no
- notes
- protocol_id (link to protocol used)
- result_id (link to detailed result)

### Derived Metrics

- Average performance per frog
- Average performance per bin
- Performance trend (improving/stable/declining)
- Performance by rest duration
- Performance by source/cohort
- Performance by season/month
- Performance by protocol
- Performance by environmental condition

---

## Note on Data Privacy

Environmental, protocol, and result data are private to the organization. They are XenoTrack operational data and are never shared with Frog Social automatically. Optional user-controlled sharing of de-identified data may be supported later.
