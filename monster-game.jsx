import React, { useState, useEffect, useRef, useCallback } from 'react';

// ============================================================================
// CONFIGURATION MODULE - Easy to modify game constants
// ============================================================================
const CONFIG = {
  // Monster Types - Add/remove monster types here
  MONSTER_TYPES: [
    { id: 'fire', name: 'Infernal', color: '#ff6b35', secondaryColor: '#ffaa00', baseStats: { strength: 12, constitution: 8, agility: 10, power: 14, intelligence: 8 } },
    { id: 'water', name: 'Aquatic', color: '#4ecdc4', secondaryColor: '#0077b6', baseStats: { strength: 8, constitution: 12, agility: 12, power: 10, intelligence: 10 } },
    { id: 'earth', name: 'Terran', color: '#95d5b2', secondaryColor: '#2d6a4f', baseStats: { strength: 14, constitution: 14, agility: 6, power: 8, intelligence: 10 } },
    { id: 'shadow', name: 'Umbral', color: '#7b2cbf', secondaryColor: '#3c096c', baseStats: { strength: 10, constitution: 8, agility: 14, power: 12, intelligence: 8 } },
    { id: 'crystal', name: 'Prismatic', color: '#f72585', secondaryColor: '#7209b7', baseStats: { strength: 8, constitution: 10, agility: 8, power: 14, intelligence: 12 } },
  ],
  
  // ============================================================================
  // BODY PARTS MODULE - Expanded with more anatomical variety
  // Each part has: id, name, render function, and optional rarity weight
  // ============================================================================
  BODY_PARTS: {
    heads: [
      { id: 'round', name: 'Round', weight: 3, render: (color) => `<circle cx="50" cy="30" r="20" fill="${color}"/>` },
      { id: 'angular', name: 'Angular', weight: 2, render: (color) => `<polygon points="50,10 70,35 60,50 40,50 30,35" fill="${color}"/>` },
      { id: 'oval', name: 'Oval', weight: 3, render: (color) => `<ellipse cx="50" cy="30" rx="18" ry="22" fill="${color}"/>` },
      { id: 'square', name: 'Square', weight: 2, render: (color) => `<rect x="32" y="12" width="36" height="36" rx="5" fill="${color}"/>` },
      { id: 'star', name: 'Star', weight: 1, render: (color) => `<polygon points="50,8 56,28 78,28 60,40 68,60 50,48 32,60 40,40 22,28 44,28" fill="${color}" transform="scale(0.7) translate(21, 5)"/>` },
      { id: 'pointed', name: 'Pointed', weight: 2, render: (color) => `<path d="M50,5 L70,45 L50,38 L30,45 Z" fill="${color}"/>` },
      { id: 'flat', name: 'Flat', weight: 2, render: (color) => `<ellipse cx="50" cy="32" rx="24" ry="16" fill="${color}"/>` },
      { id: 'skull', name: 'Skull', weight: 1, render: (color) => `<circle cx="50" cy="28" r="18" fill="${color}"/><ellipse cx="50" cy="42" rx="10" ry="8" fill="${color}"/>` },
    ],
    
    // Eyes - variable count (0-4)
    eyes: [
      { id: 'none', name: 'Eyeless', weight: 1, count: 0, render: () => `` },
      { id: 'single', name: 'Cyclops', weight: 2, count: 1, render: () => `<circle cx="50" cy="28" r="8" fill="#fff"/><circle cx="50" cy="29" r="4" fill="#111"/>` },
      { id: 'round', name: 'Round', weight: 5, count: 2, render: () => `<circle cx="42" cy="28" r="5" fill="#fff"/><circle cx="58" cy="28" r="5" fill="#fff"/><circle cx="43" cy="29" r="2.5" fill="#111"/><circle cx="59" cy="29" r="2.5" fill="#111"/>` },
      { id: 'angry', name: 'Angry', weight: 3, count: 2, render: () => `<ellipse cx="42" cy="28" rx="6" ry="4" fill="#fff"/><ellipse cx="58" cy="28" rx="6" ry="4" fill="#fff"/><circle cx="42" cy="28" r="2" fill="#111"/><circle cx="58" cy="28" r="2" fill="#111"/><line x1="36" y1="22" x2="48" y2="26" stroke="#111" stroke-width="2"/><line x1="64" y1="22" x2="52" y2="26" stroke="#111" stroke-width="2"/>` },
      { id: 'cute', name: 'Cute', weight: 3, count: 2, render: () => `<circle cx="42" cy="30" r="7" fill="#111"/><circle cx="58" cy="30" r="7" fill="#111"/><circle cx="44" cy="28" r="3" fill="#fff"/><circle cx="60" cy="28" r="3" fill="#fff"/>` },
      { id: 'sleepy', name: 'Sleepy', weight: 2, count: 2, render: () => `<path d="M36,28 Q42,32 48,28" stroke="#111" stroke-width="2" fill="none"/><path d="M52,28 Q58,32 64,28" stroke="#111" stroke-width="2" fill="none"/>` },
      { id: 'three', name: 'Three-Eyed', weight: 1, count: 3, render: () => `<circle cx="35" cy="28" r="4" fill="#fff"/><circle cx="50" cy="22" r="4" fill="#fff"/><circle cx="65" cy="28" r="4" fill="#fff"/><circle cx="35" cy="29" r="2" fill="#111"/><circle cx="50" cy="23" r="2" fill="#111"/><circle cx="65" cy="29" r="2" fill="#111"/>` },
      { id: 'four', name: 'Four-Eyed', weight: 1, count: 4, render: () => `<circle cx="38" cy="24" r="4" fill="#fff"/><circle cx="62" cy="24" r="4" fill="#fff"/><circle cx="38" cy="36" r="4" fill="#fff"/><circle cx="62" cy="36" r="4" fill="#fff"/><circle cx="38" cy="25" r="2" fill="#111"/><circle cx="62" cy="25" r="2" fill="#111"/><circle cx="38" cy="37" r="2" fill="#111"/><circle cx="62" cy="37" r="2" fill="#111"/>` },
      { id: 'tiny', name: 'Tiny', weight: 2, count: 2, render: () => `<circle cx="45" cy="28" r="2" fill="#111"/><circle cx="55" cy="28" r="2" fill="#111"/>` },
      { id: 'glowing', name: 'Glowing', weight: 1, count: 2, render: (_, sc) => `<circle cx="42" cy="28" r="5" fill="${sc}"/><circle cx="58" cy="28" r="5" fill="${sc}"/><circle cx="42" cy="28" r="3" fill="#fff" opacity="0.7"/><circle cx="58" cy="28" r="3" fill="#fff" opacity="0.7"/>` },
    ],
    
    ears: [
      { id: 'none', name: 'None', weight: 3, render: () => `` },
      { id: 'pointed', name: 'Pointed', weight: 3, render: (color) => `<polygon points="28,30 20,5 35,20" fill="${color}"/><polygon points="72,30 80,5 65,20" fill="${color}"/>` },
      { id: 'round', name: 'Round', weight: 3, render: (color) => `<circle cx="25" cy="20" r="10" fill="${color}"/><circle cx="75" cy="20" r="10" fill="${color}"/>` },
      { id: 'floppy', name: 'Floppy', weight: 2, render: (color) => `<ellipse cx="22" cy="35" rx="8" ry="15" fill="${color}" transform="rotate(-20, 22, 35)"/><ellipse cx="78" cy="35" rx="8" ry="15" fill="${color}" transform="rotate(20, 78, 35)"/>` },
      { id: 'bat', name: 'Bat', weight: 2, render: (color) => `<path d="M30,25 L15,5 L20,20 L10,15 L25,30" fill="${color}"/><path d="M70,25 L85,5 L80,20 L90,15 L75,30" fill="${color}"/>` },
      { id: 'fin', name: 'Fin', weight: 1, render: (color) => `<path d="M50,8 L55,0 L50,5 L45,0 Z" fill="${color}"/>` },
      { id: 'antenna', name: 'Antenna', weight: 1, render: (color) => `<path d="M40,15 Q35,0 30,-5" stroke="${color}" stroke-width="2" fill="none"/><circle cx="30" cy="-5" r="3" fill="${color}"/><path d="M60,15 Q65,0 70,-5" stroke="${color}" stroke-width="2" fill="none"/><circle cx="70" cy="-5" r="3" fill="${color}"/>` },
    ],
    
    // Horns - variable count (0-3)
    horns: [
      { id: 'none', name: 'None', weight: 4, count: 0, render: () => `` },
      { id: 'single', name: 'Unicorn', weight: 2, count: 1, render: (color) => `<polygon points="50,12 46,-15 54,-15" fill="${color}"/>` },
      { id: 'small', name: 'Small', weight: 3, count: 2, render: (color) => `<polygon points="38,15 42,0 46,15" fill="${color}"/><polygon points="54,15 58,0 62,15" fill="${color}"/>` },
      { id: 'curved', name: 'Curved', weight: 2, count: 2, render: (color) => `<path d="M35,18 Q25,-5 40,10" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M65,18 Q75,-5 60,10" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round"/>` },
      { id: 'demon', name: 'Demon', weight: 2, count: 2, render: (color) => `<path d="M32,20 L20,-5 L38,15" fill="${color}"/><path d="M68,20 L80,-5 L62,15" fill="${color}"/>` },
      { id: 'antlers', name: 'Antlers', weight: 1, count: 2, render: (color) => `<path d="M35,15 L30,0 M30,0 L25,-5 M30,0 L35,-5" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M65,15 L70,0 M70,0 L75,-5 M70,0 L65,-5" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round"/>` },
      { id: 'triple', name: 'Triple Crown', weight: 1, count: 3, render: (color) => `<polygon points="35,15 38,0 41,15" fill="${color}"/><polygon points="47,12 50,-5 53,12" fill="${color}"/><polygon points="59,15 62,0 65,15" fill="${color}"/>` },
      { id: 'ridge', name: 'Ridge', weight: 1, count: 5, render: (color) => `<path d="M35,15 L37,5 L42,12 L47,2 L52,12 L57,5 L62,15" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round"/>` },
    ],
    
    // Upper torso
    upperTorso: [
      { id: 'broad', name: 'Broad', weight: 3, render: (color) => `<path d="M28,48 L25,62 L75,62 L72,48 Q50,42 28,48" fill="${color}"/>` },
      { id: 'slim', name: 'Slim', weight: 3, render: (color) => `<ellipse cx="50" cy="55" rx="18" ry="12" fill="${color}"/>` },
      { id: 'round', name: 'Round', weight: 3, render: (color) => `<ellipse cx="50" cy="55" rx="22" ry="14" fill="${color}"/>` },
      { id: 'armored', name: 'Armored', weight: 1, render: (color, sc) => `<path d="M28,48 L25,62 L75,62 L72,48 Q50,42 28,48" fill="${color}"/><path d="M32,50 L50,48 L68,50 L65,60 L35,60 Z" fill="${sc}" opacity="0.4"/>` },
      { id: 'none', name: 'None', weight: 1, render: () => `` },
    ],
    
    // Lower torso
    lowerTorso: [
      { id: 'round', name: 'Round', weight: 3, render: (color) => `<ellipse cx="50" cy="72" rx="20" ry="15" fill="${color}"/>` },
      { id: 'slim', name: 'Slim', weight: 3, render: (color) => `<ellipse cx="50" cy="72" rx="14" ry="16" fill="${color}"/>` },
      { id: 'bulky', name: 'Bulky', weight: 2, render: (color) => `<path d="M30,62 L28,82 L72,82 L70,62 Z" fill="${color}"/>` },
      { id: 'tapered', name: 'Tapered', weight: 2, render: (color) => `<path d="M30,62 L38,85 L62,85 L70,62 Z" fill="${color}"/>` },
      { id: 'blob', name: 'Blob', weight: 1, render: (color) => `<path d="M30,62 Q20,72 30,82 Q50,90 70,82 Q80,72 70,62 Z" fill="${color}"/>` },
    ],
    
    // Upper arms
    upperArms: [
      { id: 'none', name: 'None', weight: 2, render: () => `` },
      { id: 'normal', name: 'Normal', weight: 4, render: (color) => `<path d="M28,52 L18,65" stroke="${color}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M72,52 L82,65" stroke="${color}" stroke-width="8" fill="none" stroke-linecap="round"/>` },
      { id: 'bulky', name: 'Bulky', weight: 2, render: (color) => `<ellipse cx="20" cy="58" rx="10" ry="12" fill="${color}"/><ellipse cx="80" cy="58" rx="10" ry="12" fill="${color}"/>` },
      { id: 'thin', name: 'Thin', weight: 2, render: (color) => `<path d="M28,52 L15,68" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M72,52 L85,68" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round"/>` },
      { id: 'multi', name: 'Multiple', weight: 1, render: (color) => `<path d="M28,50 L15,62" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M28,55 L12,70" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M72,50 L85,62" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M72,55 L88,70" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/>` },
    ],
    
    // Forearms/hands
    forearms: [
      { id: 'none', name: 'None', weight: 2, render: () => `` },
      { id: 'normal', name: 'Normal', weight: 4, render: (color) => `<path d="M18,65 L15,82" stroke="${color}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M82,65 L85,82" stroke="${color}" stroke-width="7" fill="none" stroke-linecap="round"/>` },
      { id: 'claws', name: 'Claws', weight: 2, render: (color) => `<path d="M18,65 L15,78" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M15,78 L10,88 M15,78 L15,90 M15,78 L20,88" stroke="${color}" stroke-width="2" fill="none"/><path d="M82,65 L85,78" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M85,78 L80,88 M85,78 L85,90 M85,78 L90,88" stroke="${color}" stroke-width="2" fill="none"/>` },
      { id: 'pincers', name: 'Pincers', weight: 1, render: (color) => `<path d="M18,65 L12,78" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/><ellipse cx="10" cy="82" rx="8" ry="5" fill="${color}"/><path d="M82,65 L88,78" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/><ellipse cx="90" cy="82" rx="8" ry="5" fill="${color}"/>` },
      { id: 'tentacle', name: 'Tentacle', weight: 1, render: (color) => `<path d="M18,65 Q5,75 10,90 Q15,98 8,102" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M82,65 Q95,75 90,90 Q85,98 92,102" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round"/>` },
      { id: 'stumps', name: 'Stumps', weight: 2, render: (color) => `<ellipse cx="15" cy="72" rx="6" ry="8" fill="${color}"/><ellipse cx="85" cy="72" rx="6" ry="8" fill="${color}"/>` },
    ],
    
    // Upper legs (thighs)
    upperLegs: [
      { id: 'normal', name: 'Normal', weight: 4, render: (color) => `<path d="M40,82 L38,95" stroke="${color}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M60,82 L62,95" stroke="${color}" stroke-width="9" fill="none" stroke-linecap="round"/>` },
      { id: 'thick', name: 'Thick', weight: 2, render: (color) => `<ellipse cx="38" cy="88" rx="10" ry="12" fill="${color}"/><ellipse cx="62" cy="88" rx="10" ry="12" fill="${color}"/>` },
      { id: 'thin', name: 'Thin', weight: 2, render: (color) => `<path d="M42,82 L40,96" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M58,82 L60,96" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round"/>` },
      { id: 'digitigrade', name: 'Bent', weight: 2, render: (color) => `<path d="M40,82 L35,92" stroke="${color}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M60,82 L65,92" stroke="${color}" stroke-width="8" fill="none" stroke-linecap="round"/>` },
      { id: 'none', name: 'None', weight: 1, render: () => `` },
    ],
    
    // Lower legs/feet
    lowerLegs: [
      { id: 'normal', name: 'Normal', weight: 4, render: (color) => `<path d="M38,95 L38,108" stroke="${color}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M62,95 L62,108" stroke="${color}" stroke-width="7" fill="none" stroke-linecap="round"/>` },
      { id: 'talons', name: 'Talons', weight: 2, render: (color) => `<path d="M38,95 L38,105" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M38,105 L33,112 M38,105 L38,113 M38,105 L43,112" stroke="${color}" stroke-width="2" fill="none"/><path d="M62,95 L62,105" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M62,105 L57,112 M62,105 L62,113 M62,105 L67,112" stroke="${color}" stroke-width="2" fill="none"/>` },
      { id: 'hooves', name: 'Hooves', weight: 2, render: (color) => `<path d="M35,92 L38,105" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/><ellipse cx="38" cy="108" rx="5" ry="3" fill="${color}"/><path d="M65,92 L62,105" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/><ellipse cx="62" cy="108" rx="5" ry="3" fill="${color}"/>` },
      { id: 'hover', name: 'Hover', weight: 1, render: (color) => `<ellipse cx="50" cy="100" rx="18" ry="5" fill="${color}" opacity="0.4"/><ellipse cx="50" cy="104" rx="12" ry="3" fill="${color}" opacity="0.2"/>` },
      { id: 'blob', name: 'Blob', weight: 1, render: (color) => `<ellipse cx="50" cy="98" rx="20" ry="10" fill="${color}"/>` },
      { id: 'none', name: 'None', weight: 1, render: () => `` },
    ],
    
    tails: [
      { id: 'none', name: 'None', weight: 3, render: () => `` },
      { id: 'short', name: 'Short', weight: 3, render: (color) => `<path d="M50,82 Q60,88 65,82" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/>` },
      { id: 'long', name: 'Long', weight: 2, render: (color) => `<path d="M50,82 Q75,85 85,75 Q95,65 90,55" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round"/>` },
      { id: 'fluffy', name: 'Fluffy', weight: 2, render: (color) => `<path d="M50,82 Q65,85 70,80" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="73" cy="78" r="8" fill="${color}"/>` },
      { id: 'spiked', name: 'Spiked', weight: 1, render: (color) => `<path d="M50,82 Q70,88 85,75" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round"/><polygon points="85,75 95,70 88,68 92,60 82,70" fill="${color}"/>` },
      { id: 'fish', name: 'Fish', weight: 1, render: (color) => `<path d="M50,82 Q65,85 75,80" stroke="${color}" stroke-width="5" fill="none"/><path d="M75,80 L85,70 L85,90 Z" fill="${color}"/>` },
      { id: 'scorpion', name: 'Scorpion', weight: 1, render: (color) => `<path d="M50,82 Q70,85 80,70 Q85,55 75,50" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/><polygon points="75,50 80,45 70,48" fill="${color}"/>` },
    ],
    
    wings: [
      { id: 'none', name: 'None', weight: 5, render: () => `` },
      { id: 'small', name: 'Small', weight: 2, render: (color) => `<ellipse cx="20" cy="55" rx="12" ry="8" fill="${color}" opacity="0.8"/><ellipse cx="80" cy="55" rx="12" ry="8" fill="${color}" opacity="0.8"/>` },
      { id: 'bat', name: 'Bat', weight: 2, render: (color) => `<path d="M28,50 L5,35 L10,50 L0,55 L15,60 L28,55" fill="${color}" opacity="0.9"/><path d="M72,50 L95,35 L90,50 L100,55 L85,60 L72,55" fill="${color}" opacity="0.9"/>` },
      { id: 'feathered', name: 'Feathered', weight: 1, render: (color) => `<ellipse cx="15" cy="50" rx="15" ry="6" fill="${color}"/><ellipse cx="12" cy="55" rx="12" ry="5" fill="${color}"/><ellipse cx="10" cy="60" rx="8" ry="4" fill="${color}"/><ellipse cx="85" cy="50" rx="15" ry="6" fill="${color}"/><ellipse cx="88" cy="55" rx="12" ry="5" fill="${color}"/><ellipse cx="90" cy="60" rx="8" ry="4" fill="${color}"/>` },
      { id: 'fairy', name: 'Fairy', weight: 1, render: (color) => `<ellipse cx="18" cy="50" rx="18" ry="12" fill="${color}" opacity="0.5" stroke="${color}" stroke-width="1"/><ellipse cx="15" cy="62" rx="12" ry="8" fill="${color}" opacity="0.4" stroke="${color}" stroke-width="1"/><ellipse cx="82" cy="50" rx="18" ry="12" fill="${color}" opacity="0.5" stroke="${color}" stroke-width="1"/><ellipse cx="85" cy="62" rx="12" ry="8" fill="${color}" opacity="0.4" stroke="${color}" stroke-width="1"/>` },
      { id: 'dragon', name: 'Dragon', weight: 1, render: (color) => `<path d="M28,45 L0,25 L5,40 L-5,45 L10,50 L0,60 L15,55 L28,58" fill="${color}"/><path d="M72,45 L100,25 L95,40 L105,45 L90,50 L100,60 L85,55 L72,58" fill="${color}"/>` },
    ],
    
    markings: [
      { id: 'none', name: 'None', weight: 4, render: () => `` },
      { id: 'stripes', name: 'Stripes', weight: 2, render: (color) => `<path d="M35,55 L45,55 M32,65 L48,65 M35,75 L45,75" stroke="${color}" stroke-width="3" opacity="0.5"/><path d="M55,55 L65,55 M52,65 L68,65 M55,75 L65,75" stroke="${color}" stroke-width="3" opacity="0.5"/>` },
      { id: 'spots', name: 'Spots', weight: 2, render: (color) => `<circle cx="40" cy="58" r="4" fill="${color}" opacity="0.5"/><circle cx="55" cy="68" r="3" fill="${color}" opacity="0.5"/><circle cx="62" cy="55" r="4" fill="${color}" opacity="0.5"/><circle cx="45" cy="75" r="3" fill="${color}" opacity="0.5"/>` },
      { id: 'belly', name: 'Belly', weight: 2, render: (color) => `<ellipse cx="50" cy="70" rx="12" ry="16" fill="${color}" opacity="0.3"/>` },
      { id: 'glow', name: 'Glow', weight: 1, render: (color) => `<ellipse cx="50" cy="65" rx="10" ry="12" fill="${color}" opacity="0.4" filter="url(#blur)"/>` },
    ],
  },
  
  // Growth Stages
  STAGES: {
    EGG: { name: 'Egg', duration: 10, careMultiplier: 1.5 },
    INFANT: { name: 'Infant', duration: 20, careMultiplier: 1.2 },
    ADULT: { name: 'Adult', duration: null, careMultiplier: 1.0 },
  },
  
  // Experience and Leveling System
  LEVELING: {
    expPerWin: 100,
    expPerLevel: 150, // EXP needed increases each level
    levelMultiplier: 1.3, // Each level needs 30% more EXP
    statCeilingBonus: 2, // Bonus to stat ceiling per level
    maxLevel: 50,
    trainingPointsPerWin: 1, // Training points earned per battle win
  },
  
  // Care Actions for Eggs/Infants - Influences hatching stats
  CARE_ACTIONS: [
    { id: 'feed', name: 'Feed', emoji: '🍖', stat: 'strength', boost: 2, cooldown: 3000, description: 'Builds strength potential' },
    { id: 'protect', name: 'Protect', emoji: '🛡️', stat: 'constitution', boost: 2, cooldown: 4000, description: 'Builds constitution potential' },
    { id: 'play', name: 'Play', emoji: '🎾', stat: 'agility', boost: 2, cooldown: 3000, description: 'Builds agility potential' },
    { id: 'teach', name: 'Teach', emoji: '📚', stat: 'intelligence', boost: 2, cooldown: 5000, description: 'Builds intelligence potential' },
    { id: 'attune', name: 'Attune', emoji: '✨', stat: 'power', boost: 2, cooldown: 4000, description: 'Builds power potential' },
  ],
  
  // Training Types for Adults - Spend training points to gain stats
  TRAINING_TYPES: [
    { id: 'strength', name: 'Strength', emoji: '💪', stat: 'strength', description: 'Increase physical attack power', cost: 1 },
    { id: 'constitution', name: 'Constitution', emoji: '🛡️', stat: 'constitution', description: 'Increase defense and health', cost: 1 },
    { id: 'agility', name: 'Agility', emoji: '💨', stat: 'agility', description: 'Increase speed and dodge chance', cost: 1 },
    { id: 'power', name: 'Power', emoji: '🔮', stat: 'power', description: 'Increase magic attack power', cost: 1 },
    { id: 'intelligence', name: 'Intelligence', emoji: '🧠', stat: 'intelligence', description: 'Improve battle decisions', cost: 1 },
  ],
  
  // Battle Settings
  BATTLE: {
    arenaWidth: 500,
    arenaHeight: 350,
    tickRate: 50,
    moveSpeed: 2,
    attackRange: 50, // Melee range
    projectileRange: 200, // Ranged attack range
    attackCooldown: 1200,
    dodgeCooldown: 800,
    dodgeDuration: 300,
    monsterRadius: 25, // Collision radius
    projectileSpeed: 8,
    projectileSize: 8,
  },
  
  // Stat Influence on Battle
  STAT_EFFECTS: {
    strengthDamageMultiplier: 0.5,
    constitutionDefenseMultiplier: 0.3,
    agilitySpeedMultiplier: 0.1,
    agilityDodgeChance: 0.02,
    powerMagicDamageMultiplier: 0.6,
    intelligenceDecisionBonus: 0.03,
  },
  
  // Enemy Generation Settings
  ENEMY: {
    // Difficulty tiers - Add/remove tiers here
    TIERS: [
      { id: 'weak', name: 'Weak', statRange: [6, 12], color: '#6b7280' },
      { id: 'normal', name: 'Normal', statRange: [10, 16], color: '#3b82f6' },
      { id: 'strong', name: 'Strong', statRange: [14, 22], color: '#f59e0b' },
      { id: 'elite', name: 'Elite', statRange: [18, 28], color: '#ef4444' },
      { id: 'boss', name: 'Boss', statRange: [24, 35], color: '#a855f7' },
    ],
    // Enemy name parts - Add more for variety
    NAME_PREFIXES: ['Wild', 'Feral', 'Savage', 'Rogue', 'Ancient', 'Corrupted', 'Shadow', 'Chaos'],
    NAME_SUFFIXES: ['Beast', 'Fiend', 'Spawn', 'Horror', 'Wraith', 'Demon', 'Spirit', 'Creature'],
  },
};

