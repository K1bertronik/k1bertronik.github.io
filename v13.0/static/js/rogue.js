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
        mercilessStrike: MercilessStrike(params),
        elusiveJump: ElusiveJump(params),
        elusiveJumpWithPoison: ElusiveJumpWithPoison(ElusiveJump(params)),
        poisonousBlades: PoisonousBlades(params),
        ricochet: Ricochet(params),
        flurryOfSteel: FlurryOfSteel(params),
        bladeShard: BladeShard(FlurryOfSteel(params)),
        trickiestTech: TrickiestTech(params),
        trickiestTechWithPoison: TrickiestTechWithPoison(params),
        trickiestTechHeal: TrickiestTechHeal(params),
        stingBee: StingBee(params),
      };
      
      const rowsMap = {
        autoattack: "autoattackRow",
        mercilessStrike: "mercilessStrikeRow",
        elusiveJump: "elusiveJumpRow",
        elusiveJumpWithPoison: "elusiveJumpWithPoisonRow",
        poisonousBlades: "poisonousBladesRow",
        ricochet: "ricochetRow",
        flurryOfSteel: "flurryOfSteelRow",
        bladeShard: "bladeShardRow",
        trickiestTech: "trickiestTechRow",
        trickiestTechWithPoison: "trickiestTechWithPoisonRow",
        trickiestTechHeal: "trickiestTechWithPoisonHealRow",
        stingBee: "stingBeeRow",
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
    };
}

function collectTargetParams() {
    return {
        isPVPTarget: document.getElementById('pvpSwitch').checked,

        maxHealth: parseFloat(document.getElementById('targetMaxHealth').value) || 0,
        currentHealth: parseFloat(document.getElementById('targetCurrentHealth').value) || 0,

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

        strikeBonus: document.getElementById('strikeBonus').checked ? 0.05 : 0,
        strikeBonusIII: document.getElementById('strikeBonusIII').checked ? 0.08 : 0,
        strikeBonusAlm: (parseFloat(document.getElementById('strikeBonusAlm').value) || 0) / 100,

        jumpBonusI: (parseFloat(document.getElementById('jumpBonusI').value) || 0) / 100,
        jumpBonusAlm: (parseFloat(document.getElementById('jumpBonusAlm').value) || 0) / 100,

        poisonBonusAlm: (parseFloat(document.getElementById('poisonBonusAlm').value) || 0) / 100,

        flurryBonusI: document.getElementById('flurryBonusI').checked ? 0.07 : 0,

        ricochetBonusIII: document.getElementById('ricochetBonusIII').checked ? 0.05 : 0,
        ricochetBonusAlm: (parseFloat(document.getElementById('ricochetBonusAlm').value) || 0) / 100,

        bladeEchoBonus: (parseFloat(document.getElementById('bladeEchoBonus').value) || 0) / 100,

        seriesBonus: (parseFloat(document.getElementById('seriesBonus').value) || 0) / 100,

        ruthlessnessScaleLevel: parseFloat(document.getElementById('ruthlessnessScale').value) || 0,

        ruthlessnessBonusAlm: parseFloat(document.getElementById('ruthlessnessBonusAlm').value) || 0,
    };
}

