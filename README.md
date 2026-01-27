# Gelp

A community platform for sharing, discovering, and rating games!

## Features

- User system
  - Registration and login
    - Password authentication
    - JWT or token based authentication
  - Profile management
    - Name, avatar, bio, etc.
  - Friend system
    - Add friends, remove friends, view friends list
    - Friend requests and notifications
- Content feed
  - Automatically fetch recent ratings and activity from friends
  - View popular games and trending ratings on the home page
- Game library
  - Browse and search for games in database
  - View game details, artwork, etc.
  - Button to add games to person library
  - Button to add games to wishlist
- Rating system
  - Rate games on a scale of 0-10
  - Write reviews for games
  - View average ratings and reviews from other users
    - Option to filter by friends only

## Contribution Rules

- Make sure you create issues for any significant changes or new features before starting work.
- Make sure new code is created on a new branch names 'issue-###/short-description'.
  - Naming the branch makes it easier to track down the issue later and keep things organized.
- Make sure to push your code frequently and open pull requests when ready for review.
- Commits
  - Use conventional commits - not required, but good practice
    - https://www.conventionalcommits.org/en/v1.0.0/
  - If not using conventional commits, make sure commit message are clear and descriptive of the changes.
  - Try to break commits up
    - for example, if you update docs and add a feature, make two commits.
