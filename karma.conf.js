module.exports = function (config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine', '@angular-devkit/build-angular'],
		plugins: [
			require('karma-jasmine'),
			require('karma-chrome-launcher'),
			require('karma-jasmine-html-reporter'),
			require('karma-coverage'),
			require('karma-mocha-reporter'),
			require('@angular-devkit/build-angular/plugins/karma'),
			require('karma-junit-reporter'),
			require('karma-spec-reporter')
		],
		client: {
			jasmine: {
				random: false
			},
			clearContext: false // leave Jasmine Spec Runner output visible in browser
		},
		jasmineHtmlReporter: {
			suppressAll: true // removes the duplicated traces
		},
		reporters: ['progress', 'kjhtml', 'mocha', 'spec'],
		mochaReporter: {
			output: 'minimal',
			ignoreSkipped: true,
			maxLogLines: 5
		},
		junitReporter: {
			outputDir: '',
			outputFile: 'test-results/TEST-karma.xml',
			useBrowserName: false
		},
		reportSlowerThan: 500,
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ['Chrome'],
		singleRun: false,
		restartOnFileChange: true,
		customLaunchers: {
			headlessChrome: {
				base: "ChromeHeadless",
				flags: [
					"--no-sandbox",
					"--no-proxy-server",
					"--disable-web-security",
					"--disable-gpu",
					"--js-flags=--max-old-space-size=8196"
				]
			}
		},
		coverageReporter: {
			dir: require('path').join(__dirname, './coverage'),
			subdir: '.',
			reporters: [
				{ type: 'html' },
				{ type: 'text-summary' }
			]
		},
	});
};
