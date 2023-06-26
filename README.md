# Workshop is currently in development

# Integration and Unit Testing Workshop

Welcome!
This is a workshop where you can learn about integration testing and unit testing on BE using NestJs and PostgreSQL using a lot of practices.

## What you will need before you start

-   Knowledge of basic NodeJs
-   How to write on BDD
-   Visual Studio Code (if you want to use another IDE please ignore VS Code extensions steps)
-   Git (You can follow next [link](https://education.github.com/git-cheat-sheet-education.pdf) for Git cheat sheet)
-   NodeJs - [Install NodeJS if you don't have it yet](https://nodejs.org/en/download)
    > You may install any version after NodeJs 14
-   Docker - [Install Docker if you don't have it yet](https://www.docker.com/)
    > Docker will be used to simulate our systems and to be able to develop the project

## Steps

## Content Table

1. [Project Setup](#1-project-setup)
2. [Adding Continuous Integration](#2-adding-continuous-integration)
3. [Adding Jest reporters](#3-adding-jest-reporters)
4. [Testing With BDD](#4-testing-with-bdd)
5. [Intercepting API calls](#5-intercepting-api-calls)
6. [Unit testing](#6-unit-testing)
7. [Adding More Tests](#7-adding-more-tests)
8. [Uploading Artifacts to Github Actions](#8-uploading-artifacts-to-github-actions)

### 1. Project Setup

**Description**: We will use an existing BE project that uses NestJS and PostreSQL for the DB; and though the workshop you will be adding continuous integration (CI) using a basic configuration for a [Github](https://help.github.com/) repository.

**Note:** If it's your first time working with Github repositories it's highly recommended to check this guide before starting. [Github Guides](https://guides.github.com/activities/hello-world/).

1. Create your Github account (skip this step if you already have one)
1. Create a new repository on Github called `**integration-unit-testing-workshop**` (you can also change the name if you want to, this name will be used on all commands from the workshop)
1. Clone this repository on your local machine with `git clone git@github.com:salorrego/integration-unit-testing-workshop.git` (for SSH cloning) or `git clone https://github.com/salorrego/integration-unit-testing-workshop.git` (for HTTP cloning)
1. Change the remote to your own

```shell
git remote rm origin
git remote add origin git@github.com:<your user goes here>/integration-unit-testing-workshop.git
git push -u origin main
```

1. On Github repository settings under Branches option add a new rule to add protection to main branch so it requires always PR before merging
1. On Colaborators manu add:

-   [salorrego](https://github.com/salorrego)

1. Create a new branch **project-setup** on the repository

```bash
git checkout -b project-setup
```

1. Create the file `.editorconfig`

```.editorconfig
root = true

[*]
indent_style = space
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
indent_size = 2

[*.md]
indent_size = 4
trim_trailing_whitespace = false

```

1. Install Visual Studio Code extension `Editorconfig for VS Code` (May require to restart the IDE)

1. Install next dev dependencies for testing:

```bash
npm i -D @types/jest docker-compose jest ts-jest jest-watch-master jest-watch-typeahead jest-watch-toggle-config
```

1. Create `jest.config.js` on the root of the project

```jest.config.js
module.exports = {
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testTimeout: 10000,
  testMatch: [
    '**/*.test.ts',
    '!**/stryker-tmp/**',
    '!**/test-helpers.js**',
    '!**/*global-setup*',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/main.ts',
    '!**/node_modules/**',
    '!**/src/libraries/**',
    '!**/test/**',
    '!**/*test*.ts',
    '!**/*entity*.ts',
    '!**/migration/*.ts',
  ],
  forceExit: true,
  notify: true,
  notifyMode: 'change',
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
    'jest-watch-master',
    [
      'jest-watch-toggle-config',
      {
        setting: 'verbose',
      },
    ],
    [
      'jest-watch-toggle-config',
      {
        setting: 'collectCoverage',
      },
    ],
  ],
};
```

1. Add to your `package.json` file next commands under the scripts:

```pakcage.json scripts
"test": "jest",
"test:watch": "npm run test -- --watch"
```

1. Create the folder `2-integration` under `test` folder

1. Create your first test in `test/2-integration/books.test.ts` with next content

```books.test.ts
describe('(Integration) Books', () => {
  test('first test', () => {
    expect(true).toBeTtruthy()
  });
});
```

1. Run your tests

```bash
npm run test
```

> You should get a success message from your console

1. Create a LICENCE file on the root of the project using next [TEMPLATE](https://en.wikipedia.org/wiki/MIT_License) (_remember to update the year and copyright holders_)

1. Create on the root of the project a folder called **.github** and inside create the file `CODEOWNERS` with next content:

```CODEOWNERS
* @salorrego
```

1. Make a commit with all changes and push your changes to the repository:

```bash
git add .
git commit -m "setup project configuration"
git push origin project-setup
```

1. Create a PR, assign to a reviewer, wait for comments or approval. (For more information on how to create a PR follow next [link](https://help.github.com/articles/creating-a-pull-request/))
    > **Note:** You should always have a reviewer, you can try finding a friend that knows how to do one and ask him to do it. Since this is a self-learning workshop if you don't have a reviewer you can review the results on the corresponding branch of the workshop repository and merge your PR
