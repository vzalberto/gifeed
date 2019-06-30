const output = document.getElementById("response-list");
const searchInput = document.getElementById("search-input");
const TRENDING_URL = "https://api.giphy.com/v1/gifs/trending?api_key=KQzPKVUFZUIpii6iYFGNphMc7ujV6UcR&limit=10";

function showResults(resp) {
        output.innerHTML = "";
        console.log(resp)
        if(resp === undefined){
        	output.innerHTML = "Something went wrong at Giphy's end, please try again with different keywords.";
        	return;
        }
        var items = resp.data;
        animationDelay = 0;
        if (items.length == 0) {
            output.innerHTML = "Nothing was found :(";
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

// Se hace una carga inicial 
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

//Este observable está ligado al <input>
Rx.Observable.fromEvent(searchInput, 'input')
        .pluck('target', 'value')
        // Solo consideramos los términos con 3 o más caracteres, o una cadena vacía para mostrar el top 10
        .filter(searchTerm => searchTerm.length > 2 || searchTerm === "")

        //Este delay ayuda a evitar que se haga una consulta si el usuario continúa escribiendo
        .debounceTime(500)

        //Solo cuando exista un cambio se volvera a consultar a la api
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