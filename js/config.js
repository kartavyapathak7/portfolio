/**
 * Quick config — update these links and you're good to go.
 */
const SITE_CONFIG = {
  monkeytype: 'https://monkeytype.com/profile/YOUR_USERNAME',
  github: 'https://github.com/YOUR_USERNAME',
  linkedin: 'https://linkedin.com/in/YOUR_USERNAME',
  email: 'hello@kartavyapathak.com',
};

document.addEventListener('DOMContentLoaded', () => {
  const monkeytypeLink = document.getElementById('monkeytypeLink');
  if (monkeytypeLink) monkeytypeLink.href = SITE_CONFIG.monkeytype;

  document.querySelectorAll('.contact-link').forEach((link) => {
    const label = link.querySelector('strong')?.textContent?.toLowerCase();
    const small = link.querySelector('small');
    if (label === 'github') {
      link.href = SITE_CONFIG.github;
      if (small) small.textContent = SITE_CONFIG.github.replace('https://', '');
    }
    if (label === 'linkedin') {
      link.href = SITE_CONFIG.linkedin;
      if (small) small.textContent = SITE_CONFIG.linkedin.replace('https://', '');
    }
    if (label === 'email') {
      link.href = `mailto:${SITE_CONFIG.email}`;
      if (small) small.textContent = SITE_CONFIG.email;
    }
  });
});
