**Workflow Automation**

A web application for building and executing basic workflow automations, allowing users to define workflows composed of triggers and actions.

This is a monorepo that contains both the API server and the UI client.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)

---

## Overview

This project implements a basic workflow automation system where users can:

- Define **workflows** made of **triggers** and **actions**
- Support a limited set of triggers (e.g., time-based schedules, webhook events)
- Support a limited set of actions (e.g., sending HTTP requests, logging messages)

The API exposes endpoints to create, list and execute workflows programmatically. The UI is a React.js application that allows users to build and execute workflows.

---

## Features

- **Workflow Definition:** Create workflows to orchestrate actions.

- **Actions:**

  - Send HTTP requests to external services
  - Log custom messages
  - Delay

- **Execution Engine:** Process triggers and execute associated actions in sequence. The state is persisted for each execution.
- **Error Handling:** Retries and logging for failed actions with customizable backoff.

---

## Tech Stack

- **UI:** React.js/Vite/Tailwind CSS
- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Testing:** Vitest (Unit & Integration)
- **Containerization:** Docker & Docker Compose

---

## Folder Structure

```

├── server
│ └── ...
│── client
│ └── ...
```

- **server/**: The API server, implemented with Express.js.
- **client/**: The UI client, implemented with React.js.

---

## Prerequisites

- Node.js ≥ 22
- Docker & Docker Compose
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/CaioAugustoo/alloy-challenge.git
   cd alloy-challenge
   ```

2. Run with docker compose

```bash
docker-compose up --build -d
```

**If you face some cache issues with Docker, try to export this env var:**

`export DOCKER_DEFAULT_PLATFORM= && docker-compose up --build -d`

The API will be available at `http://localhost:3000`. Also a postgres database will be available at `localhost:5432`.
The UI will be available at `http://localhost:3001`.
