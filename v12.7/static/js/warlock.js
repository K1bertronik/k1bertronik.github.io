document.getElementById('calcForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var magicalDamage = parseFloat(document.getElementById('magicdmg').value) || 0;
    var health = parseFloat(document.getElementById('health').value) || 0;
	var maxEnergy = parseFloat(document.getElementById('maxEnergy').value) || 0;
	var lostEnergy = parseFloat(document.getElementById('lostEnergy').value) || 0;
	
	var isPVPTarget = document.getElementById('pvpSwitch').checked;
	var energyLimit = (isPVPTarget ? 300 : 500);
	
    var arrowOfDarknessDamage = calculateDamage(ArrowOfDarkness(magicalDamage, maxEnergy, isPVPTarget, energyLimit), true, false, true);
	var drainingLifeDamage = calculateDamage(DrainingLife(magicalDamage), false, false, true);
	var drainingLifeHeal = calculateHeal(DrainingLifeHeal(drainingLifeDamage));
	var poolOfDarknessDamage = calculateDamage(PoolOfDarkness(magicalDamage, maxEnergy, isPVPTarget, energyLimit), false, false, true);
	var shadowSphereDamage = calculateDamage(ShadowSphere(magicalDamage, maxEnergy, isPVPTarget, energyLimit));
	var hexDamage = calculateDamage(Hex(magicalDamage), false);
	var stoneBodyHeal = calculateHeal(StoneBody(health, maxEnergy)[0]);
	var stoneBodyRegen = StoneBody(health, maxEnergy)[1];
	var underWorldFlameDamage = calculateDamage(UnderWorldFlame(magicalDamage), false, true);
	var twilightPactHeal = calculateHeal(TwilightPact(health, maxEnergy)[0]);
	var twilightPactRegen = TwilightPact(health, maxEnergy)[1];
    var singularityHeal = calculateHeal(Singularity(magicalDamage, lostEnergy, maxEnergy));
	
    updateDamageValues(arrowOfDarknessDamage, "arrowOfDarknessRow");
    updateDamageValues(drainingLifeDamage, "drainingLifeRow");
    updateDamageValues(drainingLifeHeal, "drainingLifeHealRow");
    updateDamageValues(poolOfDarknessDamage, "poolOfDarknessRow");
    updateDamageValues(shadowSphereDamage, "shadowSphereRow");
    updateDamageValues(hexDamage, "hexRow");
    updateDamageValues(stoneBodyHeal, "stoneBodyHealRow");
    updateDamageValues(stoneBodyRegen, "stoneBodyRegenRow");
    updateDamageValues(underWorldFlameDamage, "underworldFlameRow");
    updateDamageValues(twilightPactHeal, "twilightPactHealRow");
    updateDamageValues(twilightPactRegen, "twilightPactRegenRow");
    updateDamageValues(singularityHeal, "singularityRow");
});

