#!/bin/bash

# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd <project-directory>

# Create a copy of the .env.example file and name it .env
cp .env.example .env

# Install dependencies
npm install

# Run database migrations
npm run migrations

# Start the development server
npm run start:dev
