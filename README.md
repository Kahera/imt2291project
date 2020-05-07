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


### Challenges: 
- Picking a thumbnail from a video is not implemented. 
- As the project text did not mention anything about testing, that's not something I've focused on at all. I preferred trying to get as much of a completed project as possible. 
- There is some inconsistent commenting. 


### API endpoints: 
My endpoints are everything listed under the ./Backend/Playlist, ./Backend/Video and ./Backend/User folders. They are all very similarly written, so explaining each one seems overkill. Instead, I'll explain them by group. 

Valid for all except getting files, is that they return a msg property that is set to "OK", simply to be able to check that everything happend as it should. The files simply return the file blob. 

For getting or deleting, the object ID is required (vid for videos, uid for users and pid for playlists, plus cid for comments). 

For updating, the object ID plus the new info is required. 

For creating, only the new information is required.

Search has a extra feature where it removes the first letter of a search to make it a little bit more like a fuzzy search, just to avoid most issues related to capitalization. 


### Models
[Wireframe sketch](https://cdn.discordapp.com/attachments/499627643746910219/707907492541366312/wireframeProj2.jpg)

[Tree structure](https://cdn.discordapp.com/attachments/499627643746910219/707913883708293121/unknown.png)




      

