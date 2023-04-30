import {Component, computed, effect, signal} from '@angular/core';
import * as _ from 'lodash';

interface IForm {
  username: string
  password: string
}

interface IWarning {
  usernameWarning: string
  passwordWarning: string
  requestWarning: string
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  form = signal<IForm>({username: '', password: ''})

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

  warning = computed<IWarning>(() => {
    const res: IWarning = {
      usernameWarning: "",
      passwordWarning: "",
      requestWarning: ""
    }
    if (this.form().username === '') {
      res.usernameWarning = 'Username is not Valid'
    }
    if (this.form().password === '') {
      res.passwordWarning = 'Password is not Valid'
    }

    return res
  })

  isShowingWarning = signal<boolean>(false)

  warningList = computed(() => Object.values(this.warning()))

  formChangedEffect = effect(() => {
    console.log(this.form())
  })

  clickLogin() {
    if (!this.warningList().every(v => v === '')) {
      this.isShowingWarning.set(true)
      return
    }
    this.isShowingWarning.update(() => false)
    console.log('Logging In')
  }

  shouldShowWarning = computed(() => !this.warningList().every(v => v === ''))

  clickClose() {
    console.log('Close Clicked')
    this.isShowingWarning.set(false)
  }

}
