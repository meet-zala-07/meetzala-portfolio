# Meet Zala — Portfolio

My personal portfolio site. Plain HTML, CSS and JavaScript — no framework, no
build step, no backend, no database.

**The idea:** every section on the page is generated from a JSON file in
`assets/data/`. To update the site, you edit a JSON file. You (almost) never
need to touch the HTML, CSS or JavaScript.

---

## Running it on your own computer

If you just double-click `index.html`, the page will load but look empty.
That's because browsers won't let a page read local JSON files unless it's
served by a (tiny, local) web server. Pick one:

```bash
# Python (usually already installed)
python3 -m http.server 5500

# or Node
npx serve .
```

Then open `http://localhost:5500` in your browser. This step isn't needed
once the site is deployed — it only affects testing on your own machine.

---

## Folder structure

```
index.html              The whole homepage — just structure, no content
project.html             One page template, reused for every project
favicon.svg                The MZ_ mark shown in the browser tab
README.md
assets/
  css/
    tokens.css             Colors, fonts, spacing — change a value once, it updates everywhere
    layout.css              Header, footer, section spacing
    components.css          Cards, buttons, badges, timeline, skills grid, graph…
    utilities.css           Small helpers + the project detail page's styles
  js/
    data.js                 Loads the JSON files
    render.js                 Turns the JSON data into the HTML you see
    theme.js                  Light / dark / system theme switch
    nav.js                     Menu, dropdowns, scroll behaviour
    reveal.js                  The gentle fade-in as you scroll
    main.js                    Starts everything on the homepage
    project-detail.js          Starts everything on a project page
  data/                      ← you'll mostly work in this folder
    site.json                 Name, bio, social links, contact email
    education.json
    experience.json
    skills.json
    projects.json
    certifications.json
    achievements.json
    academics.json
    documents.json             Resume lives here once it exists
    notes.json
```

---

## How to update things

Everything below is a matter of editing one JSON file. The site re-reads
these files every time the page loads — there's nothing to "build" or
"compile".

### Add a project
Open `assets/data/projects.json` and copy one of the existing entries. Give
it a unique `slug` (lowercase, hyphen-separated — e.g. `"weather-app"`). It
automatically:
- shows up in the Projects section and its filters
- gets its own page at `project.html?slug=weather-app`
- shows/hides its GitHub and Live Demo buttons based on whether you filled
  in `github` / `demo` (leave them as `""` to hide the button — never put a
  fake link or `"#"` there)

Leave `problem`, `solution`, `challenges`, `learnings` or `future` as `""` if
you don't have anything written yet — those blocks just won't appear on the
project page until you fill them in.

### Add a certificate / credential
Edit `assets/data/certifications.json`. Same idea — copy an entry, fill in
your real `title`, `issuer`, `issueDate`, and (if you have one) a real
`verifyUrl`. Leave `verifyUrl` and `file` empty if you don't have them yet;
the Verify/View Certificate buttons only appear when there's something to
link to.

### Add an achievement
Edit `assets/data/achievements.json`. One object per achievement.

### Add a semester
Edit `assets/data/academics.json` and add a new object to the `semesters`
array with that semester's `spi`, `cpi` and `backlogs`. The semester count,
latest SPI, current CPI and the performance graph on the Academics section
all update automatically — nothing else needs to change.

### Add your resume
1. Put the PDF in `assets/files/` (create that folder if it doesn't exist
   yet) — e.g. `assets/files/meet-zala-resume.pdf`.
2. In `assets/data/documents.json`, set `"file"` on the resume record to
   that path.

The "View Resume" button on the Home and Contact sections is hidden right
now because there's no resume yet. As soon as `file` is filled in, it
reappears automatically everywhere — no HTML changes needed.

### Add notes / articles
Once a note or article is ready, add it to `assets/data/notes.json` —
`articles` for write-ups, `handwrittenNotes` for scanned notes. As soon as
either list has at least one entry, the "preparing notes" message is
replaced by the real content automatically.

### Replace the hero photo
The hero currently shows a bordered "MZ_" monogram panel instead of a photo
— by design, since no real photo is in the project yet. When you're ready:
1. Add your photo to `assets/img/` (e.g. `assets/img/profile.jpg`).
2. In `index.html`, find `.hero-panel__frame` and swap the monogram `<div>`
   for an `<img src="assets/img/profile.jpg" alt="Meet Zala">`.

That's the one piece that currently needs an HTML edit, because a photo
(unlike text data) isn't something the JSON files hold.

### Add a job / internship
Edit `assets/data/experience.json` (currently an empty `[]`). The moment it
has at least one entry, the "currently building experience" message in the
Experience section is replaced by your real experience automatically.

---

## Current status (as of this version)

- **Resume:** not ready yet — the CTA is intentionally hidden, see above.
- **Profile photo:** not added yet — showing the MZ_ monogram instead.
- **Experience:** none yet — showing the honest "still building experience" state.
- **Notes & Writing:** handwritten notes exist but aren't scanned/cleaned up
  yet — showing a "preparing notes" state until they are.
- **Deployment:** not live yet. The plan is Vercel, likely at
  `meetzala.vercel.app`, but that isn't confirmed or deployed.

None of the above are bugs — they're the site's built-in "nothing to show
yet" states, and they'll disappear on their own once you add the real data.

---

## Deploying (when you're ready)

This is a static site, so no configuration is required.

1. Push this folder to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) → New Project → import the repo →
   Framework Preset: **Other** → Deploy.
3. Vercel will give you a URL (possibly `meetzala.vercel.app`, if that name
   is free).
4. To use a custom domain later: Project → Settings → Domains → add the
   domain and follow Vercel's DNS instructions. No rebuild required.

---

## Theme

Three options — System, Light, Dark — in the header. Your choice is saved in
the browser (`localStorage`) so it's remembered next time. All colors live
as CSS variables in `assets/css/tokens.css`.

## Accessibility

Skip-to-content link, keyboard-friendly menu and dropdowns (Escape closes
them), visible focus outlines, and animations are reduced automatically if
the visitor's operating system has "reduce motion" turned on.

## Privacy

Marksheet identifiers (seat number, centre number, etc.) are intentionally
not included anywhere in this project. If you ever add a scanned result or
certificate file, double-check it doesn't expose those numbers before
putting it in `assets/`.
