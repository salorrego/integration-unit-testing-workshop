# Integration and Unit Testing Workshop

Welcome!
This is a workshop where you can learn about integration testing and unit testing on BE using NestJs and PostgreSQL using a lot of practices.

**NOTE:** The full result is in branch `full-project` in case you want to check it out

## What you will need before you start

- Knowledge of basic NodeJs
- How to write on BDD
- Visual Studio Code (if you want to use another IDE please ignore VS Code extensions steps)
- Git (You can follow next [link](https://education.github.com/git-cheat-sheet-education.pdf) for Git cheat sheet)
- NodeJs - [Install NodeJS if you don't have it yet](https://nodejs.org/en/download)
  > You may install any version after NodeJs 14
- Docker - [Install Docker if you don't have it yet](https://www.docker.com/)
  > Docker will be used to simulate our systems and to be able to develop the project

## Steps

## Content Table

1. [Project Setup](#1-project-setup)
2. [Adding Continuous Integration](#2-adding-continuous-integration)
3. [Testing With BDD](#3-testing-with-bdd)
4. [Intercepting API calls](#4-intercepting-api-calls)
5. [Unit Testing](#5-unit-testing)
6. [Adding More Tests](#6-adding-more-tests)
7. [Uploading Artifacts to Github Actions](#7-uploading-artifacts-to-github-actions)

### 1. Project Setup

**Description**: We will use an existing BE project that uses NestJS and PostreSQL for the DB; and though the workshop you will be adding continuous integration (CI) using a basic configuration for a [Github](https://help.github.com/) repository.

**Note:** If it's your first time working with Github repositories it's highly recommended to check this guide before starting. [Github Guides](https://guides.github.com/activities/hello-world/).

1. Create your Github account (skip this step if you already have one)
2. Create a new repository on Github called `**integration-unit-testing-workshop**` (you can also change the name if you want to, this name will be used on all commands from the workshop)
3. Clone this repository on your local machine with `git clone git@github.com:salorrego/integration-unit-testing-workshop.git` (for SSH cloning) or `git clone https://github.com/salorrego/integration-unit-testing-workshop.git` (for HTTP cloning)
4. Change the remote to your own

```shell
git remote rm origin
git remote add origin git@github.com:<your user goes here>/integration-unit-testing-workshop.git
git push -u origin main
```

5. On Github repository settings under Branches option add a new rule to add protection to main branch so it requires always PR before merging
6. On Colaborators manu add:

- [salorrego](https://github.com/salorrego)

7. Create a new branch **project-setup** on the repository

```bash
git checkout -b project-setup
```

8. Create the file `.editorconfig`

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

9. Inside the file `.gitignore` add next content

```.gitignore
# Tests
/coverage
/.nyc_output
/test_reports
```

10. Install Visual Studio Code extension `Editorconfig for VS Code` (May require to restart the IDE)

11. Install next dev dependencies for testing:

```bash
npm i -D @types/jest docker-compose jest ts-jest jest-watch-master jest-watch-typeahead jest-watch-toggle-config jest-dashboard jest-html-reporters jest-junit
```

12. Create `jest.config.js` on the root of the project

```jest.config.js
module.exports = {
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: '<rootDir>/coverage',
  testTimeout: 10000,
  testMatch: [
    '**/*.test.ts',
    '!**/stryker-tmp/**',
    '!**/test-helpers.js**',
    '!**/*global-setup*',
  ],
  globalSetup: '<rootDir>/test/support/global-setup.ts',
  globalTeardown: '<rootDir>/test/support/global-teardown.ts',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: false,
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './coverage/html-report',
        filename: 'report.html',
        expand: true,
      },
    ],
    [
      'jest-junit',
      {
        outputDirectory: 'test_reports/jest',
        outputName: 'results.xml',
      },
    ],
  ],
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

13. Add to your `package.json` file next commands under the scripts:

```pakcage.json scripts
"test": "jest",
"test:watch": "npm run test -- --watch",
"test:cov": "npm run test -- --coverage",
"test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand"
```

14. Create the folder `2-integration` under `test` folder

15. Create your first test in `test/2-integration/books.test.ts` with next content

```books.test.ts
import { HttpStatus } from '@nestjs/common';

import { closeServer, startServer } from '../../src/server';
import { getAxiosInstance } from '../test-helpers';
import { saveBook } from '../test-helpers';

const books = [
  {
    name: "Harry Potter Philosopher's Stone",
    author: 'J. K. Rowling',
    genre: 'Fantasy',
    quantity: 3,
    totalAvailable: 1,
  },
  {
    name: 'Harry Potter Chamber of Secrets',
    author: 'J. K. Rowling',
    genre: 'Fantasy',
    quantity: 1,
    totalAvailable: 1,
  },
  {
    name: 'Absalom, Absalom',
    author: 'WILLIAM FAULKNER',
    genre: 'Fiction',
    quantity: 5,
    totalAvailable: 5,
  },
];

async function saveAllBooks() {
  console.log('About to start book seeding');
  for (const book of books) {
    await saveBook(book);
    console.log(`adding book: ${book.name}`);
  }
  console.log('books seeding done');
}

const axios = getAxiosInstance();

describe('(Integration) Books', () => {
  beforeAll(async () => {
    await startServer();

    // Add books to the DB
    await saveAllBooks();
  });

  afterAll(async () => {
    // 🔚 Close server
    await closeServer();
  });

  test('api returns all books', async () => {
    const booksResponse = await axios.get('api/v1/books');
    expect(booksResponse).toMatchObject({
      status: HttpStatus.OK,
      data: expect.arrayContaining([
        expect.objectContaining({ id: expect.any(Number), ...books[0] }),
        expect.objectContaining({ id: expect.any(Number), ...books[1] }),
        expect.objectContaining({ id: expect.any(Number), ...books[2] }),
      ]),
    });
  });
});
```

16. Create unter `test` folder a new folder called `support`

17. Inside the folder `test/support` create the file `gloabl-setup.ts`

```global-setup.ts
// Set ENV variables
process.env.LOG_LEVEL = 'debug';
process.env.LOG_PRETTY_PRINT = 'true';
process.env.DEVICE_PORT = '3333';
process.env.TYPEORM_PORT = '54320';
process.env.TYPEORM_HOST = 'localhost';

import { join, dirname } from 'path';
import { upAll } from 'docker-compose';
import isPortReachable from 'is-port-reachable';
import { exec } from 'child_process';
import { promisify } from 'util';
import { waitForPostgres } from '../test-helpers';

export default async function setup() {
  // ✅ Best practice: Give to devs the possibility to avoid this steps
  if (process.argv.includes('--silent')) {
    process.env.LOG_ENABLED = 'false';
  }

  if (process.env.noInfrastructure) {
    return;
  }

  const isDBReachable = await isPortReachable(54320, { host: 'localhost' });
  if (!isDBReachable) {
    // 🏃🏻‍♂️ Run docker
    await upAll({
      cwd: join(dirname(__filename), './docker'),
      log: true,
    });
  }

  // 😴 Wait for Postgres to be ready to accept connections
  await waitForPostgres();

  // 🏁 Apply DB migrations
  const customExec = promisify(exec);
  await customExec('npm run db:migrate');
  // 🌱 Seed anything you require
  // await customExec('npm run seed');
}
```

> This step is critical, because everytime you run your tests it will set up the required env vars (if you wish to know more about it you can check the `config` folder) and it will also start docker with our DB independent of the project (in case you want to work with it, the DB for testing will be on a different port), after starting the images it will run the migrations required for your project so your testing Db is up to date
> In case you want to run seeding you can do it by adding the npm script that will execute it.

18. Inside the folder `test/support` create the file `gloabl-teardown.ts`

```global-teardown.ts
import path from 'path';
import { down } from 'docker-compose';
import isCI from 'is-ci';
import { exec } from 'child_process';
import { promisify } from 'util';
import { getMigrations, truncateTable } from '../test-helpers';

export default async function tearDown() {
  if (process.env.noInfrastructure) {
    return;
  }

  // ⛔️ Erase all DB data
  await truncateTable('books');

  // ✋🏻 Run migrations revert only on CI env
  if (isCI) {
    // ⏮ DB migrations revert
    const customExec = promisify(exec);
    const migrations = await getMigrations();

    const migrationsToRun = [];
    for (let migration = 0; migration < migrations.rowCount; migration += 1) {
      await customExec('npm run typeorm:revert');
    }

    // ✋🏻 Stop docker container
    down({
      cwd: path.join(path.dirname(__filename), './docker'),
      log: true,
    })
      // eslint-disable-next-line promise/always-return
      .then((res) => {
        console.log('DOCKER COMPOSE DOWN SUCCESFULLY: ', res);
      })
      .catch((err) => {
        console.log('DOCKER COMPOSE DOWN ERROR: ', err);
      });
  }
}

```

> This step is critical, since it will truncate your tables so you can run your tests over and over again, also when it runs on CI it will run a revert of the migrations before stopping the containers

19. Inside `test/support` create the folder `docker` and inside of it create the file `docker-compose.yml`

```docker-compose.yml
version: '3.2'
services:
  postgres-service-test:
    image: 'postgres:13-alpine'
    container_name: 'nestjs-practice-postgresql-test'
    command: postgres -c fsync=off -c synchronous_commit=off -c full_page_writes=off -c random_page_cost=1.0
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -h localhost -p 54320 -U admin']
      interval: 20s
      timeout: 5s
      retries: 5
    ports:
      - '54320:5432'
    environment:
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=admin
      - POSTGRES_DB=nestjs-practice-db
    stop_signal: SIGKILL
```

20. Add to the file `test/test-helpers/db/db-helpers.ts` next content:

```db-helpers.ts
/**
 * @return {Promise<QueryResult<any>>} Return all migrations
 */
export async function getMigrations(): Promise<QueryResult<any>> {
  const client = createClient();
  await client.connect();
  const res = await client.query('SELECT * FROM "migrations";');
  client.end();

  return res;
}

/**
 * @return {Promise<void>} Truncate a table
 */
export async function truncateTable(table: string): Promise<void> {
  const client = createClient();
  await client.connect();
  client.query(`TRUNCATE "${table}" CASCADE;`, async (err) => {
    if (err) {
      console.log(err);
    }
    await client.end();
  });
}

/**
 * Timeout helper function
 */
const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * @return {Promise<void>} Wait for postgres to be ready to accept connections
 */
export async function waitForPostgres(
  DEFAULT_MAX_ATTEMPTS = 20,
  DEFAULT_DELAY = 150,
): Promise<void> {
  let didConnect = false;
  let retries = 0;
  while (!didConnect) {
    try {
      const client = createClient();
      await client.connect();
      console.log('✅ Postgres is ready to accept connections');
      client.end();
      didConnect = true;
    } catch (error) {
      retries += 1;
      if (retries > DEFAULT_MAX_ATTEMPTS) {
        throw error;
      }
      console.log('😴 Postgres is unavailable - sleeping');
      await timeout(DEFAULT_DELAY);
    }
  }
}
```

> Each of this fns will be used for our global setup/teardown

21. Update the file `test/test-helpers/index.ts` with next content

```index.ts
export {
  waitForPostgres,
  getMigrations,
  truncateTable,
  saveBook,
} from './db/db-helpers';
export { getAxiosInstance } from './axios-instance';
```

> This will allow us to import from test-helpers everything we need

22. Under the foler `test/test-helpers` create the file `axios-instance.ts`

```axios-instance.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { get } from '../../config/convict';

/**
 * Returns an Axios instance, Here we can set default configuration (like auth)
 * @return {AxiosInstance}
 */
export function getAxiosInstance(
  accessToken = '',
  port = get('server.port'),
): AxiosInstance {
  const config: AxiosRequestConfig = {
    baseURL: `http://${get('server.localhostIp')}:${port}`,
    responseType: 'json',
    timeout: 2000,
    validateStatus: () => true,
    headers: {},
  };

  if (accessToken !== '') {
    config.headers = { authorization: `Bearer ${accessToken}` };
  }
  const instance = axios.create(config);
  return instance;
}
```

> This will create an axios instance for our tests with the base configuration

23. Run your tests

```bash
npm run test
```

> You should get a success message from your console

24. Create a LICENSE file on the root of the project using next [TEMPLATE](https://en.wikipedia.org/wiki/MIT_License) (_remember to update the year and copyright holders_)

25. Create on the root of the project a folder called **.github** and inside create the file `CODEOWNERS` with next content:

```CODEOWNERS
* @salorrego
```

26. Make a commit with all changes and push your changes to the repository:

```bash
git add .
git commit -m "setup project configuration"
git push origin project-setup
```

27. Create a PR, assign to a reviewer, wait for comments or approval. (For more information on how to create a PR follow next [link](https://help.github.com/articles/creating-a-pull-request/))

    > **Note:** You should always have a reviewer, you can try finding a friend that knows how to do one and ask him to do it. Since this is a self-learning workshop if you don't have a reviewer you can review the results on the corresponding branch of the workshop repository and merge your PR

28. Let's wrap up first step, we did:

- [x] Add basic configuration for jest to work and generate reports
- [x] Added a docker-compose so our tests can simulate the whole system
- [x] Add global setup/teardown so our project can run the tests simulating the system
- [x] Added our firts test! 🥳

### 2. Adding Continuous Integration

**NOTE:** In this case we will be using [Github Actions](https://github.com/features/actions) for this workshop, if you want to use any other CI you may require different steps.

1. Create a new branch **adding-ci** on the repository

```bash
git checkout -b adding-ci
```

2. Inside the folder `.github` create a folder called `workflows` and inside of it create the file `test.yml`

```test.yml
name: 🚧 Test

on:
  push:
    branches:
      - '*'
  pull_request:
    branches:
      - main
  workflow_dispatch:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-20.04

    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js 14.x
        uses: actions/setup-node@v3
        with:
          node-version: 14.x
      - run: npm ci
      - run: npm run build
      - run: npm test:cov
```

> What this will do is every time you push your changes to Github or create a PR to the main breanch it will run the build of the project and the tests

3. Commit your changes, push and create a PR

4. In Branch protection settings update your rules to include `Require status checks to pass before merging` and inside that list search for `test`

   > **NOTE:** you may need to push the changes and create a PR before you can see the `test`

5. Assign the PR to a reviewer, wait for comments or approval.

6. Let's wrap up step #2. We did:

- [x] Add CI configuration with Github Actions
- [x] Protect our repository so every time anyone wants to merge changes on a PR, it has to first pass the tests 🥳

7. Create a PR, assign to a reviewer, wait for comments or approval.

### 3. Testing With BDD

1. Create a new branch **bdd-testing** on the repository

```bash
git checkout -b bdd-testing
```

2. Let's redo `books.test.ts` so it's more easy to read

```books.test.ts
import { HttpStatus } from '@nestjs/common';

import { closeServer, startServer } from '../../src/server';
import { getAxiosInstance } from '../test-helpers';
import { saveBook } from '../test-helpers';

const books = [
  {
    name: "Harry Potter Philosopher's Stone",
    author: 'J. K. Rowling',
    genre: 'Fantasy',
    quantity: 3,
    totalAvailable: 1,
  },
  {
    name: 'Harry Potter Chamber of Secrets',
    author: 'J. K. Rowling',
    genre: 'Fantasy',
    quantity: 1,
    totalAvailable: 1,
  },
  {
    name: 'Absalom, Absalom',
    author: 'WILLIAM FAULKNER',
    genre: 'Fiction',
    quantity: 5,
    totalAvailable: 5,
  },
];

async function saveAllBooks() {
  console.log('About to start book seeding');
  for (const book of books) {
    await saveBook(book);
    console.log(`adding book: ${book.name}`);
  }
  console.log('books seeding done');
}

const axios = getAxiosInstance();

describe('(Integration) Books', () => {
  beforeAll(async () => {
    await startServer();

    // Add books to the DB
    await saveAllBooks();
  });

  afterAll(async () => {
    // 🔚 Close server
    await closeServer();
  });

  describe('/api/v1/books', () => {
    describe('GET', () => {
      describe('when the user gets all books', () => {
        test('then the service should return all books', async () => {
          //Act
          const booksResponse = await axios.get('api/v1/books');

          //Assert
          expect(booksResponse).toMatchObject({
            status: HttpStatus.OK,
            data: expect.arrayContaining([
              expect.objectContaining({ id: expect.any(Number), ...books[0] }),
              expect.objectContaining({ id: expect.any(Number), ...books[1] }),
              expect.objectContaining({ id: expect.any(Number), ...books[2] }),
            ]),
          });
        });
      });
    });
  });
});
```

> This is just a proposed format, on our current terminal it's easier to read the output of jest, and since tests should be the documentation of the project, this is a great way of creating them
> You can find more information about BDD in the next [link](https://en.wikipedia.org/wiki/Behavior-driven_development)
> This proposed way of separating tests consist in:
>
> > The path for your API (if you have just the partial API for 2 API's on the tests you can just add the rest of the path inside of a new describe inside the partial path)
> >
> > > Then the method for your API
> > >
> > > > Then the description of what is it doing (`BDD When`)
> > > >
> > > > > Then the description of the assertion (`BDD Then`)

3. Let's wrap up step #3. We did:

- [x] We updated the tests to have BDD, now our tests will be easier to read, awesome!

4. Create a PR, assign to a reviewer, wait for comments or approval.

### 4. Intercepting API calls

1. Create a new branch **api-intercept** on the repository

```bash
git checkout -b api-intercept
```

2. Let's install `nock` as a dev dependency so we can intercept API calls during our tests, for more information you can check the lib docs [here](https://www.npmjs.com/package/nock)

```bash
npm i -D nock
```

3. Now let's use nock to intercept an API call to a thrid party like this:

```nock
nock(`${url}`)
  .get('/word')
  .reply(200, 'Mocked Upcoming')
  .persist()

// Inside the after all remember to add the clearAll
nock.cleanAll()
```

> **NOTE:** `.persist()` is not needed in this case, just remember that if you have more than one test using the nock, this will keep the interceptor working

4. Yor testing file should now look like this:

```books.test.ts
import { HttpStatus } from '@nestjs/common';
import nock from 'nock';

import { closeServer, startServer } from '../../src/server';
import { getAxiosInstance } from '../test-helpers';
import { saveBook } from '../test-helpers';
import { get } from '../../config/convict';

const books = [
  {
    name: "Harry Potter Philosopher's Stone",
    author: 'J. K. Rowling',
    genre: 'Fantasy',
    quantity: 3,
    totalAvailable: 1,
  },
  {
    name: 'Harry Potter Chamber of Secrets',
    author: 'J. K. Rowling',
    genre: 'Fantasy',
    quantity: 1,
    totalAvailable: 1,
  },
  {
    name: 'Absalom, Absalom',
    author: 'WILLIAM FAULKNER',
    genre: 'Fiction',
    quantity: 5,
    totalAvailable: 5,
  },
];

async function saveAllBooks() {
  console.log('About to start book seeding');
  for (const book of books) {
    await saveBook(book);
    console.log(`adding book: ${book.name}`);
  }
  console.log('books seeding done');
}

const axios = getAxiosInstance();

describe('(Integration) Books', () => {
  beforeAll(async () => {
    nock(`${get('thirdParty.url')}`)
      .get('word')
      .reply(200, 'Mocked Upcoming');

    await startServer();

    // Add books to the DB
    await saveAllBooks();
  });

  afterAll(async () => {
    // 🔚 Close server
    await closeServer();

    nock.cleanAll();
  });

  describe('/api/v1/books', () => {
    describe('GET', () => {
      describe('when the user gets all books', () => {
        test('then the service should return all books', async () => {
          //Act
          const booksResponse = await axios.get('api/v1/books');

          //Assert
          expect(booksResponse).toMatchObject({
            status: HttpStatus.OK,
            data: expect.arrayContaining([
              expect.objectContaining({ id: expect.any(Number), ...books[0] }),
              expect.objectContaining({ id: expect.any(Number), ...books[1] }),
              expect.objectContaining({ id: expect.any(Number), ...books[2] }),
            ]),
          });
        });
      });
    });

    describe('upcoming', () => {
      describe('GET', () => {
        describe('when the user gets upcoming book', () => {
          test('then the service should return upcoming book', async () => {
            //Act
            const booksResponse = await axios.get('api/v1/books/upcoming');

            //Assert
            expect(booksResponse).toMatchObject({
              status: HttpStatus.OK,
              data: 'Mocked Upcoming',
            });
          });
        });
      });
    });
  });
});
```

5. Let's wrap up step #4. We did:

- [x] We just intercepted our first API call to a third party, awesome!

6. Create a PR, assign to a reviewer, wait for comments or approval.

### 5. Unit Testing

**Description**: Unit testing should be used when you have a comple logic, so you can deeply test the functionality you need, in the case of the rest of the API's provided for this workshop by using integration tests (integration betweet the Db and the BE) you can almost cover up all the functionalities the project has.

1. Create a new branch **unit-testing** on the repository

```bash
git checkout -b unit-testing
```

2. Install the dev dependency `sinon`

```bash
npm i -D sinon wait-for-expect
```

3. Let's create inside the folder `test` the folder `1-unit`

```bash
mkdir test/1-unit
```

4. Inside the folder `1-unit` let's create a file called `books.service.test.ts`

```books.service.test.ts
import { Connection, EntityManager, Repository } from 'typeorm';
import { spy, restore, SinonSpy } from 'sinon';
import waitForExpect from 'wait-for-expect';

import { BooksService } from '../../src/domain/service/books.service';
import { BooksRepository } from '../../src/data-access/books/books.repository';
import { BookModel } from '../../src/data-access/books/book.model';
import { connectionOptions } from '../../src/data-access/connection-options';
import { Logger } from '../../src/utils/logger';

describe('(Unit) Books Service', () => {
  let booksService: BooksService;
  let loggerInfoSpy: SinonSpy;

  beforeAll(() => {
    loggerInfoSpy = spy(Logger, 'info');

    const con = new Connection(connectionOptions);
    const repository = new Repository(BookModel, new EntityManager(con));
    const booksRepository = new BooksRepository(repository);
    booksService = new BooksService(booksRepository);
  });

  afterAll(() => {
    restore();
  });

  describe('given the user is in the app', () => {
    describe('when the user runs api for process in the background', () => {
      test('then the service should run the process in the background', (done) => {
        //Arrange
        const book = {
          name: 'Node.js Design Patterns',
          author: 'Mario Casciaro',
          genre: 'Education',
          quantity: 15,
          totalAvailable: 15,
        };

        //Act
        booksService.processInBg(book);

        //Assert
        waitForExpect(
          () => {
            expect(loggerInfoSpy.args).toMatchObject(
              expect.arrayContaining([
                [`BooksService: Process in BG ${book.name}`],
              ]),
            );
            done();
          },
          5000,
          1000,
        );
      });
    });
  });
});
```

> Now our "complex logic" api is working and we can test things that happen in the background! 🥳

5. Let's wrap up step #5. We did:

- [x] We just our first unit test with spy from sinon and waitForExpect, awesome!
- [x] We learned that Unit tests are for complex logic.

6. Create a PR, assign to a reviewer, wait for comments or approval.

### 6. Adding More Tests

1. Now it's time to practice, try to add missing API tests, remember to use BDD on all of your tests since those will become your documentation.

2. Create a PR, assign to a reviewer, wait for comments or approval.

### 7. Uploading Artifacts to Github Actions

1. It's time now to add our test results to our CI, for that you will need to add next lines to your github workflow

```test.yml
- uses: actions/upload-artifact@v3
  with:
    name: Test Results
    path: |
      coverage/
      test_reports/
```

> **NOTES:** This must go as the last step of your actions
>
> > What this will do is upload your test results to Github action, with thar you will be able to download the results (on Circleci you may be able to see them after the run without downloading it)

2. Try downloading the results, it's a zip file, and under the folder `coverage/html-report` you will find a file called `report.html`, try opening it on a browser, see what happens

3. Create a PR, assign to a reviewer, wait for comments or approval.
