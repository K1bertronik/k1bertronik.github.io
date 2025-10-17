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

      };
      
      const rowsMap = {
        autoattack: "autoattackRow",

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

        
    };
}

function calculateDamage(rawDamageLevels, params, options = {}) {
    const {
        isSkill = true,
        damageType = 'physical',
        isTalent = false,
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
            * (1 + skillPower);

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

function ThornOfDeath(physicalDamage){
    var damageLevels = [];
	
	var baseValues = [20, 40, 60, 80, 100];
    var percentageIncreases = [120.0, 125.0, 130.0, 135.0, 145.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var unitedBonus = (parseFloat(document.getElementById('unitedAttackBonus').value) || 0) / 100;

    var thornOfDeathBonus = (parseFloat(document.getElementById('thornOfDeathBonus').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        var damage = baseValues[level] + physicalDamage * (percentageIncreases[level] / 100 + thornOfDeathBonus) * (1 + relicBonus + unitedBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function ExhalationOfDarkness(magicalDamage){
    var damageLevels = [];
	
	var baseValues = [30, 55, 80, 105, 130];
    var percentageIncreases = [110.0, 120.0, 130.0, 145.0, 160.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var exhalationBonus = (parseFloat(document.getElementById('exhalationBonus').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        var damage = baseValues[level] + magicalDamage * (percentageIncreases[level] / 100 + exhalationBonus) * (1 + relicBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function SteelHurricane(physicalDamage, magicalDamage){
    var damageLevels = [];
	
    var percentagePhysIncreases = [105.0, 110.0, 120.0, 135.0];
	var percentageMagIncreases = [130.0, 140.0, 155.0, 175.0];
	
    var steelHurricanePhysBonus = (document.getElementById('steelHurricaneBonus').checked ? 0.05 : 0) + (document.getElementById('steelHurricaneBonusIII').checked ? 0.07 : 0);
	var steelHurricaneMagBonus = (document.getElementById('steelHurricaneBonus').checked ? 0.10 : 0) + (document.getElementById('steelHurricaneBonusI').checked ? 0.9 : 0) + (document.getElementById('steelHurricaneBonusIII').checked ? 0.9 : 0);
	
    for (var level = 0; level < 4; level++) {
        if (physicalDamage > magicalDamage) {
            var damage = physicalDamage * (percentagePhysIncreases[level] / 100 + steelHurricanePhysBonus);
        } else {
            var damage = magicalDamage * (percentageMagIncreases[level] / 100 + steelHurricaneMagBonus);
        }
        damageLevels.push(damage);
    }

    return damageLevels;
}

function EnjoyingBlood(skillLevels){
	var damageLevels = [];
    var healLevels = [];

    var percentageDamageIncrease = 0.25;
	var percentageHealIncrease = 0.60;

    for (var level = 0; level < 4; level++) {
        var damage = skillLevels[level] * percentageDamageIncrease;
		var heal = damage * percentageHealIncrease;
		
		damageLevels.push(parseFloat(damage.toFixed(2)));
		healLevels.push(parseFloat(heal.toFixed(2)));
    }

    return [damageLevels, healLevels];
}

function SharpShadow(magicalDamage, physicalDamage, health){
	var damageLevels = [];
    var healLevels = [];
	
	var percentagePhysIncreases = [50.0, 55.0, 65.0, 80.0];
	var percentageMagIncreases = [135.0, 145.0, 160.0, 180.0];
	var percentageHealIncreases = [7.0, 9.0, 11.0, 14.0];
	
	var sharpShadowBonus = document.getElementById('sharpShadowBonus').checked ? 0.02 : 0;
	
	for (var level = 0; level < 4; level++) {
        var damage = magicalDamage * (percentageMagIncreases[level] / 100) + physicalDamage * (percentagePhysIncreases[level] / 100);
		var heal = health * (percentageHealIncreases[level] / 100 + sharpShadowBonus);
		
		damageLevels.push(damage);
		healLevels.push(heal);
    }
	
	return [damageLevels, healLevels];
}

function KnightsCurse(magicalDamage, isForsaken = false){
    var damageLevels = [];
	
    var percentageIncreases = [55.0, 65.0, 75.0, 85.0];
	var percentageBoostIncreases = [10.0, 15.0, 20.0, 25.0]; 
	
    var knightsCurseBonus = (parseFloat(document.getElementById('knightsCurseBonus').value) || 0) / 100;

    for (var level = 0; level < 4; level++) {
        var damage = magicalDamage * (percentageIncreases[level] / 100 + knightsCurseBonus) * (1 + (isForsaken ? 0 : percentageBoostIncreases[level] / 100));
        damageLevels.push(damage);
    }

    return damageLevels;
}

function KnightsCurseExplode(physicalDamage){
    var damageLevels = [];
	
    var percentageIncreases = [100.0, 115.0, 135.0, 160.0];

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100);
        damageLevels.push(damage);
    }

    return damageLevels;
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
