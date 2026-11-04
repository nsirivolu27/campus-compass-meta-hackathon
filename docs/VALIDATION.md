# Pilot validation and next work

## Automated checks

`npm test`: 36 passing behavior tests. Seven tour tests cover preference-sensitive selection, location-sensitive ordering, budgets, invalid GPS fixes, directory-only fallback, official map provenance and GPS exclusion from Meta context. The original 20 cover campus planning, retrieval, journal, directory and field activities. Nine new tests cover trusted campus context, generic-directory limits, citation validation, selected-institution URL boundaries, the Muse HTTP contract with an injected fake provider, setup/credit/network failures, client payload validation a cancelled-native-answer regression and an actual loopback HTTP pairing/origin test. The fake-provider tests are not evidence of successful Meta API access.

`npx --no-install tsc --noEmit`: checks all shared/browser JavaScript with strict TypeScript checking and the native bridge declaration.

`npm run build`: syntax checks JavaScript and bundles the same assets into the browser distribution and Android application.

Android compile: `android/gradlew.bat :app:assembleDebug`. An APK build does not verify physical pairing or voice/audio routing.

## Manual browser checks

The retrieval checks below describe the earlier offline interface. The current Muse revision was checked for setup-needed state, a real HTTP request yielding a readable missing-key error, retry controls and retention of the selected campus/journal. Live model answer quality is not yet evaluated.

- UCSD discovery plan prioritizes Jacobs Hall for engineering.
- Saving a reflection updates the journal count and comparison.
- Study-space question returns a source-linked Geisel Library fact.
- Tuition question explicitly reports missing verified information and can be saved as a question.
- Comparison keeps personal observations separate from questions and leaves other campuses empty.
- UVA visit layout checked at a 390 Ã— 844 phone viewport.

## Physical acceptance checklist â€” not yet verified

- Install on the Android phone paired to the user's Gen 2 glasses.
- Grant, deny and retry Android and Meta camera permissions.
- Return successfully from the Meta AI registration flow.
- Confirm connected state reflects an actual streaming camera session.
- Capture a new still photograph; disconnect/reconnect and retry.
- Fold/remove glasses and confirm status changes; ensure no previous image is described as a fresh recognition result.
- Background the app during startup, capture and narration; confirm camera teardown and no duplicate session after returning.
- Confirm spoken narration reaches the glasses, and determine which microphone Android speech input uses.
- Restart the app and verify journal persistence. Export, open and inspect the JSON.
- Exercise unavailable speech services, unavailable Meta AI and canceled export without losing the journal.

## Next implementation milestones

1. Field-test one campus, recording visitor access constraints and route information.
2. Physically test the upgraded DAT 1.0.1 camera and Speech adapters; compilation has passed.
3. Add a grounded multimodal service with explicit source provenance and conservative landmark matching; do not infer a location merely from the selected campus.
4. Add approved photo/reference data per landmark. Evaluate confident errors before enabling automatic recognition.
5. Add longer campus-specific answers and program facts from official sources, with update dates and unknown handling.
6. Confirm final hackathon rules and submission requirements before packaging; published deadline is November 4, 2026 at 9 PM ET.

## Muse and glasses voice acceptance â€” pending

- Activate credits/billing and configure the local key using `scripts/setup-ai.ps1`.
- Run real Muse questions for all three pilot campuses plus one directory-only school; review citations, unknowns and follow-up answers.
- Pair the USB guide server and test expired pairing codes and server restart recovery.
- Enable the experimental Speech capability; test microphone grants, denial, final/partial transcripts, pause/disconnect, cancellation and background behavior on Gen 2.
- Verify the narrator uses glasses media output and the microphone is DAT Speech, not Android phone dictation.
- Measure actual end-of-speech to spoken-answer delay. No latency or accuracy result has been claimed.
- Deploy authenticated HTTPS service before an untethered campus pilot; the current Android backend path requires USB.

The product scope is nationwide. UC San Diego, UT Austin and UVA are the first detailed guides. The initial directory contains 5,877 institutions; it is not complete physical-campus or verified-tour coverage.

## Current interaction validation

- Source Sans 3 loads from the bundled font; the 390 Ã— 844 mobile layout has no horizontal overflow and its home primary action clears the bottom navigation.
- A draft concern and its category survive marking an activity complete; completion updates the visit progress.
- The falling block-person logo appears in the app header; the same design is packaged as the Android launcher icon.

## Conversational interface revision

- Open activity text, icon navigation, rounded controls and white Android system bars replace the earlier ruled layout.
- Home preferences are expandable; the campus question composer is visible during a visit, with a separate voice action.
- Browser question check: asking about study spaces during the UVA visit returns the sourced Shannon Library answer.
- UI screenshots are omitted from the event repository and README while design work continues.

## College-neutral discovery

- Removed featured-campus tabs and the default UCSD selection.
- Home starts with national search; only a previously selected college appears as a personal continuation.
- The directory initially prompts for a query/state instead of showing an arbitrary school shortlist.
- Selecting a result opens a separate visit-plan screen; browser verified the search → plan → home flow.
- Android debug build and lint passed after the DAT upgrade. Lint retains six non-blocking dependency/target/backup-configuration warnings.


## Personalized starting-point flow · October 27

