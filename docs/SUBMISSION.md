# Try My Future — entry copy

**One line:** Turn a prospective student's starting point, major and free time into a campus visit they can try, question and remember.

**Suggested track and theme:** Indie developer / Build for Your World. Confirm the track against the participant registration.

**Description:** A tour guide can introduce a building. A prospective student needs to know what they would do there on an ordinary Tuesday. Try My Future starts with the college they choose, asks what matters to them, and recommends a first stop and a feasible sequence under an estimated time budget. At each stop, they can try an activity, ask a question and keep an observation. When time runs short, they can change the remaining tour without losing visited or skipped stops. A recap separates their own impressions from university information.

**Use of Meta technology:** The demonstrated path runs Meta Llama 3.1 8B locally through Ollama. It selects an evidence ID from the chosen campus's supplied records; the server supplies the actual text and university URL. The model cannot author the displayed fact or substitute its own source. Directory-only campuses and unsupported operational questions get an explicit unknown. Muse Spark uses a server-validated visit brief with the current stop, upcoming stops, student preferences and planned time. Questions about hours, access or fees require a university web citation. Live Muse testing requires a server key. Android integrates experimental Meta Wearables DAT speech and camera capture. The video shows a real browser question; it does not depict a verified glasses session.

**Coverage and provenance:** The searchable directory is NCES IPEDS HD2025. The published 2027 National Universities top 50 covers 51 schools with ties. Adding Virginia Tech gives 52 mapped campuses and 160 landmark reference points. Each guide links to university visit information. Landmark coordinates come from university records, OpenStreetMap contributors or geotagged landmark pages. Other entries offer reflection activities rather than invented routes. Travel times are planning estimates, not field-verified walking or step-free navigation. The hackathon repo began from an earlier campus-guide prototype; attribution and the starting revision are in [development notes](DEVELOPMENT.md).

## Reproduce the demo
1. Start Ollama with the official `llama3.1:8b` model installed. From the repo run `npm run demo` on Node 22+. The first launch warms the model. Open the printed local URL. For planner-only review, `npm run dev` runs without any key or model.
2. Search **UVA**. Choose the main campus, enter **History**, **Research and quiet study spaces**, **40 minutes**, and **Shannon Library** as the starting landmark. No physical GPS is required.
3. Preview the route, follow the estimate explanation and start it. Ask **Which library has study spaces and the Digital Humanities Center?** Open the answer's UVA Library source. Then ask whether it is open until midnight tonight: the local evidence cannot verify opening hours.
4. Save a question, mark a stop visited, and finish for today. The recap keeps the observation with the campus. Try another college or compare questions in the journal.
5. For Android USB testing follow [AI setup](AI-SETUP.md). Physical hardware is optional for the browser demo. Do not put provider keys in a submission field or APK.

**Evidence boundary:** Local Llama inference, app navigation and the Android build are separate checks. Muse account activation, an actual Gen 2 microphone-to-speaker session and a deployed HTTPS service have not been demonstrated.

**Organizer reminder (November 2):** Prepare a three-minute demo and an open-source GitHub repository. The participant form and final declarations require a signed-in account. Keep third-party notices intact. Check originality/eligibility and disclose the earlier prototype; this document does not attest on behalf of the entrant.
