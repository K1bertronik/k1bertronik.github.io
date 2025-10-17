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
        poisonSpittle: PoisonSpittle(params),
        poisonSpittleDot: PoisonSpittleDot(params),
        boneShield: BoneShield(params),
        ancientSeal: AncientSeal(params),
        soulSynergy: SoulSynergy(params),
        poisonShield: PoisonShield(params),
        poisonShieldHeal: PoisonShieldHeal(PoisonShield(params), params),
        infection: Infection(params),
        infectionMass: InfectionMass(params),
        acidRain: AcidRain(params),
        pleasureOfPain: PleasureOfPain(params),
        deadWill: DeadWill(params),
      };
      
      const rowsMap = {
        autoattack: "autoattackRow",
        poisonSpittle: "poisonSpittleRow",
        poisonSpittleDot: "poisonSpittleDotRow",
        boneShield: "boneShieldRow",
        ancientSeal: "ancientSealRow",
        soulSynergy: "soulSynergyRow",
        poisonShield: "poisonShieldRow",
        poisonShieldHeal: "poisonShieldHealRow",
        infection: "infectionRow",
        infectionMass: "infectionMassRow",
        acidRain: "acidRainRow",
        pleasureOfPain: "pleasureOfPainRow",
        deadWill: "deadWillRow",
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


        pveBonusI: (parseFloat(document.getElementById('pveBonusI').value) || 0) / 100,
        pveBonusII: (parseFloat(document.getElementById('pveBonusII').value) || 0) / 100,

        healBonus: (parseFloat(document.getElementById('healBonus').value) || 0) / 100,

        boneShieldBonus: document.getElementById('boneShieldBonus').checked ? 0.10 : 0,
        boneShieldBonusAlm: (parseFloat(document.getElementById('boneShieldBonusAlm').value) || 0) / 100,

        infectionBonus: document.getElementById('boneShieldBonus').checked ? 0.02 : 0,
        infectionBonusAlm: (parseFloat(document.getElementById('infectionBonusAlm').value) || 0) / 100,

        poisonShieldBonusI: (parseFloat(document.getElementById('poisonShieldBonusI').value) || 0) / 100,
        poisonShieldBonusIII: document.getElementById('poisonShieldBonusIII').checked ? 0.03 : 0,
        poisonShieldBonusAlm: (parseFloat(document.getElementById('poisonShieldBonusAlm').value) || 0) / 100,

        poisonSpitBonus: (parseFloat(document.getElementById('poisonSpitBonus').value) || 0) / 100,

        ancientSealBonus: (parseFloat(document.getElementById('ancientSealBonus').value) || 0) / 100,
        ancientSealBonusAlm: (parseFloat(document.getElementById('ancientSealBonusAlm').value) || 0) / 100,

        acidRainBonus: (parseFloat(document.getElementById('acidRainBonus').value) || 0) / 100,

        bondsBonusAlm: document.getElementById('bondsBonusAlm').checked ? 0.08 : 0,
    };
}

function calculateDamage(rawDamageLevels, params, options = {}) {
    const {
        isSkill = true,
        isTalent = false,
    } = options;

    const { player, target, bonus } = params;

    const totalDamageLevels = [];

    const penetration = player.penetration;
    const targetDef = target.targetMagicalDefence;
    const targetReduction = (penetration > targetDef) ? 0 : targetDef - penetration;

    const isPVP = target.isPVPTarget;
    const resilience = isPVP ? target.targetResilience : 0;
    const ferocity = isPVP ? player.ferocity : 0;

    const skillPower = isSkill ? player.skillPower : 0;

    const pveBonusI = (isSkill && !isPVP && !isTalent) ? bonus.pveBonusI : 0;
    const pveBonusII = !isPVP ? bonus.pveBonusII : 0;

    const bondsBonusAlm = bonus.bondsBonusAlm;

    for (let i = 0; i < rawDamageLevels.length; i++) {
        const base = rawDamageLevels[i];

        const total = base
            * (1 - targetReduction)
            * (1 + ferocity)
            * (1 - resilience)
            * (1 + pveBonusI)
            * (1 + pveBonusII)
            * (1 + skillPower)
            * (1 + bondsBonusAlm);

        totalDamageLevels.push(parseFloat(total.toFixed(2)));
    }

    return totalDamageLevels;
}

