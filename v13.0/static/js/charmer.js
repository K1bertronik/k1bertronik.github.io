document.getElementById('calcForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const playerParams = collectPlayerParams();
    const petParams = collectPetParams();
    const targetParams = collectTargetParams();
    const bonusModifiers = collectBonusModifiers();

    const params = {
        player: playerParams,
        pet: petParams,
        target: targetParams,
        bonus: bonusModifiers,
    };
  
    const results = {
        autoattack: Autoattack(params),
        darkPrism: DarkPrism(params),
        combatHealingInstant: CombatHealingInstant(params),
        combatHealing: CombatHealing(params),
        call: Call(params),
        oppression: Oppression(params),
        knowledge: Knowledge(params),
        otherworldFire: OtherworldFire(params),
        embraceOfDarkness: OtherworldFire(params, true),
        chaosHelp: ChaosHelp(params),
        chaosHelpHeal: ChaosHelpHeal(params),
        plaguedMinionExplode: PlaguedMinionExplode(params),
        plaguedMinion: PlaguedMinion(params),
      };
      
      const rowsMap = {
        autoattack: "autoattackRow",
        darkPrism: "darkPrismRow",
        combatHealingInstant: "combatHealingInstantRow",
        combatHealing: "combatHealingRow",
        call: "callRow",
        oppression: "oppressionRow",
        knowledge: "knowledgeRow",
        otherworldFire: "otherWorldFireRow",
        embraceOfDarkness: "embraceOfDarknessRow",
        chaosHelp: "chaosHelpRow",
        chaosHelpHeal: "chaosHelpHealRow",
        plaguedMinionExplode: "plaguedMinionExplodeRow",
        plaguedMinion: "plaguedMinionRow",
      };
      
  
    for (const [key, rowId] of Object.entries(rowsMap)) {
      updateDamageValues(results[key], rowId);
    }
  });

function collectPlayerParams() {
    return {
        health: parseFloat(document.getElementById('health').value) || 0,

        physicalDamage: parseFloat(document.getElementById('physdmg').value) || 0,
        magicalDamage: parseFloat(document.getElementById('magicdmg').value) || 0,
        penetration: (parseFloat(document.getElementById('penetration').value) || 0) / 100,
        ferocity: (parseFloat(document.getElementById('ferocity').value) || 0) / 100,
        skillPower: (parseFloat(document.getElementById('skillPower').value) || 0) / 100,
        attackStrength: (parseFloat(document.getElementById('attackStrength').value) || 0) / 100,
    };
}

function collectPetParams() {
    var gloryPackBonus =  (parseFloat(document.getElementById('gloryPackBonus').value) || 0) / 100;
    return {
        summonerSkill: (parseFloat(document.getElementById('summonerSkill').value) || 0) / 100,

        penetration: ((parseFloat(document.getElementById('penetration').value) || 0) / 100) * (1 + gloryPackBonus),
        ferocity: ((parseFloat(document.getElementById('ferocity').value) || 0) / 100) * (1 + gloryPackBonus),
        attackStrength: ((parseFloat(document.getElementById('attackStrength').value) || 0) / 100) * (1 + gloryPackBonus),
    };
}

function collectTargetParams() {
    return {
        isPVPTarget: document.getElementById('pvpSwitch').checked,

        targetPhysicalDefence: (parseFloat(document.getElementById('targetPhysicalDefencePercent').value) || 0) / 100,
        targetMagicalDefence: (parseFloat(document.getElementById('targetMagicalDefencePercent').value) || 0) / 100,
        targetResilience: (parseFloat(document.getElementById('targetResilience').value) || 0) / 100,
    };
}
  
