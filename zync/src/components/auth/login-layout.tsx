import LoginSide from './login-side'
import { LoginForm } from './login-form'

export default function LoginLayout() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <LoginSide />
      <LoginForm />
    </div>
  )
}
