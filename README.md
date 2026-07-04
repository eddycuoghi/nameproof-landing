# nameproof-landing

## v1.0.5 consistency update
- Unified trademark/company registry messaging across public pages.
- Added USPTO/EUIPO/WIPO/UK Companies + UKIPO badge language consistently.
- Clarified distinction between Trademark Screening and Company & Registry Signals.


## v1.0.7 frontend schema alignment
- Updated index.html renderAssessment() to read the Canonical JSON shape:
  assessment.final_recommendation, assessment.overall_risk, assessment.confidence, executive_summary and signals[].
- Updated frontend fallback shape to match the Canonical Assessment Schema.
- Harmonized remaining UK/Companies House copy in public HTML pages.


## v1.0.8 final copy review
- Fixed Company & Registry Signals typo.
- Standardized Brand Decision Report pricing bullets across public pages.
- Added clearer preliminary/not-legal-advice wording near the homepage assessment.
- Added trademark-signal legal caveat to trademark content.
- Cleaned domain availability wording.


## v1.0.9 GO LIVE
- Final go-live copy cleanup after Claude/Perplexity review.
- Fixed remaining Company & Registry Signals typo risk.
- Standardized Brand Decision Report feature bullets across public pages.
- Added clearer registry/preliminary-signals disclaimer wording.
- Kept the CTA conversion-focused while preserving legal clarity in the guarantee/disclaimer areas.


## v1.0.10 GO LIVE
- Added dynamic final recommendation + confidence display to the free assessment result card.
- Removed dead payload ternary in renderAssessment().
- Frontend fallback events now track failed fetch/network fallback cases.
