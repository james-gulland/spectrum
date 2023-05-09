<h1>Project 4: Spectrum</h1>

<h2>Project Brief</h2>

During the final two weeks of the GA Software Engineering immersive course, I was tasked with developing a full-stack app from scratch using a Python Django API and Django REST framework to serve data from a Postgres database, which was then consumed by a separate front-end build with React.js.

I came up with the idea of a project I have always wanted to do; a music app that enables users to curate a personalised playlist of mixtapes from various online sources, including Youtube, Soundcloud, and Mixcloud; a central repository for all your mixes!  The app also allows for playback of the playlist based on the user's present mood.

<h3>Deployment link</h3>

https://spectrum.gives/

![My Images](client/src/images/image6.gif)

<h3>Code Installation</h3>

https://github.com/james-gulland/spectrum

Clone or download the above repo, then follow the instructions in your terminal:

- Install back-end dependencies: ```pipenv install```
- Enter shell of project: ```pipenv shell```
- Make Migrations: ```python manage.py makemigrations```
- Migrate: ```python manage.py migrate```
- Load Seed data for Mixtapes: ```python manage.py loaddata mixtapes/seeds.json```
- Load Seed data for Users: ```python manage.py loaddata users/seeds.json```
- Load Seed data for Moods: ```python manage.py loaddata moods/seeds.json```
- Start back-end server: ```python manage.py runserver```
- Change into front-end directory: ```cd client```
- Install front-end dependencies: ```npm install```
- Start front-end server: ```npm run start```

<h3>Timeframe & Working Team</h3>

This project was working solo with a duration of 8 days for completion.

<h3>Technologies Used</h3>

**Front-end**
- HTML5
- SCSS / SASS
- JavaScript
- React.js

**Back-end**
- Python
- Django REST framework
- PostgreSQL database
- Axios
- JSON Web Tokens (JWT)
- Heroku deployment

**Tools**
- VSCode
- pip
- Git, Github
- Insomnia
- Trello
- Excalidraw
- TablePlus
- QuickDBD

<h2>Brief</h2>

- Build a full-stack application by making your own backend and your own front-end
- Use a Python Django API using Django REST Framework to serve your data from a Postgres database
- Consume your API with a separate front-end built with React
- Be a complete product which most likely means multiple relationships and CRUD functionality for at least a couple of models
- Implement thoughtful user stories/wireframes that are significant enough to help you know which features are core MVP and which you can cut
- Have a visually impressive design to kick your portfolio up a notch and have something to wow future clients & employers. ALLOW time for this.
- Be deployed online so it's publicly accessible.

<h2>Planning</h2>

Right from the outset, I already knew the subject matter that I wanted to cover!  I always wanted to create a music app where I can bring together all my favourite mixtapes from around the web, from different sources, such as Soundcloud and Youtube.  As far as I am aware, there is no such product offering that does this.  And this project gave me the perfect opportunity to do that.

**Step 1: Exploring technical feasibility of the project**

I first started by exploring the technical feasibility of what I wanted to do, by looking into the Soundcloud and Youtube APIs as a starting point.  The first stumbling block occurred when I found out that Soundcloud has closed their API access for developers (!):

![My Images](client/src/images/image13.png)

This was annoying.  The good news is that Youtube API was available to use, with fairly comprehensive documentation.  On further investigation, I also found a React package called React-Player, which would be able to handle the playback of multiple sources (Youtube, Soundcloud etc) which would make my life easier, and also found a work-around for Soundcloud, by instead tapping into their Widget API rather than the core API access - whilst this meant I could only get read access to track information, this was all I needed.  I quickly found out that the React-Player would handle playback information but not track metadata, so I would need to use the Youtube and Soundcloud Widget APIs to supplement this data.  

As a fallback plan, if I ran into any technical challenges, I could always resort to having the 3rd party widgets (i.e. Soundcloud and Youtube widgets) added as separate tracks to play on the app, but obviously I would much prefer to have central control over the playback, as having a number of widgets on the page at once is not highly performant, especially on mobile.

Sam, our instructor, also advised me to check compatibility when deploying to Heroku - to make sure there are no issues.  And thankfully, I found some examples of sites deployed to Heroku using Youtube to play videos, so at this point, I was satisfied this project was technically possible!

**Step 2:  Formulating the concept**

My next step was to sketch out the vision in Excalidraw.  I took a lot of inspiration from an app I used to use many years ago called Winamp, that used to play mp3s.  I was also quite tired of every music app trying to copy Spotify, so I decided to do a modern take on a retro app.

![My Images](client/src/images/image3.png)

It would show album art, and the video if it were a youtube link, and there would be a large emphasis on the progress bar, so it would be easy to seek through a 1hr+ mix.  Pressing the mood buttons would filter the playlist below the controls.

Adding tracks would involve adding the mixtape URL, at which point the APIs would fetch the track metadata to pre-populate the fields.  The below shows how I might split up the JSX into the respective containers and divs:

![My Images](client/src/images/image1.png)

**Step 3: Creating the Database Diagram**

Based on the technical spike and the wireframes, I then started to map out what data I will need and how to structure it.  I created a data diagram of the relationships of the data, using a tool called Quick DBD, which would help inform the creation of the data models / schemas:

![My Images](client/src/images/image11.png)

I added the concept of applying ‘moods’ to ‘mixtapes’ - i.e. a many-to-many relationship, whereas a user will only ever have one mood at a time, i.e. one-to-many.  I didn't want to over-complicate the back-end, as we only had a week to polish the product and it was a solo project, so I kept the structure quite simple.  I started off making it quite complex, but instead preferred to simplify to improve overall quality of the end product.

**Step 4: Defining the MVP**

For the minimum product, I wanted at the very least to be able to play Soundcloud tracks and be able to store them under a profile, ideally using React-Player for playback, but would fall back to importing separate widgets for each track on the page if not.  I wanted to create a delightful user experience using best-in-case UI components and visuals.

A best case scenario would be the ability to playback both Soundcloud and Youtube tracks, stored under your profile, be able to edit the track data before storing, and then be able to filter down the mixtapes by mood.

Long-term goals would be to add more compatibility for other sources, including Mixcloud, a waveform generator (to visually represent the sound), be able to customise UI depending on different colours (and potentially tying to when changing mood!)

I had to be realistic though, as I only had 1 week on a full-stack project, so I would have to park the long-term goals for another time, but bear in mind how I might build the back-end and front-end out to accommodate these in the future.





