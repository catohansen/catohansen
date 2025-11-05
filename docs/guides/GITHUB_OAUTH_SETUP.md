<!--
Copyright (c) 2025 Cato Hansen. All rights reserved.

Proprietary - Unauthorized copying, modification, distribution, or use
of this software, via any medium is strictly prohibited without express
written permission from Cato Hansen.

License: PROPRIETARY
Author: Cato Hansen
Contact: cato@catohansen.no
Website: www.catohansen.no
-->

# GitHub OAuth Setup Guide

## Overview

This guide explains how to set up GitHub OAuth integration for the module onboarding system. This allows users to connect their GitHub account, select repositories, and create new repositories directly from the admin panel.

## Prerequisites

- GitHub account
- Access to GitHub Developer Settings
- Admin access to the system

## Step 1: Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the following:
   - **Application name**: `Cato Hansen Module Manager` (or your preferred name)
   - **Homepage URL**: `https://yourdomain.com` (or `http://localhost:3000` for development)
   - **Authorization callback URL**: 
     - Production: `https://yourdomain.com/api/modules/onboarding/github/auth/callback`
     - Development: `http://localhost:3000/api/modules/onboarding/github/auth/callback`
4. Click "Register application"
5. Copy the **Client ID** and generate a **Client Secret**

## Step 2: Configure Environment Variables

Add the following to your `.env` file:

```bash
GITHUB_CLIENT_ID="your_client_id_here"
GITHUB_CLIENT_SECRET="your_client_secret_here"
```

For Vercel or other platforms, add these as environment variables in your deployment settings.

## Step 3: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to `/admin/modules/onboarding`
3. Go to Step 3 (GitHub Setup)
4. Click "Connect GitHub Account"
5. Authorize the application
6. You should see your repositories listed
7. Select a repository or create a new one

## Features

### Repository Selection
- View all your repositories (public and private)
- Search and filter repositories
- See repository details (description, language, last updated)
- Auto-fill module information from selected repo

### Repository Creation
- Create new repositories directly from the admin panel
- Choose between public and private
- Add repository description
- Auto-initialize with README and MIT license

### Automatic Webhook Setup
- After module registration, webhooks are automatically configured
- Webhooks trigger on:
  - Push events
  - Release events
  - Pull request events
- Automatic synchronization with module changes

## API Endpoints

### `/api/modules/onboarding/github/auth/login`
- Initiates GitHub OAuth flow
- Redirects to GitHub authorization page

### `/api/modules/onboarding/github/auth/callback`
- Handles OAuth callback
- Stores encrypted token securely in user metadata
- Redirects back to onboarding with success/error

### `/api/modules/onboarding/github/auth/check`
- Checks if user is authenticated with GitHub
- Returns list of repositories if authenticated
- Used by `GitHubRepoSelector` component

### `/api/modules/onboarding/github/repos/create`
- Creates a new GitHub repository
- Requires GitHub OAuth authentication
- Returns repository details

## Security

- GitHub tokens are encrypted before storage (base64 encoding)
- Tokens are stored in user metadata, not in plain text
- OAuth state parameter prevents CSRF attacks
- Webhook HMAC signatures are verified
- Only OWNER/ADMIN roles can set up GitHub integration

## Troubleshooting

### "GitHub OAuth not configured"
- Make sure `GITHUB_CLIENT_ID` is set in `.env`
- Restart the development server after adding environment variables

### "Invalid state" error
- This can happen if the OAuth flow is interrupted
- Try again or clear cookies and retry

### Repositories not showing
- Check that the OAuth app has `repo` scope
- Verify the GitHub token is valid
- Check browser console for errors

### Cannot create repository
- Ensure the OAuth app has `repo` scope (full control)
- Check GitHub API rate limits
- Verify user has permission to create repositories in the organization

## Scope Requirements

The OAuth app requires the following scopes:
- `repo` - Full control of private repositories
- `read:org` - Read organization membership
- `user:email` - Access user email addresses

## Next Steps

After setting up GitHub OAuth:
1. Register modules using the onboarding wizard
2. Modules will automatically sync with GitHub
3. Webhooks will keep modules in sync
4. View sync history in `/admin/modules/[moduleId]`