function calculateHeal(skillHealLevels, params) {

    const totalHealLevels = [];

    const castleHealBonus = params.bonus.castleHeal;
    const healPotBonus = params.bonus.potHeal;

    const healBonus = params.bonus.healBonus;
    const bondsBonusAlm = params.bonus.bondsBonusAlm;

    for (let level = 0; level < skillHealLevels.length; level++) {
        const skillHeal = skillHealLevels[level];
        const totalHeal = skillHeal * (1 + castleHealBonus + healPotBonus + healBonus + bondsBonusAlm);
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

function PoisonSpittle(params){
    const damageLevels = [];

    const baseValues = [30, 55, 80, 105, 130];
    const percentageIncreases = [110.0, 115.0, 120.0, 125.0, 130.0];

    const magicalDamage = params.player.magicalDamage;

    const relicBonus = params.bonus.relicBonus;
    const unitedBonus = params.bonus.unitedAttackBonus;

    const poisonSpitBonus = params.bonus.poisonSpitBonus;

    for (let level = 0; level < 5; level++) {
        const damage = (baseValues[level] + magicalDamage * (percentageIncreases[level] / 100 + poisonSpitBonus)) * (1 + relicBonus + unitedBonus);
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params, { });
}

function PoisonSpittleDot(params){
    const damageLevels = [];

    const baseValues = [10, 18, 26, 35, 45];
    const percentageIncreases = [20.0, 25.0, 30.0, 35.0, 40.0];

    const magicalDamage = params.player.magicalDamage;

    const relicBonus = params.bonus.relicBonus;
    const unitedBonus = params.bonus.unitedAttackBonus;

    for (let level = 0; level < 5; level++) {
        const damage = (baseValues[level] + magicalDamage * (percentageIncreases[level] / 100)) * (1 + relicBonus + unitedBonus);
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params, { });
}

function BoneShield(params){
    const shieldLevels = [];

    const baseValues = [30, 60, 90, 120, 150];
    const percentageIncreases = [90.0, 100.0, 115.0, 130.0, 150.0];

    const magicalDamage = params.player.magicalDamage;

    const boneShieldBonus = params.bonus.boneShieldBonus;
    const boneShieldBonusAlm = params.bonus.boneShieldBonusAlm;

    for (let level = 0; level < 5; level++) {
        const shield = baseValues[level] + magicalDamage * (percentageIncreases[level] / 100 + boneShieldBonus + boneShieldBonusAlm);
        shieldLevels.push(parseFloat(shield.toFixed(2)));
    }

    return shieldLevels;
}

function AncientSeal(params){
    const healLevels = [];

    const baseValues = [30, 55, 80, 105, 130];
    const percentageIncreases = [115.0, 120.0, 130.0, 140.0, 155.0];

    const magicalDamage = params.player.magicalDamage;

    const ancientSealBonus = params.bonus.ancientSealBonus;
    const ancientSealBonusAlm = params.bonus.ancientSealBonusAlm;

    for (let level = 0; level < 5; level++) {
        const heal = (baseValues[level] + magicalDamage * (percentageIncreases[level] / 100 + ancientSealBonus + ancientSealBonusAlm));
        healLevels.push(heal);
    }

    return calculateHeal(healLevels, params);
}

function SoulSynergy(params){
    const healLevels = [];

    const baseValues = [30, 55, 80, 105, 130];
    const percentageIncreases = [115.0, 120.0, 130.0, 140.0, 155.0];

    const magicalDamage = params.player.magicalDamage;

    const ancientSealBonus = params.bonus.ancientSealBonus;
    const ancientSealBonusAlm = params.bonus.ancientSealBonusAlm;

    for (let level = 0; level < 5; level++) {
        const heal = (baseValues[level] + magicalDamage * (percentageIncreases[level] / 100 + ancientSealBonus + ancientSealBonusAlm)) * 0.4;
        healLevels.push(parseFloat(heal.toFixed(2)));
    }

    return healLevels;
}

function PoisonShield(params){
    const damageLevels = [];

    const percentageIncreases = [25.0, 30.0, 35.0, 40.0];

    const magicalDamage = params.player.magicalDamage;

    const poisonShieldBonusI = params.bonus.poisonShieldBonusI;
    const poisonShieldBonusIII = params.bonus.poisonShieldBonusIII;
    const poisonShieldBonusAlm = params.bonus.poisonShieldBonusAlm;

    for (let level = 0; level < 4; level++) {
        const damage = magicalDamage * (percentageIncreases[level] / 100 + poisonShieldBonusI + poisonShieldBonusIII + poisonShieldBonusAlm);
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params);
}

function PoisonShieldHeal(damageLevels, params){
    const healLevels = [];

    const percentageIncreases = [80.0, 90.0, 100.0, 110.0];

    for (let level = 0; level < 4; level++) {
        const heal = damageLevels[level] * (percentageIncreases[level] / 100);
        healLevels.push(heal);
    }

    return calculateHeal(healLevels, params);
}

function Infection(params){
    const damageLevels = [];

    const percentageIncreases = [135.0, 145.0, 160.0, 180.0];
    const percentageBoost = [12.0, 14.0, 16.0, 20.0];

    const magicalDamage = params.player.magicalDamage;

    const infectionBonus = params.bonus.infectionBonus;
    const infectionBonusAlm = params.bonus.infectionBonusAlm;

    for (let level = 0; level < 4; level++) {
        const damage = magicalDamage * (percentageIncreases[level] / 100) * (1 + percentageBoost[level] / 100 + infectionBonus + infectionBonusAlm);
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params);
}

function InfectionMass(params){
    const damageLevels = [];

    const percentageIncreases = [135.0, 145.0, 160.0, 180.0];

    const magicalDamage = params.player.magicalDamage;

    for (let level = 0; level < 4; level++) {
        const damage = magicalDamage * (percentageIncreases[level] / 100);
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params);
}

function AcidRain(params){
    const damageLevels = [];

    const percentageIncreases = [30.0, 35.0, 40.0, 45.0];

    const magicalDamage = params.player.magicalDamage;

    const acidRainBonus = params.bonus.acidRainBonus;

    for (let level = 0; level < 4; level++) {
        const damage = magicalDamage * (percentageIncreases[level] / 100 + acidRainBonus);
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params);
}

function PleasureOfPain(params){
    const damageLevels = [];

    const percentageIncrease = 0.3;

    const magicalDamage = params.player.magicalDamage;

    const damage = magicalDamage * percentageIncrease;
    damageLevels.push(damage);

    return calculateDamage(damageLevels, params, {
        isSkill: false,
        isTalent: true
    });
}

function DeadWill(params){
    const healLevels = [];

    const percentageIncrease = 0.05;

    const health = params.player.health;

    const heal = health * percentageIncrease;
    healLevels.push(parseFloat(heal.toFixed(2)));

    return healLevels;
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
