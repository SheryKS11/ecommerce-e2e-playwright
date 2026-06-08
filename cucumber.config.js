module.exports = {
  default: {
    require: ['src/support/world.ts', 'src/support/hooks.ts', 'src/steps/**/*.ts'],
    requireModule: ['tsx/cjs'],
    format: [
      'progress-bar',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json'
    ],
    formatOptions: { snippetInterface: 'async-await' },
    paths: ['features/**/*.feature'],
    parallel: 1,
    timeout: 30000
  }
};