function collectBonusModifiers() {
    return {
        unitedAttackBonus: (parseFloat(document.getElementById('unitedAttackBonus').value) || 0) / 100,
        relicBonus: document.getElementById('relicBonus').checked ? 0.12 : 0,

        castleHeal: (parseFloat(document.getElementById('castleHeal').value) || 0) / 100,
        potHeal: (parseFloat(document.getElementById('potHeal').value) || 0) / 100,

        pveBonusI: (parseFloat(document.getElementById('pveBonusI').value) || 0) / 100,
        pveBonusII: (parseFloat(document.getElementById('pveBonusII').value) || 0) / 100,

        healBonus: (parseFloat(document.getElementById('healBonus').value) || 0) / 100,

        combatHealBonus: document.getElementById('combatHealBonus').checked ? 0.05 : 0,
        combatHealBonusIII: (parseFloat(document.getElementById('combatHealBonusIII').value) || 0) / 100,

        otherworldFireBonus: (parseFloat(document.getElementById('otherworldFireBonus').value) || 0) / 100,

        callBonusII: (parseFloat(document.getElementById('callBonusII').value) || 0) / 100,
        callBonusAlm: (parseFloat(document.getElementById('callBonusAlm').value) || 0) / 100,

        knowledgeBonusII: document.getElementById('knowledgeBonusII').checked ? 0.05 : 0,

        summonerSkillBonusII: (parseFloat(document.getElementById('summonerSkillBonusII').value) || 0) / 100,

        darkPrismBonusIII: (parseFloat(document.getElementById('darkPrismBonusIII').value) || 0) / 100,
        darkPrismBonusAlm: document.getElementById('darkPrismBonusAlm').value,

        devotionBonus: (parseFloat(document.getElementById('devotionBonus').value) || 0) / 100,
    };
}

function calculateDamage(rawDamageLevels, params, options = {}) {
    const {
        isSkill = true,
        damageType = 'physical',
    } = options;

    const { player, target, bonus } = params;

    const totalDamageLevels = [];

    const penetration = player.penetration;

    const targetPhysicalDef = target.targetPhysicalDefence;
    const targetMagicalDef = target.targetMagicalDefence;
    
    let targetReduction = 0;

    if (damageType === 'physical') {
        targetReduction = (penetration > targetPhysicalDef) ? 0 : targetPhysicalDef - penetration;
    } else if (damageType === 'magical'){
        targetReduction = (penetration > targetMagicalDef) ? 0 : targetMagicalDef - penetration;
    }

    const isPVP = target.isPVPTarget;
    const resilience = isPVP ? target.targetResilience : 0;
    const ferocity = isPVP ? player.ferocity : 0;

    const skillPower = isSkill ? player.skillPower : 0;

    const pveBonusI = (isSkill && !isPVP) ? bonus.pveBonusI : 0;
    const pveBonusII = !isPVP ? bonus.pveBonusII : 0;

    const devotionBonus = bonus.devotionBonus;

    for (let i = 0; i < rawDamageLevels.length; i++) {
        const base = rawDamageLevels[i];

        const total = base
            * (1 - targetReduction)
            * (1 + ferocity)
            * (1 - resilience)
            * (1 + pveBonusI)
            * (1 + pveBonusII)
            * (1 + skillPower)
            * (1 + devotionBonus);

        totalDamageLevels.push(parseFloat(total.toFixed(2)));
    }

    return totalDamageLevels;
}

function calculatePetDamage(rawDamageLevels, params, options = {}) {
    const {
        damageType = 'physical',
    } = options;

    const {pet, target, bonus } = params;

    const totalDamageLevels = [];

    const penetration = pet.penetration;
    const attackStrength = pet.attackStrength;

    const targetPhysicalDef = target.targetPhysicalDefence;
    const targetMagicalDef = target.targetMagicalDefence;
    
    let targetReduction = 0;

    if (damageType === 'physical') {
        targetReduction = (penetration > targetPhysicalDef) ? 0 : targetPhysicalDef - penetration;
    } else if (damageType === 'magical'){
        targetReduction = (penetration > targetMagicalDef) ? 0 : targetMagicalDef - penetration;
    }

    const isPVP = target.isPVPTarget;
    const resilience = isPVP ? target.targetResilience : 0;
    const ferocity = isPVP ? pet.ferocity : 0;

    const pveBonusII = !isPVP ? bonus.pveBonusII : 0;

    const summonerBonus = (pet.summonerSkill != 0) ? pet.summonerSkill + bonus.summonerSkillBonusII : 0;

    const devotionBonus = bonus.devotionBonus;

    for (let i = 0; i < rawDamageLevels.length; i++) {
        const base = rawDamageLevels[i];

        const total = base
            * (1 - targetReduction)
            * (1 + ferocity)
            * (1 - resilience)
            * (1 + pveBonusII)
            * (1 + attackStrength)
            * (1 + summonerBonus)
            * (1 + devotionBonus);

        totalDamageLevels.push(parseFloat(total.toFixed(2)));
    }

    return totalDamageLevels;
}

