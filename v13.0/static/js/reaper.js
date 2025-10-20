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
        evisceration: Evisceration(params),
        otherworldBoost: OtherworldBoost(params),
        annihilation: Annihilation(params),
        annihilationCrit: AnnihilationCrit(params),
        wideScope: WideScope(Annihilation(params)),
        wideScopeCrit: WideScope(AnnihilationCrit(params)),
        underworldHand: UnderworldHand(params),
        explosionOfChaos: ExplosionOfChaos(RawExplosionOfChaos(params), params),
        demonicExplosionOfChaos: DemonicExplosionOfChaos(RawExplosionOfChaos(params), params),
      };
      
      const rowsMap = {
        autoattack: "autoattackRow",
        evisceration: "eviscerationRow",
        otherworldBoost: "otherworldBoostRow",
        annihilation: "annihilationRow",
        annihilationCrit: "annihilationCritRow",
        wideScope: "widescopeRow",
        wideScopeCrit: "widescopeCritRow",
        underworldHand: "underworldHandRow",
        explosionOfChaos: "explosionOfChaosRow",
        demonicExplosionOfChaos: "demonicExplosionOfChaosRow",
      };
      
  
    for (const [key, rowId] of Object.entries(rowsMap)) {
      updateDamageValues(results[key], rowId);
    }
  });

function collectPlayerParams() {
    return {
        health: parseFloat(document.getElementById('health').value) || 0,

        physicalDamage: parseFloat(document.getElementById('physdmg').value) || 0,
        penetration: (parseFloat(document.getElementById('penetration').value) || 0) / 100,
        ferocity: (parseFloat(document.getElementById('ferocity').value) || 0) / 100,
        skillPower: (parseFloat(document.getElementById('skillPower').value) || 0) / 100,
        attackStrength: (parseFloat(document.getElementById('attackStrength').value) || 0) / 100,
        critPower: (parseFloat(document.getElementById('critPower').value) || 0) / 100,

        rage: (parseFloat(document.getElementById('rage').value) || 0),
    };
}

function collectTargetParams() {
    return {
        isPVPTarget: document.getElementById('pvpSwitch').checked,

        targetPhysicalDefence: (parseFloat(document.getElementById('targetPhysicalDefencePercent').value) || 0) / 100,
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

        eviscerationBonus: document.getElementById('eviscerationBonus').checked ? 0.05 : 0,
        eviscerationBonusII: (parseFloat(document.getElementById('eviscerationBonusII').value) || 0) / 100,
        eviscerationBonusAlm: (parseFloat(document.getElementById('eviscerationBonusAlm').value) || 0) / 100,

        explodionBonus: (parseFloat(document.getElementById('explodionBonus').value) || 0) / 100,
        explodionBonusAlm: (parseFloat(document.getElementById('explodionBonusAlm').value) || 0) / 100,

        devastatingFlashBonus: document.getElementById('devastatingFlashBonus').checked ? 0.20 : 0,

        annihilationBonus: (parseFloat(document.getElementById('annihilationBonus').value) || 0) / 100,

        underworldHandBonusAlm: (parseFloat(document.getElementById('underworldHandBonusAlm').value) || 0) / 100,

        bloodBathBonus: (parseFloat(document.getElementById('bloodBathBonus').value) || 0) / 100,
    };
}

