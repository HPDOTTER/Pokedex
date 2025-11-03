function cardTemplate(i) {
    if (!pokemons[i] || !pokemons[i].types) {
        console.error("Invalid pokemon object:", pokemons[i]);
    }
    let firstTypeName = pokemons[i].types[0].type.name;
    return `
        <div class="card ${firstTypeName}" onclick='openOverlay(${i})'>
            <div class="card-header">#${pokemons[i].order || i} ${pokemons[i].name.charAt(0).toUpperCase() + pokemons[i].name.slice(1)}</div>
            <div class="card-body">
                <img src="${pokemons[i].sprites.front_default}" alt="${pokemons[i].name}" class="card-img">
            </div>
            <div class="card-footer">
                ${pokemons[i].types.map(typeInfo => {
                    let typeName = typeInfo.type.name;
                    return `<div class="icon ${typeName}"><img src="imgs/${typeName}.svg" alt="${typeName}" class="elements-icon"></div>`;
                }).join(' ')}
            </div>
        </div>`;
}

function overlayCardTemplate(i) {
    let firstTypeName = pokemons[i].types[0].type.name;
    return `
        <div class="overlay-card ${firstTypeName} no-box-shadow">
            <div class="card-header overlay-card-header">#${pokemons[i].order || i} ${pokemons[i].name.charAt(0).toUpperCase() + pokemons[i].name.slice(1)}</div>
            <div class="card-body">
                <img src="${pokemons[i].sprites.front_default}" alt="${pokemons[i].name}" class="card-img">
            </div>
            <div class="card-footer overlay-card-footer">
                ${pokemons[i].types.map(typeInfo => {
                    let typeName = typeInfo.type.name;
                    return `<div class="icon ${typeName}"><img src="imgs/${typeName}.svg" alt="${typeName}" class="elements-icon"></div>`;
                }).join(' ')}
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


function showMainstatsTemplate(pokemon) q   {
    return `
        <div class="main">
            <div class="p-4">Height:</div>
            <div class="p-4">Weight:</div>
            <div class="p-4">Base Experience:</div>
            <div class="p-4">Abilities:</div>
        </div>
        <div class="mainvalue">
            <div class="p-4">${pokemon.height} m</div>
            <div class="p-4">${pokemon.weight} kg</div>
            <div class="p-4">${pokemon.base_experience} xp</div>
            <div class="p-4">${pokemon.abilities.map(abilityInfo => abilityInfo.ability.name).join(', ')}</div>
        </div>`;
}

function showStatsTemplate(pokemon) {
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
                            <div class="progress" style="width: ${pokemon.stats[0].base_stat}%"></div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${pokemon.stats[1].base_stat}%"></div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${pokemon.stats[2].base_stat}%"></div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${pokemon.stats[3].base_stat}%"></div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${pokemon.stats[4].base_stat}%"></div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${pokemon.stats[5].base_stat}%"></div>
                        </div>
                    </div>`;
}

