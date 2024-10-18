---
title: Going from Wordpress to serverless, unhackable high-speed static websites
bg_image: "images/blog/serverless-website.png"
date: 2022-06-17T11:10:07.000+06:00
description: I chose to leave WordPress behind, and go to serverless, high-speed unhackable static websites instead
author: "Justin Guese"
image: "images/blog/serverless-website.png"
categories:
- serverless
tags:
- cloud
- websites
- serverless
type: post

---



I have been building websites in the past, but have always been struggling with the slow performance of WordPress. If it is loaded with plugins, it will need quite some resources and can be a pain if you are just developing an idea on a small server. 


Additionally, safety is of concern as well, and as a system that [33,6% of websites are using](https://en.wikipedia.org/wiki/WordPress), it is quite attractive for hackers to find exploits and other issues in it. 
But again, as it is massively popular, there is almost every time a plugin for the issues you are having, which makes it easy to use, and a great "all-in-one" tool.




## Idea 1: Improving WordPress Development



One of the first things I did in the past has been to develop WordPress locally (e.g. [see this AWS post](https://www.smashingmagazine.com/2018/04/wordpress-local-development-beginners-setup-deployment/)), and then just publish the result on a server. Programming and writing speeds increased enormously, but the uploading part proved to be a problem, as WordPress links are usually "hardwired" into the SQL database it uses. Meaning all my links were referring to "https://www.datafotress.cloud" (My Computer) instead of the target domain. There are ways to solve this, like rewriting your URLs in SQL, or using rewriting htaccess rules to refer "old" URLs to the "new" ones, but still, it was a lot of struggle to get going. 




## Idea 2: Online Development with Offloaded Media files



This URL rewriting issue got on my nerves real quick, and local development is bad for multiple developers. That is why I decided to "go online" again, and work "with the cloud". The architecture I followed has been to deploy one development server, that is only accessible to developers, and to upload media files to shared storage (AWS S3) from which end users are pulling the media files. As media files (pictures, videos, ...) are the most demanding parts of WordPress, speed increased drastically, and additionally, it has been easy to set up a CDN on top of it, which basically means the media files are deployed all over the world at unlimited capacity (basically serverless). This means, that one user in e.g. Puerto Rico does not need to access my server in Frankfurt, but has a "local" copy close to him. Additionally, as the "heavy" part of WordPress has been "outsourced", only "small" servers were needed to handle PHP requests and the "back-office" parts of WordPress. Feel free to ask me more about it in the comments or a direct message, or [check out a similar approach by AWS](https://devops.com/hosting-scalable-wordpress-on-aws/).

![Architecture for wordpress on AWS](/images/blog/Webp.net-resizeimage.png)

Together with Autoscaling, this seemed to be the most ideal setup for WordPress, and it proved great. BUT...


You still had to check for Plugin Updates, Security, and Monitoring in general. Even though AWS helps a lot to make this architecture quite resilient and fast, there is still a high operational demand. Additionally, running a separate development, database, load balancing, and so on the server can be quite cost expensive, especially for a website that does not have many users. 
And what did Werner Vogels say at re:invent 2015?

> **"No server is easier to manage than no server"**
> 
> Werner Vogels at re:invent 2015


## Excursion: A brief history of the Code of web




WordPress is great for writers and editors, but form the perspective of a solution architect it is not great. Why? Even though everything is clickable, easy to handle, and so on, all resources and information are pulled from a database in the background, even though if it is pulled for the 100000th time this day. There are methods to reduce the query load on SQL databases, like Redis and Memcached, but why should I "calculate" the same webpage for every single user? "Back in the day", websites did just load in seconds (except someone has been on the phone) and they were super small - what has changed? Together with new design demands, today's websites are full of effects and designs that are heavy on computational resources. Even though this is definitely an improvement to the 90s black and white style, loading times of websites increased dramatically - especially as the world's connection standard is still mobile network. 



To render all the effects, PHP code is used in the background, which is code executed on the server itself. Meaning every time a user connects to a website, the server is calculating the website it is going to show to the user. The 90s version of websites featured just plain HTML code, which are basically simple instructions to the browser on how to handle things. Like the <h1> tag tells the browser this is a heading, and <p> is a paragraph. No (sorry for reducing complexity!) calculations are needed. 



Additionally, Javascript and CSS go a similar path as CSS describes design in a similar approach to HTML, and Javascript is executed not on the server, but on the client-side. Meaning the server does not calculate itself, but "sends instructions" to the client's browser (e.g. your phone). 



So why don't we use just HTML, Javascript, and CSS? PHP enables us to do a lot of things and allows for content creation frameworks like WordPress to make our lives easier. But the efficient way to produce websites would be to generate them once and then just distribute them already rendered to the masses. 





## Idea 4: Going back to the roots 




So am I saying we should go back to the black and white HTML pages of the 90s? Of course not, but the combination of HTML and CSS can produce great results, and Javascript becomes more and more capable to handle processes only PHP could handle in the past. And if calculations are needed, there are great new serverless possibilities available like AWS Lambda (check out my blog for some applications of Lambda). 



Going back to the main topic, I have decided to write my blog and any future websites in plain HTML, CSS, and JS, as I do not need to 

1. **manage a server** - I can just host it for almost free on Github or AWS S3
2. **worry about high-demands**  - S3 and Github scale automatically, meaning if thousands of visitors arrive on my website it will not crash my server
pay much - as I do not need as many calculations as with WordPress, running this blog is completely free
3. **do not need to worry about security issues** - my blog is basically unhackable


Additionally, the website is blazingly fast, with a Google Pagespeed score of 100%, which has a great effect on page ranking as well, as Google favors high-speed websites. The only reason why the current score is down to 90%, is that I decided to include CRM and tracking tools on my blog. When was the last time you saw a free website achieving this score?


All in all, it is just great, but am I writing all the HTML code by myself?





## Introducing: Static Website Generators




Of course not, and luckily there are great tools to handle this for me. Static website builders like [Jekyll](https://jekyllrb.com/) or [Hugo](https://gohugo.io/) help a lot to let you basically just type in Markdown language (basically a simple txt file) and convert your texts into HTML and a nice website. The code is just calculated once and can be uploaded to a server, or Github pages and AWS S3 right away to be completely serverless. [How does it work? Check out my case studies on my blog for an in-depth explanation](/project/serverless-static-website/).





## Summary




It feels great to not worry about uptime, scaling, and security anymore. Is it harder than WordPress? It depends. As this technology just develops, there is a rethinking to be done if you worked with WordPress and others in the past, but again there are many great tools that make static website builders similar to the "known" WordPress environment, like forestry.io for example. How? [Check out my blog at www.datafortress.cloud to see the in-depth explanation](/project/serverless-static-website/). 
For now, I would be interested if you ever tried to go serverless, or what your experiences with WordPress are. [Shoot me a message, or write a comment below](/contact/). 