// ============================================================================
// UTILITY MODULE - Helper functions
// ============================================================================
const Utils = {
  generateId: () => Math.random().toString(36).substr(2, 9),
  
  clamp: (value, min, max) => Math.min(Math.max(value, min), max),
  
  randomInRange: (min, max) => Math.random() * (max - min) + min,
  
  distance: (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2),
  
  generateMonsterName: () => {
    const prefixes = ['Zor', 'Kra', 'Vel', 'Nyx', 'Thal', 'Vor', 'Rix', 'Myr'];
    const suffixes = ['ax', 'on', 'is', 'ara', 'ius', 'eth', 'ora', 'ix'];
    return prefixes[Math.floor(Math.random() * prefixes.length)] + 
           suffixes[Math.floor(Math.random() * suffixes.length)];
  },
};

// ============================================================================
// BODY PART GENERATOR MODULE - Creates unique monster appearances
// ============================================================================
const BodyPartGenerator = {
  // Weighted random selection
  weightedRandom: (items) => {
    const totalWeight = items.reduce((sum, item) => sum + (item.weight || 1), 0);
    let random = Math.random() * totalWeight;
    
    for (const item of items) {
      random -= (item.weight || 1);
      if (random <= 0) return item;
    }
    return items[items.length - 1];
  },
  
  // Generate random body parts for a new monster
  generateRandomParts: () => {
    const parts = CONFIG.BODY_PARTS;
    
    // Use weighted selection for variety
    const selectPart = (category) => BodyPartGenerator.weightedRandom(parts[category]).id;
    
    // Determine if certain parts should be missing (anatomical variety)
    const hasArms = Math.random() > 0.1; // 90% have arms
    const hasLegs = Math.random() > 0.05; // 95% have legs
    const hasTail = Math.random() > 0.3; // 70% have tails
    const hasWings = Math.random() > 0.7; // 30% have wings
    const hasEars = Math.random() > 0.2; // 80% have ears
    const hasHorns = Math.random() > 0.5; // 50% have horns
    
    return {
      head: selectPart('heads'),
      eyes: selectPart('eyes'),
      ears: hasEars ? selectPart('ears') : 'none',
      horns: hasHorns ? selectPart('horns') : 'none',
      upperTorso: selectPart('upperTorso'),
      lowerTorso: selectPart('lowerTorso'),
      upperArms: hasArms ? selectPart('upperArms') : 'none',
      forearms: hasArms ? selectPart('forearms') : 'none',
      upperLegs: hasLegs ? selectPart('upperLegs') : 'none',
      lowerLegs: hasLegs ? selectPart('lowerLegs') : 'none',
      tail: hasTail ? selectPart('tails') : 'none',
      wings: hasWings ? selectPart('wings') : 'none',
      markings: selectPart('markings'),
    };
  },
  
  // Get a specific part by category and id
  getPart: (category, id) => {
    const parts = CONFIG.BODY_PARTS[category];
    return parts?.find(p => p.id === id) || parts?.[0];
  },
  
  // Render full monster SVG with new anatomy
  renderMonster: (bodyParts, primaryColor, secondaryColor, scale = 1) => {
    // Get each part's render function
    const wingsPart = BodyPartGenerator.getPart('wings', bodyParts.wings);
    const tailPart = BodyPartGenerator.getPart('tails', bodyParts.tail);
    const upperLegsPart = BodyPartGenerator.getPart('upperLegs', bodyParts.upperLegs);
    const lowerLegsPart = BodyPartGenerator.getPart('lowerLegs', bodyParts.lowerLegs);
    const lowerTorsoPart = BodyPartGenerator.getPart('lowerTorso', bodyParts.lowerTorso);
    const upperTorsoPart = BodyPartGenerator.getPart('upperTorso', bodyParts.upperTorso);
    const upperArmsPart = BodyPartGenerator.getPart('upperArms', bodyParts.upperArms);
    const forearmsPart = BodyPartGenerator.getPart('forearms', bodyParts.forearms);
    const markingsPart = BodyPartGenerator.getPart('markings', bodyParts.markings);
    const earsPart = BodyPartGenerator.getPart('ears', bodyParts.ears);
    const headPart = BodyPartGenerator.getPart('heads', bodyParts.head);
    const hornsPart = BodyPartGenerator.getPart('horns', bodyParts.horns);
    const eyesPart = BodyPartGenerator.getPart('eyes', bodyParts.eyes);
    
    // Build SVG in correct layer order (back to front)
    const svgContent = `
      ${wingsPart?.render(secondaryColor) || ''}
      ${tailPart?.render(primaryColor) || ''}
      ${upperLegsPart?.render(primaryColor) || ''}
      ${lowerLegsPart?.render(primaryColor) || ''}
      ${lowerTorsoPart?.render(primaryColor) || ''}
      ${upperTorsoPart?.render(primaryColor, secondaryColor) || ''}
      ${upperArmsPart?.render(primaryColor) || ''}
      ${forearmsPart?.render(primaryColor) || ''}
      ${markingsPart?.render(secondaryColor) || ''}
      ${earsPart?.render(primaryColor) || ''}
      ${headPart?.render(primaryColor) || ''}
      ${hornsPart?.render(secondaryColor) || ''}
      ${eyesPart?.render(primaryColor, secondaryColor) || ''}
    `;
    
    return svgContent;
  },
};

