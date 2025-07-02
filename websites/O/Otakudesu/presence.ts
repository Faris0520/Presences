import { ActivityType, Assets } from 'premid'

enum ActivityAssets {
  Logo = 'https://cdn.rcd.gg/PreMiD/websites/O/Otakudesu/assets/logo.png'
}

const presence = new Presence({
  clientId: '794916348761210920',
})

const presenceData: PresenceData = {
  type: ActivityType.Playing,
  largeImageKey: ActivityAssets.Logo,
  startTimestamp: Math.floor(Date.now() / 1000),
}

presence.on('UpdateData', async () => {

  switch (
    document.location.pathname.endsWith('/')
    && document.location.pathname.length > 1
      ? document.location.pathname.slice(
          0,
          document.location.pathname.length - 1,
        )
      : document.location.pathname
  ) {
    case '/':
      presence.setActivity({
        details: 'Viewing homepage',
        largeImageKey: ActivityAssets.Logo
      })
      break
    case '/anime-list':
      presence.setActivity({
        details: 'Viewing anime list',
        largeImageKey: ActivityAssets.Logo
      })
      break
    case '/jadwal-rilis':
      presence.setActivity({
        details: 'Viewing release schedule',
        largeImageKey: ActivityAssets.Logo
      })
      break
    case '/ongoing-anime':
      presence.setActivity({
        details: 'Viewing ongoing anime list',
        largeImageKey: ActivityAssets.Logo
      })
      break
    case '/genre-list':
      presence.setActivity({
        details: 'Viewing anime genre list',
        largeImageKey: ActivityAssets.Logo
      })
      break
    default: {
      if (document.location.search.startsWith('?s')) {
        const { s } = JSON.parse(
          `{"${decodeURI(document.location.search.substring(1))
            .replaceAll('"', '\\"')
            .replaceAll('&', '","')
            .replaceAll('=', '":"')}"}`,
        )
        presence.setActivity({
          details: 'Searching for:',
          state: s,
          largeImageKey: ActivityAssets.Logo,
          smallImageKey: Assets.Search
        })
      }
      if (document.location.pathname.startsWith('/anime')) {
        const animeTitle = document.querySelector('.jdlrx > h1')?.textContent?.replace(/Subtitle Indonesia/gi, '')
        presence.setActivity({
          details: 'Viewing anime',
          state: animeTitle,
          largeImageKey: ActivityAssets.Logo,
          buttons: [
            { label: 'View anime', url: document.location.href },
          ]
        })
      }
      if (document.querySelector('.mirrorstream')) {
        const fullTitle = document.querySelector('.posttl')?.textContent?.replace(/Subtitle Indonesia/gi, '') || ''
        const episodeMatch = fullTitle.match(/Episode (\d+)/i)
        const seasonMatch = fullTitle.match(/Season (\d+)/i)
        const animeTitle = fullTitle
          .replace(/Season \d+/gi, '')
          .replace(/Episode \d+/gi, '')
          .trim()

        // Default to S1 if no season specified
        const season = seasonMatch ? seasonMatch[1] : '1'
        const episode = episodeMatch ? episodeMatch[1] : ''

        presence.setActivity({
          type: ActivityType.Watching,
          name: animeTitle,
          details: `Episode ${episode}`,
          state: `Season ${season} - Episode ${episode}`,
          largeImageKey: document.querySelector('.cukder img')?.getAttribute('src') || ActivityAssets.Logo,
          buttons: [
            { label: 'Watch Anime', url: document.location.href },
          ],
        })
      }
      break
    }
  }
})
