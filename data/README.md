# Nationwide campus directory

The initial database contains **5,877 institution records** from NCES IPEDS **HD2025**, downloaded October 27, 2026. It covers all 50 states, D.C., and five U.S. territories. This is a reporting-institution directory, not an inventory of every physical campus. Some branches are separate records; others and nonreporting schools may be absent. Online institutions may also appear. Confirm visit availability with the institution.

- `campuses.sqlite`: SQLite database with a unique federal UNITID, indexed state/name fields, and a provenance table.
- `provenance.json`: source URL, year, download date, ZIP SHA-256, filters and counts.
- `../web/directory-data.js`: generated offline mobile/browser snapshot of the same rows.
- `raw/`: ignored source downloads. No institution officials' names or phone numbers are exported.

Import with Python 3 (standard library only):

```sh
python scripts/import-directory.py --download
npm test
npm run build
```

Without `--download`, the import uses `data/raw/HD2025.zip`. The importer checks minimum record count, unique UNITIDs, pilot mappings and SQLite integrity before replacing outputs. It uses explicit filters: `ACT in A,N,R`, `CYACTIVE=1`, `POSTSEC=1`, `OPENPUBL=1`, and the supported state/territory codes. The original ZIP is hashed. Source year stays pinned so an update is a deliberate reviewed change.

Institution fields include name, reported aliases, address, city/state/ZIP, reported website/admissions/accessibility links, sector level/control and coordinates. Links are normalized to HTTPS and must be syntactically valid; they are not individually live-verified. Coordinates are directory coordinates, not pedestrian entrances or routes.

Coverage has two levels: `curated` for the three manually sourced pilot guides; `self-guided` for general reflection activities and personal notes. Importing a record does not manufacture building descriptions, current hours, accessibility routes or campus-specific answers.


## Campus tourism data

The November 3, 2026 snapshot covers all 51 universities at ranks 1–49 of the [2027 U.S. News National Universities table](https://www.ivytalent.com/college/2027-u-s-news-college-rankings-top-50-universities-and-what-changed-from-2026/) including the three-way tie at 49. Virginia Tech is an additional campus. Rank determines the scope of this snapshot only. Every school retains its federal UNITID.

The three original guides have 12 campus-sourced building pins. The other 49 add 148 individually selected landmarks and a university visitor link per institution in `tour-landmarks.json`. Use `python scripts/landmarks.py` after editing that file to synchronize the browser module, directory coverage and the SQLite tour_landmarks table. The full IPEDS importer also applies this layer. Legacy reflection IDs remain available to saved visits and journals.

OpenStreetMap-derived records in this dataset are © OpenStreetMap contributors and available under the [Open Database License](https://www.openstreetmap.org/copyright). Each record links to its exact map element. For ways, the pin is the midpoint of the bounds of the mapped geometry. For nodes it is the published coordinate. Other records link to the university or geotagged landmark page supplying the position. The school's visitor link is a separate source. A map point establishes a reference location. Check university sources for entry, hours, interior uses, accessibility and current routes.
