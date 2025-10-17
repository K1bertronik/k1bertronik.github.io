document.getElementById('calcForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const playerParams = collectPlayerParams();
    const targetParams = collectTargetParams();
    const bonusModifiers = collectBonusModifiers();

    const params = {
        player: playerParams,
        target: targetParams,
        bonus: bonusModifiers,
    };
  
    const results = {
        autoattack: Autoattack(params),
        arrowOfDarkness: ArrowOfDarkness(params),
        drainingLife: DrainingLife(params),
        drainingLifeHeal: DrainingLifeHeal(DrainingLife(params), params),
        poolOfDarkness: PoolOfDarkness(params),
        shadowSphere: ShadowSphere(params),
        hex: Hex(params),
        stoneBodyHeal: StoneBodyHeal(params),
        underworldFlame: UnderworldFlame(params),
        twilightPact: TwilightPact(params),
        singularity: Singularity(params),
      };
      
      const rowsMap = {
        autoattack: "autoattackRow",
        arrowOfDarkness: "arrowOfDarknessRow",
        drainingLife: "drainingLifeRow",
        drainingLifeHeal: "drainingLifeHealRow",
        poolOfDarkness: "poolOfDarknessRow",
        shadowSphere: "shadowSphereRow",
        hex: "hexRow",
        stoneBodyHeal: "stoneBodyHealRow",
        underworldFlame: "underworldFlameRow",
        twilightPact: "twilightPactHealRow",
        singularity: "singularityRow",
      };
      
  
    for (const [key, rowId] of Object.entries(rowsMap)) {
      updateDamageValues(results[key], rowId);
    }
  });

function collectPlayerParams() {
    return {
        health: parseFloat(document.getElementById('health').value) || 0,
        maxEnergy: parseFloat(document.getElementById('maxEnergy').value) || 0,
        lostEnergy: parseFloat(document.getElementById('lostEnergy').value) || 0,

        magicalDamage: parseFloat(document.getElementById('magicdmg').value) || 0,
        penetration: (parseFloat(document.getElementById('penetration').value) || 0) / 100,
        ferocity: (parseFloat(document.getElementById('ferocity').value) || 0) / 100,
        skillPower: (parseFloat(document.getElementById('skillPower').value) || 0) / 100,
        attackStrength: (parseFloat(document.getElementById('attackStrength').value) || 0) / 100,
    };
}

function collectTargetParams() {
    return {
        isPVPTarget: document.getElementById('pvpSwitch').checked,

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

        instDmgBonus: (parseFloat(document.getElementById('instDmgBonus').value) || 0) / 100,
        dotDmgBonus: (parseFloat(document.getElementById('dotDmgBonus').value) || 0) / 100,
  
        instPenBonus: (parseFloat(document.getElementById('instPenBonus').value) || 0) / 100,
        dotPenBonus: (parseFloat(document.getElementById('dotPenBonus').value) || 0) / 100,

        pveBonusI: (parseFloat(document.getElementById('pveBonusI').value) || 0) / 100,
        pveBonusII: (parseFloat(document.getElementById('pveBonusII').value) || 0) / 100,

        toughnessBonus: (parseFloat(document.getElementById('toughnessBonus').value) || 0) / 100,

        arrowBonus: document.getElementById('arrowBonus').checked ? 0.05 : 0,
        arrowBonusI: (parseFloat(document.getElementById('arrowBonusI').value) || 0) / 100,
        arrowBonusAlm: (parseFloat(document.getElementById('arrowBonusAlm').value) || 0) / 100,

        shadowSphereBonusI: document.getElementById('shadowSphereBonusI').checked ? 0.10 : 0,
        shadowSphereBonusAlm: (parseFloat(document.getElementById('shadowSphereBonusAlm').value) || 0) / 100,

        poolBonus: (parseFloat(document.getElementById('poolBonus').value) || 0) / 100,

        acidicStepsBonus: document.getElementById('acidicStepsBonus').checked,

        stoneBodyBonus: (parseFloat(document.getElementById('stoneBodyBonus').value) || 0) / 100,

        drainingLifeBonus: (parseFloat(document.getElementById('drainingLifeBonus').value) || 0) / 100,
    };
}

