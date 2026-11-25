import { galleryImages } from './images';
import { BookOpen, HeartPulse, Sprout, House, HandHeart, Users } from 'lucide-react';

// Replace this placeholder identity with your approved NGO branding.
export const site = { name: 'Bihar Nishad Sangh', tagline: 'Together, for a better tomorrow.' };
export const navigation = [ ['Home', '/'], ['About us', '/about'], ['Our programs', '/programs'], ['Gallery', '/gallery'], ['Events', '/events'], ['Contact', '/contact'] ];
export const programs = [
  { slug: 'education', title: 'Education for everyone', category: 'Education', icon: BookOpen, color: 'peach', description: 'Opening doors to learning, building confidence, and helping every child imagine a brighter future.', initiatives: ['Learning support', 'Digital literacy', 'Access to learning materials'] },
  { slug: 'health', title: 'Healthier communities', category: 'Healthcare', icon: HeartPulse, color: 'sage', description: 'Making health awareness and essential care more accessible to the communities that need them.', initiatives: ['Health awareness', 'Preventive care education', 'Community wellbeing'] },
  { slug: 'women', title: 'Women leading change', category: 'Empowerment', icon: Users, color: 'lilac', description: 'Creating space for women to learn, lead, and build independent livelihoods.', initiatives: ['Skills development', 'Leadership opportunities', 'Financial literacy'] },
  { slug: 'agriculture', title: 'Growing a better future', category: 'Agriculture', icon: Sprout, color: 'sage', description: 'Supporting sustainable practices and sharing knowledge for resilient farming communities.', initiatives: ['Sustainable farming awareness', 'Farmer learning groups', 'Resource conservation'] },
  { slug: 'rural', title: 'Stronger villages', category: 'Rural development', icon: House, color: 'peach', description: 'Putting local voices at the heart of community development and shared progress.', initiatives: ['Community participation', 'Local skills', 'Environmental awareness'] },
  { slug: 'welfare', title: 'Dignity for every person', category: 'Social welfare', icon: HandHeart, color: 'lilac', description: 'Encouraging inclusion, mutual support, and equal opportunity for all.', initiatives: ['Community support', 'Inclusion awareness', 'Volunteer participation'] },
];
export const galleryItems = galleryImages;
