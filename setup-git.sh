#!/bin/bash

# Set git identity
git config user.name "Bo Rose"
git config user.email "Borose2006@gmail.com"

# Add remote repository
git remote add origin https://github.com/Borose18/dog-food-tracker.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main

echo "✅ Git setup complete! Your project is now on GitHub!"
echo "🔗 Repository URL: https://github.com/Borose18/dog-food-tracker"
