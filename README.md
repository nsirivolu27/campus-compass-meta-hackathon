# Campus Compass

**Campus Compass @ [college]** turns a prospective student’s major, interests, time and starting point into a campus visit they can try, question and remember.

Built for the **[Meta Global AI Developer Hackathon](https://dev.meta.ai/events/global-hackathon)** · Indie Developer · Build for Your World. Deadline: November 4, 2026, 9 PM ET.

## Try it

[Watch the 2:59 demo](https://github.com/nsirivolu27/campus-compass-meta-hackathon/releases/download/v0.1.0-hackathon/Campus-Compass-demo.mp4) · [Download the Android build and source](https://github.com/nsirivolu27/campus-compass-meta-hackathon/releases/tag/v0.1.0-hackathon). The demo uses real browser captures, captions and locally generated Kokoro narration.

Node 22+: `npm run dev`, then open the local URL printed in the terminal. Planning works without a key or model. For real local inference, install [Ollama](https://ollama.com/), run `ollama pull llama3.2:3b`, then `npm run demo`. Model weights are not included.

## Progress · November 4

- Search 5,877 institutions. 52 campuses, including Virginia Tech, have mapped guides with 160 landmark pins; other colleges offer self-guided activities.
- Personalized starting points and time-budgeted itineraries, visited/skipped progress, replanning, local notes and campus comparisons.
- Meta Llama 3.2 selects saved campus evidence with source links. Muse Spark integration supports a validated visit brief and official web citations; its live test is pending API-key setup.
- Polished phone interface, adjustable narration and an Android build with experimental Meta glasses speech/camera adapters.
- **56 tests pass**, with strict type checking, web build, Android debug assembly and lint. A real UVA model answer, unavailable-hours handling and persistent visit recap were verified in the browser.

Physical glasses testing and live Muse verification remain pending. Travel times are estimates; walking paths, entrances and visitor access are not field-verified. The demo shows the browser experience.

[Submission copy and judge walkthrough](docs/SUBMISSION.md) · [Android / Muse setup](docs/AI-SETUP.md) · [Validation](docs/VALIDATION.md) · [Development and starting prototype](docs/DEVELOPMENT.md) · [Licenses](THIRD-PARTY.md)
