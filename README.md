# jCharge Control
jCharge Control is an open source battery cell tester control and management application. With an [open specification](/backend/API%20Specification.md), anybody can make a custom battery cell charger, discharger or multi purpose tester and control it using a modern web interface.

## Getting Started
This application is currently being developed and it is not recommended to use it.

## Getting Started (Development)
This project uses node, npm and other modern web technologies. If you don't have node installed, check the guide below.

To get started, clone this repo then run the following commands in both the [frontend/](frontend) and [backend/](backend) folders to run the development servers.

* Install dependencies with `npm i`
* Run the development server with `npm run dev`

To access the frontend, open [http://127.0.0.1:8080](http://127.0.0.1:8080/) in your browser.

### Tips
* You may need to synchronise the database the first time the backend runs (and when the models change) by setting `synchronize` to `true` in the `backend/ormconfig.json` file. Leaving this set to `true` will attempt to reset your database everytime the development server restarts so don't leave this on.


## Installing Node
We recommend that you use [nvm](https://github.com/nvm-sh/nvm) to manage your node versions. Get started below:

* Install nvm by running: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash`
* Install node 14 by running: `nvm install 14`
* Check it installed correctly by running: `node -v` and check the output is `14.x.x`.

## Considerations
This application is currently designed to run on a trusted network and be used by a single person. Therefore, there is no authentication or built in security.