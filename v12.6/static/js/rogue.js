document.getElementById('calcForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var physicalDamage = parseFloat(document.getElementById('physdmg').value) || 0;
    var health = parseFloat(document.getElementById('health').value) || 0;

    var mercilessStrikeDamage = calculateDamage(MercilessStrike(physicalDamage), true, true);
    var elusiveJumpDamage = calculateDamage(ElusiveJump(physicalDamage));
    var elusiveJumpWithPoisonDamage = ElusiveJumpWithPoison(elusiveJumpDamage);
    var poisonousBladesDamage = calculateDamage(PoisonousBlades(physicalDamage), false);
    var ricochetDamage = calculateDamage(Ricochet(physicalDamage));
    var sinisterStrikeDamage = calculateDamage(SinisterStrike(physicalDamage));
    var flurryOfSteelDamage = calculateDamage(FlurryOfSteel(physicalDamage));
    var bladeShardDamage = BladeShard(flurryOfSteelDamage);
    var trickiestTechDamage = calculateDamage(TrickiestTech(physicalDamage));
    var trickiestTechWithPoisonDamage = calculateDamage(TrickiestTechWithPoison(physicalDamage));
    var trickiestTechHeal = calculateHeal(TrickiestTechHeal(health));

    updateDamageValues(mercilessStrikeDamage, "mercilessStrikeRow");
    updateDamageValues(elusiveJumpDamage, "elusiveJumpRow");
    updateDamageValues(elusiveJumpWithPoisonDamage, "elusiveJumpWithPoisonRow");
    updateDamageValues(poisonousBladesDamage, "poisonousBladesRow");
    updateDamageValues(ricochetDamage, "ricochetRow");
    updateDamageValues(sinisterStrikeDamage, "sinisterStrikeRow");
    updateDamageValues(flurryOfSteelDamage, "flurryOfSteelRow");
    updateDamageValues(bladeShardDamage, "bladeShardRow");
    updateDamageValues(trickiestTechDamage, "trickiestTechRow");
    updateDamageValues(trickiestTechWithPoisonDamage, "trickiestTechWithPoisonRow");
    updateDamageValues(trickiestTechHeal, "trickiestTechWithPoisonHealRow");
});

function calculateDamage(skillDamageLevels, isInstantDamage=true, isBasicSkill=false) {
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

    var bladeEchoBonus = (isInstantDamage ? (parseFloat(document.getElementById('bladeEchoBonus').value) || 0) / 100 : 0);
    var seriesBonus = (isInstantDamage ? (parseFloat(document.getElementById('seriesBonus').value) || 0) / 100 : 0);

    var castleDmg = (parseFloat(document.getElementById('castleDmg').value) || 0) / 100;
    var exclusiveAttackBonus = (isBasicSkill ? (document.getElementById('exclusiveAttackBonus').checked ? 0.10 : 0) : 0);

    for (var level = 0; level < skillDamageLevels.length; level++) {
        var skillDamage = skillDamageLevels[level];
        var totalDamage = skillDamage * (1 - Math.max(0, targetPhysicalDefence - (penetration + dotPenBonus + instPenBonus))) * (1 + talentDmgBonus + talentPVEDmgBonusI + talentPVEDmgBonusII + bladeEchoBonus + seriesBonus) * (1 - targetResilience) * (1 + ferocity) * (1 + castleDmg + exclusiveAttackBonus);
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

function MercilessStrike(physicalDamage){
    var damageLevels = [];

    var baseValues = [20, 40, 60, 80, 100];
    var percentageIncreases = [140.0, 145.0, 150.0, 155.0, 160.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var unitedBonus = (parseFloat(document.getElementById('unitedAttackBonus').value) || 0) / 100;

    var strikeBonus = (document.getElementById('strikeBonus').checked ? 0.05 : 0) + (document.getElementById('strikeBonusIII').checked ? 0.08 : 0);

    for (var level = 0; level < 5; level++) {
        var damage = (baseValues[level] + physicalDamage * (percentageIncreases[level] / 100 + strikeBonus)) * (1 + relicBonus + unitedBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function ElusiveJump(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [115.0, 120.0, 130.0, 140.0];

    var jumpBonus = (parseFloat(document.getElementById('jumpBonus').value) || 0) / 100;

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100 + jumpBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function ElusiveJumpWithPoison(jumpDamage){
    var damageLevels = [];

    var percentageIncreases = [105.0, 110.0, 120.0, 140.0];

    for (var level = 0; level < 4; level++) {
        var damage = jumpDamage[level] * (percentageIncreases[level] / 100);
        damage = parseFloat(damage.toFixed(2));

        damageLevels.push(damage);
    }

    return damageLevels;
}

function PoisonousBlades(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [30.0, 35.0, 40.0, 50.0];

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function Ricochet(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [75.0, 80.0, 85.0, 95.0];

    var ricochetBonus = document.getElementById('ricochetBonus').checked ? 0.05 : 0;
    
    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100 + ricochetBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function SinisterStrike(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [130.0, 135.0, 145.0, 160.0];

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function FlurryOfSteel(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [115.0, 120.0, 135.0, 150.0];

    var flurryBonus = document.getElementById('flurryBonus').checked ? 0.07 : 0;
    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100 + flurryBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function BladeShard(flurryDamage){
    var damageLevels = [];

    var percentageIncrease = 60;

    for (var level = 0; level < 4; level++) {
        var damage = flurryDamage[level] * (percentageIncrease / 100);
        damage = parseFloat(damage.toFixed(2));

        damageLevels.push(damage);
    }

    return damageLevels;
}

function TrickiestTech(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [110.0, 115.0, 120.0, 125.0];

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function TrickiestTechWithPoison(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [120.0, 130.0, 140.0, 155.0];

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function TrickiestTechHeal(health){
    var healLevels = [];

    var percentageIncreases = [8.0, 10.0, 12.0, 15.0];

    for (var level = 0; level < 4; level++) {
        var heal = health * (percentageIncreases[level] / 100);
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
