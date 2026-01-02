import { Link } from 'react-router-dom';
import { MdEmail, MdPhone, MdLocationOn, MdAccessTime } from 'react-icons/md';
import logo from '../../assets/images/logo_22.png';

const Footer = () => {
  const footerLinks = {
    quickLinks: [
      { label: 'Home', to: '/' },
      { label: 'About Us', to: '/about' },
      { label: 'Properties', to: '/properties' },
      { label: 'Contact', to: '/contact' },
      { label: 'Blog', to: '/blog' }
    ],
    siteLinks: [
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Support', to: '/support' },
      { label: 'Careers', to: '/careers' }
    ],
    contact: [
      { icon: <MdEmail className="text-green-400" size={18} />, text: 'hello@haven.com' },
      { icon: <MdPhone className="text-green-400" size={18} />, text: '+62 812 3456 7890' },
      { icon: <MdLocationOn className="text-green-400" size={18} />, text: 'Jakarta, Indonesia' },
      { icon: <MdAccessTime className="text-green-400" size={18} />, text: '24/7 Customer Support' }
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
    <footer className="w-full bg-gradient-to-br from-green-900 to-gray-800 text-gray-200 pt-20 pb-8 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_2.5fr] gap-12 lg:gap-20 pb-12 border-b border-green-900/30">
          <div className="flex flex-col gap-5">
            <img 
              src={logo} 
              alt="HAVEN Logo" 
              className="rounded max-w-48" 
            />
            <p className="text-[15px] leading-relaxed text-gray-400 m-0">
              Platform co-living terpercaya untuk menemukan hunian impian Anda di seluruh Indonesia.
            </p>
            <div className="flex gap-3 mt-2">
              {socialLinks.map((social) => (
                <button key={social.name} className="w-10 h-10 rounded-full bg-green-900/40 border border-green-800/50 text-gray-400 flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-green-700 hover:border-green-600 hover:text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-900/50" onClick={social.onClick} aria-label={social.name}>
                  {social.icon}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            <div>
              <h3 className="text-sm font-semibold text-gray-50 uppercase tracking-wide m-0 mb-5">Quick Links</h3>
              <ul className="list-none p-0 m-0 flex flex-col gap-3">
                {footerLinks.quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link to={link.to} className="bg-transparent border-none text-gray-400 text-[15px] cursor-pointer transition-colors duration-200 text-left p-0 hover:text-green-400 no-underline">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-50 uppercase tracking-wide m-0 mb-5">Site Links</h3>
              <ul className="list-none p-0 m-0 flex flex-col gap-3">
                {footerLinks.siteLinks.map((link, index) => (
                  <li key={index}>
                    <Link to={link.to} className="bg-transparent border-none text-gray-400 text-[15px] cursor-pointer transition-colors duration-200 text-left p-0 hover:text-green-400 no-underline">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-50 uppercase tracking-wide m-0 mb-5">Hubungi Kami Sekarang Juga!</h3>
              <ul className="list-none p-0 m-0 flex flex-col gap-3">
                {footerLinks.contact.map((item, index) => (
                  <li key={index} className="text-gray-400 text-[15px] flex items-center gap-2">
                    {item.icon} {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-8 gap-4">
          <p className="text-sm text-gray-500 m-0">
            © 2024 Haven. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
