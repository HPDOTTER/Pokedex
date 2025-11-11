function cardTemplate(i) {
    if (!pokemons[i] || !pokemons[i].types || pokemons[i].types.length === 0) {
        console.error("Invalid pokemon object:", pokemons[i]);
        return '<div class="error-card">Error loading Pokemon data</div>';
    }

    let pokemon = pokemons[i];
    let firstTypeName = pokemon.types[0]?.type?.name || "normal";
    let pokemonName = pokemon.name || "Unknown";
    let pokemonOrder = pokemon.order || i;
    let pokemonImage = pokemon.sprites?.front_default || "";

    return `
        <div class="card ${firstTypeName}" onclick='openOverlay(${i})'>
            <div class="card-header">#${pokemonOrder} ${
        pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)
    }</div>
            <div class="card-body">
                ${
                    pokemonImage
                        ? `<img src="${pokemonImage}" alt="${pokemonName}" class="card-img">`
                        : '<div class="no-image">No image available</div>'
                }
            </div>
            <div class="card-footer">
                ${pokemon.types
                    .map((typeInfo) => {
                        let typeName = typeInfo?.type?.name;
                        if (!typeName) return "";
                        return `<div class="icon ${typeName}"><img src="imgs/${typeName}.svg" alt="${typeName}" class="elements-icon"></div>`;
                    })
                    .filter((html) => html)
                    .join(" ")}
            </div>
        </div>`;
}

function overlayCardTemplate(i) {
    if (!pokemons[i] || !pokemons[i].types || pokemons[i].types.length === 0) {
        console.error("Invalid pokemon object for overlay:", pokemons[i]);
        return '<div class="error-card">Error loading Pokemon data</div>';
    }

    let pokemon = pokemons[i];
    let firstTypeName = pokemon.types[0]?.type?.name || "normal";
    let pokemonName = pokemon.name || "Unknown";
    let pokemonOrder = pokemon.order || i;
    let pokemonImage = pokemon.sprites?.front_default || "";

    return `
        <div class="overlay-card ${firstTypeName} no-box-shadow">
            <div class="card-header overlay-card-header">#${pokemonOrder} ${
        pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)
    }</div>
            <div class="card-body">
                ${
                    pokemonImage
                        ? `<img src="${pokemonImage}" alt="${pokemonName}" class="card-img">`
                        : '<div class="no-image">No image available</div>'
                }
            </div>
            <div class="card-footer overlay-card-footer">
                ${pokemon.types
                    .map((typeInfo) => {
                        let typeName = typeInfo?.type?.name;
                        if (!typeName) return "";
                        return `<div class="icon ${typeName}"><img src="imgs/${typeName}.svg" alt="${typeName}" class="elements-icon"></div>`;
                    })
                    .filter((html) => html)
                    .join(" ")}
            </div>
            <div class="overlaystats">
                <div class="overlaystatsmenu">
                    <div id="opt1" class="menuoption menuoptionactive">main</div>
                    <div id="opt2" class="menuoption">stats</div>
                    <div id="opt3" class="menuoption">evo chain</div>
                </div>
                <div class="optioninfo" id="optioninfo">
                </div>
            </div>
        </div>`;
}

function showMainstatsTemplate(pokemon) {
    if (!pokemon) {
        return '<div class="error">Pokemon data not available</div>';
    }

    let height = pokemon.height ? `${pokemon.height} m` : "Unknown";
    let weight = pokemon.weight ? `${pokemon.weight} kg` : "Unknown";
    let baseExperience = pokemon.base_experience
        ? `${pokemon.base_experience} xp`
        : "Unknown";
    let abilities =
        pokemon.abilities && pokemon.abilities.length > 0
            ? pokemon.abilities
                  .map((abilityInfo) => abilityInfo?.ability?.name || "Unknown")
                  .join(", ")
            : "None";

    return `
        <div class="main">
            <div class="p-4">Height:</div>
            <div class="p-4">Weight:</div>
            <div class="p-4">Base Experience:</div>
            <div class="p-4">Abilities:</div>
        </div>
        <div class="mainvalue">
            <div class="p-4">${height}</div>
            <div class="p-4">${weight}</div>
            <div class="p-4">${baseExperience}</div>
            <div class="p-4">${abilities}</div>
        </div>`;
}

function showStatsTemplate(pokemon) {
    if (!pokemon || !pokemon.stats || pokemon.stats.length < 6) {
        return '<div class="error">Stats data not available</div>';
    }

    return `
        <div class="optioninfo" id="optioninfo">    
                    <div class="stats">
                        <div class="p-4">HP</div>
                        <div class="p-4">Attack</div>
                        <div class="p-4">Defense</div>
                        <div class="p-4">Special-attack</div>
                        <div class="p-4">Special-defense</div>
                        <div class="p-4">Speed</div>
                    </div>
                    <div class="statsvalue">
                        <div class="progress-bar">
                            <div class="progress" style="width: ${Math.min(
                                pokemon.stats[0]?.base_stat || 0,
                                100
                            )}%"></div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${Math.min(
                                pokemon.stats[1]?.base_stat || 0,
                                100
                            )}%"></div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${Math.min(
                                pokemon.stats[2]?.base_stat || 0,
                                100
                            )}%"></div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${Math.min(
                                pokemon.stats[3]?.base_stat || 0,
                                100
                            )}%"></div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${Math.min(
                                pokemon.stats[4]?.base_stat || 0,
                                100
                            )}%"></div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${Math.min(
                                pokemon.stats[5]?.base_stat || 0,
                                100
                            )}%"></div>
                        </div>
                    </div>`;
}
