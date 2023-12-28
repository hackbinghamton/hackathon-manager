# HackBU Hackathon Manager

This is a monorepo for a couple of related websites. Not much to see here right now.

## HackBU Home

See [`home`](/home).

## Hackathon

Maybe coming soon.

## Setup

The only currently supported way to locally host the projects is using Docker.

### With Docker

First, install [Docker Engine](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/).

Build the Docker images: (**this must be repeated whenever there are Dockerfile changes**)

```sh
docker compose build
```

Install the dependencies: (**this must be repeated whenever there are dependency changes**)

```sh
docker compose run home pnpm install
```

Run everything:

```sh
docker compose up
```

### Mixed

You may be able to run Postgres within Docker but Node on the host.

### Without Docker

You may be able to run everything outside of Docker. Among other necessary setup steps, you will want to see [`docker/init-db.sh`](docker/init-db.sh) for early database setup.