function calculateHeal(skillHealLevels, params) {

    const totalHealLevels = [];

    const castleHealBonus = params.bonus.castleHeal;
    const healPotBonus = params.bonus.potHeal;

    const healBonus = params.bonus.healBonus;

    for (let level = 0; level < skillHealLevels.length; level++) {
        const skillHeal = skillHealLevels[level];
        const totalHeal = skillHeal * (1 + castleHealBonus + healPotBonus + healBonus);
        totalHealLevels.push(parseFloat(totalHeal.toFixed(2)));
    }

    return totalHealLevels;
}

function Autoattack(params){
    const damageLevels = [];

    const physicalDamage = params.player.physicalDamage;
    const attackStrength = params.player.attackStrength;

    const damage = physicalDamage * (1 + attackStrength) ;
	
    damageLevels.push(damage);

    return calculateDamage(damageLevels, params, {
        isSkill: false,
    });
}

function DarkPrism(params){
    const damageLevels = [];

    const basePhysValues = [20, 40, 60, 80, 100];
    const baseMagValues = [30, 55, 80, 105, 130];

    const percentagePhysIncreases = [105.0, 110.0, 115.0, 120.0, 125.0];
    const percentageMagIncreases = [120.0, 125.0, 130.0, 135.0, 140.0];

    const physicalDamage = params.player.physicalDamage;
    const magicalDamage = params.player.magicalDamage;

    const relicBonus = params.bonus.relicBonus;
    const unitedBonus = params.bonus.unitedAttackBonus;

    const darkPrismBonusIII = params.bonus.darkPrismBonusIII;

    var darkPrismBonusAlm = params.bonus.darkPrismBonusAlm;

    darkPrismBonusAlm = darkPrismBonusAlm.split(',');

    const physDarkPrismBonusAlm = parseFloat(darkPrismBonusAlm[0]) / 100;
    const magDarkPrismBonusAlm = parseFloat(darkPrismBonusAlm[1]) / 100;

    for (let level = 0; level < 5; level++) {
        if (physicalDamage > magicalDamage) {
            var damage = (basePhysValues[level] + physicalDamage * (percentagePhysIncreases[level] / 100 + physDarkPrismBonusAlm)) * (1 + relicBonus + unitedBonus);
        } else {
            var damage = (baseMagValues[level] + magicalDamage * (percentageMagIncreases[level] / 100 + darkPrismBonusIII + magDarkPrismBonusAlm)) * (1 + relicBonus + unitedBonus);
        }
        damageLevels.push(damage);
    }

    if (physicalDamage > magicalDamage) {
        return calculateDamage(damageLevels, params, { });
    } else {
        return calculateDamage(damageLevels, params, {
            damageType: "magical",
        });
    }
}

function CombatHealingInstant(params){
    const healLevels = [];
	
	const percentageInstantIncreases = [30.0, 40.0, 50.0, 65.0, 75.0];

    const magicalDamage = params.player.magicalDamage;
	
	const combatHealBonus = params.bonus.combatHealBonus;
    const combatHealBonusIII = params.bonus.combatHealBonusIII;

    for (let level = 0; level < 5; level++) {
		var heal = magicalDamage * (percentageInstantIncreases[level] / 100 + combatHealBonus + combatHealBonusIII);

		healLevels.push(heal);
    }

    return calculateHeal(healLevels, params);
}

function CombatHealing(params){
	const healLevels = [];
	
	const baseValues = [8, 14, 20, 26, 32];
    const percentageIncreases = [15.0, 20.0, 25.0, 30.0, 35.0];

    const magicalDamage = params.player.magicalDamage;
	
    const combatHealBonusIII = params.bonus.combatHealBonusIII;

    for (let level = 0; level < 5; level++) {
        const heal = (baseValues[level] + magicalDamage * (percentageIncreases[level] / 100 + combatHealBonusIII));
        
		healLevels.push(heal);
    }

    return calculateHeal(healLevels, params);
}

function Call(params){
    const damageLevels = [];

    const percentageIncreases = [45.0, 55.0, 65.0, 75.0, 85.0];

    const physicalDamage = params.player.physicalDamage;

    const relicBonus = params.bonus.relicBonus;

    const callBonusII = params.bonus.callBonusII;
	const callBonusAlm = params.bonus.callBonusAlm;
	
    for (let level = 0; level < 5; level++) {
        const damage = (physicalDamage * (percentageIncreases[level] / 100 + callBonusII + callBonusAlm)) * (1 + relicBonus);
        damageLevels.push(damage);
	}
		
    return calculatePetDamage(damageLevels, params, { });
}

