# # Developer Documentation for the Ramanujan Machine Web Portal

## 1. Introduction

### 1.1. Project Overview

The web portal was developed by the [Georgia Tech Open Source Program Office](https://www.ospo.cc.gatech.edu).

The repository comprises a backend JSON data store, React UI code, and an automated deployment in GitHub Actions workflows that builds a GitHub Pages hosted React application.

### 1.2. Technologies Used

React was used in to build the user interfaces. 

The deployment comprises [GitHub Actions](https://docs.github.com/en/actions) workflows that run frontend and backend tests using [Cypress](https://www.cypress.io/) and [pytest](https://docs.pytest.org/en/8.2.x/) respectively.

## 2. Getting Started

In order to work on the UI for the web portal, you will need [Node.js](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs) installed for the purpose of frontend dependency management via [npm](https://docs.npmjs.com/cli/).

If you do not have a preferred web development IDE, [Visual Studio Code](https://code.visualstudio.com/) is a robust, free option that is popular in the web development community.

You will also require Python. The web portal was developed using Python 3.10.12 but this was purely a matter of timing and there is no reason to expect that the use of subsequent versions would cause any problems.

It is considered best practice to use a Python virtual environment when working on a Python application. There are several options for how to configure such a code bubble, but [venv](https://docs.python.org/3/library/venv.html) was used in the development of this project.

## 3. Project Structure

There are a few important files and folders at the root level. 

#### .gitignore
**.gitignore** specifies which files are to be ignored by git respectively.

#### .github/workflows/ 
The .github/workflows/ directory houses all of the GitHub Actions yaml files. 
* pages-deploy.yml - deploys the site to a GitHub Pages instance

### 3.1. Frontend (React)

The web user interface resides in the react-frontend subfolder. 

#### public/ 
The static assets live in this folder. The boilerplate favicon.ico and robots.txt live here. The image of the polynomial continued fraction that is displayed on the landing form is also in this directory.

#### src/ 
The majority of the code that you might want to modify is located in this folder.

#### App.css
App.css contains all of the CSS styling for the web portal.

#### index.tsx 
index.tsx loads the <App /> component from the App.tsx file to generate the index.html file that comprises the web portal.

#### vite.env.d.ts 
vite.env.d.ts contains definitions of environmental variables that need to be made available to the React application. The application will not be able to reference any environmental variables that are not defined in this file. `VITE_PUBLIC_IP` is the only such variable at the time of this writing and defines the hostname that the React application is to use to establish a web socket connection to the backend FastAPI web server.

#### src/components/ 
This folder contains all of the UI "components", which are essentially custom HTML tags with their own styling and Javascript behavior.

The following root-level files are "fix it and forget it" configurations. They are generally untouched after the UI is first created.
#### package.json
The React application is defined in the package.json file, where the available npm commands and dependencies are listed. 
#### package-lock.json
package-lock.json is automatically generated when a build is executed.
#### vite.config.js
vite.config.js is where Vite settings reside. The frontend makes use of Vite to provide common local development tooling, including a lightweight development server with hot reload.
#### index.html
index.html is the template used during the frontend build process. It does not require modification. Any changes made to the body of this file will be replaced when the React code is bundled.

## 4. Running the Application Locally

TBD

## 5. Testing

TBD

## 6. Deployment

The deployment process consists of a GitHub Action that builds and deploys the web UI to GitHub pages when a push to main is confirmed. This action should only be triggered when a pull request is merged into the main branch. 

An early version of this code used the [Public-Action-Trigger](https://github.com/apps/public-action-trigger) GitHub application to trigger a pull request for any submitted updates to the OSS Explorer form UI. 

You will need to have all of the values defined in the .creds file for local deployment defined as GitHub secrets on your repo for this workflow to succeed. You can find the secrets configuration at the following URL: https://github.com/<your org or user>/<your repo>/settings/secrets/actions or on the Settings tab.

## 7. Maintenance

### 7.1. Updating Dependencies

GitHub's Dependabot should be enabled for the repository. It will create PRs for critical dependency updates. 

To maintain the React dependencies on your own, you can invoke `npm outdated` to see a list of dependencies that need attention. The concerning ones will be presented in red type. From here you can upgrade dependencies using `npm upgrade <package name>`.

For both python-backend and lirec-grpc-server, upgrade the Python dependencies listed in the requirements.txt file however you choose, making sure to freeze them back to the requirements file when finished.

### 7.2 Troubleshooting



## 8. End-to-End Flow