function calculateDamage(rawDamageLevels, params, options = {}) {
    const {
        isSkill = true,
        damageEffectType = 'instant',
        isTalent = false,
    } = options;

    const { player, target, bonus } = params;

    const totalDamageLevels = [];

    let basePenetration = player.penetration;
    let penetrationBonus = 0;
    if (damageEffectType === 'instant') {
        penetrationBonus = bonus.instPenBonus;
    } else if (damageEffectType === 'dot') {
        penetrationBonus = bonus.dotPenBonus;
    }
    const totalPenetration = basePenetration + penetrationBonus;

    const targetDef = target.targetMagicalDefence;

    const targetReduction = Math.max(0, targetDef - totalPenetration);

    const isPVP = target.isPVPTarget;
    const resilience = isPVP ? target.targetResilience : 0;
    const ferocity = isPVP ? player.ferocity : 0;

    const skillPower = isSkill ? player.skillPower : 0;

    const pveBonusI = (isSkill && !isPVP && !isTalent) ? bonus.pveBonusI : 0;
    const pveBonusII = !isPVP ? bonus.pveBonusII : 0;
    const toughnessBonus = !isPVP ? bonus.toughnessBonus : 0;

    let damageBonus = 0;
    if (isSkill && damageEffectType === 'instant') {
        damageBonus = bonus.instDmgBonus;
    } else if (isSkill && damageEffectType === 'dot') {
        damageBonus = bonus.dotDmgBonus;
    }

    for (let i = 0; i < rawDamageLevels.length; i++) {
        const base = rawDamageLevels[i];

        const total = base
            * (1 - targetReduction)
            * (1 + ferocity)
            * (1 - resilience)
            * (1 + pveBonusI)
            * (1 + pveBonusII)
            * (1 + toughnessBonus)
            * (1 + skillPower)
            * (1 + damageBonus);

        totalDamageLevels.push(parseFloat(total.toFixed(2)));
    }

    return totalDamageLevels;
}

function calculateHeal(skillHealLevels, params) {

    const totalHealLevels = [];

    const castleHealBonus = params.bonus.castleHeal;
    const healPotBonus = params.bonus.potHeal;

    for (let level = 0; level < skillHealLevels.length; level++) {
        const skillHeal = skillHealLevels[level];
        const totalHeal = skillHeal * (1 + castleHealBonus + healPotBonus);
        totalHealLevels.push(parseFloat(totalHeal.toFixed(2)));
    }

    return totalHealLevels;
}

function Autoattack(params){
    const damageLevels = [];

    const magicalDamage = params.player.magicalDamage;
    const attackStrength = params.player.attackStrength;

    const damage = magicalDamage * (1 + attackStrength) ;
	
    damageLevels.push(damage);

    return calculateDamage(damageLevels, params, {
        isSkill: false,
        damageEffectType: 'instant',
        isTalent: false,
    });
}

function ArrowOfDarkness(params){
    const damageLevels = [];

    const baseValues = [30, 55, 80, 105, 130];
    const percentageIncreases = [110.0, 115.0, 120.0, 125.0, 130.0];

    const isPVP = params.target.isPVPTarget;

    const energyLimit = (isPVP ? 300 : 500);

    const magicalDamage = params.player.magicalDamage;
    const energy = params.player.maxEnergy;
	
    const relicBonus = params.bonus.relicBonus;
    const unitedBonus = params.bonus.unitedAttackBonus;

    const arrowBonus = params.bonus.arrowBonus;
	const arrowBonusI = params.bonus.arrowBonusI;
    const arrowBonusAlm = params.bonus.arrowBonusAlm;

    for (let level = 0; level < 5; level++) {
        var damage;
		if (isPVP) {
			damage = (baseValues[level] + magicalDamage * (percentageIncreases[level] / 100 + arrowBonus + arrowBonusI + arrowBonusAlm)) * (energy < energyLimit ? (1 + ((energy / 5) / 100)) : (2.6 - (900 / (energy - 300 + 900)))) * (1 + relicBonus + unitedBonus);
		} else {
			damage = (baseValues[level] + magicalDamage * (percentageIncreases[level] / 100 + arrowBonus + arrowBonusI + arrowBonusAlm)) * (energy < energyLimit ? (1 + ((energy / 5) / 100)) : (3 - (500 / (energy - 500 + 500)))) * (1 + relicBonus + unitedBonus);
		}
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params, { });
}

function DrainingLife(params){
    const damageLevels = [];

    const percentageIncreases = [30.0, 35.0, 40.0, 45.0, 50.0];

    const magicalDamage = params.player.magicalDamage;
	
    const relicBonus = params.bonus.relicBonus;
	const drainingLifeBonus = params.bonus.drainingLifeBonus;

    for (let level = 0; level < 5; level++) {
		var damage = magicalDamage * (percentageIncreases[level] / 100 + drainingLifeBonus) * (1 + relicBonus);
		damageLevels.push(damage);
	}

    return calculateDamage(damageLevels, params, {
        damageEffectType: 'dot',
    });
}

function DrainingLifeHeal(damageLevels, params){
    const healLevels = [];

    const percentageIncreases = [50.0, 60.0, 70.0, 85.0, 100.0];

    for (let level = 0; level < 5; level++) {
        const heal = damageLevels[level] * (percentageIncreases[level] / 100);
        healLevels.push(heal);
    }

    return calculateHeal(healLevels, params);
}

