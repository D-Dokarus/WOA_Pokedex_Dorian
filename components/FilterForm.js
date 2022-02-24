app.component('filter-form', {
    template: 
    /*html*/
    `<div class="filter-menu">
        <form class="filter-form" @submit.prevent="onSubmit">
            <label>Rechercher un pokémon :</label>
            <input id="name" v-model="name" placeholder="Nom ou N° de pokédex">
            <input class="recherche" type="submit" value="Recherche">
        </form>
        <button class="random-button" @click="changeRandom"> {{ randomButtonText }}</button>
    </div>`,
    data: function() {
      return {
          name: '',
          isRandom: false
      }
    },
    methods: {
        onSubmit() {
            this.$emit('research-pokemon', this.name)
        },
        changeRandom() {
            this.isRandom = !this.isRandom
            this.$emit('change-random', this.name)
        }
    },
    computed: {
        randomButtonText() {
            if(this.isRandom) 
                return "Désactiver l'aléatoire"
            else
                return "Activer l'aléatoire"
        }
    }
  })