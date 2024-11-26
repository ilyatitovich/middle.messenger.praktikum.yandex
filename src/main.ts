import Handlebars from 'handlebars'

import homePage from './pages/home'

const template = Handlebars.compile(homePage)

document.querySelector<HTMLDivElement>('#app')!.innerHTML = template({})
