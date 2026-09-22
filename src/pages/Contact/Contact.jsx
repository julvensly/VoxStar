import './Contact.css'

function Contact() {
  return (
    <main className="contact">

      <div className="contact-header">
        <p>VOXSTAR</p>

        <h1>Contact</h1>

        <span>WhatsApp seulement</span>
      </div>

      <div className="contact-content">

        <section className="contact-card">

          <div className="contact-icon">
            💬
          </div>

          <div>

            <h2>WhatsApp</h2>

            <p>
              Kontakte ekip VOXSTAR la sou WhatsApp.
            </p>

            <a
              href="https://wa.me/50933860948"
              target="_blank"
              rel="noopener noreferrer"
            >
              +509 33 8609 48
            </a>

            <a
              href="https://wa.me/50937061885"
              target="_blank"
              rel="noopener noreferrer"
            >
              +509 37 06 1885
            </a>

          </div>

        </section>

      </div>

    </main>
  )
}

export default Contact
