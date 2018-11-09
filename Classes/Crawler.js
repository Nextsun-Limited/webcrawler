"use strict"

class Crawler {

	constructor(baseUrl) {
		this.request = require('request')
		this.cheerio = require('cheerio')
		this.fs = require('fs')

		this.baseUrl = baseUrl
		this.visitedPages = {}
		this.pagesToVisit = []
		this.addedUrls = []

		// Create a new XML file
		this.fs.writeFile('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<sitemap>', (err, data) => {  
		    if (err) console.error('There was an error creating the file!', err)
		    console.log('SiteMap file created.\nFetching URLs...')
		})

		// Add first page to visiting list
		this.pagesToVisit.push(this.baseUrl)

		// Start crawling
		this.crawl()
	}

	crawl() {
		// Add final sitemap tag
		if(this.pagesToVisit.length === 0) {
			this.addClosingTag()
			return null
		}
		// get next page
		var url = this.pagesToVisit.pop()
		// Crawl new pages only 
		if (url in this.visitedPages) {
			this.crawl()
		} else if(url){
			this.goToPage(url)
		} 
	}

	goToPage(url) {
	  // Add page to visited list
	  this.visitedPages[url] = true

	  this.request(url, (error, response, body) => {
		// Check if the page is available
		if(response.statusCode !== 200) {
			this.crawl()
			return
		}
	    // Parse the document body
	    let $ = this.cheerio.load(body)

		this.getRelativeLinks($)
		this.getAbsoluteLinks($)
		this.getRelativeImageLinks($)
		this.getAbsoluteImageLinks($)
		// Crawl a new page
		this.crawl()
	  })
	}

	getRelativeLinks($) {
		let self = this
	    $("a[href^='/']").each(function() {
	    	if(self.addedUrls.indexOf($(this).attr('href')) === -1) {
	    		self.fs.appendFile('sitemap.xml', '\n\t<url>\n\t\t<loc>' + self.baseUrl + $(this).attr('href') + '</loc>\n\t</url>', (err, data) => {  
			    	if (err) console.error('There was an error writting the file!', err)
				})
				self.addedUrls.push(self.baseUrl + $(this).attr('href'))
	    	}
	        self.pagesToVisit.push(self.baseUrl + $(this).attr('href'))
	    })
	}

	getAbsoluteLinks($) {
		let self = this
	    $("a[href^='http']").each(function() {
	    	if(self.addedUrls.indexOf($(this).attr('href')) === -1) {
		    	self.fs.appendFile('sitemap.xml', '\n\t<url>\n\t\t<loc>' + $(this).attr('href') + '</loc>\n\t</url>', (err, data) => {  
			    	if (err) console.error('There was an error writting the file!', err)
				})
				self.addedUrls.push($(this).attr('href'))
			}			
			// Visit only internal pages
	    	if($(this).attr('href').includes(self.baseUrl)){
	        	self.pagesToVisit.push($(this).attr('href'))
	    	}
	    })
	}

	getRelativeImageLinks($) {
		let self = this
		$("img[src^='/']").each(function() {
	    	if(self.addedUrls.indexOf($(this).attr('src')) === -1) {
		    	fs.appendFile('sitemap.xml', '\n\t<image>\n\t\t<loc>' + self.baseUrl + $(this).attr('src') + '</loc>\n\t</image>', (err, data) => {  
			    	if (err) console.error('There was an error writting the file!', err)
				})
				self.addedUrls.push(baseUrl + $(this).attr('src'))
		    }		
	    })
	}

	getAbsoluteImageLinks($) {
		let self = this
		$("img[src^='http']").each(function() {
	    	if(self.addedUrls.indexOf($(this).attr('src')) === -1) {
		    	self.fs.appendFile('sitemap.xml', '\n\t<image>\n\t\t<loc>' + $(this).attr('src') + '</loc>\n\t</image>', (err, data) => {  
			    	if (err) console.error('There was an error writting the file!', err)
				})
				self.addedUrls.push($(this).attr('src'))
		    }		
	    })
	}

	addClosingTag() {
		this.fs.appendFile('sitemap.xml', '\n</sitemap>', (err, data) => {  
			if (err) console.error('There was an error writting the file!', err)
		})
		console.log('SiteMap file finished.')
	}

}

module.exports = Crawler
