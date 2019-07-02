const output = document.getElementById("response-list");
const searchInput = document.getElementById("search-input");
const TRENDING_URL = "https://api.giphy.com/v1/gifs/trending?api_key=KQzPKVUFZUIpii6iYFGNphMc7ujV6UcR&limit=10";

//This function handles Giphy's responses, wether they come from Trending or Search.
function showResults(resp) {

        //The API calls seem to randomly fail due to CORS configuration on Giphy's server, we need to handle that.
        output.innerHTML = "";
        if(resp === undefined){
        	output.innerHTML = "Something went wrong at Giphy's end 🙉, please try again with different keywords 🙊.";
        	return;
        }

        var items = resp.data;

        if (items.length == 0) {
            output.innerHTML = "Nothing was found 🙃";
        } else {

            //This element is needed for Masonry-Bootstrap solution https://masonry.desandro.com/extras.html#bootstrap
            output.insertAdjacentHTML("beforeend", "<div class='grid-sizer col-xs-4'></div>");

            //Following lines will create a .grid-item element and insert it to the HTML
            items.forEach(item => {

                resultItem = `
                        <div class="grid-item col-xs-4">
                            <div class="grid-item-content">
                                <a href="${item.url}" target="_blank">
                                    <video autoplay loop>
                                        <source src="${item.images.fixed_width_small.mp4}" type="video/mp4">
                                        <p>Your browser does not support the video tag.</p>
                                    </video>
                                </a>
                            </div>
                        </div>
                `;
                output.insertAdjacentHTML("beforeend", resultItem);
            }
            );
        }

        //A new Masonry instance is created. This is not optimal. Here's when I realized that using Masonry may have been an overkill.
        var msnry = new Masonry( '.grid', {
          itemSelector: '.grid-item',
          columnWidth: '.grid-sizer',
          percentPosition: true,
          transitionDuration: 0,
          initLayout: false,
        });
        msnry.layout();
}

// This observable triggers an initial load of gifs as soon as the page loads.
Rx.Observable.ajax(TRENDING_URL)
	.map(resp => ({
	        "status": resp["status"] == 200,
	        "details": resp["status"] == 200 ? resp["response"] : [],
	        "result_hash": Date.now()
	    })
	)

	.catch(err => Rx.Observable.of({err})
	)
	.filter(resp => resp.status !== false)
	.subscribe(resp => showResults(resp.details));

//This observable is tied to the input element and it is the heart of the application.
Rx.Observable.fromEvent(searchInput, 'input')
        .pluck('target', 'value')

        // We only take into account search terms with 3 or more characters. Empty strings are used to trigger the top 10 trending query.
        .filter(searchTerm => searchTerm.length > 2 || searchTerm === "")

        //This delay helps prevent queries from happening if the user isn't done typing.
        .debounceTime(500)

        //A new request will occur only if the search terms are different.
        .distinctUntilChanged()

        // The main difference between RxJS's map and  switchMap is that the latter allows us to return an observable.
        .switchMap(searchKey => 
        	searchKey !== "" ? 
        	Rx.Observable.ajax(`https://api.giphy.com/v1/gifs/search?api_key=KQzPKVUFZUIpii6iYFGNphMc7ujV6UcR&q=${searchKey}&limit=12`)
            .map(resp => ({
                    "status": resp["status"] == 200,
                    "details": resp["status"] == 200 ? resp["response"] : [],
                    "result_hash": Date.now()
                })
            )

	        .catch(err => Rx.Observable.of({err})
	        )

         : Rx.Observable.ajax(TRENDING_URL)
            .map(resp => ({
                    "status": resp["status"] == 200,
                    "details": resp["status"] == 200 ? resp["response"] : [],
                    "result_hash": Date.now()
                })
            )

	        .catch(err => Rx.Observable.of({err})
	        )
	
        )
        .catch(err => Rx.Observable.of({err}))
        .filter(resp => resp.status !== false)
        .distinctUntilChanged((a, b) => a.result_hash === b.result_hash)
        .subscribe(resp => showResults(resp.details));