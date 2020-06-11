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
    
    

Agora temos uma action (setSearchField que pega o input do usuário digitado na caixa de busca) e temos um reducer (serachRobots que recebe um state, e uma action, e baseado na action, retorna um novo estado)...

Olhando para o fluxo, já temos

    Action [x] => Reducer [x] => Store [ ] => Render [ ]

além disso, precisamos do react-redux para ligar as duas partes da aplicação:

    Provider: 'Que provê o estado da aplicação',
    connect: 'Que é o lado que consome o estado'

Porém, antes precisamos criar o tal do Store, então vamos criar

    ex: 

    
    import { createStore } from 'redux'

    // Aqui vamos passar o reducer
    const store = createStore(searchRobots)

    // Obs. Vamos ter muitos reducers, nesse caso passamos um só
    // mas no caso de muitos reducers, vamos combinar eles em um só
    // "rootReducer", e vamos usar esse rootReducer como parâmetro
    // no createStore()

    
Agora temos nosso estado, podemos passar ele como props no nosso componente <App />, porém ao fazer isso, vamos passar o estado para TODOS os componentes da aplicação que estão abaixo de <App />

Para evitar isso, podemos envolver nosso <App /> component em um <Provider />

    ex:

    
    import { Provider } from 'react-redux'

    ...
    (
      <Provider store={store}>
        <App />
      </Provider>
    )
    ...

    
Como eu disse anteriormente, temos o lado que provê e o lado que consome o state, acabamos de prover o state como props através do Provider, fizemos um lado da ligação, o próximo passo para acessar esse state nos componentes filhos é fazer o outro lado, que é feito no componente que vai acessar o state

    ex:

    
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

    
Agora, podemos tirar nosso "input handler" ou "action handler" que antes era declarado no código, e pegamos esse método através do props
A mesma coisa com o state searchField, também vai vir das props

Agora, terminamos o fluxo

    Action [x] => Reducer [x] => Store [x] => Render [x]


# Redux Async Actions

Usamos "redux-thunk" para lidar com actions que são assíncronas

Primeiro nós importamos a biblioteca, e colocamos na cadeia de middlewares

Agora, para fazer o uso dessa middleware, primeiro precisamos criar três constantes relacionadas à chamada assíncrona

    PENDING - Enquanto a promise ainda está pendente
    SUCCESS - Quando a promise é resolvida
    FAILED - Quando a promise é rejeitada

Agora vamos criar nossa action "requestRobots" e dessa vez, a action vai recer o "dispatch" como parametro, o mesmo que nós utilizamos anteriormente para despachar as actions

    const requestRobots = dispatch => {
      // A primeira coisa que queremos fazer ao realizar essa action
      // é avisar que agora ela está pendente...
      dispatch({ type: REQUEST_ROBOTS_PENDING }) // No payload

      // Agora vamos fazer a chamada à API
      fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())

        // Se a promise for resolvida, vamos despachar o status de sucesso junto com os dados
        .then(data => dispatch({ type: REQUEST_ROBOTS_SUCCESS, payload: data })) 

        // Se não for resolvida, vamos depachar o status de falha junto com o erro
        .catch(error => dispatch({ type: REQUEST_ROBOTS_FAILED, payload: error }))
    }

Agora, vamos ao reducer da action em questão

    const requestRobots = (state = initialState, action = {}) => {
      switch(action.type) {
        
        // Caso a promise esteja pendente...
        case REQUEST_ROBOTS_PENDING:
          return { ...state, isPending: true }

        // Caso a promise seja resolvida
        case REQUEST_ROBOTS_SUCCESS:
          return { ...state, isPending: false, robots: action.payload }

        // Caso ocorra um erro...
        case REQUEST_ROBOTS_FAILED:
          return { ...state, isPending: false, error: action.payload }

        // Por padrão, vamos devolver o próprio state
        default:
          return state

      }
    }

Porém, agora temos dois reducers, e anteriormente colocamos apenas um no nosso createStore(),
para resolver isso o redux disponibiliza uma função chamada combineReducers, que combina reducers asdkaopdkao

    import { combineReducers } from 'redux';

    const rootReducer = combineReducers({ reducer1, reducer2 })

    // E na hora de utilizar o state, fica assim:
    // No nosso mapStateToProps
    state.reducer1.example

O redux-thunk é uma middleware que checka os retornos das actions, por padrão, action síncronas retornam um objeto, já uma action assíncrona retorna uma função, quando ele vê um retorno de função ao invés de objeto, ele sabe que a action é assíncrona

Agora para ter acesso às mudanças no state, precisamos mapear as mudanças para nossas props, no mapStateToProps...

    // state atualizado
    const mapStateToProps = state => {
      return {
        searchField, state.searchRobots.searchField,
        robots: state.requestRobots.robots,
        isPending: state.requestRobots.isPending,
        error: state.requestRobots.error,
      }
    }

Agora temos nossa action pronta e o reducer também, mas ainda não estamos utilizando... Para isso, vamos mapear o método requestRobots para termos acesso

    // Actions atualizadas
    const mapDispatchToProps = (dispatch) => {
      return (
        onSearchChange: (event) => dispatch(setSearchField(event.target.value)),

        // Essa fn vai retornar uma fn, e vai receber dispatch como parâmetro
        onRequestRobots: () => requestRobots(dispatch)

        // Ou podemos escrever assim, o redux thunk percebe que estamos despachando 
        // uma fn, ou seja, estamos passando uma fn como parâmetro, e age
        onRequestRobots: () => dispatch(requestRobots()) // Segunda opção
      )
    }

    // No caso de usar a segunda opção precisamos mudar nossa action, assim:
      const requestRobots = dispatch => {} // antes
      const requestRobots = () => (dispatch) => {} // depois

Relembrando:

    // 1) Podemos declarar a action como uma função mesmo
    const requestRobots = dispatch => {}

    // E passar o dispatch como parâmetro
    onRequestRobots: () => requestRobots(dispatch)

    // 2) OU podemos podemos declarar a action como uma high order fn (que retorna uma fn)
    const requestRobots = () => (dispatch) => {}

    // e passar essa fn retornada como um parâmetro para dispatch
    onRequestRobots: () => dispatch(requestRobots())

    // 3) E para efetivamente fazer à requisição dos robos usamos o hook
    componentDidMount() {
      this.props.onRequestRobots()
    }

E agora não mais precisamos do constructor porque nosso state vem de outro lugar.