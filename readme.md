<p align="center">
  <img src="./header.png" alt="slack-fm" />
  <br />
  <a href="https://travis-ci.org/JackCuthbert/slack-fm">
    <img src="https://api.travis-ci.org/JackCuthbert/slack-fm.svg?branch=master" alt="Travis CI" />
  </a>
  <a href="https://hub.docker.com/repository/docker/jckcthbrt/slack-fm">
    <img src="https://img.shields.io/docker/pulls/jckcthbrt/slack-fm" alt="Docker Pulls" />
  </a>
</p>

## Introduction

**Slack-fm** is a tiny self-hosted service that automatically updates your Slack
status from your Last.fm profile.

1. Updates Slack status when something is playing
1. Only updates during 9am and 5pm (configurable)
1. Weekends are ignored (configurable)

It looks like this:

![Slack Preview](./slack-preview.png)

## Prerequisites

1. Last.fm API key ([get one here](https://www.last.fm/api/account/create))
1. Last.fm username (this is probably your own username!)
1. Slack "legacy" token ([get one here](https://api.slack.com/custom-integrations/legacy-tokens))

## Configuration

All configuration is available via environment variables. Values _without_ defaults are required.

Variable | Default | Description
---------|---------|------
`LAST_FM_KEY` | | Access to Last.fm data
`LAST_FM_USERNAME` | | Which user to get track info for
`SLACK_TOKEN` | | Personal "legacy" token for updating your Slack status
`TZ` | `UTC` | Set the timezone
`ACTIVE_HOURS_START` | `9` | The hour of the day to start updating your Slack status
`ACTIVE_HOURS_END` | `17` | The hour of the day to stop updating your Slack status
`UPDATE_INTERVAL` | `1` | The time in minutes to wait until updating your Slack Status
`UPDATE_WEEKENDS` | `undefined` | Provide any value to enable status updates during the weekend

## Hosting

I designed this to be easily self hosted, just use the Docker image! It's
automatically built and versioned on [Docker Hub](https://hub.docker.com/repository/docker/jckcthbrt/slack-fm/tags) based on GitHub activity.

### Docker run

```bash
docker run \
  -e SLACK_TOKEN=<YOUR_SLACK_TOKEN> \
  -e LAST_FM_KEY=<YOUR_LAST_FM_KEY> \
  -e LAST_FM_USERNAME=<LAST_FM_USERNAME> \
  -e TZ=<YOUR_TIMEZONE> \
  jckcthbrt/slack-fm:latest
```

### Docker compose

```yml
version: '3.7'
services:
  slack_fm:
    image: jckcthbrt/slack-fm:latest
    container_name: slack_fm
    restart: unless-stopped
    environment:
      TZ: <YOUR_TIMEZONE>
      SLACK_TOKEN: <YOUR_SLACK_TOKEN>
      LAST_FM_KEY: <YOUR_LAST_FM_KEY>
      LAST_FM_USERNAME: <LAST_FM_USERNAME>
```

```bash
docker-compose up
```

