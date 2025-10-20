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
        blowOfSpirits: BlowOfSpirits(params),
        eaglesEyeMag: EaglesEyeMag(params),
        eaglesEyePhys: EaglesEyePhys(params),
        bearStaminaHealth: BearStaminaHealth(params),
        bearStamina: BearStamina(params),
        wolfsAlacrity: WolfsAlacrity(params),
        curseOfPlague: CurseOfPlague(params),
        swoopingArmy: SwoopingArmy(params),
        frenzy: Frenzy(params),
        ignition: Ignition(params),
      };
      
      const rowsMap = {
        autoattack: "autoattackRow",
        blowOfSpirits: "blowOfSpiritsRow",
        eaglesEyeMag: "eaglesEyeMagRow",
        eaglesEyePhys: "eaglesEyePhysRow",
        bearStaminaHealth: "bearStaminaHealthRow",
        bearStamina: "bearStaminaRow",
        wolfsAlacrity: "wolfsAlacrityRow",
        curseOfPlague: "curseOfPlagueRow",
        swoopingArmy: "swoopingArmyRow",
        frenzy: "frenzyRow",
        ignition: "ignitionRow",
      };
      
  
    for (const [key, rowId] of Object.entries(rowsMap)) {
      updateDamageValues(results[key], rowId);
    }
  });

function collectPlayerParams() {
    return {
        maxHealth: parseFloat(document.getElementById('maxHealth').value) || 0,
        currentHealth: parseFloat(document.getElementById('currentHealth').value) || 0,

        physicalDamage: parseFloat(document.getElementById('physdmg').value) || 0,
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

        instDmgBonus: (parseFloat(document.getElementById('instDmgBonus').value) || 0) / 100,
        dotDmgBonus: (parseFloat(document.getElementById('dotDmgBonus').value) || 0) / 100,
  
        instPenBonus: (parseFloat(document.getElementById('instPenBonus').value) || 0) / 100,
        dotPenBonus: (parseFloat(document.getElementById('dotPenBonus').value) || 0) / 100,

        pveBonusI: (parseFloat(document.getElementById('pveBonusI').value) || 0) / 100,
        pveBonusII: (parseFloat(document.getElementById('pveBonusII').value) || 0) / 100,

        toughnessBonus: (parseFloat(document.getElementById('toughnessBonus').value) || 0) / 100,

        eaglesEyeBonus: document.getElementById('eaglesEyeBonus').checked ? 0.03 : 0,
        eaglesEyeBonusII: (parseFloat(document.getElementById('eaglesEyeBonusII').value) || 0) / 100,
        eaglesEyeBonusAlm: document.getElementById('eaglesEyeBonusAlm').value,

        frenzyBonus: (parseFloat(document.getElementById('frenzyBonus').value) || 0) / 100,
        frenzyBonusI: (parseFloat(document.getElementById('frenzyBonusI').value) || 0) / 100,

        wolfsAlacrityBonusI: (parseFloat(document.getElementById('wolfsAlacrityBonusI').value) || 0) / 100,

        bearStaminaBonusII: (parseFloat(document.getElementById('bearStaminaBonusII').value) || 0) / 100,
        bearStaminaBonusIII: document.getElementById('bearStaminaBonusIII').checked ? 0.06 : 0,

        blowOfSpiritsBonusIII: (parseFloat(document.getElementById('blowOfSpiritsBonusIII').value) || 0) / 100,
        blowOfSpiritsBonusAlm: document.getElementById('blowOfSpiritsBonusAlm').value,

        swoopingArmyBonusIII: (parseFloat(document.getElementById('swoopingArmyBonusIII').value) || 0) / 100,

        shivEarthBonus: (parseFloat(document.getElementById('shivEarthBonus').value) || 0) / 100,
    };
}

