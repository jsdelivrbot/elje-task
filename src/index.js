import React from 'react'
import ReactDOM from 'react-dom'
import { dashboardInstance } from './lib'

import App from './app'

ReactDOM.render(<App dashboard={dashboardInstance} />, document.querySelector('.container'))