// ============================================================================
// MONSTER FACTORY MODULE - Creates and manages monsters
// ============================================================================
const MonsterFactory = {
  createEgg: (typeId) => {
    const type = CONFIG.MONSTER_TYPES.find(t => t.id === typeId) || CONFIG.MONSTER_TYPES[0];
    // Generate random body parts that will be revealed at hatch
    const bodyParts = BodyPartGenerator.generateRandomParts();
    
    return {
      id: Utils.generateId(),
      name: Utils.generateMonsterName(),
      type: type,
      stage: 'EGG',
      age: 0,
      carePoints: 0,
      bodyParts: bodyParts, // Unique appearance
      maxStatBonuses: { strength: 0, constitution: 0, agility: 0, power: 0, intelligence: 0 },
      temporaryBoosts: { strength: 0, constitution: 0, agility: 0, power: 0, intelligence: 0 },
      boostDecayTimers: {},
      lastCareTime: {},
      health: 100,
      maxHealth: 100,
      // Experience and leveling
      level: 1,
      exp: 0,
      statCeiling: 50, // Maximum total stat bonuses
      trainingPoints: 0, // Points earned from battles, spent on training
    };
  },
  
  // Set monster name
  setName: (monster, name) => {
    return { ...monster, name: name.trim() || monster.name };
  },
  
  getEffectiveStats: (monster) => {
    const base = monster.type.baseStats;
    const bonuses = monster.maxStatBonuses;
    const boosts = monster.temporaryBoosts || { strength: 0, constitution: 0, agility: 0, power: 0, intelligence: 0 };
    
    return {
      strength: Math.round(base.strength + bonuses.strength + boosts.strength),
      constitution: Math.round(base.constitution + bonuses.constitution + boosts.constitution),
      agility: Math.round(base.agility + bonuses.agility + boosts.agility),
      power: Math.round(base.power + bonuses.power + boosts.power),
      intelligence: Math.round(base.intelligence + bonuses.intelligence + boosts.intelligence),
    };
  },
  
  // Calculate EXP needed for next level
  getExpForLevel: (level) => {
    return Math.round(CONFIG.LEVELING.expPerLevel * Math.pow(CONFIG.LEVELING.levelMultiplier, level - 1));
  },
  
  // Add experience and handle level ups with stat gains based on distribution
  addExperience: (monster, exp) => {
    if (monster.stage !== 'ADULT') return monster;
    if (monster.level >= CONFIG.LEVELING.maxLevel) return monster;
    
    const updated = { ...monster };
    updated.exp = (monster.exp || 0) + exp;
    
    // Check for level up
    let expNeeded = MonsterFactory.getExpForLevel(updated.level);
    while (updated.exp >= expNeeded && updated.level < CONFIG.LEVELING.maxLevel) {
      updated.exp -= expNeeded;
      updated.level += 1;
      updated.statCeiling = (updated.statCeiling || 50) + CONFIG.LEVELING.statCeilingBonus;
      
      // Grant stat bonuses based on current stat distribution
      // Higher stats gain more, lower stats gain less (reinforces specialization)
      const stats = MonsterFactory.getEffectiveStats(updated);
      const statValues = Object.entries(stats);
      const totalStats = statValues.reduce((sum, [, val]) => sum + val, 0);
      
      // Sort stats by value (highest first)
      statValues.sort((a, b) => b[1] - a[1]);
      
      // Distribute level-up points: 2 to highest, 1 to second highest, 1 to random
      const pointDistribution = [2, 1, 1, 0, 0];
      
      // Add a random point to one of the lower stats (encourages some variety)
      const randomLowIndex = 2 + Math.floor(Math.random() * 3); // Index 2, 3, or 4
      pointDistribution[randomLowIndex] += 1;
      
      statValues.forEach(([statName], index) => {
        if (pointDistribution[index] > 0) {
          updated.maxStatBonuses = {
            ...updated.maxStatBonuses,
            [statName]: (updated.maxStatBonuses[statName] || 0) + pointDistribution[index],
          };
        }
      });
      
      expNeeded = MonsterFactory.getExpForLevel(updated.level);
    }
    
    return updated;
  },
  
  evolve: (monster) => {
    const stages = ['EGG', 'INFANT', 'ADULT'];
    const currentIndex = stages.indexOf(monster.stage);
    if (currentIndex < stages.length - 1) {
      return { ...monster, stage: stages[currentIndex + 1], age: 0 };
    }
    return monster;
  },
  
  // Apply care - only works for eggs and infants to build potential stats
  applyCare: (monster, actionId) => {
    // Care only works for eggs and infants
    if (monster.stage === 'ADULT') return monster;
    
    const action = CONFIG.CARE_ACTIONS.find(a => a.id === actionId);
    if (!action) return monster;
    
    const now = Date.now();
    const lastCare = monster.lastCareTime[actionId] || 0;
    if (now - lastCare < action.cooldown) return monster;
    
    const stageConfig = CONFIG.STAGES[monster.stage];
    const boost = action.boost * stageConfig.careMultiplier;
    
    const updated = { ...monster };
    updated.carePoints += 1;
    updated.lastCareTime = { ...monster.lastCareTime, [actionId]: now };
    
    // Build up potential stats (maxStatBonuses) during egg/infant stage
    updated.maxStatBonuses = {
      ...monster.maxStatBonuses,
      [action.stat]: monster.maxStatBonuses[action.stat] + boost,
    };
    
    return updated;
  },
  
  // Add training points (earned from battle wins)
  addTrainingPoints: (monster, points) => {
    if (monster.stage !== 'ADULT') return monster;
    return { ...monster, trainingPoints: (monster.trainingPoints || 0) + points };
  },
  
  // Spend training points to increase a stat
  trainStat: (monster, statName) => {
    if (monster.stage !== 'ADULT') return { success: false, monster, message: 'Only adults can train' };
    
    const training = CONFIG.TRAINING_TYPES.find(t => t.stat === statName);
    if (!training) return { success: false, monster, message: 'Invalid stat' };
    
    const trainingPoints = monster.trainingPoints || 0;
    if (trainingPoints < training.cost) {
      return { success: false, monster, message: 'Not enough training points' };
    }
    
    const statCeiling = monster.statCeiling || 50;
    const currentStatTotal = Object.values(monster.maxStatBonuses).reduce((a, b) => a + b, 0);
    
    if (currentStatTotal >= statCeiling) {
      return { success: false, monster, message: 'Stat ceiling reached! Level up to increase.' };
    }
    
    const updated = { ...monster };
    updated.trainingPoints = trainingPoints - training.cost;
    updated.maxStatBonuses = {
      ...monster.maxStatBonuses,
      [statName]: Math.round(monster.maxStatBonuses[statName] + 1),
    };
    
    return { success: true, monster: updated, message: `+1 ${statName}!` };
  },
  
  // Check if monster can still gain stats (hasn't hit ceiling)
  canGainStats: (monster) => {
    if (monster.stage !== 'ADULT') return true;
    const statCeiling = monster.statCeiling || 50;
    const currentStatTotal = Object.values(monster.maxStatBonuses).reduce((a, b) => a + b, 0);
    return currentStatTotal < statCeiling;
  },
  
  // Get current stat total vs ceiling
  getStatProgress: (monster) => {
    const statCeiling = monster.statCeiling || 50;
    const currentStatTotal = Math.round(Object.values(monster.maxStatBonuses).reduce((a, b) => a + b, 0));
    return { current: currentStatTotal, ceiling: statCeiling };
  },
  
  tickAge: (monster) => {
    const updated = { ...monster, age: monster.age + 1 };
    const stageConfig = CONFIG.STAGES[monster.stage];
    
    if (stageConfig.duration && updated.age >= stageConfig.duration) {
      return MonsterFactory.evolve(updated);
    }
    
    return updated;
  },
};

