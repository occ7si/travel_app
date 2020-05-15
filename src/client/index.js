import { handleSubmit } from './js/handler'

import './styles/resets.scss'
import './styles/base.scss'
import './styles/footer.scss'
import './styles/form.scss'
import './styles/header.scss'

export {
    handleSubmit
}

// document.addEventListener('DOMContentLoaded', (event) => {
//     const submitButton = document.getElementById('submitForm');
//     submitButton.addEventListener('click', handleSubmit(event));
//     // document.removeEventListener('DOMContentLoaded', this);
// })

document.getElementById('submitForm').addEventListener('click', handleSubmit);