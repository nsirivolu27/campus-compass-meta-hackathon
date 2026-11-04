"""Keep reviewed landmark records in the browser bundle and the offline database."""
import json
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read_guides():
    return json.loads((ROOT / "data/tour-landmarks.json").read_text(encoding="utf-8"))


def write_landmarks(db, guides):
    db.execute("""CREATE TABLE IF NOT EXISTS tour_landmarks (
        unitid TEXT NOT NULL, stop_id TEXT NOT NULL, name TEXT NOT NULL, theme TEXT NOT NULL,
        latitude REAL NOT NULL, longitude REAL NOT NULL, map_url TEXT NOT NULL,
        fact TEXT, fact_url TEXT, PRIMARY KEY(unitid, stop_id))""")
    db.execute("DELETE FROM tour_landmarks")
    for guide in guides:
        for stop in guide["stops"]:
            db.execute("INSERT INTO tour_landmarks VALUES (?,?,?,?,?,?,?,?,?)",
                       (guide["unitid"], stop["id"], stop["name"], stop["theme"],
                        stop["latitude"], stop["longitude"], stop["mapUrl"], stop["fact"], stop["factUrl"]))


def write_module(guides):
    header = "// Generated from data/tour-landmarks.json by scripts/landmarks.py.\n"
    (ROOT / "web/landmark-data.js").write_text(header + "export const landmarkGuides = "
        + json.dumps(guides, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")


if __name__ == "__main__":
    guides = read_guides()
    mapped = {g["unitid"] for g in guides if g["stops"]}
    with sqlite3.connect(ROOT / "data/campuses.sqlite") as db:
        write_landmarks(db, guides)
        db.execute("UPDATE campuses SET coverage='self-guided' WHERE coverage='mapped'")
        db.executemany("UPDATE campuses SET coverage='mapped' WHERE unitid=?", [(u,) for u in mapped])
    path = ROOT / "web/directory-data.js"
    prefix, raw = path.read_text(encoding="utf-8").split("export const directory = ", 1)
    records = json.loads(raw.strip().removesuffix(";"))
    for record in records:
        if record["unitid"] in mapped:
            record["coverage"] = "mapped"
        elif record["coverage"] == "mapped":
            record["coverage"] = "self-guided"
    path.write_text(prefix + "export const directory = " + json.dumps(records, ensure_ascii=False,
                    separators=(",", ":")) + ";\n", encoding="utf-8")
    write_module(guides)
