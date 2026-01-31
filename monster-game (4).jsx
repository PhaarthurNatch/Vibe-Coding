import React, { useState, useEffect, useRef } from 'react';

// ============================================================================
// CONFIGURATION MODULE
// ============================================================================
const CONFIG = {
  // Monster Colors - Random selection, no types
  MONSTER_COLORS: [
    { primary: '#ff6b35', name: 'Ember' },
    { primary: '#4ecdc4', name: 'Teal' },
    { primary: '#95d5b2', name: 'Sage' },
    { primary: '#7b2cbf', name: 'Violet' },
    { primary: '#f72585', name: 'Magenta' },
    { primary: '#4361ee', name: 'Azure' },
    { primary: '#f4a261', name: 'Amber' },
    { primary: '#2a9d8f', name: 'Jade' },
    { primary: '#e63946', name: 'Crimson' },
    { primary: '#a8dadc', name: 'Frost' },
    { primary: '#ffb703', name: 'Gold' },
    { primary: '#8338ec', name: 'Purple' },
    { primary: '#06d6a0', name: 'Mint' },
    { primary: '#ef476f', name: 'Rose' },
    { primary: '#118ab2', name: 'Ocean' },
    { primary: '#fb8500', name: 'Tangerine' },
    { primary: '#7209b7', name: 'Grape' },
    { primary: '#3a0ca3', name: 'Indigo' },
    { primary: '#4cc9f0', name: 'Sky' },
    { primary: '#90be6d', name: 'Lime' },
  ],
  
  // Body parts by stage
  BODY_PARTS: {
    baby: {
      bodies: [
        { id: 'blob', angular: false },
        { id: 'round', angular: false },
        { id: 'pudgy', angular: false },
        { id: 'bean', angular: false },
        { id: 'teardrop', angular: false },
        { id: 'spiky', angular: true },
        { id: 'angular', angular: true },
        { id: 'crystal', angular: true },
      ],
      heads: [
        { id: 'round', angular: false },
        { id: 'oval', angular: false },
        { id: 'pudgy', angular: false },
        { id: 'heart', angular: false },
        { id: 'pointed', angular: true },
        { id: 'diamond', angular: true },
      ],
      eyes: [
        { id: 'cute', count: 2 },
        { id: 'round', count: 2 },
        { id: 'tiny', count: 2 },
        { id: 'sleepy', count: 2 },
        { id: 'cyclops', count: 1 },
      ],
      appendages: [
        { id: 'none' },
        { id: 'nubs' },
        { id: 'tiny_arms' },
        { id: 'tiny_fins' },
      ],
      tails: [
        { id: 'none' },
        { id: 'nub' },
        { id: 'fluffy' },
      ],
    },
    juvenile: {
      bodies: [
        { id: 'bipedal', angular: false },
        { id: 'quadruped', angular: false },
        { id: 'serpent', angular: false },
        { id: 'floater', angular: false },
        { id: 'angular', angular: true },
        { id: 'spiky', angular: true },
        { id: 'lanky', angular: true },
      ],
      heads: [
        { id: 'round', angular: false },
        { id: 'oval', angular: false },
        { id: 'angular', angular: true },
        { id: 'pointed', angular: true },
        { id: 'flat', angular: false },
        { id: 'crest', angular: true },
        { id: 'horned', angular: true },
      ],
      eyes: [
        { id: 'round', count: 2 },
        { id: 'cute', count: 2 },
        { id: 'angry', count: 2 },
        { id: 'cyclops', count: 1 },
        { id: 'three', count: 3 },
        { id: 'sleepy', count: 2 },
      ],
      appendages: [
        { id: 'none' },
        { id: 'arms' },
        { id: 'claws' },
        { id: 'fins' },
        { id: 'wings_small' },
        { id: 'tentacles' },
      ],
      tails: [
        { id: 'none' },
        { id: 'short' },
        { id: 'fluffy' },
        { id: 'pointed' },
        { id: 'fin' },
      ],
    },
    adult: {
      bodies: [
        { id: 'bipedal', angular: false },
        { id: 'quadruped', angular: false },
        { id: 'hexapod', angular: true },
        { id: 'serpentine', angular: false },
        { id: 'floater', angular: false },
        { id: 'centauroid', angular: false },
        { id: 'amorphous', angular: false },
        { id: 'arachnid', angular: true },
        { id: 'winged', angular: false },
        { id: 'bulky', angular: false },
        { id: 'sleek', angular: true },
        { id: 'armored', angular: true },
        { id: 'ethereal', angular: false },
      ],
      heads: [
        { id: 'round', angular: false },
        { id: 'angular', angular: true },
        { id: 'oval', angular: false },
        { id: 'square', angular: true },
        { id: 'star', angular: true },
        { id: 'pointed', angular: true },
        { id: 'flat', angular: false },
        { id: 'skull', angular: true },
        { id: 'heart', angular: false },
        { id: 'crescent', angular: true },
        { id: 'droplet', angular: false },
        { id: 'mushroom', angular: false },
        { id: 'triangle', angular: true },
        { id: 'diamond', angular: true },
        { id: 'horned', angular: true },
        { id: 'crowned', angular: true },
        { id: 'masked', angular: true },
        { id: 'elongated', angular: false },
      ],
      eyes: [
        { id: 'none', count: 0 },
        { id: 'cyclops', count: 1 },
        { id: 'round', count: 2 },
        { id: 'angry', count: 2 },
        { id: 'cute', count: 2 },
        { id: 'sleepy', count: 2 },
        { id: 'three', count: 3 },
        { id: 'four', count: 4 },
        { id: 'tiny', count: 2 },
        { id: 'glowing', count: 2 },
        { id: 'compound', count: 2 },
        { id: 'slit', count: 2 },
        { id: 'hollow', count: 2 },
        { id: 'visor', count: 1 },
      ],
      appendages: [
        { id: 'none' },
        { id: 'arms' },
        { id: 'claws' },
        { id: 'pincers' },
        { id: 'fins' },
        { id: 'wings' },
        { id: 'tentacles' },
        { id: 'blades' },
        { id: 'tendrils' },
        { id: 'cannons' },
        { id: 'scythes' },
        { id: 'shields' },
      ],
      tails: [
        { id: 'none' },
        { id: 'long' },
        { id: 'fluffy' },
        { id: 'pointed' },
        { id: 'spiked' },
        { id: 'flame' },
        { id: 'split' },
        { id: 'club' },
        { id: 'blade' },
        { id: 'serpent' },
      ],
      decorations: [
        { id: 'none' },
        { id: 'horns' },
        { id: 'spikes' },
        { id: 'crest' },
        { id: 'mane' },
        { id: 'armor' },
        { id: 'crystals' },
        { id: 'flames' },
        { id: 'halo' },
        { id: 'antlers' },
        { id: 'fins_back' },
        { id: 'shell' },
      ],
    },
    markings: [
      { id: 'none' },
      { id: 'stripes' },
      { id: 'spots' },
      { id: 'belly' },
      { id: 'glow' },
      { id: 'gradient' },
      { id: 'patches' },
      { id: 'rings' },
      { id: 'scar' },
    ],
  },
  
  // Stages based on stats
  STAGES: {
    BABY: { name: 'Baby', minStats: 0 },
    JUVENILE: { name: 'Juvenile', minStats: 5 },
    ADULT: { name: 'Adult', minStats: 10 },
  },
  
  // Leveling
  LEVELING: {
    expPerWin: 100,
    expPerTraining: 30,
    expPerLevel: 150,
    levelMultiplier: 1.3,
    maxLevel: 99,
    trainingPointsPerLevel: 10,
    startingTrainingPoints: 10,
  },
  
  // Training
  TRAINING_TYPES: [
    { id: 'strength', name: 'Strength', emoji: '💪', stat: 'strength', desc: 'Melee damage', cost: 1 },
    { id: 'constitution', name: 'Constitution', emoji: '🛡️', stat: 'constitution', desc: 'Health & defense', cost: 1 },
    { id: 'agility', name: 'Agility', emoji: '💨', stat: 'agility', desc: 'Speed & dodge', cost: 1 },
    { id: 'power', name: 'Power', emoji: '🔮', stat: 'power', desc: 'Magic damage', cost: 1 },
    { id: 'intelligence', name: 'Intelligence', emoji: '🧠', stat: 'intelligence', desc: 'Battle AI', cost: 1 },
  ],
  
  // Battle
  BATTLE: {
    arenaWidth: 400,
    arenaHeight: 550,
    tickRate: 67,
    moveSpeed: 2,
    attackRange: 60,
    projectileRange: 200,
    attackCooldown: 1200,
    dodgeCooldown: 800,
    monsterRadius: 25,
    projectileSpeed: 8,
    projectileSize: 8,
  },
  
  // Stat effects
  STAT_EFFECTS: {
    strengthDamageMultiplier: 0.4,
    constitutionDefenseMultiplier: 0.5,
    agilitySpeedMultiplier: 0.1,
    agilityAttackSpeedMultiplier: 0.02,
    powerMagicDamageMultiplier: 0.4,
  },
  
  // Economy
  ECONOMY: {
    eggPrice: 20,
    dumpsterPrice: 10,
    coinsPerWin: 1,
    reviveBaseCost: 5,
    reviveLevelMultiplier: 2,
  },
};

// ============================================================================
// UTILITIES
// ============================================================================
const Utils = {
  generateId: () => Math.random().toString(36).substr(2, 9),
  
  randomChoice: (arr) => arr[Math.floor(Math.random() * arr.length)],
  
  distance: (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2),
  
  generateSecondaryColor: (primary) => {
    const hex = primary.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const factor = Math.random() > 0.5 ? 0.7 : 1.3;
    return `rgb(${Math.min(255, Math.floor(r * factor))}, ${Math.min(255, Math.floor(g * factor))}, ${Math.min(255, Math.floor(b * factor))})`;
  },
  
  generateName: () => {
    const prefixes = ['Blip', 'Zorp', 'Mog', 'Pip', 'Fluff', 'Grim', 'Spark', 'Shadow', 'Luna', 'Sol', 'Nyx', 'Hex', 'Blix', 'Fang', 'Spike', 'Gloom', 'Blaze', 'Frost', 'Storm', 'Wisp', 'Ember', 'Echo', 'Jinx', 'Rune', 'Dusk', 'Dawn', 'Ash', 'Byte', 'Pixel', 'Noir'];
    const suffixes = ['o', 'a', 'us', 'ix', 'on', 'er', 'y', 'ie', 'ling', 'oid', 'ton', 'worth', 'kin', 'bit', 'zap'];
    return prefixes[Math.floor(Math.random() * prefixes.length)] + suffixes[Math.floor(Math.random() * suffixes.length)];
  },
  
  generateTrainerName: () => {
    const names = ['Alex', 'Sam', 'Jordan', 'Casey', 'Riley', 'Morgan', 'Taylor', 'Quinn', 'Avery', 'Blake', 'Cameron', 'Drew', 'Flynn', 'Gray', 'Haven', 'Kai', 'Lane', 'Max', 'Nova', 'Phoenix', 'Raven', 'Sage', 'Storm', 'Vale', 'Winter', 'Zion', 'Ash', 'River'];
    return names[Math.floor(Math.random() * names.length)];
  },
};