function calculateDamage(rawDamageLevels, params, options = {}) {
    const {
        isSkill = true,
        damageEffectType = 'instant',
        isDemonic= false,
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

    const explosivePenetrationBonus = isDemonic ? [4.0, 6.0, 8.0, 10.0] : [0,0,0,0,0];

    const targetDef = target.targetPhysicalDefence;

    const isPVP = target.isPVPTarget;
    const resilience = isPVP ? target.targetResilience : 0;
    const ferocity = isPVP ? player.ferocity : 0;

    const skillPower = isSkill ? player.skillPower : 0;

    const pveBonusI = (isSkill && !isPVP) ? bonus.pveBonusI : 0;
    const pveBonusII = !isPVP ? bonus.pveBonusII : 0;
    const toughnessBonus = !isPVP ? bonus.toughnessBonus : 0;

    const bloodBathBonus = bonus.bloodBathBonus;

    let damageBonus = 0;
    if (isSkill && damageEffectType === 'instant') {
        damageBonus = bonus.instDmgBonus;
    } else if (isSkill && damageEffectType === 'dot') {
        damageBonus = bonus.dotDmgBonus;
    }

    for (let i = 0; i < rawDamageLevels.length; i++) {

        const totalPenetration = basePenetration + penetrationBonus + explosivePenetrationBonus[i] / 100;

        const targetReduction = Math.max(0, targetDef - totalPenetration);

        const base = rawDamageLevels[i];

        const total = base
            * (1 - targetReduction)
            * (1 + ferocity)
            * (1 - resilience)
            * (1 + pveBonusI)
            * (1 + pveBonusII)
            * (1 + toughnessBonus)
            * (1 + skillPower)
            * (1 + damageBonus)
            * (1 + bloodBathBonus);

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

    const physicalDamage = params.player.physicalDamage;
    const attackStrength = params.player.attackStrength;

    const damage = physicalDamage * (1 + attackStrength) ;
	
    damageLevels.push(damage);

    return calculateDamage(damageLevels, params, {
        isSkill: false,
        damageEffectType: 'instant',
    });
}

function Evisceration(params){
    const damageLevels = [];

    const baseValues = [20, 40, 60, 80, 100];
    const percentageIncreases = [115.0, 120.0, 125.0, 130.0, 140.0];

    const physicalDamage = params.player.physicalDamage;

    const relicBonus = params.bonus.relicBonus;
    const unitedBonus = params.bonus.unitedAttackBonus;

    const eviscerationBonus = params.bonus.eviscerationBonus;
	const eviscerationBonusII = params.bonus.eviscerationBonusII;
    const eviscerationBonusAlm = params.bonus.eviscerationBonusAlm;

    for (let level = 0; level < 5; level++) {
        const damage = (baseValues[level] + physicalDamage * (percentageIncreases[level] / 100 + eviscerationBonus + eviscerationBonusII + eviscerationBonusAlm)) * (1 + relicBonus + unitedBonus);
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params, { });
}

function OtherworldBoost(params){
    const damageLevels = [];

    const percentageIncreases = [25.0, 30.0, 35.0, 40.0, 45.0];

    const physicalDamage = params.player.physicalDamage;

    for (let level = 0; level < 5; level++) {
        const damage = physicalDamage * (percentageIncreases[level] / 100);
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params, {
        damageEffectType: 'dot',
     });
}

function Annihilation(params){
    const damageLevels = [];

    const percentageIncreases = [120.0, 145.0, 170.0, 200.0];

    const physicalDamage = params.player.physicalDamage;
	
	const annihilationBonus = params.bonus.annihilationBonus;

    for (let level = 0; level < 4; level++) {
        const damage = physicalDamage * (percentageIncreases[level] / 100 + annihilationBonus);
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params, { });
}

function AnnihilationCrit(params){
    const damageLevels = [];

    const percentageIncreases = [120.0, 145.0, 170.0, 200.0];
    const critPowerIncreases = [2.0, 2.5, 3.0, 3.5];

    const physicalDamage = params.player.physicalDamage;
    const rage = params.player.rage;
    const critPower = params.player.critPower;

    const isPVP = params.target.isPVPTarget;
    const resilience = isPVP ? params.target.targetResilience : 0;
	
	const annihilationBonus = params.bonus.annihilationBonus;

    for (let level = 0; level < 4; level++) {
        var damage 
        if (isPVP) {
            damage = physicalDamage * (percentageIncreases[level] / 100 + annihilationBonus) * (1.5 + critPower + rage * (critPowerIncreases[level] / 100)) * (1 - resilience);
        } else {
            damage = physicalDamage * (percentageIncreases[level] / 100 + annihilationBonus) * (2 + critPower + rage * (critPowerIncreases[level] / 100));
        }
        
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params, { });
}

function WideScope(skillLevels){
    const damageLevels = [];

    const percentageIncrease = 0.65;

    for (let level = 0; level < 4; level++) {
        const damage = skillLevels[level] * percentageIncrease;
        damageLevels.push(parseFloat(damage.toFixed(2))); 
    }

    return damageLevels;
}

function UnderworldHand(params){
    const damageLevels = [];

    const percentageIncreases = [55.0, 65.0, 75.0, 90.0];

    const physicalDamage = params.player.physicalDamage;

    const underworldHandBonusAlm = params.bonus.underworldHandBonusAlm;

    for (let level = 0; level < 4; level++) {
        const damage = physicalDamage * (percentageIncreases[level] / 100 + underworldHandBonusAlm);
        damageLevels.push(damage * 2);
    }

    return calculateDamage(damageLevels, params, { });
}

function RawExplosionOfChaos(params){
    const damageLevels = [];

    const percentageIncreases = [130.0, 135.0, 145.0, 160.0];

    const physicalDamage = params.player.physicalDamage;
	
	const explodionBonus = params.bonus.explodionBonus;
    const explodionBonusAlm = params.bonus.explodionBonusAlm;

	const devastatingFlashBonus = params.bonus.devastatingFlashBonus;

    for (let level = 0; level < 4; level++) {
        const damage = physicalDamage * (percentageIncreases[level] / 100 + explodionBonus + explodionBonusAlm) * (1 + devastatingFlashBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function ExplosionOfChaos(damageLevels, params){
    return calculateDamage(damageLevels, params, { });
}

function DemonicExplosionOfChaos(damageLevels, params){
    return calculateDamage(damageLevels, params, { 
        isDemonic: true
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
