# Campus Compass
**Campus Compass @ [college]** helps students explore a campus around their prospective major, interests, available time and starting location. Built for phones and an experimental Android integration with Meta glasses.

**[Meta Global AI Developer Hackathon](https://dev.meta.ai/events/global-hackathon) · Indie developer / Build for Your World.** Submission deadline: November 4, 2026, 9 PM ET.

## Try it
With Node 22+ installed, run `npm run dev` and open the loopback URL printed in the terminal. No account or dependency installation is needed to plan a tour. For real local inference, start Ollama, install `llama3.1:8b`, then use `npm run demo` instead. Model weights are not included.

## Current progress · November 3
- Search 5,877 institutions; 52 campuses have mapped guides with 160 landmarks, including Virginia Tech. Other colleges offer self-guided activities.
- Get a suggested starting stop and personalized itinerary, replan, record visited or skipped stops, save notes and compare visits. Precise GPS stays on the device. Travel times are estimates, not verified walking routes.
- Muse Spark integration uses the selected campus, interests and itinerary with source checks. Local Llama can select saved campus evidence; a UVA query succeeded, while the Virginia Tech query timed out on the development machine.
- Narration prefers higher-quality installed English voices, cleans up spoken formatting and offers Relaxed, Conversational and Brisk pacing. It uses device text-to-speech, not Meta's proprietary voice.
- **55 tests pass**, along with type checking, web build, Android debug build and lint. The Virginia Tech browser flow, saved progress and narration controls have been checked.

## Before submission
Activate the Muse API key and test real answers. Verify microphone input, spoken output and playback quality on Android with Gen 2 glasses. Field-check routes and visitor access, then record a fresh three-minute demo with Campus Compass branding. Live Muse and physical glasses operation are not yet verified.

[Judge walkthrough and submission copy](docs/SUBMISSION.md) · [Android / Muse setup](docs/AI-SETUP.md) · [Validation](docs/VALIDATION.md)