function calculateDamage(skillDamageLevels, isInstantDamage=true, isTalent=false, isBasicSkill=false) {
    var totalDamageLevels = [];
	
	var isPVPTarget = document.getElementById('pvpSwitch').checked;
	
    var penetration = (parseFloat(document.getElementById('penetration').value) || 0) / 100;
    var ferocity = (isPVPTarget ? (parseFloat(document.getElementById('ferocity').value) || 0) / 100 : 0);

    var targetMagicalDefence = (parseFloat(document.getElementById('targetMagicalDefencePercent').value) || 0) / 100;

    var targetResilience = (isPVPTarget ? (parseFloat(document.getElementById('targetResilience').value) || 0) / 100 : 0);

    var talentDmgBonus = (isInstantDamage ? (parseFloat(document.getElementById('instDmgBonus').value) || 0) / 100 : (parseFloat(document.getElementById('dotDmgBonus').value) || 0) / 100);

    var talentPVEDmgBonusI = (isPVPTarget || isTalent ? 0 : (parseFloat(document.getElementById('pveBonusI').value) || 0) / 100);
    var talentPVEDmgBonusII = (isPVPTarget ? 0 : (parseFloat(document.getElementById('pveBonusII').value) || 0) / 100);

    var dotPenBonus = (isInstantDamage ? 0 : (parseFloat(document.getElementById('dotPenBonus').value) || 0) / 100);
    var instPenBonus = (!isInstantDamage ? 0 : (parseFloat(document.getElementById('instPenBonus').value) || 0) / 100);

    var castleDmg = (parseFloat(document.getElementById('castleDmg').value) || 0) / 100;
    var exclusiveAttackBonus = (isBasicSkill ? (document.getElementById('exclusiveAttackBonus').checked ? 0.10 : 0) : 0);

    for (var level = 0; level < skillDamageLevels.length; level++) {
        var skillDamage = skillDamageLevels[level];
        var totalDamage = skillDamage * (1 - Math.max(0, targetMagicalDefence - (penetration + dotPenBonus + instPenBonus))) * (1 + talentDmgBonus + talentPVEDmgBonusI + talentPVEDmgBonusII) * (1 - targetResilience) * (1 + ferocity) * (1 + castleDmg + exclusiveAttackBonus);
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

function ArrowOfDarkness(magicalDamage, energy, isPVPTarget, energyLimit){
    var damageLevels = [];

    var baseValues = [30, 55, 80, 105, 130];
    var percentageIncreases = [110.0, 115.0, 120.0, 125.0, 130.0];
	
    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var unitedBonus = (parseFloat(document.getElementById('unitedAttackBonus').value) || 0) / 100;

    var arrowBonus = (document.getElementById('arrowBonus').checked ? 0.05 : 0);
	var arrowBonusI = (parseFloat(document.getElementById('arrowBonusI').value) || 0) / 100;
    var arrowBonusAlm = (parseFloat(document.getElementById('arrowBonusAlm').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
		if (isPVPTarget) {
			var damage = (baseValues[level] + magicalDamage * (percentageIncreases[level] / 100 + arrowBonus + arrowBonusI + arrowBonusAlm)) * (energy < energyLimit ? (1 + ((energy / 5) / 100)) : (2.6 - (900 / (energy - 300 + 900)))) * (1 + relicBonus + unitedBonus);
		} else {
			var damage = (baseValues[level] + magicalDamage * (percentageIncreases[level] / 100 + arrowBonus + arrowBonusI + arrowBonusAlm)) * (energy < energyLimit ? (1 + ((energy / 5) / 100)) : (3 - (500 / (energy - 500 + 500)))) * (1 + relicBonus + unitedBonus);
		}
        damageLevels.push(damage);
    }

    return damageLevels;
}

function DrainingLife(magicalDamage){
    var damageLevels = [];

    var percentageIncreases = [30.0, 35.0, 40.0, 45.0, 50.0];
	
    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
	var drawingLifeBonus = (parseFloat(document.getElementById('drainingLifeBonus').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
		var damage = magicalDamage * (percentageIncreases[level] / 100 + drawingLifeBonus) * (1 + relicBonus);
		damageLevels.push(damage);
	}

    return damageLevels;
}

function DrainingLifeHeal(damageLevels){
    var healLevels = [];

    var percentageIncreases = [50.0, 60.0, 70.0, 85.0, 100.0];

    for (var level = 0; level < 5; level++) {
        var heal = damageLevels[level] * (percentageIncreases[level] / 100);
        healLevels.push(heal);
    }

    return healLevels;
}

function PoolOfDarkness(magicalDamage, energy, isPVPTarget, energyLimit){
    var damageLevels = [];

    var acidicSteps = document.getElementById('acidicSteps').checked;
	
    var percentageIncreases = [15.0, 20.0, 25.0, 30.0, 35.0];
	
    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var poolBonus = (parseFloat(document.getElementById('poolBonus').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
		if (acidicSteps) {
			if (isPVPTarget) {
			var damage = (magicalDamage * (percentageIncreases[level] / 100 + poolBonus) * 0.7) * (energy < energyLimit ? (1 + ((energy / 5) / 100)) : (2.6 - (900 / (energy - 300 + 900)))) * (1 + relicBonus);
			} else {
				var damage = (magicalDamage * (percentageIncreases[level] / 100 + poolBonus) * 0.7) * (energy < energyLimit ? (1 + ((energy / 5) / 100)) : (3 - (500 / (energy - 500 + 500)))) * (1 + relicBonus);
			}
		} else {
			var damage = magicalDamage * (percentageIncreases[level] / 100 + poolBonus) * (1 + relicBonus)
		}
        damageLevels.push(damage);
    }

    return damageLevels;
}

function ShadowSphere(magicalDamage, energy, isPVPTarget, energyLimit){
    var damageLevels = [];
	
    var percentageIncreases = [135.0, 150.0, 165.0, 185.0];
	
    var shadowSphereBonus = (document.getElementById('shadowSphereBonus').checked ? 0.1 : 0);
    var shadowSphereBonusAlm = (parseFloat(document.getElementById('shadowSphereBonusAlm').value) || 0) / 100;

    for (var level = 0; level < 4; level++) {
		if (isPVPTarget) {
			var damage = (magicalDamage * (percentageIncreases[level] / 100 + shadowSphereBonus + shadowSphereBonusAlm)) * (energy < energyLimit ? (1 + ((energy / 5) / 100)) : (2.6 - (900 / (energy - 300 + 900))));
		} else {
			var damage = (magicalDamage * (percentageIncreases[level] / 100 + shadowSphereBonus + shadowSphereBonusAlm)) * (energy < energyLimit ? (1 + ((energy / 5) / 100)) : (3 - (500 / (energy - 500 + 500))));
		}
        damageLevels.push(damage);
    }

    return damageLevels;
}

function Hex(magicalDamage){
    var damageLevels = [];

    var percentageIncreases = [60.0, 65.0, 70.0, 80.0];

    for (var level = 0; level < 4; level++) {
		var damage = magicalDamage * (percentageIncreases[level] / 100);
		damageLevels.push(damage);
	}

    return damageLevels;
}

function StoneBody(health, energy){
    var healLevels = [];
	var regenLevels = [];

    var percentageHealthIncreases = [9.0, 11.0, 13.0, 18.0];
	var percentageEnergyIncreases = [16.0, 18.0, 21.0, 24.0];
	
	var stoneBodyBonus = (parseFloat(document.getElementById('stoneBodyBonus').value) || 0) / 100;

    for (var level = 0; level < 4; level++) {
        var heal = health * (percentageHealthIncreases[level] / 100 + stoneBodyBonus);
		var energyRegen = energy * (percentageEnergyIncreases[level] / 100 + stoneBodyBonus);
        healLevels.push(heal);
		regenLevels.push(parseFloat(energyRegen.toFixed()));
    }

    return [healLevels, regenLevels];
}

function UnderWorldFlame(magicalDamage){
    var damageLevels = [];

    var percentageIncrease = 0.4;

	var damage = magicalDamage * percentageIncrease;
	
	damageLevels.push(damage);

    return damageLevels;
}

function TwilightPact(health, energy){
    var healLevels = [];
	var regenLevels = [];

    var percentageHealthIncrease = 4;
	var percentageEnergyIncrease = 6;

    var heal = health * (percentageHealthIncrease / 100);
	var energyRegen = energy * (percentageEnergyIncrease / 100);
	
    healLevels.push(heal);
	regenLevels.push(parseFloat(energyRegen.toFixed()));

    return [healLevels, regenLevels];
}

function Singularity(magicalDamage, lostEnergy, maxEnergy){
    var healLevels = [];

    var percentageIncrease = 0.05;

    var reductionFactor = (maxEnergy / 200) * 0.1;

    const effectiveEnergyFactor = 1 - reductionFactor;
    if (effectiveEnergyFactor < 0) effectiveEnergyFactor = 0;

    var adjustedEnergySpent = lostEnergy * effectiveEnergyFactor;

    var heal = (adjustedEnergySpent / 15) * (magicalDamage * percentageIncrease);
    
    healLevels.push(heal);

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