function calculateDamage(rawDamageLevels, params, options = {}) {
    const {
        isSkill = true,
        damageEffectType = 'instant',
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

    const targetDef = target.targetPhysicalDefence;

    const targetReduction = Math.max(0, targetDef - totalPenetration);

    const isPVP = target.isPVPTarget;
    const resilience = isPVP ? target.targetResilience : 0;
    const ferocity = isPVP ? player.ferocity : 0;

    const skillPower = isSkill ? player.skillPower : 0;

    const pveBonusI = (isSkill && !isPVP) ? bonus.pveBonusI : 0;
    const pveBonusII = !isPVP ? bonus.pveBonusII : 0;
    const toughnessBonus = !isPVP ? bonus.toughnessBonus : 0;

    let damageBonus = 0;
    if (isSkill && damageEffectType === 'instant') {
        damageBonus = bonus.instDmgBonus;
    } else if (isSkill && damageEffectType === 'dot') {
        damageBonus = bonus.dotDmgBonus;
    }

    const bladeEchoBonus = (damageEffectType === "instant") ? bonus.bladeEchoBonus : 0;

    const seriesBonus = (damageEffectType === "instant") ? bonus.seriesBonus : 0;

    const ruthlessnessScaleBonus = RuthlessnessScale(bonus.ruthlessnessScaleLevel, params);

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
            * (1 + damageBonus)
            * (1 + seriesBonus)
            * (1 + bladeEchoBonus)
            * (1 + ruthlessnessScaleBonus);

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

function MercilessStrike(params){
    const damageLevels = [];

    const baseValues = [20, 40, 60, 80, 100];
    const percentageIncreases = [140.0, 145.0, 150.0, 155.0, 160.0];

    const physicalDamage = params.player.physicalDamage;

    const relicBonus = params.bonus.relicBonus;
    const unitedBonus = params.bonus.unitedAttackBonus;

    const strikeBonus = params.bonus.strikeBonus;
    const strikeBonusIII = params.bonus.strikeBonusIII;
    const strikeBonusAlm = params.bonus.strikeBonusAlm;

    for (let level = 0; level < 5; level++) {
        const damage = (baseValues[level] + physicalDamage * (percentageIncreases[level] / 100 + strikeBonus + strikeBonusIII + strikeBonusAlm)) * (1 + relicBonus + unitedBonus);
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params, { });
}

function ElusiveJump(params){
    const damageLevels = [];

    const percentageIncreases = [115.0, 120.0, 130.0, 140.0];

    const physicalDamage = params.player.physicalDamage;

    const jumpBonusI = params.bonus.jumpBonusI;
    const jumpBonusAlm = params.bonus.jumpBonusAlm;

    for (let level = 0; level < 4; level++) {
        const damage = physicalDamage * (percentageIncreases[level] / 100 + jumpBonusI + jumpBonusAlm);
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params, { });
}

function ElusiveJumpWithPoison(jumpDamage){
    const damageLevels = [];

    const percentageIncreases = [115.0, 120.0, 130.0, 140.0];

    for (let level = 0; level < 4; level++) {
        var damage = jumpDamage[level] * (percentageIncreases[level] / 100);
        damage = parseFloat(damage.toFixed(2));

        damageLevels.push(damage);
    }

    return damageLevels;
}

function PoisonousBlades(params){
    const damageLevels = [];

    const percentageIncreases = [30.0, 35.0, 40.0, 50.0];

    const physicalDamage = params.player.physicalDamage;

    const poisonBonusAlm = params.bonus.poisonBonusAlm;

    for (let level = 0; level < 4; level++) {
        const damage = physicalDamage * (percentageIncreases[level] / 100 + poisonBonusAlm);
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params, {
        damageEffectType: 'dot',
    });
}

function Ricochet(params){
    const damageLevels = [];

    const percentageIncreases = [75.0, 80.0, 85.0, 95.0];

    const physicalDamage = params.player.physicalDamage;

    const ricochetBonusIII = params.bonus.ricochetBonusIII;
    const ricochetBonusAlm = params.bonus.ricochetBonusAlm;
    
    for (let level = 0; level < 4; level++) {
        const damage = physicalDamage * (percentageIncreases[level] / 100 + ricochetBonusIII + ricochetBonusAlm);
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params, { });
}

function FlurryOfSteel(params){
    const damageLevels = [];

    const percentageIncreases = [115.0, 120.0, 135.0, 150.0];

    const physicalDamage = params.player.physicalDamage;

    const flurryBonusI = params.bonus.flurryBonusI;

    for (let level = 0; level < 4; level++) {
        const damage = physicalDamage * (percentageIncreases[level] / 100 + flurryBonusI);
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params, { });
}

function BladeShard(flurryDamage){
    const damageLevels = [];

    const percentageIncrease = 60;

    for (let level = 0; level < 4; level++) {
        var damage = flurryDamage[level] * (percentageIncrease / 100);
        damage = parseFloat(damage.toFixed(2));

        damageLevels.push(damage);
    }

    return damageLevels;
}

function TrickiestTech(params){
    const damageLevels = [];

    const percentageIncreases = [110.0, 115.0, 120.0, 125.0];

    const physicalDamage = params.player.physicalDamage;

    for (let level = 0; level < 4; level++) {
        const damage = physicalDamage * (percentageIncreases[level] / 100);
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params, { });
}

function TrickiestTechWithPoison(params){
    const damageLevels = [];

    const percentageIncreases = [120.0, 130.0, 140.0, 155.0];

    const physicalDamage = params.player.physicalDamage;

    for (let level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100);
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params, { });
}

function TrickiestTechHeal(params){
    const healLevels = [];

    const percentageIncreases = [8.0, 10.0, 12.0, 15.0];

    const health = params.player.health;

    for (let level = 0; level < 4; level++) {
        const heal = health * (percentageIncreases[level] / 100);
        healLevels.push(heal);
    }

    return calculateHeal(healLevels, params);
}

function StingBee(params){
    const damageLevels = [];

    const percentageIncrease = 0.4;

    const physicalDamage = params.player.physicalDamage;

    const damage = physicalDamage * percentageIncrease;

    damageLevels.push(damage);

    return calculateDamage(damageLevels, params, { });
}

function RuthlessnessScale(level, params){

    const percentageIncreases = [6.0, 5.0, 4.0, 3.0];

    const maxHealth = params.target.maxHealth;
    const currentHealth = params.target.currentHealth;
    const ruthlessnessBonusAlm = params.bonus.ruthlessnessBonusAlm;

    if (!maxHealth || maxHealth <= 0) {
        return 0;
    }

    const missingPercent = (maxHealth - currentHealth) / maxHealth;

    const baseBonus = missingPercent * (100 / percentageIncreases[level-1]) * 0.01;

    const bonus = baseBonus * (1 + ruthlessnessBonusAlm);

    return bonus;
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
