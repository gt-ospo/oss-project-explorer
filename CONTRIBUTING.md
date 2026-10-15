# Contribution Guidelines

Thank you for your interest in contributing to this open source tool. Please review these guidelines for the project so that you can most effectively engage with the developers and maintainers of the project.

This project is licensed under the [MIT license](LICENSE.txt).

## Types of Contributions Accepted

This open source project explorer is a standalone solution for hosting information on open source projects and sorting them according to license and category. We gladly accept patches to fix bugs in the source code, documentation improvements, and feature requests.

### Setting Up Your Development Environment

See the [developer documentation](docs/DEVELOPER.md) for the tools you will need, an overview of the project structure, and instructions for running the application locally.

### Contribution Process
In general, to contribute fixes or new code, you would do the following:

1) Fork the repo and clone your fork locally.
2) Create a branch for your changes.
3) Make your changes and check that they do not break anything (see [Testing Your Changes](#testing-your-changes)).
4) Open a PR with a description of your changes and the reasons for them.
5) Request reviewers and discuss/update the PR until it is ready to be accepted.

### Testing Your Changes

This project does not currently have an automated test suite, and pull requests are not checked by CI. Before opening a PR, please:

1) Run `npm run build` and confirm that the build completes without errors.
2) Run `npm start` and check in your browser that the pages and features affected by your changes work as expected.

### Reporting Bugs

**NOTE**: If you find a security vulnerability in the codebase, please use GitHub's security mechanisms to report the issue. This provides the development team an opportunity to respond to your findings and prepare a patch that can be released to mitigate any vulnerabilities. See [SECURITY.md](SECURITY.md) for more details.

Other bugs can be reported by opening a new blank issue in [GitHub Issues](https://github.com/gt-ospo/oss-project-explorer/issues). Please include steps to reproduce the bug, what you expected to happen, and what happened instead.

### Suggesting Features or Enhancements

If there is a feature that you would like to see in this project, please create a new issue for further discussion with the maintainers.

## Review Process

We will aim to review your PR in 1-2 weeks with a goal of getting it merged within that time frame. If changes are needed, we will follow up on the PR and may make some suggestions to help get it ready to be merged into the main branch.

### Code style conventions

We currently do not have strong checks for code formatting but please try to be consistent with the existing codebase with your changes in terms of file naming and code style.

## Community Channels for Discussion

The primary discussion channels for this project are via [GitHub Issues](https://github.com/gt-ospo/oss-project-explorer/issues).

### Code of Conduct for Discussions
Please see our [code of conduct](CODE_OF_CONDUCT.md) for any discussions related to this repo.
