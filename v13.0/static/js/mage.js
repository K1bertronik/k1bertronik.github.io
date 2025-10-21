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
        fireBall: FireBall(params),
        timeWarp: TimeWarp(params),
        shatteredStone: ShatteredStone(params),
        blazingGround: BlazingGround(params),
        frostbolt: Frostbolt(params),
        overload: Overload(params),
        sheafOfLightning: SheafOfLightning(Overload(params), params),
        roaringFlame: RoaringFlame(params),
        auraOfFire: AuraOfFire(params),
      };
      
      const rowsMap = {
        autoattack: "autoattackRow",
        fireBall: "fireBallRow",
        timeWarp: "timeWarpRow",
        shatteredStone: "shatteredStoneRow",
        blazingGround: "blazingGroundRow",
        frostbolt: "frostboltRow",
        overload: "overloadRow",
        sheafOfLightning: "sheafOfLightningRow",
        roaringFlame: "roaringFlameRow",
        auraOfFire: "auraOfFireRow",
      };
      
  
    for (const [key, rowId] of Object.entries(rowsMap)) {
      updateDamageValues(results[key], rowId);
    }
  });

function collectPlayerParams() {
    return {
        health: parseFloat(document.getElementById('health').value) || 0,

        magicalDamage: parseFloat(document.getElementById('magicdmg').value) || 0,
        penetration: (parseFloat(document.getElementById('penetration').value) || 0) / 100,
        ferocity: (parseFloat(document.getElementById('ferocity').value) || 0) / 100,
        skillPower: (parseFloat(document.getElementById('skillPower').value) || 0) / 100,
        attackStrength: (parseFloat(document.getElementById('attackStrength').value) || 0) / 100,
        critPower: (parseFloat(document.getElementById('critPower').value) || 0) / 100,
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

        fireBallBonus: document.getElementById('fireBallBonus').checked ? 0.05 : 0,
        fireBallBonusI: (parseFloat(document.getElementById('fireBallBonusI').value) || 0) / 100,
        fireBallBonusAlm: (parseFloat(document.getElementById('fireBallBonusAlm').value) || 0) / 100,

        overloadBonus: (parseFloat(document.getElementById('overloadBonus').value) || 0) / 100,
        overloadBonusAlm: (parseFloat(document.getElementById('overloadBonusAlm').value) || 0) / 100,

        auraOfFireBonusI: (parseFloat(document.getElementById('auraOfFireBonusI').value) || 0) / 100,

        blazingGroundBonusI: document.getElementById('fireBallBonus').checked ? 0.02 : 0,

        timeWarpBonusII: (parseFloat(document.getElementById('timeWarpBonusII').value) || 0) / 100,

        shatteredStoneBonusIII: document.getElementById('shatteredStoneBonusIII').checked ? 0.07 : 0,
        shatteredStoneBonusAlm: (parseFloat(document.getElementById('shatteredStoneBonusAlm').value) || 0) / 100,

        frostboltBonusIII: document.getElementById('frostboltBonusIII').checked ? 0.075 : 0,

        magmaBoulderBonus: document.getElementById('magmaBoulderBonus').checked ? 0.15 : 0,

        roaringFlameBonusAlm: (parseFloat(document.getElementById('roaringFlameBonusAlm').value) || 0) / 100,

        excessEnergyBonus: document.getElementById('excessEnergyBonus').checked ? 0.14 : 0,

        natureBonus: document.getElementById('natureBonus').checked ? 0.10 : 0,

        elementalPowerBonus: (parseFloat(document.getElementById('elementalPowerBonus').value) || 0) / 100,

        isPyromaniac: document.getElementById('isPyromaniac').checked,
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

    const targetDef = target.targetMagicalDefence;

    const targetReduction = Math.max(0, targetDef - totalPenetration);

    const isPVP = target.isPVPTarget;
    const resilience = isPVP ? target.targetResilience : 0;
    const ferocity = isPVP ? player.ferocity : 0;

    const skillPower = isSkill ? player.skillPower : 0;

    const pveBonusI = (isSkill && !isPVP) ? bonus.pveBonusI : 0;
    const pveBonusII = !isPVP ? bonus.pveBonusII : 0;
    const toughnessBonus = !isPVP ? bonus.toughnessBonus : 0;
    
    const excessEnergyBonus = bonus.excessEnergyBonus;
    const natureBonus = (damageEffectType === 'instant' && isSkill) ? bonus.natureBonus : 0;
    const elementalPowerBonus = bonus.elementalPowerBonus;

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
            * (1 + damageBonus)
            * (1 + excessEnergyBonus)
            * (1 + natureBonus)
            * (1 + elementalPowerBonus);

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
    });
}