function Oppression(params){
    const damageLevels = [];
	
	const baseValues = [30, 55, 80, 105, 130];
    const percentageIncreases = [65.0, 70.0, 75.0, 85.0, 100.0];

    const magicalDamage = params.player.magicalDamage;
	
    for (let level = 0; level < 5; level++) {
        const damage = baseValues[level] + magicalDamage * (percentageIncreases[level] / 100);
        damageLevels.push(damage);
	}
		
    return calculateDamage(damageLevels, params, {
        damageType: "magical",
    });
}

function Knowledge(params){
    const damageLevels = [];

    const percentagePhysIncreases = [50.0, 65.0, 85.0, 110.0];
    const percentageMagIncreases = [65.0, 80.0, 100.0, 125.0];

    const physicalDamage = params.player.physicalDamage;
    const magicalDamage = params.player.magicalDamage;

    const knowledgeBonusII = params.bonus.knowledgeBonusII;

    for (let level = 0; level < 4; level++) {
        if (physicalDamage > magicalDamage) {
            var damage = physicalDamage * (percentagePhysIncreases[level] / 100 + knowledgeBonusII);
        } else {
            var damage = magicalDamage * (percentageMagIncreases[level] / 100);
        }
        damageLevels.push(damage);
    }

    if (physicalDamage > magicalDamage) {
        return calculateDamage(damageLevels, params, { });
    } else {
        return calculateDamage(damageLevels, params, {
            damageType: "magical",
        });
    }
}

function OtherworldFire(params, isEmbrace = false){
    const damageLevels = [];
	
    const percentageIncreases = [60.0, 65.0, 75.0, 90.0];

    const magicalDamage = params.player.magicalDamage;

    const otherworldFireBonus = params.bonus.otherworldFireBonus;
	
	const embraceBonus = isEmbrace ? 1 : 0;
	
    for (let level = 0; level < 4; level++) {
        const damage = magicalDamage * (percentageIncreases[level] / 100 + otherworldFireBonus) * (1 + embraceBonus);
        damageLevels.push(damage);
	}
		
    return calculateDamage(damageLevels, params, {
        damageType: "magical",
    });
}

function ChaosHelp(params){
    const damageLevels = [];

    const percentageIncreases = [55.0, 65.0, 75.0, 90.0];

    const magicalDamage = params.player.magicalDamage;

    for (let level = 0; level < 4; level++) {
        const damage = magicalDamage * (percentageIncreases[level] / 100) + 8 * 34 + 20;
        damageLevels.push(damage);
	}
		
    return calculatePetDamage(damageLevels, params, {
        damageType: "magical",
    });
}

function ChaosHelpHeal(params){
    const healLevels = [];

    const percentageIncreases = [55.0, 65.0, 75.0, 90.0];

    const magicalDamage = params.player.magicalDamage;

    for (let level = 0; level < 4; level++) {
        const heal = magicalDamage * (percentageIncreases[level] / 100) + 8 * 34 + 47;
        healLevels.push(heal);
	}
		
    return calculateHeal(healLevels, params);
}

function PlaguedMinionExplode(params){
    const damageLevels = [];
	
    const percentagePhysIncrease = 0.45;

    const physicalDamage = params.player.physicalDamage;

    const damage = physicalDamage * percentagePhysIncrease;
    damageLevels.push(damage);
		
    return calculateDamage(damageLevels, params, { });
}

function PlaguedMinion(params){
    const damageLevels = [];
	
    const percentageMagIncrease = 0.25;

    const magicalDamage = params.player.magicalDamage;
	
    const damage = magicalDamage * percentageMagIncrease;
    damageLevels.push(damage);
		
    return calculateDamage(damageLevels, params, {
        damageType: "magical",
    });
}

function updateDamageValues(damageList, rowId) {
    var row = document.getElementById(rowId);

    if (row) {
        for (var i = 0; i < damageList.length; i++) {
            if (i + 1 < row.cells.length) {
                row.cells[i + 1].innerText = damageList[i];
            } else {
                console.warn('More damage values than available cells');
                break;
            }
        }
    } else {
        console.error('Row not found');
    }
}
