export default function Input({ id, label, placeholder, icon, type = 'text' }) {
  return (
    <div className="campo-auth">
      <label htmlFor={id}>{label}</label>
      <div className="input-com-icone">
        <i className={`bx ${icon}`} aria-hidden="true" />
        <input type={type} id={id} name={id} placeholder={placeholder} required />
      </div>
    </div>
  )
}
