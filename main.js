const app = Vue.createApp({
    data: function() {
        return {
            searchValue: ''
        }
    },
    methods: {
        searchPokemon(value){
            this.searchValue = value
        }
    }
})