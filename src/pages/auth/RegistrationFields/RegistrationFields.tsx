import type { RegistrationFieldsProps } from './RegistrationFieldsProps'

export function RegistrationFields({
  registrationTicket,
}: RegistrationFieldsProps) {
  return (
    <>
      <label>
        Registration ticket
        <input value={registrationTicket} readOnly required />
      </label>
      <label>
        Username
        <input
          name="username"
          autoComplete="username"
          minLength={3}
          maxLength={32}
          required
        />
      </label>
      <label>
        Name
        <input name="name" autoComplete="name" maxLength={80} required />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={12}
          required
        />
      </label>
    </>
  )
}
