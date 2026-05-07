# Imaging Roadmap

## Current MVP

The current system supports:

- Ordinary frog photo upload
- Photos attached to frog records
- Photos attached to shipments
- Photos attached to events/health notes
- Phone/cellphone upload
- Photo type categorization (dorsal, ventral, side, general, health, shipment, event)
- Quality status tracking
- Future embedding status field (not_started, queued, processing, complete, failed)

## Future Imaging Vision

### Phase 1: Guided Photo Capture

- Cellphone-based guided frog photo capture
- On-screen overlay for consistent dorsal positioning
- Photo quality check before upload
- Standardized dorsal image capture
- Tips and feedback for better photos

### Phase 2: Image Processing

- Image quality scoring (automated)
- Background removal/standardization
- Thumbnail and gallery generation
- Photo-to-frog association verification

### Phase 3: Biometric Matching

- Image embedding / fingerprint generation
- Model-based feature extraction
- Photo-to-frog matching (re-identification)
- Confidence scoring
- Match/no-match thresholds
- New frog vs existing frog determination

### Phase 4: Capture Station

- Motion-triggered capture station
- Standardized lighting/positioning
- Automated image pipeline
- Batch processing

### Phase 5: Morphometric Measurements

- Weight capture (scale integration)
- Snout–vent length (SVL) estimation from photo
- Body condition scoring
- Body width measurement
- Growth tracking over time

## Schema Fields (Preserved / Future-Ready)

### frog_photos

- photo_type: dorsal, ventral, side, general, health, shipment, event
- quality_status: pending, acceptable, good, excellent, rejected
- future_embedding_status: not_started, queued, processing, complete, failed

### frog_measurements

- measurement_type: weight, svl, body_width
- value, unit
- linked_photo_id
- capture_method: manual, scale, photo_estimate, station
- confidence_score

### image_embeddings

- frog_id, frog_photo_id
- embedding (vector type)
- model_name
- created_at

## Do Not Build Yet

- Biometric matching logic
- Camera station integration
- Scale integration
- SVL automation from photos
- Motion-triggered capture
- Automated quality scoring
- Embedding generation pipeline

## Integration Notes

- Imaging is a XenoTrack-native feature, not Frog Social
- Photos and embeddings remain private to the organization
- Optional future: user-controlled sharing of de-identified photos for research
- The schema is designed so imaging can be added incrementally without migration chaos
