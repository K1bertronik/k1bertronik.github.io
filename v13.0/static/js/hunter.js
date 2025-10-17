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
        fatalShot: FatalShot(params),
        poisonedArrow: PoisonedArrow(params),
        poisonousSaber: PoisonousSaber(params),
        sappingShot: SappingShot(params),
        pathfindersShot: PathfindersShot(params),
        forestTrap: ForestTrap(params),
        cobraBite: CobraBite(params),
        poisonedTip: PoisonedTip(params),
      };
      
      const rowsMap = {
        autoattack: "autoattackRow",
        fatalShot: "fatalShotRow",
        poisonedArrow: "poisonedArrowRow",
        poisonousSaber: "poisonousSaberRow",
        sappingShot: "sappingShotRow",
        pathfindersShot: "pathfindersShotRow",
        forestTrap: "forestTrapRow",
        cobraBite: "cobraBiteRow",
        poisonedTip: "poisonedTipRow",
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
        cooldown: (parseFloat(document.getElementById('cooldown').value) || 0) / 100,
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
        huntersMarkLevel: parseFloat(document.getElementById('huntersMarkLevel').value) || 0,
        huntersMarkCount: parseFloat(document.getElementById('huntersMarkCount').value) || 0,

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

        fatalShotBonusII: (parseFloat(document.getElementById('fatalShotBonusII').value) || 0) / 100,
        fatalShotBonusAlm: (parseFloat(document.getElementById('fatalShotBonusAlm').value) || 0) / 100,

        poisonArrowBonusII: (parseFloat(document.getElementById('poisonArrowBonusII').value) || 0) / 100,
        poisonArrowBonusAlm: (parseFloat(document.getElementById('poisonArrowBonusAlm').value) || 0) / 100,

        poisonSaberBonus: document.getElementById('poisonSaberBonus').checked ? 0.015 : 0,
        poisonSaberBonusIII: (parseFloat(document.getElementById('poisonSaberBonusIII').value) || 0) / 100,

        sappingShotBonusIII: (parseFloat(document.getElementById('sappingShotBonusIII').value) || 0) / 100,

        doubleProfit: document.getElementById('doubleProfit').checked,

        pathfindersArrowBonusII: document.getElementById('pathfindersArrowBonusII').checked ? 0.08 : 0,
        pathfindersArrowBonusAlm: (parseFloat(document.getElementById('pathfindersArrowBonusAlm').value) || 0) / 100,

        firstStrike: document.getElementById('firstStrike').checked,
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

    const maxHealth = target.maxHealth;
    const currentHealth = target.currentHealth;

    const firstStrike = bonus.firstStrike;
    const firstStrikeBonus = firstStrike ? (0.008 * Math.floor((currentHealth / maxHealth) * 100 / 10)) : 0; 
    const firstStrikePenetration = (maxHealth === currentHealth && damageEffectType === 'instant') ? 0.05 : 0; 

    const totalPenetration = basePenetration + penetrationBonus + firstStrikePenetration;

    const targetDef = target.targetPhysicalDefence;

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

    const huntersMarkBonus = HuntersMark(bonus.huntersMarkLevel, bonus.huntersMarkCount);

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
            * (1 + firstStrikeBonus)
            * (1 + huntersMarkBonus);

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
        isTalent: false,
    });
}

function FatalShot(params){
    const damageLevels = [];

    const baseValues = [20, 40, 60, 80, 100];
    const percentageIncreases = [100.0, 103.0, 106.0, 109.0, 112.0];

    const physicalDamage = params.player.physicalDamage;

    const relicBonus = params.bonus.relicBonus;
    const unitedBonus = params.bonus.unitedAttackBonus;

    const fatalShotBonusII = params.bonus.fatalShotBonusII;
    const fatalShotBonusAlm = params.bonus.fatalShotBonusAlm;

    for (let level = 0; level < 5; level++) {
        const damage = (baseValues[level] + physicalDamage * (percentageIncreases[level] / 100 + fatalShotBonusII + fatalShotBonusAlm)) * (1 + relicBonus + unitedBonus);
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params, { });
}