- Search → Try My Future @ college → major, interests, focus and time → current location or nearby landmark → suggested start and ordered stops → visit.
- Official campus map points cover the existing 12 stops at UCSD, UT Austin and UVA. These are building reference points, not verified entrances. The nationwide directory does not yet provide mapped tours elsewhere.
- The local planner exhaustively evaluates subsets/orders of up to eight sourced candidates, capped at 2/3/4 stops for 20/40/60 minutes. It rewards early subject/interest matches and variety, penalizes travel, and checks a budget using eight minutes per stop plus straight-line distance × 1.4 at 70 metres/minute. This is a planning heuristic, not an optimal or field-verified pedestrian route.
- GPS is requested once by user action, kept only in memory, and omitted from persistence, journal export, Meta requests and Maps URLs. Maps receives only the destination pin and handles its own origin permission. Denied/unavailable, inaccurate (>100 m), stale (>2 minutes), and distant (>3 km from all mapped stops) fixes do not produce a claim of a nearby campus start. Distance thresholds are not campus boundaries.
- Android uses foreground location permission for the bundled app origin only. Physical Android GPS/permission testing is still pending.
- Browser checked: major/interests + manual Newcomb Hall origin produces a plan, Start opens its first stop, and Maps links contain the destination and walking mode. Real GPS and real walking paths have not been field-tested.

- At a 390 × 844 browser viewport, the visit layout has no horizontal overflow. The recommended order and major survive reload; entering a new campus clears the previous route. Harvard was checked for an explicit unmapped activity fallback and no location request.


## Adaptive visits and private HTTPS demo · November 1

- 47 automated tests pass, including visited/skipped state, malformed restore data, ten-minute budgets, excluding resolved stops, exact abbreviation search ranking, hosted authorization, pairing limits and one-hour token expiry. Type checking and the browser/Android asset build pass.
- Browser walkthrough: selected UVA with a computer-science/research profile and a Newcomb landmark start; skipped Peabody, marked Shannon visited, replanned with ten minutes remaining, resumed Newcomb after reload, and reached a recap showing two visited and one skipped. Cancelling a reconsideration preview preserves the skipped record. Sample preferences/outcomes were reset afterward; the existing journal entry was preserved.
- Recap checked at 390 × 844 with no horizontal overflow (375 px client/content width). No browser console errors were recorded. UI captures remain outside the repository.
- Android debug assembly and lint pass. The HTTPS-configured Kotlin build also compiles with a non-live test origin. Final debug APK uses the ordinary USB endpoint. This is compilation evidence, not a physical glasses or network test.
- HTTPS server mode requires a random 32-character pairing code, expires tokens after an hour, and disables the local browser authorization shortcut and static web hosting. Native builds accept only an HTTPS origin, retain platform certificate validation and refuse redirects. See HOSTING.md for deployment requirements.
- Deployment has not occurred. The container recipe was not built because the Docker engine is not running. HTTP proxy-boundary tests do not verify TLS hosting. Demo counters remain process-local, not persistent quotas or a dollar cap.
- Meta Billing visibly confirmed $150 in free credits. Gmail search found no separate grant-confirmation email; API-key creation still showed disabled with no payment method on file. No model key is configured locally and no live Meta call has been verified. ADB showed no connected phone. Billing, live provider checks, actual GPS/walking paths and physical Gen 2 voice testing remain pending.


## Submission candidate · November 2

- 49 tests passed; strict web type checking, the web build, Android debug assembly and Android lint passed.
- Browser walkthrough from a fresh origin: searched UVA, set history / research and quiet study, selected Shannon Library as the landmark, and received a three-stop estimate of 32 minutes. A typed question reached the installed Meta Llama 3.1 8B model. It selected the Shannon Library source and the browser displayed the university link. Saved the question, marked one stop visited and finished early. The recap retained one visited stop and one question.
- First-run testing exposed cold loading and an hours question that selected a related library fact. The local server now warms model weights before listening and declines operational questions outside the scope of the saved records. This is a narrow demo check, not a benchmark of accuracy or response time.
- No physical Android phone appeared in ADB. The video demonstrates the browser and local model only. A real Muse API call, Gen 2 microphone and speaker test, and hosted endpoint remain unverified.


## Campus tourism expansion · November 3

The coverage manifest has 51 ranked U.S. National Universities with ties and Virginia Tech. There are 160 named landmark pins across 52 campuses. Each has a source, an official school visitor link and a local route planner. The database contains the 148 new landmark records keyed by federal UNITID. The original 12 retain their independent university source records. Map review does not establish visitor access or field-tested paths.

Coverage tests check the entire cohort and feasible ten-minute starts at each pin, stable historical journal entries, validated itinerary IDs and handling of current questions. Browser walkthrough: selected Virginia Tech, architecture, student clubs and quiet study spaces, and a Squires Student Center origin. The planner suggested Carol M. Newman Library, Drillfield and Burruss Hall in approximately 38 minutes. This was a manual landmark start.

Muse requests now include the ordered upcoming stops, the selected activity, interests, routine and planned minutes. Ordinary questions use a small search context. Hours and access questions use a medium context and require an institutional search citation before returning a grounded answer. The request and citation logic are tested locally. Live Muse latency and answer quality still require a configured provider key.
The Virginia Tech local Llama question timed out during final inference checks, including a retry after model warm-up. The local demo remains a hardware-dependent fallback. No successful live Virginia Tech model answer is claimed for this revision.
