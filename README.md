### Overview

This Discord bot designed to fetch information from Riot Games API and integrate with other services (such as Twitch). It relies on API keys for both Discord and Riot Games, which must be stored locally in a **`config.json`** file. This file is never committed to source control.

> **Note:** Due to updates in the Riot Games API, some features may become outdated or stop working.

---

### Configuration (`config.json`)

Create a file named `config.json` in the root of the project (alongside `index.js` and `package.json`). This file should **never** be shared publicly. Example structure:

```json
{
  "CLIENT_TOKEN": "YOUR_DISCORD_BOT_TOKEN_HERE",
  "clientId": "YOUR_DISCORD_CLIENT_ID_HERE",
  "guildId": "YOUR_TEST_GUILD_ID_HERE",
  "RIOT_API_KEY": "YOUR_RIOT_API_KEY_HERE",
  "TWITCH_CLIENT_ID": "YOUR_TWITCH_CLIENT_ID_HERE",
  "TWITCH_CLIENT_SECRET": "YOUR_TWITCH_CLIENT_SECRET_HERE"
}
