# Setup slack-fm

Since Slack has now removed the ability to create new Legacy Tokens you'll need
to create a Slack App and find your member ID to enable slack-fm functionality.

## 1. Create the Slack App Token

1. Navigate to <https://api.slack.com/apps>
1. Click "Create New App", give it a name like "slack-fm", and choose your
Workspace.
1. Click "Add features and functionality"
1. Select "Permissions" and scroll down to "Scopes"
1. Add 2x "User Token Scopes"
    * `users.profile:write`
    * `users:read`
1. Copy the token at the top of this page

### Note on token permissions

The above instructions create a _Workspace_ token which has full access to
your... Workspace. For example, if you provide someone else's member ID in your
config file slack-fm will update their status.

Please exercise reasonable discretion when configuring slack-fm for your member
ID only. We wouldn't want anyone getting confused or upset about their status
changing to the great music you're listening to would we 😅

If your team has multiple people that would like to run slack-fm then each
person must configure and run their own instance of it (you can use the same
Workspace token/app). Multiple Last.fm account support may exist in the future
if there's enough demand for it.

## 2. Get your Slack member ID

1. Go to Slack
1. Click your profile image in the top right and select "View Profile"
1. Click the "More" button and select "Copy member ID"

## 3. Create a Last.fm app

1. [Create an API account here](https://www.last.fm/api/account/create)
2. Copy the API key and shared secret

## 4. Create the config file

Copy the below snippet (or the sample in [`config.sample.yml`](./data/config.sample.yml))
and create a file called `config.yml` somewhere replacing the properties with
what you created above.

> All the options here are required, the sample below contains some sensible
defaults for the app.

```yml
# config.yml
app:
  emoji: ':headphones:'
  separator: '·'
  update_interval: 1
  update_weekends: false
  update_hour_start: 8
  update_hour_end: 18

lastfm:
  username: 'your_lastfm_username'
  api_key: '00000000000000000000000000000000'
  shared_secret: '00000000000000000000000000000000'

slack:
  - user_id: 'U00000000'
    token: 'xoxp-XXX-XXX-XXX-XXX'
  - user_id: 'U00000000'
    token: 'xoxp-XXX-XXX-XXX-XXX'
```

This file will be used in the next step.

## 5. Hosting

I designed this to be easily self hosted on either your local machine or on a
server somewhere with Docker. Slack-fm is automatically built and versioned on
[Docker Hub](https://hub.docker.com/repository/docker/jckcthbrt/slack-fm/tags)
based on GitHub activity.

Define a `docker-compose.yml` file with the following content being careful to
replace the `volumes` property with the correct `config.yml` path.

```yml
# docker-compose.yml
version: '3.7'

services:
  slack_fm:
    image: jckcthbrt/slack-fm:latest
    container_name: slack_fm
    restart: unless-stopped
    environment:
      TZ: '<YOUR_TIMEZONE>'
    volumes:
      - '</LOCAL/PATH/TO/config.yml>:/data/config.yml'
```

```bash
docker-compose up
```

