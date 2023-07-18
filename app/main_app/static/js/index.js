const app = Vue.createApp({
    compilerOptions: {
        delimiters: ["[[", "]]"]
    },
    data() {
        return {
            marketList: [],
            wishList: {},
            isOpen: false,
            addWish_: false,
            addMarket_: false,
            changeObject: {},
            wishName: '',
            marketName: '',
            changedMarket: ''
        }
    },
    methods: {
        openModal(key, name) {
            console.log(key)
            console.log(name)
            if (key == 'market') {
                this.addMarket_ = true
            }
            else {
                this.changedMarket = name
                this.addWish_ = true
            }

            this.isOpen = true
        },

        addWish(market) {
            let graph_query = 
            `mutation AddWish { 
                createWish(name: "${this.wishName}", marketName: "${market}") { 
                    wish { 
                        id 
                        name 
                        market { 
                            name 
                        } 
                    } 
                } 
            }`

            let vapp = this
            axios.post('/graphql', 
                { 
                    query: graph_query
                }
            )
            .then(function (response) {
                console.log(response)
                let wish = response.data.data.createWish.wish

                if (vapp.wishList[`${market}`]) {
                    vapp.wishList[`${market}`].push({'id': wish.id, 'name': wish.name})
                }
                else {
                    vapp.wishList[`${market}`] = [{'id': wish.id, 'name': wish.name}]
                }
                vapp.wishName = ''
            })
            .catch(function (error) {
                console.log(error)
            })
            
            this.isOpen = false
            this.addWish_ = false
        },

        addMarket(event) {
            let graph_query = 
            `mutation AddMarket { 
                createMarket(name: "${this.marketName}") { 
                    market { 
                        name 
                    } 
                } 
            }`
            
            let vapp = this
            axios.post('/graphql', 
                { 
                    query: graph_query
                }
            )
            .then(function (response) {
                console.log(response)
                if (response.data.data.createMarket !== null) {
                    vapp.marketList.push(vapp.marketName)
                }
                vapp.marketName = ''
            })
            .catch(function (error) {
                console.log(error)
            })

            this.isOpen = false
            this.addMarket_ = false
        },

        deleteWish(wish, market) {
            let vapp = this
            let graph_query = 
            `mutation Delete { 
                deleteWish (id: ${wish.id}) { 
                    wish { 
                        id 
                    } 
                } 
            }`

            axios.post('/graphql', 
                { 
                    query: graph_query
                }
            )
            .then(function (response) {
                console.log(response)
                let newList = vapp.wishList[`${market}`].filter(function (prev) {
                    return prev.id !== wish.id
                })
                vapp.wishList[`${market}`] = newList
            })
            .catch(function (error) {
                console.log(error)
            })
        },

        deleteMarket(market) {
            let vapp = this
            let graph_query = 
            `mutation Delete { 
                deleteMarket (name: "${market}") { 
                    market { 
                        name 
                    } 
                } 
            }`

            axios.post('/graphql', 
                { 
                    query: graph_query
                }
            )
            .then(function (response) {
                console.log(response)
                let newList = vapp.marketList.filter(function (prev) {
                    return prev !== market
                })
                vapp.marketList = newList
            })
            .catch(function (error) {
                console.log(error)
            })
        },

        editWish(wish, market) {
            let graph_query = 
            `mutation Update {
                editWish(id: ${wish.id}, newName: "${wish.name}+") {
                    wish {
                        name
                    }
                }
            }`

            let vapp = this
            axios.post('/graphql', 
                { 
                    query: graph_query
                }
            )
            .then(function (response) {
                console.log(response)
                let data = response.data.data.editWish.wish.name
                
                let newList = vapp.wishList[`${market}`].filter(function(prev) {
                    console.log(prev)
                    if (prev.name === wish.name) {
                        prev.name = data
                        return prev
                    }
                    return prev
                })
                vapp.wishList[`${market}`] = newList

            })
            .catch(function (error) {
                console.log(error)
            })
        }
    },
    created() {
        let vapp = this
        let graph_query = 
        `query { 
            marketList { 
                name 
            } 
            wishList { 
                id 
                market { 
                    name 
                } 
                name 
            } 
        }`
        
        console.log('RUN')
        axios.post('/graphql', 
            { 
                query: graph_query
            }
        )
        .then(function (response) {
            let market_data = response.data.data.marketList
            let wish_data = response.data.data.wishList

            vapp.marketList = market_data.map(function (market) {
                return market.name
            })
            
            wish_data.map(function (wish) {
                let market = wish.market.name

                if (vapp.wishList[`${market}`]) {
                    vapp.wishList[`${market}`].push({'id': wish.id, 'name': wish.name})
                }
                else {
                    vapp.wishList[`${market}`] = [{'id': wish.id, 'name': wish.name}]
                }
            })
            console.log(vapp.wishList)
        })
        .catch(function (error) {
            console.log(error)
        })
    },
})

const vm = app.mount("#app")