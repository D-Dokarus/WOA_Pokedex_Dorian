app.component('pokedex-display', {
    template:
    /*html*/
    `<div class="pokedex-section">
        <filter-form @research-pokemon='getPokemon' @change-random='changeRandom'></filter-form>
        <div class="pokemons-container">
            <div v-for="(pokemon, index) in pokemons" class="pokemon-tile" :class="{pokemonClick: pokemon.clicked}">
                <div class="pokemon-left" @click="pokemonClicked(index)">
                    <img class="pokemon-image" :src="pokemonImage(pokemon)" :alt="pokemon.name"/>
                    <div class="pokemon-description">
                        <h2 class="pokemon-name">{{ pokemonName(pokemon) }}</h2>
                        <h3 class="pokemon-id">{{ pokemonId(pokemon) }}</h3>
                        <p v-for="(type, i) in pokemons[index].types" :class="type.type.name">{{ pokemonType(type) }}</p>
                    </div>
                </div>
                <div class="pokemon-right">
                    <p class="pokemon-english">{{ pokemonEnglish(pokemon) }}</p>
                    <p class="pokemon-height">{{ pokemonHeight(pokemon) }}</p>
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
            eachTime: 18,
            maxId: 898,
            isRandom: false,
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
                                        newData.moreData = data2
                                        newData.clicked = false
                                        resolve(newData)
                                    })
                                }
                            })
                        })
                    }
                    else alert("Le nom ou l'id du pokémon est mauvais")
                })
                .catch(function(error) { console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message); })
            })
        },
        pokemonImage(pokemon) { return pokemon.sprites.other["official-artwork"].front_default },
        pokemonId(pokemon) { return "N° "+pokemon.id },
        pokemonName(pokemon) { return pokemon.moreData.names.find(x => x.language.name == this.language).name },
        pokemonType(type) { return this.capitalize(this.traductionType[type.type.name]) },
        pokemonEnglish(pokemon) { return "Nom anglais : "+pokemon.moreData.names.find(x => x.language.name == "en").name },
        pokemonHeight(pokemon) { return "Taille : "+(pokemon.height)/10.0 +" m" },
        pokemonWeight(pokemon) { return "Poids : "+(pokemon.weight)/10.0 +" Kg" },
        pokemonDesc(pokemon) {
            const entries = pokemon.moreData.flavor_text_entries.filter(x => x.language.name == this.language)
            let entry = ""
            let as = Object.assign({}, entries.find(x => x.version.name == "alpha-sapphire")).flavor_text
            entry += as == undefined ? "" : " "+as
            let or = Object.assign({}, entries.find(x => x.version.name == "omega-ruby")).flavor_text
            entry += or == undefined || or == as? "" : " "+or
            let su = Object.assign({}, entries.find(x => x.version.name == "sun")).flavor_text
            entry += su == undefined ? "" : " "+su
            let mo = Object.assign({}, entries.find(x => x.version.name == "moon")).flavor_text
            entry += mo == undefined || mo == su? "" : " "+mo
            let sh = Object.assign({}, entries.find(x => x.version.name == "shield")).flavor_text
            entry += sh == undefined ? "" : " "+sh
            let sw = Object.assign({}, entries.find(x => x.version.name == "sword")).flavor_text
            entry += sw == undefined || sw == sh? "" : " "+sw

            return entry
        },
        pokemonClicked(index) {
            this.pokemons[index].clicked = !this.pokemons[index].clicked
        },
        sortData() { this.pokemons.sort(function(a, b) {return a.id - b.id;}); },
        capitalize(str) { return str.charAt(0).toUpperCase() + str.substring(1) }
    },
    mounted() {
        this.getMorePokemons()
    }
  })