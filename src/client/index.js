import { handleSubmit } from './js/handler'

import './styles/resets.scss'
import './styles/base.scss'
import './styles/footer.scss'
import './styles/form.scss'
import './styles/header.scss'
import './styles/cardview.scss'
import './styles/travel_app_theme.scss'

export {
    handleSubmit
}

document.getElementById('destinationResult').style.visibility = 'hidden';
document.getElementById('submitForm').addEventListener('click', handleSubmit);