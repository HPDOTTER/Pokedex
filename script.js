let offset = 0;
let pokemons = [];
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
        signal: controller.signal,
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

    let response = await fetchWithTimeout(
        `${base_Url}?limit=20&offset=${offset}`
    );
    let pokemonList = await response.json();
    for (let i = 0; i < pokemonList.results.length; i++) {
        await fetchAndDisplay(pokemonList, i, data);
    }
    loadingSpinner.style.display = "none";
    document.getElementById("button").style.display = "block";
}

async function fetchAndDisplay(pokemonList, i, data) {
    try {
        if (!pokemonList.results[i] || !pokemonList.results[i].url) {
            console.error(
                `Invalid pokemon data at index ${i}:`,
                pokemonList.results[i]
            );
            return;
        }

        let pokemonDetails = await fetchWithTimeout(pokemonList.results[i].url);
        if (!pokemonDetails.ok) {
            console.error(
                `Failed to fetch pokemon details: ${pokemonDetails.status}`
            );
            return;
        }

        let pokemon = await pokemonDetails.json();
        if (!pokemon || !pokemon.types || pokemon.types.length === 0) {
            console.error(`Invalid pokemon object:`, pokemon);
            return;
        }

        pokemons.push(pokemon);
        data.innerHTML += cardTemplate(i + offset, pokemon);
    } catch (error) {
        console.error(`Error fetching pokemon at index ${i}:`, error);
    }
}

function debounce(func, delay) {
    return function () {
        let context = this;
        let args = arguments;
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => func.apply(context, args), delay);
    };
}

const search = debounce(async function () {
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
    let filteredResults = pokemonList.results.filter((p) =>
        p.name.includes(search)
    );

    if (filteredResults.length === 0) {
        document.getElementById("data").innerHTML =
            '<h2 style="color: white">No Pokemon found</h2>';
    } else {
        await Promise.all(
            filteredResults.map(async (result) => {
                try {
                    if (!result || !result.url) {
                        console.error("Invalid result:", result);
                        return;
                    }

                    let pokemonDetails = await fetch(result.url);
                    if (!pokemonDetails.ok) {
                        console.error(
                            `Failed to fetch pokemon details: ${pokemonDetails.status}`
                        );
                        return;
                    }

                    let pokemon = await pokemonDetails.json();
                    if (
                        !pokemon ||
                        !pokemon.types ||
                        pokemon.types.length === 0
                    ) {
                        console.error(`Invalid pokemon object:`, pokemon);
                        return;
                    }

                    pokemons.push(pokemon);
                    document.getElementById("data").innerHTML += cardTemplate(
                        pokemons.length - 1,
                        pokemon
                    );
                } catch (error) {
                    console.error("Error fetching filtered pokemon:", error);
                }
            })
        );
    }
    document.getElementById("loading-spinner").style.display = "none";
    document.getElementById("data").style.display = "flex";
}

function openOverlay(i) {
    if (!pokemons[i] || !pokemons[i].types || pokemons[i].types.length === 0) {
        console.error("Cannot open overlay: Invalid pokemon data at index", i);
        return;
    }

    let overlay = document.getElementById("overlay");
    overlay.classList.toggle("d-flex");
    if (overlay.classList.contains("d-flex")) {
        document.body.classList.add("no-scroll");
    }
    overlay.addEventListener("click", (event) => closeOverlay(event, overlay));
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
        document.getElementById(opt).addEventListener("click", function () {
            [main, stats, evoChain][index](pokemons[i]);
            document
                .querySelectorAll(".menuoptionactive")
                .forEach((element) =>
                    element.classList.remove("menuoptionactive")
                );
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

    try {
        if (!pokemon || !pokemon.species || !pokemon.species.url) {
            optioninfo.innerHTML = "Evolution data not available";
            return;
        }

        let speciesResponse = await fetch(pokemon.species.url);
        if (!speciesResponse.ok) {
            throw new Error(
                `Failed to fetch species data: ${speciesResponse.status}`
            );
        }

        let speciesData = await speciesResponse.json();
        if (!speciesData.evolution_chain || !speciesData.evolution_chain.url) {
            optioninfo.innerHTML = "Evolution data not available";
            return;
        }

        let evolutionResponse = await fetch(speciesData.evolution_chain.url);
        if (!evolutionResponse.ok) {
            throw new Error(
                `Failed to fetch evolution data: ${evolutionResponse.status}`
            );
        }

        let evolutionData = await evolutionResponse.json();
        optioninfo.innerHTML = await showEvoChainTemplate(evolutionData.chain);
    } catch (error) {
        console.error("Error fetching evolution chain:", error);
        optioninfo.innerHTML = "Error loading evolution data";
    }
}

async function showEvoChainTemplate(chain) {
    let evoChainHtml = '<div class="evochain">';

    while (chain) {
        try {
            if (!chain.species || !chain.species.name) {
                console.error("Invalid chain species:", chain);
                break;
            }

            let pokemonName = chain.species.name;
            let pokemonResponse = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
            );

            if (!pokemonResponse.ok) {
                console.error(
                    `Failed to fetch pokemon ${pokemonName}: ${pokemonResponse.status}`
                );
                evoChainHtml += `<div><h4>${
                    pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)
                }</h4><div class="error">Image not available</div></div>`;
            } else {
                let pokemonData = await pokemonResponse.json();
                let pokemonImage = pokemonData.sprites?.front_default || "";

                if (pokemonImage) {
                    evoChainHtml += `<div><h4>${
                        pokemonName.charAt(0).toUpperCase() +
                        pokemonName.slice(1)
                    }</h4><img class="evochainimg" src="${pokemonImage}" alt="${pokemonName}"></div>`;
                } else {
                    evoChainHtml += `<div><h4>${
                        pokemonName.charAt(0).toUpperCase() +
                        pokemonName.slice(1)
                    }</h4><div class="error">Image not available</div></div>`;
                }
            }

            if (chain.evolves_to && chain.evolves_to.length > 0) {
                evoChainHtml += '<div class="arrow">→</div>';
                chain = chain.evolves_to[0];
            } else {
                chain = null;
            }
        } catch (error) {
            console.error("Error processing evolution chain:", error);
            break;
        }
    }

    evoChainHtml += "</div>";
    return evoChainHtml;
}
