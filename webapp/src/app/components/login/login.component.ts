import {Component, effect, signal} from '@angular/core';

interface IForm {
  username: string
  password: string
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  form = signal<IForm>({ username: '', password: ''})
  changeUsername(event: Event) {
    const username = (event.target as HTMLInputElement).value
    this.form.update(prev => {
      return {
        ...prev,
        username: username
      }
    })
  }
  changePassword(event: Event) {
    const password = (event.target as HTMLInputElement).value
    this.form.update(prev => {
      return {
        ...prev,
        password: password
      }
    })
  }

  formChangedEffect = effect(() => {
    console.log(this.form())
  })

}
