//------------------------------------------------------------------------------
// Copyright (c) 2017 San Dinh Studios. All Rights Reserved.
//
// NOTICE: You are permitted to use, modify, and distribute this file
// in accordance with the terms of the license agreement accompanying it.
//------------------------------------------------------------------------------

process.env.TEST = true;
process.env.NODE_ENV = 'test';

const webpack = require("webpack");
const path = require("path");
const webpackConfig = require('./webpack.config.js')({isTest: true});

delete webpackConfig.entry;

module.exports = function (config) {

    var configuration = {
        basePath: "",
        frameworks: [
            "mocha",
            "chai",
            "sinon",
            "es6-shim"
        ],
        files: [
            {pattern: "node_modules/core-js/client/shim.js", include: true},
            {pattern: "node_modules/bluebird/js/browser/bluebird.js", include: true},
            {pattern: "./test/**/**/**.test.ts", include: true},
            {pattern: '**/*.map', served: true, included: false, watched: true}
        ],
        preprocessors: {
            "./**/**/**/**.ts": ["sourcemap"],
            "./test/**/**/**.test.ts": ["webpack"]
        },
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true
        },
        plugins: [
            "karma-webpack",
            "karma-sourcemap-writer",
            "karma-sourcemap-loader",
            "karma-remap-istanbul",
            "karma-mocha-reporter",
            "karma-mocha",
            "karma-chai",
            "karma-sinon",
            "karma-es6-shim",
            "karma-coverage-istanbul-reporter"
        ],
        reporters: (
            config.singleRun ?
                ["dots", "mocha", "coverage-istanbul"] :
                ["dots", "mocha"]
        ),
        coverageIstanbulReporter: {
            reports: ["html", "lcov", "lcovonly", "text-summary"],
            dir: "coverage",
            fixWebpackSourcePaths: true,
            "report-config": {
                html: {
                    subdir: "html-report"
                }
            }
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: []
    };

    configuration.browsers = ['PhantomJS'];
    configuration.plugins.push("karma-phantomjs-launcher");

    config.set(configuration);
};
