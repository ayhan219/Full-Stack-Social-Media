## Project Description

This is a full-stack social media application built using Node.js, Express.js, React, and MongoDB. The platform provides users with a modern social experience, allowing them to connect, interact, and share content in various ways. Below are the key features of the application:


## How to Use Project?

First of all, download the project, run npm install to install all dependencies, then paste your MongoDB URL into the .env file inside the API folder, and finally start the server with npm run dev.
![image](https://github.com/user-attachments/assets/d13744bd-8c80-457a-ac18-a50b97b723b4)


## Project Description

<br>

## Features
#### -User Authentication: Sign up, login, and secure authentication with JWT.
#### -Follow System: Users can follow and unfollow each other to build connections.
#### -Messaging: Real-time messaging functionality allows users to send and receive messages.
#### -Post Interaction: Users can create posts, like/dislike, and comment on posts.
#### -Profile Customization: Each user has a profile where they can update their information and view their activity.
#### -Responsive Design: The app is fully responsive, providing a seamless experience across devices.



<br>


## Technologies Used
#### -Frontend: React.js, Axios for HTTP requests, Tailwind CSS for styling.
#### -Backend: Node.js, Express.js for API creation.
#### -Database: MongoDB for storing user data, posts, messages, and interactions.
#### -Authentication: JSON Web Tokens (JWT) for secure user sessions.
#### -Real-time Communication: WebSockets/Socket.io for real-time messaging between users.



<br>

## Project Information

After registering and logging in, you can share posts. Users who are not logged in cannot like or share posts, etc. Once logged in, let's start with the search feature. When you type a name into the search bar, that name appears, and if you click on it, you can go to their profile.

<br>

![image](https://github.com/user-attachments/assets/25c79ebe-007c-47fa-a8fc-d423aa2ac850)


<br>

In the Navbar, you will see notification and message icons. If someone follows you or likes your post, you will receive a notification. Additionally, if someone sends you a message, you will receive a message notification in that section.

![image](https://github.com/user-attachments/assets/85b8bde5-1da3-4503-83e5-91d2bb59c190)

<br>

When you click on your profile, your information will be displayed, and you can change everything except your username. Below, you'll find your posts along with the number of comments and likes they have received. You can change your profile picture by clicking on it. Additionally, when you hover over your posts, you'll have the option to edit or delete them.

![image](https://github.com/user-attachments/assets/87ed77d9-c16f-44ef-943e-7b74757a4d2a)

<br>

In the messaging section, you can send messages to users you follow. These messages are stored in the database, allowing you to access your chat history.

<br>

### Your view:

![image](https://github.com/user-attachments/assets/75d7b07c-49e3-465a-bff3-2c36ddfe3a4f)

<br>

### User view:

![image](https://github.com/user-attachments/assets/d446f754-d2b2-40a9-9875-f72f55f40fc2)

<br>

When you want to share a post, you can optionally attach an image or choose not to—it's up to you. You can also include emojis, as I used an emoji picker for this feature. Once you share the post, it appears at the top of the homepage.

<br>

In the post section, each post includes like and dislike buttons, as well as a total count of likes and comments. There’s also a timestamp indicating when the post was shared. Users can leave comments if they wish, and clicking on the post will display more detailed information about it.

![image](https://github.com/user-attachments/assets/e18ecd21-43ee-44ae-9483-6784a81e3e10)


when post clicked:

![image](https://github.com/user-attachments/assets/c46fc176-3889-42e9-a4e0-0d9dd61bc8f1)



<br>


On the right side, you'll find our followers, and you can search for specific followers as you like. Additionally, if you're on a computer or using a high-resolution device, clicking on a follower will open the chat section in the lower right corner, allowing you to have a conversation with them. Group chat functionality has not yet been implemented.


![image](https://github.com/user-attachments/assets/61b89562-6240-4725-8b25-a7bdea2b9470)

<br>


## Future plans

<br>

In the future, I plan to expand this project further. Currently, the styling is not at its best. I aim to enhance the user interface to provide a more seamless and visually appealing experience. Additionally, I want to implement more features, such as group chats and advanced notification systems, to improve user engagement. Gathering user feedback will also be crucial in identifying areas for improvement and ensuring that the platform meets the needs of its users. Overall, my goal is to create a robust and enjoyable social media experience that fosters connection and communication among users.
