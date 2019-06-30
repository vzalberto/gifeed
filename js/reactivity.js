const output = document.getElementById("response-list");
function showResults(resp) {
        output.innerHTML = "";
        console.log(resp)
        if(resp === undefined){
        	output.innerHTML = "Intenta de nuevo :)";
        	return;
        }
        var items = resp.data;
        animationDelay = 0;
        if (items.length == 0) {
            output.innerHTML = "No encontramos gifs :(";
        } else {
            items.forEach(item => {
                resultItem = `
                        <div class="animated fadeInUp" style="animation-delay: ${animationDelay}s">
                        <a href="${item.url}" target="_blank">
                        <video autoplay loop>
                            <source src="${item.images.fixed_width_small.mp4}" type="video/mp4">
                            <p>Your browser does not support the video tag.</p>
                        </video>
                        </a>
                `;
                output.insertAdjacentHTML("beforeend", resultItem);
                animationDelay += 0.1;

            });
        }
}

    const TRENDING_URL = "https://api.giphy.com/v1/gifs/trending?api_key=KQzPKVUFZUIpii6iYFGNphMc7ujV6UcR&limit=12";

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

    let searchInput = document.getElementById("search-input");
    Rx.Observable.fromEvent(searchInput, 'input')
        .pluck('target', 'value')
        .filter(searchTerm => searchTerm.length > 2 || searchTerm === "")
        .debounceTime(500)
        .distinctUntilChanged()
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