// ============================================================================
// MONSTER FACTORY
// ============================================================================
const MonsterFactory = {
  getStage: (monster) => {
    const stats = MonsterFactory.getEffectiveStats(monster);
    const minStat = Math.min(stats.strength, stats.constitution, stats.agility, stats.power, stats.intelligence);
    if (minStat >= 10) return 'ADULT';
    if (minStat >= 5) return 'JUVENILE';
    return 'BABY';
  },
  
  generateBodyParts: (stage, angularBias = 0.5) => {
    const parts = CONFIG.BODY_PARTS[stage.toLowerCase()] || CONFIG.BODY_PARTS.adult;
    
    const pick = (list) => {
      if (!list) return 'none';
      const filtered = list.filter(p => p.angular === undefined || Math.random() < (p.angular ? angularBias : 1 - angularBias + 0.3));
      return (Utils.randomChoice(filtered.length > 0 ? filtered : list))?.id || 'none';
    };
    
    return {
      body: pick(parts.bodies),
      head: pick(parts.heads),
      eyes: pick(parts.eyes),
      appendages: pick(parts.appendages),
      tail: pick(parts.tails),
      decoration: pick(parts.decorations || [{ id: 'none' }]),
      marking: Utils.randomChoice(CONFIG.BODY_PARTS.markings)?.id || 'none',
    };
  },
  
  createBaby: (isDumpster = false) => {
    const colorData = Utils.randomChoice(CONFIG.MONSTER_COLORS);
    const angularBias = isDumpster ? 0.7 : 0.3;
    
    return {
      id: Utils.generateId(),
      name: Utils.generateName(),
      primaryColor: colorData.primary,
      secondaryColor: Utils.generateSecondaryColor(colorData.primary),
      colorName: colorData.name,
      isDumpster,
      bodyParts: MonsterFactory.generateBodyParts('BABY', angularBias),
      baseStats: {
        strength: 1 + Math.floor(Math.random() * 3),
        constitution: 1 + Math.floor(Math.random() * 3),
        agility: 1 + Math.floor(Math.random() * 3),
        power: 1 + Math.floor(Math.random() * 3),
        intelligence: 1 + Math.floor(Math.random() * 3),
      },
      maxStatBonuses: { strength: 0, constitution: 0, agility: 0, power: 0, intelligence: 0 },
      trainingPoints: CONFIG.LEVELING.startingTrainingPoints,
      level: 1,
      exp: 0,
      isDead: false,
      battleStats: { wins: 0, losses: 0, deaths: 0 },
      createdAt: Date.now(),
    };
  },
  
  createDumpsterAdult: () => {
    const colorData = Utils.randomChoice(CONFIG.MONSTER_COLORS);
    
    return {
      id: Utils.generateId(),
      name: Utils.generateName(),
      primaryColor: colorData.primary,
      secondaryColor: Utils.generateSecondaryColor(colorData.primary),
      colorName: colorData.name,
      isDumpster: true,
      bodyParts: MonsterFactory.generateBodyParts('ADULT', 0.7),
      baseStats: {
        strength: 10 + Math.floor(Math.random() * 8),
        constitution: 10 + Math.floor(Math.random() * 8),
        agility: 10 + Math.floor(Math.random() * 8),
        power: 10 + Math.floor(Math.random() * 8),
        intelligence: 10 + Math.floor(Math.random() * 8),
      },
      maxStatBonuses: { strength: 0, constitution: 0, agility: 0, power: 0, intelligence: 0 },
      trainingPoints: 0,
      level: 5 + Math.floor(Math.random() * 5),
      exp: 0,
      isDead: false,
      battleStats: { wins: 0, losses: 0, deaths: 0 },
      createdAt: Date.now(),
    };
  },
  
  getEffectiveStats: (monster) => {
    const base = monster.baseStats || { strength: 10, constitution: 10, agility: 10, power: 10, intelligence: 10 };
    const bonuses = monster.maxStatBonuses || {};
    return {
      strength: Math.round(base.strength + (bonuses.strength || 0)),
      constitution: Math.round(base.constitution + (bonuses.constitution || 0)),
      agility: Math.round(base.agility + (bonuses.agility || 0)),
      power: Math.round(base.power + (bonuses.power || 0)),
      intelligence: Math.round(base.intelligence + (bonuses.intelligence || 0)),
    };
  },
  
  getTotalPower: (monster) => {
    const s = MonsterFactory.getEffectiveStats(monster);
    return s.strength + s.constitution + s.agility + s.power + s.intelligence;
  },
  
  getExpForLevel: (level) => Math.floor(CONFIG.LEVELING.expPerLevel * Math.pow(CONFIG.LEVELING.levelMultiplier, level - 1)),
  
  addExperience: (monster, exp) => {
    if (monster.level >= CONFIG.LEVELING.maxLevel) return { monster, leveledUp: false, trainingPointsGained: 0 };
    
    const updated = { ...monster };
    updated.exp = (monster.exp || 0) + exp;
    let leveledUp = false;
    let levelsGained = 0;
    
    let expNeeded = MonsterFactory.getExpForLevel(updated.level);
    while (updated.exp >= expNeeded && updated.level < CONFIG.LEVELING.maxLevel) {
      updated.exp -= expNeeded;
      updated.level += 1;
      leveledUp = true;
      levelsGained += 1;
      expNeeded = MonsterFactory.getExpForLevel(updated.level);
    }
    
    const trainingPointsGained = levelsGained * CONFIG.LEVELING.trainingPointsPerLevel;
    if (trainingPointsGained > 0) {
      updated.trainingPoints = (updated.trainingPoints || 0) + trainingPointsGained;
    }
    
    // Evolve body parts if stage changed
    const oldStage = MonsterFactory.getStage(monster);
    const newStage = MonsterFactory.getStage(updated);
    if (newStage !== oldStage) {
      updated.bodyParts = MonsterFactory.generateBodyParts(newStage, monster.isDumpster ? 0.6 : 0.4);
    }
    
    return { monster: updated, leveledUp, levelsGained, trainingPointsGained };
  },
  
  trainStat: (monster, statName) => {
    const t = CONFIG.TRAINING_TYPES.find(x => x.stat === statName);
    if (!t || (monster.trainingPoints || 0) < t.cost) return { success: false, monster };
    
    const updated = { ...monster };
    updated.trainingPoints = (monster.trainingPoints || 0) - t.cost;
    updated.maxStatBonuses = { ...monster.maxStatBonuses, [statName]: (monster.maxStatBonuses[statName] || 0) + 1 };
    
    // Check for evolution
    const oldStage = MonsterFactory.getStage(monster);
    const newStage = MonsterFactory.getStage(updated);
    if (newStage !== oldStage) {
      updated.bodyParts = MonsterFactory.generateBodyParts(newStage, monster.isDumpster ? 0.6 : 0.4);
    }
    
    return { success: true, monster: updated, evolved: newStage !== oldStage, newStage };
  },
  
  getReviveCost: (monster) => CONFIG.ECONOMY.reviveBaseCost + (monster.level * CONFIG.ECONOMY.reviveLevelMultiplier),
  
  revive: (monster) => ({ ...monster, isDead: false }),
  
  kill: (monster) => ({ ...monster, isDead: true, battleStats: { ...monster.battleStats, deaths: (monster.battleStats?.deaths || 0) + 1 } }),
};

