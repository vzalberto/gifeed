function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            callback(xmlHttp.responseText);
        }
    }
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
}

function renderGridElement(el)
{
	const src = el.images.fixed_width_small.mp4;

	let video = document.createElement("video");
	video.setAttribute("autoplay", "true");
	video.setAttribute("loop", "true");

	let source = video.appendChild(document.createElement("source"));
	source.setAttribute("src", src);

	return video;
}

function createGridElements(raw)
{
	const gifs = JSON.parse(raw).data;
	let grid = document.getElementById("hola");

	const elements = gifs.map(renderGridElement);
	elements.forEach((el)=>grid.appendChild(el));

}

{
	const url = "https://api.giphy.com/v1/gifs/trending?api_key=KQzPKVUFZUIpii6iYFGNphMc7ujV6UcR&limit=12&rating=G";

	httpGetAsync(url, createGridElements);
}