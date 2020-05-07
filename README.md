# Prosjekt 2 - IMT2291 - Spring 2020 #

## Group members:    
June V. E. Hansen

## Project description: 
Project description in [original project](https://bitbucket.org/okolloen/imt2291-prosjekt2-2019/wiki/Home).

## Setup: 
- docker-compose up -d
The project runs on localhost:8080
Shouldn't be more needed, as all dependencies are in the project files. 

There are a few already created users: 
Admin user login: 
- Username: admin@admin.no
- Password: 

Validated teacher login: 
- Username: teacher@teacher.no
- Password: adminpassword

Student login: 
- Username: student@student.no
- Password: adminpassword

## Report:    
### Choices: 
- Again using English as display language, as the target users are NTNU students and staff where a good portion don't speak Norwegian.
- An admin user can not delete the last admin, this is done serverside. 


### Good solutions:
- Using mostly finished webcomponents, so it looks relatively good. 
- Project functionality is almost entirely complete. 
- Since I had well defined class functions from the last project, I was able to reuse almost the entirety of that, making me able to focus on the frontend. 
- The project is well structured and should be easy to navigate. The full views is in a seperate folder, while other, smaller, litelements are in the components folder. The naming scheme is consistent throughout. 
- I've created what I'd call a lazy fussy search, where the first letter of a search is removed before searching in the database. This avoid most issues related to capitalization. 
- The project relies entirely on the database for saving and retrieving, there's no local saving of any files. 


### Challenges: 
- Picking a thumbnail from a video is not implemented. 
- As the project text did not mention anything about testing, that's not something I've focused on at all. I preferred trying to get as much of a completed project as possible. 
- There is some inconsistent commenting. 
- I have a few places where I should probably just do an event dispatch to update info, but instead I reload the page. This was done for ease of implementation, such as for rating. 


### Self-created components: 
The components created specifically for this project is mainly all the views. These are created for gathering all the components needed for a single page. In addition, I've created some smaller components. These are mainly used for showing information (such as videocard, videoinfo, playlistcard and comments which all show information about the video, a playlist, or shows an existing comment). In addition, the video view required a few extra components for the player itself and the cues to show beside the video. Those are structurally copied from the videoVTT-example we were given.


### API endpoints: 
My endpoints are everything listed under the ./Backend/Playlist, ./Backend/Video and ./Backend/User folders. They are all named clarly, and is very similarly written, so explaining each one individually seems overkill. Instead, I'll explain them by group. 

For all except getting files, is that they return a msg property that is set to "OK", simply to be able to check that everything happend as it should. The files simply return the file blob. 

For getting or deleting, the object ID is required (vid for videos, uid for users and pid for playlists, plus cid for comments). Getting will, in addition to "OK", return the requested information. 

For updating, the object ID plus the new info is required. 

For creating, only the information to be uploaded is required.

### Models
[Wireframe sketch](https://cdn.discordapp.com/attachments/499627643746910219/707907492541366312/wireframeProj2.jpg)

[Tree structure](https://cdn.discordapp.com/attachments/499627643746910219/707913883708293121/unknown.png)




      

