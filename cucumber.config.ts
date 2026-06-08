export default {
  default: {
    import: ['src/support/hooks.ts', 'src/steps/**/*.ts'],
    loader: ['tsx'],
    format: [
      'progress-bar',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json'
    ],
    formatOptions: { snippetInterface: 'async-await' },
    paths: ['features/**/*.feature'],
    parallel: 1
  }
};