// ============================================================================
// ENEMY FACTORY MODULE - Generates random opponents
// ============================================================================
const EnemyFactory = {
  generateEnemy: (tier = null) => {
    // Pick random tier if not specified
    const selectedTier = tier || 
      CONFIG.ENEMY.TIERS[Math.floor(Math.random() * CONFIG.ENEMY.TIERS.length)];
    
    // Pick random monster type for appearance
    const type = CONFIG.MONSTER_TYPES[Math.floor(Math.random() * CONFIG.MONSTER_TYPES.length)];
    
    // Generate random stats within tier range
    const [minStat, maxStat] = selectedTier.statRange;
    const randomStat = () => Math.floor(Utils.randomInRange(minStat, maxStat));
    
    // Generate enemy name
    const prefix = CONFIG.ENEMY.NAME_PREFIXES[Math.floor(Math.random() * CONFIG.ENEMY.NAME_PREFIXES.length)];
    const suffix = CONFIG.ENEMY.NAME_SUFFIXES[Math.floor(Math.random() * CONFIG.ENEMY.NAME_SUFFIXES.length)];
    
    // Generate random body parts for unique appearance
    const bodyParts = BodyPartGenerator.generateRandomParts();
    
    return {
      id: Utils.generateId(),
      name: `${prefix} ${suffix}`,
      type: {
        ...type,
        color: selectedTier.color, // Override color with tier color
      },
      stage: 'ADULT',
      tier: selectedTier,
      isEnemy: true,
      bodyParts: bodyParts, // Unique appearance
      // Random stats based on tier
      maxStatBonuses: {
        strength: randomStat() - type.baseStats.strength,
        constitution: randomStat() - type.baseStats.constitution,
        agility: randomStat() - type.baseStats.agility,
        power: randomStat() - type.baseStats.power,
        intelligence: randomStat() - type.baseStats.intelligence,
      },
      temporaryBoosts: { strength: 0, constitution: 0, agility: 0, power: 0, intelligence: 0 },
    };
  },
  
  // Generate enemy that closely matches player monster's power
  generateMatchedEnemy: (playerMonster) => {
    const playerStats = MonsterFactory.getEffectiveStats(playerMonster);
    const playerPower = Object.values(playerStats).reduce((a, b) => a + b, 0);
    
    // Pick random monster type for appearance
    const type = CONFIG.MONSTER_TYPES[Math.floor(Math.random() * CONFIG.MONSTER_TYPES.length)];
    
    // Generate enemy name
    const prefix = CONFIG.ENEMY.NAME_PREFIXES[Math.floor(Math.random() * CONFIG.ENEMY.NAME_PREFIXES.length)];
    const suffix = CONFIG.ENEMY.NAME_SUFFIXES[Math.floor(Math.random() * CONFIG.ENEMY.NAME_SUFFIXES.length)];
    
    // Generate random body parts for unique appearance
    const bodyParts = BodyPartGenerator.generateRandomParts();
    
    // Generate stats with BIGGER variance (±30% from player stats)
    // This makes battles more unpredictable and exciting
    const generateMatchedStat = (playerStat, baseStat) => {
      // Wider range: 70% to 130% of player stat
      const variance = 0.3;
      const multiplier = (1 - variance) + Math.random() * (variance * 2);
      const targetStat = playerStat * multiplier;
      return Math.max(1, Math.round(targetStat - baseStat));
    };
    
    const matchedBonuses = {
      strength: generateMatchedStat(playerStats.strength, type.baseStats.strength),
      constitution: generateMatchedStat(playerStats.constitution, type.baseStats.constitution),
      agility: generateMatchedStat(playerStats.agility, type.baseStats.agility),
      power: generateMatchedStat(playerStats.power, type.baseStats.power),
      intelligence: generateMatchedStat(playerStats.intelligence, type.baseStats.intelligence),
    };
    
    return {
      id: Utils.generateId(),
      name: `${prefix} ${suffix}`,
      type: {
        ...type,
        color: type.color,
      },
      stage: 'ADULT',
      isEnemy: true,
      bodyParts: bodyParts,
      maxStatBonuses: matchedBonuses,
      temporaryBoosts: { strength: 0, constitution: 0, agility: 0, power: 0, intelligence: 0 },
    };
  },
};

