document.getElementById('calcForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var physicalDamage = parseFloat(document.getElementById('physdmg').value) || 0;
    var health = parseFloat(document.getElementById('health').value) || 0;
	var rage = parseFloat(document.getElementById('rage').value) || 0;
		
    var eviscerationDamage = calculateDamage(Evisceration(physicalDamage));
    var otherworldBoostDamage = calculateDamage(OtherworldBoost(physicalDamage), false);
    var annihilationDamage = calculateDamage(Annihilation(physicalDamage));
    var annihilationCritDamage = AnnihilationCrit(annihilationDamage, rage);
    var wideScopeDamage = WideScope(annihilationDamage);
	var underworldHandDamage = calculateDamage(UnderworldHand(physicalDamage));
	var explodionOfChaosDamage = calculateDamage(ExplodionOfChaos(physicalDamage, false));
	var devastatingFlashDamage = calculateDamage(ExplodionOfChaos(physicalDamage, true));
	
    updateDamageValues(eviscerationDamage, "eviscerationRow");
    updateDamageValues(otherworldBoostDamage, "otherworldBoostRow");
    updateDamageValues(annihilationDamage, "annihilationRow");
    updateDamageValues(annihilationCritDamage, "annihilationCritRow");
    updateDamageValues(wideScopeDamage, "widescopeRow");
    updateDamageValues(underworldHandDamage, "underworldHandRow");
    updateDamageValues(explodionOfChaosDamage, "explosionOfChaosRow");
    updateDamageValues(devastatingFlashDamage, "devastatingFlashRow");
});

function calculateDamage(skillDamageLevels, isInstantDamage=true) {
    var totalDamageLevels = [];
	
	var isPVPTarget = document.getElementById('pvpSwitch').checked;
	
    var penetration = (parseFloat(document.getElementById('penetration').value) || 0) / 100;
    var ferocity = (isPVPTarget ? (parseFloat(document.getElementById('ferocity').value) || 0) / 100 : 0);

    var targetPhysicalDefence = parseFloat(document.getElementById('targetPhysicalDefence').value) || 0;
    targetPhysicalDefence = targetPhysicalDefence / (targetPhysicalDefence + 6500);
    var targetPhysicalReduction = (penetration > targetPhysicalDefence) ? 0 : targetPhysicalDefence - penetration;
    var targetResilience = (isPVPTarget ? (parseFloat(document.getElementById('targetResilience').value) || 0) / 100 : 0);

    var talentDmgBonus = (isInstantDamage ? (parseFloat(document.getElementById('instDmgBonus').value) || 0) / 100 : (parseFloat(document.getElementById('dotDmgBonus').value) || 0) / 100);

    var talentPVEDmgBonusI = (isPVPTarget ? 0 : (parseFloat(document.getElementById('pveBonusI').value) || 0) / 100);
    var talentPVEDmgBonusII = (isPVPTarget ? 0 : (parseFloat(document.getElementById('pveBonusII').value) || 0) / 100);

    var castleDmg = (parseFloat(document.getElementById('castleDmg').value) || 0) / 100;

    for (var level = 0; level < skillDamageLevels.length; level++) {
        var skillDamage = skillDamageLevels[level];
        var totalDamage = skillDamage * (1 - targetPhysicalReduction) * (1 + talentDmgBonus + talentPVEDmgBonusI + talentPVEDmgBonusII) * (1 - targetResilience) * (1 + ferocity) * (1 + castleDmg);
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
    var eviscerationBonus = (document.getElementById('eviscerationBonus').checked ? 0.05 : 0);
	var eviscerationBonusII = (parseFloat(document.getElementById('eviscerationBonusII').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        var damage = (baseValues[level] + physicalDamage * (percentageIncreases[level] / 100 + eviscerationBonus + eviscerationBonusII)) * (1 + relicBonus);
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

function AnnihilationCrit(skillLevels, rage){
    var damageLevels = [];
	
	var isPVPTarget = document.getElementById('pvpSwitch').checked;
	
	var critBoost = (parseFloat(document.getElementById('critBoost').value) || 0) / 100;
	var targetResilience = (isPVPTarget ? (parseFloat(document.getElementById('targetResilience').value) || 0) / 100 : 0);
    var critBonusIncreases = [2.0, 2.5, 3.0, 3.5];
	
    for (var level = 0; level < 4; level++) {
		var damage = skillLevels[level] * ((isPVPTarget ? 1.5: 2) - targetResilience + critBoost + rage * (critBonusIncreases[level] / 100));
        damageLevels.push(parseFloat(damage.toFixed(2)));
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

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function ExplodionOfChaos(physicalDamage, isDevastating){
    var damageLevels = [];

    var percentageIncreases = [120.0, 125.0, 130.0, 140.0];
	
	var explodionBonus = (parseFloat(document.getElementById('explodionBonus').value) || 0) / 100;
	var devastatingFlashBonus = isDevastating ? 0.15 : 0;
    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100 + explodionBonus) * (1 + devastatingFlashBonus);
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