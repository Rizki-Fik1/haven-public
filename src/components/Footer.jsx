import React from 'react';
import './Footer.css';

const Footer = () => {
  const footerLinks = {
    company: [
      { label: 'About us', onClick: () => console.log('About clicked') },
      { label: 'Careers', onClick: () => console.log('Careers clicked') },
      { label: 'Press', onClick: () => console.log('Press clicked') },
      { label: 'Blog', onClick: () => console.log('Blog clicked') }
    ],
    residents: [
      { label: 'Find a home', onClick: () => console.log('Find home clicked') },
      { label: 'Locations', onClick: () => console.log('Locations clicked') },
      { label: 'Community', onClick: () => console.log('Community clicked') },
      { label: 'FAQs', onClick: () => console.log('FAQs clicked') }
    ],
    landlords: [
      { label: 'List your property', onClick: () => console.log('List property clicked') },
      { label: 'Property management', onClick: () => console.log('Management clicked') },
      { label: 'Resources', onClick: () => console.log('Resources clicked') },
      { label: 'Contact', onClick: () => console.log('Contact clicked') }
    ],
    legal: [
      { label: 'Privacy policy', onClick: () => console.log('Privacy clicked') },
      { label: 'Terms of service', onClick: () => console.log('Terms clicked') },
      { label: 'Cookie policy', onClick: () => console.log('Cookie clicked') }
    ]
  };

  const socialLinks = [
    { 
      name: 'Facebook', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"/>
        </svg>
      ),
      onClick: () => console.log('Facebook clicked')
    },
    {
      name: 'Instagram',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 0C7.284 0 6.944.012 5.877.06 4.813.11 4.086.278 3.45.525a4.902 4.902 0 00-1.772 1.153A4.902 4.902 0 00.525 3.45C.278 4.086.109 4.813.06 5.877.012 6.944 0 7.284 0 10s.012 3.056.06 4.123c.05 1.064.218 1.791.465 2.427a4.902 4.902 0 001.153 1.772 4.902 4.902 0 001.772 1.153c.636.247 1.363.416 2.427.465 1.067.048 1.407.06 4.123.06s3.056-.012 4.123-.06c1.064-.05 1.791-.218 2.427-.465a4.902 4.902 0 001.772-1.153 4.902 4.902 0 001.153-1.772c.247-.636.416-1.363.465-2.427.048-1.067.06-1.407.06-4.123s-.012-3.056-.06-4.123c-.05-1.064-.218-1.791-.465-2.427a4.902 4.902 0 00-1.153-1.772A4.902 4.902 0 0016.55.525C15.914.278 15.187.109 14.123.06 13.056.012 12.716 0 10 0zm0 1.802c2.67 0 2.986.01 4.04.058.976.045 1.505.207 1.858.344.466.181.8.398 1.15.748.35.35.567.684.748 1.15.137.353.3.882.344 1.857.048 1.055.058 1.37.058 4.041 0 2.67-.01 2.986-.058 4.04-.045.976-.207 1.505-.344 1.858-.181.466-.398.8-.748 1.15-.35.35-.684.567-1.15.748-.353.137-.882.3-1.857.344-1.054.048-1.37.058-4.041.058-2.67 0-2.987-.01-4.04-.058-.976-.045-1.505-.207-1.858-.344a3.097 3.097 0 01-1.15-.748 3.097 3.097 0 01-.748-1.15c-.137-.353-.3-.882-.344-1.857-.048-1.055-.058-1.37-.058-4.041 0-2.67.01-2.986.058-4.04.045-.976.207-1.505.344-1.858.181-.466.398-.8.748-1.15.35-.35.684-.567 1.15-.748.353-.137.882-.3 1.857-.344 1.055-.048 1.37-.058 4.041-.058z"/>
          <path d="M10 13.333a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm0-8.468a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm6.538-.203a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z"/>
        </svg>
      ),
      onClick: () => console.log('Instagram clicked')
    },
    {
      name: 'Twitter',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"/>
        </svg>
      ),
      onClick: () => console.log('Twitter clicked')
    },
    {
      name: 'LinkedIn',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M18.521 0H1.476C.66 0 0 .645 0 1.441v17.118C0 19.355.66 20 1.476 20h17.045c.815 0 1.479-.645 1.479-1.441V1.441C20 .645 19.336 0 18.521 0zM5.928 17.04H2.964V7.498h2.964v9.542zM4.446 6.194a1.72 1.72 0 110-3.438 1.72 1.72 0 010 3.438zM17.04 17.04h-2.963v-4.641c0-1.107-.02-2.532-1.542-2.532-1.544 0-1.78 1.205-1.78 2.449v4.724H7.791V7.498h2.844v1.303h.04c.397-.75 1.364-1.542 2.808-1.542 3.004 0 3.557 1.977 3.557 4.547v5.234z"/>
        </svg>
      ),
      onClick: () => console.log('LinkedIn clicked')
    }
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <svg width="100" height="40" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="0" y="30" fill="#4F46E5" fontSize="28" fontWeight="600" fontFamily="Arial, sans-serif">
                cove
              </text>
            </svg>
            <p className="footer-tagline">
              Modern co-living spaces for
              <br />
              the next generation
            </p>
            <div className="footer-social">
              {socialLinks.map((social) => (
                <button key={social.name} className="social-button" onClick={social.onClick} aria-label={social.name}>
                  {social.icon}
                </button>
              ))}
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h3 className="footer-column-title">Company</h3>
              <ul className="footer-list">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <button onClick={link.onClick} className="footer-link">{link.label}</button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-column-title">For Residents</h3>
              <ul className="footer-list">
                {footerLinks.residents.map((link, index) => (
                  <li key={index}>
                    <button onClick={link.onClick} className="footer-link">{link.label}</button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-column-title">For Landlords</h3>
              <ul className="footer-list">
                {footerLinks.landlords.map((link, index) => (
                  <li key={index}>
                    <button onClick={link.onClick} className="footer-link">{link.label}</button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-column-title">Legal</h3>
              <ul className="footer-list">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <button onClick={link.onClick} className="footer-link">{link.label}</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2025 Cove. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <button className="footer-bottom-link">Privacy</button>
            <span className="footer-divider">•</span>
            <button className="footer-bottom-link">Terms</button>
            <span className="footer-divider">•</span>
            <button className="footer-bottom-link">Sitemap</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
