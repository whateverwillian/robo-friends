# Redux

Redux usa uma arquitetura chamada "Flux pattern"

O fluxo do redux é 

    Action => Reducer => Store => Reflects on React (render the changes)

A primeira coisa que vamos fazer é criar uma action e um reducer

uma action é alguma ação que o usuário pode fazer na aplicação

    ex:

    const setSearchField = text => ({
      type: 'CHANGE_SEARCH_FIELD',
      payload: text,
    })


Essa função (action) pega o input do usuário e cria um objeto com o tipo da ação e o payload, que são os dados do usuário

já o reducer é uma função que lê a action e devolve um novo state, para isso
o reducer recebe dois parâmetros: o state e a action

Vamos ter um "initialState" pro caso de um state não ser informado

    ex:

    ```
    const searchRobots = (state = initialState, action = {}) => {

      // Vamos ter um comportamento específico para a ação
      switch(action.type) {
        case CHANGE_SEARCH_FIELD:

          // Vamos gerar um novo state clonando o state antigo
          // e atualizando o campo necessário
          return { ...state, searchField: action.payload }

        default:
          return state
      }
    }
    
    ```

Agora temos uma action (setSearchField que pega o input do usuário digitado na caixa de busca) e temos um reducer (serachRobots que recebe um state, e uma action, e baseado na action, retorna um novo estado)...

Olhando para o fluxo, já temos

    Action [x] => Reducer [x] => Store [ ] => Render [ ]

além disso, precisamos do react-redux para ligar as duas partes da aplicação:

    Provider: 'Que provê o estado da aplicação',
    connect: 'Que é o lado que consome o estado'

Porém, antes precisamos criar o tal do Store, então vamos criar

    ex: 

    ```
    import { createStore } from 'redux'

    // Aqui vamos passar o reducer
    const store = createStore(searchRobots)

    // Obs. Vamos ter muitos reducers, nesse caso passamos um só
    // mas no caso de muitos reducers, vamos combinar eles em um só
    // "rootReducer", e vamos usar esse rootReducer como parâmetro
    // no createStore()

    ```
Agora temos nosso estado, podemos passar ele como props no nosso componente <App />, porém ao fazer isso, vamos passar o estado para TODOS os componentes da aplicação que estão abaixo de <App />

Para evitar isso, podemos envolver nosso <App /> component em um <Provider />

    ex:

    ```
    import { Provider } from 'react-redux'

    ...
    (
      <Provider store={store}>
        <App />
      </Provider>
    )
    ...

    ```
Como eu disse anteriormente, temos o lado que provê e o lado que consome o state, acabamos de prover o state como props através do Provider, fizemos um lado da ligação, o próximo passo para acessar esse state nos componentes filhos é fazer o outro lado, que é feito no componente que vai acessar o state

    ex:

    ```
    import { connect } from 'react-redux' // Que faz a tal ligação
    import { setSearchField } from '../actions' // A ação


    // O connect é uma High order function, ou seja, uma fn que retorna uma fn
    // E ela recebe dois parâmetros:
    // 1) mapStateToProps => Traz o estado para as props
    // 2) mapDispatchToProps => Traz a "ação" pro props
    export default connect(mapStateToProps, mapDispatchToProps)(App)

    // Nós conectamos o App com a Store, e toda vez que houver uma mudança em 
    // App, talvez o Redux store deva ser informado
    // E essas duas funções dizem:
    // 1) Qual estado estamos interessados
    // 2) Quais ações estamos interessados

    const mapStateToProps = state => {
      return {
        // Nosso state, o mesmo campo descrito no reducer
        // Descrevemos aqui as informações que queremos, em relação ao state
        // Queremos searchField, que está dentro do reducer searchBox, que está
        // Dentro do state do redux
        searchField: state.searchRobots.searchField || state.searchField
      }
    }

    const mapDispatchToProps = dispatch => ({
      // Temos aqui o nosso método que vai vir no props
      // E lida com as ações do usuário
      onSearchChange = event => dispatch(setSearchField(event.target.value))
    })

    ```
Agora, podemos tirar nosso "input handler" ou "action handler" que antes era declarado no código, e pegamos esse método através do props
A mesma coisa com o state searchField, também vai vir das props

Agora, terminamos o fluxo

    Action [x] => Reducer [x] => Store [x] => Render [x]

