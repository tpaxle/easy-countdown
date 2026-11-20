[![Client CI](https://github.com/tpaxle/easy-countdown/actions/workflows/client.yml/badge.svg)](https://github.com/tpaxle/easy-countdown/actions/workflows/client.yml)

![Easy Countdown preview](https://user-images.githubusercontent.com/17204739/88205741-825e7d00-cc4d-11ea-81c3-92e42d197346.gif)

# Easy Countdown

Easy Countdown is a single-page web application that displays the time
remaining until a target date or the time elapsed since it. The background,
date, and title can be customized.

This repository is a **fork** of
[Yooooomi/easy-countdown](https://github.com/Yooooomi/easy-countdown). It
retains the original project's concept and foundation while adding changes
such as the migration to Vite, visual improvements, and automated image
publishing.

## Technical documentation

### Architecture

- **Frontend:** React 18 with Vite. The app mounts its main scene in
  `src/index.jsx`; the countdown screen and its components are in
  `src/scenes/Home/`.
- **Countdown calculation:** `src/service/date.js` breaks down the difference
  between the current date and the target date into days, hours, minutes, and
  seconds.
- **Configuration:** `public/variables.js` contains placeholders for the
  background, date, and title. `variables.sh` replaces them when starting the
  server or preparing the build, allowing configuration through environment
  variables.
- **Build:** Vite generates static files in `dist/`.
- **Container:** the `Dockerfile` builds the app and serves it on port `3000`.

### Configuration

| Variable | Description | Example |
| --- | --- | --- |
| `TIMER_BACKGROUND` | URL of the background image | `https://example.com/background.jpg` |
| `TIMER_TARGET` | Target date and time; any date format understood by JavaScript is accepted | `2027-01-03T22:34:11+01:00` |
| `TIMER_TITLE` | Optional title | `My next birthday` |

### Run with Docker

To pull and run the published image:

```sh
docker run --rm -p 3000:3000 \
  -e TIMER_BACKGROUND="https://example.com/background.jpg" \
  -e TIMER_TARGET="2027-01-03T22:34:11+01:00" \
  -e TIMER_TITLE="My next birthday" \
  tpaxle/easy-countdown:latest
```

Then open <http://localhost:3000>.

To build and run the repository's local configuration:

```sh
docker compose up --build
```

### Development and checks

Requires Node.js 22 or later.

```sh
npm ci
npm run dev
```

Run tests and create a production build:

```sh
npm test
npm run build
```

The production build is output to `dist/`. The `docker-compose.dev.yml` file
configures Vite's development mode when used together with
`docker-compose.yml`:

```sh
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

### CI, versions, and Docker image

The `.github/workflows/client.yml` workflow runs on every push to `master` and
uses Conventional Commits to determine the next Semantic Versioning release:

- `fix: ...` and other commit types increment the patch version.
- `feat: ...` increments the minor version.
- `feat!: ...` or a `BREAKING CHANGE: ...` footer increments the major version.

For example, `feat!: change the target date format` marks a breaking change.
From version `0.1.0`, this produces version `1.0.0`.

Each release is recorded as a Git tag (`v<version>`). The version appears in
the bottom-right corner of the app. The image is published for `linux/amd64`
and `linux/arm64` with two tags:

- `tpaxle/easy-countdown:latest`
- `tpaxle/easy-countdown:<version>`

The workflow requires the GitHub secrets `DOCKERHUB_USERNAME` and
`DOCKERHUB_TOKEN`, with permission to publish to Docker Hub.
