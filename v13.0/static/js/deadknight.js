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
        thornOfDeath: ThornOfDeath(params),
        exhalationOfDarkness: ExhalationOfDarkness(params),
        steelHurricane: SteelHurricane(params),
        enjoyingBlood: EnjoyingBlood(SteelHurricane(params)),
        enjoyingBloodHeal: EnjoyingBloodHeal(EnjoyingBlood(SteelHurricane(params)), params),
        sharpShadow: SharpShadow(params),
        sharpShadowHeal: SharpShadowHeal(params),
        knightsCurse: KnightsCurse(params),
        knightsCurseExplode: KnightsCurseExplode(params),
      };
      
      const rowsMap = {
        autoattack: "autoattackRow",
        thornOfDeath: "thornOfDeathRow",
        exhalationOfDarkness: "exhalationOfDarknessRow",
        steelHurricane: "steelHurricaneRow",
        enjoyingBlood: "enjoyingBloodRow",
        enjoyingBloodHeal: "enjoyingBloodHealRow",
        sharpShadow: "sharpShadowRow",
        sharpShadowHeal: "sharpShadowHealRow",
        knightsCurse: "knightsCurseRow",
        knightsCurseExplode: "knightsCurseExplodeRow",
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

        steelHurricaneBonus: document.getElementById('steelHurricaneBonus').checked,
        steelHurricaneBonusI: document.getElementById('steelHurricaneBonusI').checked ? 0.09 : 0,
        steelHurricaneBonusIII: document.getElementById('steelHurricaneBonusIII').checked,
        steelHurricaneBonusAlm: (document.getElementById('steelHurricaneBonusAlm').value).split(','),

        exhalationBonusI: (parseFloat(document.getElementById('exhalationBonusI').value) || 0) / 100,

        thornOfDeathBonus: (parseFloat(document.getElementById('thornOfDeathBonus').value) || 0) / 100,
        thornOfDeathBonusAlm: (parseFloat(document.getElementById('thornOfDeathBonusAlm').value) || 0) / 100,

        sharpShadowBonusII: document.getElementById('sharpShadowBonusII').checked ? 0.02 : 0,

        knightsCurseBonusI: (parseFloat(document.getElementById('knightsCurseBonusI').value) || 0) / 100,

        screamBattleBonus: document.getElementById('screamBattleBonus').checked ? 0.08 : 0,
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

    const screamBattleBonus = (isSkill && !isPVP) ? bonus.screamBattleBonus : 0;

    for (let i = 0; i < rawDamageLevels.length; i++) {
        const base = rawDamageLevels[i];

        const total = base
            * (1 - targetReduction)
            * (1 + ferocity)
            * (1 - resilience)
            * (1 + pveBonusI)
            * (1 + pveBonusII)
            * (1 + skillPower)
            * (1 + screamBattleBonus);

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

function ThornOfDeath(params){
    const damageLevels = [];
	
	const baseValues = [20, 40, 60, 80, 100];
    const percentageIncreases = [120.0, 125.0, 130.0, 135.0, 145.0];

    const physicalDamage = params.player.physicalDamage;

    const relicBonus = params.bonus.relicBonus;
    const unitedBonus = params.bonus.unitedAttackBonus;

    const thornOfDeathBonus = params.bonus.thornOfDeathBonus;
    const thornOfDeathBonusAlm = params.bonus.thornOfDeathBonusAlm;

    for (let level = 0; level < 5; level++) {
        const damage = baseValues[level] + physicalDamage * (percentageIncreases[level] / 100 + thornOfDeathBonus + thornOfDeathBonusAlm) * (1 + relicBonus + unitedBonus);
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params, { });
}

function ExhalationOfDarkness(params){
    const damageLevels = [];
	
	const baseValues = [30, 55, 80, 105, 130];
    const percentageIncreases = [110.0, 120.0, 130.0, 145.0, 160.0];

    const magicalDamage = params.player.magicalDamage;

    const relicBonus = params.bonus.relicBonus;
    const exhalationBonusI = params.bonus.exhalationBonusI;

    for (let level = 0; level < 5; level++) {
        const damage = baseValues[level] + magicalDamage * (percentageIncreases[level] / 100 + exhalationBonusI) * (1 + relicBonus);
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params, {
        damageType: "magical",
    });
}

function SteelHurricane(params){
    const damageLevels = [];
	
    const percentagePhysIncreases = [105.0, 110.0, 120.0, 135.0];
	const percentageMagIncreases = [130.0, 140.0, 155.0, 175.0];

    const physicalDamage = params.player.physicalDamage;
    const magicalDamage = params.player.magicalDamage;

    const steelHurricaneBonus = params.bonus.steelHurricaneBonus ? [0.05, 0.1] : [0, 0];
    const steelHurricaneBonusI = params.bonus.steelHurricaneBonusI;
    const steelHurricaneBonusIII = params.bonus.steelHurricaneBonusIII ? [0.07, 0.09] : [0, 0];
    const steelHurricaneBonusAlm = params.bonus.steelHurricaneBonusAlm;
	
    for (let level = 0; level < 4; level++) {
        if (physicalDamage > magicalDamage) {
            var damage = physicalDamage * (percentagePhysIncreases[level] / 100 + steelHurricaneBonus[0] + steelHurricaneBonusIII[0] + parseFloat(steelHurricaneBonusAlm[0]) / 100);
            damageLevels.push(damage);
        } else {
            var damage = magicalDamage * (percentageMagIncreases[level] / 100 + steelHurricaneBonus[1] + steelHurricaneBonusI + steelHurricaneBonusIII[1] + parseFloat(steelHurricaneBonusAlm[1]) / 100);
            damageLevels.push(damage);
        }
    }

    if (physicalDamage > magicalDamage) {
        return calculateDamage(damageLevels, params, { });
    } else {
        return calculateDamage(damageLevels, params, {
            damageType: "magical",
        });
    }
}

function EnjoyingBlood(skillLevels){
	const damageLevels = [];

    const percentageDamageIncrease = 0.25;

    for (let level = 0; level < 4; level++) {
        const damage = skillLevels[level] * percentageDamageIncrease;
		
		damageLevels.push(parseFloat(damage.toFixed(2)));
    }

    return damageLevels;
}

function EnjoyingBloodHeal(skillLevels, params){
    const healLevels = [];
	const percentageHealIncrease = 0.60;

    for (let level = 0; level < 4; level++) {
		const heal = skillLevels[level] * percentageHealIncrease;

		healLevels.push(heal);
    }

    return calculateHeal(healLevels, params);
}

function SharpShadow(params){
	const damageLevels = [];
	
	const percentagePhysIncreases = [50.0, 55.0, 65.0, 80.0];
	const percentageMagIncreases = [135.0, 145.0, 160.0, 180.0];

    const physicalDamage = params.player.physicalDamage;
    const magicalDamage = params.player.magicalDamage;
	
	for (let level = 0; level < 4; level++) {
        const damage = magicalDamage * (percentageMagIncreases[level] / 100) + physicalDamage * (percentagePhysIncreases[level] / 100);
		
		damageLevels.push(damage);
    }
	
	return calculateDamage(damageLevels, params, {
        damageType: "magical",
    });
}

function SharpShadowHeal(params){
    const healLevels = [];

	const percentageHealIncreases = [7.0, 9.0, 11.0, 14.0];

    const health = params.player.health;
	
	const sharpShadowBonusII = params.bonus.sharpShadowBonusII;
	
	for (let level = 0; level < 4; level++) {
		const heal = health * (percentageHealIncreases[level] / 100) * (1 + sharpShadowBonusII);

		healLevels.push(heal);
    }
	
	return calculateHeal(healLevels, params);
}

function KnightsCurse(params){
    const damageLevels = [];
	
    const percentageIncreases = [55.0, 65.0, 75.0, 85.0];

    const magicalDamage = params.player.magicalDamage;
	
    const knightsCurseBonusI = params.bonus.knightsCurseBonusI;

    for (let level = 0; level < 4; level++) {
        const damage = magicalDamage * (percentageIncreases[level] / 100 + knightsCurseBonusI);
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params, {
        damageType: "magical",
    });
}

function KnightsCurseExplode(params){
    const damageLevels = [];
	
    const percentageIncreases = [100.0, 115.0, 135.0, 160.0];

    const physicalDamage = params.player.physicalDamage;

    for (let level = 0; level < 4; level++) {
        const damage = physicalDamage * (percentageIncreases[level] / 100);
        damageLevels.push(damage);
    }

    return calculateDamage(damageLevels, params, { });
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
