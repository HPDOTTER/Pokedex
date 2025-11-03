let offset = 0;
let pokemons =[];
let debounceTimeout;

function init() {
    displayData();
}

const base_Url = "https://pokeapi.co/api/v2/pokemon";

async function displayData() {
    let data = document.getElementById("data");
    let loadingSpinner = document.getElementById("loading-spinner");
    pokemons = [];

    loadingSpinner.style.display = "flex";
    data.style.display = "none";

    let response = await fetch(`${base_Url}?limit=20&offset=${offset}`); 
    let pokemonList = await response.json();
    data.innerHTML = "";
    for (let i = 0; i < pokemonList.results.length; i++) {
        await fetchAndDisplay(pokemonList, i, data);
    }

    loadingSpinner.style.display = "none";
    data.style.display = "flex";
}


async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 10000 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
        ...options,
        signal: controller.signal
    });
    clearTimeout(id);
    return response;
}

async function getMore() {
    let data = document.getElementById("data");
    let loadingSpinner = document.getElementById("loading-spinner");
    offset += 20;
    loadingSpinner.style.display = "flex";
    document.getElementById("button").style.display = "none";
    document.getElementById("loading-spinner").style.minHeight = "30vh";
    
    let response = await fetchWithTimeout(`${base_Url}?limit=20&offset=${offset}`);
    let pokemonList = await response.json();
    for (let i = 0; i < pokemonList.results.length; i++) {
        await fetchAndDisplay(pokemonList, i, data);
    }
    loadingSpinner.style.display = "none";
    document.getElementById("button").style.display = "block";
}

async function fetchAndDisplay(pokemonList, i, data) {
    let pokemonDetails = await fetchWithTimeout(pokemonList.results[i].url);
    let pokemon = await pokemonDetails.json();
    pokemons.push(pokemon);
    data.innerHTML += cardTemplate(i + offset, pokemon);
}

function debounce(func, delay) {
    return function() {
        let context = this;
        let args = arguments;
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => func.apply(context, args), delay);
    };
}

const search = debounce(async function() {
    let search = document.getElementById("search").value.toLowerCase();
    let data = document.getElementById("data");
    let loadingSpinner = document.getElementById("loading-spinner");
    document.getElementById("loading-spinner").style.minHeight = "100vh";
    pokemons = [];
    document.getElementById("button").style.display = "none";
    loadingSpinner.style.display = "flex";
    data.style.display = "none";

    data.innerHTML = "";
    if (search === "") {
        await resetDisplayData();
    } else {
        await fetchAndDisplayFilteredResults(search);
    }
}, 300);

async function resetDisplayData() {
    await displayData();
    document.getElementById("loading-spinner").style.display = "none";
    document.getElementById("data").style.display = "flex";
    document.getElementById("button").style.display = "block";
}

async function fetchAndDisplayFilteredResults(search) {
    let response = await fetch(`${base_Url}?limit=1300`);
    let pokemonList = await response.json();
    let filteredResults = pokemonList.results.filter(p => p.name.includes(search));
    
    if (filteredResults.length === 0) {
        document.getElementById("data").innerHTML = "<h2 style=\"color: white\">No Pokemon found</h2>";
    } else {
        await Promise.all(filteredResults.map(async (result) => {
            let pokemonDetails = await fetch(result.url);
            let pokemon = await pokemonDetails.json();
            pokemons.push(pokemon);
            document.getElementById("data").innerHTML += cardTemplate(pokemons.length - 1, pokemon);
        }));
    }
    document.getElementById("loading-spinner").style.display = "none";
    document.getElementById("data").style.display = "flex";
}

function openOverlay(i) {
    let overlay = document.getElementById("overlay");
    overlay.classList.toggle("d-flex");
    if (overlay.classList.contains("d-flex")) {
        document.body.classList.add("no-scroll");
    } 
    overlay.addEventListener('click', (event) => closeOverlay(event, overlay));
    overlay.innerHTML = "";
    overlay.innerHTML += overlayCardTemplate(i);
    onClickMenuOption(i);
    main(pokemons[i]);
}

function closeOverlay(event, overlay) {
    if (event.target === overlay) {
        overlay.classList.remove("d-flex");
        document.body.classList.remove("no-scroll");
    }
}

function onClickMenuOption(i) {
    ["opt1", "opt2", "opt3"].forEach((opt, index) => {
        document.getElementById(opt).addEventListener("click", function() {
            [main, stats, evoChain][index](pokemons[i]);
            document.querySelectorAll(".menuoptionactive").forEach(element => element.classList.remove("menuoptionactive"));
            document.getElementById(opt).classList.add("menuoptionactive");
        });
    });
}

function main(i) {
    document.getElementById("optioninfo").innerHTML = showMainstatsTemplate(i);
}

function stats(i) {
    document.getElementById("optioninfo").innerHTML = showStatsTemplate(i);
}

async function evoChain(pokemon) {
    let optioninfo = document.getElementById("optioninfo");
    optioninfo.innerHTML = "One moment please...";
    let speciesData = await (await fetch(pokemon.species.url)).json();
    let evolutionData = await (await fetch(speciesData.evolution_chain.url)).json();
    optioninfo.innerHTML = await showEvoChainTemplate(evolutionData.chain);
}

async function showEvoChainTemplate(chain) {
    let evoChainHtml = '<div class="evochain">';
    while (chain) {
        let { name: pokemonName } = chain.species;
        let { sprites: { front_default: pokemonImage } } = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)).json();
        evoChainHtml += `<div><h4>${pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}</h4><img class="evochainimg" src="${pokemonImage}" alt="${pokemonName}"></div>`;
        if (chain.evolves_to.length > 0) {
            evoChainHtml += '<div class="arrow">→</div>';
            chain = chain.evolves_to[0];
        } else {
            chain = null;
        }
    }
    evoChainHtml += '</div>';
    return evoChainHtml;
}


