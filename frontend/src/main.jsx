import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { Provider } from 'react-redux'
import {store} from './redux/store.js'
import Choose from './Choose.jsx'
createRoot(document.getElementById('root')).render(


 <Provider store={store}>
        <App/>
 </Provider>


   

)
