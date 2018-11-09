"use strict";
let Crawler = require('../Classes/Crawler')
let crawler = new Crawler('https://wiprodigital.com')

let expect = require('chai').expect
let assert = require('chai').assert,

// Dependencies
request = crawler.request,
cheerio = crawler.cheerio,
fs = crawler.fs,

//Variables
baseUrl = crawler.baseUrl

describe('Crawler', function () {

	it('should receive a new URL string', function () {
		expect(baseUrl).to.not.be.NaN
		expect(baseUrl).to.not.be.empty
		expect(baseUrl).to.not.be.undefined
		expect(baseUrl).to.be.a('string')
	})

	it('should use an URL with specific format', function () {
		assert.match(baseUrl, /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)
	})

	it('should require dependencies', function () {
		expect(request).to.not.be.undefined
		expect(cheerio).to.not.be.undefined
		expect(fs).to.not.be.undefined
	})

	it('should create a XML file')
	it('should request the page body from a given URL')
	it('should Look for relative links')
	it('should Look for absolute links')
	it('should Look for relative image links')
	it('should Look for absolute limage inks')
	it('should write the XML file')
	it('should end the XML file with a final </sitemap> tag')

})
