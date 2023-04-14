![spectrum](https://res.cloudinary.com/drrscrxod/image/upload/v1681397809/Screenshot_2023-04-13_at_15.48.30_g1byym.png)


<h1>Spectrum</h1>
<h3>Concept:</h3>

- Create a playlist of your favourite mixtapes from across the web to play in a single-page app. 
- Support for multiple sources, including: Soundcloud, YouTube, and Mixcloud.
- Focused on mixtapes only (i.e. 1hr+ tracks), rather than a individual tracks or albums, ala Spotify.
- Think Winamp for the modern age.
- Larger emphasis on the progress bar to seek through mixes.
- Ability to filter mixtape selection based on your mood or environment (i.e. focus, chill, energy).
  - i.e. when at work, I filter by 'focus' to only show ambient mixtapes
  - i.e. whilst lounging at home, I filter by 'chill' to play jazz or minimal techno
  - i.e. on a Friday night with friends, I filter by 'energy' to play tech-house and D&B
  - some tracks could be a combination of these moods.
- Save your playlist by registering/logging in, would be nice to play w/o having to register.
- Aim is to try and accomplish a light-weight player that doesnt rely on a number of load-intensive widgets on the site that are not optimised for mobile.
- Retro but with clean, modern athestics.  Think Winamp, but designed by Dieter Rams.


<h3>How it works:</h3>

- App will use a single ReactPlayer instance (https://cookpete.com/react-player/) which will then be able to load in tracks from the playlist, from any type of source (i.e. Soundcloud or Youtube), and only play 1 at a time.
- User comes to app, there will be 1 or 2 default tracks pre-loaded (tbc) to get them started with playing around on the app.
- Naturally users will want to add their own mixtapes, so they click Add button and enter the desired mixtape URL.
- The app will load mixtape into ReactPlayer plugin to preview the track, alter description/details if necessary, and then add to the database: 
  - Soundcloud: The Soundcloud API is now no longer available to external developers, but the ReactPlayer is able to use methods from the Widget API to be able to access properties, such as track name, volume
  - YouTube: the only way to get track meta-data is from the YouTube Data API (not possible from their widget)
- User can add a mood associated with the track (can be multiple), and then save to their profile.
- Track details will be saved to the db, and then will be used on the f/e (instead of relying on 3rd party widgets)
- User can set their mood which will then filter tracks.  Possible to select show 'All' moods also.

<h3>Considerations / Questions:</h3>

- When adding, user will need to populate URL of mixtape and not authorise with Soundcloud/Youtube - as there are API limitations.
- If a user is NOT registered/logged in, can they add mixtape? 
- Setting up GitHub, cloning + create development environment - need reminder pls.

<h3>MVP features</h3>

- Single page app with ReactPlayer control for loading and playing mixtapes (play only 1 at a time).
- No restriction on playlist length for adding mixtapes - list will just populate as long as it needs.
- User can seek through tracks quickly and load new mixtapes into the player easily, also with volume controls. NO AUTOPLAY.
- Support for SoundCloud and Youtube only initially, other formats post-MVP
- Ability to add, delete mixtapes from your profile. There is a separate /add route.
  - User can only have 1 mood at a time (1-to-many), but tracks can have multiple moods assigned to them (many-to-many).
- Awesome modern but retro UI which is fully responsive.  Mobile view is quite a basic player for now.

<h3>MVP routes</h3>

- /             homepage with player controls + playlist
- /add          add track to playlist
- /register     register User to Spectrum to allow saving of playlists. Concept of superuser and user only.
- /login        log into existing Spectrum account that has already been registered
- /profile      edit details, delete/edit playlist entries, change mood settings.

<h3>Fallback plan</h3>

- If ReactPlayer and API integrations prove to be too troublesome, default back to importing widgets for each player (not great experience so worse-case scenario only)

<h2>Post-MVP ideas</h2>

- Ability to filter mixtapes by mood (mixtapes can have multiple moods assigned). 
- Ability to change colour scheme of app when a different mood is selected.
- Ability to add tracks w/o having to login.
- Ability to edit tracks and save back to db.
- Ability to add/delete/edit from 1 page route only.
- Add splash screen to introduce / allow to login/register
- Improved seeking through a track by using waveform generator (a bit like Soundcloud)
- Much improved mobile experience, with swipeable content rather than basic player
- Dark mode?!
- Potentially log into Soundcloud/Youtube accounts to import playlist etc - not possible right now.
- OR search for tracks and then add them - quite complex functionality outside of boundaries of project.