# ecommerce-e2e-playwright

Automated end-to-end regression test suite for the LambdaTest eCommerce Playground.
Built with Playwright + Cucumber (BDD) + TypeScript.

## Setup
npm ci
npx playwright install

## Run
npm run test          # full suite (excludes @bad-wait demo)
npm run test:smoke    # risk-based gate (~50s)
