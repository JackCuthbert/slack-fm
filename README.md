<p align="center">
  <img src="./header.png" alt="slack-fm" />
  <br />
  <a href="https://travis-ci.org/JackCuthbert/slack-fm">
    <img src="https://api.travis-ci.org/JackCuthbert/slack-fm.svg?branch=master" alt="Travis CI" />
  </a>
  <a href="https://hub.docker.com/repository/docker/jckcthbrt/slack-fm">
    <img src="https://img.shields.io/docker/pulls/jckcthbrt/slack-fm" alt="Docker Pulls" />
  </a>
  <br />
  <a href="https://www.producthunt.com/posts/slack-fm?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-slack-fm" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=173963&theme=dark" alt="slack-fm - Self-hosted service to sync Last.fm with your Slack status | Product Hunt Embed" style="width: 250px; height: 54px;" width="250px" height="54px" />
  </a>
</p>

## Introduction

**Slack-fm** is a tiny self-hosted service that automatically updates your Slack
status from your Last.fm profile. It updates your Slack status when all the
following conditions are met:

  * the user is not set to "away"
  * a custom status hasn't been set
  * something is now playing on Last.fm
  * the time is between 9am and 5pm (configurable)
  * it's not a weekend (configurable)

To clear the status it will search Last.fm for the now playing tracks duration
and use that as the status expiration time. If there is no duration information
it defaults to a 10 minute expiration (configurable).

It looks like this:

![Slack Preview](./slack-preview.png)

## Setup

[Read SETUP.md](./SETUP.md)

## Contributing

This should be relatively simple to set up and run, all that's required is Node
v12 and some environment variables.

1. Fork this repository and clone your version
1. Install dependencies with `npm install`
1. Run the tests with `npm test`
1. Copy the sample config file with `cp data/config.sample.yml data/config.yml` and edit it
1. Start the app locally with `npm start`
1. Commit and push your changes then submit a PR back to this repository
