const lucide = require('/Users/mazofayd/Documents/aimazoapps/mazopotfolio/node_modules/lucide-react');
console.log("Git keys:", Object.keys(lucide).filter(k => k.toLowerCase().includes('git')));
console.log("Link keys:", Object.keys(lucide).filter(k => k.toLowerCase().includes('link')));
console.log("Brand-like keys:", Object.keys(lucide).filter(k => 
  k.toLowerCase().includes('twitter') || 
  k.toLowerCase().includes('linkedin') || 
  k.toLowerCase().includes('facebook') ||
  k.toLowerCase().includes('instagram') ||
  k.toLowerCase().includes('github')
));
