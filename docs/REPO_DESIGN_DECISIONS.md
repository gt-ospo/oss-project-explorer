# Repo Design Decisions

This page details some of the design decisions used to create this repository, so that users can decide how to modify or enhance this repository for their own purposes.

## GitHub Pages Deployment

This implementation of the OSS project explorer uses GitHub pages to allow for a standalone development and deployment platform that is approachable for new users.

## Usage of React and Vite

This repository uses [React](https://en.wikipedia.org/wiki/React_(JavaScript_library)), a free and open source Javascript library for building web interfaces. For a nice example of using GravityKit as an alternative, please see [JHU's Open Source Project Catalog](https://ospo.library.jhu.edu/open-source-project-catalog/). The choice of using React was made due to local expertise with React-based applications as well as its widespread usage and the availability of free tools and resources.

An initial prototype for this repo used [Create React App (CRA)](https://github.com/facebook/create-react-app), an MIT-licensed tool that allows for easy creation of React applications. The current version of this repository uses [Vite](https://vitejs.dev/guide/) because it is considered "more modern" by some web developers and because it typically is faster to resolve and render Javascript dependencies. For a comparison of the two development frameworks, please [see this blog post](https://blog.logrocket.com/vite-3-vs-create-react-app-comparison-migration-guide/).

## Combined data and display infrastructure

An exploration of using a separate data and "display" GitHub repository was investigated for an initial prototype, but the complexities of triggering GitHub pull requests across repos created additional development and deployment burden. The current version of this codebase assumes a reasonable number of projects that can be stored in a standard JSON file. For organziations that expect to have thousands of entries, the JSON backend may need to be revisited in favor of a more robust database solution.  