function PoolOfDarkness(params){
    const damageLevels = [];
	
    const percentageIncreases = [15.0, 20.0, 25.0, 30.0, 35.0];

    const acidicSteps = params.bonus.acidicStepsBonus;

    const isPVP = params.target.isPVPTarget;

    const energyLimit = (isPVP ? 300 : 500);

    const magicalDamage = params.player.magicalDamage;
    const energy = params.player.maxEnergy;
	
    const relicBonus = params.bonus.relicBonus;
    const poolBonus = params.bonus.poolBonus;

    for (let level = 0; level < 5; level++) {
		if (acidicSteps) {
			if (isPVP) {
                var damage = (magicalDamage * (percentageIncreases[level] / 100 + poolBonus) * 0.7) * (energy < energyLimit ? (1 + ((energy / 5) / 100)) : (2.6 - (900 / (energy - 300 + 900)))) * (1 + relicBonus);
			} else {
				var damage = (magicalDamage * (percentageIncreases[level] / 100 + poolBonus) * 0.7) * (energy < energyLimit ? (1 + ((energy / 5) / 100)) : (3 - (500 / (energy - 500 + 500)))) * (1 + relicBonus);
			}
		} else {
			var damage = magicalDamage * (percentageIncreases[level] / 100 + poolBonus) * (1 + relicBonus)
		}
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params, {
        damageEffectType: 'dot',
    });
}

function ShadowSphere(params){
    const damageLevels = [];
	
    const percentageIncreases = [135.0, 150.0, 165.0, 185.0];

    const isPVP = params.target.isPVPTarget;

    let energyLimit = (isPVP ? 300 : 500);

    const magicalDamage = params.player.magicalDamage;
    const energy = params.player.maxEnergy;
	
    const shadowSphereBonusI = params.bonus.shadowSphereBonusI;
    const shadowSphereBonusAlm = params.bonus.shadowSphereBonusAlm;

    for (let level = 0; level < 4; level++) {
		if (isPVP) {
			var damage = (magicalDamage * (percentageIncreases[level] / 100 + shadowSphereBonusI + shadowSphereBonusAlm)) * (energy < energyLimit ? (1 + ((energy / 5) / 100)) : (2.6 - (900 / (energy - 300 + 900))));
		} else {
			var damage = (magicalDamage * (percentageIncreases[level] / 100 + shadowSphereBonusI + shadowSphereBonusAlm)) * (energy < energyLimit ? (1 + ((energy / 5) / 100)) : (3 - (500 / (energy - 500 + 500))));
		}
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params, { });
}

function Hex(params){
    const damageLevels = [];

    const percentageIncreases = [60.0, 65.0, 70.0, 80.0];

    const magicalDamage = params.player.magicalDamage;

    for (let level = 0; level < 4; level++) {
		const damage = magicalDamage * (percentageIncreases[level] / 100);
		damageLevels.push(damage);
	}

    return calculateDamage(damageLevels, params, {
        damageEffectType: 'dot',
    });
}

function StoneBodyHeal(params){
    const healLevels = [];

    const percentageHealthIncreases = [9.0, 11.0, 13.0, 18.0];

    const health = params.player.health;
	
	const stoneBodyBonus = params.bonus.stoneBodyBonus;

    for (let level = 0; level < 4; level++) {
        const heal = health * (percentageHealthIncreases[level] / 100 + stoneBodyBonus);
        healLevels.push(heal);
    }

    return calculateHeal(healLevels, params);
}

function UnderworldFlame(params){
    const damageLevels = [];

    const percentageIncrease = 0.4;

    const magicalDamage = params.player.magicalDamage;

	const damage = magicalDamage * percentageIncrease;
	
	damageLevels.push(damage);

    return calculateDamage(damageLevels, params, {
        isSkill: false,
        damageEffectType: 'dot',
        isTalent: true,
    });
}

function TwilightPact(params){
    const healLevels = [];

    const percentageHealthIncrease = 0.04;

    const health = params.player.health;

    const heal = health * percentageHealthIncrease;
	
    healLevels.push(heal);

    return calculateHeal(healLevels, params);
}

function Singularity(params){
    const healLevels = [];

    const percentageIncrease = 0.05;

    const magicalDamage = params.player.magicalDamage;
    const maxEnergy = params.player.maxEnergy;
    const lostEnergy = params.player.lostEnergy;

    const reductionFactor = (maxEnergy / 200) * 0.1;

    let effectiveEnergyFactor = 1 - reductionFactor;
    if (effectiveEnergyFactor < 0) effectiveEnergyFactor = 0;

    const adjustedEnergySpent = lostEnergy * effectiveEnergyFactor;

    const heal = (adjustedEnergySpent / 15) * (magicalDamage * percentageIncrease);
    
    healLevels.push(heal);

    return calculateHeal(healLevels, params);
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
