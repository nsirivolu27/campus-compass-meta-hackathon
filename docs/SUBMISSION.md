# Campus Compass — submission copy

**Track:** Indie Developer · **Problem:** Build for Your World

**Repository:** https://github.com/nsirivolu27/campus-compass-meta-hackathon

## Project description

Campus Compass helps prospective students turn a campus visit into a small trial of everyday college life. Choose a college, enter a prospective major and interests, set your available time, and choose your current location or a nearby landmark. The app suggests a starting point and an itinerary that balances those interests against estimated travel time.

At each stop, try a short activity, ask a campus question, save an observation or keep a question for a student or adviser. Replan when time changes without losing visited or skipped stops. Finish with a recap and compare your own impressions across colleges.

The directory contains 5,877 U.S. institutions. Fifty-two campuses, including Virginia Tech, have mapped guides with 160 landmark reference points. Other colleges offer self-guided activities and official visitor information. The app supports a browser walkthrough and an Android build with experimental Meta glasses integration.

Hackathon contributions include personalized routes, adaptive visit state, Meta model integration, nationwide campus search, expanded landmark coverage and improved tour narration, built on an earlier campus-guide shell. The demo shows the working browser journey. Live Muse and physical glasses operation remain unverified; route times are estimates and visitor access requires checking.

## Describe your use of Meta products

The local demo runs Meta Llama 3.2 3B through Ollama. Llama chooses an evidence ID from the selected campus’s supplied records. The server then returns the original fact and cited source, rather than accepting model-authored facts or URLs. Questions about current hours, prices or access receive an explicit unknown when the saved records cannot answer them.

The Muse Spark integration uses Meta Model API with a validated visit brief: campus, current stop, upcoming stops, interests, routine and planned time. Operational questions require an institutional web citation. Provider keys stay on the server; exact GPS coordinates, journal entries and photos are excluded from the model request. Live Muse verification is pending API-key setup.

The Android app integrates experimental Meta Wearables DAT speech and camera adapters and device text-to-speech. Physical Gen 2 microphone-to-speaker testing remains pending. The demo narration is separately generated for the video; it is not presented as a Meta voice or glasses recording.

## Why are Meta’s models important to your solution?

Students ask questions in their own words and follow up as they move around campus. Meta models provide the language layer that connects those questions to the campus context. In the local path, Llama selects relevant evidence while the app preserves the original source text. The Muse integration is designed for richer, current questions using official web citations and the student’s visit brief.

The combination of a local open-weight model and a cloud model integration gives us two ways to explore that experience. Planning stays deterministic and testable: time budgets, stop order and visit progress do not depend on a generated answer. This lets the model focus on interpreting questions while the product maintains a traceable basis for the visit.

## Partner technology feedback

No Fireworks, Modal or Baseten integration was used in this build.

## Judge walkthrough

1. Install Node 22+. Run `npm run dev` for the planner without a key or model.
2. For local inference, install Ollama and run `ollama pull llama3.2:3b`, then `npm run demo`. Startup verifies and warms the model. Open the printed local URL. Weights are not included in the repository.
3. Search **UVA** and select the main campus. Enter **History**, **Research and quiet study spaces**, **Arts & humanities**, **40 minutes**, and **Shannon Library** as the starting landmark. No physical GPS is required.
4. Preview Shannon Library → Rotunda → Peabody Hall, an approximately **33-minute planning estimate**. Start the tour and try the library activity.
5. Ask **Which library has study spaces and the Digital Humanities Center?** Inspect the university source. Ask about current opening hours to see the saved-record boundary.
6. Save a question, mark Shannon visited and finish for today. Review the recap, journal and comparison view.

For Android USB pairing, see [AI setup](AI-SETUP.md). For exact test evidence and limits, see [validation](VALIDATION.md). Starting prototype and contributions are documented in [development](DEVELOPMENT.md).

## Manual submission

The [finished 2:59 demo](https://github.com/nsirivolu27/campus-compass-meta-hackathon/releases/download/v0.1.0-hackathon/Campus-Compass-demo.mp4) is public and linked in the submission draft. It uses real browser captures, English captions and locally generated Kokoro narration; the app itself uses device speech synthesis.

Review all text and your team listing, complete any personal-opinion questions, and make the promotion/consent choice yourself. The form has **Very likely** and **Very favorable** selected as instructed. No submission has been sent by the assistant.