function FireBall(params){
    const damageLevels = [];

    const baseValues = [30, 55, 80, 105, 130];
    const percentageIncreases = [130.0, 140.0, 150.0, 160.0, 170.0];

    const isPyromaniac = params.bonus.isPyromaniac;

    const magicalDamage = params.player.magicalDamage;
    const critPower = params.player.critPower;

    const isPVP = params.target.isPVPTarget;
    const resilience = isPVP ? params.target.targetResilience : 0;

    const relicBonus = params.bonus.relicBonus;
    const unitedBonus = params.bonus.unitedAttackBonus;

    const fireBallBonus = params.bonus.fireBallBonus;
    const fireBallBonusI = params.bonus.fireBallBonusI;
    const fireBallBonusAlm = params.bonus.fireBallBonusAlm;

    for (let level = 0; level < 5; level++) {
        var damage = (baseValues[level] + magicalDamage * (percentageIncreases[level] / 100 + fireBallBonus + fireBallBonusI + fireBallBonusAlm)) * (1 + relicBonus + unitedBonus);
        
        if (isPyromaniac) {
            if (isPVP) {
                damage = damage * (1.5 + 0.5 + critPower) * (1 - resilience);
            } else {
                damage = damage * (2 + 0.5 + critPower);
            }
        }
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params, { });
}

function TimeWarp(params){
    const damageLevels = [];

    const percentageIncreases = [115.0, 120.0, 125.0, 135.0, 145.0];

    const magicalDamage = params.player.magicalDamage;

    const relicBonus = params.bonus.relicBonus;
    const timeWarpBonusII = params.bonus.timeWarpBonusII;

    for (let level = 0; level < 5; level++) {
		const damage = magicalDamage * (percentageIncreases[level] / 100 + timeWarpBonusII) * (1 + relicBonus);
		damageLevels.push(damage);
	}

    return calculateDamage(damageLevels, params, { });
}

function ShatteredStone(params){
    const damageLevels = [];

    const percentageIncreases = [125.0, 135.0, 145.0, 160.0, 175.0];

    const magicalDamage = params.player.magicalDamage;

    const relicBonus = params.bonus.relicBonus;
    const shatteredStoneBonusIII = params.bonus.shatteredStoneBonusIII;
    const shatteredStoneBonusAlm = params.bonus.shatteredStoneBonusAlm;

    for (let level = 0; level < 5; level++) {
		const damage = magicalDamage * (percentageIncreases[level] / 100 + shatteredStoneBonusIII + shatteredStoneBonusAlm) * (1 + relicBonus);
		damageLevels.push(damage);
	}

    return calculateDamage(damageLevels, params, { });
}

function BlazingGround(params){
    const damageLevels = [];

    const percentageIncreases = [20.0, 25.0, 30.0, 35.0];

    const isPyromaniac = params.bonus.isPyromaniac;

    const magicalDamage = params.player.magicalDamage;
    const critPower = params.player.critPower;

    const isPVP = params.target.isPVPTarget;
    const resilience = isPVP ? params.target.targetResilience : 0;

    const blazingGroundBonusI = params.bonus.blazingGroundBonusI;

    for (let level = 0; level < 4; level++) {
		var damage = magicalDamage * (percentageIncreases[level] / 100 + blazingGroundBonusI);

        if (isPyromaniac) {
            if (isPVP) {
                damage = damage * (1.5 + 0.5 + critPower) * (1 - resilience);
            } else {
                damage = damage * (2 + 0.5 + critPower);
            }
        }
		damageLevels.push(damage);
	}

    return calculateDamage(damageLevels, params, {
        damageEffectType: "dot",
    });
}

