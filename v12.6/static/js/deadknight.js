document.getElementById('calcForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var physicalDamage = parseFloat(document.getElementById('physdmg').value) || 0;
    var magicalDamage = parseFloat(document.getElementById('magicdmg').value) || 0;
    var health = parseFloat(document.getElementById('health').value) || 0;
	
	var thornOfDeathDamage = calculateDamage(ThornOfDeath(physicalDamage), 'physical');
	var exhalationOfDarknessDamage = calculateDamage(ExhalationOfDarkness(magicalDamage), 'magical');
	var steelHurricaneDamage = calculateDamage(SteelHurricane(physicalDamage, magicalDamage), 'physical', false, false);
	var enjoyingBloodDamage = EnjoyingBlood(steelHurricaneDamage)[0];
	var enjoyingBloodHeal = calculateHeal(EnjoyingBlood(steelHurricaneDamage)[1]);
	var sharpShadowDamage = calculateDamage(SharpShadow(magicalDamage, physicalDamage, health)[0], 'magical', false, false);
	var sharpShadowHeal = calculateHeal(SharpShadow(magicalDamage, physicalDamage, health)[1]);
	var knightsCurseDamage = calculateDamage(KnightsCurse(magicalDamage), 'magical', false, false);
	var echoOfForsakenDamage = calculateDamage(KnightsCurse(magicalDamage, true), 'magical', false, false);
	
    updateDamageValues(thornOfDeathDamage, "thornOfDeathRow");
    updateDamageValues(exhalationOfDarknessDamage, "exhalationOfDarknessRow");
    updateDamageValues(steelHurricaneDamage, "steelHurricaneRow");
    updateDamageValues(enjoyingBloodDamage, "enjoyingBloodRow");
    updateDamageValues(enjoyingBloodHeal, "enjoyingBloodHealRow");
    updateDamageValues(sharpShadowDamage, "sharpShadowRow");
    updateDamageValues(sharpShadowHeal, "sharpShadowHealRow");
    updateDamageValues(knightsCurseDamage, "knightsCurseRow");
    updateDamageValues(echoOfForsakenDamage, "echoOfForsakenRow");
});

function calculateDamage(skillDamageLevels, damageType, isTalent=false, isBasicSkill=true) {
    var totalDamageLevels = [];

    var isPVPTarget = document.getElementById('pvpSwitch').checked;

    var penetration = (parseFloat(document.getElementById('penetration').value) || 0) / 100;
    var ferocity = (isPVPTarget ? (parseFloat(document.getElementById('ferocity').value) || 0) / 100 : 0);

    var targetPhysicalDefence = (parseFloat(document.getElementById('targetPhysicalDefencePercent').value) || 0) / 100;

    var targetMagicalDefence = (parseFloat(document.getElementById('targetMagicalDefencePercent').value) || 0) / 100;

    var targetPhysicalReduction = (penetration > targetPhysicalDefence) ? 0 : targetPhysicalDefence - penetration;

    var targetMagicalReduction = (penetration > targetMagicalDefence) ? 0 : targetMagicalDefence - penetration;

    var targetResilience = (isPVPTarget ? (parseFloat(document.getElementById('targetResilience').value) || 0) / 100 : 0);

    var talentPVEDmgBonusI = (isPVPTarget || isTalent ? 0 : (parseFloat(document.getElementById('pveBonusI').value) || 0) / 100);
    var talentPVEDmgBonusII = (isPVPTarget ? 0 : (parseFloat(document.getElementById('pveBonusII').value) || 0) / 100);

    var castleDmg = (parseFloat(document.getElementById('castleDmg').value) || 0) / 100;
    var exclusiveAttackBonus = (isBasicSkill ? (document.getElementById('exclusiveAttackBonus').checked ? 0.10 : 0) : 0);

    for (var level = 0; level < skillDamageLevels.length; level++) {
        var skillDamage = skillDamageLevels[level];
        var totalDamage = skillDamage * (damageType === 'physical' ? (1 - targetPhysicalReduction) : (1 - targetMagicalReduction)) * (1 + talentPVEDmgBonusI + talentPVEDmgBonusII) * (1 - targetResilience) * (1 + ferocity) * (1 + castleDmg + exclusiveAttackBonus);

        totalDamage = parseFloat(totalDamage.toFixed(2));

        totalDamageLevels.push(totalDamage);
    }

    return totalDamageLevels;
}

function calculateHeal(skillHealLevels) {
    var totalHealLevels = [];

    var castleHealBonus = (parseFloat(document.getElementById('castleHeal').value) || 0) / 100;
    var healPotBonus = (parseFloat(document.getElementById('healPot').value) || 0) / 100;

    for (var level = 0; level < skillHealLevels.length; level++) {
        var skillHeal = skillHealLevels[level];
        var totalHeal = skillHeal * (1 + castleHealBonus + healPotBonus);
        totalHeal = parseFloat(totalHeal.toFixed(2));

        totalHealLevels.push(totalHeal);
    }

    return totalHealLevels;
}

function ThornOfDeath(physicalDamage){
    var damageLevels = [];
	
	var baseValues = [20, 40, 60, 80, 100];
    var percentageIncreases = [115.0, 120.0, 125.0, 130.0, 135.0];

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
	
	var percentagePhysIncreases = [55.0, 65.0, 75.0, 90.0];
	var percentageMagIncreases = [125.0, 135.0, 145.0, 160.0];
	var percentageHealIncreases = [8.0, 10.0, 13.0, 16.0];
	
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
