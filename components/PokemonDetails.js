app.component('pokemon-details', {
    template:
    /*html*/
    `<div class="pokemon-details">
            <img class="cross" src="./assets/images/cross.png" alt="back" @click="crossClicked()"/>
            <div class="container-details">
                <div class="pokemon-left">
                    <img class="pokemon-image" :src="pokemonImage()" :alt="pokemonName()"/>
                    <div class="pokemon-description">
                        <h2>{{ pokemonName() }}</h2>
                        <h3>{{ pokemonId() }}</h3>
                        <p v-for="(type, i) in pokemonTypes()" :class="type.type.name">{{ pokemonType(type) }}</p>
                    </div>
                </div>
                <div class="pokemon-right">
                    <p class="pokemon-english">{{ pokemonEnglish() }}</p>
                    <p class="pokemon-height">{{ pokemonHeight() }}</p>
                    <p class="pokemon-weight">{{ pokemonWeight() }}</p>
                    <p class="pokemon-desc">{{ pokemonDesc() }}</p>
                </div>
            </div>
        </div>`,
    props: {
        pokemonData: {
            type: Object,
            required: false
          }
    },
    data: function() {
        return {
            language: "fr",
            traductionType: {"grass":"Plante", "poison":"Poison", "steel":"Acier", "fairy":"Fée", "fire":"Feu", "ice":"Glace", "rock":"Roche",
                "ground":"Sol", "flying":"Vol", "water":"Eau", "bug":"Insecte", "psychic":"Psy", "dark":"Ténèbres", "dragon":"Dragon",
                "electric":"Electrik", "ghost":"Spectre", "normal":"Normal", "fighting":"Combat"}
        }
    },
    methods: {
        crossClicked() {
            this.$emit('closeDetail', -1)
        },
        pokemonImage() { return this.pokemonData.name ? this.pokemonData.sprites.other["official-artwork"].front_default : "" },
        pokemonId() { return this.pokemonData.name ? "N° "+this.pokemonData.id : "" },
        pokemonName() { return this.pokemonData.name ? this.pokemonData.name : "" },
        pokemonTypes() { return this.pokemonData.name ? this.pokemonData.types : []},
        pokemonType(type) { return this.capitalize(this.traductionType[type.type.name]) },
        pokemonEnglish() { return this.pokemonData.name ? "Nom anglais : "+this.pokemonData.moreData.names.find(x => x.language.name == "en").name : "" },
        pokemonHeight() { return this.pokemonData.name ? "Taille : "+(this.pokemonData.height)/10.0 +" m" : ""},
        pokemonWeight() { return this.pokemonData.name ? "Poids : "+(this.pokemonData.weight)/10.0 +" Kg" : ""},
        pokemonDesc() {
            if(this.pokemonData.name) {
                const entries = this.pokemonData.moreData.flavor_text_entries.filter(x => x.language.name == this.language)
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
            }
            else return ""
        },
        capitalize(str) { return str.charAt(0).toUpperCase() + str.substring(1) }
    }
  })