function Frostbolt(params){
    const damageLevels = [];

    const percentageIncreases = [135.0, 145.0, 160.0, 180.0];

    const isPyromaniac = params.bonus.isPyromaniac;

    const magicalDamage = params.player.magicalDamage;
    const critPower = params.player.critPower;

    const isPVP = params.target.isPVPTarget;
    const resilience = isPVP ? params.target.targetResilience : 0;

    const frostboltBonusIII = params.bonus.frostboltBonusIII;
    const magmaBoulderBonus = params.bonus.magmaBoulderBonus;

    for (let level = 0; level < 4; level++) {
		var damage = magicalDamage * (percentageIncreases[level] / 100 + frostboltBonusIII) * (1 + magmaBoulderBonus);

        if (isPyromaniac) {
            if (isPVP) {
                damage = damage * (1.5 + 0.5 + critPower) * (1 - resilience);
            } else {
                damage = damage * (2 + 0.5 + critPower);
            }
        }
		damageLevels.push(damage);
	}

    return calculateDamage(damageLevels, params, { });
}

function Overload(params){
    const damageLevels = [];

    const percentageIncreases = [30.0, 40.0, 50.0, 60.0];

    const magicalDamage = params.player.magicalDamage;

    const overloadBonus = params.bonus.overloadBonus;
    const overloadBonusAlm = params.bonus.overloadBonusAlm;

    for (let level = 0; level < 4; level++) {
		const damage = magicalDamage * (percentageIncreases[level] / 100 + overloadBonus + overloadBonusAlm);
		damageLevels.push(damage);
	}

    return calculateDamage(damageLevels, params, {
        damageEffectType: "dot",
    });
}

function SheafOfLightning(skillLevels, params){
    const healLevels = [];

    const percentageIncrease = 0.65;

    for (let level = 0; level < 4; level++) {
		const heal = skillLevels[level] * percentageIncrease;
		healLevels.push(heal);
	}

	return calculateHeal(healLevels, params);
}

function RoaringFlame(params){
    const damageLevels = [];

    const percentageIncreases = [100.0, 110.0, 120.0, 135.0];

    const isPyromaniac = params.bonus.isPyromaniac;

    const magicalDamage = params.player.magicalDamage;
    const critPower = params.player.critPower;

    const isPVP = params.target.isPVPTarget;
    const resilience = isPVP ? params.target.targetResilience : 0;

    const roaringFlameBonusAlm = params.bonus.roaringFlameBonusAlm;

    for (let level = 0; level < 4; level++) {
		var damage = magicalDamage * (percentageIncreases[level] / 100 + roaringFlameBonusAlm);

        if (isPyromaniac) {
            if (isPVP) {
                damage = damage * (1.5 + 0.5 + critPower) * (1 - resilience);
            } else {
                damage = damage * (2 + 0.5 + critPower);
            }
        }
		damageLevels.push(damage);
	}

    return calculateDamage(damageLevels, params, { });
}

function AuraOfFire(params){
    const damageLevels = [];

    const percentageIncreases = [25.0, 30.0, 35.0, 40.0];

    const isPyromaniac = params.bonus.isPyromaniac;

    const magicalDamage = params.player.magicalDamage;
    const critPower = params.player.critPower;

    const isPVP = params.target.isPVPTarget;
    const resilience = isPVP ? params.target.targetResilience : 0;

    const auraOfFireBonusI = params.bonus.auraOfFireBonusI;

    for (let level = 0; level < 4; level++) {
		var damage = magicalDamage * (percentageIncreases[level] / 100 + auraOfFireBonusI);

        if (isPyromaniac) {
            if (isPVP) {
                damage = damage * (1.5 + 0.5 + critPower) * (1 - resilience);
            } else {
                damage = damage * (2 + 0.5 + critPower);
            }
        }
		damageLevels.push(damage);
	}

    return calculateDamage(damageLevels, params, {
        damageEffectType: "dot",
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
