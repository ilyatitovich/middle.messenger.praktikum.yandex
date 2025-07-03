# Y-CHAT

**Y-CHAT** is a portfolio project — a web messenger built using JavaScript, TypeScript, CSS, and browser APIs.

## Key Features

* **Registration**: Create a new account;
* **Authentication**: Log in to the system;
* **Chat List**: View all available chats and navigate to the desired one;
* **Messaging**: Send and receive messages in real-time.

## Live Version

[The project is deployed on Netlify](https://y-chat.netlify.app/)

## Page List

* [Login](https://y-chat.netlify.app/)
* [Sign Up](https://y-chat.netlify.app/sign-up)
* [User Profile](https://y-chat.netlify.app/settings)
* [Edit Profile Data](https://y-chat.netlify.app/settings/change-data)
* [Change Password](https://y-chat.netlify.app/settings/change-password)
* [404 Page](https://y-chat.netlify.app/404)
* [500 Page](https://y-chat.netlify.app/500)
* [Chat](https://y-chat.netlify.app/messenger)

## Technologies Used

### Core Dependencies

* **Express**: Used to run the server;
* **Handlebars**: Templating engine for rendering pages.

### Development Tools

* **TypeScript**: Statically typed superset of JavaScript for safer and more efficient development;
* **Vite**: Fast build tool for development and production.

#### Code Linting and Formatting

* **ESLint**: Linter for JavaScript and TypeScript to enforce coding standards;

  * **@typescript-eslint** plugin: Rules for TypeScript;
  * **eslint-plugin-perfectionist**: Sorts objects and imports for better readability;
* **Prettier**: Code formatter for consistent style.

#### Style Linting

* **Stylelint**: Linter for CSS and PostCSS;

  * **@stylistic/stylelint-config**: Predefined stylelint rules;
  * **stylelint-use-logical**: Promotes the use of logical CSS properties.

#### CSS Post-processing

* **PostCSS**: Tool for transforming CSS;

  * **autoprefixer** plugin: Adds vendor prefixes for browser compatibility;
  * **postcss-nesting** plugin: Enables nested selectors in CSS.

#### Git Workflow Tools

* **Husky**: Manages Git hooks to run checks before commits;
* **Nano Staged**: Lightweight tool for running checks on staged files.

#### Task Running

* **npm-run-all**: Utility for running multiple npm scripts.

#### Testing

* **Mocha**: Test framework;
* **Chai**: Assertion library;
* **Sinon**: Spies, stubs, and mocks;
* **JSDOM**: Virtual DOM for frontend testing;
* **ts-node**: Runs TypeScript code without pre-compilation.

## Local Development

1. Clone the repository:

   ```bash
   git clone https://github.com/ilyatitovich/middle.messenger.praktikum.yandex.git
   ```

2. Navigate into the project folder:

   ```bash
   cd y-chat
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Run tests:

   ```bash
   npm run test
   ```

5. Start the app:

   ```bash
   npm run start
   ```

6. Run in development mode:

   ```bash
   npm run dev
   ```
