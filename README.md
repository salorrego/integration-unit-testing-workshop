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

```properties
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
