# Conafab: An Video Chat Web App

A video chat web app built to explore peer to peer communication. Supports all the basic functionalitites like video streaming, mailing service, mute/unmute and video recording. A user can start a meeting, share the meeting link or the meeting code with other users to join. 

## Flow

1. Meeting Owner
    - User Login/Register
    - Create a meeting 
    - Share meeting link or code
    
2. Other Participants
    - User Login/Register
    - Use link or code to join the meeting

## Setup

### 0. Install node, npm
- Node & Npm: https://nodejs.org/en/

### 1. Package Installation:

```
yarn or npm i
```

### 2. Start Server

```
yarn start or npm run start
```

## Routes

| Endpoints              	| Types     	| Usage                            	|
|------------------------	|-----------	|----------------------------------	|
| /dashboard             	| GET       	| Dashboard                        	|
| /login                 	| POST, GET 	| Login Users                      	|
| /signup                	| POST, GET 	| Signup Users                     	|
| /generateRoomId        	| GET       	| Generate Room-ID                 	|
| /checkRoomId?roomId=id 	| GET       	| Join Existing Room using Room-ID 	|
| /:roomId               	| GET       	| Meeting Room                     	|

## Learnings

- REST API
- WebRTC API
- WebSockets: Full Deplex communication
- MySQL