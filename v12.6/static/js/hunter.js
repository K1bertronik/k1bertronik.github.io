document.getElementById('calcForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var physicalDamage = parseFloat(document.getElementById('physdmg').value) || 0;
    var health = parseFloat(document.getElementById('health').value) || 0;
    var skillCoolDown = parseFloat(document.getElementById('cooldown').value) || 0;

    var fatalShotDamage = calculateDamage(FatalShot(physicalDamage));
    var poisonedArrowDamage = calculateDamage(PoisonedArrow(physicalDamage), false);
    var poisonousSaberDamage = calculateDamage(PoisonousSaber(physicalDamage), false, false, false);
    var sappingShotDamage = calculateDamage(SappingShot(physicalDamage), true, false, false);
    var pathfindersShotDamage = calculateDamage(PathfindersShot(physicalDamage), true, false, false);
    var forestTrapDamage = calculateDamage(ForestTrap(physicalDamage), true, false, false);
    var cobraBiteDamage = calculateDamage(CobraBite(physicalDamage), false, true, false);
    var poisonedTipDamage = calculateDamage(PoisonedTip(physicalDamage), false, true, false);

    updateDamageValues(fatalShotDamage, "fatalShotRow");
    updateDamageValues(poisonedArrowDamage, "poisonedArrowRow");
    updateDamageValues(poisonousSaberDamage, "poisonSaberRow");
    updateDamageValues(sappingShotDamage, "sappingShotRow");
    updateDamageValues(pathfindersShotDamage, "pathfindersArrowRow");
    updateDamageValues(forestTrapDamage, "trapRow");
    updateDamageValues(cobraBiteDamage, "cobraBiteRow");
    updateDamageValues(poisonedTipDamage, "poisonedTipRow");

});

function calculateDamage(skillDamageLevels, isInstantDamage=true, isTalent=false, isBasicSkill=true) {
    var totalDamageLevels = [];

    var isPVPTarget = document.getElementById('pvpSwitch').checked;

    var penetration = (parseFloat(document.getElementById('penetration').value) || 0) / 100;
    var ferocity = (isPVPTarget ? (parseFloat(document.getElementById('ferocity').value) || 0) / 100 : 0);

    var targetPhysicalDefence = (parseFloat(document.getElementById('targetPhysicalDefencePercent').value) || 0) / 100;

    var targetResilience = (isPVPTarget ? (parseFloat(document.getElementById('targetResilience').value) || 0) / 100 : 0);

    var talentDmgBonus = (isInstantDamage ? (parseFloat(document.getElementById('instDmgBonus').value) || 0) / 100 : (parseFloat(document.getElementById('dotDmgBonus').value) || 0) / 100);

    var talentPVEDmgBonusI = (isPVPTarget || isTalent ? 0 : (parseFloat(document.getElementById('pveBonusI').value) || 0) / 100);
    var talentPVEDmgBonusII = (isPVPTarget ? 0 : (parseFloat(document.getElementById('pveBonusII').value) || 0) / 100);

    var dotPenBonus = (isInstantDamage ? 0 : (parseFloat(document.getElementById('dotPenBonus').value) || 0) / 100);
    var instPenBonus = (!isInstantDamage ? 0 : (parseFloat(document.getElementById('instPenBonus').value) || 0) / 100);

    var castleDmg = (parseFloat(document.getElementById('castleDmg').value) || 0) / 100;
    var exclusiveAttackBonus = (isBasicSkill ? (document.getElementById('exclusiveAttackBonus').checked ? 0.10 : 0) : 0);

    var huntersMarkBonus = HuntersMark((parseFloat(document.getElementById('huntersMarkLevel').value) || 0), (parseFloat(document.getElementById('huntersMarkCount').value) || 0));

    for (var level = 0; level < skillDamageLevels.length; level++) {
        var skillDamage = skillDamageLevels[level];
        var totalDamage = skillDamage * (1 - Math.max(0, targetPhysicalDefence - (penetration + dotPenBonus + instPenBonus))) * (1 + talentDmgBonus + talentPVEDmgBonusI + talentPVEDmgBonusII) * (1 - targetResilience) * (1 + ferocity) * (1 + castleDmg + exclusiveAttackBonus) * (1 + huntersMarkBonus);
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

function FatalShot(physicalDamage){
    var damageLevels = [];

    var baseValues = [20, 40, 60, 80, 100];
    var percentageIncreases = [100.0, 103.0, 106.0, 109.0, 112.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var unitedBonus = (parseFloat(document.getElementById('unitedAttackBonus').value) || 0) / 100;

    var fatalShotBonus = (parseFloat(document.getElementById('fatalShotBonus').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        var damage = (baseValues[level] + physicalDamage * (percentageIncreases[level] / 100 + fatalShotBonus)) * (1 + relicBonus + unitedBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function PoisonedArrow(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [33.0, 45.0, 50.0, 62.0, 70.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var poisonArrowBonus = (parseFloat(document.getElementById('poisonArrowBonus').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100 + poisonArrowBonus) * (1 + relicBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function PoisonousSaber(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [35.0, 40.0, 45.0, 55.0];

    var poisonSaberBonus = document.getElementById('poisonSaberBonus').checked ? 0.015 : 0;
    var poisonSaberBonusIII = (parseFloat(document.getElementById('poisonSaberBonusIII').value) || 0) / 100;

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100 + poisonSaberBonus + poisonSaberBonusIII);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function SappingShot(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [135.0, 145.0, 160.0, 180.0];

    var sappingShotBonus = (parseFloat(document.getElementById('sappingShotBonus').value) || 0) / 100;
    var isdoubleProfit = document.getElementById('doubleProfit').checked;
    var doubleProfitBonus = (isdoubleProfit ? (parseFloat(document.getElementById('cooldown').value) || 0) / 100 : 0)

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100 + sappingShotBonus + doubleProfitBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function PathfindersShot(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [125.0, 130.0, 140.0, 155.0];

    var pathfindersArrowBonus = document.getElementById('pathfindersArrowBonus').checked ? 0.08 : 0;

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100 + pathfindersArrowBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function ForestTrap(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [60.0, 65.0, 70.0, 80.0];

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function CobraBite(physicalDamage){
    var damageLevels = [];

    var percentageIncrease = 20;

        var damage = physicalDamage * (percentageIncrease / 100);
        damageLevels.push(damage);

    return damageLevels;
}

function PoisonedTip(physicalDamage){
    var damageLevels = [];

    var percentageIncrease = 33;

        var damage = physicalDamage * (percentageIncrease / 100);
        damageLevels.push(damage);

    return damageLevels;
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