function calculateDamage(rawDamageLevels, params, options = {}) {
    const {
        isSkill = true,
        damageType = 'physical',
        damageEffectType = 'instant',
    } = options;

    const { player, target, bonus } = params;

    const totalDamageLevels = [];

    const targetPhysicalDef = target.targetPhysicalDefence;
    const targetMagicalDef = target.targetMagicalDefence;
    
    let targetReduction = 0;

    let basePenetration = player.penetration;

    let penetrationBonus = 0;
    if (damageEffectType === 'instant') {
        penetrationBonus = bonus.instPenBonus;
    } else if (damageEffectType === 'dot') {
        penetrationBonus = bonus.dotPenBonus;
    }
    const totalPenetration = basePenetration + penetrationBonus;

    if (damageType === 'physical') {
        targetReduction = (totalPenetration > targetPhysicalDef) ? 0 : targetPhysicalDef - totalPenetration;
    } else if (damageType === 'magical'){
        targetReduction = (totalPenetration > targetMagicalDef) ? 0 : targetMagicalDef - totalPenetration;
    }

    const isPVP = target.isPVPTarget;
    const resilience = isPVP ? target.targetResilience : 0;
    const ferocity = isPVP ? player.ferocity : 0;

    const skillPower = isSkill ? player.skillPower : 0;

    const pveBonusI = (isSkill && !isPVP) ? bonus.pveBonusI : 0;
    const pveBonusII = !isPVP ? bonus.pveBonusII : 0;
    const toughnessBonus = !isPVP ? bonus.toughnessBonus : 0;

    const shivEarthBonus = bonus.shivEarthBonus;

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
            * (1 + skillPower)
            * (1 + toughnessBonus)
            * (1 + damageBonus)
            * (1 + shivEarthBonus);

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
    });
}

function BlowOfSpirits(params){
    const damageLevels = [];

    const basePhysValues = [20, 40, 60, 80, 100];
    const baseMagValues = [30, 55, 80, 105, 130];

    const percentagePhysIncreases = [45.0, 50.0, 55.0, 65.0, 75.0];
    const percentageMagIncreases = [125.0, 130.0, 135.0, 145.0, 155.0];

    const physicalDamage = params.player.physicalDamage;
    const magicalDamage = params.player.magicalDamage;

    const relicBonus = params.bonus.relicBonus;
    const unitedBonus = params.bonus.unitedAttackBonus;

    const blowOfSpiritsBonusIII = params.bonus.blowOfSpiritsBonusIII;

    let blowOfSpiritsBonusAlm = params.bonus.blowOfSpiritsBonusAlm;

    blowOfSpiritsBonusAlm = blowOfSpiritsBonusAlm.split(',');

    const physblowOfSpiritsBonusAlm = parseFloat(blowOfSpiritsBonusAlm[0]) / 100;
    const magblowOfSpiritsBonusAlm = parseFloat(blowOfSpiritsBonusAlm[1]) / 100;

    for (let level = 0; level < 5; level++) {
        var physdmg = basePhysValues[level] + (physicalDamage * (percentagePhysIncreases[level] / 100 + physblowOfSpiritsBonusAlm));
        var magdmg = baseMagValues[level] + (magicalDamage * (percentageMagIncreases[level] / 100 + magblowOfSpiritsBonusAlm + blowOfSpiritsBonusIII));
        var damage = (physdmg + magdmg) * (1 + relicBonus + unitedBonus);
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params, {
        damageType: "magical",
    });
}

function EaglesEyeMag(params){
    const damageLevels = [];

    const percentageIncreases = [30.0, 40.0, 45.0, 50.0, 60.0];

    const magicalDamage = params.player.magicalDamage;

    const relicBonus = params.bonus.relicBonus;

    const eaglesEyeBonus = params.bonus.eaglesEyeBonus;
    let eaglesEyeBonusAlm = params.bonus.eaglesEyeBonusAlm;

    eaglesEyeBonusAlm = eaglesEyeBonusAlm.split(',');

    const magEaglesEyeBonusAlm = parseFloat(eaglesEyeBonusAlm[1]) / 100;

    for (let level = 0; level < 5; level++) {
        const damage = magicalDamage * (percentageIncreases[level] / 100 + eaglesEyeBonus + magEaglesEyeBonusAlm) * (1 + relicBonus);
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params, {
        damageType: 'magical',
    });
}

function EaglesEyePhys(params){
    const damageLevels = [];

    const percentageIncreases = [10.0, 15.0, 20.0, 25.0, 30.0];

    const physicalDamage = params.player.physicalDamage;

    const relicBonus = params.bonus.relicBonus;

    const eaglesEyeBonus = params.bonus.eaglesEyeBonus;
    const eaglesEyeBonusII = params.bonus.eaglesEyeBonusII;
    let eaglesEyeBonusAlm = params.bonus.eaglesEyeBonusAlm;
    
    eaglesEyeBonusAlm = eaglesEyeBonusAlm.split(',');

    const physEaglesEyeBonusAlm = parseFloat(eaglesEyeBonusAlm[0]) / 100;

    for (let level = 0; level < 5; level++) {
        const damage = physicalDamage * (percentageIncreases[level] / 100 + eaglesEyeBonus + eaglesEyeBonusII + physEaglesEyeBonusAlm) * (1 + relicBonus);
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params, {
        damageEffectType: "dot",
    });
}