function PoisonedArrow(params){
    const damageLevels = [];

    const percentageIncreases = [33.0, 45.0, 50.0, 62.0, 70.0];

    const physicalDamage = params.player.physicalDamage;

    const relicBonus = params.bonus.relicBonus;

    const poisonArrowBonusII = params.bonus.poisonArrowBonusII;
    const poisonArrowBonusAlm = params.bonus.poisonArrowBonusAlm;

    for (let level = 0; level < 5; level++) {
        const damage = physicalDamage * (percentageIncreases[level] / 100 + poisonArrowBonusII + poisonArrowBonusAlm) * (1 + relicBonus);
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params, {
        damageEffectType: 'dot',
    });
}

function PoisonousSaber(params){
    const damageLevels = [];

    const percentageIncreases = [35.0, 40.0, 45.0, 55.0];

    const physicalDamage = params.player.physicalDamage;

    const poisonSaberBonus = params.bonus.poisonSaberBonus;
    const poisonSaberBonusIII = params.bonus.poisonSaberBonusIII;

    for (let level = 0; level < 4; level++) {
        const damage = physicalDamage * (percentageIncreases[level] / 100 + poisonSaberBonus + poisonSaberBonusIII);
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params, {
        damageEffectType: 'dot',
    });
}

function SappingShot(params){
    const damageLevels = [];

    const percentageIncreases = [135.0, 145.0, 160.0, 180.0];

    const physicalDamage = params.player.physicalDamage;
    const cooldown = params.player.cooldown;

    const isPVP = params.target.isPVPTarget;

    const sappingShotBonusIII = params.bonus.sappingShotBonusIII

    let doubleProfitBonus = 0;
    if (params.bonus.doubleProfit) {
        if (isPVP) {
            doubleProfitBonus = cooldown * 0.5;
        } else {
            doubleProfitBonus = cooldown * 0.7;
        }
    }

    for (let level = 0; level < 4; level++) {
        const damage = physicalDamage * (percentageIncreases[level] / 100 + sappingShotBonusIII) * (1 + doubleProfitBonus);
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params, { });
}

function PathfindersShot(params){
    const damageLevels = [];

    const percentageIncreases = [125.0, 130.0, 140.0, 155.0];

    const physicalDamage = params.player.physicalDamage;

    const pathfindersArrowBonusII = params.bonus.pathfindersArrowBonusII;
    const pathfindersArrowBonusAlm = params.bonus.pathfindersArrowBonusAlm;

    for (let level = 0; level < 4; level++) {
        const damage = physicalDamage * (percentageIncreases[level] / 100 + pathfindersArrowBonusII + pathfindersArrowBonusAlm);
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params, { });
}

function ForestTrap(params){
    const damageLevels = [];

    const percentageIncreases = [75.0, 85.0, 95.0, 110.0];

    const physicalDamage = params.player.physicalDamage;

    for (let level = 0; level < 4; level++) {
        const damage = physicalDamage * (percentageIncreases[level] / 100);
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params, { });
}

function CobraBite(params){
    const damageLevels = [];

    const percentageIncrease = 0.20;
    
    const physicalDamage = params.player.physicalDamage;

    const damage = physicalDamage * percentageIncrease;
    damageLevels.push(damage);

    return calculateDamage(damageLevels, params, {
        isSkill: true,
        damageEffectType: 'dot',
        isTalent: false,
    });
}

function PoisonedTip(params){
    const damageLevels = [];

    const percentageIncrease = 0.33;

    const physicalDamage = params.player.physicalDamage;

    const damage = physicalDamage * percentageIncrease;
    damageLevels.push(damage);

    return calculateDamage(damageLevels, params, {
        isSkill: true,
        damageEffectType: 'dot',
        isTalent: false,
    });
}

function HuntersMark(level, count){

    var percentageIncreases = [2.0, 3.0, 4.0, 5.0];

    var huntersMarkBonus = document.getElementById('huntersMarkBonus').checked ? 0.5 : 0;

    var bonus = (count * (percentageIncreases[level - 1] + huntersMarkBonus)) / 100;

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
