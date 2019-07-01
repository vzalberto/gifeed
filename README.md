# Gifeed

This simple web application performs one of two operations, query the Giphy API with the provided input or show the current top 10 gifs if nothing is written. The challenge here was to avoid using a full sized framework and keep the code as lightweight as possible. Enter [RxJS](https://rxjs-dev.firebaseapp.com/).

### Approach to problem

To help me conceptualize the design, I asked myself the following questions:

1. What is there?
2. How does it work?
3. How does it look? 


####What is there?
At the very least, there is an input tag and a container for the gifs.

####How does it work?
A query to Giphy's Search API is made whenever the user stops typing. If the input tag is left blank, the query will be made to Giphy's Trending API. Such query will also be made right after loading the application for  the first time.

####How does it look?

Returned gifs are laid out in a three column grid with no unnecessary white space as a result of rendering elements with different heights. (a little bit like [Pinterest](https://pinterest.com))
 

### Nice to haves:

• X Button to clear the input field. It could also have a small label that reads "Top 10".

• Infinite scroll, of course.

• Gradient background.

### Inspiration

[How to build a search bar with RxJS](https://www.digitalocean.com/community/tutorials/how-to-build-a-search-bar-with-rxjs)