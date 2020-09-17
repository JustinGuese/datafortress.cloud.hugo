+++
bg_image = "/images/blog/serverless-website.png"
case_study = ""
category = "cloud"
description = "Building a serverless, unhackable high-speed website"
image = "/images/blog/serverless-website.png"
live_demo = ""
title = "DataFortress.cloud"
[[overview]]
label = "Client"
data = "Myself"
[[overview]]
label = "Time"
data = "2020"

+++

# Why not WordPress?


To give a further explanation as to why I chose to run this blog completely serverless, [please check out my article first](/blog/wordpress-to-serverless-highspeed-scalable-unhackable/).


I did not want to use famous CMS WordPress for my blog, as it is: 
- **Heavy on the computational resources** - code is calculated for every single user coming to the website, even if it is the same content
Hard to secure - even though there are great plugins, but a system that [33% of the web](https://en.wikipedia.org/wiki/WordPress) is running on remains really tempting for hackers. 
- **Using hardwired links** - Links are hardwired into the database, which makes domain changes horrible
- **PHP** - the programming language that just developed instead of being planned
Hard to maintain - WordPress is famous to break sites at updates, especially if plugins are not maintained anymore


Is everything about WordPress bad? No of course not. For some applications it is great, and there are ways to handle the negative points above - see my case study about the international information website I programmed as an example. 

But as I am the only editor of the blog, and updates are infrequent, and I do not want to worry at all about uptimes, scaling, and security, I chose to go with a serverless approach. 


# Going serverless


But how is it possible to run a website serverless? Of course, I am not coding every single website in plain HTML. There are great static website builders out there like [Jekyll](https://jekyllrb.com/) or [Hugo](https://gohugo.io/), which use plain text input to create a nice looking website. The progress is similar to [LaTeX](https://www.latex-project.org/) if you ever used it, where you have to code and design a website once, and then just "reuse" the template for your text input every time. There are many [templates to choose from](https://themes.gohugo.io/), and they are easy to create - just shoot me a message if you will need help. 


## Hosting the HTML code

And what am I doing with the HTML code? The traditional approach would be to host the code on a server running apache or nginx, but luckily there are several tools that allow for serverless hosting of plain HTML like [Github Pages](https://pages.github.com/) or [AWS S3](https://aws.amazon.com/s3/). I chose the former because I can do version control of my website and hosting at the same time. I did something that broke my website? No problem, I can easily go back to the previous version. But what if I break a setting or database? Not possible, as both services are serverless, and I only feed them the code. When was the last time you were searching for an error on your website whilst your boss or customers were angry about the downtime? I am more than relieved to announce that I do not need to worry about that anymore. 

My typical workflow is to check the website for errors running a local test server that is included in Hugo and to push the commit to the Github Repo if everything looks fine. Afterward, the changes are automatically published to the Github Pages. 

## Combining WordPress and Static Website Generators

If you are not the coding type of person, it is easy to import your Hugo project into a CMS specifically built for this purpose, like https://forestry.io/. No coding required, once a website is set up, and you are able to just type and drag and drop media as you used to in WordPress, no coding required.  How do you set it up? [Shoot me a message and I can help you](https://www.datafortress.cloud/contact/). 


I can only urge everyone to go serverless with their websites, as it is cheaper (this website does not cost me a single cent), way easier to manage, and scales automatically. Even if a million visitors read my blog it will still be as fast as always, and I will not get panicked calls that a server is down. 
Are you interested in going serverless? [Shoot me a message, or leave a comment below](https://www.datafortress.cloud/contact/). 

