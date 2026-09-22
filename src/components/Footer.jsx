import './Footer.css'

const partner = {
  name: 'Jule',
  logo: '/partners/jules.png',
  url: 'https://jule-lime.vercel.app',
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <h2>VOXSTAR</h2>
          <p>Votre voix, leur moment.</p>
        </div>

        <div className="footer-partners">
          <h3>Partenaire</h3>

          <a
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            className="partner-logo"
            aria-label={`Visiter ${partner.name}`}
          >
            <img
              src={partner.logo}
              alt={partner.name}
            />
          </a>

          <p className="partner-name">{partner.name}</p>
        </div>

        <div className="footer-bottom">
         <p className="footer-age-warning">
Déconseillé aux moins de 18 ans.
</p>
 <p>© 2026 VoxStar. Tous droits réservés.</p>
        </div>

      </div>
    </footer>
  )
}

export default Footer