// ============================================================================
// MONSTER SPRITE - SVG-based rendering with anatomy
// ============================================================================
const MonsterSprite = ({ monster, size = 100, showEmoji = true, emotion = 'neutral', isInBattle = false, fighter = null }) => {
  const stage = MonsterFactory.getStage(monster);
  const scale = stage === 'BABY' ? 0.6 : stage === 'JUVENILE' ? 0.8 : 1;
  const actualSize = size * scale;
  
  const primary = monster.primaryColor || '#888';
  const secondary = monster.secondaryColor || Utils.generateSecondaryColor(primary);
  const tertiary = Utils.generateSecondaryColor(secondary);
  
  const bodyParts = monster.bodyParts || {};
  
  // Dead state
  if (monster.isDead) {
    return (
      <div className="relative flex items-center justify-center" style={{ width: actualSize, height: actualSize }}>
        <svg viewBox="0 0 100 100" style={{ width: actualSize, height: actualSize, opacity: 0.5, filter: 'grayscale(100%)' }}>
          <ellipse cx="50" cy="55" rx="35" ry="40" fill="#666" />
          <text x="50" y="60" textAnchor="middle" fontSize="30">💀</text>
        </svg>
      </div>
    );
  }
  
  // Dummy rendering
  if (monster.isDummy) {
    return (
      <div className="relative flex items-center justify-center" style={{ width: actualSize, height: actualSize }}>
        <svg viewBox="0 0 100 100" style={{ width: actualSize, height: actualSize }}>
          {/* Dummy body */}
          <ellipse cx="50" cy="60" rx="30" ry="35" fill="#666" stroke="#888" strokeWidth="2" />
          {/* Head */}
          <circle cx="50" cy="28" r="20" fill="#777" stroke="#999" strokeWidth="2" />
          {/* X eyes */}
          <g stroke="#333" strokeWidth="3" strokeLinecap="round">
            <line x1="38" y1="22" x2="46" y2="30" />
            <line x1="46" y1="22" x2="38" y2="30" />
            <line x1="54" y1="22" x2="62" y2="30" />
            <line x1="62" y1="22" x2="54" y2="30" />
          </g>
          {/* Target */}
          <circle cx="50" cy="60" r="12" fill="none" stroke="#f00" strokeWidth="2" />
          <circle cx="50" cy="60" r="6" fill="#f00" />
        </svg>
        <div className="absolute -bottom-1 bg-gray-600 px-2 py-0.5 rounded text-xs text-white">🎯</div>
      </div>
    );
  }
  
  // Get body shape based on stage and body type
  const getBodyShape = () => {
    const body = bodyParts.body || 'round';
    const isAngular = body.includes('angular') || body.includes('spiky') || body.includes('crystal');
    
    if (stage === 'BABY') {
      // Babies are round and cute
      if (isAngular) {
        return <polygon points="50,15 80,45 70,85 30,85 20,45" fill={primary} />;
      }
      return <ellipse cx="50" cy="55" rx="32" ry="38" fill={primary} />;
    }
    
    if (stage === 'JUVENILE') {
      if (isAngular) {
        return <polygon points="50,10 85,40 75,90 25,90 15,40" fill={primary} />;
      }
      return <ellipse cx="50" cy="55" rx="30" ry="42" fill={primary} />;
    }
    
    // Adult bodies - more variety
    switch (bodyParts.body) {
      case 'serpentine':
        return <path d="M30,80 Q20,60 30,40 Q40,20 50,25 Q60,20 70,40 Q80,60 70,80 Q50,95 30,80" fill={primary} />;
      case 'bulky':
        return <path d="M20,85 L20,40 Q20,20 40,20 L60,20 Q80,20 80,40 L80,85 Q50,95 20,85" fill={primary} />;
      case 'sleek':
        return <path d="M50,10 Q75,20 75,50 Q75,85 50,95 Q25,85 25,50 Q25,20 50,10" fill={primary} />;
      case 'hexapod':
      case 'arachnid':
        return <ellipse cx="50" cy="55" rx="38" ry="32" fill={primary} />;
      case 'floater':
        return <ellipse cx="50" cy="50" rx="35" ry="35" fill={primary} />;
      default:
        if (isAngular) {
          return <polygon points="50,8 88,35 80,90 20,90 12,35" fill={primary} />;
        }
        return <ellipse cx="50" cy="55" rx="32" ry="40" fill={primary} />;
    }
  };
  
  // Get head shape
  const getHeadShape = () => {
    const head = bodyParts.head || 'round';
    const headY = stage === 'BABY' ? 25 : 22;
    const headSize = stage === 'BABY' ? 22 : stage === 'JUVENILE' ? 20 : 18;
    
    switch (head) {
      case 'angular':
      case 'pointed':
      case 'triangle':
        return <polygon points={`50,${headY - headSize} ${50 + headSize},${headY + headSize * 0.8} ${50 - headSize},${headY + headSize * 0.8}`} fill={secondary} />;
      case 'square':
        return <rect x={50 - headSize} y={headY - headSize} width={headSize * 2} height={headSize * 2} rx="3" fill={secondary} />;
      case 'diamond':
        return <polygon points={`50,${headY - headSize} ${50 + headSize},${headY} 50,${headY + headSize} ${50 - headSize},${headY}`} fill={secondary} />;
      case 'star':
        return <polygon points="50,5 54,18 68,18 57,26 61,40 50,32 39,40 43,26 32,18 46,18" fill={secondary} />;
      case 'horned':
        return (
          <g>
            <circle cx="50" cy={headY} r={headSize} fill={secondary} />
            <polygon points={`${50 - headSize},${headY - 5} ${50 - headSize - 8},${headY - 20} ${50 - headSize + 5},${headY - 8}`} fill={tertiary} />
            <polygon points={`${50 + headSize},${headY - 5} ${50 + headSize + 8},${headY - 20} ${50 + headSize - 5},${headY - 8}`} fill={tertiary} />
          </g>
        );
      case 'crowned':
        return (
          <g>
            <circle cx="50" cy={headY} r={headSize} fill={secondary} />
            <polygon points="35,8 40,18 45,5 50,18 55,5 60,18 65,8 62,22 38,22" fill="#ffd700" />
          </g>
        );
      case 'skull':
        return (
          <g>
            <circle cx="50" cy={headY - 2} r={headSize - 2} fill={secondary} />
            <ellipse cx="50" cy={headY + headSize - 5} rx={headSize * 0.5} ry={headSize * 0.4} fill={secondary} />
          </g>
        );
      default: // round, oval, etc
        return <circle cx="50" cy={headY} r={headSize} fill={secondary} />;
    }
  };
  
  // Get eyes
  const getEyes = () => {
    const eyes = bodyParts.eyes || 'round';
    const eyeY = stage === 'BABY' ? 23 : 20;
    const eyeSize = stage === 'BABY' ? 7 : 5;
    const eyeGap = stage === 'BABY' ? 10 : 12;
    
    // Emotion affects eyes
    const isHurt = fighter?.state === 'hit';
    const isAttacking = fighter?.state === 'attacking';
    
    if (isHurt) {
      // X eyes when hurt
      return (
        <g stroke="#111" strokeWidth="2" strokeLinecap="round">
          <line x1={50 - eyeGap - 3} y1={eyeY - 3} x2={50 - eyeGap + 3} y2={eyeY + 3} />
          <line x1={50 - eyeGap + 3} y1={eyeY - 3} x2={50 - eyeGap - 3} y2={eyeY + 3} />
          <line x1={50 + eyeGap - 3} y1={eyeY - 3} x2={50 + eyeGap + 3} y2={eyeY + 3} />
          <line x1={50 + eyeGap + 3} y1={eyeY - 3} x2={50 + eyeGap - 3} y2={eyeY + 3} />
        </g>
      );
    }
    
    switch (eyes) {
      case 'cyclops':
        return (
          <g>
            <circle cx="50" cy={eyeY} r={eyeSize * 1.5} fill="#fff" />
            <circle cx="50" cy={eyeY + 1} r={eyeSize * 0.7} fill="#111" />
            <circle cx={50 + 2} cy={eyeY - 1} r={eyeSize * 0.3} fill="#fff" />
          </g>
        );
      case 'three':
        return (
          <g>
            <circle cx={50 - eyeGap} cy={eyeY} r={eyeSize * 0.8} fill="#fff" />
            <circle cx="50" cy={eyeY - 6} r={eyeSize} fill="#fff" />
            <circle cx={50 + eyeGap} cy={eyeY} r={eyeSize * 0.8} fill="#fff" />
            <circle cx={50 - eyeGap} cy={eyeY + 1} r={eyeSize * 0.4} fill="#111" />
            <circle cx="50" cy={eyeY - 5} r={eyeSize * 0.5} fill="#111" />
            <circle cx={50 + eyeGap} cy={eyeY + 1} r={eyeSize * 0.4} fill="#111" />
          </g>
        );
      case 'four':
        return (
          <g>
            <circle cx={50 - eyeGap} cy={eyeY - 4} r={eyeSize * 0.7} fill="#fff" />
            <circle cx={50 + eyeGap} cy={eyeY - 4} r={eyeSize * 0.7} fill="#fff" />
            <circle cx={50 - eyeGap} cy={eyeY + 4} r={eyeSize * 0.7} fill="#fff" />
            <circle cx={50 + eyeGap} cy={eyeY + 4} r={eyeSize * 0.7} fill="#fff" />
            <circle cx={50 - eyeGap} cy={eyeY - 3} r={eyeSize * 0.3} fill="#111" />
            <circle cx={50 + eyeGap} cy={eyeY - 3} r={eyeSize * 0.3} fill="#111" />
            <circle cx={50 - eyeGap} cy={eyeY + 5} r={eyeSize * 0.3} fill="#111" />
            <circle cx={50 + eyeGap} cy={eyeY + 5} r={eyeSize * 0.3} fill="#111" />
          </g>
        );
      case 'angry':
        return (
          <g>
            <ellipse cx={50 - eyeGap} cy={eyeY} rx={eyeSize} ry={eyeSize * 0.7} fill="#fff" />
            <ellipse cx={50 + eyeGap} cy={eyeY} rx={eyeSize} ry={eyeSize * 0.7} fill="#fff" />
            <circle cx={50 - eyeGap} cy={eyeY + 1} r={eyeSize * 0.4} fill="#111" />
            <circle cx={50 + eyeGap} cy={eyeY + 1} r={eyeSize * 0.4} fill="#111" />
            {/* Angry eyebrows */}
            <line x1={50 - eyeGap - 5} y1={eyeY - 6} x2={50 - eyeGap + 3} y2={eyeY - 4} stroke="#111" strokeWidth="2" strokeLinecap="round" />
            <line x1={50 + eyeGap + 5} y1={eyeY - 6} x2={50 + eyeGap - 3} y2={eyeY - 4} stroke="#111" strokeWidth="2" strokeLinecap="round" />
          </g>
        );
      case 'cute':
        // Big shiny eyes
        return (
          <g>
            <circle cx={50 - eyeGap} cy={eyeY} r={eyeSize * 1.3} fill="#111" />
            <circle cx={50 + eyeGap} cy={eyeY} r={eyeSize * 1.3} fill="#111" />
            <circle cx={50 - eyeGap + 2} cy={eyeY - 2} r={eyeSize * 0.5} fill="#fff" />
            <circle cx={50 + eyeGap + 2} cy={eyeY - 2} r={eyeSize * 0.5} fill="#fff" />
            <circle cx={50 - eyeGap - 1} cy={eyeY + 2} r={eyeSize * 0.25} fill="#fff" opacity="0.5" />
            <circle cx={50 + eyeGap - 1} cy={eyeY + 2} r={eyeSize * 0.25} fill="#fff" opacity="0.5" />
          </g>
        );
      case 'sleepy':
        return (
          <g>
            <path d={`M${50 - eyeGap - 4},${eyeY} Q${50 - eyeGap},${eyeY + 4} ${50 - eyeGap + 4},${eyeY}`} stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d={`M${50 + eyeGap - 4},${eyeY} Q${50 + eyeGap},${eyeY + 4} ${50 + eyeGap + 4},${eyeY}`} stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        );
      case 'glowing':
        return (
          <g>
            <circle cx={50 - eyeGap} cy={eyeY} r={eyeSize} fill={primary} filter="url(#glow)" />
            <circle cx={50 + eyeGap} cy={eyeY} r={eyeSize} fill={primary} filter="url(#glow)" />
            <circle cx={50 - eyeGap} cy={eyeY} r={eyeSize * 0.4} fill="#fff" />
            <circle cx={50 + eyeGap} cy={eyeY} r={eyeSize * 0.4} fill="#fff" />
          </g>
        );
      case 'none':
        return null;
      default: // round, tiny
        return (
          <g>
            <circle cx={50 - eyeGap} cy={eyeY} r={eyeSize} fill="#fff" />
            <circle cx={50 + eyeGap} cy={eyeY} r={eyeSize} fill="#fff" />
            <circle cx={50 - eyeGap + 1} cy={eyeY + 1} r={eyeSize * 0.5} fill="#111" />
            <circle cx={50 + eyeGap + 1} cy={eyeY + 1} r={eyeSize * 0.5} fill="#111" />
          </g>
        );
    }
  };
  
  // Get appendages
  const getAppendages = () => {
    const app = bodyParts.appendages || 'none';
    if (app === 'none' || app === 'nubs') return null;
    
    switch (app) {
      case 'arms':
      case 'tiny_arms':
        return (
          <g fill={secondary}>
            <ellipse cx="18" cy="55" rx="8" ry="15" />
            <ellipse cx="82" cy="55" rx="8" ry="15" />
          </g>
        );
      case 'claws':
        return (
          <g fill={secondary}>
            <path d="M15,50 L5,40 L8,50 L2,55 L10,55 L15,65 Z" />
            <path d="M85,50 L95,40 L92,50 L98,55 L90,55 L85,65 Z" />
          </g>
        );
      case 'wings':
      case 'wings_small':
        return (
          <g fill={tertiary} opacity="0.8">
            <path d="M20,40 Q0,30 5,50 Q0,70 20,60 Z" />
            <path d="M80,40 Q100,30 95,50 Q100,70 80,60 Z" />
          </g>
        );
      case 'fins':
      case 'tiny_fins':
        return (
          <g fill={tertiary}>
            <path d="M18,45 L5,35 L10,55 Z" />
            <path d="M82,45 L95,35 L90,55 Z" />
          </g>
        );
      case 'tentacles':
        return (
          <g stroke={secondary} strokeWidth="4" fill="none" strokeLinecap="round">
            <path d="M20,60 Q10,70 15,85 Q20,95 25,90" />
            <path d="M80,60 Q90,70 85,85 Q80,95 75,90" />
          </g>
        );
      default:
        return null;
    }
  };
  
  // Get tail
  const getTail = () => {
    const tail = bodyParts.tail || 'none';
    if (tail === 'none' || tail === 'nub') return null;
    
    switch (tail) {
      case 'long':
      case 'short':
        return <path d="M50,90 Q60,100 70,95 Q80,90 75,85" stroke={secondary} strokeWidth="6" fill="none" strokeLinecap="round" />;
      case 'fluffy':
        return (
          <g fill={secondary}>
            <circle cx="65" cy="92" r="8" />
            <circle cx="72" cy="88" r="6" />
          </g>
        );
      case 'pointed':
      case 'spiked':
        return <polygon points="50,88 70,95 75,85 80,92 72,80" fill={tertiary} />;
      case 'flame':
        return (
          <g fill="#ff6600">
            <ellipse cx="68" cy="88" rx="8" ry="12" />
            <ellipse cx="72" cy="85" rx="5" ry="8" fill="#ffaa00" />
          </g>
        );
      default:
        return null;
    }
  };
  
  // Get decorations (horns, spikes, etc on body)
  const getDecorations = () => {
    const dec = bodyParts.decoration || 'none';
    if (dec === 'none') return null;
    
    switch (dec) {
      case 'spikes':
        return (
          <g fill={tertiary}>
            <polygon points="30,35 25,20 35,30" />
            <polygon points="50,30 50,12 55,28" />
            <polygon points="70,35 75,20 65,30" />
          </g>
        );
      case 'crystals':
        return (
          <g fill={primary} opacity="0.7">
            <polygon points="25,40 20,25 30,35" />
            <polygon points="75,40 80,25 70,35" />
            <polygon points="50,35 47,18 53,18" />
          </g>
        );
      case 'mane':
        return (
          <g fill={tertiary}>
            <ellipse cx="30" cy="35" rx="10" ry="15" />
            <ellipse cx="50" cy="30" rx="12" ry="18" />
            <ellipse cx="70" cy="35" rx="10" ry="15" />
          </g>
        );
      case 'halo':
        return <ellipse cx="50" cy="5" rx="18" ry="5" fill="none" stroke="#ffd700" strokeWidth="2" />;
      default:
        return null;
    }
  };
  
  // Animation class based on state
  const getAnimationClass = () => {
    if (fighter?.state === 'attacking') return 'animate-pulse';
    if (fighter?.state === 'dodging') return 'animate-bounce';
    if (fighter?.state === 'hit') return '';
    return '';
  };
  
  return (
    <div className={`relative flex items-center justify-center ${getAnimationClass()}`} style={{ width: actualSize, height: actualSize }}>
      <svg viewBox="0 0 100 100" style={{ width: actualSize, height: actualSize }}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id={`bodyGrad-${monster.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={secondary} />
            <stop offset="50%" stopColor={primary} />
            <stop offset="100%" stopColor={secondary} />
          </linearGradient>
        </defs>
        
        {/* Decorations (behind body) */}
        {getDecorations()}
        
        {/* Tail */}
        {getTail()}
        
        {/* Body */}
        <g style={{ fill: `url(#bodyGrad-${monster.id})` }}>
          {getBodyShape()}
        </g>
        
        {/* Appendages */}
        {getAppendages()}
        
        {/* Head */}
        {getHeadShape()}
        
        {/* Eyes */}
        {getEyes()}
        
        {/* Mouth (simple) */}
        {stage === 'BABY' ? (
          <ellipse cx="50" cy="32" rx="4" ry="2" fill="#111" />
        ) : (
          <path d="M45,30 Q50,34 55,30" stroke="#111" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        )}
      </svg>
      
      {/* Stage badge */}
      <div 
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-white font-bold"
        style={{ 
          background: stage === 'BABY' ? '#ec4899' : stage === 'JUVENILE' ? '#8b5cf6' : '#22c55e',
          fontSize: Math.max(8, actualSize * 0.12),
        }}
      >
        {stage === 'BABY' ? '👶' : stage === 'JUVENILE' ? '🧒' : '👤'}
      </div>
      
      {/* Emoji reaction */}
      {showEmoji && fighter?.triggerEmoji && (
        <div className="absolute -top-3 -right-1 text-xl animate-bounce">
          {fighter.triggerEmoji}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// BATTLE ENGINE - Full mechanics with AI, dodge, heal orbs, knockback
// ============================================================================
const BattleEngine = {
  createFighter: (monster, x, y, facing = 1) => {
    const stats = MonsterFactory.getEffectiveStats(monster);
    const health = 150 + stats.constitution * 10;
    return {
      monster, stats, x, y, health, maxHealth: health,
      vx: 0, vy: 0, lastAttack: 0, lastDodge: 0, dodgeEndTime: 0,
      state: 'idle', stateEndTime: 0, facing, isEliminated: false,
      triggerEmoji: null, emojiUntil: 0,
    };
  },
  
  createBattleState: (playerMonster, enemies, isTraining = false) => {
    const allMonsters = [playerMonster, ...enemies];
    const margin = 50;
    const positions = [
      { x: margin, y: CONFIG.BATTLE.arenaHeight - margin, facing: 1 },
      { x: CONFIG.BATTLE.arenaWidth - margin, y: margin, facing: -1 },
      { x: CONFIG.BATTLE.arenaWidth - margin, y: CONFIG.BATTLE.arenaHeight - margin, facing: -1 },
      { x: margin, y: margin, facing: 1 },
    ];
    
    return {
      isTraining,
      fighters: allMonsters.map((m, i) => BattleEngine.createFighter(m, positions[i].x, positions[i].y, positions[i].facing)),
      projectiles: [],
      effects: [],
      healOrbs: [],
      winner: null,
      tick: 0,
    };
  },
  
  calculateDamage: (attacker, defender, isMagic) => {
    const base = isMagic 
      ? attacker.stats.power * CONFIG.STAT_EFFECTS.powerMagicDamageMultiplier
      : attacker.stats.strength * CONFIG.STAT_EFFECTS.strengthDamageMultiplier;
    const def = defender.stats.constitution * CONFIG.STAT_EFFECTS.constitutionDefenseMultiplier;
    const reduction = def / (def + 20);
    return Math.max(1, Math.round(base * 8 * (1 - reduction * 0.8)));
  },
  
  // Intelligence-based AI decision making
  makeDecision: (fighter, enemy, tick, projectiles, healOrbs = []) => {
    const distance = Utils.distance(fighter.x, fighter.y, enemy.x, enemy.y);
    const now = tick * CONFIG.BATTLE.tickRate;
    const { intelligence, strength, power, agility } = fighter.stats;
    
    // Intelligence scaling (no cap)
    const smartness = intelligence / (intelligence + 15);
    const randomChance = Math.max(0.02, 0.6 * (1 - smartness));
    
    // Combat style
    const isMelee = strength > power * 1.2;
    const isRanged = power > strength * 1.2;
    
    // Health awareness
    const healthPercent = fighter.health / fighter.maxHealth;
    const isLowHealth = healthPercent < 0.25;
    
    // Wall awareness
    const margin = CONFIG.BATTLE.monsterRadius + 30;
    const arenaW = CONFIG.BATTLE.arenaWidth;
    const arenaH = CONFIG.BATTLE.arenaHeight;
    const nearWall = fighter.x < margin || fighter.x > arenaW - margin || 
                     fighter.y < margin || fighter.y > arenaH - margin;
    const inCorner = (fighter.x < margin || fighter.x > arenaW - margin) && 
                     (fighter.y < margin || fighter.y > arenaH - margin);
    
    // Cooldowns
    const agilityBonus = 1 - (agility * CONFIG.STAT_EFFECTS.agilityAttackSpeedMultiplier);
    const effectiveCooldown = CONFIG.BATTLE.attackCooldown * Math.max(0.15, agilityBonus);
    const canAttack = now - fighter.lastAttack > effectiveCooldown;
    const canDodge = now - fighter.lastDodge > CONFIG.BATTLE.dodgeCooldown;
    
    // PRIORITY 1: Escape corner
    if (inCorner && smartness > 0.3 && Math.random() < smartness) {
      const escapeAngle = Math.atan2(arenaH/2 - fighter.y, arenaW/2 - fighter.x);
      if (canDodge && smartness > 0.6) {
        return { action: 'dodge', escapeAngle };
      }
      return { action: 'escape', escapeAngle };
    }
    
    // PRIORITY 2: Seek heal orbs when low health
    if (healOrbs.length > 0 && healthPercent < (0.3 + smartness * 0.3)) {
      const healAwareness = smartness * 0.8 + (isLowHealth ? 0.3 : 0);
      if (Math.random() < healAwareness) {
        let bestOrb = null, bestScore = -Infinity;
        healOrbs.forEach(orb => {
          const orbDist = Utils.distance(fighter.x, fighter.y, orb.x, orb.y);
          const enemyDist = Utils.distance(enemy.x, enemy.y, orb.x, orb.y);
          const score = (200 - orbDist) + (smartness * enemyDist * 0.5);
          if (score > bestScore && orbDist < 180) { bestScore = score; bestOrb = orb; }
        });
        if (bestOrb) return { action: 'seekHeal', target: bestOrb };
      }
    }
    
    // PRIORITY 3: Dodge incoming projectiles
    const incoming = projectiles.filter(p => 
      p.shooterId !== fighter.monster.id && Utils.distance(p.x, p.y, fighter.x, fighter.y) < 100
    );
    if (canDodge && incoming.length > 0 && Math.random() < smartness * 0.9) {
      const proj = incoming[0];
      const projAngle = Math.atan2(proj.vy, proj.vx);
      const dodgeAngle = projAngle + (Math.PI / 2) * (Math.random() > 0.5 ? 1 : -1);
      return { action: 'dodge', dodgeAngle };
    }
    
    // PRIORITY 4: Dodge melee attacks
    if (canDodge && enemy.state === 'attacking' && distance < CONFIG.BATTLE.attackRange * 1.5) {
      if (Math.random() < smartness * 0.7) {
        return { action: 'dodge' };
      }
    }
    
    // Random action for dumb monsters
    if (Math.random() < randomChance) {
      const actions = ['approach', 'circle', 'retreat', 'wander'];
      return { action: actions[Math.floor(Math.random() * actions.length)], direction: Math.random() > 0.5 ? 1 : -1 };
    }
    
    // MELEE COMBAT
    if (isMelee) {
      if (canAttack && distance < CONFIG.BATTLE.attackRange * 1.1) {
        return { action: 'attack', useMagic: false };
      }
      if (distance > CONFIG.BATTLE.attackRange * 0.8) {
        return { action: 'charge' };
      }
      return { action: 'circle', direction: Math.random() > 0.5 ? 1 : -1 };
    }
    
    // RANGED COMBAT
    if (isRanged) {
      const minSafe = CONFIG.BATTLE.attackRange * 2;
      if (distance < minSafe) {
        return { action: 'kite' };
      }
      if (canAttack && distance < CONFIG.BATTLE.projectileRange) {
        return { action: 'attack', useMagic: true };
      }
      if (distance > CONFIG.BATTLE.projectileRange * 0.85) {
        return { action: 'approach' };
      }
      return { action: 'circle', direction: Math.random() > 0.5 ? 1 : -1 };
    }
    
    // BALANCED
    if (canAttack) {
      if (distance < CONFIG.BATTLE.attackRange * 1.1) return { action: 'attack', useMagic: false };
      if (distance < CONFIG.BATTLE.projectileRange) return { action: 'attack', useMagic: true };
    }
    return { action: 'approach' };
  },
  
  processTick: (state) => {
    if (state.winner) return state;
    
    const newState = { 
      ...state, 
      tick: state.tick + 1,
      projectiles: [...state.projectiles],
      effects: state.effects.filter(e => Date.now() - e.createdAt < e.duration),
      fighters: state.fighters.map(f => ({ ...f })),
      healOrbs: [...(state.healOrbs || [])],
    };
    
    const now = newState.tick * CONFIG.BATTLE.tickRate;
    const active = newState.fighters.filter(f => !f.isEliminated && f.health > 0);
    
    if (active.length <= 1) {
      newState.winner = active[0]?.monster || null;
      return newState;
    }
    
    // Spawn heal orbs
    if (Math.random() < 0.003 && newState.healOrbs.length < 3) {
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
      if (Date.now() - orb.createdAt > 10000) return false;
      for (const fighter of active) {
        if (Utils.distance(fighter.x, fighter.y, orb.x, orb.y) < CONFIG.BATTLE.monsterRadius + 12) {
          fighter.health = Math.min(fighter.maxHealth, fighter.health + 25);
          newState.effects.push({ id: Utils.generateId(), type: 'heal', x: fighter.x, y: fighter.y, color: '#00ff00', createdAt: Date.now(), duration: 500 });
          fighter.triggerEmoji = '💚';
          fighter.emojiUntil = now + 800;
          return false;
        }
      }
      return true;
    });
    
    // Update state timers and clear expired emojis
    newState.fighters.forEach(f => {
      if (f.stateEndTime && now > f.stateEndTime) { f.state = 'idle'; f.stateEndTime = 0; }
      if (f.dodgeEndTime && now > f.dodgeEndTime) { f.dodgeEndTime = 0; }
      // Clear expired emojis
      if (f.triggerEmoji && f.emojiUntil && now > f.emojiUntil) { 
        f.triggerEmoji = null; 
        f.emojiUntil = 0; 
      }
    });
    
    // Process fighters
    active.forEach(fighter => {
      if (fighter.state === 'hit' || fighter.isEliminated) return;
      
      // Find closest enemy
      let closest = null, closestDist = Infinity;
      active.forEach(other => {
        if (other.monster.id !== fighter.monster.id) {
          const d = Utils.distance(fighter.x, fighter.y, other.x, other.y);
          if (d < closestDist) { closestDist = d; closest = other; }
        }
      });
      if (!closest) return;
      
      const decision = BattleEngine.makeDecision(fighter, closest, newState.tick, newState.projectiles, newState.healOrbs);
      const speed = CONFIG.BATTLE.moveSpeed + fighter.stats.agility * CONFIG.STAT_EFFECTS.agilitySpeedMultiplier;
      
      switch (decision.action) {
        case 'attack': {
          fighter.state = 'attacking';
          fighter.stateEndTime = now + 300;
          fighter.lastAttack = now;
          fighter.facing = closest.x > fighter.x ? 1 : -1;
          const angle = Math.atan2(closest.y - fighter.y, closest.x - fighter.x);
          
          if (decision.useMagic) {
            newState.projectiles.push({
              id: Utils.generateId(),
              x: fighter.x + Math.cos(angle) * 20,
              y: fighter.y + Math.sin(angle) * 20,
              vx: Math.cos(angle) * CONFIG.BATTLE.projectileSpeed,
              vy: Math.sin(angle) * CONFIG.BATTLE.projectileSpeed,
              shooterId: fighter.monster.id,
              color: fighter.monster.primaryColor,
              size: CONFIG.BATTLE.projectileSize,
              createdAt: Date.now(),
            });
            newState.effects.push({ id: Utils.generateId(), type: 'magic', x: fighter.x, y: fighter.y, color: fighter.monster.primaryColor, createdAt: Date.now(), duration: 200 });
          } else {
            // Melee
            if (closestDist < CONFIG.BATTLE.attackRange * 1.3) {
              if (closest.dodgeEndTime && now < closest.dodgeEndTime) {
                newState.effects.push({ id: Utils.generateId(), type: 'miss', x: closest.x, y: closest.y, color: '#888', createdAt: Date.now(), duration: 300 });
              } else {
                const damage = BattleEngine.calculateDamage(fighter, closest, false);
                closest.health -= damage;
                closest.state = 'hit';
                closest.stateEndTime = now + 200;
                
                // Knockback
                const knockback = Math.max(3, (6 + fighter.stats.strength / 2.5) * (1 - closest.stats.constitution / (closest.stats.constitution + 25) * 0.8));
                closest.vx = Math.cos(angle) * knockback;
                closest.vy = Math.sin(angle) * knockback;
                
                newState.effects.push({ id: Utils.generateId(), type: 'hit', x: closest.x, y: closest.y, color: '#ff4444', createdAt: Date.now(), duration: 300 });
                
                if (Math.random() < 0.25) { fighter.triggerEmoji = '💪'; fighter.emojiUntil = now + 600; }
                if (Math.random() < 0.25) { closest.triggerEmoji = '😣'; closest.emojiUntil = now + 600; }
                
                fighter.x += Math.cos(angle) * 8;
                fighter.y += Math.sin(angle) * 8;
              }
            }
          }
          break;
        }
        
        case 'dodge': {
          if (now - fighter.lastDodge > CONFIG.BATTLE.dodgeCooldown) {
            fighter.state = 'dodging';
            fighter.lastDodge = now;
            const agilityBonus = fighter.stats.agility / 15;
            fighter.dodgeEndTime = now + CONFIG.BATTLE.dodgeDuration * (1 + agilityBonus * 0.3);
            fighter.stateEndTime = now + 400;
            
            let dodgeAngle = decision.escapeAngle || decision.dodgeAngle || 
              Math.atan2(fighter.y - closest.y, fighter.x - closest.x) + (Math.PI / 2) * (Math.random() > 0.5 ? 1 : -1);
            
            const dodgeSpeed = speed * (3 + agilityBonus * 1.5);
            fighter.vx = Math.cos(dodgeAngle) * dodgeSpeed;
            fighter.vy = Math.sin(dodgeAngle) * dodgeSpeed;
            newState.effects.push({ id: Utils.generateId(), type: 'dodge', x: fighter.x, y: fighter.y, color: '#88ffff', createdAt: Date.now(), duration: 300 });
          }
          break;
        }
        
        case 'escape': {
          fighter.state = 'moving';
          const angle = decision.escapeAngle || Math.atan2(CONFIG.BATTLE.arenaHeight/2 - fighter.y, CONFIG.BATTLE.arenaWidth/2 - fighter.x);
          fighter.vx += Math.cos(angle) * speed * 0.4;
          fighter.vy += Math.sin(angle) * speed * 0.4;
          break;
        }
        
        case 'seekHeal': {
          if (decision.target) {
            fighter.state = 'moving';
            const dx = decision.target.x - fighter.x;
            const dy = decision.target.y - fighter.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            fighter.vx += (dx / dist) * speed * 0.5;
            fighter.vy += (dy / dist) * speed * 0.5;
          }
          break;
        }
        
        case 'charge': {
          fighter.state = 'charging';
          const dx = closest.x - fighter.x;
          const dy = closest.y - fighter.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          fighter.vx += (dx / dist) * speed * 0.5;
          fighter.vy += (dy / dist) * speed * 0.5;
          fighter.facing = dx > 0 ? 1 : -1;
          break;
        }
        
        case 'approach': {
          fighter.state = 'moving';
          const dx = closest.x - fighter.x;
          const dy = closest.y - fighter.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          fighter.vx += (dx / dist) * speed * 0.3;
          fighter.vy += (dy / dist) * speed * 0.3;
          fighter.facing = dx > 0 ? 1 : -1;
          break;
        }
        
        case 'circle': {
          fighter.state = 'moving';
          const circleAngle = Math.atan2(closest.y - fighter.y, closest.x - fighter.x) + (Math.PI / 2) * (decision.direction || 1);
          fighter.vx += Math.cos(circleAngle) * speed * 0.3;
          fighter.vy += Math.sin(circleAngle) * speed * 0.3;
          fighter.facing = closest.x > fighter.x ? 1 : -1;
          break;
        }
        
        case 'kite': {
          fighter.state = 'kiting';
          const kiteAngle = Math.atan2(fighter.y - closest.y, fighter.x - closest.x);
          fighter.vx += Math.cos(kiteAngle) * speed * 0.35;
          fighter.vy += Math.sin(kiteAngle) * speed * 0.35;
          fighter.facing = closest.x > fighter.x ? 1 : -1;
          break;
        }
        
        case 'retreat': {
          fighter.state = 'moving';
          const retreatAngle = Math.atan2(fighter.y - closest.y, fighter.x - closest.x);
          fighter.vx += Math.cos(retreatAngle) * speed * 0.4;
          fighter.vy += Math.sin(retreatAngle) * speed * 0.4;
          break;
        }
        
        case 'wander': {
          fighter.state = 'moving';
          const wanderAngle = Math.random() * Math.PI * 2;
          fighter.vx += Math.cos(wanderAngle) * speed * 0.15;
          fighter.vy += Math.sin(wanderAngle) * speed * 0.15;
          break;
        }
      }
      
      // Edge awareness - smart monsters steer away from walls
      const intelligence = fighter.stats.intelligence || 10;
      const edgeAwareness = intelligence / (intelligence + 15);
      const edgeMargin = 30 + (edgeAwareness * 70);
      const edgeForce = 0.2 + (edgeAwareness * 0.8);
      
      const r = CONFIG.BATTLE.monsterRadius;
      const arenaW = CONFIG.BATTLE.arenaWidth;
      const arenaH = CONFIG.BATTLE.arenaHeight;
      
      const distFromLeft = fighter.x - r;
      const distFromRight = arenaW - r - fighter.x;
      const distFromTop = fighter.y - r;
      const distFromBottom = arenaH - r - fighter.y;
      
      if (distFromLeft < edgeMargin && distFromLeft > 0) {
        fighter.vx += edgeForce * (1 - distFromLeft / edgeMargin) * (1 + edgeAwareness);
      }
      if (distFromRight < edgeMargin && distFromRight > 0) {
        fighter.vx -= edgeForce * (1 - distFromRight / edgeMargin) * (1 + edgeAwareness);
      }
      if (distFromTop < edgeMargin && distFromTop > 0) {
        fighter.vy += edgeForce * (1 - distFromTop / edgeMargin) * (1 + edgeAwareness);
      }
      if (distFromBottom < edgeMargin && distFromBottom > 0) {
        fighter.vy -= edgeForce * (1 - distFromBottom / edgeMargin) * (1 + edgeAwareness);
      }
      
      // Dumb monsters drift randomly
      if (edgeAwareness < 0.4 && Math.random() < 0.02) {
        fighter.vx += (Math.random() - 0.5) * 0.5;
        fighter.vy += (Math.random() - 0.5) * 0.5;
      }
    });
    
    // Apply physics
    active.forEach(fighter => {
      fighter.x += fighter.vx;
      fighter.y += fighter.vy;
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
    
    // Monster-to-monster collision
    for (let i = 0; i < active.length; i++) {
      for (let j = i + 1; j < active.length; j++) {
        const f1 = active[i], f2 = active[j];
        const dx = f2.x - f1.x;
        const dy = f2.y - f1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = CONFIG.BATTLE.monsterRadius * 2;
        
        if (dist < minDist && dist > 0) {
          const overlap = (minDist - dist) / 2;
          const nx = dx / dist;
          const ny = dy / dist;
          
          f1.x -= nx * overlap;
          f1.y -= ny * overlap;
          f2.x += nx * overlap;
          f2.y += ny * overlap;
          
          f1.vx -= nx * 1.5;
          f1.vy -= ny * 1.5;
          f2.vx += nx * 1.5;
          f2.vy += ny * 1.5;
        }
      }
    }
    
    // Wall collision with bounce
    newState.fighters.forEach(fighter => {
      if (fighter.isEliminated) return;
      
      const r = CONFIG.BATTLE.monsterRadius;
      const bounceForce = 0.6;
      const intelligence = fighter.stats.intelligence || 10;
      const smartBounce = intelligence / (intelligence + 30) * 0.5;
      
      if (fighter.x < r) {
        fighter.x = r;
        fighter.vx = Math.abs(fighter.vx) * (bounceForce + smartBounce);
        if (intelligence < 15 && Math.random() < 0.3) fighter.vx *= 0.5;
      }
      if (fighter.x > CONFIG.BATTLE.arenaWidth - r) {
        fighter.x = CONFIG.BATTLE.arenaWidth - r;
        fighter.vx = -Math.abs(fighter.vx) * (bounceForce + smartBounce);
        if (intelligence < 15 && Math.random() < 0.3) fighter.vx *= 0.5;
      }
      if (fighter.y < r) {
        fighter.y = r;
        fighter.vy = Math.abs(fighter.vy) * (bounceForce + smartBounce);
        if (intelligence < 15 && Math.random() < 0.3) fighter.vy *= 0.5;
      }
      if (fighter.y > CONFIG.BATTLE.arenaHeight - r) {
        fighter.y = CONFIG.BATTLE.arenaHeight - r;
        fighter.vy = -Math.abs(fighter.vy) * (bounceForce + smartBounce);
        if (intelligence < 15 && Math.random() < 0.3) fighter.vy *= 0.5;
      }
    });
    
    // Process projectiles
    newState.projectiles = newState.projectiles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      
      if (p.x < 0 || p.x > CONFIG.BATTLE.arenaWidth || p.y < 0 || p.y > CONFIG.BATTLE.arenaHeight) return false;
      if (Date.now() - p.createdAt > 3000) return false;
      
      for (const target of newState.fighters) {
        if (target.monster.id === p.shooterId || target.isEliminated) continue;
        if (Utils.distance(p.x, p.y, target.x, target.y) < CONFIG.BATTLE.monsterRadius + (p.size || CONFIG.BATTLE.projectileSize)) {
          // Check dodge
          if (target.dodgeEndTime && now < target.dodgeEndTime) {
            newState.effects.push({ id: Utils.generateId(), type: 'dodge', x: p.x, y: p.y, color: '#00ff88', createdAt: Date.now(), duration: 400 });
            if (Math.random() < 0.3) { target.triggerEmoji = '😏'; target.emojiUntil = now + 800; }
          } else {
            const shooter = newState.fighters.find(f => f.monster.id === p.shooterId);
            if (shooter) {
              const damage = BattleEngine.calculateDamage(shooter, target, true);
              target.health -= damage;
              target.state = 'hit';
              target.stateEndTime = now + 200;
              
              // Magic knockback
              const knockback = Math.max(2, (6 + shooter.stats.power / 3) * (1 - target.stats.constitution / (target.stats.constitution + 20) * 0.8));
              const knockAngle = Math.atan2(target.y - p.y, target.x - p.x);
              target.vx += Math.cos(knockAngle) * knockback;
              target.vy += Math.sin(knockAngle) * knockback;
              
              newState.effects.push({ id: Utils.generateId(), type: 'hit', x: target.x, y: target.y, color: '#ff4444', createdAt: Date.now(), duration: 300 });
              if (Math.random() < 0.25) { target.triggerEmoji = '😵'; target.emojiUntil = now + 600; }
            }
          }
          return false;
        }
      }
      return true;
    });
    
    // Check deaths
    newState.fighters.forEach(f => {
      if (f.health <= 0 && !f.isEliminated) {
        f.isEliminated = true;
        newState.effects.push({ id: Utils.generateId(), type: 'death', x: f.x, y: f.y, color: '#ff0000', createdAt: Date.now(), duration: 1000 });
      }
    });
    
    return newState;
  },
};

// ============================================================================
// BATTLE ARENA
// ============================================================================
const BattleArena = ({ battleState, onEnd }) => {
  if (!battleState) return null;
  const now = battleState.tick * CONFIG.BATTLE.tickRate;
  
  return (
    <div className="flex flex-col items-center">
      {/* Health bars */}
      <div className="w-full max-w-md mb-2 px-2 space-y-1">
        {battleState.fighters.map((f, i) => (
          <div key={f.monster.id} className={f.isEliminated ? 'opacity-40' : ''}>
            <div className="flex justify-between text-xs">
              <span className={i === 0 ? 'text-green-400' : 'text-red-400'}>
                {f.monster.isDummy ? '🎯 Dummy' : f.monster.name}
              </span>
              <span className="text-gray-400">{Math.max(0, Math.round(f.health))}</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all"
                style={{ 
                  width: `${Math.max(0, (f.health / f.maxHealth) * 100)}%`,
                  background: i === 0 ? '#22c55e' : '#ef4444',
                }}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Arena */}
      <div 
        className="relative rounded-2xl overflow-hidden"
        style={{ 
          width: CONFIG.BATTLE.arenaWidth,
          height: CONFIG.BATTLE.arenaHeight,
          background: 'linear-gradient(180deg, #1a0a0a 0%, #1a1a2e 50%, #0a1a0a 100%)',
          border: '4px solid #444',
          boxShadow: 'inset 0 0 30px rgba(255,100,100,0.2), inset 0 0 60px rgba(100,100,255,0.1)',
        }}
      >
        {/* Arena edge glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          boxShadow: 'inset 0 0 20px rgba(255,50,50,0.3), inset 0 0 40px rgba(255,50,50,0.1)',
        }} />
        
        {/* Corner danger zones */}
        <div className="absolute top-0 left-0 w-16 h-16 bg-red-500/10 rounded-br-full" />
        <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-red-500/10 rounded-tr-full" />
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-red-500/10 rounded-tl-full" />
        
        {/* Grid */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        
        {/* Heal Orbs */}
        {(battleState.healOrbs || []).map(orb => (
          <div
            key={orb.id}
            className="absolute rounded-full animate-pulse"
            style={{
              left: orb.x - 12, top: orb.y - 12,
              width: 24, height: 24,
              background: 'radial-gradient(circle, #00ff00 0%, #00aa00 70%, #006600 100%)',
              boxShadow: '0 0 15px #00ff00',
            }}
          >
            <span className="absolute inset-0 flex items-center justify-center text-xs">💚</span>
          </div>
        ))}
        
        {/* Fighters */}
        {battleState.fighters.filter(f => !f.isEliminated).map((f, i) => (
          <div
            key={f.monster.id}
            className="absolute transition-all duration-75"
            style={{ left: f.x - 35, top: f.y - 35, transform: `scaleX(${f.facing})` }}
          >
            <MonsterSprite monster={f.monster} size={70} showEmoji={true} isInBattle={true} fighter={f} />
            
            {/* Emoji reaction */}
            {f.triggerEmoji && f.emojiUntil > now && (
              <div 
                className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl animate-bounce"
                style={{ transform: `scaleX(${f.facing})` }}
              >
                {f.triggerEmoji}
              </div>
            )}
            
            {/* Dodge effect */}
            {f.state === 'dodging' && (
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-50" />
            )}
          </div>
        ))}
        
        {/* Projectiles */}
        {battleState.projectiles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: p.x - (p.size || 6), top: p.y - (p.size || 6),
              width: (p.size || 6) * 2, height: (p.size || 6) * 2,
              background: `radial-gradient(circle, ${p.color}, ${p.color}88)`,
              boxShadow: `0 0 10px ${p.color}`,
            }}
          />
        ))}
        
        {/* Effects */}
        {battleState.effects.map(e => {
          const age = Date.now() - e.createdAt;
          const progress = age / e.duration;
          return (
            <div
              key={e.id}
              className="absolute rounded-full"
              style={{
                left: e.x - 15 * (1 + progress), top: e.y - 15 * (1 + progress),
                width: 30 * (1 + progress), height: 30 * (1 + progress),
                background: e.color || '#ff4444',
                opacity: 1 - progress,
              }}
            />
          );
        })}
        
        {/* Winner */}
        {battleState.winner && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
            <div className="text-center">
              <div className="text-5xl mb-3 animate-bounce">🏆</div>
              <div className="text-2xl font-bold text-white mb-1">{battleState.winner.name}</div>
              <div className="text-gray-400 mb-4">Victory!</div>
              <button onClick={onEnd} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold">
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN APP
// ============================================================================
export default function MonsterGame() {
  const [monsters, setMonsters] = useState([]);
  const [selectedMonster, setSelectedMonster] = useState(null);
  const [battleState, setBattleState] = useState(null);
  const [battleResult, setBattleResult] = useState(null);
  const [view, setView] = useState('care');
  const [trainerProfile, setTrainerProfile] = useState({ name: 'Trainer', coins: 50, totalWins: 0, totalLosses: 0 });
  const [evolutionNotice, setEvolutionNotice] = useState(null);
  const battleRef = useRef(null);
  
  // Load
  useEffect(() => {
    const saved = localStorage.getItem('monsterGameV3');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.monsters) setMonsters(data.monsters);
        if (data.trainerProfile) setTrainerProfile(data.trainerProfile);
        if (data.selectedMonsterId) {
          const m = data.monsters?.find(x => x.id === data.selectedMonsterId);
          if (m) setSelectedMonster(m);
        }
      } catch (e) { console.error(e); }
    }
  }, []);
  
  // Save
  useEffect(() => {
    localStorage.setItem('monsterGameV3', JSON.stringify({
      monsters, trainerProfile, selectedMonsterId: selectedMonster?.id, savedAt: Date.now(),
    }));
  }, [monsters, trainerProfile, selectedMonster]);
  
  // Sync selected
  useEffect(() => {
    if (selectedMonster) {
      const updated = monsters.find(m => m.id === selectedMonster.id);
      if (updated) setSelectedMonster(updated);
    }
  }, [monsters]);
  
  // Battle tick
  useEffect(() => {
    if (battleState && !battleState.winner) {
      battleRef.current = setInterval(() => setBattleState(prev => BattleEngine.processTick(prev)), CONFIG.BATTLE.tickRate);
    }
    return () => clearInterval(battleRef.current);
  }, [battleState?.winner, battleState !== null]);
  
  const handleBuyEgg = () => {
    if (trainerProfile.coins < CONFIG.ECONOMY.eggPrice) return;
    const baby = MonsterFactory.createBaby(false);
    setMonsters(prev => [...prev, baby]);
    setTrainerProfile(prev => ({ ...prev, coins: prev.coins - CONFIG.ECONOMY.eggPrice }));
    setSelectedMonster(baby);
  };
  
  const handleDumpsterDive = () => {
    if (trainerProfile.coins < CONFIG.ECONOMY.dumpsterPrice) return;
    const adult = MonsterFactory.createDumpsterAdult();
    setMonsters(prev => [...prev, adult]);
    setTrainerProfile(prev => ({ ...prev, coins: prev.coins - CONFIG.ECONOMY.dumpsterPrice }));
    setSelectedMonster(adult);
  };
  
  const handleTrain = (stat) => {
    if (!selectedMonster) return;
    const result = MonsterFactory.trainStat(selectedMonster, stat);
    if (result.success) {
      setMonsters(prev => prev.map(m => m.id === selectedMonster.id ? result.monster : m));
      if (result.evolved) {
        setEvolutionNotice({ name: result.monster.name, newStage: result.newStage });
        setTimeout(() => setEvolutionNotice(null), 3000);
      }
    }
  };
  
  const createDummy = (player) => {
    const stats = MonsterFactory.getEffectiveStats(player);
    const ratio = 0.8 + Math.random() * 0.15;
    return {
      id: Utils.generateId(),
      name: 'Dummy',
      primaryColor: '#666',
      secondaryColor: '#888',
      isDummy: true,
      baseStats: {
        strength: Math.floor(stats.strength * ratio),
        constitution: Math.floor(stats.constitution * ratio),
        agility: Math.floor(stats.agility * ratio),
        power: Math.floor(stats.power * ratio),
        intelligence: Math.floor(stats.intelligence * ratio * 0.5),
      },
      maxStatBonuses: {},
      level: player.level,
      isEnemy: true,
    };
  };
  
  const createEnemy = (playerLevel) => {
    const color = Utils.randomChoice(CONFIG.MONSTER_COLORS);
    return {
      id: Utils.generateId(),
      name: Utils.generateName(),
      primaryColor: color.primary,
      secondaryColor: Utils.generateSecondaryColor(color.primary),
      bodyParts: MonsterFactory.generateBodyParts('ADULT', 0.5),
      baseStats: {
        strength: 8 + Math.floor(Math.random() * 15),
        constitution: 8 + Math.floor(Math.random() * 15),
        agility: 8 + Math.floor(Math.random() * 15),
        power: 8 + Math.floor(Math.random() * 15),
        intelligence: 8 + Math.floor(Math.random() * 15),
      },
      maxStatBonuses: {},
      level: playerLevel + Math.floor(Math.random() * 3) - 1,
      isEnemy: true,
      trainerName: Utils.generateTrainerName(),
    };
  };
  
  const handleStartTraining = () => {
    if (!selectedMonster || selectedMonster.isDead) return;
    // All stages can train against dummies (babies, juveniles, adults)
    const dummy = createDummy(selectedMonster);
    setBattleState(BattleEngine.createBattleState(selectedMonster, [dummy], true));
    setView('fighting');
  };
  
  const handleStartBattle = () => {
    if (!selectedMonster || selectedMonster.isDead) return;
    // Only juveniles and adults can do arena battles
    if (MonsterFactory.getStage(selectedMonster) === 'BABY') return;
    const enemyCount = 1 + Math.floor(Math.random() * 4);
    const enemies = Array(enemyCount).fill(0).map(() => createEnemy(selectedMonster.level));
    setBattleState(BattleEngine.createBattleState(selectedMonster, enemies, false));
    setView('fighting');
  };
  
  const handleBattleEnd = () => {
    if (!battleState || !selectedMonster) return;
    
    const playerFighter = battleState.fighters[0];
    const won = battleState.winner?.id === selectedMonster.id;
    const died = playerFighter.health <= 0 && !battleState.isTraining;
    
    let updated = monsters.find(m => m.id === selectedMonster.id);
    if (!updated) return;
    
    const exp = battleState.isTraining ? CONFIG.LEVELING.expPerTraining : won ? CONFIG.LEVELING.expPerWin : Math.floor(CONFIG.LEVELING.expPerWin / 3);
    const expResult = MonsterFactory.addExperience(updated, exp);
    updated = expResult.monster;
    
    if (died) updated = MonsterFactory.kill(updated);
    
    updated.battleStats = {
      ...updated.battleStats,
      wins: won ? (updated.battleStats?.wins || 0) + 1 : updated.battleStats?.wins || 0,
      losses: !won ? (updated.battleStats?.losses || 0) + 1 : updated.battleStats?.losses || 0,
    };
    
    setMonsters(prev => prev.map(m => m.id === updated.id ? updated : m));
    
    if (won && !battleState.isTraining) {
      setTrainerProfile(prev => ({ ...prev, coins: prev.coins + CONFIG.ECONOMY.coinsPerWin, totalWins: prev.totalWins + 1 }));
    } else if (!won && !battleState.isTraining) {
      setTrainerProfile(prev => ({ ...prev, totalLosses: prev.totalLosses + 1 }));
    }
    
    setBattleResult({
      won, died, isTraining: battleState.isTraining, monster: updated,
      expGained: exp, coinsGained: won && !battleState.isTraining ? CONFIG.ECONOMY.coinsPerWin : 0,
      leveledUp: expResult.leveledUp, trainingPointsGained: expResult.trainingPointsGained || 0,
    });
    setBattleState(null);
  };
  
  const handleRevive = (monster) => {
    const cost = MonsterFactory.getReviveCost(monster);
    if (trainerProfile.coins < cost) return;
    const revived = MonsterFactory.revive(monster);
    setMonsters(prev => prev.map(m => m.id === monster.id ? revived : m));
    setTrainerProfile(prev => ({ ...prev, coins: prev.coins - cost }));
  };
  
  const getExpProgress = (m) => {
    const needed = MonsterFactory.getExpForLevel(m.level);
    return { current: m.exp || 0, needed, percent: ((m.exp || 0) / needed) * 100 };
  };
  
  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      {/* Header */}
      <div className="bg-gray-900 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🐾 Monster Trainer</h1>
        <span className="text-yellow-400 font-bold">{trainerProfile.coins} 🪙</span>
      </div>
      
      {/* Evolution Notice */}
      {evolutionNotice && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-xl shadow-lg animate-bounce">
          <div className="text-center">
            <div className="text-2xl">✨</div>
            <div className="font-bold">{evolutionNotice.name} evolved!</div>
            <div className="text-sm">Now a {CONFIG.STAGES[evolutionNotice.newStage].name}!</div>
          </div>
        </div>
      )}
      
      {/* Battle View */}
      {view === 'fighting' && battleState && (
        <div className="p-4">
          <BattleArena battleState={battleState} onEnd={handleBattleEnd} />
        </div>
      )}
      
      {/* Battle Result */}
      {battleResult && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-3xl p-6 max-w-md w-full">
            <div className={`text-center mb-4 ${battleResult.won ? 'text-green-400' : 'text-red-400'}`}>
              <div className="text-5xl mb-2">{battleResult.died ? '💀' : battleResult.won ? '🏆' : '😢'}</div>
              <h2 className="text-2xl font-bold">{battleResult.died ? 'DEATH' : battleResult.won ? 'VICTORY!' : 'DEFEAT'}</h2>
              {battleResult.isTraining && <p className="text-gray-400 text-sm">Training Battle</p>}
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between"><span className="text-gray-400">EXP</span><span className="text-yellow-400">+{battleResult.expGained}</span></div>
              {battleResult.coinsGained > 0 && <div className="flex justify-between"><span className="text-gray-400">Coins</span><span className="text-yellow-400">+{battleResult.coinsGained} 🪙</span></div>}
              {battleResult.leveledUp && (
                <div className="bg-purple-500/20 border border-purple-500 rounded-xl p-3 text-center">
                  <div className="text-purple-400 font-bold">⬆️ LEVEL UP!</div>
                  <div>+{battleResult.trainingPointsGained} Training Points</div>
                </div>
              )}
              {battleResult.died && (
                <div className="bg-red-500/20 border border-red-500 rounded-xl p-3 text-center">
                  <div className="text-red-400 font-bold">Your monster died!</div>
                  <div className="text-sm text-gray-400">Revive in Care tab</div>
                </div>
              )}
            </div>
            
            <button onClick={() => { setBattleResult(null); setView('care'); }} className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold">
              Continue
            </button>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      {view !== 'fighting' && (
        <div className="p-4">
          {/* Monster List */}
          <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
            {monsters.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedMonster(m)}
                className={`flex-shrink-0 p-2 rounded-xl transition-all ${selectedMonster?.id === m.id ? 'bg-purple-600 ring-2 ring-purple-400' : 'bg-gray-800'} ${m.isDead ? 'opacity-50' : ''}`}
              >
                <MonsterSprite monster={m} size={50} showEmoji={false} />
              </button>
            ))}
            
            <div className="flex-shrink-0 flex flex-col gap-1">
              <button
                onClick={handleBuyEgg}
                disabled={trainerProfile.coins < CONFIG.ECONOMY.eggPrice}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${trainerProfile.coins >= CONFIG.ECONOMY.eggPrice ? 'bg-green-600' : 'bg-gray-700 text-gray-500'}`}
              >
                🥚 Raise ({CONFIG.ECONOMY.eggPrice}🪙)
              </button>
              <button
                onClick={handleDumpsterDive}
                disabled={trainerProfile.coins < CONFIG.ECONOMY.dumpsterPrice}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${trainerProfile.coins >= CONFIG.ECONOMY.dumpsterPrice ? 'bg-orange-600' : 'bg-gray-700 text-gray-500'}`}
              >
                🗑️ Dumpster ({CONFIG.ECONOMY.dumpsterPrice}🪙)
              </button>
            </div>
          </div>
          
          {/* Selected Monster */}
          {selectedMonster && (
            <div className="bg-gray-900 rounded-2xl p-4 mb-4">
              <div className="flex gap-4">
                <MonsterSprite monster={selectedMonster} size={100} />
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{selectedMonster.name}</h2>
                  <p className="text-gray-400 text-sm">
                    {CONFIG.STAGES[MonsterFactory.getStage(selectedMonster)].name} • Lv.{selectedMonster.level}
                  </p>
                  <p className="text-gray-500 text-xs">{selectedMonster.colorName} • {selectedMonster.isDumpster ? 'Dumpster' : 'Raised'}</p>
                  
                  {/* EXP Bar */}
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">EXP</span>
                      <span className="text-blue-400">{getExpProgress(selectedMonster).current} / {getExpProgress(selectedMonster).needed}</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all" style={{ width: `${getExpProgress(selectedMonster).percent}%` }} />
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-purple-400 font-bold">{selectedMonster.trainingPoints || 0} Training Points</div>
                </div>
              </div>
              
              {selectedMonster.isDead && (
                <button
                  onClick={() => handleRevive(selectedMonster)}
                  disabled={trainerProfile.coins < MonsterFactory.getReviveCost(selectedMonster)}
                  className={`w-full mt-4 py-3 rounded-xl font-bold ${trainerProfile.coins >= MonsterFactory.getReviveCost(selectedMonster) ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gray-700 text-gray-500'}`}
                >
                  💖 Revive ({MonsterFactory.getReviveCost(selectedMonster)} 🪙)
                </button>
              )}
            </div>
          )}
          
          {/* Care Tab */}
          {view === 'care' && selectedMonster && !selectedMonster.isDead && (
            <div className="bg-gray-900 rounded-2xl p-4">
              <h3 className="font-bold mb-3">Stats</h3>
              <div className="grid grid-cols-5 gap-2">
                {CONFIG.TRAINING_TYPES.map(t => {
                  const stats = MonsterFactory.getEffectiveStats(selectedMonster);
                  return (
                    <div key={t.id} className="text-center">
                      <div className="text-2xl">{t.emoji}</div>
                      <div className="text-lg font-bold">{stats[t.stat]}</div>
                      <div className="text-xs text-gray-500">{t.name.slice(0, 3)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Train Tab */}
          {view === 'train' && selectedMonster && !selectedMonster.isDead && (
            <div className="space-y-4">
              <div className="bg-gray-900 rounded-2xl p-4">
                <h3 className="font-bold mb-3">Train Stats ({selectedMonster.trainingPoints || 0} pts)</h3>
                <div className="space-y-2">
                  {CONFIG.TRAINING_TYPES.map(t => {
                    const stats = MonsterFactory.getEffectiveStats(selectedMonster);
                    return (
                      <button
                        key={t.id}
                        onClick={() => handleTrain(t.stat)}
                        disabled={(selectedMonster.trainingPoints || 0) < t.cost}
                        className={`w-full flex items-center justify-between p-3 rounded-xl ${(selectedMonster.trainingPoints || 0) >= t.cost ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-800/50 text-gray-500'}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{t.emoji}</span>
                          <div className="text-left">
                            <div className="font-bold">{t.name}</div>
                            <div className="text-xs text-gray-400">{t.desc}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{stats[t.stat]}</div>
                          <div className="text-xs text-purple-400">+1</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-2xl p-4">
                <h3 className="font-bold mb-3">Training Battle</h3>
                <button onClick={handleStartTraining} className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-bold">
                  🎯 Fight Training Dummy
                </button>
                <p className="text-center text-xs text-gray-500 mt-2">Earns EXP only, no coins, no death risk</p>
              </div>
            </div>
          )}
          
          {/* Battle Tab */}
          {view === 'battle' && selectedMonster && !selectedMonster.isDead && (
            <div className="bg-gray-900 rounded-2xl p-4">
              <h3 className="font-bold mb-3">Arena Battle</h3>
              {MonsterFactory.getStage(selectedMonster) === 'BABY' ? (
                <p className="text-gray-400 text-center py-4">Babies can't enter the arena! Train until all stats are 5+ to evolve.</p>
              ) : (
                <div className="space-y-3">
                  <button onClick={handleStartBattle} className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl font-bold text-lg">
                    ⚔️ Battle! (1-4 enemies)
                  </button>
                  <p className="text-center text-xs text-gray-500">Earns EXP + Coins • ⚠️ Your monster can die!</p>
                </div>
              )}
            </div>
          )}
          
          {/* Profile Tab */}
          {view === 'profile' && (
            <div className="bg-gray-900 rounded-2xl p-4">
              <h3 className="font-bold mb-3">Trainer Profile</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-gray-400">Coins</span><span className="text-yellow-400">{trainerProfile.coins} 🪙</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Wins</span><span className="text-green-400">{trainerProfile.totalWins}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Losses</span><span className="text-red-400">{trainerProfile.totalLosses}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Monsters</span><span>{monsters.length}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Dead</span><span className="text-red-400">{monsters.filter(m => m.isDead).length}</span></div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800">
        <div className="flex justify-around py-2">
          {[
            { id: 'care', label: 'Care', icon: '🏠' },
            { id: 'train', label: 'Train', icon: '💪' },
            { id: 'battle', label: 'Battle', icon: '⚔️' },
            { id: 'profile', label: 'Profile', icon: '👤' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`flex flex-col items-center px-4 py-1 rounded-xl ${view === tab.id ? 'text-purple-400' : 'text-gray-500'}`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
