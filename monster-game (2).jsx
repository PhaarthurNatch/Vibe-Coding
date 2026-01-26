import React, { useState, useEffect, useRef, useCallback } from 'react';

// ============================================================================
// CONFIGURATION MODULE - Easy to modify game constants
// ============================================================================
const CONFIG = {
  // Monster Types - Add/remove monster types here
  MONSTER_TYPES: [
    { id: 'fire', name: 'Infernal', color: '#ff6b35', secondaryColor: '#ffaa00', baseStats: { strength: 12, constitution: 8, agility: 10, power: 14, intelligence: 8 }, description: 'Born from volcanic flames, Infernal monsters burn with fierce determination. They excel at overwhelming opponents with raw power and aggression.' },
    { id: 'water', name: 'Aquatic', color: '#4ecdc4', secondaryColor: '#0077b6', baseStats: { strength: 8, constitution: 12, agility: 12, power: 10, intelligence: 10 }, description: 'Creatures of the deep, Aquatic monsters flow like water itself. They adapt to any situation with balanced capabilities and fluid movements.' },
    { id: 'earth', name: 'Terran', color: '#95d5b2', secondaryColor: '#2d6a4f', baseStats: { strength: 14, constitution: 14, agility: 6, power: 8, intelligence: 10 }, description: 'Solid as stone, Terran monsters are immovable forces of nature. They endure punishment that would fell lesser creatures and strike with devastating force.' },
    { id: 'shadow', name: 'Umbral', color: '#7b2cbf', secondaryColor: '#3c096c', baseStats: { strength: 10, constitution: 8, agility: 14, power: 12, intelligence: 8 }, description: 'Emerging from darkness itself, Umbral monsters strike from the shadows. Their blinding speed and mystical power make them deadly assassins.' },
    { id: 'crystal', name: 'Prismatic', color: '#f72585', secondaryColor: '#7209b7', baseStats: { strength: 8, constitution: 10, agility: 8, power: 14, intelligence: 12 }, description: 'Formed from pure magical energy, Prismatic monsters shimmer with arcane power. They channel devastating magical attacks and outwit their foes.' },
  ],
  
  // Personality Traits - Combined to form personality descriptions
  PERSONALITY_TRAITS: {
    energy: ['lazy', 'calm', 'steady', 'energetic', 'hyperactive'],
    temperament: ['timid', 'gentle', 'balanced', 'bold', 'fierce'],
    social: ['solitary', 'reserved', 'friendly', 'playful', 'attention-seeking'],
    focus: ['easily distracted', 'curious', 'observant', 'focused', 'single-minded'],
  },
  
  // ============================================================================
  // BODY TYPES - Defines the fundamental body structure and locomotion
  // ============================================================================
  BODY_TYPES: [
    { 
      id: 'bipedal', 
      name: 'Bipedal', 
      description: 'Walks on two legs',
      weight: 1,
      hasArms: true,
      legCount: 2,
      canFly: false,
      statModifiers: { strength: 1, constitution: 0, agility: 0, power: 0, intelligence: 1 },
    },
    { 
      id: 'quadruped', 
      name: 'Quadruped', 
      description: 'Walks on four legs',
      weight: 1,
      hasArms: false,
      legCount: 4,
      canFly: false,
      statModifiers: { strength: 2, constitution: 2, agility: 1, power: -1, intelligence: -1 },
    },
    { 
      id: 'hexapod', 
      name: 'Hexapod', 
      description: 'Six-legged insectoid',
      weight: 1,
      hasArms: false,
      legCount: 6,
      canFly: false,
      statModifiers: { strength: 1, constitution: 3, agility: 2, power: -2, intelligence: 0 },
    },
    { 
      id: 'serpentine', 
      name: 'Serpentine', 
      description: 'Slithers without legs',
      weight: 1,
      hasArms: false,
      legCount: 0,
      canFly: false,
      statModifiers: { strength: 0, constitution: 1, agility: 3, power: 1, intelligence: 0 },
    },
    { 
      id: 'floater', 
      name: 'Floater', 
      description: 'Hovers above ground',
      weight: 1,
      hasArms: true,
      legCount: 0,
      canFly: true,
      statModifiers: { strength: -2, constitution: -1, agility: 2, power: 3, intelligence: 2 },
    },
    { 
      id: 'hopper', 
      name: 'Hopper', 
      description: 'Jumps to move',
      weight: 1,
      hasArms: true,
      legCount: 2,
      canFly: false,
      statModifiers: { strength: 1, constitution: 0, agility: 4, power: 0, intelligence: 0 },
    },
    { 
      id: 'centauroid', 
      name: 'Centauroid', 
      description: 'Four legs with upright torso',
      weight: 1,
      hasArms: true,
      legCount: 4,
      canFly: false,
      statModifiers: { strength: 3, constitution: 2, agility: 0, power: 1, intelligence: 1 },
    },
    { 
      id: 'amorphous', 
      name: 'Amorphous', 
      description: 'Blob-like, no fixed form',
      weight: 1,
      hasArms: false,
      legCount: 0,
      canFly: false,
      statModifiers: { strength: -1, constitution: 4, agility: -1, power: 2, intelligence: 1 },
    },
    { 
      id: 'arachnid', 
      name: 'Arachnid', 
      description: 'Spider-like with eight legs',
      weight: 1,
      hasArms: true,
      legCount: 8,
      canFly: false,
      statModifiers: { strength: 0, constitution: 1, agility: 3, power: 0, intelligence: 2 },
    },
    { 
      id: 'winged', 
      name: 'Winged', 
      description: 'Flies with wings',
      weight: 1,
      hasArms: false,
      legCount: 2,
      canFly: true,
      statModifiers: { strength: 0, constitution: -1, agility: 3, power: 2, intelligence: 1 },
    },
  ],
  
  // ============================================================================
  // BODY PARTS MODULE - Expanded with more anatomical variety
  // Each part has: id, name, render function, and optional rarity weight
  // ============================================================================
  BODY_PARTS: {
    heads: [
      { id: 'round', name: 'Round', weight: 1, render: (color) => `<circle cx="50" cy="30" r="20" fill="${color}"/>` },
      { id: 'angular', name: 'Angular', weight: 1, render: (color) => `<polygon points="50,10 70,35 60,50 40,50 30,35" fill="${color}"/>` },
      { id: 'oval', name: 'Oval', weight: 1, render: (color) => `<ellipse cx="50" cy="30" rx="18" ry="22" fill="${color}"/>` },
      { id: 'square', name: 'Square', weight: 1, render: (color) => `<rect x="32" y="12" width="36" height="36" rx="5" fill="${color}"/>` },
      { id: 'star', name: 'Star', weight: 1, render: (color) => `<polygon points="50,8 56,28 78,28 60,40 68,60 50,48 32,60 40,40 22,28 44,28" fill="${color}" transform="scale(0.7) translate(21, 5)"/>` },
      { id: 'pointed', name: 'Pointed', weight: 1, render: (color) => `<path d="M50,5 L70,45 L50,38 L30,45 Z" fill="${color}"/>` },
      { id: 'flat', name: 'Flat', weight: 1, render: (color) => `<ellipse cx="50" cy="32" rx="24" ry="16" fill="${color}"/>` },
      { id: 'skull', name: 'Skull', weight: 1, render: (color) => `<circle cx="50" cy="28" r="18" fill="${color}"/><ellipse cx="50" cy="42" rx="10" ry="8" fill="${color}"/>` },
      { id: 'heart', name: 'Heart', weight: 1, render: (color) => `<path d="M50,48 C50,48 25,30 25,18 C25,8 35,5 50,18 C65,5 75,8 75,18 C75,30 50,48 50,48" fill="${color}"/>` },
      { id: 'crescent', name: 'Crescent', weight: 1, render: (color) => `<path d="M30,30 Q30,10 50,10 Q70,10 70,30 Q70,50 50,50 Q30,50 30,30 M40,30 Q40,20 50,20 Q60,20 60,30 Q60,40 50,40 Q40,40 40,30" fill="${color}" fill-rule="evenodd"/>` },
      { id: 'droplet', name: 'Droplet', weight: 1, render: (color) => `<path d="M50,8 Q70,30 70,40 Q70,55 50,55 Q30,55 30,40 Q30,30 50,8" fill="${color}"/>` },
      { id: 'mushroom', name: 'Mushroom', weight: 1, render: (color) => `<ellipse cx="50" cy="25" rx="25" ry="18" fill="${color}"/><rect x="42" y="35" width="16" height="15" fill="${color}"/>` },
      { id: 'triangle', name: 'Triangle', weight: 1, render: (color) => `<polygon points="50,8 75,50 25,50" fill="${color}"/>` },
      { id: 'diamond', name: 'Diamond', weight: 1, render: (color) => `<polygon points="50,5 75,30 50,55 25,30" fill="${color}"/>` },
    ],
    
    // Eyes - variable count (0-4) with animation classes
    eyes: [
      { id: 'none', name: 'Eyeless', weight: 1, count: 0, render: () => `` },
      { id: 'single', name: 'Cyclops', weight: 1, count: 1, render: () => `
        <g class="eye-group">
          <circle cx="50" cy="28" r="8" fill="#fff"/>
          <g class="eye-blink"><circle cx="50" cy="28" r="8" fill="#fff"/></g>
          <g class="pupil"><circle cx="50" cy="29" r="4" fill="#111"/></g>
        </g>` },
      { id: 'round', name: 'Round', weight: 1, count: 2, render: () => `
        <g class="eye-group">
          <circle cx="42" cy="28" r="5" fill="#fff"/><circle cx="58" cy="28" r="5" fill="#fff"/>
          <g class="eye-blink"><ellipse cx="42" cy="28" rx="5" ry="5" fill="#fff"/><ellipse cx="58" cy="28" rx="5" ry="5" fill="#fff"/></g>
          <g class="pupil"><circle cx="43" cy="29" r="2.5" fill="#111"/><circle cx="59" cy="29" r="2.5" fill="#111"/></g>
        </g>` },
      { id: 'angry', name: 'Angry', weight: 1, count: 2, render: () => `
        <g class="eye-group angry-eyes">
          <ellipse cx="42" cy="28" rx="6" ry="4" fill="#fff"/><ellipse cx="58" cy="28" rx="6" ry="4" fill="#fff"/>
          <g class="eye-blink"><ellipse cx="42" cy="28" rx="6" ry="4" fill="#fff"/><ellipse cx="58" cy="28" rx="6" ry="4" fill="#fff"/></g>
          <g class="pupil"><circle cx="42" cy="29" r="2.5" fill="#111"/><circle cx="58" cy="29" r="2.5" fill="#111"/></g>
          <g class="eyebrows"><line x1="35" y1="21" x2="49" y2="25" stroke="#111" stroke-width="2.5" stroke-linecap="round"/><line x1="65" y1="21" x2="51" y2="25" stroke="#111" stroke-width="2.5" stroke-linecap="round"/></g>
        </g>` },
      { id: 'cute', name: 'Cute', weight: 1, count: 2, render: () => `
        <g class="eye-group cute-eyes">
          <circle cx="42" cy="30" r="8" fill="#111"/><circle cx="58" cy="30" r="8" fill="#111"/>
          <g class="eye-blink"><circle cx="42" cy="30" r="8" fill="#111"/><circle cx="58" cy="30" r="8" fill="#111"/></g>
          <g class="pupil eye-shine"><circle cx="44" cy="27" r="3.5" fill="#fff"/><circle cx="60" cy="27" r="3.5" fill="#fff"/><circle cx="40" cy="32" r="1.5" fill="#fff" opacity="0.5"/><circle cx="56" cy="32" r="1.5" fill="#fff" opacity="0.5"/></g>
        </g>` },
      { id: 'sleepy', name: 'Sleepy', weight: 1, count: 2, render: () => `
        <g class="eye-group sleepy-eyes">
          <path d="M36,28 Q42,32 48,28" stroke="#111" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <path d="M52,28 Q58,32 64,28" stroke="#111" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        </g>` },
      { id: 'three', name: 'Three-Eyed', weight: 1, count: 3, render: () => `
        <g class="eye-group">
          <circle cx="35" cy="28" r="4" fill="#fff"/><circle cx="50" cy="20" r="5" fill="#fff"/><circle cx="65" cy="28" r="4" fill="#fff"/>
          <g class="eye-blink"><circle cx="35" cy="28" r="4" fill="#fff"/><circle cx="50" cy="20" r="5" fill="#fff"/><circle cx="65" cy="28" r="4" fill="#fff"/></g>
          <g class="pupil"><circle cx="35" cy="29" r="2" fill="#111"/><circle cx="50" cy="21" r="2.5" fill="#111"/><circle cx="65" cy="29" r="2" fill="#111"/></g>
        </g>` },
      { id: 'four', name: 'Four-Eyed', weight: 1, count: 4, render: () => `
        <g class="eye-group">
          <circle cx="38" cy="24" r="4" fill="#fff"/><circle cx="62" cy="24" r="4" fill="#fff"/><circle cx="38" cy="36" r="4" fill="#fff"/><circle cx="62" cy="36" r="4" fill="#fff"/>
          <g class="eye-blink"><circle cx="38" cy="24" r="4" fill="#fff"/><circle cx="62" cy="24" r="4" fill="#fff"/><circle cx="38" cy="36" r="4" fill="#fff"/><circle cx="62" cy="36" r="4" fill="#fff"/></g>
          <g class="pupil"><circle cx="38" cy="25" r="2" fill="#111"/><circle cx="62" cy="25" r="2" fill="#111"/><circle cx="38" cy="37" r="2" fill="#111"/><circle cx="62" cy="37" r="2" fill="#111"/></g>
        </g>` },
      { id: 'tiny', name: 'Tiny', weight: 1, count: 2, render: () => `
        <g class="eye-group tiny-eyes">
          <g class="pupil"><circle cx="45" cy="28" r="2.5" fill="#111"/><circle cx="55" cy="28" r="2.5" fill="#111"/></g>
        </g>` },
      { id: 'glowing', name: 'Glowing', weight: 1, count: 2, render: (_, sc) => `
        <g class="eye-group glowing-eyes">
          <circle cx="42" cy="28" r="6" fill="${sc}" class="eye-glow"/><circle cx="58" cy="28" r="6" fill="${sc}" class="eye-glow"/>
          <g class="pupil eye-shine"><circle cx="42" cy="28" r="3" fill="#fff" opacity="0.8"/><circle cx="58" cy="28" r="3" fill="#fff" opacity="0.8"/></g>
        </g>` },
      { id: 'compound', name: 'Compound', weight: 1, count: 2, render: (_, sc) => `
        <g class="eye-group compound-eyes">
          <ellipse cx="40" cy="28" rx="9" ry="7" fill="${sc}" opacity="0.8"/><ellipse cx="60" cy="28" rx="9" ry="7" fill="${sc}" opacity="0.8"/>
          <g fill="#111" opacity="0.3" class="compound-facets">
            <circle cx="36" cy="25" r="1.5"/><circle cx="40" cy="25" r="1.5"/><circle cx="44" cy="25" r="1.5"/>
            <circle cx="36" cy="28" r="1.5"/><circle cx="40" cy="28" r="1.5"/><circle cx="44" cy="28" r="1.5"/>
            <circle cx="36" cy="31" r="1.5"/><circle cx="40" cy="31" r="1.5"/><circle cx="44" cy="31" r="1.5"/>
            <circle cx="56" cy="25" r="1.5"/><circle cx="60" cy="25" r="1.5"/><circle cx="64" cy="25" r="1.5"/>
            <circle cx="56" cy="28" r="1.5"/><circle cx="60" cy="28" r="1.5"/><circle cx="64" cy="28" r="1.5"/>
            <circle cx="56" cy="31" r="1.5"/><circle cx="60" cy="31" r="1.5"/><circle cx="64" cy="31" r="1.5"/>
          </g>
        </g>` },
      { id: 'wide', name: 'Wide', weight: 1, count: 2, render: () => `
        <g class="eye-group wide-eyes">
          <ellipse cx="40" cy="28" rx="10" ry="7" fill="#fff"/><ellipse cx="60" cy="28" rx="10" ry="7" fill="#fff"/>
          <g class="eye-blink"><ellipse cx="40" cy="28" rx="10" ry="7" fill="#fff"/><ellipse cx="60" cy="28" rx="10" ry="7" fill="#fff"/></g>
          <g class="pupil"><circle cx="40" cy="29" r="4" fill="#111"/><circle cx="60" cy="29" r="4" fill="#111"/><circle cx="42" cy="27" r="1.5" fill="#fff"/><circle cx="62" cy="27" r="1.5" fill="#fff"/></g>
        </g>` },
      { id: 'narrow', name: 'Narrow', weight: 1, count: 2, render: () => `
        <g class="eye-group narrow-eyes">
          <ellipse cx="42" cy="28" rx="8" ry="3" fill="#fff"/><ellipse cx="58" cy="28" rx="8" ry="3" fill="#fff"/>
          <g class="eye-blink"><ellipse cx="42" cy="28" rx="8" ry="3" fill="#fff"/><ellipse cx="58" cy="28" rx="8" ry="3" fill="#fff"/></g>
          <g class="pupil"><ellipse cx="42" cy="28" rx="2" ry="2" fill="#111"/><ellipse cx="58" cy="28" rx="2" ry="2" fill="#111"/></g>
        </g>` },
      { id: 'sad', name: 'Sad', weight: 1, count: 2, render: () => `
        <g class="eye-group sad-eyes">
          <ellipse cx="42" cy="30" rx="6" ry="5" fill="#fff"/><ellipse cx="58" cy="30" rx="6" ry="5" fill="#fff"/>
          <g class="eye-blink"><ellipse cx="42" cy="30" rx="6" ry="5" fill="#fff"/><ellipse cx="58" cy="30" rx="6" ry="5" fill="#fff"/></g>
          <g class="pupil"><circle cx="42" cy="31" r="2.5" fill="#111"/><circle cx="58" cy="31" r="2.5" fill="#111"/></g>
          <g class="eyebrows"><path d="M36,24 Q42,27 48,24" stroke="#111" stroke-width="2" fill="none"/><path d="M52,24 Q58,27 64,24" stroke="#111" stroke-width="2" fill="none"/></g>
        </g>` },
      { id: 'spiral', name: 'Spiral', weight: 1, count: 2, render: (_, sc) => `
        <g class="eye-group spiral-eyes">
          <circle cx="42" cy="28" r="6" fill="#fff"/><circle cx="58" cy="28" r="6" fill="#fff"/>
          <g class="pupil spiral-pupil">
            <circle cx="42" cy="28" r="5" fill="none" stroke="${sc}" stroke-width="1.5"/>
            <circle cx="42" cy="28" r="3" fill="none" stroke="${sc}" stroke-width="1"/>
            <circle cx="42" cy="28" r="1" fill="${sc}"/>
            <circle cx="58" cy="28" r="5" fill="none" stroke="${sc}" stroke-width="1.5"/>
            <circle cx="58" cy="28" r="3" fill="none" stroke="${sc}" stroke-width="1"/>
            <circle cx="58" cy="28" r="1" fill="${sc}"/>
          </g>
        </g>` },
      { id: 'star', name: 'Star', weight: 1, count: 2, render: (_, sc) => `
        <g class="eye-group star-eyes">
          <polygon points="42,22 44,26 48,26 45,29 46,33 42,31 38,33 39,29 36,26 40,26" fill="${sc}"/>
          <polygon points="58,22 60,26 64,26 61,29 62,33 58,31 54,33 55,29 52,26 56,26" fill="${sc}"/>
          <g class="pupil eye-shine"><circle cx="42" cy="27" r="2" fill="#fff" opacity="0.7"/><circle cx="58" cy="27" r="2" fill="#fff" opacity="0.7"/></g>
        </g>` },
      { id: 'heart', name: 'Heart', weight: 1, count: 2, render: (_, sc) => `
        <g class="eye-group heart-eyes">
          <path d="M42,34 C42,34 34,28 34,24 C34,20 38,20 42,24 C46,20 50,20 50,24 C50,28 42,34 42,34" fill="${sc}"/>
          <path d="M58,34 C58,34 50,28 50,24 C50,20 54,20 58,24 C62,20 66,20 66,24 C66,28 58,34 58,34" fill="${sc}"/>
          <g class="pupil eye-shine"><circle cx="40" cy="25" r="1.5" fill="#fff" opacity="0.6"/><circle cx="56" cy="25" r="1.5" fill="#fff" opacity="0.6"/></g>
        </g>` },
      { id: 'x', name: 'X Eyes', weight: 1, count: 2, render: () => `
        <g class="eye-group x-eyes">
          <g class="pupil">
            <line x1="38" y1="24" x2="46" y2="32" stroke="#111" stroke-width="3" stroke-linecap="round"/>
            <line x1="46" y1="24" x2="38" y2="32" stroke="#111" stroke-width="3" stroke-linecap="round"/>
            <line x1="54" y1="24" x2="62" y2="32" stroke="#111" stroke-width="3" stroke-linecap="round"/>
            <line x1="62" y1="24" x2="54" y2="32" stroke="#111" stroke-width="3" stroke-linecap="round"/>
          </g>
        </g>` },
      { id: 'slit', name: 'Slit', weight: 1, count: 2, render: (_, sc) => `
        <g class="eye-group slit-eyes">
          <ellipse cx="42" cy="28" rx="7" ry="6" fill="${sc}"/>
          <ellipse cx="58" cy="28" rx="7" ry="6" fill="${sc}"/>
          <g class="pupil"><ellipse cx="42" cy="28" rx="1.5" ry="5" fill="#111"/><ellipse cx="58" cy="28" rx="1.5" ry="5" fill="#111"/></g>
        </g>` },
    ],
    
    // Mouths - removed (expression through eyes and emojis only)
    mouths: [
      { id: 'none', name: 'None', weight: 1, render: () => `` },
    ],
    
    // Cheeks - for blush expressions
    cheeks: [
      { id: 'none', name: 'None', weight: 1, render: () => `` },
      { id: 'blush', name: 'Blush', weight: 1, render: () => `<g class="cheeks cheeks-blush"><ellipse cx="32" cy="38" rx="6" ry="4" fill="#ff6b6b" opacity="0.4"/><ellipse cx="68" cy="38" rx="6" ry="4" fill="#ff6b6b" opacity="0.4"/></g>` },
      { id: 'freckles', name: 'Freckles', weight: 1, render: (color) => `<g class="cheeks cheeks-freckles"><circle cx="30" cy="36" r="1" fill="${color}" opacity="0.5"/><circle cx="34" cy="38" r="1" fill="${color}" opacity="0.5"/><circle cx="32" cy="40" r="1" fill="${color}" opacity="0.5"/><circle cx="66" cy="36" r="1" fill="${color}" opacity="0.5"/><circle cx="70" cy="38" r="1" fill="${color}" opacity="0.5"/><circle cx="68" cy="40" r="1" fill="${color}" opacity="0.5"/></g>` },
      { id: 'rosy', name: 'Rosy', weight: 1, render: () => `<g class="cheeks cheeks-rosy"><circle cx="32" cy="38" r="5" fill="#ffaaaa" opacity="0.3"/><circle cx="68" cy="38" r="5" fill="#ffaaaa" opacity="0.3"/></g>` },
      { id: 'sparkle', name: 'Sparkle', weight: 1, render: () => `<g class="cheeks cheeks-sparkle"><path d="M30,36 L32,34 L34,36 L32,38 Z" fill="#fff" opacity="0.8"/><path d="M66,36 L68,34 L70,36 L68,38 Z" fill="#fff" opacity="0.8"/></g>` },
    ],
    
    ears: [
      { id: 'none', name: 'None', weight: 1, render: () => `` },
      { id: 'pointed', name: 'Pointed', weight: 1, render: (color) => `<g class="ear-left"><polygon points="28,30 20,5 35,20" fill="${color}"/></g><g class="ear-right"><polygon points="72,30 80,5 65,20" fill="${color}"/></g>` },
      { id: 'round', name: 'Round', weight: 1, render: (color) => `<g class="ear-left"><circle cx="25" cy="20" r="10" fill="${color}"/></g><g class="ear-right"><circle cx="75" cy="20" r="10" fill="${color}"/></g>` },
      { id: 'floppy', name: 'Floppy', weight: 1, render: (color) => `<g class="ear-floppy-left"><ellipse cx="22" cy="35" rx="8" ry="15" fill="${color}" transform="rotate(-20, 22, 35)"/></g><g class="ear-floppy-right"><ellipse cx="78" cy="35" rx="8" ry="15" fill="${color}" transform="rotate(20, 78, 35)"/></g>` },
      { id: 'bat', name: 'Bat', weight: 1, render: (color) => `<g class="ear-left"><path d="M30,25 L15,5 L20,20 L10,15 L25,30" fill="${color}"/></g><g class="ear-right"><path d="M70,25 L85,5 L80,20 L90,15 L75,30" fill="${color}"/></g>` },
      { id: 'fin', name: 'Fin', weight: 1, render: (color) => `<g class="ear-fin"><path d="M50,8 L55,0 L50,5 L45,0 Z" fill="${color}"/></g>` },
      { id: 'antenna', name: 'Antenna', weight: 1, render: (color) => `<g class="antenna-left"><path d="M40,15 Q35,0 30,-5" stroke="${color}" stroke-width="2" fill="none"/><circle cx="30" cy="-5" r="3" fill="${color}"/></g><g class="antenna-right"><path d="M60,15 Q65,0 70,-5" stroke="${color}" stroke-width="2" fill="none"/><circle cx="70" cy="-5" r="3" fill="${color}"/></g>` },
      { id: 'cat', name: 'Cat', weight: 1, render: (color) => `<g class="ear-left"><polygon points="30,25 22,5 38,18" fill="${color}"/><polygon points="32,22 26,10 36,18" fill="#ffcccc" opacity="0.5"/></g><g class="ear-right"><polygon points="70,25 78,5 62,18" fill="${color}"/><polygon points="68,22 74,10 64,18" fill="#ffcccc" opacity="0.5"/></g>` },
      { id: 'long', name: 'Long', weight: 1, render: (color) => `<g class="ear-left"><ellipse cx="20" cy="20" rx="6" ry="20" fill="${color}" transform="rotate(-15, 20, 20)"/></g><g class="ear-right"><ellipse cx="80" cy="20" rx="6" ry="20" fill="${color}" transform="rotate(15, 80, 20)"/></g>` },
      { id: 'feathered', name: 'Feathered', weight: 1, render: (color, sc) => `<g class="ear-left"><path d="M28,25 L18,10 L22,18 L15,5 L25,20" fill="${color}"/><path d="M26,22 L20,12" stroke="${sc}" stroke-width="1"/></g><g class="ear-right"><path d="M72,25 L82,10 L78,18 L85,5 L75,20" fill="${color}"/><path d="M74,22 L80,12" stroke="${sc}" stroke-width="1"/></g>` },
      { id: 'tiny', name: 'Tiny', weight: 1, render: (color) => `<g class="ear-left"><circle cx="30" cy="20" r="5" fill="${color}"/></g><g class="ear-right"><circle cx="70" cy="20" r="5" fill="${color}"/></g>` },
      { id: 'droopy', name: 'Droopy', weight: 1, render: (color) => `<g class="ear-left"><path d="M30,20 Q15,25 18,45" stroke="${color}" stroke-width="8" fill="none" stroke-linecap="round"/></g><g class="ear-right"><path d="M70,20 Q85,25 82,45" stroke="${color}" stroke-width="8" fill="none" stroke-linecap="round"/></g>` },
    ],
    
    // Horns - variable count (0-3)
    horns: [
      { id: 'none', name: 'None', weight: 1, count: 0, render: () => `` },
      { id: 'single', name: 'Unicorn', weight: 1, count: 1, render: (color) => `<polygon points="50,12 46,-15 54,-15" fill="${color}"/>` },
      { id: 'small', name: 'Small', weight: 1, count: 2, render: (color) => `<polygon points="38,15 42,0 46,15" fill="${color}"/><polygon points="54,15 58,0 62,15" fill="${color}"/>` },
      { id: 'curved', name: 'Curved', weight: 1, count: 2, render: (color) => `<path d="M35,18 Q25,-5 40,10" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M65,18 Q75,-5 60,10" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round"/>` },
      { id: 'demon', name: 'Demon', weight: 1, count: 2, render: (color) => `<path d="M32,20 L20,-5 L38,15" fill="${color}"/><path d="M68,20 L80,-5 L62,15" fill="${color}"/>` },
      { id: 'antlers', name: 'Antlers', weight: 1, count: 2, render: (color) => `<path d="M35,15 L30,0 M30,0 L25,-5 M30,0 L35,-5" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M65,15 L70,0 M70,0 L75,-5 M70,0 L65,-5" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round"/>` },
      { id: 'triple', name: 'Triple Crown', weight: 1, count: 3, render: (color) => `<polygon points="35,15 38,0 41,15" fill="${color}"/><polygon points="47,12 50,-5 53,12" fill="${color}"/><polygon points="59,15 62,0 65,15" fill="${color}"/>` },
      { id: 'ridge', name: 'Ridge', weight: 1, count: 5, render: (color) => `<path d="M35,15 L37,5 L42,12 L47,2 L52,12 L57,5 L62,15" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round"/>` },
      { id: 'ram', name: 'Ram', weight: 1, count: 2, render: (color) => `<path d="M30,20 Q15,15 15,30 Q15,40 25,35" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M70,20 Q85,15 85,30 Q85,40 75,35" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/>` },
      { id: 'crystal', name: 'Crystal', weight: 1, count: 2, render: (_, sc) => `<polygon points="38,15 35,0 40,-8 45,0 42,15" fill="${sc}" opacity="0.7"/><polygon points="58,15 55,0 60,-8 65,0 62,15" fill="${sc}" opacity="0.7"/>` },
      { id: 'nubs', name: 'Nubs', weight: 1, count: 2, render: (color) => `<ellipse cx="38" cy="15" rx="5" ry="4" fill="${color}"/><ellipse cx="62" cy="15" rx="5" ry="4" fill="${color}"/>` },
      { id: 'spikes', name: 'Spikes', weight: 1, count: 4, render: (color) => `<polygon points="32,15 34,2 36,15" fill="${color}"/><polygon points="42,12 44,-2 46,12" fill="${color}"/><polygon points="54,12 56,-2 58,12" fill="${color}"/><polygon points="64,15 66,2 68,15" fill="${color}"/>` },
    ],
    
    // Upper torso
    upperTorso: [
      { id: 'broad', name: 'Broad', weight: 1, render: (color) => `<path d="M28,48 L25,62 L75,62 L72,48 Q50,42 28,48" fill="${color}"/>` },
      { id: 'slim', name: 'Slim', weight: 1, render: (color) => `<ellipse cx="50" cy="55" rx="18" ry="12" fill="${color}"/>` },
      { id: 'round', name: 'Round', weight: 1, render: (color) => `<ellipse cx="50" cy="55" rx="22" ry="14" fill="${color}"/>` },
      { id: 'armored', name: 'Armored', weight: 1, render: (color, sc) => `<path d="M28,48 L25,62 L75,62 L72,48 Q50,42 28,48" fill="${color}"/><path d="M32,50 L50,48 L68,50 L65,60 L35,60 Z" fill="${sc}" opacity="0.4"/>` },
      { id: 'none', name: 'None', weight: 1, render: () => `` },
    ],
    
    // Lower torso
    lowerTorso: [
      { id: 'round', name: 'Round', weight: 1, render: (color) => `<ellipse cx="50" cy="72" rx="20" ry="15" fill="${color}"/>` },
      { id: 'slim', name: 'Slim', weight: 1, render: (color) => `<ellipse cx="50" cy="72" rx="14" ry="16" fill="${color}"/>` },
      { id: 'bulky', name: 'Bulky', weight: 1, render: (color) => `<path d="M30,62 L28,82 L72,82 L70,62 Z" fill="${color}"/>` },
      { id: 'tapered', name: 'Tapered', weight: 1, render: (color) => `<path d="M30,62 L38,85 L62,85 L70,62 Z" fill="${color}"/>` },
      { id: 'blob', name: 'Blob', weight: 1, render: (color) => `<path d="M30,62 Q20,72 30,82 Q50,90 70,82 Q80,72 70,62 Z" fill="${color}"/>` },
      { id: 'segmented', name: 'Segmented', weight: 1, render: (color) => `<ellipse cx="50" cy="65" rx="18" ry="8" fill="${color}"/><ellipse cx="50" cy="78" rx="16" ry="8" fill="${color}"/>` },
      { id: 'pear', name: 'Pear', weight: 1, render: (color) => `<path d="M35,62 Q28,75 35,85 Q50,92 65,85 Q72,75 65,62 Z" fill="${color}"/>` },
      { id: 'shell', name: 'Shell', weight: 1, render: (color, sc) => `<ellipse cx="50" cy="72" rx="22" ry="16" fill="${color}"/><path d="M35,68 Q50,60 65,68 Q65,80 50,85 Q35,80 35,68" fill="${sc}" opacity="0.3"/>` },
    ],
    
    // Upper arms - with shoulder joint
    upperArms: [
      { id: 'none', name: 'None', weight: 1, render: () => `` },
      { id: 'normal', name: 'Normal', weight: 1, render: (color) => `
        <g class="arm-left-group" style="transform-origin: 28px 52px;">
          <g class="arm-left upper-arm" style="transform-origin: 28px 52px;">
            <circle cx="28" cy="52" r="4" fill="${color}" class="joint shoulder-joint-left"/>
            <path d="M28,52 L18,65" stroke="${color}" stroke-width="8" fill="none" stroke-linecap="round"/>
            <circle cx="18" cy="65" r="3" fill="${color}" opacity="0.8" class="joint elbow-joint-left"/>
          </g>
        </g>
        <g class="arm-right-group" style="transform-origin: 72px 52px;">
          <g class="arm-right upper-arm" style="transform-origin: 72px 52px;">
            <circle cx="72" cy="52" r="4" fill="${color}" class="joint shoulder-joint-right"/>
            <path d="M72,52 L82,65" stroke="${color}" stroke-width="8" fill="none" stroke-linecap="round"/>
            <circle cx="82" cy="65" r="3" fill="${color}" opacity="0.8" class="joint elbow-joint-right"/>
          </g>
        </g>` },
      { id: 'bulky', name: 'Bulky', weight: 1, render: (color) => `
        <g class="arm-left-group" style="transform-origin: 28px 52px;">
          <g class="arm-left upper-arm" style="transform-origin: 28px 52px;">
            <circle cx="28" cy="52" r="5" fill="${color}" class="joint shoulder-joint-left"/>
            <ellipse cx="20" cy="58" rx="10" ry="12" fill="${color}"/>
            <circle cx="15" cy="68" r="4" fill="${color}" opacity="0.8" class="joint elbow-joint-left"/>
          </g>
        </g>
        <g class="arm-right-group" style="transform-origin: 72px 52px;">
          <g class="arm-right upper-arm" style="transform-origin: 72px 52px;">
            <circle cx="72" cy="52" r="5" fill="${color}" class="joint shoulder-joint-right"/>
            <ellipse cx="80" cy="58" rx="10" ry="12" fill="${color}"/>
            <circle cx="85" cy="68" r="4" fill="${color}" opacity="0.8" class="joint elbow-joint-right"/>
          </g>
        </g>` },
      { id: 'thin', name: 'Thin', weight: 1, render: (color) => `
        <g class="arm-left-group" style="transform-origin: 28px 52px;">
          <g class="arm-left upper-arm" style="transform-origin: 28px 52px;">
            <circle cx="28" cy="52" r="3" fill="${color}" class="joint shoulder-joint-left"/>
            <path d="M28,52 L15,68" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round"/>
            <circle cx="15" cy="68" r="2.5" fill="${color}" opacity="0.8" class="joint elbow-joint-left"/>
          </g>
        </g>
        <g class="arm-right-group" style="transform-origin: 72px 52px;">
          <g class="arm-right upper-arm" style="transform-origin: 72px 52px;">
            <circle cx="72" cy="52" r="3" fill="${color}" class="joint shoulder-joint-right"/>
            <path d="M72,52 L85,68" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round"/>
            <circle cx="85" cy="68" r="2.5" fill="${color}" opacity="0.8" class="joint elbow-joint-right"/>
          </g>
        </g>` },
      { id: 'multi', name: 'Multiple', weight: 1, render: (color) => `
        <g class="arm-left-group" style="transform-origin: 28px 52px;">
          <g class="arm-left upper-arm arm-upper-1" style="transform-origin: 28px 50px;">
            <circle cx="28" cy="50" r="3" fill="${color}" class="joint"/>
            <path d="M28,50 L15,62" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/>
            <circle cx="15" cy="62" r="2.5" fill="${color}" opacity="0.8" class="joint"/>
          </g>
          <g class="arm-left upper-arm arm-upper-2" style="transform-origin: 28px 55px;">
            <circle cx="28" cy="55" r="3" fill="${color}" class="joint"/>
            <path d="M28,55 L12,70" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/>
            <circle cx="12" cy="70" r="2.5" fill="${color}" opacity="0.8" class="joint"/>
          </g>
        </g>
        <g class="arm-right-group" style="transform-origin: 72px 52px;">
          <g class="arm-right upper-arm arm-upper-1" style="transform-origin: 72px 50px;">
            <circle cx="72" cy="50" r="3" fill="${color}" class="joint"/>
            <path d="M72,50 L85,62" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/>
            <circle cx="85" cy="62" r="2.5" fill="${color}" opacity="0.8" class="joint"/>
          </g>
          <g class="arm-right upper-arm arm-upper-2" style="transform-origin: 72px 55px;">
            <circle cx="72" cy="55" r="3" fill="${color}" class="joint"/>
            <path d="M72,55 L88,70" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/>
            <circle cx="88" cy="70" r="2.5" fill="${color}" opacity="0.8" class="joint"/>
          </g>
        </g>` },
    ],
    
    // Forearms/hands - with elbow and wrist joints
    forearms: [
      { id: 'none', name: 'None', weight: 1, render: () => `` },
      { id: 'normal', name: 'Normal', weight: 1, render: (color) => `
        <g class="forearm-left" style="transform-origin: 18px 65px;">
          <path d="M18,65 L15,82" stroke="${color}" stroke-width="7" fill="none" stroke-linecap="round"/>
          <circle cx="15" cy="82" r="3" fill="${color}" class="joint wrist-joint-left"/>
        </g>
        <g class="forearm-right" style="transform-origin: 82px 65px;">
          <path d="M82,65 L85,82" stroke="${color}" stroke-width="7" fill="none" stroke-linecap="round"/>
          <circle cx="85" cy="82" r="3" fill="${color}" class="joint wrist-joint-right"/>
        </g>` },
      { id: 'claws', name: 'Claws', weight: 1, render: (color) => `
        <g class="forearm-left" style="transform-origin: 18px 65px;">
          <path d="M18,65 L15,78" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/>
          <circle cx="15" cy="78" r="3" fill="${color}" class="joint wrist-joint-left"/>
          <g class="hand-left claw" style="transform-origin: 15px 78px;">
            <path d="M15,78 L10,88 M15,78 L15,90 M15,78 L20,88" stroke="${color}" stroke-width="2" fill="none"/>
          </g>
        </g>
        <g class="forearm-right" style="transform-origin: 82px 65px;">
          <path d="M82,65 L85,78" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/>
          <circle cx="85" cy="78" r="3" fill="${color}" class="joint wrist-joint-right"/>
          <g class="hand-right claw" style="transform-origin: 85px 78px;">
            <path d="M85,78 L80,88 M85,78 L85,90 M85,78 L90,88" stroke="${color}" stroke-width="2" fill="none"/>
          </g>
        </g>` },
      { id: 'pincers', name: 'Pincers', weight: 1, render: (color) => `
        <g class="forearm-left pincer" style="transform-origin: 18px 65px;">
          <path d="M18,65 L12,78" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/>
          <circle cx="12" cy="78" r="3" fill="${color}" class="joint wrist-joint-left"/>
          <g class="hand-left pincer-claw" style="transform-origin: 10px 82px;">
            <ellipse cx="10" cy="82" rx="8" ry="5" fill="${color}"/>
          </g>
        </g>
        <g class="forearm-right pincer" style="transform-origin: 82px 65px;">
          <path d="M82,65 L88,78" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/>
          <circle cx="88" cy="78" r="3" fill="${color}" class="joint wrist-joint-right"/>
          <g class="hand-right pincer-claw" style="transform-origin: 90px 82px;">
            <ellipse cx="90" cy="82" rx="8" ry="5" fill="${color}"/>
          </g>
        </g>` },
      { id: 'tentacle', name: 'Tentacle', weight: 1, render: (color) => `
        <g class="tentacle-left" style="transform-origin: 18px 65px;">
          <path d="M18,65 Q5,75 10,90 Q15,98 8,102" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round"/>
        </g>
        <g class="tentacle-right" style="transform-origin: 82px 65px;">
          <path d="M82,65 Q95,75 90,90 Q85,98 92,102" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round"/>
        </g>` },
      { id: 'stumps', name: 'Stumps', weight: 1, render: (color) => `
        <g class="forearm-left" style="transform-origin: 18px 65px;">
          <ellipse cx="15" cy="72" rx="6" ry="8" fill="${color}"/>
        </g>
        <g class="forearm-right" style="transform-origin: 82px 65px;">
          <ellipse cx="85" cy="72" rx="6" ry="8" fill="${color}"/>
        </g>` },
    ],
    
    // Upper legs (thighs) - with hip joint
    upperLegs: [
      { id: 'normal', name: 'Normal', weight: 1, render: (color) => `
        <g class="leg-left-group" style="transform-origin: 40px 82px;">
          <g class="leg-left upper-leg" style="transform-origin: 40px 82px;">
            <circle cx="40" cy="82" r="4" fill="${color}" class="joint hip-joint-left"/>
            <path d="M40,82 L38,95" stroke="${color}" stroke-width="9" fill="none" stroke-linecap="round"/>
            <circle cx="38" cy="95" r="3.5" fill="${color}" opacity="0.8" class="joint knee-joint-left"/>
          </g>
        </g>
        <g class="leg-right-group" style="transform-origin: 60px 82px;">
          <g class="leg-right upper-leg" style="transform-origin: 60px 82px;">
            <circle cx="60" cy="82" r="4" fill="${color}" class="joint hip-joint-right"/>
            <path d="M60,82 L62,95" stroke="${color}" stroke-width="9" fill="none" stroke-linecap="round"/>
            <circle cx="62" cy="95" r="3.5" fill="${color}" opacity="0.8" class="joint knee-joint-right"/>
          </g>
        </g>` },
      { id: 'thick', name: 'Thick', weight: 1, render: (color) => `
        <g class="leg-left-group" style="transform-origin: 40px 82px;">
          <g class="leg-left upper-leg" style="transform-origin: 40px 82px;">
            <circle cx="40" cy="82" r="5" fill="${color}" class="joint hip-joint-left"/>
            <ellipse cx="38" cy="88" rx="10" ry="12" fill="${color}"/>
            <circle cx="36" cy="98" r="4" fill="${color}" opacity="0.8" class="joint knee-joint-left"/>
          </g>
        </g>
        <g class="leg-right-group" style="transform-origin: 60px 82px;">
          <g class="leg-right upper-leg" style="transform-origin: 60px 82px;">
            <circle cx="60" cy="82" r="5" fill="${color}" class="joint hip-joint-right"/>
            <ellipse cx="62" cy="88" rx="10" ry="12" fill="${color}"/>
            <circle cx="64" cy="98" r="4" fill="${color}" opacity="0.8" class="joint knee-joint-right"/>
          </g>
        </g>` },
      { id: 'thin', name: 'Thin', weight: 1, render: (color) => `
        <g class="leg-left-group" style="transform-origin: 42px 82px;">
          <g class="leg-left upper-leg" style="transform-origin: 42px 82px;">
            <circle cx="42" cy="82" r="3" fill="${color}" class="joint hip-joint-left"/>
            <path d="M42,82 L40,96" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round"/>
            <circle cx="40" cy="96" r="2.5" fill="${color}" opacity="0.8" class="joint knee-joint-left"/>
          </g>
        </g>
        <g class="leg-right-group" style="transform-origin: 58px 82px;">
          <g class="leg-right upper-leg" style="transform-origin: 58px 82px;">
            <circle cx="58" cy="82" r="3" fill="${color}" class="joint hip-joint-right"/>
            <path d="M58,82 L60,96" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round"/>
            <circle cx="60" cy="96" r="2.5" fill="${color}" opacity="0.8" class="joint knee-joint-right"/>
          </g>
        </g>` },
      { id: 'digitigrade', name: 'Bent', weight: 1, render: (color) => `
        <g class="leg-left-group" style="transform-origin: 40px 82px;">
          <g class="leg-left upper-leg" style="transform-origin: 40px 82px;">
            <circle cx="40" cy="82" r="4" fill="${color}" class="joint hip-joint-left"/>
            <path d="M40,82 L35,92" stroke="${color}" stroke-width="8" fill="none" stroke-linecap="round"/>
            <circle cx="35" cy="92" r="3.5" fill="${color}" opacity="0.8" class="joint knee-joint-left"/>
          </g>
        </g>
        <g class="leg-right-group" style="transform-origin: 60px 82px;">
          <g class="leg-right upper-leg" style="transform-origin: 60px 82px;">
            <circle cx="60" cy="82" r="4" fill="${color}" class="joint hip-joint-right"/>
            <path d="M60,82 L65,92" stroke="${color}" stroke-width="8" fill="none" stroke-linecap="round"/>
            <circle cx="65" cy="92" r="3.5" fill="${color}" opacity="0.8" class="joint knee-joint-right"/>
          </g>
        </g>` },
      { id: 'none', name: 'None', weight: 1, render: () => `` },
    ],
    
    // Lower legs/feet - with knee and ankle joints
    lowerLegs: [
      { id: 'normal', name: 'Normal', weight: 1, render: (color) => `
        <g class="foot-left" style="transform-origin: 38px 95px;">
          <path d="M38,95 L38,108" stroke="${color}" stroke-width="7" fill="none" stroke-linecap="round"/>
          <circle cx="38" cy="108" r="3" fill="${color}" class="joint ankle-joint-left"/>
        </g>
        <g class="foot-right" style="transform-origin: 62px 95px;">
          <path d="M62,95 L62,108" stroke="${color}" stroke-width="7" fill="none" stroke-linecap="round"/>
          <circle cx="62" cy="108" r="3" fill="${color}" class="joint ankle-joint-right"/>
        </g>` },
      { id: 'talons', name: 'Talons', weight: 1, render: (color) => `
        <g class="foot-left" style="transform-origin: 38px 95px;">
          <path d="M38,95 L38,105" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/>
          <circle cx="38" cy="105" r="3" fill="${color}" class="joint ankle-joint-left"/>
          <g class="toes-left" style="transform-origin: 38px 105px;">
            <path d="M38,105 L33,112 M38,105 L38,113 M38,105 L43,112" stroke="${color}" stroke-width="2" fill="none"/>
          </g>
        </g>
        <g class="foot-right" style="transform-origin: 62px 95px;">
          <path d="M62,95 L62,105" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/>
          <circle cx="62" cy="105" r="3" fill="${color}" class="joint ankle-joint-right"/>
          <g class="toes-right" style="transform-origin: 62px 105px;">
            <path d="M62,105 L57,112 M62,105 L62,113 M62,105 L67,112" stroke="${color}" stroke-width="2" fill="none"/>
          </g>
        </g>` },
      { id: 'hooves', name: 'Hooves', weight: 1, render: (color) => `
        <g class="foot-left" style="transform-origin: 35px 92px;">
          <path d="M35,92 L38,105" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/>
          <circle cx="38" cy="105" r="3" fill="${color}" class="joint ankle-joint-left"/>
          <ellipse cx="38" cy="108" rx="5" ry="3" fill="${color}"/>
        </g>
        <g class="foot-right" style="transform-origin: 65px 92px;">
          <path d="M65,92 L62,105" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/>
          <circle cx="62" cy="105" r="3" fill="${color}" class="joint ankle-joint-right"/>
          <ellipse cx="62" cy="108" rx="5" ry="3" fill="${color}"/>
        </g>` },
      { id: 'hover', name: 'Hover', weight: 1, render: (color) => `<g class="hover-feet"><ellipse cx="50" cy="100" rx="18" ry="5" fill="${color}" opacity="0.4"/><ellipse cx="50" cy="104" rx="12" ry="3" fill="${color}" opacity="0.2"/></g>` },
      { id: 'blob', name: 'Blob', weight: 1, render: (color) => `<g class="blob-feet"><ellipse cx="50" cy="98" rx="20" ry="10" fill="${color}"/></g>` },
      { id: 'none', name: 'None', weight: 1, render: () => `` },
    ],
    
    tails: [
      { id: 'none', name: 'None', weight: 1, render: () => `` },
      { id: 'short', name: 'Short', weight: 1, render: (color) => `<g class="tail tail-short"><path d="M50,82 Q60,88 65,82" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/></g>` },
      { id: 'long', name: 'Long', weight: 1, render: (color) => `<g class="tail tail-long"><path d="M50,82 Q75,85 85,75 Q95,65 90,55" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round"/></g>` },
      { id: 'fluffy', name: 'Fluffy', weight: 1, render: (color) => `<g class="tail tail-fluffy"><path d="M50,82 Q65,85 70,80" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="73" cy="78" r="8" fill="${color}"/></g>` },
      { id: 'spiked', name: 'Spiked', weight: 1, render: (color) => `<g class="tail tail-spiked"><path d="M50,82 Q70,88 85,75" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round"/><polygon points="85,75 95,70 88,68 92,60 82,70" fill="${color}"/></g>` },
      { id: 'fish', name: 'Fish', weight: 1, render: (color) => `<g class="tail tail-fish"><path d="M50,82 Q65,85 75,80" stroke="${color}" stroke-width="5" fill="none"/><path d="M75,80 L85,70 L85,90 Z" fill="${color}"/></g>` },
      { id: 'scorpion', name: 'Scorpion', weight: 1, render: (color) => `<g class="tail tail-scorpion"><path d="M50,82 Q70,85 80,70 Q85,55 75,50" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/><polygon points="75,50 80,45 70,48" fill="${color}"/></g>` },
      { id: 'curly', name: 'Curly', weight: 1, render: (color) => `<g class="tail tail-curly"><path d="M50,82 Q60,88 65,82 Q75,75 70,68 Q65,60 72,55" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round"/></g>` },
      { id: 'flame', name: 'Flame', weight: 1, render: (_, sc) => `<g class="tail tail-flame"><path d="M50,82 Q60,85 68,80" stroke="${sc}" stroke-width="4" fill="none"/><path d="M68,80 Q78,75 72,65 Q80,70 75,60 Q82,65 78,55" fill="${sc}" opacity="0.8"/></g>` },
      { id: 'ribbon', name: 'Ribbon', weight: 1, render: (color) => `<g class="tail tail-ribbon"><path d="M50,82 Q70,90 90,80 Q85,85 95,75" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M50,82 Q65,95 85,90" stroke="${color}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/></g>` },
      { id: 'stub', name: 'Stub', weight: 1, render: (color) => `<g class="tail tail-stub"><ellipse cx="55" cy="84" rx="8" ry="5" fill="${color}"/></g>` },
      { id: 'twin', name: 'Twin', weight: 1, render: (color) => `<g class="tail tail-twin"><path d="M48,82 Q55,90 50,98" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M52,82 Q65,88 75,92" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/></g>` },
    ],
    
    wings: [
      { id: 'none', name: 'None', weight: 1, render: () => `` },
      { id: 'small', name: 'Small', weight: 1, render: (color) => `<g class="wing-left"><ellipse cx="20" cy="55" rx="12" ry="8" fill="${color}" opacity="0.8"/></g><g class="wing-right"><ellipse cx="80" cy="55" rx="12" ry="8" fill="${color}" opacity="0.8"/></g>` },
      { id: 'bat', name: 'Bat', weight: 1, render: (color) => `<g class="wing-left wing-bat"><path d="M28,50 L5,35 L10,50 L0,55 L15,60 L28,55" fill="${color}" opacity="0.9"/></g><g class="wing-right wing-bat"><path d="M72,50 L95,35 L90,50 L100,55 L85,60 L72,55" fill="${color}" opacity="0.9"/></g>` },
      { id: 'feathered', name: 'Feathered', weight: 1, render: (color) => `<g class="wing-left wing-feathered"><ellipse cx="15" cy="50" rx="15" ry="6" fill="${color}"/><ellipse cx="12" cy="55" rx="12" ry="5" fill="${color}"/><ellipse cx="10" cy="60" rx="8" ry="4" fill="${color}"/></g><g class="wing-right wing-feathered"><ellipse cx="85" cy="50" rx="15" ry="6" fill="${color}"/><ellipse cx="88" cy="55" rx="12" ry="5" fill="${color}"/><ellipse cx="90" cy="60" rx="8" ry="4" fill="${color}"/></g>` },
      { id: 'fairy', name: 'Fairy', weight: 1, render: (color) => `<g class="wing-left wing-fairy"><ellipse cx="18" cy="50" rx="18" ry="12" fill="${color}" opacity="0.5" stroke="${color}" stroke-width="1"/><ellipse cx="15" cy="62" rx="12" ry="8" fill="${color}" opacity="0.4" stroke="${color}" stroke-width="1"/></g><g class="wing-right wing-fairy"><ellipse cx="82" cy="50" rx="18" ry="12" fill="${color}" opacity="0.5" stroke="${color}" stroke-width="1"/><ellipse cx="85" cy="62" rx="12" ry="8" fill="${color}" opacity="0.4" stroke="${color}" stroke-width="1"/></g>` },
      { id: 'dragon', name: 'Dragon', weight: 1, render: (color) => `<g class="wing-left wing-dragon"><path d="M28,45 L0,25 L5,40 L-5,45 L10,50 L0,60 L15,55 L28,58" fill="${color}"/></g><g class="wing-right wing-dragon"><path d="M72,45 L100,25 L95,40 L105,45 L90,50 L100,60 L85,55 L72,58" fill="${color}"/></g>` },
      { id: 'insect', name: 'Insect', weight: 1, render: (color) => `<g class="wing-left wing-insect"><ellipse cx="15" cy="48" rx="18" ry="10" fill="${color}" opacity="0.4" stroke="${color}" stroke-width="1"/><ellipse cx="18" cy="60" rx="14" ry="7" fill="${color}" opacity="0.3" stroke="${color}" stroke-width="1"/></g><g class="wing-right wing-insect"><ellipse cx="85" cy="48" rx="18" ry="10" fill="${color}" opacity="0.4" stroke="${color}" stroke-width="1"/><ellipse cx="82" cy="60" rx="14" ry="7" fill="${color}" opacity="0.3" stroke="${color}" stroke-width="1"/></g>` },
      { id: 'angelic', name: 'Angelic', weight: 1, render: () => `<g class="wing-left wing-angelic"><ellipse cx="10" cy="48" rx="18" ry="8" fill="#ffffff" opacity="0.9"/><ellipse cx="8" cy="54" rx="15" ry="6" fill="#ffffff" opacity="0.8"/><ellipse cx="6" cy="60" rx="10" ry="4" fill="#ffffff" opacity="0.7"/></g><g class="wing-right wing-angelic"><ellipse cx="90" cy="48" rx="18" ry="8" fill="#ffffff" opacity="0.9"/><ellipse cx="92" cy="54" rx="15" ry="6" fill="#ffffff" opacity="0.8"/><ellipse cx="94" cy="60" rx="10" ry="4" fill="#ffffff" opacity="0.7"/></g>` },
      { id: 'energy', name: 'Energy', weight: 1, render: (_, sc) => `<g class="wing-left wing-energy"><path d="M28,50 L5,40 L15,52 L0,55 L15,58 L5,70 L28,58" fill="${sc}" opacity="0.6"/></g><g class="wing-right wing-energy"><path d="M72,50 L95,40 L85,52 L100,55 L85,58 L95,70 L72,58" fill="${sc}" opacity="0.6"/></g>` },
      { id: 'tattered', name: 'Tattered', weight: 1, render: (color) => `<g class="wing-left wing-tattered"><path d="M28,48 L8,35 L12,45 L2,48 L10,52 L5,58 L15,55 L8,65 L28,55" fill="${color}" opacity="0.7"/></g><g class="wing-right wing-tattered"><path d="M72,48 L92,35 L88,45 L98,48 L90,52 L95,58 L85,55 L92,65 L72,55" fill="${color}" opacity="0.7"/></g>` },
    ],
    
    // Cheeks - for expressing happiness and love
    cheeks: [
      { id: 'none', name: 'None', weight: 1, render: () => `` },
      { id: 'blush', name: 'Blush', weight: 1, render: () => `<g class="cheeks cheeks-blush"><ellipse cx="32" cy="38" rx="5" ry="3" fill="#ff9999" opacity="0.6"/><ellipse cx="68" cy="38" rx="5" ry="3" fill="#ff9999" opacity="0.6"/></g>` },
      { id: 'rosy', name: 'Rosy', weight: 1, render: () => `<g class="cheeks cheeks-rosy"><circle cx="32" cy="36" r="4" fill="#ffaaaa" opacity="0.5"/><circle cx="68" cy="36" r="4" fill="#ffaaaa" opacity="0.5"/></g>` },
      { id: 'freckles', name: 'Freckles', weight: 1, render: () => `<g class="cheeks cheeks-freckles"><circle cx="30" cy="36" r="1" fill="#aa8866"/><circle cx="34" cy="38" r="1" fill="#aa8866"/><circle cx="32" cy="34" r="1" fill="#aa8866"/><circle cx="66" cy="36" r="1" fill="#aa8866"/><circle cx="70" cy="38" r="1" fill="#aa8866"/><circle cx="68" cy="34" r="1" fill="#aa8866"/></g>` },
      { id: 'whiskers', name: 'Whiskers', weight: 1, render: () => `<g class="cheeks cheeks-whiskers"><line x1="20" y1="38" x2="32" y2="40" stroke="#111" stroke-width="1" opacity="0.5"/><line x1="20" y1="42" x2="32" y2="42" stroke="#111" stroke-width="1" opacity="0.5"/><line x1="20" y1="46" x2="32" y2="44" stroke="#111" stroke-width="1" opacity="0.5"/><line x1="80" y1="38" x2="68" y2="40" stroke="#111" stroke-width="1" opacity="0.5"/><line x1="80" y1="42" x2="68" y2="42" stroke="#111" stroke-width="1" opacity="0.5"/><line x1="80" y1="46" x2="68" y2="44" stroke="#111" stroke-width="1" opacity="0.5"/></g>` },
    ],
    
    markings: [
      { id: 'none', name: 'None', weight: 1, render: () => `` },
      { id: 'stripes', name: 'Stripes', weight: 1, render: (color) => `<path d="M35,55 L45,55 M32,65 L48,65 M35,75 L45,75" stroke="${color}" stroke-width="3" opacity="0.5"/><path d="M55,55 L65,55 M52,65 L68,65 M55,75 L65,75" stroke="${color}" stroke-width="3" opacity="0.5"/>` },
      { id: 'spots', name: 'Spots', weight: 1, render: (color) => `<circle cx="40" cy="58" r="4" fill="${color}" opacity="0.5"/><circle cx="55" cy="68" r="3" fill="${color}" opacity="0.5"/><circle cx="62" cy="55" r="4" fill="${color}" opacity="0.5"/><circle cx="45" cy="75" r="3" fill="${color}" opacity="0.5"/>` },
      { id: 'belly', name: 'Belly', weight: 1, render: (color) => `<ellipse cx="50" cy="70" rx="12" ry="16" fill="${color}" opacity="0.3"/>` },
      { id: 'glow', name: 'Glow', weight: 1, render: (color) => `<ellipse cx="50" cy="65" rx="10" ry="12" fill="${color}" opacity="0.4" filter="url(#blur)"/>` },
    ],
  },
  
  // Growth Stages
  STAGES: {
    EGG: { name: 'Egg', duration: 5 },
    INFANT: { name: 'Infant', duration: 10 },
    ADULT: { name: 'Adult', duration: null },
  },
  
  // Experience and Leveling System
  LEVELING: {
    expPerWin: 100,
    expPerLevel: 150, // EXP needed increases each level
    levelMultiplier: 1.3, // Each level needs 30% more EXP
    maxLevel: 50,
    trainingPointsPerWin: 1, // Training points earned per battle win
    startingTrainingPoints: 5, // First monster bonus
  },
  
  // Training Types - Spend training points to gain stats
  TRAINING_TYPES: [
    { id: 'strength', name: 'Strength', emoji: '💪', stat: 'strength', description: 'Melee damage & knockback', cost: 1 },
    { id: 'constitution', name: 'Constitution', emoji: '🛡️', stat: 'constitution', description: 'Health, defense & size', cost: 1 },
    { id: 'agility', name: 'Agility', emoji: '💨', stat: 'agility', description: 'Speed, attack rate & dodge', cost: 1 },
    { id: 'power', name: 'Power', emoji: '🔮', stat: 'power', description: 'Magic projectile damage', cost: 1 },
    { id: 'intelligence', name: 'Intelligence', emoji: '🧠', stat: 'intelligence', description: 'Battle decision making', cost: 1 },
  ],
  
  // Battle Settings - Vertical arena for mobile (expanded for multi-battle)
  BATTLE: {
    arenaWidth: 400,
    arenaHeight: 550,
    tickRate: 67, // 15% slower than previous 58ms
    moveSpeed: 2,
    attackRange: 50, // Melee range
    projectileRange: 200, // Ranged attack range
    attackCooldown: 1200,
    dodgeCooldown: 800,
    dodgeDuration: 300,
    monsterRadius: 25, // Collision radius
    projectileSpeed: 8,
    projectileSize: 8,
    healOrbSpawnChance: 0.003, // Chance per tick to spawn heal orb
    healOrbAmount: 25, // HP restored
    healOrbRadius: 12,
  },
  
  // Stat Influence on Battle
  STAT_EFFECTS: {
    strengthDamageMultiplier: 0.5,
    constitutionDefenseMultiplier: 0.3,
    agilitySpeedMultiplier: 0.1,
    agilityAttackSpeedMultiplier: 0.02, // Affects all attack cooldowns
    agilityDodgeSpeed: 0.05, // Dodge movement speed bonus
    agilityDodgeDistance: 0.03, // Dodge distance bonus
    powerMagicDamageMultiplier: 0.6,
    intelligenceDecisionBonus: 0.03, // Reduces randomness in decisions
    intelligenceDodgeAwareness: 0.025, // Chance to choose to dodge
    intelligenceHealAwareness: 0.02, // Awareness of heal orbs
  },
  
  // Happiness System
  HAPPINESS: {
    winBonus: 15,
    lossReduction: 20,
    recoveryPerTick: 0.5, // Recovery over time
    minToFight: 20, // Below this, monster doesn't want to fight
    depressionThreshold: 0, // At 0, monster is depressed
    depressionRecoveryRequired: 100, // Must reach 100% to fight again after depression
  },
  
  // Economy
  ECONOMY: {
    coinsPerWin: 1,
    tournamentEntryFees: [10, 25, 50, 100, 250],
    tournamentPrizes: [50, 150, 300, 600, 1500],
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
  
  generateTrainerName: () => {
    const firstNames = ['Alex', 'Sam', 'Jordan', 'Riley', 'Casey', 'Morgan', 'Quinn', 'Sage', 
                        'Blake', 'Drew', 'Kai', 'Nova', 'Raven', 'Storm', 'Phoenix', 'Ash',
                        'Leo', 'Max', 'Zoe', 'Mia', 'Jake', 'Luna', 'Cole', 'Iris'];
    return firstNames[Math.floor(Math.random() * firstNames.length)];
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
  
  // Select a random body type
  selectBodyType: () => {
    return BodyPartGenerator.weightedRandom(CONFIG.BODY_TYPES);
  },
  
  // Generate random body parts based on body type
  generateRandomParts: () => {
    const parts = CONFIG.BODY_PARTS;
    const bodyType = BodyPartGenerator.selectBodyType();
    
    // Use weighted selection for variety
    const selectPart = (category) => BodyPartGenerator.weightedRandom(parts[category]).id;
    
    // Helper to randomly include a part (50% chance each)
    const maybeSelect = (category) => Math.random() > 0.5 ? selectPart(category) : 'none';
    
    // Determine if arms are possible based on body type
    const canHaveArms = bodyType.hasArms;
    const hasArms = canHaveArms && Math.random() > 0.3; // 70% of arm-capable types have arms
    
    // Wings: flyers always have them, others random
    const hasWings = bodyType.canFly || Math.random() > 0.7;
    
    // Legs depend on body type
    const hasLegs = bodyType.legCount > 0 && Math.random() > 0.3; // 70% if body type supports legs
    
    return {
      bodyType: bodyType.id,
      // Always have head and eyes
      head: selectPart('heads'),
      eyes: selectPart('eyes'),
      // Everything else is random
      mouth: maybeSelect('mouths'),
      cheeks: maybeSelect('cheeks'),
      ears: maybeSelect('ears'),
      horns: maybeSelect('horns'),
      upperTorso: maybeSelect('upperTorso'),
      lowerTorso: maybeSelect('lowerTorso'),
      upperArms: hasArms ? selectPart('upperArms') : 'none',
      forearms: hasArms ? selectPart('forearms') : 'none',
      upperLegs: hasLegs ? selectPart('upperLegs') : 'none',
      lowerLegs: hasLegs ? selectPart('lowerLegs') : 'none',
      tail: maybeSelect('tails'),
      wings: hasWings ? selectPart('wings') : 'none',
      markings: maybeSelect('markings'),
    };
  },
  
  // Get body type config by id
  getBodyType: (id) => {
    return CONFIG.BODY_TYPES.find(bt => bt.id === id) || CONFIG.BODY_TYPES[0];
  },
  
  // Get a specific part by category and id
  getPart: (category, id) => {
    const parts = CONFIG.BODY_PARTS[category];
    return parts?.find(p => p.id === id) || parts?.[0];
  },
  
  // Render legs based on body type
  renderLegs: (bodyType, color, secondaryColor) => {
    const legCount = bodyType.legCount;
    
    if (legCount === 0) {
      // Floater, Serpentine, Amorphous - no legs
      if (bodyType.id === 'floater') {
        // Floating energy/glow effect
        return `
          <ellipse cx="50" cy="95" rx="20" ry="6" fill="${secondaryColor}" opacity="0.3"/>
          <ellipse cx="50" cy="98" rx="15" ry="4" fill="${secondaryColor}" opacity="0.2"/>
          <ellipse cx="50" cy="92" rx="12" ry="3" fill="${secondaryColor}" opacity="0.4"/>
        `;
      } else if (bodyType.id === 'serpentine') {
        // Snake-like tail body
        return `
          <path d="M50,75 Q30,85 35,95 Q40,105 55,100 Q70,95 65,105 Q60,115 50,110" 
                stroke="${color}" stroke-width="12" fill="none" stroke-linecap="round"/>
        `;
      } else if (bodyType.id === 'amorphous') {
        // Blob base
        return `
          <ellipse cx="50" cy="90" rx="28" ry="15" fill="${color}"/>
          <ellipse cx="40" cy="95" rx="10" ry="8" fill="${color}" opacity="0.8"/>
          <ellipse cx="62" cy="93" rx="8" ry="6" fill="${color}" opacity="0.8"/>
        `;
      }
      return '';
    }
    
    if (legCount === 2) {
      if (bodyType.id === 'hopper') {
        // Strong jumping legs
        return `
          <path d="M42,78 L38,88 L42,98 L38,108" stroke="${color}" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M58,78 L62,88 L58,98 L62,108" stroke="${color}" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          <ellipse cx="38" cy="110" rx="8" ry="4" fill="${color}"/>
          <ellipse cx="62" cy="110" rx="8" ry="4" fill="${color}"/>
        `;
      }
      // Standard bipedal legs
      return `
        <path d="M42,78 L40,95 L40,108" stroke="${color}" stroke-width="8" fill="none" stroke-linecap="round"/>
        <path d="M58,78 L60,95 L60,108" stroke="${color}" stroke-width="8" fill="none" stroke-linecap="round"/>
      `;
    }
    
    if (legCount === 4) {
      if (bodyType.id === 'centauroid') {
        // Four legs in centaur arrangement
        return `
          <path d="M35,75 L32,90 L32,105" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/>
          <path d="M45,78 L42,93 L42,108" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/>
          <path d="M55,78 L58,93 L58,108" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/>
          <path d="M65,75 L68,90 L68,105" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/>
        `;
      }
      // Standard quadruped legs
      return `
        <path d="M30,70 L25,85 L25,100" stroke="${color}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <path d="M40,75 L38,90 L38,105" stroke="${color}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <path d="M60,75 L62,90 L62,105" stroke="${color}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <path d="M70,70 L75,85 L75,100" stroke="${color}" stroke-width="7" fill="none" stroke-linecap="round"/>
      `;
    }
    
    if (legCount === 6) {
      // Hexapod/insect legs
      return `
        <path d="M30,60 L15,55 L10,65" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M30,70 L12,72 L8,82" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M32,80 L18,88 L15,100" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M70,60 L85,55 L90,65" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M70,70 L88,72 L92,82" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M68,80 L82,88 L85,100" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>
      `;
    }
    
    if (legCount === 8) {
      // Arachnid legs
      return `
        <path d="M28,55 L10,45 L5,55" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M28,62 L8,58 L2,68" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M28,69 L8,72 L2,85" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M30,76 L12,85 L8,100" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M72,55 L90,45 L95,55" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M72,62 L92,58 L98,68" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M72,69 L92,72 L98,85" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M70,76 L88,85 L92,100" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round"/>
      `;
    }
    
    return '';
  },
  
  // Render torso based on body type
  renderTorso: (bodyType, color, secondaryColor) => {
    if (bodyType.id === 'serpentine') {
      // Elongated body
      return `<ellipse cx="50" cy="55" rx="18" ry="25" fill="${color}"/>`;
    }
    if (bodyType.id === 'amorphous') {
      // Blob body
      return `
        <ellipse cx="50" cy="60" rx="25" ry="22" fill="${color}"/>
        <circle cx="38" cy="55" r="8" fill="${color}" opacity="0.9"/>
        <circle cx="65" cy="58" r="6" fill="${color}" opacity="0.9"/>
      `;
    }
    if (bodyType.id === 'quadruped' || bodyType.id === 'hexapod') {
      // Horizontal body
      return `
        <ellipse cx="50" cy="65" rx="28" ry="16" fill="${color}"/>
      `;
    }
    if (bodyType.id === 'centauroid') {
      // Two-part torso (horse body + upright upper body)
      return `
        <ellipse cx="50" cy="72" rx="25" ry="12" fill="${color}"/>
        <ellipse cx="50" cy="55" rx="16" ry="18" fill="${color}"/>
      `;
    }
    if (bodyType.id === 'arachnid') {
      // Spider-like abdomen
      return `
        <ellipse cx="50" cy="55" rx="15" ry="12" fill="${color}"/>
        <ellipse cx="50" cy="75" rx="20" ry="15" fill="${color}"/>
      `;
    }
    // Default upright torso for bipedal, floater, hopper, winged
    return `
      <ellipse cx="50" cy="55" rx="18" ry="12" fill="${color}"/>
      <ellipse cx="50" cy="72" rx="16" ry="14" fill="${color}"/>
    `;
  },
  
  // Render full monster SVG based on body type
  renderMonster: (bodyParts, primaryColor, secondaryColor, scale = 1, emotion = 'neutral') => {
    const bodyType = BodyPartGenerator.getBodyType(bodyParts.bodyType);
    
    // Get each part's render function
    const wingsPart = BodyPartGenerator.getPart('wings', bodyParts.wings);
    const tailPart = BodyPartGenerator.getPart('tails', bodyParts.tail);
    const markingsPart = BodyPartGenerator.getPart('markings', bodyParts.markings);
    const earsPart = BodyPartGenerator.getPart('ears', bodyParts.ears);
    const headPart = BodyPartGenerator.getPart('heads', bodyParts.head);
    const hornsPart = BodyPartGenerator.getPart('horns', bodyParts.horns);
    const eyesPart = BodyPartGenerator.getPart('eyes', bodyParts.eyes);
    const mouthPart = BodyPartGenerator.getPart('mouths', bodyParts.mouth);
    const cheeksPart = BodyPartGenerator.getPart('cheeks', bodyParts.cheeks);
    
    // Get arms if body type has them
    const upperArmsPart = bodyType.hasArms ? BodyPartGenerator.getPart('upperArms', bodyParts.upperArms) : null;
    const forearmsPart = bodyType.hasArms ? BodyPartGenerator.getPart('forearms', bodyParts.forearms) : null;
    
    // Build SVG in correct layer order (back to front)
    const svgContent = `
      ${wingsPart?.render(secondaryColor) || ''}
      ${tailPart?.render(primaryColor) || ''}
      ${BodyPartGenerator.renderLegs(bodyType, primaryColor, secondaryColor)}
      ${BodyPartGenerator.renderTorso(bodyType, primaryColor, secondaryColor)}
      ${upperArmsPart?.render(primaryColor) || ''}
      ${forearmsPart?.render(primaryColor) || ''}
      ${markingsPart?.render(secondaryColor) || ''}
      ${earsPart?.render(primaryColor) || ''}
      ${headPart?.render(primaryColor) || ''}
      ${hornsPart?.render(secondaryColor) || ''}
      ${eyesPart?.render(primaryColor, secondaryColor) || ''}
      ${cheeksPart?.render(primaryColor, secondaryColor) || ''}
      ${mouthPart?.render(primaryColor, secondaryColor) || ''}
    `;
    
    return svgContent;
  },
};

// ============================================================================
// MONSTER FACTORY MODULE - Creates and manages monsters
// ============================================================================
const MonsterFactory = {
  createEgg: (typeId, isFirstMonster = false) => {
    const type = CONFIG.MONSTER_TYPES.find(t => t.id === typeId) || CONFIG.MONSTER_TYPES[0];
    // Generate random body parts that will be revealed at hatch
    const bodyParts = BodyPartGenerator.generateRandomParts();
    
    return {
      id: Utils.generateId(),
      name: Utils.generateMonsterName(),
      type: type,
      stage: 'EGG',
      age: 0, // Stage progress (taps to evolve)
      daysOld: 0, // Total age in "days" (increments on each tap)
      hatchDay: null, // When it hatched (set on evolve from egg)
      bodyParts: bodyParts,
      personality: MonsterFactory.generatePersonality(bodyParts),
      maxStatBonuses: MonsterFactory.generateStartingBonuses(bodyParts),
      temporaryBoosts: { strength: 0, constitution: 0, agility: 0, power: 0, intelligence: 0 },
      health: 100,
      maxHealth: 100,
      happiness: 100, // Happiness system
      isDepressed: false,
      level: 1,
      exp: 0,
      trainingPoints: isFirstMonster ? CONFIG.LEVELING.startingTrainingPoints : 0,
      battleStats: { wins: 0, losses: 0 },
    };
  },
  
  // Get formatted age string
  getAgeString: (monster) => {
    if (monster.stage === 'EGG') {
      return `${monster.daysOld || 0} days incubating`;
    }
    
    const daysAlive = (monster.daysOld || 0) - (monster.hatchDay || 0);
    if (daysAlive >= 365) {
      const years = Math.floor(daysAlive / 365);
      const remainingDays = daysAlive % 365;
      if (remainingDays === 0) {
        return `${years} year${years > 1 ? 's' : ''} old`;
      }
      return `${years} year${years > 1 ? 's' : ''}, ${remainingDays} day${remainingDays > 1 ? 's' : ''} old`;
    }
    return `${daysAlive} day${daysAlive !== 1 ? 's' : ''} old`;
  },
  
  // Generate personality from body parts and random seed
  generatePersonality: (bodyParts) => {
    const seed = bodyParts ? 
      (bodyParts.head?.charCodeAt(0) || 0) + 
      (bodyParts.eyes?.charCodeAt(0) || 0) * 2 + 
      (bodyParts.bodyType?.charCodeAt(0) || 0) * 3 : 
      Math.floor(Math.random() * 100);
    
    const traits = CONFIG.PERSONALITY_TRAITS;
    return {
      energy: traits.energy[seed % traits.energy.length],
      temperament: traits.temperament[(seed * 7) % traits.temperament.length],
      social: traits.social[(seed * 13) % traits.social.length],
      focus: traits.focus[(seed * 17) % traits.focus.length],
      seed: seed, // Store seed for animation speeds
    };
  },
  
  // Get personality description
  getPersonalityDescription: (monster) => {
    const p = monster.personality;
    if (!p) return 'A mysterious creature.';
    
    const energyDesc = {
      'lazy': 'prefers to conserve energy',
      'calm': 'maintains a peaceful demeanor',
      'steady': 'keeps a consistent pace',
      'energetic': 'is always ready for action',
      'hyperactive': 'never seems to stop moving',
    };
    
    const tempDesc = {
      'timid': 'and shies away from confrontation',
      'gentle': 'and treats others with care',
      'balanced': 'with a well-balanced temperament',
      'bold': 'and faces challenges head-on',
      'fierce': 'with an intimidating presence',
    };
    
    const socialDesc = {
      'solitary': 'It prefers its own company.',
      'reserved': 'It takes time to warm up to others.',
      'friendly': 'It enjoys making new friends.',
      'playful': 'It loves to play and have fun.',
      'attention-seeking': 'It craves constant attention.',
    };
    
    return `This creature ${energyDesc[p.energy] || 'has a unique energy'} ${tempDesc[p.temperament] || ''}. ${socialDesc[p.social] || ''} It is ${p.focus}.`;
  },
  
  // Generate starting stat bonuses based on body parts
  generateStartingBonuses: (bodyParts) => {
    const bonuses = { strength: 0, constitution: 0, agility: 0, power: 0, intelligence: 0 };
    
    if (!bodyParts) return bonuses;
    
    // Body type already gives modifiers via getEffectiveStats, but let's add some variety
    const bodyType = bodyParts.bodyType;
    
    // Eye type influences intelligence/power
    const eyeBonus = {
      'glowing': { power: 2 },
      'three': { intelligence: 2 },
      'four': { intelligence: 3 },
      'compound': { agility: 2 },
      'cyclops': { power: 1, strength: 1 },
      'cute': { intelligence: 1 },
      'angry': { strength: 1 },
    };
    if (eyeBonus[bodyParts.eyes]) {
      Object.entries(eyeBonus[bodyParts.eyes]).forEach(([stat, val]) => {
        bonuses[stat] += val;
      });
    }
    
    // Tail influences agility/strength
    const tailBonus = {
      'long': { agility: 2 },
      'scorpion': { power: 2, strength: 1 },
      'spiked': { strength: 2 },
      'fish': { agility: 2 },
      'fluffy': { constitution: 1 },
    };
    if (tailBonus[bodyParts.tail]) {
      Object.entries(tailBonus[bodyParts.tail]).forEach(([stat, val]) => {
        bonuses[stat] += val;
      });
    }
    
    // Wings influence agility/power
    const wingBonus = {
      'dragon': { power: 3, strength: 1 },
      'bat': { agility: 2 },
      'feathered': { agility: 2, intelligence: 1 },
      'fairy': { power: 2, intelligence: 1 },
      'small': { agility: 1 },
    };
    if (wingBonus[bodyParts.wings]) {
      Object.entries(wingBonus[bodyParts.wings]).forEach(([stat, val]) => {
        bonuses[stat] += val;
      });
    }
    
    // Horns influence strength/power
    const hornBonus = {
      'demon': { power: 2, strength: 1 },
      'antlers': { constitution: 2 },
      'single': { power: 2 },
      'curved': { strength: 2 },
      'ridge': { constitution: 1, strength: 1 },
      'triple': { power: 1, strength: 1, intelligence: 1 },
    };
    if (hornBonus[bodyParts.horns]) {
      Object.entries(hornBonus[bodyParts.horns]).forEach(([stat, val]) => {
        bonuses[stat] += val;
      });
    }
    
    // Arms influence strength
    const armBonus = {
      'bulky': { strength: 2 },
      'multi': { strength: 2, agility: 1 },
      'claws': { strength: 2 },
      'pincers': { strength: 3 },
      'tentacle': { agility: 2 },
    };
    if (armBonus[bodyParts.forearms]) {
      Object.entries(armBonus[bodyParts.forearms]).forEach(([stat, val]) => {
        bonuses[stat] += val;
      });
    }
    
    return bonuses;
  },
  
  // Set monster name
  setName: (monster, name) => {
    return { ...monster, name: name.trim() || monster.name };
  },
  
  getEffectiveStats: (monster) => {
    const base = monster.type.baseStats;
    const bonuses = monster.maxStatBonuses || { strength: 0, constitution: 0, agility: 0, power: 0, intelligence: 0 };
    const boosts = monster.temporaryBoosts || { strength: 0, constitution: 0, agility: 0, power: 0, intelligence: 0 };
    
    // Get body type stat modifiers
    const bodyType = BodyPartGenerator.getBodyType(monster.bodyParts?.bodyType);
    const bodyMods = bodyType?.statModifiers || { strength: 0, constitution: 0, agility: 0, power: 0, intelligence: 0 };
    
    return {
      strength: Math.round(Math.max(1, base.strength + bonuses.strength + boosts.strength + bodyMods.strength)),
      constitution: Math.round(Math.max(1, base.constitution + bonuses.constitution + boosts.constitution + bodyMods.constitution)),
      agility: Math.round(Math.max(1, base.agility + bonuses.agility + boosts.agility + bodyMods.agility)),
      power: Math.round(Math.max(1, base.power + bonuses.power + boosts.power + bodyMods.power)),
      intelligence: Math.round(Math.max(1, base.intelligence + bonuses.intelligence + boosts.intelligence + bodyMods.intelligence)),
    };
  },
  
  // Calculate EXP needed for next level
  getExpForLevel: (level) => {
    return Math.round(CONFIG.LEVELING.expPerLevel * Math.pow(CONFIG.LEVELING.levelMultiplier, level - 1));
  },
  
  // Add experience and handle level ups - returns { monster, leveledUp, statGains }
  addExperience: (monster, exp) => {
    if (monster.level >= CONFIG.LEVELING.maxLevel) return { monster, leveledUp: false, statGains: {} };
    
    const updated = { ...monster };
    updated.exp = (monster.exp || 0) + exp;
    let leveledUp = false;
    let statGains = { strength: 0, constitution: 0, agility: 0, power: 0, intelligence: 0 };
    
    // Check for level up
    let expNeeded = MonsterFactory.getExpForLevel(updated.level);
    while (updated.exp >= expNeeded && updated.level < CONFIG.LEVELING.maxLevel) {
      updated.exp -= expNeeded;
      updated.level += 1;
      leveledUp = true;
      
      // Grant stat bonuses based on current stat distribution
      // Higher stats gain more, lower stats gain less (reinforces specialization)
      const stats = MonsterFactory.getEffectiveStats(updated);
      const statValues = Object.entries(stats);
      
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
          statGains[statName] = (statGains[statName] || 0) + pointDistribution[index];
        }
      });
      
      expNeeded = MonsterFactory.getExpForLevel(updated.level);
    }
    
    return { monster: updated, leveledUp, statGains };
  },
  
  // Add training points (earned from battle wins)
  addTrainingPoints: (monster, points) => {
    return { ...monster, trainingPoints: (monster.trainingPoints || 0) + points };
  },
  
  // Spend training points to increase a stat (works for infants and adults)
  trainStat: (monster, statName) => {
    // Eggs can't train
    if (monster.stage === 'EGG') return { success: false, monster, message: 'Eggs cannot train' };
    
    const training = CONFIG.TRAINING_TYPES.find(t => t.stat === statName);
    if (!training) return { success: false, monster, message: 'Invalid stat' };
    
    const trainingPoints = monster.trainingPoints || 0;
    if (trainingPoints < training.cost) {
      return { success: false, monster, message: 'Not enough training points' };
    }
    
    const updated = { ...monster };
    updated.trainingPoints = trainingPoints - training.cost;
    updated.maxStatBonuses = {
      ...monster.maxStatBonuses,
      [statName]: Math.round((monster.maxStatBonuses[statName] || 0) + 1),
    };
    
    return { success: true, monster: updated, message: `+1 ${statName}!` };
  },
  
  // Get total stat bonuses
  getTotalStatBonuses: (monster) => {
    return Math.round(Object.values(monster.maxStatBonuses || {}).reduce((a, b) => a + b, 0));
  },
  
  // Evolve to next stage
  evolve: (monster) => {
    const stages = ['EGG', 'INFANT', 'ADULT'];
    const currentIndex = stages.indexOf(monster.stage);
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      const updated = { 
        ...monster, 
        stage: nextStage, 
        age: 0,
      };
      // Record hatch day when evolving from egg
      if (monster.stage === 'EGG') {
        updated.hatchDay = monster.daysOld || 0;
      }
      return updated;
    }
    return monster;
  },
  
  // Age monster and check for evolution
  tickAge: (monster) => {
    const updated = { 
      ...monster, 
      age: (monster.age || 0) + 1,
      daysOld: (monster.daysOld || 0) + 1, // Always increment total days
    };
    const stageConfig = CONFIG.STAGES[monster.stage];
    
    if (stageConfig && stageConfig.duration && updated.age >= stageConfig.duration) {
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
    
    // Generate random body parts for unique appearance
    const bodyParts = BodyPartGenerator.generateRandomParts();
    
    return {
      id: Utils.generateId(),
      name: Utils.generateMonsterName(), // Use same name generator as player
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
  generateMatchedEnemy: (playerMonster, powerMultiplier = 1.0) => {
    const playerStats = MonsterFactory.getEffectiveStats(playerMonster);
    const playerTotal = Object.values(playerStats).reduce((a, b) => a + b, 0);
    
    // Pick random monster type for appearance
    const type = CONFIG.MONSTER_TYPES[Math.floor(Math.random() * CONFIG.MONSTER_TYPES.length)];
    
    // Generate random body parts for unique appearance
    const bodyParts = BodyPartGenerator.generateRandomParts();
    
    // Enemy total stats should be slightly below or above player (±15%)
    // Apply power multiplier for FFA
    // Slight bias toward being weaker (55% chance weaker, 45% chance stronger)
    const isWeaker = Math.random() < 0.55;
    const variance = 0.05 + Math.random() * 0.10; // 5-15% difference
    let targetTotal = isWeaker 
      ? playerTotal * (1 - variance)  // 85-95% of player
      : playerTotal * (1 + variance); // 105-115% of player
    
    // Apply power multiplier
    targetTotal *= powerMultiplier;
    
    // Base stats from type
    const baseTotal = Object.values(type.baseStats).reduce((a, b) => a + b, 0);
    const bonusPool = Math.max(0, targetTotal - baseTotal);
    
    // RANDOMLY DISTRIBUTE bonus stats - create varied builds
    // Generate random weights for each stat
    const statNames = ['strength', 'constitution', 'agility', 'power', 'intelligence'];
    const weights = statNames.map(() => Math.random() * Math.random()); // Squared for more variance
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    
    // Distribute bonus pool according to weights
    const matchedBonuses = {};
    statNames.forEach((stat, i) => {
      const share = (weights[i] / totalWeight) * bonusPool;
      matchedBonuses[stat] = Math.max(0, Math.round(share));
    });
    
    // Occasionally give one stat a big spike (20% chance)
    if (Math.random() < 0.20) {
      const spikeStat = statNames[Math.floor(Math.random() * statNames.length)];
      const spikeAmount = Math.floor(bonusPool * 0.2); // Add 20% more to one stat
      matchedBonuses[spikeStat] += spikeAmount;
    }
    
    // Generate a trainer identity for this enemy
    const trainerId = Utils.generateId();
    const trainerName = Utils.generateTrainerName();
    
    return {
      id: Utils.generateId(),
      name: Utils.generateMonsterName(),
      type: {
        ...type,
        color: type.color,
      },
      stage: 'ADULT',
      isEnemy: true,
      trainerId: trainerId,
      trainerName: trainerName,
      bodyParts: bodyParts,
      maxStatBonuses: matchedBonuses,
      temporaryBoosts: { strength: 0, constitution: 0, agility: 0, power: 0, intelligence: 0 },
    };
  },
  
  // Generate enemy from existing rival data (they come back for revenge!)
  generateFromRival: (rival, playerMonster, powerMultiplier = 1.0) => {
    const playerStats = MonsterFactory.getEffectiveStats(playerMonster);
    const playerTotal = Object.values(playerStats).reduce((a, b) => a + b, 0);
    
    // Rivals are slightly stronger based on encounters (they've been training too!)
    const rivalBonus = 1 + (rival.encounters * 0.02); // +2% per encounter
    const targetTotal = playerTotal * powerMultiplier * rivalBonus;
    
    // Pick random type and body
    const type = CONFIG.MONSTER_TYPES[Math.floor(Math.random() * CONFIG.MONSTER_TYPES.length)];
    const bodyParts = BodyPartGenerator.generateRandomParts();
    
    const baseTotal = Object.values(type.baseStats).reduce((a, b) => a + b, 0);
    const bonusPool = Math.max(0, targetTotal - baseTotal);
    
    const statNames = ['strength', 'constitution', 'agility', 'power', 'intelligence'];
    const weights = statNames.map(() => Math.random() * Math.random());
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    
    const matchedBonuses = {};
    statNames.forEach((stat, i) => {
      const share = (weights[i] / totalWeight) * bonusPool;
      matchedBonuses[stat] = Math.max(0, Math.round(share));
    });
    
    return {
      id: Utils.generateId(),
      name: Utils.generateMonsterName(),
      type: { ...type, color: type.color },
      stage: 'ADULT',
      isEnemy: true,
      trainerId: rival.id, // Keep the same trainer ID
      trainerName: rival.name, // Keep the same trainer name
      isRivalRematch: true, // Flag for UI
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
  // Create a fighter object from a monster
  createFighter: (monster, x, y, facing = 1) => {
    const stats = MonsterFactory.getEffectiveStats(monster);
    return {
      monster: monster,
      stats: stats,
      x: x,
      y: y,
      health: 100 + stats.constitution * 5,
      maxHealth: 100 + stats.constitution * 5,
      vx: 0,
      vy: 0,
      lastAttack: 0,
      lastDodge: 0,
      dodgeEndTime: 0,
      state: 'idle',
      stateEndTime: 0,
      facing: facing,
      targetX: null,
      targetY: null,
      triggerEmoji: null,
      emojiUntil: 0,
      isEliminated: false,
    };
  },
  
  // Standard 1v1 battle
  createBattleState: (monster1, monster2) => {
    return {
      mode: '1v1',
      fighters: [
        BattleEngine.createFighter(monster1, CONFIG.BATTLE.arenaWidth / 2, CONFIG.BATTLE.arenaHeight - 70, 1),
        BattleEngine.createFighter(monster2, CONFIG.BATTLE.arenaWidth / 2, 70, -1),
      ],
      projectiles: [],
      effects: [],
      healOrbs: [],
      log: [],
      winner: null,
      tick: 0,
    };
  },
  
  // Multi-battle (up to 4 fighters)
  createMultiBattleState: (monsters) => {
    // Position fighters in corners (farthest from each other)
    const margin = 50;
    const positions = [
      { x: margin, y: CONFIG.BATTLE.arenaHeight - margin, facing: 1 }, // Bottom-left (player)
      { x: CONFIG.BATTLE.arenaWidth - margin, y: margin, facing: -1 }, // Top-right
      { x: margin, y: margin, facing: 1 }, // Top-left
      { x: CONFIG.BATTLE.arenaWidth - margin, y: CONFIG.BATTLE.arenaHeight - margin, facing: -1 }, // Bottom-right
    ];
    
    const fighters = monsters.slice(0, 4).map((monster, i) => {
      const pos = positions[i];
      return BattleEngine.createFighter(monster, pos.x, pos.y, pos.facing);
    });
    
    return {
      mode: 'ffa', // Free-for-all
      fighters: fighters,
      projectiles: [],
      effects: [],
      healOrbs: [],
      log: [],
      winner: null,
      eliminationOrder: [], // Track elimination order
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
  makeDecision: (fighter, enemy, tick, projectiles, healOrbs = []) => {
    const distance = Utils.distance(fighter.x, fighter.y, enemy.x, enemy.y);
    const now = tick * CONFIG.BATTLE.tickRate;
    const intelligence = fighter.stats.intelligence;
    const strength = fighter.stats.strength;
    const power = fighter.stats.power;
    const agility = fighter.stats.agility;
    
    // Intelligence reduces randomness (0-1 scale, capped at 30 INT)
    const smartness = Math.min(1, intelligence / 30);
    const randomFactor = Math.max(0.05, 0.5 - smartness * 0.45); // 5%-50% randomness
    
    // Health percentage for fear/heal decisions
    const healthPercent = fighter.health / fighter.maxHealth;
    const isLowHealth = healthPercent < 0.15;
    const isScared = isLowHealth && Math.random() < (0.7 - smartness * 0.3); // Smarter = braver
    
    // Check for heal orbs - smarter monsters seek healing when low
    if (healOrbs.length > 0 && healthPercent < 0.5) {
      const healAwareness = intelligence * CONFIG.STAT_EFFECTS.intelligenceHealAwareness;
      if (Math.random() < healAwareness + (isLowHealth ? 0.3 : 0)) {
        const nearestOrb = healOrbs.reduce((nearest, orb) => {
          const dist = Utils.distance(fighter.x, fighter.y, orb.x, orb.y);
          return !nearest || dist < nearest.dist ? { orb, dist } : nearest;
        }, null);
        if (nearestOrb && nearestOrb.dist < 150) {
          return { action: 'seekHeal', target: nearestOrb.orb };
        }
      }
    }
    
    // Check for incoming projectiles - intelligence affects dodge awareness
    const incomingProjectiles = projectiles.filter(p => 
      p.targetId === fighter.monster.id &&
      Utils.distance(p.x, p.y, fighter.x, fighter.y) < 80
    );
    
    // Dodge decision based on intelligence (awareness)
    const canDodge = now - fighter.lastDodge > CONFIG.BATTLE.dodgeCooldown;
    const dodgeAwareness = intelligence * CONFIG.STAT_EFFECTS.intelligenceDodgeAwareness;
    if (canDodge && incomingProjectiles.length > 0 && Math.random() < dodgeAwareness) {
      return { action: 'dodge', reason: 'projectile' };
    }
    
    // Attack decision
    // Agility affects ALL attack cooldowns
    const agilitySpeedBonus = 1 - (agility * CONFIG.STAT_EFFECTS.agilityAttackSpeedMultiplier);
    const effectiveCooldown = CONFIG.BATTLE.attackCooldown * Math.max(0.4, agilitySpeedBonus);
    const canAttack = now - fighter.lastAttack > effectiveCooldown;
    
    // Attack type based on STR vs POW - the bigger stat dominates
    const chooseAttackType = () => {
      const statDiff = power - strength;
      const preferMagic = statDiff > 0;
      const preference = Math.abs(statDiff) / 10; // How strongly they prefer (0-2+ range)
      
      // Smarter monsters stick to their specialty more consistently
      const consistencyBonus = smartness * 0.3;
      const switchChance = Math.max(0.05, 0.3 - preference * 0.1 - consistencyBonus);
      
      // Sometimes switch based on situation (smart monsters adapt)
      const isCloseRange = distance < CONFIG.BATTLE.attackRange * 1.2;
      if (smartness > 0.5) {
        // Smart: use melee when close if strength is decent, magic when far
        if (isCloseRange && strength > power * 0.7) return false;
        if (!isCloseRange && power > strength * 0.5) return true;
      }
      
      // Base decision with some randomness
      if (Math.random() < switchChance) {
        return !preferMagic; // Occasionally switch
      }
      return preferMagic;
    };
    
    const useMagic = chooseAttackType();
    const effectiveRange = useMagic ? CONFIG.BATTLE.projectileRange : CONFIG.BATTLE.attackRange;
    
    // Scared monsters retreat more
    if (isScared && distance < effectiveRange * 0.8) {
      if (Math.random() < 0.6 - smartness * 0.3) { // Smarter still fight
        return { action: 'retreat', scared: true };
      }
    }
    
    // Attack if in range and can attack
    if (canAttack && distance < effectiveRange) {
      return { action: 'attack', useMagic: useMagic };
    }
    
    // Approach if out of range (scared monsters approach more cautiously)
    if (distance > effectiveRange * (isScared ? 0.9 : 0.7)) {
      if (!isScared || Math.random() < smartness * 0.5) { // Smarter scared monsters still approach
        return { action: 'approach', cautious: isScared };
      }
      return { action: 'circle', direction: Math.random() > 0.5 ? 1 : -1 };
    }
    
    // Dodge melee attacks - intelligence based
    if (canDodge && enemy.state === 'attacking' && distance < CONFIG.BATTLE.attackRange * 1.5) {
      if (Math.random() < dodgeAwareness * 1.5) {
        return { action: 'dodge', reason: 'melee' };
      }
    }
    
    // If can't attack yet and in range, circle/strafe
    if (!canAttack && distance < effectiveRange) {
      if (Math.random() < 0.5 + smartness * 0.2) { // Smarter monsters strafe more
        return { action: 'circle', direction: Math.random() > 0.5 ? 1 : -1 };
      }
    }
    
    // Retreat if too close and ranged fighter
    if (useMagic && distance < CONFIG.BATTLE.attackRange * 0.8) {
      return { action: 'retreat' };
    }
    
    // Default to approach - always be aggressive
    return { action: 'approach' };
  },
  
  processTick: (battleState) => {
    if (battleState.winner) return battleState;
    
    const newState = { 
      ...battleState, 
      tick: battleState.tick + 1,
      projectiles: [...battleState.projectiles],
      effects: [...battleState.effects],
      fighters: battleState.fighters.map(f => ({ ...f })),
      healOrbs: battleState.healOrbs ? [...battleState.healOrbs] : [],
    };
    const [f1, f2] = newState.fighters;
    const now = newState.tick * CONFIG.BATTLE.tickRate;
    
    // Get active (non-eliminated) fighters - defined early since used throughout
    const activeFighters = newState.fighters.filter(f => !f.isEliminated && f.health > 0);
    
    // Spawn heal orbs randomly
    if (Math.random() < CONFIG.BATTLE.healOrbSpawnChance && newState.healOrbs.length < 3) {
      const margin = 50;
      newState.healOrbs.push({
        id: Utils.generateId(),
        x: margin + Math.random() * (CONFIG.BATTLE.arenaWidth - margin * 2),
        y: margin + Math.random() * (CONFIG.BATTLE.arenaHeight - margin * 2),
        createdAt: Date.now(),
      });
    }
    
    // Check heal orb collection
    newState.healOrbs = newState.healOrbs.filter(orb => {
      // Timeout after 10 seconds
      if (Date.now() - orb.createdAt > 10000) return false;
      
      // Check if any active fighter touches it
      for (const fighter of activeFighters) {
        if (fighter.isEliminated) continue;
        const dist = Utils.distance(fighter.x, fighter.y, orb.x, orb.y);
        if (dist < CONFIG.BATTLE.monsterRadius + CONFIG.BATTLE.healOrbRadius) {
          // Heal the fighter
          fighter.health = Math.min(fighter.maxHealth, fighter.health + CONFIG.BATTLE.healOrbAmount);
          newState.effects.push(BattleEngine.createEffect('heal', fighter.x, fighter.y, '#00ff00', 500));
          newState.log.push(`${fighter.monster.name} grabbed a heal orb! (+${CONFIG.BATTLE.healOrbAmount} HP)`);
          
          // Happy emoji
          if (Math.random() < 0.5) {
            fighter.triggerEmoji = ['💚', '✨', '😊', '💪'][Math.floor(Math.random() * 4)];
            fighter.emojiUntil = now + 800;
          }
          
          return false; // Remove orb
        }
      }
      return true; // Keep orb
    });
    
    // Clear expired effects
    newState.effects = newState.effects.filter(e => 
      Date.now() - e.createdAt < e.duration
    );
    
    // Update state timers for all fighters
    newState.fighters.forEach(fighter => {
      if (fighter.isEliminated) return;
      if (fighter.stateEndTime && now > fighter.stateEndTime) {
        fighter.state = 'idle';
        fighter.stateEndTime = 0;
      }
      if (fighter.dodgeEndTime && now > fighter.dodgeEndTime) {
        fighter.dodgeEndTime = 0;
      }
    });
    
    // Process projectiles - check against all active fighters
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
      
      // Check collision with target (or any enemy in FFA)
      const shooter = newState.fighters.find(f => f.monster.id === proj.shooterId);
      let target = newState.fighters.find(f => f.monster.id === proj.targetId);
      
      // In FFA, projectiles can hit anyone except shooter
      if (!target || target.isEliminated) {
        // Find closest enemy
        let closestDist = Infinity;
        activeFighters.forEach(f => {
          if (f.monster.id !== proj.shooterId) {
            const d = Utils.distance(proj.x, proj.y, f.x, f.y);
            if (d < closestDist) {
              closestDist = d;
              target = f;
            }
          }
        });
      }
      
      if (!target || target.isEliminated) return true; // No valid target
      
      const dist = Utils.distance(proj.x, proj.y, target.x, target.y);
      
      if (dist < CONFIG.BATTLE.monsterRadius + proj.size) {
        // Hit or dodge?
        if (target.dodgeEndTime && now < target.dodgeEndTime) {
          // Dodged!
          newState.effects.push(BattleEngine.createEffect('dodge', proj.x, proj.y, '#00ff88', 400));
          newState.log.push(`${target.monster.name} dodged the spell!`);
          
          // Emoji reaction for successful dodge (30% chance)
          if (Math.random() < 0.3) {
            target.triggerEmoji = ['😏', '💨', '✨', '😎'][Math.floor(Math.random() * 4)];
            target.emojiUntil = now + 800;
          }
        } else {
          // Hit!
          const damage = BattleEngine.calculateDamage(shooter, target, proj.isMagic);
          target.health -= damage;
          target.state = 'hit';
          target.stateEndTime = now + 200;
          
          // Emoji reactions (25% chance each)
          if (Math.random() < 0.25) {
            target.triggerEmoji = ['😣', '💥', '😵', '🤕'][Math.floor(Math.random() * 4)];
            target.emojiUntil = now + 600;
          }
          if (shooter && Math.random() < 0.25) {
            shooter.triggerEmoji = ['😤', '💪', '🔥', '⚡'][Math.floor(Math.random() * 4)];
            shooter.emojiUntil = now + 600;
          }
          
          // Check for scared state
          if (target.health / target.maxHealth < 0.15 && Math.random() < 0.4) {
            target.triggerEmoji = ['😰', '😱', '💀'][Math.floor(Math.random() * 3)];
            target.emojiUntil = now + 1000;
          }
          
          // Knockback
          if (shooter) {
            const attackerStats = shooter.stats;
            const defenderStats = target.stats;
            const attackStat = attackerStats.power;
            const defenseReduction = defenderStats.constitution / 30;
            const baseKnockback = 6 + (attackStat / 3);
            const finalKnockback = Math.max(4, baseKnockback * (1 - defenseReduction * 0.4));
            
            const knockbackDir = Math.atan2(target.y - proj.y, target.x - proj.x);
            target.vx += Math.cos(knockbackDir) * finalKnockback;
            target.vy += Math.sin(knockbackDir) * finalKnockback;
          }
          
          newState.effects.push(BattleEngine.createEffect('hit', target.x, target.y, '#ff4444', 300));
          newState.effects.push(BattleEngine.createEffect('magic', target.x, target.y, proj.color, 400));
          newState.log.push(`${shooter?.monster.name || 'Unknown'} blasted ${target.monster.name} for ${damage}!`);
        }
        return false; // Remove projectile
      }
      
      // Projectile timeout (3 seconds)
      if (Date.now() - proj.createdAt > 3000) return false;
      
      return true; // Keep projectile
    });
    
    // Process each fighter's AI and movement
    // In multi-battle, each fighter targets the closest enemy
    activeFighters.forEach((fighter) => {
      // Skip if in hit stun or eliminated
      if (fighter.state === 'hit' || fighter.isEliminated) return;
      
      // Find closest enemy (any other active fighter)
      let closestEnemy = null;
      let closestDist = Infinity;
      activeFighters.forEach(other => {
        if (other.monster.id !== fighter.monster.id && !other.isEliminated) {
          const d = Utils.distance(fighter.x, fighter.y, other.x, other.y);
          if (d < closestDist) {
            closestDist = d;
            closestEnemy = other;
          }
        }
      });
      
      if (!closestEnemy) return; // No enemy to fight
      const enemy = closestEnemy;
      
      const decision = BattleEngine.makeDecision(fighter, enemy, newState.tick, newState.projectiles, newState.healOrbs);
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
            // MELEE ATTACK - instant hit if in range, no projectile
            const dist = Utils.distance(fighter.x, fighter.y, enemy.x, enemy.y);
            if (dist < CONFIG.BATTLE.attackRange * 1.3) {
              // Check if enemy dodges (if they're in dodge state)
              if (enemy.dodgeEndTime && now < enemy.dodgeEndTime) {
                newState.log.push(`${enemy.monster.name} dodged the attack!`);
                // Miss effect
                newState.effects.push(BattleEngine.createEffect('miss', enemy.x, enemy.y, '#888888', 300));
              } else {
                // Direct hit!
                const damage = BattleEngine.calculateDamage(fighter, enemy, false);
                enemy.health -= damage;
                enemy.state = 'hit';
                enemy.stateEndTime = now + 200;
                
                // Emoji reactions (25% chance each)
                if (Math.random() < 0.25) {
                  enemy.triggerEmoji = ['😣', '💥', '😵', '🤕'][Math.floor(Math.random() * 4)];
                  enemy.emojiUntil = now + 600;
                }
                if (Math.random() < 0.25) {
                  fighter.triggerEmoji = ['😤', '💪', '👊', '🔥'][Math.floor(Math.random() * 4)];
                  fighter.emojiUntil = now + 600;
                }
                
                // Check for scared state
                if (enemy.health / enemy.maxHealth < 0.15 && Math.random() < 0.4) {
                  enemy.triggerEmoji = ['😰', '😱', '💀'][Math.floor(Math.random() * 3)];
                  enemy.emojiUntil = now + 1000;
                }
                
                // Calculate knockback - physical attacks have STRONGER knockback
                const attackerStats = MonsterFactory.getEffectiveStats(fighter.monster);
                const defenderStats = MonsterFactory.getEffectiveStats(enemy.monster);
                const attackStat = attackerStats.strength;
                const defenseReduction = 1 - (defenderStats.constitution / 30) * 0.4; // Up to 40% reduction
                const knockbackForce = Math.max(5, (6 + attackStat / 3) * defenseReduction); // Stronger melee knockback
                
                enemy.vx = Math.cos(aimAngle) * knockbackForce;
                enemy.vy = Math.sin(aimAngle) * knockbackForce;
                
                // Visual effect - slash/impact at enemy position
                newState.effects.push(BattleEngine.createEffect('melee', enemy.x, enemy.y, '#ffcc00', 400));
                newState.effects.push(BattleEngine.createEffect('hit', enemy.x, enemy.y, '#ff4444', 300));
                
                newState.log.push(`${fighter.monster.name} struck ${enemy.monster.name} for ${damage}!`);
                
                // Move attacker forward slightly (lunge)
                fighter.x += Math.cos(aimAngle) * 8;
                fighter.y += Math.sin(aimAngle) * 8;
              }
            }
          }
          break;
          
        case 'dodge':
          if (now - fighter.lastDodge > CONFIG.BATTLE.dodgeCooldown) {
            fighter.state = 'dodging';
            fighter.lastDodge = now;
            
            // Agility affects dodge speed and duration
            const agilityBonus = fighter.stats.agility / 20; // 0-1.5 range for typical stats
            const dodgeDuration = CONFIG.BATTLE.dodgeDuration * (1 + agilityBonus * 0.5); // Up to 50% longer i-frames
            const dodgeSpeed = speed * (3 + agilityBonus * 2); // Faster dodge with more agility
            
            fighter.dodgeEndTime = now + dodgeDuration;
            fighter.stateEndTime = now + 400;
            
            // Intelligence affects dodge direction accuracy
            // Smarter monsters dodge perpendicular to threats (harder to predict)
            // Dumber monsters dodge more randomly
            const intelligence = fighter.stats.intelligence || 10;
            const smartness = Math.min(1, intelligence / 25); // 0-1 scale, caps at 25 INT
            const randomness = (1 - smartness) * Math.PI * 0.8; // Less random with higher INT
            
            let dodgeAngle;
            if (decision.reason === 'projectile') {
              const nearestProj = newState.projectiles.find(p => p.targetId === fighter.monster.id);
              if (nearestProj) {
                // Smart: dodge perpendicular to projectile path
                // Dumb: dodge somewhat away from projectile with randomness
                const projAngle = Math.atan2(nearestProj.vy, nearestProj.vx);
                const perpendicularAngle = projAngle + (Math.PI / 2) * (Math.random() > 0.5 ? 1 : -1);
                const awayAngle = Math.atan2(fighter.y - nearestProj.y, fighter.x - nearestProj.x);
                
                // Blend between perpendicular (smart) and away (dumb) based on intelligence
                dodgeAngle = perpendicularAngle * smartness + awayAngle * (1 - smartness);
                dodgeAngle += (Math.random() - 0.5) * randomness;
              } else {
                dodgeAngle = Math.random() * Math.PI * 2;
              }
            } else {
              // Dodging melee: smart monsters sidestep, dumb ones back away randomly
              const awayAngle = Math.atan2(fighter.y - enemy.y, fighter.x - enemy.x);
              const sideAngle = awayAngle + (Math.PI / 2) * (Math.random() > 0.5 ? 1 : -1);
              
              dodgeAngle = sideAngle * smartness + awayAngle * (1 - smartness);
              dodgeAngle += (Math.random() - 0.5) * randomness;
            }
            
            // Check if dodge would go into wall - smart monsters avoid this
            const testX = fighter.x + Math.cos(dodgeAngle) * 50;
            const testY = fighter.y + Math.sin(dodgeAngle) * 50;
            const margin = CONFIG.BATTLE.monsterRadius + 20;
            
            if (smartness > 0.5) {
              // Smart monsters check if dodge goes into wall and adjust
              if (testX < margin || testX > CONFIG.BATTLE.arenaWidth - margin ||
                  testY < margin || testY > CONFIG.BATTLE.arenaHeight - margin) {
                // Flip dodge direction
                dodgeAngle += Math.PI;
              }
            }
            
            fighter.vx = Math.cos(dodgeAngle) * dodgeSpeed;
            fighter.vy = Math.sin(dodgeAngle) * dodgeSpeed;
            
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
          
        case 'seekHeal':
          // Move toward a heal orb
          if (decision.target) {
            fighter.state = 'moving';
            const healDx = decision.target.x - fighter.x;
            const healDy = decision.target.y - fighter.y;
            const healDist = Math.sqrt(healDx * healDx + healDy * healDy) || 1;
            fighter.vx += (healDx / healDist) * speed * 0.5; // Move faster toward heals
            fighter.vy += (healDy / healDist) * speed * 0.5;
            fighter.facing = healDx > 0 ? 1 : -1;
          }
          break;
          
        default:
          fighter.state = 'idle';
      }
      
      // Arena edge awareness based on intelligence
      // Smarter monsters avoid edges more effectively
      const stats = MonsterFactory.getEffectiveStats(fighter.monster);
      const intelligence = stats.intelligence || 10;
      const edgeAwareness = Math.min(1, intelligence / 25); // 0-1 scale, caps at 25 INT
      const edgeMargin = 30 + (edgeAwareness * 50); // 30-80 pixels from edge (smarter = more margin)
      const edgeForce = 0.2 + (edgeAwareness * 0.6); // How strongly to push away from edge
      
      const r = CONFIG.BATTLE.monsterRadius;
      const arenaW = CONFIG.BATTLE.arenaWidth;
      const arenaH = CONFIG.BATTLE.arenaHeight;
      
      // Calculate distance from each edge
      const distFromLeft = fighter.x - r;
      const distFromRight = arenaW - r - fighter.x;
      const distFromTop = fighter.y - r;
      const distFromBottom = arenaH - r - fighter.y;
      
      // Smart monsters preemptively steer away from edges
      if (distFromLeft < edgeMargin && distFromLeft > 0) {
        const urgency = 1 - (distFromLeft / edgeMargin);
        fighter.vx += edgeForce * urgency * (1 + edgeAwareness);
      }
      if (distFromRight < edgeMargin && distFromRight > 0) {
        const urgency = 1 - (distFromRight / edgeMargin);
        fighter.vx -= edgeForce * urgency * (1 + edgeAwareness);
      }
      if (distFromTop < edgeMargin && distFromTop > 0) {
        const urgency = 1 - (distFromTop / edgeMargin);
        fighter.vy += edgeForce * urgency * (1 + edgeAwareness);
      }
      if (distFromBottom < edgeMargin && distFromBottom > 0) {
        const urgency = 1 - (distFromBottom / edgeMargin);
        fighter.vy -= edgeForce * urgency * (1 + edgeAwareness);
      }
      
      // Dumb monsters (low INT) sometimes move toward edges accidentally
      if (edgeAwareness < 0.4 && Math.random() < 0.02) {
        // Random drift that might lead them to edges
        fighter.vx += (Math.random() - 0.5) * 0.5;
        fighter.vy += (Math.random() - 0.5) * 0.5;
      }
    });
    
    // Apply physics to all fighters
    newState.fighters.forEach(fighter => {
      if (fighter.isEliminated) return;
      
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
    
    // Collision between all active monster pairs
    for (let i = 0; i < activeFighters.length; i++) {
      for (let j = i + 1; j < activeFighters.length; j++) {
        BattleEngine.resolveCollision(activeFighters[i], activeFighters[j]);
      }
    }
    
    // HARD COLLISION with arena borders - bounce off walls
    newState.fighters.forEach(fighter => {
      if (fighter.isEliminated) return;
      
      const r = CONFIG.BATTLE.monsterRadius;
      const bounceForce = 0.6;
      const intelligence = fighter.stats.intelligence || 10;
      const smartBounce = Math.min(0.3, intelligence / 50);
      
      // Left wall
      if (fighter.x < r) {
        fighter.x = r;
        fighter.vx = Math.abs(fighter.vx) * (bounceForce + smartBounce);
        if (intelligence < 15 && Math.random() < 0.3) {
          fighter.vx *= 0.5;
        }
      }
      // Right wall
      if (fighter.x > CONFIG.BATTLE.arenaWidth - r) {
        fighter.x = CONFIG.BATTLE.arenaWidth - r;
        fighter.vx = -Math.abs(fighter.vx) * (bounceForce + smartBounce);
        if (intelligence < 15 && Math.random() < 0.3) {
          fighter.vx *= 0.5;
        }
      }
      // Top wall
      if (fighter.y < r) {
        fighter.y = r;
        fighter.vy = Math.abs(fighter.vy) * (bounceForce + smartBounce);
        if (intelligence < 15 && Math.random() < 0.3) {
          fighter.vy *= 0.5;
        }
      }
      // Bottom wall  
      if (fighter.y > CONFIG.BATTLE.arenaHeight - r) {
        fighter.y = CONFIG.BATTLE.arenaHeight - r;
        fighter.vy = -Math.abs(fighter.vy) * (bounceForce + smartBounce);
        if (intelligence < 15 && Math.random() < 0.3) {
          fighter.vy *= 0.5;
        }
      }
    });
    
    // Check for eliminations and winner
    newState.fighters.forEach(fighter => {
      if (!fighter.isEliminated && fighter.health <= 0) {
        fighter.health = 0;
        fighter.isEliminated = true;
        newState.eliminationOrder = newState.eliminationOrder || [];
        newState.eliminationOrder.push(fighter.monster.id);
        newState.effects.push(BattleEngine.createEffect('hit', fighter.x, fighter.y, '#ff0000', 800));
        newState.log.push(`💀 ${fighter.monster.name} was eliminated!`);
      }
    });
    
    // Check for winner (last one standing)
    const remaining = newState.fighters.filter(f => !f.isEliminated && f.health > 0);
    if (remaining.length === 1 && !newState.winner) {
      newState.winner = remaining[0].monster;
      newState.log.push(`🏆 ${remaining[0].monster.name} wins!`);
    } else if (remaining.length === 0 && !newState.winner) {
      // Draw - shouldn't happen but handle it
      newState.winner = { name: 'Draw', isEnemy: true };
      newState.log.push(`⚔️ It's a draw!`);
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

// Emotion to emoji mapping
const EMOTION_EMOJIS = {
  happy: ['😊', '😄', '🥰', '✨'],
  love: ['💕', '💖', '😍', '🥰', '💗'],
  fierce: ['😤', '💢', '🔥', '⚔️'],
  hurt: ['😣', '💫', '😵', '🤕'],
  alert: ['❗', '👀', '⚡', '🎯'],
  worried: ['😰', '😟', '💦', '😥'],
  determined: ['😠', '💪', '🔥', '😤'],
  sleeping: ['💤', '😴', '🌙'],
  excited: ['🎉', '⭐', '✨', '🌟'],
  sad: ['😢', '💔', '😿'],
  confused: ['❓', '🤔', '❔'],
  victorious: ['🏆', '👑', '🎊', '💫'],
  defeated: ['💀', '😵', '☠️'],
};

// Monster Display Component - Renders unique SVG monsters with animations and expressions
const MonsterSprite = ({ monster, size = 80, showStats = false, isInBattle = false, fighter = null, emotion = 'happy', showEmoji = true, forcedEmoji = null }) => {
  const [currentEmoji, setCurrentEmoji] = React.useState(null);
  const [emojiVisible, setEmojiVisible] = React.useState(false);
  const lastEmotionRef = React.useRef(null);
  const emojiTimeoutRef = React.useRef(null);
  
  const effectiveStats = MonsterFactory.getEffectiveStats(monster);
  const isEnemy = monster.isEnemy;
  
  // Size scaling based on constitution/health (bigger monsters = more health)
  // Scale from 0.7x to 1.3x based on constitution
  const constitution = effectiveStats.constitution || 10;
  const sizeScale = Math.min(1.3, Math.max(0.7, 0.7 + (constitution / 50)));
  const scaledSize = size * sizeScale;
  
  // Determine current emotion based on context
  const getCurrentEmotion = () => {
    if (fighter) {
      const healthPercent = fighter.health / fighter.maxHealth;
      if (fighter.state === 'hit') return 'hurt';
      if (fighter.state === 'attacking') return 'fierce';
      if (fighter.state === 'dodging') return 'alert';
      if (healthPercent < 0.3) return 'worried';
      if (healthPercent < 0.6) return 'determined';
      return 'fierce';
    }
    return emotion; // Default emotion passed in
  };
  
  const currentEmotion = getCurrentEmotion();
  
  // Show emoji when emotion changes or battle triggers
  React.useEffect(() => {
    if (!showEmoji) return;
    
    // Check for battle-triggered emoji from fighter state
    if (fighter && fighter.triggerEmoji && Date.now() < fighter.emojiUntil) {
      setCurrentEmoji(fighter.triggerEmoji);
      setEmojiVisible(true);
      
      if (emojiTimeoutRef.current) clearTimeout(emojiTimeoutRef.current);
      emojiTimeoutRef.current = setTimeout(() => {
        setEmojiVisible(false);
      }, 600);
      return;
    }
    
    // Use forced emoji if provided
    if (forcedEmoji) {
      setCurrentEmoji(forcedEmoji);
      setEmojiVisible(true);
      
      if (emojiTimeoutRef.current) clearTimeout(emojiTimeoutRef.current);
      emojiTimeoutRef.current = setTimeout(() => {
        setEmojiVisible(false);
      }, 1000);
      return;
    }
    
    // Only trigger on emotion change (but not too frequently in battle)
    if (currentEmotion !== lastEmotionRef.current) {
      lastEmotionRef.current = currentEmotion;
      
      // In battle, reduce emotion emoji frequency
      if (fighter && Math.random() > 0.3) return;
      
      // Get random emoji for this emotion
      const emojis = EMOTION_EMOJIS[currentEmotion] || EMOTION_EMOJIS.happy;
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      
      setCurrentEmoji(randomEmoji);
      setEmojiVisible(true);
      
      // Hide after delay - 1 second
      if (emojiTimeoutRef.current) clearTimeout(emojiTimeoutRef.current);
      emojiTimeoutRef.current = setTimeout(() => {
        setEmojiVisible(false);
      }, 1000);
    }
    
    return () => {
      if (emojiTimeoutRef.current) clearTimeout(emojiTimeoutRef.current);
    };
  }, [currentEmotion, showEmoji, forcedEmoji, fighter?.triggerEmoji, fighter?.emojiUntil]);
  
  // Generate a personality seed from monster ID for consistent random behaviors
  const getPersonalitySeed = (id) => {
    let hash = 0;
    const str = id || 'default';
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };
  
  const personalitySeed = getPersonalitySeed(monster.id);
  const bodyType = BodyPartGenerator.getBodyType(monster.bodyParts?.bodyType);
  
  // Personality traits derived from seed
  const personality = {
    speed: 0.8 + (personalitySeed % 5) * 0.15, // Animation speed multiplier (0.8 - 1.4)
    bounce: 0.5 + (personalitySeed % 7) * 0.15, // Bounce intensity (0.5 - 1.4)
    sway: 0.3 + (personalitySeed % 4) * 0.2, // Sway amount (0.3 - 0.9)
    blink: 2 + (personalitySeed % 4), // Blink frequency in seconds (2 - 5)
    fidget: (personalitySeed % 3) === 0, // Whether monster fidgets
  };
  
  // Get animation style based on body type - SMOOTHER & FLOATIER
  const getBodyTypeAnimation = () => {
    const baseSpeed = 2.5 / personality.speed; // Slower base for floatier feel
    const floatyEase = 'cubic-bezier(0.45, 0.05, 0.55, 0.95)'; // Smooth in-out
    
    switch (bodyType?.id) {
      case 'floater':
        return {
          animation: `float ${baseSpeed * 1.2}s ${floatyEase} infinite`,
          transformOrigin: 'center center',
        };
      case 'hopper':
        return {
          animation: `hop ${baseSpeed * 0.7}s cubic-bezier(0.34, 1.56, 0.64, 1) infinite`,
          transformOrigin: 'center bottom',
        };
      case 'serpentine':
        return {
          animation: `slither ${baseSpeed * 1.4}s ${floatyEase} infinite`,
          transformOrigin: 'center center',
        };
      case 'amorphous':
        return {
          animation: `blob ${baseSpeed * 1.8}s ${floatyEase} infinite`,
          transformOrigin: 'center center',
        };
      case 'quadruped':
      case 'hexapod':
      case 'arachnid':
        return {
          animation: `creep ${baseSpeed * 1.1}s ${floatyEase} infinite`,
          transformOrigin: 'center bottom',
        };
      case 'winged':
        return {
          animation: `wingFlap ${baseSpeed * 0.6}s ${floatyEase} infinite`,
          transformOrigin: 'center center',
        };
      case 'centauroid':
        return {
          animation: `trot ${baseSpeed * 0.9}s ${floatyEase} infinite`,
          transformOrigin: 'center bottom',
        };
      case 'bipedal':
      default:
        return {
          animation: `idle ${baseSpeed * 1.1}s ${floatyEase} infinite`,
          transformOrigin: 'center bottom',
        };
    }
  };

  // Generate SVG content for the monster
  const renderMonsterSVG = (spriteSize) => {
    const primaryColor = monster.type.color;
    const secondaryColor = monster.type.secondaryColor || monster.type.color;
    const isInfant = monster.stage === 'INFANT';
    
    // For infants, render a simpler, cuter version
    let svgContent;
    if (isInfant) {
      // Infant: just head, big eyes, maybe tiny limbs - no complex body parts
      const eyesPart = BodyPartGenerator.getPart('eyes', monster.bodyParts.eyes);
      const cheeksPart = BodyPartGenerator.getPart('cheeks', monster.bodyParts.cheeks);
      
      // Simple round body with big head
      svgContent = `
        <!-- Infant Body - Simple and cute -->
        <ellipse cx="50" cy="70" rx="18" ry="16" fill="${primaryColor}"/>
        <!-- Big round head -->
        <circle cx="50" cy="40" r="28" fill="${primaryColor}"/>
        <!-- Blush cheeks always visible for infants -->
        <ellipse cx="30" cy="45" rx="6" ry="4" fill="#ff9999" opacity="0.5"/>
        <ellipse cx="70" cy="45" rx="6" ry="4" fill="#ff9999" opacity="0.5"/>
        <!-- Eyes - bigger and more centered -->
        <g transform="translate(0, 8) scale(1.2)" style="transform-origin: 50px 28px;">
          ${eyesPart?.render(primaryColor, secondaryColor) || `
            <g class="eye-group">
              <circle cx="40" cy="35" r="8" fill="#fff"/>
              <circle cx="60" cy="35" r="8" fill="#fff"/>
              <g class="pupil">
                <circle cx="42" cy="36" r="4" fill="#111"/>
                <circle cx="62" cy="36" r="4" fill="#111"/>
                <circle cx="43" cy="34" r="2" fill="#fff"/>
                <circle cx="63" cy="34" r="2" fill="#fff"/>
              </g>
            </g>
          `}
        </g>
        <!-- Tiny stub limbs -->
        <ellipse cx="32" cy="68" rx="6" ry="8" fill="${primaryColor}"/>
        <ellipse cx="68" cy="68" rx="6" ry="8" fill="${primaryColor}"/>
        <ellipse cx="40" cy="82" rx="5" ry="6" fill="${primaryColor}"/>
        <ellipse cx="60" cy="82" rx="5" ry="6" fill="${primaryColor}"/>
        <!-- Tiny tail nub if they have a tail -->
        ${monster.bodyParts.tail !== 'none' ? `<ellipse cx="50" cy="85" rx="8" ry="5" fill="${primaryColor}"/>` : ''}
      `;
    } else {
      svgContent = BodyPartGenerator.renderMonster(
        monster.bodyParts,
        primaryColor,
        secondaryColor
      );
    }
    
    // Add CSS animations as a style element
    // Use personality seed to vary blink timing
    const blinkDelay = personality.blink;
    const lookSpeed = 3 + (personalitySeed % 3);
    
    // Emotion-based expression modifiers - MORE EXPRESSIVE
    const emotionStyles = {
      happy: `
        .mouth { 
          transform: translateY(-2px) scaleX(1.1); 
          animation: mouthSmileWiggle 1.5s ease-in-out infinite;
        }
        .eye-group { 
          transform: scaleY(1.15) scaleX(1.05); 
          animation: eyeSparkle 2s ease-in-out infinite;
        }
        .pupil { animation: pupilHappy 2s ease-in-out infinite; }
        .ear-left, .ear-right { animation-duration: 0.8s !important; }
        .tail { animation-duration: 0.5s !important; }
        .cheeks { opacity: 0.7; animation: cheekPulse 1.5s ease-in-out infinite; }
      `,
      love: `
        .mouth { 
          transform: scaleX(1.3) translateY(-3px); 
          animation: mouthLoveWobble 1s ease-in-out infinite;
        }
        .eye-group { 
          transform: scaleY(0.7) scaleX(1.2); 
          animation: eyeLoveSqueeze 0.8s ease-in-out infinite;
        }
        .pupil { 
          transform: scale(1.5); 
          animation: pupilDilateHeart 0.6s ease-in-out infinite;
        }
        .tail { animation-duration: 0.25s !important; }
        .wing-left, .wing-right { animation-duration: 0.25s !important; }
        .cheeks { opacity: 1; transform: scale(1.2); }
      `,
      fierce: `
        .mouth { 
          transform: scaleY(1.4) scaleX(1.2) translateY(3px); 
          animation: mouthSnarl 0.3s ease-in-out infinite;
        }
        .eye-group { 
          transform: scaleY(0.6) translateY(3px) skewX(-5deg); 
          animation: eyeGlare 0.4s ease-in-out infinite;
        }
        .pupil { transform: scale(0.8) translateY(1px); }
        .ear-left { transform: rotate(-15deg) translateY(-2px); }
        .ear-right { transform: rotate(15deg) translateY(-2px); }
      `,
      hurt: `
        .mouth { 
          transform: scaleX(0.5) scaleY(1.8) translateY(4px); 
          animation: mouthPain 0.15s ease-in-out infinite;
        }
        .eye-group { 
          transform: scaleX(1.4) scaleY(0.4) translateY(-2px); 
          animation: eyeSquint 0.1s ease-in-out infinite;
        }
        .pupil { transform: scale(0.6); }
        .ear-left { transform: rotate(25deg) translateY(3px) !important; }
        .ear-right { transform: rotate(-25deg) translateY(3px) !important; }
        .cheeks { opacity: 0; }
      `,
      alert: `
        .mouth { transform: scaleY(0.7) scaleX(0.8); }
        .eye-group { 
          transform: scaleY(1.4) scaleX(1.2); 
          animation: eyeWiden 0.3s ease-out;
        }
        .pupil { 
          transform: scale(0.6); 
          animation: pupilDart 0.5s ease-in-out infinite;
        }
        .ear-left, .ear-right { 
          transform: rotate(-8deg) translateY(-5px); 
          animation: earPerk 0.3s ease-out;
        }
      `,
      worried: `
        .mouth { 
          transform: scaleX(0.5) scaleY(0.8) translateY(5px); 
          animation: mouthTremble 0.4s ease-in-out infinite;
        }
        .eye-group { 
          transform: scaleY(1.3) scaleX(0.9) translateY(-3px); 
          animation: eyeWorry 0.6s ease-in-out infinite;
        }
        .pupil { 
          transform: scale(1.1) translateY(-1px); 
          animation: pupilShake 0.3s ease-in-out infinite;
        }
        .ear-left { transform: rotate(25deg) translateY(2px) !important; }
        .ear-right { transform: rotate(-25deg) translateY(2px) !important; }
      `,
      determined: `
        .mouth { 
          transform: scaleY(0.7) scaleX(1.1); 
          animation: mouthGrit 0.8s ease-in-out infinite;
        }
        .eye-group { 
          transform: scaleY(0.8) translateY(2px); 
          animation: eyeFocus 1s ease-in-out infinite;
        }
        .pupil { transform: scale(0.9); }
        .ear-left, .ear-right { transform: rotate(-5deg); }
      `,
      sleeping: `
        .eye-group { 
          transform: scaleY(0.05); 
          animation: eyeSleep 3s ease-in-out infinite;
        }
        .mouth { 
          transform: scaleX(1.3) scaleY(0.6) translateY(2px); 
          animation: mouthSleep 3s ease-in-out infinite;
        }
        .ear-left, .ear-right { transform: rotate(35deg) translateY(3px); }
      `,
      excited: `
        .mouth { 
          transform: scaleX(1.4) scaleY(1.3) translateY(-2px); 
          animation: mouthExcited 0.4s ease-in-out infinite;
        }
        .eye-group { 
          transform: scaleY(1.3) scaleX(1.2); 
          animation: eyeExcited 0.3s ease-in-out infinite;
        }
        .pupil { 
          transform: scale(1.3); 
          animation: pupilBounce 0.3s ease-in-out infinite;
        }
        .ear-left, .ear-right { animation-duration: 0.3s !important; }
        .cheeks { opacity: 0.9; animation: cheekPulse 0.4s ease-in-out infinite; }
      `,
      confused: `
        .mouth { 
          transform: skewX(10deg) scaleX(0.8); 
          animation: mouthConfused 1s ease-in-out infinite;
        }
        .eye-group { 
          transform: scaleY(1.1); 
          animation: eyeConfused 1.2s ease-in-out infinite;
        }
        .pupil { animation: pupilWander 1.5s ease-in-out infinite; }
        .ear-left { transform: rotate(10deg); }
        .ear-right { transform: rotate(-20deg); }
      `,
    };
    
    const currentEmotionStyle = emotionStyles[currentEmotion] || emotionStyles.happy;
    
    const animationStyles = `
      /* Smooth floating base animation for all movements */
      * { transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1); }
      
      /* FACIAL EXPRESSION KEYFRAMES */
      @keyframes mouthSmileWiggle {
        0%, 100% { transform: translateY(-2px) scaleX(1.1) rotate(0deg); }
        25% { transform: translateY(-3px) scaleX(1.15) rotate(-2deg); }
        75% { transform: translateY(-3px) scaleX(1.15) rotate(2deg); }
      }
      @keyframes mouthLoveWobble {
        0%, 100% { transform: scaleX(1.3) translateY(-3px); }
        50% { transform: scaleX(1.4) translateY(-4px) scaleY(1.1); }
      }
      @keyframes mouthSnarl {
        0%, 100% { transform: scaleY(1.4) scaleX(1.2) translateY(3px); }
        50% { transform: scaleY(1.5) scaleX(1.1) translateY(2px); }
      }
      @keyframes mouthPain {
        0%, 100% { transform: scaleX(0.5) scaleY(1.8) translateY(4px); }
        50% { transform: scaleX(0.6) scaleY(2) translateY(5px) rotate(5deg); }
      }
      @keyframes mouthTremble {
        0%, 100% { transform: scaleX(0.5) scaleY(0.8) translateY(5px); }
        25% { transform: scaleX(0.55) scaleY(0.75) translateY(4px) rotate(-2deg); }
        75% { transform: scaleX(0.45) scaleY(0.85) translateY(6px) rotate(2deg); }
      }
      @keyframes mouthGrit {
        0%, 100% { transform: scaleY(0.7) scaleX(1.1); }
        50% { transform: scaleY(0.65) scaleX(1.15); }
      }
      @keyframes mouthSleep {
        0%, 100% { transform: scaleX(1.3) scaleY(0.6) translateY(2px); }
        50% { transform: scaleX(1.5) scaleY(0.8) translateY(3px); }
      }
      @keyframes mouthExcited {
        0%, 100% { transform: scaleX(1.4) scaleY(1.3) translateY(-2px); }
        50% { transform: scaleX(1.5) scaleY(1.4) translateY(-4px); }
      }
      @keyframes mouthConfused {
        0%, 100% { transform: skewX(10deg) scaleX(0.8); }
        50% { transform: skewX(-5deg) scaleX(0.9); }
      }
      
      @keyframes eyeSparkle {
        0%, 100% { transform: scaleY(1.15) scaleX(1.05); }
        50% { transform: scaleY(1.2) scaleX(1.08); filter: brightness(1.1); }
      }
      @keyframes eyeLoveSqueeze {
        0%, 100% { transform: scaleY(0.7) scaleX(1.2); }
        50% { transform: scaleY(0.6) scaleX(1.25); }
      }
      @keyframes eyeGlare {
        0%, 100% { transform: scaleY(0.6) translateY(3px) skewX(-5deg); }
        50% { transform: scaleY(0.55) translateY(4px) skewX(-8deg); }
      }
      @keyframes eyeSquint {
        0%, 100% { transform: scaleX(1.4) scaleY(0.4) translateY(-2px); }
        50% { transform: scaleX(1.5) scaleY(0.3) translateY(-1px); }
      }
      @keyframes eyeWiden {
        0% { transform: scaleY(1) scaleX(1); }
        100% { transform: scaleY(1.4) scaleX(1.2); }
      }
      @keyframes eyeWorry {
        0%, 100% { transform: scaleY(1.3) scaleX(0.9) translateY(-3px); }
        50% { transform: scaleY(1.35) scaleX(0.85) translateY(-4px); }
      }
      @keyframes eyeFocus {
        0%, 100% { transform: scaleY(0.8) translateY(2px); }
        50% { transform: scaleY(0.75) translateY(3px); }
      }
      @keyframes eyeSleep {
        0%, 90%, 100% { transform: scaleY(0.05); }
        95% { transform: scaleY(0.15); }
      }
      @keyframes eyeExcited {
        0%, 100% { transform: scaleY(1.3) scaleX(1.2); }
        50% { transform: scaleY(1.4) scaleX(1.25) translateY(-2px); }
      }
      @keyframes eyeConfused {
        0%, 100% { transform: scaleY(1.1) rotate(0deg); }
        25% { transform: scaleY(1.05) rotate(3deg); }
        75% { transform: scaleY(1.15) rotate(-3deg); }
      }
      
      @keyframes pupilHappy {
        0%, 100% { transform: scale(1) translate(0, 0); }
        25% { transform: scale(1.05) translate(1px, 0); }
        75% { transform: scale(1.05) translate(-1px, 0); }
      }
      @keyframes pupilDilateHeart {
        0%, 100% { transform: scale(1.5); }
        50% { transform: scale(1.7); }
      }
      @keyframes pupilDart {
        0%, 100% { transform: scale(0.6) translate(0, 0); }
        25% { transform: scale(0.6) translate(2px, -1px); }
        50% { transform: scale(0.6) translate(-2px, 0); }
        75% { transform: scale(0.6) translate(1px, 1px); }
      }
      @keyframes pupilShake {
        0%, 100% { transform: scale(1.1) translateX(0); }
        25% { transform: scale(1.1) translateX(-1px); }
        75% { transform: scale(1.1) translateX(1px); }
      }
      @keyframes pupilBounce {
        0%, 100% { transform: scale(1.3) translateY(0); }
        50% { transform: scale(1.4) translateY(-2px); }
      }
      @keyframes pupilWander {
        0%, 100% { transform: translate(0, 0); }
        25% { transform: translate(2px, -1px); }
        50% { transform: translate(-1px, 1px); }
        75% { transform: translate(1px, 2px); }
      }
      
      @keyframes earPerk {
        0% { transform: rotate(0deg) translateY(0); }
        100% { transform: rotate(-8deg) translateY(-5px); }
      }
      @keyframes cheekPulse {
        0%, 100% { opacity: 0.7; transform: scale(1); }
        50% { opacity: 0.9; transform: scale(1.1); }
      }
      
      /* SMOOTH BODY MOVEMENT KEYFRAMES */
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(-1deg); }
        25% { transform: translateY(-4px) rotate(-0.5deg); }
        50% { transform: translateY(-8px) rotate(1deg); }
        75% { transform: translateY(-4px) rotate(0.5deg); }
      }
      @keyframes hop {
        0%, 100% { transform: translateY(0px) scaleY(1); }
        15% { transform: translateY(2px) scaleY(0.92); }
        30% { transform: translateY(-12px) scaleY(1.08); }
        50% { transform: translateY(-15px) scaleY(1.02); }
        70% { transform: translateY(-8px) scaleY(1.04); }
        85% { transform: translateY(0px) scaleY(0.94); }
        92% { transform: translateY(0px) scaleY(1.03); }
      }
      @keyframes slither {
        0%, 100% { transform: translateX(0px) skewX(0deg) rotate(0deg); }
        25% { transform: translateX(4px) skewX(3deg) rotate(1deg); }
        50% { transform: translateX(0px) skewX(0deg) rotate(0deg); }
        75% { transform: translateX(-4px) skewX(-3deg) rotate(-1deg); }
      }
      @keyframes blob {
        0%, 100% { transform: scale(1, 1) rotate(0deg); }
        25% { transform: scale(1.04, 0.96) rotate(0.5deg); }
        50% { transform: scale(0.96, 1.04) rotate(0deg); }
        75% { transform: scale(1.02, 0.98) rotate(-0.5deg); }
      }
      @keyframes creep {
        0%, 100% { transform: translateY(0px) rotate(0deg) scaleX(1); }
        25% { transform: translateY(-2px) rotate(-1deg) scaleX(1.02); }
        50% { transform: translateY(-3px) rotate(0deg) scaleX(0.98); }
        75% { transform: translateY(-2px) rotate(1deg) scaleX(1.02); }
      }
      @keyframes wingFlap {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        25% { transform: translateY(-3px) rotate(-2deg); }
        50% { transform: translateY(-6px) rotate(0deg); }
        75% { transform: translateY(-3px) rotate(2deg); }
      }
      @keyframes trot {
        0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
        25% { transform: translateY(-3px) translateX(1px); }
        75% { transform: translateY(-3px) translateX(-1px); }
      }
      @keyframes idle {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-3px); }
      }
      @keyframes breathe {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
      }
      @keyframes tailWag {
        0%, 100% { transform: rotate(-5deg); }
        50% { transform: rotate(5deg); }
      }
      @keyframes earTwitch {
        0%, 85%, 100% { transform: rotate(0deg); }
        90% { transform: rotate(10deg); }
        95% { transform: rotate(-5deg); }
      }
      
      /* Eye animations */
      @keyframes blink {
        0%, 92%, 100% { transform: scaleY(1); }
        95%, 97% { transform: scaleY(0.1); }
      }
      @keyframes lookAround {
        0%, 40%, 100% { transform: translateX(0px); }
        10%, 30% { transform: translateX(1.5px); }
        50%, 70% { transform: translateX(-1.5px); }
        80%, 90% { transform: translateX(0px) translateY(-0.5px); }
      }
      @keyframes eyeGlow {
        0%, 100% { opacity: 0.8; filter: brightness(1); }
        50% { opacity: 1; filter: brightness(1.3); }
      }
      @keyframes pupilDilate {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
      @keyframes shineMove {
        0%, 100% { transform: translate(0px, 0px); }
        25% { transform: translate(0.5px, -0.5px); }
        75% { transform: translate(-0.5px, 0.5px); }
      }
      
      .eye-blink {
        animation: blink ${blinkDelay}s ease-in-out infinite;
        transform-origin: center center;
      }
      .pupil {
        animation: lookAround ${lookSpeed}s ease-in-out infinite, pupilDilate ${lookSpeed * 2}s ease-in-out infinite;
        transform-origin: center center;
      }
      .eye-shine {
        animation: shineMove ${lookSpeed * 0.8}s ease-in-out infinite;
      }
      .eye-glow {
        animation: eyeGlow ${blinkDelay * 0.7}s ease-in-out infinite;
      }
      .compound-facets {
        animation: eyeGlow ${blinkDelay * 0.5}s ease-in-out infinite;
      }
      .sleepy-eyes {
        animation: breathe ${blinkDelay * 1.5}s ease-in-out infinite;
        transform-origin: center center;
      }
      
      /* Ear animations */
      @keyframes earTwitchLeft {
        0%, 85%, 100% { transform: rotate(0deg); }
        88% { transform: rotate(-8deg); }
        92% { transform: rotate(3deg); }
        96% { transform: rotate(-2deg); }
      }
      @keyframes earTwitchRight {
        0%, 80%, 100% { transform: rotate(0deg); }
        83% { transform: rotate(8deg); }
        87% { transform: rotate(-3deg); }
        91% { transform: rotate(2deg); }
      }
      @keyframes earFlop {
        0%, 100% { transform: rotate(0deg); }
        50% { transform: rotate(3deg); }
      }
      @keyframes antennaWiggle {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-5deg); }
        75% { transform: rotate(5deg); }
      }
      @keyframes finWave {
        0%, 100% { transform: scaleY(1); }
        50% { transform: scaleY(1.15); }
      }
      
      .ear-left { animation: earTwitchLeft ${4 + (personalitySeed % 3)}s ease-in-out infinite; transform-origin: 28px 30px; }
      .ear-right { animation: earTwitchRight ${4.5 + (personalitySeed % 3)}s ease-in-out infinite; transform-origin: 72px 30px; }
      .ear-floppy-left { animation: earFlop ${2 + personality.speed}s ease-in-out infinite; transform-origin: 22px 20px; }
      .ear-floppy-right { animation: earFlop ${2.2 + personality.speed}s ease-in-out infinite; transform-origin: 78px 20px; }
      .antenna-left { animation: antennaWiggle ${1.5 + personality.speed * 0.5}s ease-in-out infinite; transform-origin: 40px 15px; }
      .antenna-right { animation: antennaWiggle ${1.7 + personality.speed * 0.5}s ease-in-out infinite; transform-origin: 60px 15px; }
      .ear-fin { animation: finWave ${1.8 + personality.speed * 0.3}s ease-in-out infinite; transform-origin: 50px 8px; }
      
      /* Joint-based arm animations - bend at shoulder and elbow */
      @keyframes shoulderSwingLeft {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-12deg); }
        75% { transform: rotate(8deg); }
      }
      @keyframes shoulderSwingRight {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(12deg); }
        75% { transform: rotate(-8deg); }
      }
      @keyframes elbowBendLeft {
        0%, 100% { transform: rotate(0deg); }
        30% { transform: rotate(-15deg); }
        60% { transform: rotate(10deg); }
      }
      @keyframes elbowBendRight {
        0%, 100% { transform: rotate(0deg); }
        30% { transform: rotate(15deg); }
        60% { transform: rotate(-10deg); }
      }
      @keyframes wristFlickLeft {
        0%, 100% { transform: rotate(0deg); }
        40% { transform: rotate(-8deg); }
        80% { transform: rotate(5deg); }
      }
      @keyframes wristFlickRight {
        0%, 100% { transform: rotate(0deg); }
        40% { transform: rotate(8deg); }
        80% { transform: rotate(-5deg); }
      }
      @keyframes pincerSnap {
        0%, 90%, 100% { transform: scaleX(1); }
        95% { transform: scaleX(0.85); }
      }
      @keyframes tentacleWave {
        0%, 100% { transform: rotate(0deg) translateX(0); }
        33% { transform: rotate(8deg) translateX(3px); }
        66% { transform: rotate(-8deg) translateX(-3px); }
      }
      @keyframes clawGrab {
        0%, 85%, 100% { transform: rotate(0deg); }
        90% { transform: rotate(15deg); }
        95% { transform: rotate(-5deg); }
      }
      
      /* Combat joint animations */
      @keyframes attackPunchLeft {
        0% { transform: rotate(0deg); }
        20% { transform: rotate(30deg); }
        40% { transform: rotate(-60deg); }
        60% { transform: rotate(-45deg); }
        100% { transform: rotate(0deg); }
      }
      @keyframes attackPunchRight {
        0% { transform: rotate(0deg); }
        20% { transform: rotate(-30deg); }
        40% { transform: rotate(60deg); }
        60% { transform: rotate(45deg); }
        100% { transform: rotate(0deg); }
      }
      @keyframes hitRecoilArms {
        0% { transform: rotate(0deg); }
        30% { transform: rotate(25deg) translateX(5px); }
        60% { transform: rotate(-10deg) translateX(-2px); }
        100% { transform: rotate(0deg); }
      }
      @keyframes guardPose {
        0%, 100% { transform: rotate(-30deg) translateY(-5px); }
        50% { transform: rotate(-25deg) translateY(-3px); }
      }
      
      /* Apply joint animations to arm groups */
      .arm-left-group { animation: shoulderSwingLeft ${2.5 / personality.speed}s ease-in-out infinite; }
      .arm-right-group { animation: shoulderSwingRight ${2.7 / personality.speed}s ease-in-out infinite; }
      .arm-left.upper-arm { animation: shoulderSwingLeft ${2.5 / personality.speed}s ease-in-out infinite; }
      .arm-right.upper-arm { animation: shoulderSwingRight ${2.7 / personality.speed}s ease-in-out infinite; }
      .forearm-left { animation: elbowBendLeft ${2.3 / personality.speed}s ease-in-out infinite; }
      .forearm-right { animation: elbowBendRight ${2.4 / personality.speed}s ease-in-out infinite; }
      .hand-left { animation: wristFlickLeft ${1.8 / personality.speed}s ease-in-out infinite; }
      .hand-right { animation: wristFlickRight ${1.9 / personality.speed}s ease-in-out infinite; }
      .claw { animation: clawGrab ${4 + (personalitySeed % 3)}s ease-in-out infinite; }
      .pincer-claw { animation: pincerSnap ${3 + (personalitySeed % 2)}s ease-in-out infinite; }
      .tentacle-left { animation: tentacleWave ${2 / personality.speed}s ease-in-out infinite; transform-origin: 18px 65px; }
      .tentacle-right { animation: tentacleWave ${2.2 / personality.speed}s ease-in-out infinite reverse; transform-origin: 82px 65px; }
      
      /* Joint-based leg animations - bend at hip and knee */
      @keyframes hipSwingLeft {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-8deg); }
        75% { transform: rotate(6deg); }
      }
      @keyframes hipSwingRight {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(6deg); }
        75% { transform: rotate(-8deg); }
      }
      @keyframes kneeBendLeft {
        0%, 100% { transform: rotate(0deg); }
        30% { transform: rotate(-10deg); }
        70% { transform: rotate(5deg); }
      }
      @keyframes kneeBendRight {
        0%, 100% { transform: rotate(0deg); }
        30% { transform: rotate(10deg); }
        70% { transform: rotate(-5deg); }
      }
      @keyframes anklePivot {
        0%, 100% { transform: rotate(0deg); }
        50% { transform: rotate(-5deg); }
      }
      @keyframes toeWiggle {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-3deg); }
        75% { transform: rotate(3deg); }
      }
      @keyframes hoverPulse {
        0%, 100% { opacity: 0.4; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(1.05); }
      }
      
      /* Combat leg animations */
      @keyframes hitRecoilLegs {
        0% { transform: rotate(0deg); }
        30% { transform: rotate(15deg); }
        60% { transform: rotate(-8deg); }
        100% { transform: rotate(0deg); }
      }
      @keyframes dodgeCrouch {
        0%, 100% { transform: scaleY(1) translateY(0); }
        50% { transform: scaleY(0.85) translateY(5px); }
      }
      
      /* Apply joint animations to leg groups */
      .leg-left-group { animation: hipSwingLeft ${2.2 / personality.speed}s ease-in-out infinite; }
      .leg-right-group { animation: hipSwingRight ${2.4 / personality.speed}s ease-in-out infinite; }
      .leg-left.upper-leg { animation: hipSwingLeft ${2.2 / personality.speed}s ease-in-out infinite; }
      .leg-right.upper-leg { animation: hipSwingRight ${2.4 / personality.speed}s ease-in-out infinite; }
      .foot-left { animation: kneeBendLeft ${2 / personality.speed}s ease-in-out infinite, anklePivot ${3 / personality.speed}s ease-in-out infinite; }
      .foot-right { animation: kneeBendRight ${2.1 / personality.speed}s ease-in-out infinite, anklePivot ${3.2 / personality.speed}s ease-in-out infinite; }
      .toes-left, .toes-right { animation: toeWiggle ${2.5 / personality.speed}s ease-in-out infinite; }
      .hover-feet { animation: hoverPulse ${2 / personality.speed}s ease-in-out infinite; }
      .blob-feet { animation: blob ${2.5 / personality.speed}s ease-in-out infinite; transform-origin: center center; }
      
      /* Combat state joint overrides */
      ${currentEmotion === 'fierce' ? `
        .arm-left-group { animation: attackPunchLeft 0.4s ease-out infinite !important; }
        .arm-right-group { animation: attackPunchRight 0.4s ease-out infinite 0.2s !important; }
        .leg-left-group, .leg-right-group { animation: none !important; transform: rotate(-5deg); }
      ` : ''}
      ${currentEmotion === 'hurt' ? `
        .arm-left-group, .arm-right-group { animation: hitRecoilArms 0.3s ease-out !important; }
        .leg-left-group, .leg-right-group { animation: hitRecoilLegs 0.3s ease-out !important; }
        .forearm-left, .forearm-right { animation: none !important; transform: rotate(20deg); }
      ` : ''}
      ${currentEmotion === 'alert' ? `
        .arm-left-group, .arm-right-group { animation: guardPose ${0.8 / personality.speed}s ease-in-out infinite !important; }
        .leg-left-group, .leg-right-group { animation: dodgeCrouch 0.4s ease-in-out !important; }
      ` : ''}
      ${currentEmotion === 'happy' || currentEmotion === 'love' ? `
        .arm-left-group { animation: shoulderSwingLeft ${1.5 / personality.speed}s ease-in-out infinite !important; }
        .arm-right-group { animation: shoulderSwingRight ${1.5 / personality.speed}s ease-in-out infinite !important; }
        .hand-left, .hand-right { animation: wristFlickLeft ${0.8 / personality.speed}s ease-in-out infinite !important; }
      ` : ''}
      
      /* Tail animations */
      @keyframes tailWag {
        0%, 100% { transform: rotate(-5deg); }
        50% { transform: rotate(8deg); }
      }
      @keyframes tailSwish {
        0%, 100% { transform: rotate(-3deg) translateX(0); }
        25% { transform: rotate(5deg) translateX(3px); }
        75% { transform: rotate(-8deg) translateX(-2px); }
      }
      @keyframes tailFluff {
        0%, 100% { transform: rotate(-3deg) scale(1); }
        50% { transform: rotate(5deg) scale(1.05); }
      }
      @keyframes scorpionStrike {
        0%, 90%, 100% { transform: rotate(0deg); }
        93% { transform: rotate(-15deg); }
        96% { transform: rotate(5deg); }
      }
      
      .tail-short { animation: tailWag ${1.5 / personality.speed}s ease-in-out infinite; transform-origin: 50px 82px; }
      .tail-long { animation: tailSwish ${2.5 / personality.speed}s ease-in-out infinite; transform-origin: 50px 82px; }
      .tail-fluffy { animation: tailFluff ${2 / personality.speed}s ease-in-out infinite; transform-origin: 50px 82px; }
      .tail-spiked { animation: tailSwish ${3 / personality.speed}s ease-in-out infinite; transform-origin: 50px 82px; }
      .tail-fish { animation: tailSwish ${1.8 / personality.speed}s ease-in-out infinite; transform-origin: 50px 82px; }
      .tail-scorpion { animation: scorpionStrike ${4 + (personalitySeed % 3)}s ease-in-out infinite; transform-origin: 50px 82px; }
      
      /* Wing animations */
      @keyframes wingFlapLeft {
        0%, 100% { transform: rotate(0deg) scaleY(1); }
        50% { transform: rotate(-15deg) scaleY(0.9); }
      }
      @keyframes wingFlapRight {
        0%, 100% { transform: rotate(0deg) scaleY(1); }
        50% { transform: rotate(15deg) scaleY(0.9); }
      }
      @keyframes wingHover {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        25% { transform: translateY(-2px) rotate(-5deg); }
        75% { transform: translateY(-2px) rotate(5deg); }
      }
      @keyframes fairyWingShimmer {
        0%, 100% { opacity: 0.5; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.03); }
      }
      @keyframes dragonWingPower {
        0%, 100% { transform: rotate(0deg); }
        30% { transform: rotate(-20deg); }
        60% { transform: rotate(5deg); }
      }
      
      .wing-left { animation: wingFlapLeft ${0.8 / personality.speed}s ease-in-out infinite; transform-origin: 28px 55px; }
      .wing-right { animation: wingFlapRight ${0.8 / personality.speed}s ease-in-out infinite; transform-origin: 72px 55px; }
      .wing-bat.wing-left { animation: wingFlapLeft ${0.4 / personality.speed}s ease-in-out infinite; transform-origin: 28px 52px; }
      .wing-bat.wing-right { animation: wingFlapRight ${0.4 / personality.speed}s ease-in-out infinite; transform-origin: 72px 52px; }
      .wing-feathered.wing-left { animation: wingHover ${1.2 / personality.speed}s ease-in-out infinite; transform-origin: 15px 55px; }
      .wing-feathered.wing-right { animation: wingHover ${1.2 / personality.speed}s ease-in-out infinite reverse; transform-origin: 85px 55px; }
      .wing-fairy.wing-left { animation: fairyWingShimmer ${1 / personality.speed}s ease-in-out infinite, wingFlapLeft ${0.6 / personality.speed}s ease-in-out infinite; transform-origin: 18px 55px; }
      .wing-fairy.wing-right { animation: fairyWingShimmer ${1.1 / personality.speed}s ease-in-out infinite, wingFlapRight ${0.6 / personality.speed}s ease-in-out infinite; transform-origin: 82px 55px; }
      .wing-dragon.wing-left { animation: dragonWingPower ${1.5 / personality.speed}s ease-in-out infinite; transform-origin: 28px 50px; }
      .wing-dragon.wing-right { animation: dragonWingPower ${1.5 / personality.speed}s ease-in-out infinite reverse; transform-origin: 72px 50px; }
      
      /* Emotion-based animations */
      @keyframes happyBounce {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-5px) scale(1.02); }
      }
      @keyframes lovePulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      @keyframes hurtShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-3px) rotate(-2deg); }
        75% { transform: translateX(3px) rotate(2deg); }
      }
      @keyframes fierceReady {
        0%, 100% { transform: translateY(0) scaleY(1); }
        50% { transform: translateY(-2px) scaleY(0.98); }
      }
      @keyframes alertLook {
        0%, 100% { transform: translateX(0); }
        30% { transform: translateX(-2px); }
        70% { transform: translateX(2px); }
      }
      @keyframes worriedShiver {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-1px); }
        75% { transform: translateX(1px); }
      }
      @keyframes cheekBlush {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 0.9; }
      }
      
      /* Mouth animations */
      @keyframes mouthTalk {
        0%, 100% { transform: scaleY(1); }
        50% { transform: scaleY(0.7); }
      }
      @keyframes mouthHappy {
        0%, 100% { transform: scaleY(1) scaleX(1); }
        50% { transform: scaleY(1.1) scaleX(1.05); }
      }
      @keyframes mouthWorried {
        0%, 100% { transform: scaleY(1) translateY(0); }
        50% { transform: scaleY(0.8) translateY(2px); }
      }
      
      /* Apply emotion to mouth */
      .mouth { transform-origin: 50px 44px; }
      .mouth-smile { animation: mouthHappy ${2 / personality.speed}s ease-in-out infinite; }
      .mouth-open { animation: mouthTalk ${0.3 / personality.speed}s ease-in-out infinite; }
      
      /* Cheek animations */
      .cheeks { animation: cheekBlush ${3 / personality.speed}s ease-in-out infinite; }
      .cheeks-blush { animation: cheekBlush ${2 / personality.speed}s ease-in-out infinite; }
      
      /* Combat state classes */
      ${currentEmotion === 'hurt' ? `
        .monster-body { animation: hurtShake 0.15s ease-in-out infinite !important; }
      ` : ''}
      ${currentEmotion === 'fierce' ? `
        .monster-body { animation: fierceReady ${0.8 / personality.speed}s ease-in-out infinite; }
      ` : ''}
      ${currentEmotion === 'alert' ? `
        .eye-group { animation: alertLook 0.5s ease-in-out infinite; }
      ` : ''}
      ${currentEmotion === 'worried' ? `
        .monster-body { animation: worriedShiver ${0.3 / personality.speed}s ease-in-out infinite; }
        .mouth { transform: scaleY(0.8) translateY(2px); }
      ` : ''}
      ${currentEmotion === 'happy' || currentEmotion === 'love' ? `
        .monster-body { animation: happyBounce ${1.5 / personality.speed}s ease-in-out infinite; }
        .cheeks { opacity: 0.8; }
        .tail { animation: tailWag ${0.5 / personality.speed}s ease-in-out infinite !important; }
      ` : ''}
    `;
    
    // Combat reaction transform
    const getCombatTransform = () => {
      if (!fighter) return {};
      
      // Velocity-based leaning
      const leanX = Math.min(15, Math.max(-15, (fighter.vx || 0) * 3));
      const leanY = Math.min(5, Math.max(-5, (fighter.vy || 0) * 1));
      
      // Smooth easing for floaty feel
      const floatyEase = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
      const bounceEase = 'cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      
      // Hit recoil - dramatic but smooth recovery
      if (fighter.state === 'hit') {
        return {
          transform: `rotate(${leanX * 1.5}deg) translateX(${fighter.vx * 3}px) translateY(${Math.abs(fighter.vx)}px) scaleY(0.92)`,
          transition: `transform 0.2s ${bounceEase}`,
        };
      }
      
      // Dodge lean - quick and agile
      if (fighter.state === 'dodging') {
        return {
          transform: `rotate(${leanX * 0.8}deg) scale(0.9, 1.05) translateY(-8px)`,
          transition: `transform 0.25s ${floatyEase}`,
        };
      }
      
      // Attack wind-up - dramatic forward lunge
      if (fighter.state === 'attacking') {
        return {
          transform: `scaleX(${1 + (fighter.facing * 0.08)}) scaleY(0.95) translateX(${fighter.facing * 6}px) translateY(2px) rotate(${fighter.facing * -3}deg)`,
          transition: `transform 0.15s ${bounceEase}`,
        };
      }
      
      // Normal movement - smooth floaty sway
      return {
        transform: `rotate(${leanX * 0.4}deg) translateY(${leanY * 1.5}px) scaleY(${1 - Math.abs(leanX) * 0.005})`,
        transition: `transform 0.3s ${floatyEase}`,
      };
    };
    
    const combatTransform = getCombatTransform();
    
    return (
      <svg 
        viewBox="-10 -20 120 130" 
        width={spriteSize} 
        height={spriteSize}
        style={{ overflow: 'visible', ...combatTransform }}
      >
        <defs>
          <style>{animationStyles}</style>
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
          class="monster-body"
          filter={`url(#shadow-${monster.id})`}
          style={{ 
            animation: `breathe ${3 / personality.speed}s ease-in-out infinite`,
            transformOrigin: 'center center',
          }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      </svg>
    );
  };
  
  const getSpriteContent = () => {
    // Egg stage - show egg
    if (monster.stage === 'EGG') {
      return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
          <div 
            className="rounded-full flex items-center justify-center"
            style={{ 
              width: size * 0.7, 
              height: size * 0.9,
              background: `linear-gradient(135deg, ${monster.type.color}40, ${monster.type.color}80)`,
              border: `3px solid ${monster.type.color}`,
              animation: `pulse 2s infinite`,
            }}
          >
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
            {monster.age || 0}/{CONFIG.STAGES.EGG.duration}
          </div>
        </div>
      );
    }
    
    const isInfant = monster.stage === 'INFANT';
    // Apply constitution-based size scaling (bigger constitution = bigger monster)
    const baseSize = isInfant ? size * 0.75 : size;
    const spriteSize = baseSize * sizeScale;
    const bodyAnimation = getBodyTypeAnimation();
    const isMoving = fighter && (fighter.state === 'moving' || fighter.state === 'approaching' || Math.abs(fighter.vx || 0) > 0.5 || Math.abs(fighter.vy || 0) > 0.5);
    
    return (
      <div 
        className="relative flex items-center justify-center"
        style={{ 
          width: size * sizeScale, 
          height: size * sizeScale,
          transform: fighter ? `scaleX(${fighter.facing})` : 'none',
        }}
      >
        {/* Floating emoji - appears above monster head like hearts (20% smaller) */}
        {emojiVisible && currentEmoji && (
          <div 
            className="absolute z-20 pointer-events-none"
            style={{
              top: -spriteSize * 0.3,
              left: '50%',
              transform: fighter ? `translateX(-50%) scaleX(${fighter.facing})` : 'translateX(-50%)',
              animation: 'emojiFloat 1s ease-out forwards',
              fontSize: Math.max(16, spriteSize * 0.28), // 20% smaller
            }}
          >
            {currentEmoji}
          </div>
        )}
        
        {/* Glow effect behind monster */}
        <div 
          className="absolute rounded-full opacity-20"
          style={{ 
            width: spriteSize * 0.8, 
            height: spriteSize * 0.8,
            background: monster.type.color,
            filter: 'blur(10px)',
            animation: `pulse ${3 / personality.speed}s infinite`,
          }}
        />
        
        {/* Monster SVG with body type animation */}
        <div 
          className={isMoving ? 'monster-moving' : ''}
          style={{ 
            transform: isInfant ? 'scale(0.75)' : 'scale(1)',
            ...bodyAnimation,
          }}
        >
          {renderMonsterSVG(spriteSize)}
        </div>
        
        {/* Infant stage indicator */}
        {isInfant && (
          <div 
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs px-2 py-0.5 rounded-full"
            style={{ background: monster.type.color, color: '#fff' }}
          >
            {monster.age || 0}/{CONFIG.STAGES.INFANT.duration}
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

// Monster Card Component
const MonsterCard = ({ monster, isSelected, onClick }) => {
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
          <p className="text-xs text-gray-400">
            {monster.type.name} • {CONFIG.STAGES[monster.stage].name}
            {monster.stage === 'ADULT' && ` • Lv.${monster.level || 1}`}
          </p>
        </div>
      </div>
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
            {/* HIT text in orange */}
            <text
              x={effect.x}
              y={effect.y - 25 - progress * 15}
              textAnchor="middle"
              fill="#ff8800"
              fontSize="14"
              fontWeight="bold"
              opacity={opacity}
            >
              HIT
            </text>
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
            {/* Dodge text - only shows when actually dodging an attack */}
            <text
              x={effect.x}
              y={effect.y - 20 - progress * 15}
              textAnchor="middle"
              fill="#00ff88"
              fontSize="12"
              fontWeight="bold"
              opacity={opacity}
            >
              DODGE
            </text>
          </g>
        );
        
      case 'melee':
        // Slash/strike effect for physical attacks
        return (
          <g key={effect.id}>
            {/* Slash marks */}
            <path
              d={`M${effect.x - 15} ${effect.y - 15} L${effect.x + 15} ${effect.y + 15}`}
              stroke={effect.color}
              strokeWidth={4 * (1 - progress)}
              strokeLinecap="round"
              opacity={opacity}
            />
            <path
              d={`M${effect.x + 15} ${effect.y - 15} L${effect.x - 15} ${effect.y + 15}`}
              stroke={effect.color}
              strokeWidth={4 * (1 - progress)}
              strokeLinecap="round"
              opacity={opacity * 0.8}
            />
            {/* Impact ring */}
            <circle
              cx={effect.x}
              cy={effect.y}
              r={25 * scale}
              fill="none"
              stroke={effect.color}
              strokeWidth="3"
              opacity={opacity * 0.6}
            />
            {/* POW text */}
            <text
              x={effect.x}
              y={effect.y - 25 - progress * 20}
              textAnchor="middle"
              fill="#fff"
              fontSize="14"
              fontWeight="bold"
              opacity={opacity}
              style={{ textShadow: `0 0 5px ${effect.color}` }}
            >
              POW!
            </text>
          </g>
        );
        
      case 'miss':
        return (
          <g key={effect.id}>
            <text
              x={effect.x}
              y={effect.y - 15 - progress * 20}
              textAnchor="middle"
              fill={effect.color}
              fontSize="12"
              fontWeight="bold"
              opacity={opacity}
            >
              MISS!
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
        
      case 'heal':
        return (
          <g key={effect.id}>
            {/* Rising particles */}
            {[0, 1, 2, 3, 4].map((i) => {
              const angle = (i / 5) * Math.PI * 2;
              const dist = 20 + progress * 30;
              const particleX = effect.x + Math.cos(angle + progress * 2) * dist;
              const particleY = effect.y - progress * 40 + Math.sin(angle * 2) * 10;
              return (
                <circle
                  key={i}
                  cx={particleX}
                  cy={particleY}
                  r={4 * (1 - progress)}
                  fill="#88ff88"
                  opacity={opacity}
                />
              );
            })}
            {/* Heal ring */}
            <circle
              cx={effect.x}
              cy={effect.y}
              r={30 * scale}
              fill="none"
              stroke="#00ff00"
              strokeWidth="3"
              opacity={opacity * 0.5}
            />
            {/* HEAL text */}
            <text
              x={effect.x}
              y={effect.y - 20 - progress * 25}
              textAnchor="middle"
              fill="#00ff00"
              fontSize="14"
              fontWeight="bold"
              opacity={opacity}
            >
              +{CONFIG.BATTLE.healOrbAmount}
            </text>
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
  
  // Calculate scale for responsive arena
  const arenaScale = typeof window !== 'undefined' 
    ? Math.min(1, (window.innerWidth - 32) / CONFIG.BATTLE.arenaWidth) 
    : 1;
  
  return (
    <div className="relative flex flex-col items-center w-full">
      {/* Health bars - adapt for multi-battle */}
      {fighters.length === 2 ? (
        <>
          {/* Enemy health bar (top) */}
          <div className="w-full max-w-xs mb-2 px-2">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-bold text-red-400 truncate">{fighters[1].monster.name}</div>
              <span className="text-xs text-gray-400">{Math.max(0, Math.round(fighters[1].health))}</span>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-300"
                style={{ 
                  width: `${Math.max(0, (fighters[1].health / fighters[1].maxHealth) * 100)}%`,
                  background: fighters[1].health > fighters[1].maxHealth * 0.5 
                    ? 'linear-gradient(90deg, #dc2626, #ef4444)' 
                    : fighters[1].health > fighters[1].maxHealth * 0.25 
                    ? 'linear-gradient(90deg, #eab308, #facc15)'
                    : 'linear-gradient(90deg, #dc2626, #ef4444)',
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="w-full max-w-md mb-2 px-2 grid grid-cols-2 gap-2">
          {fighters.map((fighter, idx) => {
            const isPlayer = idx === 0;
            const isEliminated = fighter.isEliminated || fighter.health <= 0;
            return (
              <div key={fighter.monster.id} className={`${isEliminated ? 'opacity-40' : ''}`}>
                <div className="flex items-center justify-between gap-1">
                  <div className={`text-xs font-bold truncate ${isPlayer ? 'text-green-400' : 'text-red-400'}`}>
                    {fighter.monster.name}
                    {isEliminated && ' 💀'}
                  </div>
                  <span className="text-xs text-gray-400">{Math.max(0, Math.round(fighter.health))}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-300"
                    style={{ 
                      width: `${Math.max(0, (fighter.health / fighter.maxHealth) * 100)}%`,
                      background: isPlayer 
                        ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                        : 'linear-gradient(90deg, #dc2626, #ef4444)',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Battle Arena - Responsive scaling */}
      <div 
        className="relative rounded-2xl overflow-hidden border border-gray-700"
        style={{ 
          width: CONFIG.BATTLE.arenaWidth,
          height: CONFIG.BATTLE.arenaHeight,
          transform: `scale(${arenaScale})`,
          transformOrigin: 'top center',
          marginBottom: arenaScale < 1 ? `-${CONFIG.BATTLE.arenaHeight * (1 - arenaScale)}px` : 0,
          background: 'linear-gradient(180deg, #1a0a0a 0%, #1a1a2e 50%, #0a1a0a 100%)',
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
          
          {/* Render heal orbs */}
          {(battleState.healOrbs || []).map(orb => {
            const age = Date.now() - orb.createdAt;
            const pulse = Math.sin(age / 200) * 0.2 + 1;
            const fadeOut = age > 8000 ? (10000 - age) / 2000 : 1; // Fade out in last 2 seconds
            
            return (
              <g key={orb.id}>
                {/* Glow */}
                <circle
                  cx={orb.x}
                  cy={orb.y}
                  r={CONFIG.BATTLE.healOrbRadius * 2 * pulse}
                  fill="#00ff00"
                  opacity={0.2 * fadeOut}
                />
                {/* Main orb */}
                <circle
                  cx={orb.x}
                  cy={orb.y}
                  r={CONFIG.BATTLE.healOrbRadius * pulse}
                  fill="url(#healGradient)"
                  opacity={fadeOut}
                  stroke="#00ff00"
                  strokeWidth="2"
                />
                {/* Cross symbol */}
                <text
                  x={orb.x}
                  y={orb.y + 4}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="bold"
                  opacity={fadeOut}
                >
                  +
                </text>
              </g>
            );
          })}
          
          {/* Heal gradient definition */}
          <defs>
            <radialGradient id="healGradient">
              <stop offset="0%" stopColor="#88ff88"/>
              <stop offset="100%" stopColor="#00aa00"/>
            </radialGradient>
          </defs>
          
          {/* Render effects first (behind projectiles) */}
          {effects.map(renderEffect)}
          
          {/* Render projectiles */}
          {projectiles.map(renderProjectile)}
        </svg>
        
        {/* Fighters */}
        {fighters.map((fighter) => {
          if (fighter.isEliminated) return null; // Don't render eliminated fighters
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
                opacity: fighter.health <= 0 ? 0.3 : 1,
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
              <div className="text-5xl mb-3 animate-bounce">🏆</div>
              <div className="text-2xl font-bold text-white mb-1">{winner.name}</div>
              <div className="text-md text-gray-400 mb-4">Victory!</div>
              <button
                onClick={onEnd}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 active:from-purple-500 active:to-pink-500 rounded-xl text-white font-bold transition-all"
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Player health bar (bottom) - only for 1v1 */}
      {fighters.length === 2 && (
        <div className="w-full max-w-xs mt-2 px-2">
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-300"
              style={{ 
                width: `${Math.max(0, (fighters[0].health / fighters[0].maxHealth) * 100)}%`,
                background: fighters[0].health > fighters[0].maxHealth * 0.5 
                  ? 'linear-gradient(90deg, #22c55e, #4ade80)' 
                  : fighters[0].health > fighters[0].maxHealth * 0.25 
                  ? 'linear-gradient(90deg, #eab308, #facc15)'
                  : 'linear-gradient(90deg, #dc2626, #ef4444)',
              }}
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm font-bold text-green-400 truncate">{fighters[0].monster.name}</div>
            <span className="text-xs text-gray-400">{Math.max(0, Math.round(fighters[0].health))}</span>
          </div>
        </div>
      )}
      
      {/* Compact Battle Log */}
      <div className="w-full max-w-xs mt-2 p-2 bg-gray-900/70 rounded-xl max-h-16 overflow-y-auto border border-gray-800">
        {log.length === 0 ? (
          <div className="text-xs text-gray-500 text-center">Battle starting...</div>
        ) : (
          log.slice(-3).map((entry, idx) => (
            <div 
              key={idx} 
              className={`text-xs ${
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

// Monster Creation Modal with naming
const EggSelectionModal = ({ onSelect, onClose }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [monsterName, setMonsterName] = useState('');
  
  const handleConfirm = () => {
    if (selectedType) {
      onSelect(selectedType, monsterName);
    }
  };
  
  const selectedTypeData = CONFIG.MONSTER_TYPES.find(t => t.id === selectedType);
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          {selectedType ? 'Name Your Monster' : 'Choose Monster Type'}
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
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2"
                    style={{ background: `${type.color}40` }}
                  >
                    <span className="text-3xl">🐲</span>
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
            <div className="mb-4">
              <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-3"
                style={{ background: `${selectedTypeData?.color}40` }}>
                <span className="text-4xl">🐲</span>
              </div>
              <p className="text-center text-lg font-bold mb-1" style={{ color: selectedTypeData?.color }}>
                {selectedTypeData?.name}
              </p>
              <p className="text-center text-gray-400 text-xs px-4">
                {selectedTypeData?.description}
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
const EnemyPreviewModal = ({ playerMonster, enemy, onStartBattle, onClose }) => {
  const playerStats = MonsterFactory.getEffectiveStats(playerMonster);
  const enemyStats = MonsterFactory.getEffectiveStats(enemy);
  
  // Round all stats for display
  const playerPower = Math.round(Object.values(playerStats).reduce((a, b) => a + b, 0));
  const enemyPower = Math.round(Object.values(enemyStats).reduce((a, b) => a + b, 0));
  const powerDiff = enemyPower - playerPower;
  
  // Trainer avatars (emoji-based)
  const trainerAvatars = ['👨', '👩', '🧑', '👴', '👵', '🧔', '👱', '👨‍🦰', '👩‍🦰', '🧑‍🦱', '👨‍🦳', '👩‍🦳'];
  const enemyTrainerAvatar = trainerAvatars[Math.abs(enemy.trainerId?.charCodeAt(0) || 0) % trainerAvatars.length];
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-3xl p-6 max-w-lg w-full">
        {/* Enemy Trainer Introduction */}
        <div className={`text-center mb-4 rounded-2xl p-4 ${enemy.isRivalRematch 
          ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/50' 
          : 'bg-gradient-to-r from-red-900/50 to-orange-900/50'}`}>
          <div className="text-5xl mb-2">{enemyTrainerAvatar}</div>
          <h3 className="text-lg font-bold text-white">{enemy.trainerName || 'Wild'}</h3>
          {enemy.isRivalRematch ? (
            <p className="text-sm text-purple-400 font-bold">⚔️ RIVAL REMATCH!</p>
          ) : (
            <p className="text-sm text-gray-400">challenges you to a battle!</p>
          )}
        </div>
        
        <h2 className="text-xl font-bold text-white mb-4 text-center">Battle Preview</h2>
        
        {/* VS Display */}
        <div className="flex items-center justify-around mb-4">
          {/* Player Monster */}
          <div className="text-center">
            <MonsterSprite monster={playerMonster} size={70} showEmoji={false} />
            <h3 className="font-bold text-white mt-2 text-sm">{playerMonster.name}</h3>
            <p className="text-xs text-gray-400">Lv.{playerMonster.level || 1}</p>
            <div className="text-sm text-green-400 mt-1 font-bold">
              {playerPower} PWR
            </div>
          </div>
          
          {/* VS */}
          <div className="text-2xl font-bold text-gray-600">VS</div>
          
          {/* Enemy */}
          <div className="text-center">
            <MonsterSprite monster={enemy} size={70} showEmoji={false} />
            <h3 className="font-bold text-white mt-2 text-sm">{enemy.name}</h3>
            <p className="text-xs text-gray-400">{enemy.type.name}</p>
            <div className="text-sm text-red-400 mt-1 font-bold">
              {enemyPower} PWR
            </div>
          </div>
        </div>
        
        {/* Stat Comparison Table - Compact */}
        <div className="bg-gray-800/50 rounded-xl p-3 mb-4">
          <div className="grid grid-cols-3 gap-2 text-xs mb-2">
            <div className="text-center text-green-400 font-bold">You</div>
            <div className="text-center text-gray-400 font-bold">Stat</div>
            <div className="text-center text-red-400 font-bold">Enemy</div>
          </div>
          
          {/* Individual stat rows */}
          {['strength', 'constitution', 'agility', 'power', 'intelligence'].map(stat => {
            const playerVal = Math.round(playerStats[stat]);
            const enemyVal = Math.round(enemyStats[stat]);
            const playerWins = playerVal > enemyVal;
            const enemyWins = enemyVal > playerVal;
            
            return (
              <div key={stat} className="grid grid-cols-3 gap-2 py-1 border-t border-gray-700/50 text-sm">
                <div className={`text-center font-bold ${playerWins ? 'text-green-400' : enemyWins ? 'text-red-400' : 'text-gray-400'}`}>
                  {playerVal}
                  {playerWins && <span className="ml-1 text-xs">▲</span>}
                </div>
                <div className="text-center text-gray-500 capitalize text-xs flex items-center justify-center">
                  {stat.slice(0, 3).toUpperCase()}
                </div>
                <div className={`text-center font-bold ${enemyWins ? 'text-green-400' : playerWins ? 'text-red-400' : 'text-gray-400'}`}>
                  {enemyVal}
                  {enemyWins && <span className="ml-1 text-xs">▲</span>}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Rewards Info - Compact */}
        <div className="bg-gray-800/50 rounded-xl p-2 mb-4">
          <p className="text-xs text-gray-400 text-center">
            Win: <span className="text-yellow-400">{CONFIG.LEVELING.expPerWin} EXP</span> + <span className="text-yellow-400">{CONFIG.LEVELING.trainingPointsPerWin} TP</span> + <span className="text-yellow-400">1🪙</span>
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 transition-all"
          >
            Run Away
          </button>
          <button
            onClick={onStartBattle}
            className="flex-1 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 rounded-xl text-white font-bold transition-all"
          >
            ⚔️ Fight!
          </button>
        </div>
      </div>
    </div>
  );
};

// FFA Preview Modal - Shows all opponents before free-for-all battle
const FFAPreviewModal = ({ playerMonster, enemies, onStartBattle, onClose }) => {
  const playerStats = MonsterFactory.getEffectiveStats(playerMonster);
  const playerPower = Math.round(Object.values(playerStats).reduce((a, b) => a + b, 0));
  
  // Trainer avatars
  const trainerAvatars = ['👨', '👩', '🧑', '👴', '👵', '🧔', '👱', '👨‍🦰', '👩‍🦰', '🧑‍🦱'];
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-3xl p-5 max-w-md w-full my-4">
        <h2 className="text-xl font-bold text-white mb-4 text-center">🔥 Free-For-All Battle</h2>
        
        {/* All fighters grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Player */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">👤</div>
            <MonsterSprite monster={playerMonster} size={50} showEmoji={false} />
            <p className="text-sm font-bold text-green-400 mt-1">{playerMonster.name}</p>
            <p className="text-xs text-gray-400">You • {playerPower} PWR</p>
          </div>
          
          {/* Enemies */}
          {enemies.map((enemy, idx) => {
            const enemyStats = MonsterFactory.getEffectiveStats(enemy);
            const enemyPower = Math.round(Object.values(enemyStats).reduce((a, b) => a + b, 0));
            const avatar = trainerAvatars[Math.abs(enemy.trainerId?.charCodeAt(0) || idx) % trainerAvatars.length];
            
            return (
              <div key={enemy.id} className={`rounded-xl p-3 text-center ${enemy.isRivalRematch 
                ? 'bg-purple-500/10 border border-purple-500/50' 
                : 'bg-red-500/10 border border-red-500/30'}`}>
                <div className="text-2xl mb-1">{avatar}</div>
                <MonsterSprite monster={enemy} size={50} showEmoji={false} />
                <p className={`text-sm font-bold mt-1 ${enemy.isRivalRematch ? 'text-purple-400' : 'text-red-400'}`}>
                  {enemy.name}
                </p>
                <p className="text-xs text-gray-400">
                  {enemy.isRivalRematch && '⚔️ '}{enemy.trainerName || 'Wild'} • {enemyPower} PWR
                </p>
              </div>
            );
          })}
        </div>
        
        {/* Info */}
        <div className="bg-gray-800/50 rounded-xl p-3 mb-4 text-center">
          <p className="text-gray-400 text-sm">Last one standing wins!</p>
          <p className="text-xs text-gray-500 mt-1">All fighters battle simultaneously</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-800 active:bg-gray-700 rounded-xl text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onStartBattle}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 active:from-purple-500 active:to-pink-500 rounded-xl text-white font-bold"
          >
            🔥 Fight!
          </button>
        </div>
      </div>
    </div>
  );
};

// Battle Result Modal - Shows stats after battle
const BattleResultModal = ({ result, onClose, onBattleAgain }) => {
  const { won, monster, expGained, trainingPointsGained, leveledUp, statGains = {}, oldStats = {}, newStats = {}, 
          isTournament, tournamentName, prize, medal, roundReached, coinsGained } = result;
  
  // Check if any stats changed
  const hasStatChanges = statGains && Object.values(statGains).some(gain => gain > 0);
  
  // Tournament result
  if (isTournament) {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-3xl p-6 max-w-md w-full">
            {/* Tournament Result Header */}
            <div className={`text-center mb-6 ${won ? 'text-yellow-400' : 'text-red-400'}`}>
              <div className="text-6xl mb-2">{won ? medal : '😢'}</div>
              <h2 className="text-3xl font-bold">{won ? 'CHAMPION!' : 'ELIMINATED'}</h2>
              <p className="text-gray-400 mt-2">{tournamentName}</p>
            </div>
            
            {won ? (
              <>
                {/* Tournament Victory Rewards */}
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-6 mb-4 text-center">
                  <h4 className="text-lg font-bold text-yellow-400 mb-4">🏆 Tournament Champion!</h4>
                  <div className="flex justify-around">
                    <div className="text-center">
                      <div className="text-3xl text-yellow-400 font-bold">+{prize}</div>
                      <div className="text-sm text-gray-400">🪙 Coins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl">{medal}</div>
                      <div className="text-sm text-gray-400">Medal</div>
                    </div>
                  </div>
                </div>
                
                <p className="text-center text-gray-400 text-sm mb-4">
                  You conquered all opponents! Your medal is saved in your profile.
                </p>
              </>
            ) : (
              <>
                {/* Tournament Loss */}
                <div className="bg-gray-800/50 rounded-xl p-4 mb-4 text-center">
                  <p className="text-gray-400">Reached Round {roundReached}</p>
                  <p className="text-gray-500 text-sm mt-2">Train harder and try again!</p>
                </div>
              </>
            )}
            
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl font-bold transition-all bg-gradient-to-r from-orange-600 to-red-600 text-white"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Regular battle result
  return (
    <div className="fixed inset-0 bg-black/80 z-50 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-3xl p-6 max-w-md w-full">
          {/* Result Header */}
          <div className={`text-center mb-6 ${won ? 'text-green-400' : 'text-red-400'}`}>
            <div className="text-6xl mb-2">{won ? '🏆' : '💀'}</div>
            <h2 className="text-3xl font-bold">{won ? 'VICTORY!' : 'DEFEAT'}</h2>
          </div>
          
          {/* Monster Display with emotion */}
          <div className="flex justify-center mb-6">
            <div className="text-center">
              <MonsterSprite 
                monster={monster} 
                size={80} 
                emotion={won ? 'excited' : 'sad'}
                forcedEmoji={won ? '🎉' : '😢'}
              />
              <h3 className="font-bold text-white mt-2">{monster.name}</h3>
              <p className="text-xs text-gray-400">Lv.{monster.level || 1} {monster.type.name}</p>
            </div>
          </div>
          
          {won ? (
            <>
              {/* Rewards */}
              <div className="bg-gray-800/50 rounded-xl p-4 mb-4">
                <h4 className="text-sm font-bold text-gray-400 mb-3">Rewards</h4>
                <div className="flex justify-around">
                  <div className="text-center">
                    <div className="text-2xl text-yellow-400 font-bold">+{expGained}</div>
                    <div className="text-xs text-gray-400">EXP</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl text-yellow-400 font-bold">+{trainingPointsGained}</div>
                    <div className="text-xs text-gray-400">Training</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl text-yellow-400 font-bold">+{coinsGained || 1}</div>
                    <div className="text-xs text-gray-400">🪙 Coins</div>
                  </div>
                </div>
              </div>
              
              {/* Level Up Stats - Show when leveled up and has stat changes */}
              {leveledUp && hasStatChanges && (
                <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 mb-4">
                  <h4 className="text-sm font-bold text-purple-400 mb-3 text-center">⬆️ LEVEL UP!</h4>
                  <div className="space-y-2">
                    {Object.entries(statGains)
                      .filter(([, gain]) => gain > 0)
                      .map(([stat, gain]) => (
                        <div key={stat} className="flex items-center justify-between bg-gray-800/50 rounded-lg px-3 py-2">
                          <span className="text-gray-300 capitalize">{stat}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">{oldStats[stat] ?? 0}</span>
                            <span className="text-gray-500">→</span>
                            <span className="text-white font-bold">{newStats[stat] ?? 0}</span>
                            <span className="text-green-400 text-sm">+{gain}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
              
              {/* Show level up without stat display if no changes */}
              {leveledUp && !hasStatChanges && (
                <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 mb-4 text-center">
                  <h4 className="text-sm font-bold text-purple-400">⬆️ LEVEL UP!</h4>
                </div>
              )}
            </>
          ) : (
            <div className="bg-gray-800/50 rounded-xl p-4 mb-4 text-center">
              <p className="text-gray-400">You still earned some EXP from the fight!</p>
              <div className="text-xl text-yellow-400 font-bold mt-2">+{expGained} EXP</div>
              <p className="text-gray-500 text-sm mt-2">Train harder and try again!</p>
              {leveledUp && (
                <div className="mt-3 text-purple-400 font-bold">⬆️ LEVEL UP!</div>
              )}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={onBattleAgain}
              className="w-full py-3 rounded-xl font-bold transition-all bg-gradient-to-r from-red-600 to-orange-600 active:from-red-500 active:to-orange-500 text-white"
            >
              ⚔️ Battle Again
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl font-bold transition-all bg-gray-800 active:bg-gray-700 text-gray-300"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
export default function MonsterGame() {
  // Core game state
  const [monsters, setMonsters] = useState([]);
  const [selectedMonster, setSelectedMonster] = useState(null);
  const [showEggSelection, setShowEggSelection] = useState(false);
  const [battleState, setBattleState] = useState(null);
  const [selectedFighter, setSelectedFighter] = useState(null);
  const [currentEnemy, setCurrentEnemy] = useState(null);
  const [ffaEnemies, setFfaEnemies] = useState(null); // For FFA preview
  const [lastBattleWasFFA, setLastBattleWasFFA] = useState(false); // Track battle type for "Battle Again"
  const [view, setView] = useState('care'); // 'care' | 'train' | 'battle' | 'tournament' | 'profile'
  const [trainingMessage, setTrainingMessage] = useState(null);
  const [battleResult, setBattleResult] = useState(null);
  const [careEmotion, setCareEmotion] = useState('happy');
  const [forcedEmoji, setForcedEmoji] = useState(null);
  
  // Trainer/Profile state
  const [trainerProfile, setTrainerProfile] = useState({
    name: 'You',
    coins: 50,
    totalWins: 0,
    totalLosses: 0,
    medals: [],
    rivals: [],
    defeatedBy: [],
  });
  
  // Trainer name edit state
  const [showTrainerNameModal, setShowTrainerNameModal] = useState(false);
  
  // Tournament state
  const [tournamentState, setTournamentState] = useState(null);
  
  // Rename modal state
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null);
  
  const battleRef = useRef(null);
  const careEmotionTimeoutRef = useRef(null);
  const saveTimeoutRef = useRef(null);
  
  // Load game on mount
  useEffect(() => {
    const saved = localStorage.getItem('monsterGameSave');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.monsters) setMonsters(data.monsters);
        if (data.trainerProfile) setTrainerProfile(data.trainerProfile);
        if (data.selectedMonsterId) {
          const monster = data.monsters?.find(m => m.id === data.selectedMonsterId);
          if (monster) setSelectedMonster(monster);
        }
      } catch (e) {
        console.error('Failed to load save:', e);
      }
    }
  }, []);
  
  // Auto-save when state changes
  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      const saveData = {
        monsters,
        trainerProfile,
        selectedMonsterId: selectedMonster?.id,
        savedAt: Date.now(),
      };
      localStorage.setItem('monsterGameSave', JSON.stringify(saveData));
    }, 1000); // Debounce saves
  }, [monsters, trainerProfile]);
  
  // Happiness recovery tick
  useEffect(() => {
    const interval = setInterval(() => {
      setMonsters(prev => prev.map(m => {
        if (m.happiness < 100) {
          const newHappiness = Math.min(100, (m.happiness || 100) + CONFIG.HAPPINESS.recoveryPerTick);
          const isDepressed = m.isDepressed && newHappiness < CONFIG.HAPPINESS.depressionRecoveryRequired;
          return { ...m, happiness: newHappiness, isDepressed };
        }
        return m;
      }));
    }, 5000); // Every 5 seconds
    return () => clearInterval(interval);
  }, []);
  
  // Trigger an emotion reaction with emoji
  const triggerEmotion = (emotion, emoji = null) => {
    setCareEmotion(emotion);
    if (emoji) setForcedEmoji(emoji);
    
    // Reset after delay
    if (careEmotionTimeoutRef.current) clearTimeout(careEmotionTimeoutRef.current);
    careEmotionTimeoutRef.current = setTimeout(() => {
      setCareEmotion('happy');
      setForcedEmoji(null);
    }, 2500);
  };
  
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
    const isFirstMonster = monsters.length === 0;
    let newMonster = MonsterFactory.createEgg(typeId, isFirstMonster);
    if (customName && customName.trim()) {
      newMonster = MonsterFactory.setName(newMonster, customName);
    }
    setMonsters(prev => [...prev, newMonster]);
    setSelectedMonster(newMonster);
    setShowEggSelection(false);
  };
  
  const handleTrain = (statName) => {
    if (!selectedMonster) return;
    
    const result = MonsterFactory.trainStat(selectedMonster, statName);
    if (result.success) {
      setMonsters(prev => prev.map(m => 
        m.id === selectedMonster.id ? result.monster : m
      ));
      setSelectedMonster(result.monster);
      // Happy emotion on successful training
      triggerEmotion('determined', '💪');
    } else {
      setTrainingMessage({ type: 'error', text: result.message });
      // Confused emotion on failed training
      triggerEmotion('confused', '❓');
      // Clear error message after 2 seconds
      setTimeout(() => setTrainingMessage(null), 2000);
    }
  };
  
  // Helper to generate enemy with chance for rival to appear
  const generateEnemyWithRivalChance = (playerMonster, powerMultiplier = 1.0, rivalChance = 0.30) => {
    const rivals = trainerProfile.rivals.filter(r => r.encounters >= 3);
    if (rivals.length > 0 && Math.random() < rivalChance) {
      // Pick a random rival (weighted by encounters)
      const totalEncounters = rivals.reduce((sum, r) => sum + r.encounters, 0);
      let roll = Math.random() * totalEncounters;
      let selectedRival = rivals[0];
      for (const rival of rivals) {
        roll -= rival.encounters;
        if (roll <= 0) {
          selectedRival = rival;
          break;
        }
      }
      return EnemyFactory.generateFromRival(selectedRival, playerMonster, powerMultiplier);
    }
    return EnemyFactory.generateMatchedEnemy(playerMonster, powerMultiplier);
  };
  
  const handleSelectFighter = (monster) => {
    setSelectedFighter(monster);
    // Immediately generate a matched enemy
    const enemy = EnemyFactory.generateMatchedEnemy(monster);
    setCurrentEnemy(enemy);
  };
  
  const handleStartBattle = () => {
    if (!selectedFighter || !currentEnemy) return;
    setBattleState(BattleEngine.createBattleState(selectedFighter, currentEnemy));
    setCurrentEnemy(null);
    setSelectedFighter(null);
    setLastBattleWasFFA(false); // Track this was a 1v1
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
      const winnerMonster = monsters.find(m => m.id === winnerId);
      const isFFA = battleState.mode === 'ffa';
      
      // FFA gives 2.5x rewards (you beat 3 opponents!)
      const expMultiplier = isFFA ? 2.5 : 1;
      const tpMultiplier = isFFA ? 3 : 1;
      const coinMultiplier = isFFA ? 3 : 1;
      
      if (isPlayerWin && winnerMonster) {
        // Get old stats before update
        const oldStats = MonsterFactory.getEffectiveStats(winnerMonster);
        
        // Award experience and training points (more for FFA)
        const expAmount = Math.floor(CONFIG.LEVELING.expPerWin * expMultiplier);
        const tpAmount = Math.floor(CONFIG.LEVELING.trainingPointsPerWin * tpMultiplier);
        const coinAmount = Math.floor(CONFIG.ECONOMY.coinsPerWin * coinMultiplier);
        
        const expResult = MonsterFactory.addExperience(winnerMonster, expAmount);
        let updatedMonster = MonsterFactory.addTrainingPoints(expResult.monster, tpAmount);
        
        // Increase happiness on win
        updatedMonster = {
          ...updatedMonster,
          happiness: Math.min(100, (updatedMonster.happiness || 100) + CONFIG.HAPPINESS.winBonus),
          isDepressed: false, // Winning cures depression
          battleStats: {
            ...updatedMonster.battleStats,
            wins: (updatedMonster.battleStats?.wins || 0) + 1,
          }
        };
        
        // Get new stats after update
        const newStats = MonsterFactory.getEffectiveStats(updatedMonster);
        
        // Update monsters
        setMonsters(prev => prev.map(m => m.id === winnerId ? updatedMonster : m));
        
        // Get enemy trainer info for rival tracking
        const enemyFighter = battleState.fighters.find(f => f.monster.isEnemy);
        const enemyTrainerId = enemyFighter?.monster.trainerId;
        const enemyTrainerName = enemyFighter?.monster.trainerName || 'Unknown';
        
        // Update trainer profile with coin, win, and rival tracking
        setTrainerProfile(prev => {
          let updatedRivals = [...prev.rivals];
          
          if (enemyTrainerId) {
            const existingRival = updatedRivals.find(r => r.id === enemyTrainerId);
            if (existingRival) {
              // Update existing rival - we beat them!
              updatedRivals = updatedRivals.map(r => 
                r.id === enemyTrainerId 
                  ? { ...r, wins: r.wins + 1, encounters: r.encounters + 1 }
                  : r
              );
            } else {
              // Add new opponent (not rival yet, just tracking)
              updatedRivals.push({
                id: enemyTrainerId,
                name: enemyTrainerName,
                wins: 1,
                losses: 0,
                encounters: 1,
                isRival: false,
              });
            }
            
            // Mark as rival if 3+ encounters
            updatedRivals = updatedRivals.map(r => ({
              ...r,
              isRival: r.encounters >= 3,
            }));
            
            // Sort by encounters
            updatedRivals.sort((a, b) => b.encounters - a.encounters);
          }
          
          return {
            ...prev,
            coins: prev.coins + coinAmount,
            totalWins: prev.totalWins + 1,
            rivals: updatedRivals,
          };
        });
        
        // Show result modal
        setBattleResult({
          won: true,
          monster: updatedMonster,
          expGained: expAmount,
          trainingPointsGained: tpAmount,
          coinsGained: coinAmount,
          leveledUp: expResult.leveledUp,
          statGains: expResult.statGains,
          oldStats,
          newStats,
          happinessGained: CONFIG.HAPPINESS.winBonus,
          isFFA: isFFA,
        });
      } else {
        // LOSS - reduce happiness, track stats
        const playerFighter = battleState.fighters.find(f => !f.monster.isEnemy);
        const playerMonster = playerFighter ? monsters.find(m => m.id === playerFighter.monster.id) : null;
        
        if (playerMonster) {
          // Award 1/3 XP for losing - you still learn from defeat!
          const lossExp = Math.floor(CONFIG.LEVELING.expPerWin / 3);
          const oldStats = MonsterFactory.getEffectiveStats(playerMonster);
          const expResult = MonsterFactory.addExperience(playerMonster, lossExp);
          
          // Reduce happiness on loss
          let updatedMonster = { 
            ...expResult.monster, 
            happiness: Math.max(0, (expResult.monster.happiness || 100) - CONFIG.HAPPINESS.lossReduction),
            battleStats: {
              ...expResult.monster.battleStats,
              losses: (expResult.monster.battleStats?.losses || 0) + 1,
            }
          };
          
          // Check for depression
          if (updatedMonster.happiness <= CONFIG.HAPPINESS.depressionThreshold) {
            updatedMonster.isDepressed = true;
          }
          
          const newStats = MonsterFactory.getEffectiveStats(updatedMonster);
          
          // Update monster with loss effects
          setMonsters(prev => prev.map(m => m.id === playerMonster.id ? updatedMonster : m));
          
          // Get enemy trainer info for rival tracking
          const enemyFighter = battleState.fighters.find(f => f.monster.isEnemy);
          const enemyTrainerId = enemyFighter?.monster.trainerId || Utils.generateId();
          const enemyTrainerName = enemyFighter?.monster.trainerName || Utils.generateTrainerName();
          
          // Update trainer profile with rival tracking
          setTrainerProfile(prev => {
            const existingRival = prev.rivals.find(r => r.id === enemyTrainerId);
            let updatedRivals;
            
            if (existingRival) {
              // Update existing rival
              updatedRivals = prev.rivals.map(r => 
                r.id === enemyTrainerId 
                  ? { ...r, wins: r.wins, losses: r.losses + 1, encounters: r.encounters + 1 }
                  : r
              );
            } else {
              // Add new potential rival
              updatedRivals = [...prev.rivals, {
                id: enemyTrainerId,
                name: enemyTrainerName,
                wins: 0,
                losses: 1,
                encounters: 1,
                isRival: false, // Becomes rival after 3+ encounters
              }];
            }
            
            // Mark as rival if 3+ encounters
            updatedRivals = updatedRivals.map(r => ({
              ...r,
              isRival: r.encounters >= 3,
            }));
            
            // Sort by encounters (most encountered first)
            updatedRivals.sort((a, b) => b.encounters - a.encounters);
            
            return {
              ...prev,
              totalLosses: prev.totalLosses + 1,
              rivals: updatedRivals,
            };
          });
          
          setBattleResult({
            won: false,
            monster: updatedMonster,
            expGained: lossExp,
            trainingPointsGained: 0,
            leveledUp: expResult.leveledUp,
            statGains: expResult.statGains,
            oldStats,
            newStats,
            happinessLost: CONFIG.HAPPINESS.lossReduction,
            enemyTrainerName,
          });
        }
      }
    }
    
    setBattleState(null);
  };
  
  const handleCloseBattleResult = () => {
    setBattleResult(null);
    setView('care');
  };
  
  const handleBattleAgain = () => {
    // Get the monster from the result and start a new battle
    const monster = battleResult?.monster;
    if (monster) {
      // Find the updated monster from state
      const updatedMonster = monsters.find(m => m.id === monster.id);
      
      // Check happiness before allowing battle
      if (updatedMonster && updatedMonster.stage === 'ADULT') {
        if (updatedMonster.isDepressed) {
          setBattleResult(null);
          setTrainingMessage({ type: 'error', text: `${updatedMonster.name} is depressed and needs to fully recover before fighting again.` });
          setView('care');
          return;
        }
        // Monsters can fight at any happiness level unless depressed
        // They're just sad below 20% but can still battle
        
        setBattleResult(null);
        setSelectedFighter(updatedMonster);
        
        if (lastBattleWasFFA) {
          // Start another FFA - generate 3 enemies
          const enemies = [
            EnemyFactory.generateMatchedEnemy(updatedMonster),
            EnemyFactory.generateMatchedEnemy(updatedMonster),
            EnemyFactory.generateMatchedEnemy(updatedMonster),
          ];
          setFfaEnemies(enemies);
        } else {
          // Start another 1v1
          const enemy = EnemyFactory.generateMatchedEnemy(updatedMonster);
          setCurrentEnemy(enemy);
        }
      } else {
        setBattleResult(null);
        setView('train');
      }
    } else {
      setBattleResult(null);
      setView('train');
    }
  };
  
  // Handle monster rename
  const handleRename = (newName) => {
    if (renameTarget && newName.trim()) {
      const updated = MonsterFactory.setName(renameTarget, newName.trim());
      setMonsters(prev => prev.map(m => m.id === renameTarget.id ? updated : m));
      if (selectedMonster?.id === renameTarget.id) {
        setSelectedMonster(updated);
      }
    }
    setShowRenameModal(false);
    setRenameTarget(null);
  };
  
  return (
    <div 
      className="min-h-screen pb-20"
      style={{ 
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* Global styles for floating emoji animations and movement */}
      <style>{`
        @keyframes emojiFloat {
          0% { 
            transform: translateX(-50%) translateY(0) scale(0.5);
            opacity: 0;
          }
          15% {
            transform: translateX(-50%) translateY(-5px) scale(1.2);
            opacity: 1;
          }
          30% {
            transform: translateX(-50%) translateY(-10px) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateX(-50%) translateY(-25px) scale(0.8);
            opacity: 0;
          }
        }
        
        @keyframes wingFlap {
          0%, 100% { transform: rotate(-5deg) scaleY(1); }
          50% { transform: rotate(15deg) scaleY(0.8); }
        }
        
        @keyframes legWalkLeft {
          0%, 100% { transform: rotate(-15deg); }
          50% { transform: rotate(15deg); }
        }
        
        @keyframes legWalkRight {
          0%, 100% { transform: rotate(15deg); }
          50% { transform: rotate(-15deg); }
        }
        
        .monster-moving .wing-left, .monster-moving .wing-right {
          animation: wingFlap 0.3s ease-in-out infinite;
        }
        
        .monster-moving .wing-right {
          animation-delay: 0.15s;
        }
        
        .monster-moving .leg-left-group {
          animation: legWalkLeft 0.4s ease-in-out infinite;
          transform-origin: center top;
        }
        
        .monster-moving .leg-right-group {
          animation: legWalkRight 0.4s ease-in-out infinite;
          transform-origin: center top;
        }
      `}</style>
      
      {/* Header - Compact for mobile */}
      <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Monster Arena
              </h1>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="text-yellow-400">🪙 {trainerProfile.coins}</span>
              <span className="text-green-400">🏆 {trainerProfile.totalWins}</span>
              <span className="text-red-400">💀 {trainerProfile.totalLosses}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-lg mx-auto px-4 py-4 pb-24">
        {view === 'care' ? (
          <div className="space-y-4">
            {/* Monster List - Horizontal scroll on mobile */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Your Monsters</h2>
                <button
                  onClick={() => setShowEggSelection(true)}
                  className="px-3 py-2 rounded-xl bg-purple-600 active:bg-purple-500 text-white text-sm font-medium"
                >
                  + New
                </button>
              </div>
              
              {monsters.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-900/30 rounded-2xl">
                  <div className="text-4xl mb-2">🐲</div>
                  <p>No monsters yet!</p>
                  <p className="text-sm">Tap "+ New" to get your first egg</p>
                </div>
              ) : (
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                  {monsters.map(monster => (
                    <div
                      key={monster.id}
                      onClick={() => setSelectedMonster(monster)}
                      className={`
                        flex-shrink-0 w-20 p-2 rounded-2xl cursor-pointer transition-all
                        ${selectedMonster?.id === monster.id 
                          ? 'ring-2 ring-purple-500 bg-purple-500/20 scale-105' 
                          : 'bg-gray-800/50 active:bg-gray-700/50'}
                      `}
                    >
                      <MonsterSprite monster={monster} size={56} />
                      <p className="text-xs text-white text-center mt-1 truncate">{monster.name}</p>
                      <p className="text-xs text-gray-500 text-center">
                        {monster.stage === 'ADULT' ? `Lv.${monster.level || 1}` : CONFIG.STAGES[monster.stage].name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Selected Monster View */}
            {selectedMonster ? (
              <div className="bg-gray-900/50 rounded-2xl p-4">
                {/* Monster Display */}
                <div className="flex flex-col items-center mb-4">
                  <div 
                    onClick={() => {
                      const emojis = ['💖', '✨', '🎉', '💫', '😊'];
                      triggerEmotion('happy', emojis[Math.floor(Math.random() * emojis.length)]);
                    }}
                    className="cursor-pointer active:scale-95 transition-transform"
                  >
                    <MonsterSprite 
                      monster={selectedMonster} 
                      size={120} 
                      emotion={careEmotion}
                      forcedEmoji={forcedEmoji}
                    />
                  </div>
                  <h2 className="text-xl font-bold text-white mt-2">{selectedMonster.name}</h2>
                  <p className="text-gray-400 text-sm">
                    {CONFIG.STAGES[selectedMonster.stage].name} • {selectedMonster.type.name}
                    {selectedMonster.stage === 'ADULT' && ` • Lv.${selectedMonster.level || 1}`}
                  </p>
                </div>
                
                {/* Happiness Bar */}
                {selectedMonster.stage !== 'EGG' && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Happiness</span>
                      <span className={selectedMonster.isDepressed ? 'text-red-400' : 'text-pink-400'}>
                        {selectedMonster.isDepressed ? '😢 Depressed' : `${Math.round(selectedMonster.happiness || 100)}%`}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${selectedMonster.isDepressed ? 'bg-red-500' : 'bg-pink-500'}`}
                        style={{ width: `${selectedMonster.happiness || 100}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Action Buttons based on stage */}
                {selectedMonster.stage === 'EGG' ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setMonsters(prev => prev.map(m => 
                          m.id === selectedMonster.id 
                            ? { ...m, age: (m.age || 0) + 10 }
                            : m
                        ));
                        triggerEmotion('excited', '🔥');
                      }}
                      className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 active:from-orange-400 active:to-red-400 rounded-xl text-white font-bold text-lg"
                    >
                      🔥 Incubate
                    </button>
                    <p className="text-center text-gray-500 text-xs">
                      Progress: {selectedMonster.age || 0}/{CONFIG.STAGES.EGG.duration}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setMonsters(prev => prev.map(m => 
                          m.id === selectedMonster.id 
                            ? { ...m, happiness: Math.min(100, (m.happiness || 100) + 5) }
                            : m
                        ));
                        triggerEmotion('happy', '🍖');
                      }}
                      className="py-3 bg-gradient-to-r from-green-600 to-emerald-600 active:from-green-500 active:to-emerald-500 rounded-xl text-white font-bold"
                    >
                      🍖 Feed
                    </button>
                    <button
                      onClick={() => {
                        setMonsters(prev => prev.map(m => 
                          m.id === selectedMonster.id 
                            ? { ...m, happiness: Math.min(100, (m.happiness || 100) + 5) }
                            : m
                        ));
                        triggerEmotion('excited', '🎾');
                      }}
                      className="py-3 bg-gradient-to-r from-blue-600 to-cyan-600 active:from-blue-500 active:to-cyan-500 rounded-xl text-white font-bold"
                    >
                      🎾 Play
                    </button>
                  </div>
                )}
                
                {/* Stats Display (only for non-eggs) */}
                {selectedMonster.stage !== 'EGG' && (
                  <div className="mt-4 grid grid-cols-5 gap-2">
                    {Object.entries(MonsterFactory.getEffectiveStats(selectedMonster)).map(([stat, value]) => (
                      <div key={stat} className="text-center p-2 bg-gray-800/50 rounded-xl">
                        <div className="text-lg font-bold text-white">{Math.round(value)}</div>
                        <div className="text-xs text-gray-500 uppercase">{stat.slice(0, 3)}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Info cards */}
                {selectedMonster.stage !== 'EGG' && (
                  <>
                    {/* Training Points */}
                    <div className="mt-4 flex items-center justify-between bg-gray-800/30 rounded-xl p-3">
                      <span className="text-sm text-gray-300">Training Points</span>
                      <span className="text-lg text-yellow-400 font-bold">
                        ⭐ {selectedMonster.trainingPoints || 0}
                      </span>
                    </div>
                    
                    {/* Quick actions */}
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => {
                          setRenameTarget(selectedMonster);
                          setShowRenameModal(true);
                        }}
                        className="flex-1 py-2 bg-gray-800 active:bg-gray-700 rounded-xl text-gray-300 text-sm"
                      >
                        ✏️ Rename
                      </button>
                      <button
                        onClick={() => setView('train')}
                        className="flex-1 py-2 bg-yellow-600 active:bg-yellow-500 rounded-xl text-white text-sm font-medium"
                      >
                        💪 Train
                      </button>
                      {selectedMonster.stage === 'ADULT' && (
                        <button
                          onClick={() => setView('tournament')}
                          className="flex-1 py-2 bg-red-600 active:bg-red-500 rounded-xl text-white text-sm font-medium"
                        >
                          ⚔️ Battle
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="bg-gray-900/50 rounded-2xl p-8 text-center">
                <div className="text-4xl mb-2">👆</div>
                <p className="text-gray-400 text-sm">Select a monster above</p>
              </div>
            )}
          </div>
        ) : view === 'train' ? (
          /* Training View - Mobile optimized */
          <div className="space-y-4">
            {/* Monster selector - horizontal scroll (exclude eggs) */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white">Select Monster to Train</h2>
              {monsters.filter(m => m.stage !== 'EGG').length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-900/30 rounded-2xl">
                  <div className="text-4xl mb-2">🥚</div>
                  <p>No trainable monsters!</p>
                  <p className="text-sm">Hatch an egg first</p>
                </div>
              ) : (
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                  {monsters.filter(m => m.stage !== 'EGG').map(monster => (
                    <div
                      key={monster.id}
                      onClick={() => setSelectedMonster(monster)}
                      className={`
                        flex-shrink-0 w-20 p-2 rounded-2xl cursor-pointer transition-all
                        ${selectedMonster?.id === monster.id 
                          ? 'ring-2 ring-yellow-500 bg-yellow-500/20 scale-105' 
                          : 'bg-gray-800/50 active:bg-gray-700/50'}
                      `}
                    >
                      <MonsterSprite monster={monster} size={56} />
                      <p className="text-xs text-white text-center mt-1 truncate">{monster.name}</p>
                      <p className="text-xs text-yellow-400 text-center">⭐{monster.trainingPoints || 0}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Training Panel */}
            {selectedMonster && selectedMonster.stage !== 'EGG' ? (
              <div className="bg-gray-900/50 rounded-2xl p-4">
                <div className="flex items-center gap-4 mb-4">
                  <MonsterSprite monster={selectedMonster} size={70} />
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white">{selectedMonster.name}</h2>
                    <p className="text-gray-400 text-sm">
                      {CONFIG.STAGES[selectedMonster.stage].name}
                      {selectedMonster.stage === 'ADULT' && ` • Lv.${selectedMonster.level || 1}`}
                      {' • '}{selectedMonster.type.name}
                    </p>
                    
                    {/* Body Type with stat modifiers */}
                    {selectedMonster.bodyParts?.bodyType && (() => {
                      const bodyType = BodyPartGenerator.getBodyType(selectedMonster.bodyParts.bodyType);
                      const mods = bodyType?.statModifiers || {};
                      const modStrings = Object.entries(mods)
                        .filter(([, v]) => v !== 0)
                        .map(([stat, v]) => {
                          const abbrev = stat.slice(0, 3).toUpperCase();
                          const color = v > 0 ? 'text-green-400' : 'text-red-400';
                          return <span key={stat} className={`${color} mr-1`}>{v > 0 ? '+' : ''}{v}{abbrev}</span>;
                        });
                      return (
                        <div className="mt-1 flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-purple-300">{bodyType?.name}</span>
                          <span className="text-xs">{modStrings}</span>
                        </div>
                      );
                    })()}
                    
                    {/* Training Points */}
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-xl font-bold text-yellow-300">{selectedMonster.trainingPoints || 0}</span>
                      <span className="text-sm text-gray-500">points</span>
                    </div>
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
                
                {/* Training Options - Compact grid */}
                <h3 className="text-sm font-bold text-gray-400 mb-2">Train Stats</h3>
                <div className="grid grid-cols-1 gap-2">
                  {CONFIG.TRAINING_TYPES.map(training => {
                    const currentStat = MonsterFactory.getEffectiveStats(selectedMonster)[training.stat];
                    const canTrain = (selectedMonster.trainingPoints || 0) >= training.cost;
                    
                    return (
                      <button
                        key={training.id}
                        onClick={() => handleTrain(training.stat)}
                        disabled={!canTrain}
                        className={`p-3 rounded-xl transition-all flex items-center gap-3 ${
                          canTrain 
                            ? 'bg-gray-800 active:bg-gray-700' 
                            : 'bg-gray-800/50 opacity-50'
                        }`}
                      >
                        <div className="text-2xl">{training.emoji}</div>
                        <div className="flex-1 text-left">
                          <div className="font-bold text-white capitalize text-sm">{training.stat}</div>
                          <div className="text-xs text-gray-500">{training.description}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-300 font-bold">{Math.round(currentStat)}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-gray-900/50 rounded-2xl p-8 text-center">
                <div className="text-4xl mb-2">💪</div>
                <p className="text-gray-400 text-sm">Select a monster above to train</p>
                <p className="text-gray-500 text-xs mt-1">Win battles to earn training points!</p>
              </div>
            )}
            
            {/* Quick Battle Section in Training */}
            {selectedMonster && selectedMonster.stage !== 'EGG' && (
              <div className="mt-6 bg-gray-900/50 rounded-2xl p-4">
                <h3 className="text-sm font-bold text-gray-400 mb-3">Quick Battle</h3>
                {selectedMonster.stage === 'ADULT' ? (
                  <>
                    {selectedMonster.isDepressed ? (
                      <div className="text-center py-4">
                        <div className="text-3xl mb-2">😢</div>
                        <p className="text-red-400 text-sm">{selectedMonster.name} is depressed</p>
                        <p className="text-gray-500 text-xs">Wait for full happiness recovery (100%)</p>
                        <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-red-500"
                            style={{ width: `${selectedMonster.happiness || 0}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {/* Sad indicator if low happiness */}
                        {(selectedMonster.happiness || 100) < CONFIG.HAPPINESS.minToFight && (
                          <div className="text-center py-2 bg-yellow-500/10 rounded-xl mb-2">
                            <span className="text-yellow-400 text-sm">😔 {selectedMonster.name} is feeling sad</span>
                            <div className="mt-1 h-1.5 bg-gray-700 rounded-full overflow-hidden mx-4">
                              <div 
                                className="h-full bg-yellow-500"
                                style={{ width: `${selectedMonster.happiness || 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                        
                        {/* 1v1 Battle */}
                        <button
                          onClick={() => {
                            const enemy = generateEnemyWithRivalChance(selectedMonster);
                            setSelectedFighter(selectedMonster);
                            setCurrentEnemy(enemy);
                          }}
                          className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 active:from-red-500 active:to-orange-500 rounded-xl text-white font-bold"
                        >
                          ⚔️ 1v1 Battle
                        </button>
                        
                        {/* Free-for-All (4 player) */}
                        <button
                          onClick={() => {
                            // Create 3 stronger enemies for a 4-way battle (15% stronger each)
                            // Each has 25% chance to be a rival
                            const enemies = [
                              generateEnemyWithRivalChance(selectedMonster, 1.15, 0.25),
                              generateEnemyWithRivalChance(selectedMonster, 1.15, 0.25),
                              generateEnemyWithRivalChance(selectedMonster, 1.15, 0.25),
                            ];
                            // Show FFA preview
                            setSelectedFighter(selectedMonster);
                            setFfaEnemies(enemies);
                          }}
                          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 active:from-purple-500 active:to-pink-500 rounded-xl text-white font-bold"
                        >
                          🔥 Free-for-All (1v1v1v1)
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500 text-sm text-center">Only adults can battle</p>
                )}
              </div>
            )}
          </div>
        ) : view === 'tournament' ? (
          /* Tournament/Arena View */
          <div className="space-y-4">
            {tournamentState ? (
              /* Active Tournament */
              battleState ? (
                /* Tournament Battle */
                <div>
                  <div className="text-center mb-2">
                    <span className="text-orange-400 text-sm font-bold">
                      {tournamentState.name} - Round {tournamentState.currentRound}/{tournamentState.totalRounds}
                    </span>
                  </div>
                  <BattleArena 
                    battleState={battleState} 
                    onEnd={() => {
                      // Handle tournament battle end
                      const isWin = battleState.winner && !battleState.winner.isEnemy;
                      
                      if (isWin) {
                        // Won this round
                        const nextRound = tournamentState.currentRound + 1;
                        
                        if (nextRound > tournamentState.totalRounds) {
                          // Won the tournament!
                          const prize = tournamentState.prize;
                          setTrainerProfile(prev => ({
                            ...prev,
                            coins: prev.coins + prize,
                            totalWins: prev.totalWins + 1,
                            medals: [...prev.medals, { 
                              icon: tournamentState.icon, 
                              name: tournamentState.name,
                              date: Date.now() 
                            }],
                          }));
                          
                          // Update monster happiness
                          setMonsters(prev => prev.map(m => 
                            m.id === tournamentState.fighterId 
                              ? { ...m, happiness: Math.min(100, (m.happiness || 100) + 25) }
                              : m
                          ));
                          
                          setBattleResult({
                            won: true,
                            isTournament: true,
                            tournamentName: tournamentState.name,
                            prize: prize,
                            medal: tournamentState.icon,
                          });
                          setTournamentState(null);
                        } else {
                          // Next round
                          const nextEnemy = tournamentState.opponents[nextRound - 1];
                          setTournamentState(prev => ({ ...prev, currentRound: nextRound }));
                          setBattleState(BattleEngine.createBattleState(
                            monsters.find(m => m.id === tournamentState.fighterId),
                            nextEnemy
                          ));
                          
                          // Update trainer wins
                          setTrainerProfile(prev => ({ ...prev, totalWins: prev.totalWins + 1 }));
                        }
                      } else {
                        // Lost tournament
                        setTrainerProfile(prev => ({ ...prev, totalLosses: prev.totalLosses + 1 }));
                        
                        // Reduce happiness
                        setMonsters(prev => prev.map(m => 
                          m.id === tournamentState.fighterId 
                            ? { ...m, happiness: Math.max(0, (m.happiness || 100) - 15) }
                            : m
                        ));
                        
                        setBattleResult({
                          won: false,
                          isTournament: true,
                          tournamentName: tournamentState.name,
                          roundReached: tournamentState.currentRound,
                        });
                        setTournamentState(null);
                      }
                      setBattleState(null);
                    }}
                  />
                </div>
              ) : (
                /* Tournament Bracket View */
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-4 text-center">
                    <span className="text-4xl">{tournamentState.icon}</span>
                    <h2 className="text-xl font-bold text-white mt-2">{tournamentState.name}</h2>
                    <p className="text-white/80 text-sm">Round {tournamentState.currentRound} of {tournamentState.totalRounds}</p>
                  </div>
                  
                  {/* Opponents bracket */}
                  <div className="bg-gray-900/50 rounded-2xl p-4">
                    <h3 className="font-bold text-white mb-3">Tournament Bracket</h3>
                    <div className="space-y-2">
                      {tournamentState.opponents.map((opp, i) => (
                        <div 
                          key={opp.id}
                          className={`flex items-center justify-between p-3 rounded-xl ${
                            i + 1 < tournamentState.currentRound 
                              ? 'bg-green-500/20 border border-green-500/30' 
                              : i + 1 === tournamentState.currentRound
                                ? opp.isRivalRematch 
                                  ? 'bg-purple-500/20 border border-purple-500/50'
                                  : 'bg-orange-500/20 border border-orange-500/50'
                                : 'bg-gray-800/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-gray-400">R{i + 1}</span>
                            <div className="w-10 h-10">
                              <MonsterSprite monster={opp} size={40} showEmoji={false} />
                            </div>
                            <div>
                              <p className="text-white font-bold text-sm">
                                {opp.isRivalRematch && <span className="text-purple-400">⚔️ </span>}
                                {opp.name}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {opp.trainerName}{opp.isRivalRematch ? ' (Rival!)' : ''} • PWR: {Math.round(Object.values(MonsterFactory.getEffectiveStats(opp)).reduce((a,b) => a+b, 0))}
                              </p>
                            </div>
                          </div>
                          <span className={`text-sm ${
                            i + 1 < tournamentState.currentRound ? 'text-green-400' : 
                            i + 1 === tournamentState.currentRound ? opp.isRivalRematch ? 'text-purple-400' : 'text-orange-400' : 'text-gray-500'
                          }`}>
                            {i + 1 < tournamentState.currentRound ? '✓ WON' : 
                             i + 1 === tournamentState.currentRound ? '⚔️ NEXT' : '...'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Start next battle button */}
                  <button
                    onClick={() => {
                      const fighter = monsters.find(m => m.id === tournamentState.fighterId);
                      const enemy = tournamentState.opponents[tournamentState.currentRound - 1];
                      setBattleState(BattleEngine.createBattleState(fighter, enemy));
                    }}
                    className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl text-white font-bold text-lg"
                  >
                    ⚔️ Fight Round {tournamentState.currentRound}
                  </button>
                  
                  <button
                    onClick={() => {
                      setTournamentState(null);
                      // No refund for forfeit
                    }}
                    className="w-full py-2 bg-gray-800 rounded-xl text-gray-400 text-sm"
                  >
                    Forfeit Tournament
                  </button>
                </div>
              )
            ) : (
              /* Tournament Selection */
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">🏆 Tournament Arena</h2>
                  <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-1 rounded-full">
                    <span className="text-yellow-400">🪙</span>
                    <span className="text-yellow-300 font-bold">{trainerProfile.coins}</span>
                  </div>
                </div>
                
                {/* Tournament Tiers */}
                <div className="space-y-3">
                  {[
                    { tier: 1, name: 'Bronze Cup', color: 'from-amber-700 to-amber-900', icon: '🥉', minPower: 0, rounds: 3 },
                    { tier: 2, name: 'Silver Cup', color: 'from-gray-400 to-gray-600', icon: '🥈', minPower: 60, rounds: 4 },
                    { tier: 3, name: 'Gold Cup', color: 'from-yellow-500 to-yellow-700', icon: '🥇', minPower: 80, rounds: 4 },
                    { tier: 4, name: 'Platinum Cup', color: 'from-cyan-400 to-cyan-600', icon: '💎', minPower: 100, rounds: 5 },
                    { tier: 5, name: 'Champion Cup', color: 'from-purple-500 to-pink-600', icon: '👑', minPower: 120, rounds: 5 },
                  ].map(tournament => {
                    const entryFee = CONFIG.ECONOMY.tournamentEntryFees[tournament.tier - 1];
                    const prize = CONFIG.ECONOMY.tournamentPrizes[tournament.tier - 1];
                    const canAfford = trainerProfile.coins >= entryFee;
                    const eligibleMonsters = monsters.filter(m => {
                      if (m.stage !== 'ADULT') return false;
                      if (m.isDepressed) return false; // Only depressed monsters can't enter
                      const power = Object.values(MonsterFactory.getEffectiveStats(m)).reduce((a, b) => a + b, 0);
                      return power >= tournament.minPower;
                    });
                    const hasEligibleMonster = eligibleMonsters.length > 0;
                    
                    return (
                      <div
                        key={tournament.tier}
                        className={`bg-gradient-to-r ${tournament.color} rounded-2xl p-4 ${!canAfford || !hasEligibleMonster ? 'opacity-50' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{tournament.icon}</span>
                            <div>
                              <h3 className="font-bold text-white">{tournament.name}</h3>
                              <p className="text-xs text-white/70">Min Power: {tournament.minPower} • {tournament.rounds} rounds</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-white/70">Entry: {entryFee}🪙</p>
                            <p className="text-sm text-yellow-300 font-bold">Prize: {prize}🪙</p>
                          </div>
                        </div>
                        
                        {hasEligibleMonster && canAfford && (
                          <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                            {eligibleMonsters.map(m => (
                              <button
                                key={m.id}
                                onClick={() => {
                                  // Generate tournament opponents
                                  const opponents = [];
                                  for (let i = 0; i < tournament.rounds; i++) {
                                    // Each round gets slightly harder
                                    const scaleFactor = 0.9 + (i * 0.1); // 90% to 130%+
                                    // 20% chance for rival in tournament, higher in later rounds
                                    const rivalChance = 0.15 + (i * 0.05); // 15%, 20%, 25%, 30%, 35%
                                    const enemy = generateEnemyWithRivalChance(m, scaleFactor, rivalChance);
                                    opponents.push(enemy);
                                  }
                                  
                                  // Pay entry fee
                                  setTrainerProfile(prev => ({
                                    ...prev,
                                    coins: prev.coins - entryFee,
                                  }));
                                  
                                  // Start tournament
                                  setTournamentState({
                                    tier: tournament.tier,
                                    name: tournament.name,
                                    icon: tournament.icon,
                                    prize: prize,
                                    entryFee: entryFee,
                                    totalRounds: tournament.rounds,
                                    currentRound: 1,
                                    fighterId: m.id,
                                    opponents: opponents,
                                  });
                                }}
                                className="flex-shrink-0 w-16 p-2 bg-black/30 rounded-xl hover:bg-black/50 transition-all"
                              >
                                <MonsterSprite monster={m} size={48} showEmoji={false} />
                                <p className="text-xs text-white text-center mt-1 truncate">{m.name}</p>
                              </button>
                            ))}
                          </div>
                        )}
                        
                        {!hasEligibleMonster && (
                          <p className="mt-3 text-center text-white/60 text-sm py-2 bg-black/20 rounded-xl">
                            No eligible monster (need {tournament.minPower}+ power)
                          </p>
                        )}
                        {hasEligibleMonster && !canAfford && (
                          <p className="mt-3 text-center text-white/60 text-sm py-2 bg-black/20 rounded-xl">
                            Not enough coins ({entryFee}🪙 needed)
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        ) : view === 'profile' ? (
          /* Profile View */
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">👤 Trainer Profile</h2>
            
            {/* Trainer Stats Card */}
            <div className="bg-gray-900/50 rounded-2xl p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl">
                  👤
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">{trainerProfile.name}</h3>
                    <button 
                      onClick={() => setShowTrainerNameModal(true)}
                      className="text-gray-400 active:text-white"
                    >
                      ✏️
                    </button>
                  </div>
                  <p className="text-gray-400 text-sm">Monster Trainer</p>
                </div>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-green-400">{trainerProfile.totalWins}</div>
                  <div className="text-xs text-gray-500">Wins</div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-red-400">{trainerProfile.totalLosses}</div>
                  <div className="text-xs text-gray-500">Losses</div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-yellow-400">{trainerProfile.coins}</div>
                  <div className="text-xs text-gray-500">Coins</div>
                </div>
              </div>
              
              {/* Win Rate */}
              {(trainerProfile.totalWins + trainerProfile.totalLosses) > 0 && (
                <div className="bg-gray-800/50 rounded-xl p-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Win Rate</span>
                    <span className="text-white font-bold">
                      {Math.round((trainerProfile.totalWins / (trainerProfile.totalWins + trainerProfile.totalLosses)) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-green-400"
                      style={{ width: `${(trainerProfile.totalWins / (trainerProfile.totalWins + trainerProfile.totalLosses)) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Medals Section */}
            <div className="bg-gray-900/50 rounded-2xl p-4">
              <h3 className="font-bold text-white mb-3">🏅 Medals & Trophies</h3>
              {trainerProfile.medals.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  No medals yet. Win tournaments to earn medals!
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {trainerProfile.medals.map((medal, i) => (
                    <div key={i} className="bg-gray-800 rounded-lg p-2 text-2xl">
                      {medal.icon}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Rivals Section */}
            <div className="bg-gray-900/50 rounded-2xl p-4">
              <h3 className="font-bold text-white mb-3">⚔️ Top Rivals</h3>
              {trainerProfile.rivals.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  No rivals yet. Battle more to make rivals!
                </p>
              ) : (
                <div className="space-y-2">
                  {trainerProfile.rivals
                    .sort((a, b) => b.encounters - a.encounters)
                    .slice(0, 5)
                    .map((rival, i) => (
                    <div key={rival.id} className="flex items-center justify-between bg-gray-800/50 rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">#{i + 1}</span>
                        <div>
                          <span className="text-white font-bold">{rival.name}</span>
                          <p className="text-xs text-gray-500">{rival.encounters} battles</p>
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="text-green-400">{rival.wins}W</span>
                        <span className="text-gray-500 mx-1">-</span>
                        <span className="text-red-400">{rival.losses}L</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Monster Collection */}
            <div className="bg-gray-900/50 rounded-2xl p-4">
              <h3 className="font-bold text-white mb-3">🐾 Monster Collection ({monsters.length})</h3>
              <div className="grid grid-cols-4 gap-2">
                {monsters.map(monster => (
                  <div 
                    key={monster.id}
                    onClick={() => {
                      setRenameTarget(monster);
                      setShowRenameModal(true);
                    }}
                    className="bg-gray-800/50 rounded-xl p-2 cursor-pointer hover:bg-gray-700/50"
                  >
                    <MonsterSprite monster={monster} size={40} />
                    <p className="text-xs text-white text-center mt-1 truncate">{monster.name}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">Tap to rename</p>
            </div>
          </div>
        ) : (
          /* Fallback - Battle View for backwards compatibility */
          <div className="space-y-4">
            {battleState ? (
              <BattleArena battleState={battleState} onEnd={handleEndBattle} />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Go to Train to start battles!</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Bottom Navigation - Mobile style */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 z-40">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex justify-around py-2">
            <button
              onClick={() => setView('care')}
              className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${
                view === 'care' ? 'text-purple-400' : 'text-gray-500'
              }`}
            >
              <span className="text-2xl">🏠</span>
              <span className="text-xs mt-1">Care</span>
            </button>
            <button
              onClick={() => setView('train')}
              className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${
                view === 'train' ? 'text-yellow-400' : 'text-gray-500'
              }`}
            >
              <span className="text-2xl">💪</span>
              <span className="text-xs mt-1">Train</span>
            </button>
            <button
              onClick={() => setView('tournament')}
              className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${
                view === 'tournament' ? 'text-orange-400' : 'text-gray-500'
              }`}
            >
              <span className="text-2xl">🏆</span>
              <span className="text-xs mt-1">Arena</span>
            </button>
            <button
              onClick={() => setView('profile')}
              className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${
                view === 'profile' ? 'text-blue-400' : 'text-gray-500'
              }`}
            >
              <span className="text-2xl">👤</span>
              <span className="text-xs mt-1">Profile</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      {showEggSelection && (
        <EggSelectionModal
          onSelect={handleCreateEgg}
          onClose={() => setShowEggSelection(false)}
        />
      )}
      
      {currentEnemy && selectedFighter && !ffaEnemies && (
        <EnemyPreviewModal
          playerMonster={selectedFighter}
          enemy={currentEnemy}
          onStartBattle={handleStartBattle}
          onClose={handleCancelBattleSetup}
        />
      )}
      
      {ffaEnemies && selectedFighter && (
        <FFAPreviewModal
          playerMonster={selectedFighter}
          enemies={ffaEnemies}
          onStartBattle={() => {
            const allFighters = [selectedFighter, ...ffaEnemies];
            setBattleState(BattleEngine.createMultiBattleState(allFighters));
            setFfaEnemies(null);
            setSelectedFighter(null);
            setLastBattleWasFFA(true); // Track this was an FFA
            setView('battle');
          }}
          onClose={() => {
            setFfaEnemies(null);
            setSelectedFighter(null);
          }}
        />
      )}
      
      {battleResult && (
        <BattleResultModal
          result={battleResult}
          onClose={handleCloseBattleResult}
          onBattleAgain={handleBattleAgain}
        />
      )}
      
      {/* Trainer Name Modal */}
      {showTrainerNameModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-3xl p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold text-white mb-4 text-center">Your Trainer Name</h2>
            <div className="text-6xl text-center mb-4">👤</div>
            <input
              type="text"
              defaultValue={trainerProfile.name}
              maxLength={15}
              autoFocus
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none mb-4 text-center"
              id="trainer-name-input"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowTrainerNameModal(false)}
                className="flex-1 py-3 bg-gray-800 active:bg-gray-700 rounded-xl text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const newName = document.getElementById('trainer-name-input').value.trim();
                  if (newName) {
                    setTrainerProfile(prev => ({ ...prev, name: newName }));
                  }
                  setShowTrainerNameModal(false);
                }}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 active:from-purple-500 active:to-pink-500 rounded-xl text-white font-bold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Rename Modal */}
      {showRenameModal && renameTarget && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-3xl p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold text-white mb-4 text-center">Rename Monster</h2>
            <div className="flex justify-center mb-4">
              <MonsterSprite monster={renameTarget} size={60} />
            </div>
            <input
              type="text"
              defaultValue={renameTarget.name}
              maxLength={20}
              autoFocus
              className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none mb-4"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRename(e.target.value);
                }
              }}
              id="rename-input"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowRenameModal(false); setRenameTarget(null); }}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRename(document.getElementById('rename-input').value)}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl text-white font-bold"
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
