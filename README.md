# Gifeed

This simple web application performs one of two operations: query the Giphy API with the provided input, or show the current top 10 gifs if nothing is typed. The challenge here was to avoid using a full sized framework and keep the code as lightweight as possible. That's how I ended up implementing (and getting to know) [RxJS](https://rxjs-dev.firebaseapp.com/).

### Approach to problem

To help me conceptualize the design and subdivide into tasks, I had to ask myself the following questions:

1. What is there?
2. How does it work?
3. How does it look? 


### What is there?
At the very least, there is an input tag and a container for the gifs. The gif elements, which are actually videos in order to avoid watermarks, are created on the fly and appended to the grid after the requests return from Giphy. Thinking about it that way seems obvious, but it does help destructure the application and delegate the element creation to javascript.


### How does it work?
A query to Giphy's Search API is made whenever the user stops typing. If the input tag is left blank, the query will be made to Giphy's Trending API. Such query will also be made right after loading the application for the first time.

Traditionally, I'd go with a Vue or React template project to take care of binding the input tag contents with an AJAX request. However, that sounds and feels like an overkill. I felt like this was the time to finally dip my toes in the world of observables. 

I stumbled upon this post [How to build a search bar with RxJS](https://www.digitalocean.com/community/tutorials/how-to-build-a-search-bar-with-rxjs) and tailored the code to the needs of the project. Since it is a fairly straight forward solution, I had to comment the code in order to soldify my understanding of the new concepts I was dealing with. As one more seasoned frontend developer once told (warned) me, observables will open your mind to new ways of designing and thinking about web applications. Now I can barely, but firmly, confirm that affirmation.


### How does it look?

Returned gifs are laid out in a three column grid with no unnecessary white space as a result of rendering elements with different heights. (a little bit like [Pinterest](https://pinterest.com))

[Masonry](https://masonry.desandro.com/) helps you deal with that kind of requirement. 

### Takeaways

• The simpler the application, the more easily flaws are noticed.

• RxJS is a game changer and I plan to dive deeper into it.

• Masonry may have been too much for this project.


### Nice to haves:

• X Button to clear the input field. It could also have a small label that reads "Top 10".

• Infinite scroll, of course.

• Gradient background?.

• Pinning the search bar to the Masonry grid so that the elements will flow around it.
