
# Project Name - Learning Management System

Welcome to the documentation for the Learning Management System  implemented in this project. This guide will provide you with an overview of the available routes and their functionalities.

## Table of Contents

- [Introduction](#introduction)
- [User Routes](#user-routes)
  - [Register](#register)
  - [Login](#login)
  - [Logout](#logout)
  - [Get Profile](#get-profile)
  - [Forgot Password](#forgot-password)
  - [Reset Password](#reset-password)
  - [Change Password](#change-password)
  - [Update User](#update-user)
- [Course Routes](#course-routes)
  - [Get All Courses](#get-all-courses)
  - [Create Course](#create-course)
  - [Update Course](#update-course)
  - [Delete Course](#delete-course)
  - [Add Lecture to Course](#add-lecture-to-course)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This documentation outlines the available API routes for user authentication and course management. The project utilizes the Express.js framework to create these routes.

## User Routes

### Register

**Endpoint:** `POST /register`

Registers a new user with the provided registration information, including an optional avatar image.

### Login

**Endpoint:** `POST /login`

Allows users to log in using their credentials, generating a user token upon successful authentication.

### Logout

**Endpoint:** `GET /logout`

Invalidates the user token and logs the user out.

### Get Profile

**Endpoint:** `GET /me`

Requires authentication (isLoggedIn middleware) and retrieves the profile information of the logged-in user.

### Forgot Password

**Endpoint:** `POST /reset`

Initiates the password reset process by sending an email with instructions to users who have forgotten their password.

### Reset Password

**Endpoint:** `POST /reset/:resetToken`

Allows users with a password reset token to set a new password.

### Change Password

**Endpoint:** `POST /change-password`

Authenticated users can change their password by providing their old and new passwords.

### Update User

**Endpoint:** `PUT /update`

Authenticated users can update their profile information, including an optional avatar image.

## Course Routes

### Get All Courses

**Endpoint:** `GET /:courseId`

Retrieves all courses.

### Create Course

**Endpoint:** `POST /:courseId`

Creates a new course. Requires authentication and admin role.

### Update Course

**Endpoint:** `PUT /:courseId`

Updates course information. Requires authentication.

### Delete Course

**Endpoint:** `DELETE /:courseId`

Deletes a course. Requires authentication and admin role.

### Add Lecture to Course

**Endpoint:** `POST /:courseId`

Adds a lecture to a course. Requires authentication and admin role.

## Usage

1. Install dependencies using `npm install`.
2. Incorporate the provided code into your Express.js application.
3. Ensure that middleware and controller files are present.
4. Modify the routes and functions according to your project's needs.

## Contributing

Contributions are appreciated! Feel free to create pull requests to enhance the codebase.

## License

This project is licensed under the [MIT License](LICENSE).

---

Please customize this documentation with any additional information about your project's setup, configuration, and usage instructions.
