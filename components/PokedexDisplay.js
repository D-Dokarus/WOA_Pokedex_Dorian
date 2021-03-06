app.component('pokedex-display', {
    template:
    /*html*/
    `<div class="pokedex-section">
        <filter-form @research-pokemon='getPokemon' @change-random='changeRandom' @filter-search='filterPokemons'></filter-form>

        <pokemon-details v-show="idPokemonDetail > -1" @closeDetail='pokemonClicked' :pokemonData="Object.assign({},pokemonDetails)"></pokemon-details>
        <div v-show="idPokemonDetail < 0" class="pokemons-container">
            <div v-for="(pokemon, index) in pokemons" v-show="!pokemon.hidden" class="pokemon-tile" @click="pokemonClicked(index)">
                    <img class="pokemon-image" :src="pokemonImage(pokemon)" :alt="pokemon.name"/>
                    <div class="pokemon-description">
                        <h2>{{ pokemonName(pokemon) }}</h2>
                        <h3>{{ pokemonId(pokemon) }}</h3>
                        <p v-for="(type, i) in pokemons[index].types" :class="type.type.name">{{ pokemonType(type) }}</p>
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
            eachTime: 18,
            maxId: 898,
            isRandom: false,
            pokemonDetails: [],
            idPokemonDetail: -1,
            currentId: 1,
            pokemons: [],
            traductionType: {"grass":"Plante", "poison":"Poison", "steel":"Acier", "fairy":"Fée", "fire":"Feu", "ice":"Glace", "rock":"Roche",
                "ground":"Sol", "flying":"Vol", "water":"Eau", "bug":"Insecte", "psychic":"Psy", "dark":"Ténèbres", "dragon":"Dragon",
                "electric":"Electrik", "ghost":"Spectre", "normal":"Normal", "fighting":"Combat"}
        }
    },
    methods: {
        changeRandom() {
            this.isRandom = !this.isRandom
            this.currentId = 1
            this.pokemons = []
            this.getMorePokemons()
        },
        filterPokemons(value) {
            if(value.length > 0 && !isNaN(value)) {
                const id = parseInt(value)
                for(let pokemon of this.pokemons) {
                    pokemon.hidden = pokemon.id != id
                }
            }
            else {
                for(let pokemon of this.pokemons) {
                    pokemon.hidden = !pokemon.name.toLowerCase().includes(value)
                }
            }
        },
        getPokemon(value) {
            if(value)
                this.getOnePokemon(value)
            else {
                this.pokemons = []
                this.getMorePokemons()
            }
        },
        getMorePokemons() {
            if(this.isRandom)
                this.getRandomPokemons()
            else
                this.getOrderPokemons()
        },
        getOrderPokemons() {
            for(let i = this.currentId; i<this.currentId+this.eachTime; i++)
                this.getPokemonByValue(i)
            this.currentId += this.eachTime
        },
        getRandomPokemons() {
            for(let i = 0; i<this.eachTime; i++) {
                let randId = Math.ceil((Math.random()*this.maxId))
                this.getPokemonByValue(randId)
            }
        },
        getPokemonByValue(value) {
            this.fetchByValue(value).then((data) => {                 
                this.pokemons.push(data)
                if(!this.isRandom)
                    this.sortData()
            })
        },
        getOnePokemon(value) {
            this.fetchByValue(value).then((data) => {             
                this.pokemons = []
                this.pokemons.push(data)
                this.currentId = parseInt(value)+1
            })
        },
        async fetchByValue(value) {
            return new Promise((resolve, reject) => {
                fetch(this.pokeapi+'pokemon/'+ value).then((res) => {
                    if(res.ok) {
                        res.json().then((data) => {
                            fetch(this.pokeapi+'pokemon-species/'+ value).then((res2) => {
                                if(res2.ok) {
                                    res2.json().then((data2) => {                      
                                        let newData = data
                                        newData.name = data2.names.find(x => x.language.name == this.language).name
                                        newData.moreData = data2
                                        newData.clicked = false
                                        newData.hidden = false
                                        resolve(newData)
                                    })
                                }
                            })
                        })
                    }
                    else alert("Le nom ou l'id du pokémon est mauvais")
                })
                .catch(error => { console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message); })
            })
        },
        pokemonImage(pokemon) { return pokemon.sprites.other["official-artwork"].front_default },
        pokemonId(pokemon) { return "N° "+pokemon.id },
        pokemonName(pokemon) { return pokemon.name },
        pokemonType(type) { return this.capitalize(this.traductionType[type.type.name]) },
        pokemonClicked(index) {
            this.idPokemonDetail = index
            if(index)
                this.pokemonDetails = this.pokemons[index]
            else
                this.pokemonDetails = []
        },
        sortData() { this.pokemons.sort(function(a, b) {return a.id - b.id;}); },
        capitalize(str) { return str.charAt(0).toUpperCase() + str.substring(1) }
    },
    mounted() {
        this.getMorePokemons()
    }
  })