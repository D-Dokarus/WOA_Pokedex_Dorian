app.component('pokedex-display', {
    template:
    /*html*/
    `<div class="pokedex-section">
        <filter-form @research-pokemon='getPokemon'></filter-form>
        <div class="pokemons-container">
            <div v-for="(pokemon, index) in pokemons" class="pokemon-tile" v-on:click="pokemonClicked(index)" :class="{pokemonClick: pokemon.clicked, tileRed: index%2, tileBlue: (index+1)%2}">
                <div class="pokemon-left">
                    <img class="pokemon-image" :src="pokemonImage(pokemon)" :alt="pokemon.name"/>
                    <div class="pokemon-description">
                        <h2 class="pokemon-name">{{ pokemonName(pokemon) }}</h2>
                        <h3 class="pokemon-id">{{ pokemonId(pokemon) }}</h3>
                        <p class="pokemon-type">{{ pokemonType(pokemon) }}</p>
                    </div>
                </div>
                <div class="pokemon-right">
                    <p class="pokemon-weight">{{ pokemonWeight(pokemon) }}</p>
                    <p class="pokemon-desc">{{ pokemonDesc(pokemon) }}</p>
                </div>
            </div>
        </div>
        <div class="more-pokemons">
            <button v-on:click="getMorePokemons">Plus de Pokémons</button>
        </div>
    </div>`,
    data: function() {
        return {
            pokeapi: 'https://pokeapi.co/api/v2/',
            language: "fr",
            nbRandom: 6,
            maxId: 898,
            pokemons: [],
            traductionType: {"grass":"Plante", "poison":"Poison", "steel":"Acier", "fairy":"Fée", "fire":"Feu", "ice":"Glace", "rock":"Roche",
                "ground":"Sol", "flying":"Vol", "water":"Eau", "bug":"Insecte", "psychic":"Psy", "dark":"Ténèbres", "dragon":"Dragon",
                "electric":"Electrik", "ghost":"Spectre", "normal":"Normal", "fighting":"Combat"}
        }
    },
    methods: {
        getPokemon(value) {
            if(value)
                this.getPokemonByNameOrId(value)
            else
                this.getRandomPokemons()
        },
        getRandomPokemons() {
            this.pokemons = []
            this.getMorePokemons()
        },
        getMorePokemons() {
            for(let i = 0; i<this.nbRandom; i++) {
                let randId = Math.ceil((Math.random()*this.maxId))
                fetch(this.pokeapi+'pokemon/'+ randId).then((res) => {
                    if(res.ok) {
                        res.json().then((data) => {
                            fetch(this.pokeapi+'pokemon-species/'+ randId).then((res2) => {
                                if(res2.ok) {
                                    res2.json().then((data2) => {
                                        let newData = data
                                        newData.moreData = data2
                                        newData.clicked = false
                                        this.pokemons.push(newData)
                                    })
                                }
                            })
                        })
                    }
                })
                .catch(function(error) {console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message); });
            }
        },
        getPokemonByNameOrId(value) {
            fetch(this.pokeapi+'pokemon/'+ value).then((res) => {
                if(res.ok) {
                    res.json().then((data) => {
                        fetch(this.pokeapi+'pokemon-species/'+ value).then((res2) => {
                            if(res2.ok) {
                                res2.json().then((data2) => {                      
                                    let newData = data
                                    newData.moreData = data2
                                    newData.clicked = false
                                    this.pokemons = []
                                    this.pokemons.push(newData)
                                })
                            }
                        })
                    })
                }
                else alert("Le nom ou l'id du pokémon est mauvais")
            })
            .catch(function(error) { console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message); });
        },
        pokemonImage(pokemon) {
            return pokemon.sprites.other["official\-artwork"].front_default
        },
        pokemonId(pokemon) {
            return "N° "+pokemon.id
        },
        pokemonName(pokemon) {
            return pokemon.moreData.names.find(x => x.language.name == this.language).name
        },
        pokemonType(pokemon) {
            let str = "Type :"
            let compteur = 0
            for(const t of pokemon.types) {
                if(compteur)
                    str += " / "
                else
                    str += " "
                str += this.traductionType[t.type.name]
                compteur++
            }
            return str
        },
        pokemonWeight(pokemon) {
            return "Poids : "+pokemon.weight +" Kg"
        },
        pokemonDesc(pokemon) {
            const entries = pokemon.moreData.flavor_text_entries.filter(x => x.language.name == this.language)
            let entry = entries.find(x => x.version.name == "shield") //Tous les pokémons de la 8ème génération
            if(entry == undefined)
                entry = entries.find(x => x.version.name == "alpha-sapphire") //Pour les autres (car pas tous les pokémons ont été intégrés)

            entry = Object.assign({}, entry).flavor_text; //Car filter retourne un proxy
            return entry
        },
        pokemonClicked(index) {
            this.pokemons[index].clicked = !this.pokemons[index].clicked
        }
        /*capitalize(str) {
            return str.charAt(0).toUpperCase() + str.substring(1)
        }*/
    },
    mounted() {
        this.getRandomPokemons()
    }
  })