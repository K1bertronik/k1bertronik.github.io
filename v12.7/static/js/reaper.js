document.getElementById('calcForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var physicalDamage = parseFloat(document.getElementById('physdmg').value) || 0;
    var health = parseFloat(document.getElementById('health').value) || 0;
		
    var eviscerationDamage = calculateDamage(Evisceration(physicalDamage), true, true);
    var otherworldBoostDamage = calculateDamage(OtherworldBoost(physicalDamage), false, true);
    var annihilationDamage = calculateDamage(Annihilation(physicalDamage));
    var annihilationCritDamage = calculateDamage(Annihilation(physicalDamage), true, false, true);
    var wideScopeDamage = WideScope(annihilationDamage);
    var wideScopeCritDamage = WideScope(annihilationCritDamage);
	var underworldHandDamage = calculateDamage(UnderworldHand(physicalDamage));
	var explosionOfChaosDamage = calculateDamage(ExplosionOfChaos(physicalDamage)[0]);
	var explosionOfChaosDemonDamage = calculateDamage(ExplosionOfChaos(physicalDamage)[0], true, false, false, ExplosionOfChaos(physicalDamage)[1]);
	
    updateDamageValues(eviscerationDamage, "eviscerationRow");
    updateDamageValues(otherworldBoostDamage, "otherworldBoostRow");
    updateDamageValues(annihilationDamage, "annihilationRow");
    updateDamageValues(annihilationCritDamage, "annihilationCritRow");
    updateDamageValues(wideScopeDamage, "widescopeRow");
    updateDamageValues(wideScopeCritDamage, "widescopeCritRow");
    updateDamageValues(underworldHandDamage, "underworldHandRow");
    updateDamageValues(explosionOfChaosDamage, "explosionOfChaosRow");
    updateDamageValues(explosionOfChaosDemonDamage, "explosionOfChaosDemonRow");
});

function calculateDamage(skillDamageLevels, isInstantDamage=true, isBasicSkill=false, isCritical=false, bonusPenetration=[]) {
    var totalDamageLevels = [];
	
	var isPVPTarget = document.getElementById('pvpSwitch').checked;
	
    var penetration = (parseFloat(document.getElementById('penetration').value) || 0) / 100;
    var ferocity = (isPVPTarget ? (parseFloat(document.getElementById('ferocity').value) || 0) / 100 : 0);

    var targetPhysicalDefence = (parseFloat(document.getElementById('targetPhysicalDefencePercent').value) || 0) / 100;

    var targetResilience = (isPVPTarget ? (parseFloat(document.getElementById('targetResilience').value) || 0) / 100 : 0);

    var talentDmgBonus = (isInstantDamage ? (parseFloat(document.getElementById('instDmgBonus').value) || 0) / 100 : (parseFloat(document.getElementById('dotDmgBonus').value) || 0) / 100);

    var talentPVEDmgBonusI = (isPVPTarget ? 0 : (parseFloat(document.getElementById('pveBonusI').value) || 0) / 100);
    var talentPVEDmgBonusII = (isPVPTarget ? 0 : (parseFloat(document.getElementById('pveBonusII').value) || 0) / 100);

    var dotPenBonus = (isInstantDamage ? 0 : (parseFloat(document.getElementById('dotPenBonus').value) || 0) / 100);
    var instPenBonus = (!isInstantDamage ? 0 : (parseFloat(document.getElementById('instPenBonus').value) || 0) / 100);

    var castleDmg = (parseFloat(document.getElementById('castleDmg').value) || 0) / 100;
    var exclusiveAttackBonus = (isBasicSkill ? (document.getElementById('exclusiveAttackBonus').checked ? 0.10 : 0) : 0);

    var bloodBathBonus = isInstantDamage ? (parseFloat(document.getElementById('bloodBathBonus').value) || 0) / 100 : 0;

    for (var level = 0; level < skillDamageLevels.length; level++) {
        var skillDamage = skillDamageLevels[level];
        var bonusPenetrationValue = bonusPenetration.length > level ? (bonusPenetration[level] / 100) : 0;
        var totalDamage = skillDamage * (1 - Math.max(0, targetPhysicalDefence - (penetration + dotPenBonus + instPenBonus + bonusPenetrationValue))) * (1 + talentDmgBonus + talentPVEDmgBonusI + talentPVEDmgBonusII) * (1 - targetResilience) * (1 + ferocity) * (1 + castleDmg + exclusiveAttackBonus) * (1 + bloodBathBonus);
        if (isCritical) {
            var critBoost = (parseFloat(document.getElementById('critBoost').value) || 0) / 100;
            var rage = parseFloat(document.getElementById('rage').value) || 0;
            var critBonusIncreases = [2.0, 2.5, 3.0, 3.5];
            totalDamage = totalDamage * ((isPVPTarget ? 1.5: 2) - targetResilience + critBoost + rage * (critBonusIncreases[level] / 100));
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

function Evisceration(physicalDamage){
    var damageLevels = [];

    var baseValues = [20, 40, 60, 80, 100];
    var percentageIncreases = [115.0, 120.0, 125.0, 130.0, 140.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var unitedBonus = (parseFloat(document.getElementById('unitedAttackBonus').value) || 0) / 100;

    var eviscerationBonus = (document.getElementById('eviscerationBonus').checked ? 0.05 : 0);
	var eviscerationBonusII = (parseFloat(document.getElementById('eviscerationBonusII').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        var damage = (baseValues[level] + physicalDamage * (percentageIncreases[level] / 100 + eviscerationBonus + eviscerationBonusII)) * (1 + relicBonus + unitedBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function OtherworldBoost(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [25.0, 30.0, 35.0, 40.0, 45.0];

    for (var level = 0; level < 5; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function Annihilation(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [120.0, 145.0, 170.0, 200.0];
	
	var annihilationBonus = (parseFloat(document.getElementById('annihilationBonus').value) || 0) / 100;

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100 + annihilationBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function WideScope(skillLevels){
    var damageLevels = [];

    var percentageIncrease = 0.65;

    for (var level = 0; level < 4; level++) {
        var damage = skillLevels[level] * percentageIncrease;
        damageLevels.push(parseFloat(damage.toFixed(2))); 
    }

    return damageLevels;
}

function UnderworldHand(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [55.0, 65.0, 75.0, 90.0];

    var underworldHandBonusAlm = (parseFloat(document.getElementById('underworldHandBonusAlm').value) || 0) / 100;

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100 + underworldHandBonusAlm);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function ExplosionOfChaos(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [130.0, 135.0, 145.0, 160.0];
    var penetrationBonus = [4.0, 6.0, 8.0, 10.0];
	
	var explodionBonus = (parseFloat(document.getElementById('explodionBonus').value) || 0) / 100;
    var explodionBonusAlm = (parseFloat(document.getElementById('explodionBonusAlm').value) || 0) / 100;

	var devastatingFlashBonus = (document.getElementById('devastatingFlashBonus').checked ? 0.2 : 0);

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100 + explodionBonus + explodionBonusAlm) * (1 + devastatingFlashBonus);
        damageLevels.push(damage);
    }

    return [damageLevels, penetrationBonus];
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