// ============================================================================
// BATTLE ENGINE MODULE - Handles autonomous combat with projectiles & collision
// ============================================================================
const BattleEngine = {
  createBattleState: (monster1, monster2) => {
    const stats1 = MonsterFactory.getEffectiveStats(monster1);
    const stats2 = MonsterFactory.getEffectiveStats(monster2);
    
    return {
      fighters: [
        {
          monster: monster1,
          stats: stats1,
          x: 70,
          y: CONFIG.BATTLE.arenaHeight / 2,
          health: 100 + stats1.constitution * 5,
          maxHealth: 100 + stats1.constitution * 5,
          vx: 0,
          vy: 0,
          lastAttack: 0,
          lastDodge: 0,
          dodgeEndTime: 0,
          state: 'idle', // idle, moving, attacking, dodging, hit
          stateEndTime: 0,
          facing: 1,
          targetX: null,
          targetY: null,
        },
        {
          monster: monster2,
          stats: stats2,
          x: CONFIG.BATTLE.arenaWidth - 70,
          y: CONFIG.BATTLE.arenaHeight / 2,
          health: 100 + stats2.constitution * 5,
          maxHealth: 100 + stats2.constitution * 5,
          vx: 0,
          vy: 0,
          lastAttack: 0,
          lastDodge: 0,
          dodgeEndTime: 0,
          state: 'idle',
          stateEndTime: 0,
          facing: -1,
          targetX: null,
          targetY: null,
        },
      ],
      projectiles: [], // Active projectiles in the arena
      effects: [], // Visual effects (dodge trails, hit sparks, etc.)
      log: [],
      winner: null,
      tick: 0,
    };
  },
  
  // Create a new projectile
  createProjectile: (shooter, target, isMagic) => {
    const angle = Math.atan2(target.y - shooter.y, target.x - shooter.x);
    const color = isMagic ? shooter.monster.type.color : '#ffaa00';
    
    return {
      id: Utils.generateId(),
      x: shooter.x,
      y: shooter.y,
      vx: Math.cos(angle) * CONFIG.BATTLE.projectileSpeed,
      vy: Math.sin(angle) * CONFIG.BATTLE.projectileSpeed,
      shooterId: shooter.monster.id,
      targetId: target.monster.id,
      isMagic: isMagic,
      color: color,
      size: isMagic ? CONFIG.BATTLE.projectileSize * 1.3 : CONFIG.BATTLE.projectileSize,
      damage: 0, // Calculated on creation
      createdAt: Date.now(),
      trail: [], // Trail positions for visual effect
    };
  },
  
  // Create visual effect
  createEffect: (type, x, y, color, duration = 500) => {
    return {
      id: Utils.generateId(),
      type: type, // 'dodge', 'hit', 'block', 'magic'
      x: x,
      y: y,
      color: color,
      createdAt: Date.now(),
      duration: duration,
    };
  },
  
  calculateDamage: (attacker, defender, isMagic = false) => {
    const baseDamage = isMagic 
      ? attacker.stats.power * CONFIG.STAT_EFFECTS.powerMagicDamageMultiplier
      : attacker.stats.strength * CONFIG.STAT_EFFECTS.strengthDamageMultiplier;
    
    const defense = defender.stats.constitution * CONFIG.STAT_EFFECTS.constitutionDefenseMultiplier;
    return Math.max(1, Math.round(baseDamage * 10 - defense));
  },
  
  // Check if defender can dodge (based on agility and intelligence)
  canDodge: (defender, now) => {
    if (now - defender.lastDodge < CONFIG.BATTLE.dodgeCooldown) return false;
    const dodgeChance = defender.stats.agility * CONFIG.STAT_EFFECTS.agilityDodgeChance +
                        defender.stats.intelligence * CONFIG.STAT_EFFECTS.intelligenceDecisionBonus * 0.5;
    return Math.random() < dodgeChance;
  },
  
  // Resolve collision between two fighters
  resolveCollision: (f1, f2) => {
    const dx = f2.x - f1.x;
    const dy = f2.y - f1.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const minDist = CONFIG.BATTLE.monsterRadius * 2;
    
    if (dist < minDist && dist > 0) {
      // Push apart
      const overlap = (minDist - dist) / 2;
      const nx = dx / dist;
      const ny = dy / dist;
      
      f1.x -= nx * overlap;
      f1.y -= ny * overlap;
      f2.x += nx * overlap;
      f2.y += ny * overlap;
      
      // Bounce velocities
      f1.vx -= nx * 1.5;
      f1.vy -= ny * 1.5;
      f2.vx += nx * 1.5;
      f2.vy += ny * 1.5;
      
      return true;
    }
    return false;
  },
  
  // AI decision making
  makeDecision: (fighter, enemy, tick, projectiles) => {
    const distance = Utils.distance(fighter.x, fighter.y, enemy.x, enemy.y);
    const now = tick * CONFIG.BATTLE.tickRate;
    const intelligenceBonus = fighter.stats.intelligence * CONFIG.STAT_EFFECTS.intelligenceDecisionBonus;
    
    // Check for incoming projectiles - smart monsters dodge!
    const incomingProjectiles = projectiles.filter(p => 
      p.targetId === fighter.monster.id &&
      Utils.distance(p.x, p.y, fighter.x, fighter.y) < 80
    );
    
    if (incomingProjectiles.length > 0 && Math.random() < (0.3 + intelligenceBonus)) {
      return { action: 'dodge', reason: 'projectile' };
    }
    
    // Attack decision
    const canAttack = now - fighter.lastAttack > CONFIG.BATTLE.attackCooldown;
    
    // Intelligence determines optimal attack choice
    // Higher intelligence = better at choosing the right attack for the situation
    const chooseAttackType = () => {
      const strength = fighter.stats.strength;
      const power = fighter.stats.power;
      const intelligence = fighter.stats.intelligence;
      
      // Base preference based on which stat is higher
      const physicalPower = strength;
      const magicalPower = power;
      
      // Intelligence helps choose the optimal attack for the situation
      // Smart monsters analyze: distance, enemy constitution, etc.
      const isCloseRange = distance < CONFIG.BATTLE.attackRange * 1.2;
      const enemyHighDefense = enemy.stats.constitution > 15;
      
      // Calculate smart choice bonus
      let magicBonus = 0;
      let physicalBonus = 0;
      
      if (intelligence > 10) {
        // Smart monsters prefer magic at range
        if (!isCloseRange) magicBonus += intelligence * 0.3;
        // Smart monsters use magic against high defense
        if (enemyHighDefense) magicBonus += intelligence * 0.2;
        // Smart monsters use physical when close
        if (isCloseRange) physicalBonus += intelligence * 0.2;
      }
      
      const adjustedPhysical = physicalPower + physicalBonus;
      const adjustedMagical = magicalPower + magicBonus;
      
      // Add some randomness, but intelligence reduces randomness (more consistent choices)
      const randomFactor = Math.max(0.1, 0.4 - intelligence * 0.02);
      const roll = Math.random() * randomFactor;
      
      // Higher intelligence = more likely to pick the optimal choice
      if (adjustedMagical > adjustedPhysical + roll * 10) {
        return true; // Use magic
      } else if (adjustedPhysical > adjustedMagical + roll * 10) {
        return false; // Use physical
      }
      
      // If roughly equal, use intelligence to make smarter situational choice
      return !isCloseRange && intelligence > 8;
    };
    
    const useMagic = chooseAttackType();
    const effectiveRange = useMagic ? CONFIG.BATTLE.projectileRange : CONFIG.BATTLE.attackRange;
    
    if (canAttack && distance < effectiveRange) {
      const attackChance = 0.3 + intelligenceBonus;
      if (Math.random() < attackChance) {
        return { action: 'attack', useMagic: useMagic };
      }
    }
    
    // Movement decision
    if (distance > effectiveRange * 0.8) {
      return { action: 'approach' };
    }
    
    // Dodge if enemy is attacking nearby
    if (enemy.state === 'attacking' && distance < CONFIG.BATTLE.attackRange * 1.5) {
      if (Math.random() < (0.25 + intelligenceBonus)) {
        return { action: 'dodge', reason: 'melee' };
      }
    }
    
    // Strafe / circle
    if (Math.random() < 0.4) {
      return { action: 'circle', direction: Math.random() > 0.5 ? 1 : -1 };
    }
    
    // Retreat if too close and ranged fighter
    if (useMagic && distance < CONFIG.BATTLE.attackRange) {
      return { action: 'retreat' };
    }
    
    return { action: 'idle' };
  },
  
  processTick: (battleState) => {
    if (battleState.winner) return battleState;
    
    const newState = { 
      ...battleState, 
      tick: battleState.tick + 1,
      projectiles: [...battleState.projectiles],
      effects: [...battleState.effects],
      fighters: battleState.fighters.map(f => ({ ...f })),
    };
    const [f1, f2] = newState.fighters;
    const now = newState.tick * CONFIG.BATTLE.tickRate;
    
    // Clear expired effects
    newState.effects = newState.effects.filter(e => 
      Date.now() - e.createdAt < e.duration
    );
    
    // Update state timers
    [f1, f2].forEach(fighter => {
      if (fighter.stateEndTime && now > fighter.stateEndTime) {
        fighter.state = 'idle';
        fighter.stateEndTime = 0;
      }
      if (fighter.dodgeEndTime && now > fighter.dodgeEndTime) {
        fighter.dodgeEndTime = 0;
      }
    });
    
    // Process projectiles
    newState.projectiles = newState.projectiles.filter(proj => {
      // Update trail
      proj.trail.push({ x: proj.x, y: proj.y });
      if (proj.trail.length > 8) proj.trail.shift();
      
      // Move projectile
      proj.x += proj.vx;
      proj.y += proj.vy;
      
      // Check bounds
      if (proj.x < 0 || proj.x > CONFIG.BATTLE.arenaWidth ||
          proj.y < 0 || proj.y > CONFIG.BATTLE.arenaHeight) {
        return false; // Remove projectile
      }
      
      // Check collision with target
      const target = proj.targetId === f1.monster.id ? f1 : f2;
      const shooter = proj.shooterId === f1.monster.id ? f1 : f2;
      const dist = Utils.distance(proj.x, proj.y, target.x, target.y);
      
      if (dist < CONFIG.BATTLE.monsterRadius + proj.size) {
        // Hit or dodge?
        if (target.dodgeEndTime && now < target.dodgeEndTime) {
          // Dodged!
          newState.effects.push(BattleEngine.createEffect('dodge', proj.x, proj.y, '#00ff88', 400));
          newState.log.push(`${target.monster.name} dodged the ${proj.isMagic ? 'spell' : 'attack'}!`);
        } else {
          // Hit!
          const damage = BattleEngine.calculateDamage(shooter, target, proj.isMagic);
          target.health -= damage;
          target.state = 'hit';
          target.stateEndTime = now + 200;
          
          // Knockback
          const knockbackDir = Math.atan2(target.y - proj.y, target.x - proj.x);
          target.vx += Math.cos(knockbackDir) * 5;
          target.vy += Math.sin(knockbackDir) * 5;
          
          newState.effects.push(BattleEngine.createEffect('hit', target.x, target.y, '#ff4444', 300));
          newState.log.push(`${shooter.monster.name} ${proj.isMagic ? 'blasted' : 'hit'} ${target.monster.name} for ${damage}!`);
        }
        return false; // Remove projectile
      }
      
      // Projectile timeout (3 seconds)
      if (Date.now() - proj.createdAt > 3000) return false;
      
      return true; // Keep projectile
    });
    
    // Process each fighter's AI and movement
    [f1, f2].forEach((fighter, idx) => {
      const enemy = idx === 0 ? f2 : f1;
      
      // Skip if in hit stun
      if (fighter.state === 'hit') return;
      
      const decision = BattleEngine.makeDecision(fighter, enemy, newState.tick, newState.projectiles);
      const speed = CONFIG.BATTLE.moveSpeed + 
                    fighter.stats.agility * CONFIG.STAT_EFFECTS.agilitySpeedMultiplier;
      
      switch (decision.action) {
        case 'attack':
          fighter.state = 'attacking';
          fighter.stateEndTime = now + 300;
          fighter.lastAttack = now;
          fighter.facing = enemy.x > fighter.x ? 1 : -1;
          
          // Calculate angle to enemy for proper aiming
          const aimAngle = Math.atan2(enemy.y - fighter.y, enemy.x - fighter.x);
          
          if (decision.useMagic) {
            // Create projectile for ranged attack - aims directly at enemy
            const projSpeed = CONFIG.BATTLE.projectileSpeed;
            const proj = {
              id: Utils.generateId(),
              x: fighter.x + Math.cos(aimAngle) * 20,
              y: fighter.y + Math.sin(aimAngle) * 20,
              vx: Math.cos(aimAngle) * projSpeed,
              vy: Math.sin(aimAngle) * projSpeed,
              shooterId: fighter.monster.id,
              targetId: enemy.monster.id,
              isMagic: true,
              color: fighter.monster.type.color,
              size: CONFIG.BATTLE.projectileSize * 1.3,
              createdAt: Date.now(),
              trail: [],
            };
            newState.projectiles.push(proj);
            newState.effects.push(BattleEngine.createEffect('magic', fighter.x, fighter.y, fighter.monster.type.color, 200));
          } else {
            // Melee attack - create fast short-range projectile aimed at enemy
            const dist = Utils.distance(fighter.x, fighter.y, enemy.x, enemy.y);
            if (dist < CONFIG.BATTLE.attackRange * 1.5) {
              const meleeSpeed = CONFIG.BATTLE.projectileSpeed * 2.5;
              const proj = {
                id: Utils.generateId(),
                x: fighter.x + Math.cos(aimAngle) * 15,
                y: fighter.y + Math.sin(aimAngle) * 15,
                vx: Math.cos(aimAngle) * meleeSpeed,
                vy: Math.sin(aimAngle) * meleeSpeed,
                shooterId: fighter.monster.id,
                targetId: enemy.monster.id,
                isMagic: false,
                color: '#ffcc00',
                size: CONFIG.BATTLE.projectileSize * 0.8,
                createdAt: Date.now(),
                trail: [],
              };
              newState.projectiles.push(proj);
            }
          }
          break;
          
        case 'dodge':
          if (now - fighter.lastDodge > CONFIG.BATTLE.dodgeCooldown) {
            fighter.state = 'dodging';
            fighter.lastDodge = now;
            fighter.dodgeEndTime = now + CONFIG.BATTLE.dodgeDuration;
            fighter.stateEndTime = now + 400;
            
            // Dodge direction - away from threat
            let dodgeAngle;
            if (decision.reason === 'projectile') {
              const nearestProj = newState.projectiles.find(p => p.targetId === fighter.monster.id);
              if (nearestProj) {
                dodgeAngle = Math.atan2(fighter.y - nearestProj.y, fighter.x - nearestProj.x) + 
                            (Math.random() - 0.5) * Math.PI * 0.5;
              } else {
                dodgeAngle = Math.random() * Math.PI * 2;
              }
            } else {
              dodgeAngle = Math.atan2(fighter.y - enemy.y, fighter.x - enemy.x) + 
                          (Math.random() - 0.5) * Math.PI * 0.7;
            }
            
            fighter.vx = Math.cos(dodgeAngle) * speed * 4;
            fighter.vy = Math.sin(dodgeAngle) * speed * 4;
            
            newState.effects.push(BattleEngine.createEffect('dodge', fighter.x, fighter.y, '#88ffff', 300));
          }
          break;
          
        case 'approach':
          fighter.state = 'moving';
          const dx = enemy.x - fighter.x;
          const dy = enemy.y - fighter.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          fighter.vx += (dx / dist) * speed * 0.3;
          fighter.vy += (dy / dist) * speed * 0.3;
          fighter.facing = dx > 0 ? 1 : -1;
          break;
          
        case 'circle':
          fighter.state = 'moving';
          const circleAngle = Math.atan2(enemy.y - fighter.y, enemy.x - fighter.x) + 
                             (Math.PI / 2) * decision.direction;
          fighter.vx += Math.cos(circleAngle) * speed * 0.3;
          fighter.vy += Math.sin(circleAngle) * speed * 0.3;
          fighter.facing = enemy.x > fighter.x ? 1 : -1;
          break;
          
        case 'retreat':
          fighter.state = 'moving';
          const retreatAngle = Math.atan2(fighter.y - enemy.y, fighter.x - enemy.x);
          fighter.vx += Math.cos(retreatAngle) * speed * 0.4;
          fighter.vy += Math.sin(retreatAngle) * speed * 0.4;
          fighter.facing = enemy.x > fighter.x ? 1 : -1;
          break;
          
        default:
          fighter.state = 'idle';
      }
    });
    
    // Apply physics
    [f1, f2].forEach(fighter => {
      // Apply velocity
      fighter.x += fighter.vx;
      fighter.y += fighter.vy;
      
      // Friction
      fighter.vx *= 0.88;
      fighter.vy *= 0.88;
      
      // Clamp speed
      const maxSpeed = 8;
      const currentSpeed = Math.sqrt(fighter.vx ** 2 + fighter.vy ** 2);
      if (currentSpeed > maxSpeed) {
        fighter.vx = (fighter.vx / currentSpeed) * maxSpeed;
        fighter.vy = (fighter.vy / currentSpeed) * maxSpeed;
      }
    });
    
    // Collision between monsters
    BattleEngine.resolveCollision(f1, f2);
    
    // Keep in bounds
    [f1, f2].forEach(fighter => {
      const r = CONFIG.BATTLE.monsterRadius;
      fighter.x = Utils.clamp(fighter.x, r, CONFIG.BATTLE.arenaWidth - r);
      fighter.y = Utils.clamp(fighter.y, r, CONFIG.BATTLE.arenaHeight - r);
    });
    
    // Check for winner
    if (f1.health <= 0) {
      f1.health = 0;
      newState.winner = f2.monster;
      newState.log.push(`🏆 ${f2.monster.name} wins!`);
    } else if (f2.health <= 0) {
      f2.health = 0;
      newState.winner = f1.monster;
      newState.log.push(`🏆 ${f1.monster.name} wins!`);
    }
    
    // Keep log manageable
    if (newState.log.length > 6) {
      newState.log = newState.log.slice(-6);
    }
    
    return newState;
  },
};