function BearStaminaHealth(params){
    const healLevels = [];

    const percentageIncreases = [3.0, 4.0, 5.0, 6.0, 8.0];

    const maxHealth = params.player.maxHealth;
    const currentHealth = params.player.currentHealth;

    for (let level = 0; level < 5; level++) {
        const heal = (maxHealth - currentHealth) * (percentageIncreases[level] / 100);
        healLevels.push(heal);
    }

    return calculateHeal(healLevels, params);
}

function BearStamina(params){
    const healLevels = [];

    const percentageIncreases = [105.0, 115.0, 125.0, 135.0, 150.0];

    const magicalDamage = params.player.magicalDamage;

    const bearStaminaBonusII = params.bonus.bearStaminaBonusII;
    const bearStaminaBonusIII = params.bonus.bearStaminaBonusIII;

    for (let level = 0; level < 5; level++) {
        const heal = magicalDamage * (percentageIncreases[level] / 100 + bearStaminaBonusII + bearStaminaBonusIII);
        healLevels.push(heal);
    }

    return calculateHeal(healLevels, params);
}

function WolfsAlacrity(params){
    const damageLevels = [];

    const percentagePhysIncreases = [20.0, 25.0, 30.0, 35.0, 40.0];
    const percentageMagIncreases = [25.0, 30.0, 35.0, 40.0, 45.0];

    const physicalDamage = params.player.physicalDamage;
    const magicalDamage = params.player.magicalDamage;

    wolfsAlacrityBonusI = params.bonus.wolfsAlacrityBonusI;

    for (let level = 0; level < 5; level++) {
        if (physicalDamage > magicalDamage) {
            var damage = physicalDamage * (percentagePhysIncreases[level] / 100 + wolfsAlacrityBonusI);
        } else {
            var damage = magicalDamage * (percentageMagIncreases[level] / 100);
        }
        damageLevels.push(damage);
    }

    if (physicalDamage > magicalDamage) {
        return calculateDamage(damageLevels, params, {
            damageEffectType: "dot",
        });
    } else {
        return calculateDamage(damageLevels, params, {
            damageType: "magical",
            damageEffectType: "dot",
        });
    }
}

function CurseOfPlague(params){
    const damageLevels = [];

    const percentageIncreases = [14.0, 16.0, 18.0, 20.0];

    const physicalDamage = params.player.physicalDamage;

    for (let level = 0; level < 4; level++) {
        const damage = physicalDamage * (percentageIncreases[level] / 100) ;
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params, {
        damageEffectType: "dot",
    });
}

function SwoopingArmy(params){
    const damageLevels = [];

    const percentageIncreases = [35.0, 45.0, 50.0, 60.0];

    const magicalDamage = params.player.magicalDamage;

    const swoopingArmyBonusIII = params.bonus.swoopingArmyBonusIII;

    for (let level = 0; level < 4; level++) {
        const damage = magicalDamage * (percentageIncreases[level] / 100 + swoopingArmyBonusIII);
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params, {
        damageType: "magical",
        damageEffectType: "dot",
    });
}

function Frenzy(params){
    const damageLevels = [];

    const countOfHits = [3, 4, 4, 5];
    const percentageIncreases = [35.0, 45.0, 50.0, 60.0];

    const physicalDamage = params.player.physicalDamage;

    const frenzyBonus = params.bonus.frenzyBonus;
    const frenzyBonusI = params.bonus.frenzyBonusI;

    for (let level = 0; level < 4; level++) {
        const damage = countOfHits[level] * (physicalDamage * (percentageIncreases[level] / 100 + frenzyBonus + frenzyBonusI));
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params, { });
}

function Ignition(params){
    const damageLevels = [];

    const percentageIncrease = 0.15;

    const magicalDamage = params.player.magicalDamage;

    const damage = magicalDamage * percentageIncrease;
    damageLevels.push(damage);

    return calculateDamage(damageLevels, params, {
        damageType: "magical",
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
