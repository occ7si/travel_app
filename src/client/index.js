import { handleSubmit } from './js/handler'

import './styles/resets.scss'
import './styles/base.scss'
import './styles/footer.scss'
import './styles/form.scss'
import './styles/header.scss'
import './styles/cardview.scss'
import './styles/colortheme.scss'

export {
    handleSubmit
}

// document.addEventListener('DOMContentLoaded', (event) => {
//     const submitButton = document.getElementById('submitForm');
//     submitButton.addEventListener('click', handleSubmit(event));
//     // document.removeEventListener('DOMContentLoaded', this);
// })
document.getElementById('destinationResult').style.visibility = 'hidden';
document.getElementById('submitForm').addEventListener('click', handleSubmit);