// ============================================================================
// UI COMPONENTS
// ============================================================================

// Monster Display Component - Renders unique SVG monsters
const MonsterSprite = ({ monster, size = 80, showStats = false, isInBattle = false, fighter = null }) => {
  const effectiveStats = MonsterFactory.getEffectiveStats(monster);
  const isEnemy = monster.isEnemy;
  
  // Generate SVG content for the monster
  const renderMonsterSVG = (spriteSize) => {
    const primaryColor = monster.type.color;
    const secondaryColor = monster.type.secondaryColor || monster.type.color;
    
    const svgContent = BodyPartGenerator.renderMonster(
      monster.bodyParts,
      primaryColor,
      secondaryColor
    );
    
    return (
      <svg 
        viewBox="-10 -20 120 130" 
        width={spriteSize} 
        height={spriteSize}
        style={{ overflow: 'visible' }}
      >
        <defs>
          <filter id={`glow-${monster.id}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id={`shadow-${monster.id}`}>
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3"/>
          </filter>
        </defs>
        <g 
          filter={`url(#shadow-${monster.id})`}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      </svg>
    );
  };
  
  const getSpriteContent = () => {
    if (monster.stage === 'EGG') {
      return (
        <div className="relative">
          <div 
            className="rounded-full flex items-center justify-center"
            style={{ 
              width: size * 0.7, 
              height: size * 0.9,
              background: `linear-gradient(135deg, ${monster.type.color}40, ${monster.type.color}80)`,
              border: `3px solid ${monster.type.color}`,
              animation: 'pulse 2s infinite',
            }}
          >
            {/* Egg pattern */}
            <svg viewBox="0 0 50 60" width={size * 0.4} height={size * 0.5}>
              <ellipse cx="25" cy="35" rx="20" ry="25" fill={monster.type.color} opacity="0.3"/>
              <ellipse cx="25" cy="30" rx="15" ry="18" fill={monster.type.color} opacity="0.2"/>
              <text x="25" y="40" textAnchor="middle" fontSize="20">🥚</text>
            </svg>
          </div>
          <div 
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs px-2 py-0.5 rounded-full"
            style={{ background: monster.type.color, color: '#fff' }}
          >
            {monster.age}/{CONFIG.STAGES.EGG.duration}
          </div>
        </div>
      );
    }
    
    const isInfant = monster.stage === 'INFANT';
    const spriteSize = isInfant ? size * 0.7 : size;
    
    return (
      <div 
        className="relative flex items-center justify-center transition-transform"
        style={{ 
          width: size, 
          height: size,
          transform: fighter ? `scaleX(${fighter.facing})` : 'none',
        }}
      >
        {/* Glow effect behind monster */}
        <div 
          className="absolute rounded-full opacity-20"
          style={{ 
            width: spriteSize * 0.8, 
            height: spriteSize * 0.8,
            background: monster.type.color,
            filter: 'blur(10px)',
            animation: 'pulse 3s infinite',
          }}
        />
        
        {/* Monster SVG */}
        <div style={{ transform: `scale(${isInfant ? 0.7 : 1})` }}>
          {renderMonsterSVG(spriteSize)}
        </div>
        
        {/* Infant stage indicator */}
        {isInfant && (
          <div 
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs px-2 py-0.5 rounded-full"
            style={{ background: monster.type.color, color: '#fff' }}
          >
            {monster.age}/{CONFIG.STAGES.INFANT.duration}
          </div>
        )}
        
        {/* Health bar in battle */}
        {fighter && (
          <div 
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-full px-1"
            style={{ transform: `scaleX(${fighter.facing})` }}
          >
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-200"
                style={{ 
                  width: `${(fighter.health / fighter.maxHealth) * 100}%`,
                  background: fighter.health > fighter.maxHealth * 0.3 ? '#22c55e' : '#ef4444',
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col items-center gap-2">
      {getSpriteContent()}
      {showStats && (
        <div className="text-xs space-y-1 mt-2 w-full max-w-32">
          {Object.entries(effectiveStats).map(([stat, value]) => (
            <div key={stat} className="flex justify-between items-center">
              <span className="capitalize text-gray-400">{stat.slice(0, 3)}</span>
              <div className="flex items-center gap-1">
                <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full"
                    style={{ 
                      width: `${Math.min(100, value * 3)}%`,
                      background: monster.type.color,
                    }}
                  />
                </div>
                <span className="text-gray-300 w-6 text-right">{value}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Care Button Component
const CareButton = ({ action, monster, onCare }) => {
  const [cooldown, setCooldown] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const lastCare = monster.lastCareTime[action.id] || 0;
      const remaining = Math.max(0, action.cooldown - (Date.now() - lastCare));
      setCooldown(remaining);
    }, 100);
    return () => clearInterval(interval);
  }, [monster, action]);
  
  const isReady = cooldown === 0;
  
  return (
    <button
      onClick={() => isReady && onCare(action.id)}
      disabled={!isReady}
      className={`
        relative flex flex-col items-center gap-1 p-3 rounded-xl
        transition-all duration-200 min-w-16
        ${isReady 
          ? 'bg-gray-800 hover:bg-gray-700 hover:scale-105 cursor-pointer' 
          : 'bg-gray-900 opacity-50 cursor-not-allowed'}
      `}
    >
      <span className="text-2xl">{action.emoji}</span>
      <span className="text-xs text-gray-400">{action.name}</span>
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
          <span className="text-xs text-gray-400">{Math.ceil(cooldown / 1000)}s</span>
        </div>
      )}
    </button>
  );
};

// Monster Card Component
const MonsterCard = ({ monster, isSelected, onClick, onSelect }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        relative p-4 rounded-2xl cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'ring-2 ring-offset-2 ring-offset-gray-950 scale-105' 
          : 'hover:bg-gray-800/50'}
      `}
      style={{ 
        background: `linear-gradient(135deg, ${monster.type.color}20, transparent)`,
        borderColor: isSelected ? monster.type.color : 'transparent',
        ringColor: monster.type.color,
      }}
    >
      <div className="flex items-center gap-3">
        <MonsterSprite monster={monster} size={50} />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white truncate">{monster.name}</h3>
          <p className="text-xs text-gray-400">{monster.type.name} • {CONFIG.STAGES[monster.stage].name}</p>
        </div>
      </div>
      {onSelect && monster.stage === 'ADULT' && (
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(monster); }}
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs"
        >
          ⚔️
        </button>
      )}
    </div>
  );
};

// Battle Arena Component - With projectiles and visual effects
const BattleArena = ({ battleState, onEnd }) => {
  if (!battleState) return null;
  
  const { fighters, projectiles, effects, log, winner } = battleState;
  
  // Render a projectile with trail
  const renderProjectile = (proj) => {
    return (
      <g key={proj.id}>
        {/* Trail */}
        {proj.trail.map((pos, i) => (
          <circle
            key={i}
            cx={pos.x}
            cy={pos.y}
            r={proj.size * (i / proj.trail.length) * 0.7}
            fill={proj.color}
            opacity={(i / proj.trail.length) * 0.5}
          />
        ))}
        {/* Main projectile */}
        <circle
          cx={proj.x}
          cy={proj.y}
          r={proj.size}
          fill={proj.color}
        >
          <animate
            attributeName="opacity"
            values="1;0.7;1"
            dur="0.2s"
            repeatCount="indefinite"
          />
        </circle>
        {/* Glow */}
        <circle
          cx={proj.x}
          cy={proj.y}
          r={proj.size * 2}
          fill={proj.color}
          opacity="0.3"
          filter="url(#blur)"
        />
        {proj.isMagic && (
          <>
            {/* Magic sparkles */}
            <circle cx={proj.x + 5} cy={proj.y - 5} r="2" fill="#fff" opacity="0.8"/>
            <circle cx={proj.x - 4} cy={proj.y + 3} r="1.5" fill="#fff" opacity="0.6"/>
          </>
        )}
      </g>
    );
  };
  
  // Render visual effect
  const renderEffect = (effect) => {
    const age = Date.now() - effect.createdAt;
    const progress = age / effect.duration;
    const opacity = 1 - progress;
    const scale = 1 + progress * 2;
    
    switch (effect.type) {
      case 'hit':
        return (
          <g key={effect.id}>
            {/* Impact burst */}
            <circle
              cx={effect.x}
              cy={effect.y}
              r={15 * scale}
              fill="none"
              stroke={effect.color}
              strokeWidth="3"
              opacity={opacity}
            />
            {/* Sparks */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const dist = 10 + progress * 20;
              return (
                <circle
                  key={i}
                  cx={effect.x + Math.cos(rad) * dist}
                  cy={effect.y + Math.sin(rad) * dist}
                  r={3 * (1 - progress)}
                  fill={effect.color}
                  opacity={opacity}
                />
              );
            })}
          </g>
        );
        
      case 'dodge':
        return (
          <g key={effect.id}>
            {/* Speed lines */}
            {[0, 1, 2].map((i) => (
              <line
                key={i}
                x1={effect.x - 20 + i * 10}
                y1={effect.y - 10 + i * 10}
                x2={effect.x - 35 + i * 10}
                y2={effect.y - 10 + i * 10}
                stroke={effect.color}
                strokeWidth="2"
                opacity={opacity * 0.7}
              />
            ))}
            {/* Dodge text */}
            <text
              x={effect.x}
              y={effect.y - 20 - progress * 15}
              textAnchor="middle"
              fill={effect.color}
              fontSize="12"
              fontWeight="bold"
              opacity={opacity}
            >
              DODGE!
            </text>
          </g>
        );
        
      case 'magic':
        return (
          <g key={effect.id}>
            {/* Magic circle */}
            <circle
              cx={effect.x}
              cy={effect.y}
              r={20 * (1 - progress * 0.5)}
              fill="none"
              stroke={effect.color}
              strokeWidth="2"
              opacity={opacity * 0.8}
            />
            {/* Inner glow */}
            <circle
              cx={effect.x}
              cy={effect.y}
              r={10}
              fill={effect.color}
              opacity={opacity * 0.5}
            />
          </g>
        );
        
      default:
        return null;
    }
  };
  
  // Get state-based styles for fighters
  const getFighterStyle = (fighter) => {
    let filter = '';
    let transform = `translate(${fighter.x - 35}px, ${fighter.y - 35}px) scaleX(${fighter.facing})`;
    
    switch (fighter.state) {
      case 'attacking':
        filter = 'brightness(1.4) saturate(1.3)';
        break;
      case 'dodging':
        filter = 'brightness(1.2) hue-rotate(30deg)';
        transform += ' scale(0.9)';
        break;
      case 'hit':
        filter = 'brightness(2) saturate(0.5)';
        transform += ' scale(1.1)';
        break;
    }
    
    return { filter, transform };
  };
  
  return (
    <div className="relative">
      {/* Fighter names and health above arena */}
      <div className="flex justify-between mb-3 px-2">
        {fighters.map((fighter, idx) => (
          <div key={fighter.monster.id} className={`flex items-center gap-2 ${idx === 1 ? 'flex-row-reverse' : ''}`}>
            <div className="text-sm font-bold text-white">{fighter.monster.name}</div>
            <div className="w-32 h-3 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-300"
                style={{ 
                  width: `${Math.max(0, (fighter.health / fighter.maxHealth) * 100)}%`,
                  background: fighter.health > fighter.maxHealth * 0.5 
                    ? 'linear-gradient(90deg, #22c55e, #4ade80)' 
                    : fighter.health > fighter.maxHealth * 0.25 
                    ? 'linear-gradient(90deg, #eab308, #facc15)'
                    : 'linear-gradient(90deg, #dc2626, #ef4444)',
                }}
              />
            </div>
            <span className="text-xs text-gray-400">{Math.max(0, Math.round(fighter.health))}</span>
          </div>
        ))}
      </div>
      
      <div 
        className="relative rounded-2xl overflow-hidden border border-gray-700"
        style={{ 
          width: CONFIG.BATTLE.arenaWidth,
          height: CONFIG.BATTLE.arenaHeight,
          background: 'linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
          boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.5)',
        }}
      >
        {/* Arena floor pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white/10 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-white/5 rounded-full" />
        
        {/* Projectiles and Effects SVG Layer */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 10 }}
        >
          <defs>
            <filter id="blur">
              <feGaussianBlur stdDeviation="3"/>
            </filter>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Render effects first (behind projectiles) */}
          {effects.map(renderEffect)}
          
          {/* Render projectiles */}
          {projectiles.map(renderProjectile)}
        </svg>
        
        {/* Fighters */}
        {fighters.map((fighter) => {
          const style = getFighterStyle(fighter);
          return (
            <div
              key={fighter.monster.id}
              className="absolute transition-all"
              style={{
                left: 0,
                top: 0,
                transform: style.transform,
                filter: style.filter,
                transitionDuration: fighter.state === 'dodging' ? '100ms' : '50ms',
                zIndex: 5,
              }}
            >
              {/* Shadow under monster */}
              <div 
                className="absolute left-1/2 bottom-0 -translate-x-1/2 rounded-full bg-black/30"
                style={{ width: 40, height: 10, filter: 'blur(3px)' }}
              />
              <MonsterSprite 
                monster={fighter.monster} 
                size={70} 
                isInBattle 
                fighter={fighter}
              />
              {/* State indicator */}
              {fighter.state === 'dodging' && (
                <div className="absolute inset-0 border-2 border-cyan-400 rounded-full animate-ping opacity-50" />
              )}
              {fighter.state === 'attacking' && (
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{ 
                    boxShadow: `0 0 20px ${fighter.monster.type.color}`,
                    animation: 'pulse 0.2s ease-out',
                  }}
                />
              )}
            </div>
          );
        })}
        
        {/* Winner overlay */}
        {winner && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
            <div className="text-center">
              <div className="text-6xl mb-3 animate-bounce">🏆</div>
              <div className="text-3xl font-bold text-white mb-1">{winner.name}</div>
              <div className="text-lg text-gray-400 mb-4">Victory!</div>
              <button
                onClick={onEnd}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl text-white font-bold transition-all hover:scale-105"
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Battle Log */}
      <div className="mt-3 p-3 bg-gray-900/70 rounded-xl max-h-28 overflow-y-auto border border-gray-800">
        {log.length === 0 ? (
          <div className="text-sm text-gray-500 text-center">Battle starting...</div>
        ) : (
          log.map((entry, idx) => (
            <div 
              key={idx} 
              className={`text-sm ${
                entry.includes('wins') ? 'text-yellow-400 font-bold' :
                entry.includes('dodged') ? 'text-cyan-400' :
                entry.includes('blasted') ? 'text-purple-400' :
                entry.includes('hit') ? 'text-orange-400' :
                'text-gray-400'
              }`}
            >
              {entry}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Egg Selection Modal with naming
const EggSelectionModal = ({ onSelect, onClose }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [monsterName, setMonsterName] = useState('');
  
  const handleConfirm = () => {
    if (selectedType) {
      onSelect(selectedType, monsterName);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-3xl p-6 max-w-lg w-full">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          {selectedType ? 'Name Your Monster' : 'Choose Your Egg'}
        </h2>
        
        {!selectedType ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {CONFIG.MONSTER_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className="p-4 rounded-2xl transition-all hover:scale-105"
                  style={{ 
                    background: `linear-gradient(135deg, ${type.color}30, ${type.color}10)`,
                    border: `2px solid ${type.color}50`,
                  }}
                >
                  <div 
                    className="w-16 h-20 mx-auto rounded-full flex items-center justify-center mb-2"
                    style={{ background: `${type.color}40` }}
                  >
                    <span className="text-3xl">🥚</span>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-white">{type.name}</div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={onClose}
              className="mt-4 w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-400"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <div className="mb-6">
              <div className="w-24 h-28 mx-auto rounded-full flex items-center justify-center mb-4"
                style={{ background: `${CONFIG.MONSTER_TYPES.find(t => t.id === selectedType)?.color}40` }}>
                <span className="text-5xl">🥚</span>
              </div>
              <p className="text-center text-gray-400 mb-4">
                {CONFIG.MONSTER_TYPES.find(t => t.id === selectedType)?.name} Egg
              </p>
              
              <label className="block text-sm text-gray-400 mb-2">Monster Name</label>
              <input
                type="text"
                value={monsterName}
                onChange={(e) => setMonsterName(e.target.value)}
                placeholder="Enter a name (or leave blank for random)"
                className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none"
                maxLength={20}
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">Leave blank for a random name</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedType(null)}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300"
              >
                ← Back
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl text-white font-bold"
              >
                Confirm
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Enemy Preview Modal - Shows generated enemy before battle
const EnemyPreviewModal = ({ playerMonster, enemy, onStartBattle, onReroll, onClose }) => {
  const playerStats = MonsterFactory.getEffectiveStats(playerMonster);
  const enemyStats = MonsterFactory.getEffectiveStats(enemy);
  
  // Round all stats for display
  const playerPower = Math.round(Object.values(playerStats).reduce((a, b) => a + b, 0));
  const enemyPower = Math.round(Object.values(enemyStats).reduce((a, b) => a + b, 0));
  const powerDiff = enemyPower - playerPower;
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-3xl p-6 max-w-lg w-full">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">Battle Preview</h2>
        
        {/* VS Display */}
        <div className="flex items-center justify-around mb-6">
          {/* Player Monster */}
          <div className="text-center">
            <MonsterSprite monster={playerMonster} size={80} />
            <h3 className="font-bold text-white mt-2">{playerMonster.name}</h3>
            <p className="text-xs text-gray-400">Lv.{playerMonster.level || 1} {playerMonster.type.name}</p>
            <div className="text-sm text-green-400 mt-1 font-bold">
              {playerPower} PWR
            </div>
          </div>
          
          {/* VS */}
          <div className="text-3xl font-bold text-gray-600">VS</div>
          
          {/* Enemy */}
          <div className="text-center">
            <MonsterSprite monster={enemy} size={80} />
            <h3 className="font-bold text-white mt-2">{enemy.name}</h3>
            <p className="text-xs text-gray-400">{enemy.type.name}</p>
            <div className="text-sm text-red-400 mt-1 font-bold">
              {enemyPower} PWR
            </div>
          </div>
        </div>
        
        {/* Power Comparison */}
        <div className="bg-gray-800/50 rounded-xl p-4 mb-4 text-center">
          {powerDiff > 10 ? (
            <p className="text-red-400">⚠️ Dangerous opponent! (+{powerDiff} power)</p>
          ) : powerDiff > 0 ? (
            <p className="text-yellow-400">Slightly stronger opponent (+{powerDiff})</p>
          ) : powerDiff < -10 ? (
            <p className="text-green-400">✓ You have the advantage! ({powerDiff})</p>
          ) : powerDiff < 0 ? (
            <p className="text-green-400">Slightly weaker opponent ({powerDiff})</p>
          ) : (
            <p className="text-gray-400">⚖️ Evenly matched!</p>
          )}
        </div>
        
        {/* Rewards Info */}
        <div className="bg-gray-800/50 rounded-xl p-3 mb-4">
          <p className="text-sm text-gray-400 text-center">
            Win to earn: <span className="text-yellow-400">{CONFIG.LEVELING.expPerWin} EXP</span> + <span className="text-yellow-400">{CONFIG.LEVELING.trainingPointsPerWin} Training Point</span>
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onReroll}
            className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 transition-all"
          >
            🎲 Reroll
          </button>
          <button
            onClick={onStartBattle}
            className="flex-1 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 rounded-xl text-white font-bold transition-all"
          >
            ⚔️ Fight!
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="mt-3 w-full py-2 text-gray-500 hover:text-gray-400 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
export default function MonsterGame() {
  const [monsters, setMonsters] = useState([]);
  const [selectedMonster, setSelectedMonster] = useState(null);
  const [showEggSelection, setShowEggSelection] = useState(false);
  const [battleState, setBattleState] = useState(null);
  const [selectedFighter, setSelectedFighter] = useState(null);
  const [currentEnemy, setCurrentEnemy] = useState(null);
  const [battleStats, setBattleStats] = useState({ wins: 0, losses: 0 });
  const [view, setView] = useState('care'); // 'care' | 'train' | 'battle'
  const [trainingMessage, setTrainingMessage] = useState(null);
  
  const battleRef = useRef(null);
  
  // Age tick effect
  useEffect(() => {
    const interval = setInterval(() => {
      setMonsters(prev => prev.map(m => MonsterFactory.tickAge(m)));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  
  // Battle loop
  useEffect(() => {
    if (battleState && !battleState.winner) {
      battleRef.current = setInterval(() => {
        setBattleState(prev => BattleEngine.processTick(prev));
      }, CONFIG.BATTLE.tickRate);
    }
    return () => clearInterval(battleRef.current);
  }, [battleState?.winner, battleState !== null]);
  
  // Update selected monster reference when monsters update
  useEffect(() => {
    if (selectedMonster) {
      const updated = monsters.find(m => m.id === selectedMonster.id);
      if (updated) setSelectedMonster(updated);
    }
  }, [monsters]);
  
  const handleCreateEgg = (typeId, customName) => {
    let newMonster = MonsterFactory.createEgg(typeId);
    if (customName && customName.trim()) {
      newMonster = MonsterFactory.setName(newMonster, customName);
    }
    setMonsters(prev => [...prev, newMonster]);
    setSelectedMonster(newMonster);
    setShowEggSelection(false);
  };
  
  const handleCare = (actionId) => {
    if (!selectedMonster) return;
    // Care only works for non-adults
    if (selectedMonster.stage === 'ADULT') return;
    setMonsters(prev => prev.map(m => 
      m.id === selectedMonster.id ? MonsterFactory.applyCare(m, actionId) : m
    ));
  };
  
  const handleTrain = (statName) => {
    if (!selectedMonster || selectedMonster.stage !== 'ADULT') return;
    
    const result = MonsterFactory.trainStat(selectedMonster, statName);
    if (result.success) {
      setMonsters(prev => prev.map(m => 
        m.id === selectedMonster.id ? result.monster : m
      ));
      setTrainingMessage({ type: 'success', text: result.message });
    } else {
      setTrainingMessage({ type: 'error', text: result.message });
    }
    
    // Clear message after 2 seconds
    setTimeout(() => setTrainingMessage(null), 2000);
  };
  
  const handleSelectFighter = (monster) => {
    setSelectedFighter(monster);
    // Immediately generate a matched enemy
    const enemy = EnemyFactory.generateMatchedEnemy(monster);
    setCurrentEnemy(enemy);
  };
  
  const handleRerollEnemy = () => {
    const enemy = EnemyFactory.generateMatchedEnemy(selectedFighter);
    setCurrentEnemy(enemy);
  };
  
  const handleStartBattle = () => {
    if (!selectedFighter || !currentEnemy) return;
    setBattleState(BattleEngine.createBattleState(selectedFighter, currentEnemy));
    setCurrentEnemy(null);
    setSelectedFighter(null);
    setView('battle');
  };
  
  const handleCancelBattleSetup = () => {
    setSelectedFighter(null);
    setCurrentEnemy(null);
  };
  
  const handleEndBattle = () => {
    // Track win/loss and award experience + training points
    if (battleState?.winner) {
      const isPlayerWin = !battleState.winner.isEnemy;
      const winnerId = battleState.winner.id;
      
      if (isPlayerWin) {
        setBattleStats(prev => ({ ...prev, wins: prev.wins + 1 }));
        
        // Award experience and training points to the winning monster
        setMonsters(prev => prev.map(m => {
          if (m.id === winnerId) {
            let updated = MonsterFactory.addExperience(m, CONFIG.LEVELING.expPerWin);
            updated = MonsterFactory.addTrainingPoints(updated, CONFIG.LEVELING.trainingPointsPerWin);
            return updated;
          }
          return m;
        }));
      } else {
        setBattleStats(prev => ({ ...prev, losses: prev.losses + 1 }));
      }
    }
    
    setBattleState(null);
    setView('care');
  };
  
  return (
    <div 
      className="min-h-screen p-4 sm:p-6"
      style={{ 
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Monster Arena
            </h1>
            <p className="text-gray-500 text-sm">Raise. Train. Battle.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-3 text-sm">
              <span className="text-green-400">🏆 {battleStats.wins}</span>
              <span className="text-red-400">💀 {battleStats.losses}</span>
            </div>
            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={() => setView('care')}
                className={`px-3 sm:px-4 py-2 rounded-xl transition-all text-sm sm:text-base ${
                  view === 'care' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                🏠 Care
              </button>
              <button
                onClick={() => setView('train')}
                className={`px-3 sm:px-4 py-2 rounded-xl transition-all text-sm sm:text-base ${
                  view === 'train' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                💪 Train
              </button>
              <button
                onClick={() => setView('battle')}
                className={`px-3 sm:px-4 py-2 rounded-xl transition-all text-sm sm:text-base ${
                  view === 'battle' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                ⚔️ Battle
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto">
        {view === 'care' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monster List */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Your Monsters</h2>
                <button
                  onClick={() => setShowEggSelection(true)}
                  className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm"
                >
                  + New Egg
                </button>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {monsters.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">🥚</div>
                    <p>No monsters yet!</p>
                    <p className="text-sm">Get your first egg to start</p>
                  </div>
                ) : (
                  monsters.map(monster => (
                    <MonsterCard
                      key={monster.id}
                      monster={monster}
                      isSelected={selectedMonster?.id === monster.id}
                      onClick={() => setSelectedMonster(monster)}
                      onSelect={handleSelectFighter}
                    />
                  ))
                )}
              </div>
            </div>
            
            {/* Selected Monster View */}
            <div className="lg:col-span-2">
              {selectedMonster ? (
                <div className="bg-gray-900/50 rounded-3xl p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <MonsterSprite monster={selectedMonster} size={120} showStats />
                    <div className="flex-1 text-center sm:text-left">
                      <h2 className="text-2xl font-bold text-white">{selectedMonster.name}</h2>
                      <p className="text-gray-400">
                        {selectedMonster.type.name} • {CONFIG.STAGES[selectedMonster.stage].name}
                        {selectedMonster.stage === 'ADULT' && ` • Lv.${selectedMonster.level || 1}`}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Care Points: {selectedMonster.carePoints}
                      </p>
                      
                      {/* Experience bar for adults */}
                      {selectedMonster.stage === 'ADULT' && (
                        <div className="mt-3 p-3 bg-gray-800/50 rounded-xl">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Experience</span>
                            <span>
                              {selectedMonster.exp || 0} / {MonsterFactory.getExpForLevel(selectedMonster.level || 1)} EXP
                            </span>
                          </div>
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                              style={{ 
                                width: `${((selectedMonster.exp || 0) / MonsterFactory.getExpForLevel(selectedMonster.level || 1)) * 100}%` 
                              }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Stat Ceiling: {selectedMonster.statCeiling || 50}
                          </p>
                        </div>
                      )}
                      
                      {selectedMonster.stage !== 'ADULT' && (
                        <div className="mt-3 p-3 bg-gray-800/50 rounded-xl">
                          <p className="text-xs text-gray-400 mb-1">Evolution Progress</p>
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                              style={{ 
                                width: `${(selectedMonster.age / CONFIG.STAGES[selectedMonster.stage].duration) * 100}%` 
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Care Actions (for eggs/infants) or Training Info (for adults) */}
                  <div className="mt-6">
                    {selectedMonster.stage !== 'ADULT' ? (
                      <>
                        <h3 className="text-sm font-bold text-gray-400 mb-3">Nurture Your Monster</h3>
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                          {CONFIG.CARE_ACTIONS.map(action => (
                            <CareButton
                              key={action.id}
                              action={action}
                              monster={selectedMonster}
                              onCare={handleCare}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-3 text-center sm:text-left">
                          💡 Nurturing builds your monster's stats before hatching! These become permanent.
                        </p>
                      </>
                    ) : (
                      <>
                        <h3 className="text-sm font-bold text-gray-400 mb-3">Battle Training</h3>
                        <div className="bg-gray-800/30 rounded-xl p-4">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm text-gray-300">Stat Progress</span>
                            <span className="text-sm text-gray-400">
                              {MonsterFactory.getStatProgress(selectedMonster).current} / {MonsterFactory.getStatProgress(selectedMonster).ceiling}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-3">
                            <div 
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                              style={{ 
                                width: `${(MonsterFactory.getStatProgress(selectedMonster).current / MonsterFactory.getStatProgress(selectedMonster).ceiling) * 100}%` 
                              }}
                            />
                          </div>
                          <p className="text-xs text-gray-500">
                            ⚔️ Battle with training focus to grow stats. Level up to increase stat ceiling!
                          </p>
                        </div>
                      </>
                    )}
                    
                    {/* Body Parts Info */}
                    {selectedMonster.stage !== 'EGG' && (
                      <div className="mt-4 p-3 bg-gray-800/30 rounded-xl">
                        <h4 className="text-xs font-bold text-gray-400 mb-2">Body Parts</h4>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(selectedMonster.bodyParts).map(([part, id]) => {
                            if (id === 'none') return null;
                            const partData = BodyPartGenerator.getPart(
                              part === 'tail' ? 'tails' : 
                              part === 'head' ? 'heads' : 
                              part === 'torso' ? 'torsos' : 
                              part + 's', 
                              id
                            );
                            return (
                              <span 
                                key={part}
                                className="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-300"
                              >
                                {partData?.name || id} {part}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-900/50 rounded-3xl p-12 text-center">
                  <div className="text-6xl mb-4">👈</div>
                  <p className="text-gray-400">Select a monster to care for</p>
                </div>
              )}
            </div>
          </div>
        ) : view === 'train' ? (
          /* Training View */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monster List */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-lg font-bold text-white">Select Monster</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {monsters.filter(m => m.stage === 'ADULT').length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">🐣</div>
                    <p>No adult monsters!</p>
                    <p className="text-sm">Raise your monsters to train them</p>
                  </div>
                ) : (
                  monsters.filter(m => m.stage === 'ADULT').map(monster => (
                    <MonsterCard
                      key={monster.id}
                      monster={monster}
                      isSelected={selectedMonster?.id === monster.id}
                      onClick={() => setSelectedMonster(monster)}
                    />
                  ))
                )}
              </div>
            </div>
            
            {/* Training Panel */}
            <div className="lg:col-span-2">
              {selectedMonster && selectedMonster.stage === 'ADULT' ? (
                <div className="bg-gray-900/50 rounded-3xl p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                    <MonsterSprite monster={selectedMonster} size={100} />
                    <div className="flex-1 text-center sm:text-left">
                      <h2 className="text-2xl font-bold text-white">{selectedMonster.name}</h2>
                      <p className="text-gray-400">Level {selectedMonster.level || 1} • {selectedMonster.type.name}</p>
                      
                      {/* Training Points */}
                      <div className="mt-3 p-3 bg-yellow-500/20 rounded-xl border border-yellow-500/30">
                        <div className="flex items-center justify-between">
                          <span className="text-yellow-400 font-bold">⭐ Training Points</span>
                          <span className="text-2xl font-bold text-yellow-300">{selectedMonster.trainingPoints || 0}</span>
                        </div>
                        <p className="text-xs text-yellow-400/70 mt-1">Earn points by winning battles</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stat Progress */}
                  <div className="mb-4 p-3 bg-gray-800/50 rounded-xl">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Stat Progress</span>
                      <span className="text-gray-300">
                        {MonsterFactory.getStatProgress(selectedMonster).current} / {MonsterFactory.getStatProgress(selectedMonster).ceiling}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                        style={{ 
                          width: `${Math.min(100, (MonsterFactory.getStatProgress(selectedMonster).current / MonsterFactory.getStatProgress(selectedMonster).ceiling) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Training Message */}
                  {trainingMessage && (
                    <div className={`mb-4 p-3 rounded-xl text-center ${
                      trainingMessage.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {trainingMessage.text}
                    </div>
                  )}
                  
                  {/* Training Options */}
                  <h3 className="text-sm font-bold text-gray-400 mb-3">Train Stats (1 point each)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CONFIG.TRAINING_TYPES.map(training => {
                      const currentStat = MonsterFactory.getEffectiveStats(selectedMonster)[training.stat];
                      const canTrain = (selectedMonster.trainingPoints || 0) >= training.cost && 
                                       MonsterFactory.canGainStats(selectedMonster);
                      
                      return (
                        <button
                          key={training.id}
                          onClick={() => handleTrain(training.stat)}
                          disabled={!canTrain}
                          className={`p-4 rounded-xl transition-all flex items-center gap-4 ${
                            canTrain 
                              ? 'bg-gray-800 hover:bg-gray-700 cursor-pointer' 
                              : 'bg-gray-800/50 opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <div className="text-3xl">{training.emoji}</div>
                          <div className="flex-1 text-left">
                            <div className="font-bold text-white capitalize">{training.stat}</div>
                            <div className="text-xs text-gray-400">{training.description}</div>
                            <div className="text-sm text-gray-300 mt-1">Current: {currentStat}</div>
                          </div>
                          <div className="text-yellow-400 font-bold">+1</div>
                        </button>
                      );
                    })}
                  </div>
                  
                  {!MonsterFactory.canGainStats(selectedMonster) && (
                    <p className="text-center text-yellow-400 text-sm mt-4">
                      ⚠️ Stat ceiling reached! Level up to increase ceiling.
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-gray-900/50 rounded-3xl p-12 text-center">
                  <div className="text-6xl mb-4">💪</div>
                  <p className="text-gray-400 mb-2">Select an adult monster to train</p>
                  <p className="text-gray-500 text-sm">Win battles to earn training points!</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Battle View */
          <div className="flex flex-col items-center">
            {battleState ? (
              <BattleArena battleState={battleState} onEnd={handleEndBattle} />
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚔️</div>
                <h2 className="text-2xl font-bold text-white mb-2">Battle Arena</h2>
                <p className="text-gray-400 mb-6">
                  Select an adult monster from the Care tab and click ⚔️ to battle!
                </p>
                <button
                  onClick={() => setView('care')}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-white"
                >
                  Go to Care
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Modals */}
      {showEggSelection && (
        <EggSelectionModal
          onSelect={handleCreateEgg}
          onClose={() => setShowEggSelection(false)}
        />
      )}
      
      {currentEnemy && selectedFighter && (
        <EnemyPreviewModal
          playerMonster={selectedFighter}
          enemy={currentEnemy}
          onStartBattle={handleStartBattle}
          onReroll={handleRerollEnemy}
          onClose={handleCancelBattleSetup}
        />
      )}
    </div>
  );
}
