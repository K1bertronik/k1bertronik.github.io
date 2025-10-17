document.getElementById('calcForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var magicalDamage = parseFloat(document.getElementById('magicdmg').value) || 0;
    var health = parseFloat(document.getElementById('health').value) || 0;

    var isPyromaniac = document.getElementById('isPyromaniac').checked;

    var fireBallDamage = calculateDamage(FireBall(magicalDamage), true, isPyromaniac);
    var timeWarpDamage = calculateDamage(TimeWarp(magicalDamage));
    var shatteredStoneDamage = calculateDamage(ShatteredStone(magicalDamage));
    var blazingGroundDamage = calculateDamage(BlazingGround(magicalDamage), false, false, false, false);
    var frostboltDamage = calculateDamage(Frostbolt(magicalDamage), true, isPyromaniac, false, false);
    var overloadDamage = calculateDamage(Overload(magicalDamage), false, false, false, false);
    var sheafOfLightningHeal = calculateHeal(SheafOfLightning(overloadDamage));
    var roaringFlameDamage = calculateDamage(RoaringFlame(magicalDamage), true, isPyromaniac, false, false);
    var auraOfFireDamage = calculateDamage(AuraOfFire(magicalDamage), false, isPyromaniac, false, false);

    updateDamageValues(fireBallDamage, "fireBallRow");
    updateDamageValues(timeWarpDamage, "tiweWarpRow");
    updateDamageValues(shatteredStoneDamage, "shatteredStoneRow");
    updateDamageValues(blazingGroundDamage, "blazingGroundRow");
    updateDamageValues(frostboltDamage, "frostboltRow");
    updateDamageValues(overloadDamage, "overloadRow");
    updateDamageValues(sheafOfLightningHeal, "sheafOfLightningRow");
    updateDamageValues(roaringFlameDamage, "roaringFlameRow");
    updateDamageValues(auraOfFireDamage, "auraOfFireRow");
});

function calculateDamage(skillDamageLevels, isInstantDamage=true, isPyromaniac=false, isTalent=false, isBasicSkill=true) {
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

    var excessEnergyBonus = document.getElementById('excessEnergyBonus').checked ? 0.12 : 0;
    var natureBonus = (isInstantDamage ? (document.getElementById('natureBonus').checked ? 0.10 : 0) : 0);

    for (var level = 0; level < skillDamageLevels.length; level++) {
        var skillDamage = skillDamageLevels[level];
        var totalDamage = skillDamage * (1 - Math.max(0, targetMagicalDefence - (penetration + dotPenBonus + instPenBonus))) * (1 + talentDmgBonus + talentPVEDmgBonusI + talentPVEDmgBonusII + excessEnergyBonus + natureBonus) * (1 - targetResilience) * (1 + ferocity) * (1 + castleDmg + exclusiveAttackBonus);
        if (isPyromaniac) {
            var critBoost = (parseFloat(document.getElementById('critBoost').value) || 0) / 100;
            totalDamage = totalDamage * ((isPVPTarget ? 1.5: 2) + critBoost + 0.5);
        }

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


function FireBall(magicalDamage){
    var damageLevels = [];

    var baseValues = [30, 55, 80, 105, 130];
    var percentageIncreases = [130.0, 140.0, 150.0, 160.0, 170.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var unitedBonus = (parseFloat(document.getElementById('unitedAttackBonus').value) || 0) / 100;

    var fireBallBonus = document.getElementById('fireBallBonus').checked ? 0.05 : 0;
    var fireBallBonusI = (parseFloat(document.getElementById('fireBallBonusI').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        var damage = (baseValues[level] + magicalDamage * (percentageIncreases[level] / 100 + fireBallBonus + fireBallBonusI)) * (1 + relicBonus + unitedBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function TimeWarp(magicalDamage){
    var damageLevels = [];

    var percentageIncreases = [115.0, 120.0, 125.0, 135.0, 145.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var timeWarpBonus = (parseFloat(document.getElementById('timeWarpBonus').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
		var damage = magicalDamage * (percentageIncreases[level] / 100 + timeWarpBonus) * (1 + relicBonus);
		damageLevels.push(damage);
	}

    return damageLevels;
}

function ShatteredStone(magicalDamage){
    var damageLevels = [];

    var percentageIncreases = [110.0, 115.0, 120.0, 130.0, 140.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var shatteredStoneBonus = document.getElementById('shatteredStoneBonus').checked ? 0.07 : 0;

    for (var level = 0; level < 5; level++) {
		var damage = magicalDamage * (percentageIncreases[level] / 100 + shatteredStoneBonus) * (1 + relicBonus);
		damageLevels.push(damage);
	}

    return damageLevels;
}

function BlazingGround(magicalDamage){
    var damageLevels = [];

    var percentageIncreases = [15.0, 20.0, 25.0, 30.0];

    var blazingGroundBonus = document.getElementById('blazingGroundBonus').checked ? 0.02 : 0;

    for (var level = 0; level < 4; level++) {
		var damage = magicalDamage * (percentageIncreases[level] / 100 + blazingGroundBonus);
		damageLevels.push(damage);
	}

    return damageLevels;
}

function Frostbolt(magicalDamage){
    var damageLevels = [];

    var percentageIncreases = [135.0, 145.0, 160.0, 180.0];

    var frostboltBonus = document.getElementById('frostboltBonus').checked ? 0.05 : 0;
    var magmaBoulderBonus = document.getElementById('magmaBoulderBonus').checked ? 0.15 : 0;

    for (var level = 0; level < 4; level++) {
		var damage = magicalDamage * (percentageIncreases[level] / 100 + frostboltBonus) * (1 + magmaBoulderBonus);
		damageLevels.push(damage);
	}

    return damageLevels;
}

function Overload(magicalDamage){
    var damageLevels = [];

    var percentageIncreases = [30.0, 40.0, 50.0, 60.0];

    var overloadBonus = (parseFloat(document.getElementById('overloadBonus').value) || 0) / 100;

    for (var level = 0; level < 4; level++) {
		var damage = magicalDamage * (percentageIncreases[level] / 100 + overloadBonus);
		damageLevels.push(damage);
	}

    return damageLevels;
}

function RoaringFlame(magicalDamage){
    var damageLevels = [];

    var percentageIncreases = [100.0, 110.0, 120.0, 135.0];

    for (var level = 0; level < 4; level++) {
		var damage = magicalDamage * (percentageIncreases[level] / 100);
		damageLevels.push(damage);
	}

    return damageLevels;
}

function AuraOfFire(magicalDamage){
    var damageLevels = [];

    var percentageIncreases = [25.0, 30.0, 35.0, 40.0];

    var auraOfFireBonus = (parseFloat(document.getElementById('auraOfFireBonus').value) || 0) / 100;

    for (var level = 0; level < 4; level++) {
		var damage = magicalDamage * (percentageIncreases[level] / 100 + auraOfFireBonus);
		damageLevels.push(damage);
	}

    return damageLevels;
}

function SheafOfLightning(skillLevels){
    var healLevels = [];

    var percentageIncrease = 0.65;

    for (var level = 0; level < 4; level++) {
		var heal = skillLevels[level] * percentageIncrease;
		healLevels.push(heal);
	}

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
